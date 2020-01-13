import React, { Component } from 'react';
import { Upload, Icon, Spin, message, Button, Tooltip } from 'antd';
import { getToken, upload } from '@/service/upload';

import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  min-height: 300px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 12px;
  background: #fff;
  font-size: 14px;
  display: flex;
  flex-direction: column;
`;

const Toolbar = styled.div`
  padding: 0 6px;
  border-bottom: 1px solid #ddd;
  color: #555;
  user-select: none;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  height: 44px;
  display: flex;
  align-items: center;
  padding: 12px;
  > div {
    display: flex;
    align-items: center;
  }
  img {
    height: 16px;
    width: 16px;
    margin-right: 12px;
  }
`;

const MathTarget = styled.div`
  flex-grow: 1;
  padding: 6px;
  font-size: 16px;
`;

/**
 * 含MathType的数学编辑器
 *  如使用，请取消 /pages/document.ejs 与 /service-worker.js中的注释
 */
class RichEditor extends Component {
  key = '';

  state = {
    loading: false,
  };
  constructor() {
    super();
    this.key = `_key_${new Date().valueOf()}`;
  }

  componentWillUnmount() {
    document
      .getElementById(`${this.key}_matheditor_target_`)
      .removeEventListener('paste', this.onPaste);

    if (this.genericIntegrationInstance && this.genericIntegrationInstance.core) {
      const modal = this.genericIntegrationInstance.core.getModalDialog();
      if (modal && modal.container) {
        modal.container.remove();
      }

      if (modal && modal.overlay) {
        modal.overlay.remove();
      }
    }
  }

  componentDidMount() {
    var genericIntegrationProperties = {};

    genericIntegrationProperties.target = document.getElementById(`${this.key}_matheditor_target_`);
    genericIntegrationProperties.toolbar = document.getElementById(
      `${this.key}_matheditor_toolbar_`,
    );

    // GenericIntegration instance.
    this.genericIntegrationInstance = new window.WirisPlugin.GenericIntegration(
      genericIntegrationProperties,
    );
    this.genericIntegrationInstance.init();

    this.genericIntegrationInstance.listeners.fire('onTargetReady', {});
    this.genericIntegrationInstance.core.addListener(
      new window.WirisPlugin.Listeners.newListener('onAfterFormulaInsertion', this.onChange),
    );

    document
      .getElementById(`${this.key}_matheditor_target_`)
      .addEventListener('paste', this.onPaste);
  }

  onPaste = e => {
    var cbd = e.clipboardData;
    var ua = window.navigator.userAgent;
    // 如果是 Safari 直接 return
    if (!(e.clipboardData && e.clipboardData.items)) {
      return;
    }

    // Mac平台下Chrome49版本以下 复制Finder中的文件的Bug Hack掉
    if (
      cbd.items &&
      cbd.items.length === 2 &&
      cbd.items[0].kind === 'string' &&
      cbd.items[1].kind === 'file' &&
      cbd.types &&
      cbd.types.length === 2 &&
      cbd.types[0] === 'text/plain' &&
      cbd.types[1] === 'Files' &&
      ua.match(/Macintosh/i) &&
      Number(ua.match(/Chrome\/(\d{2})/i)[1]) < 49
    ) {
      return;
    }

    for (const item of cbd.items) {
      if (item.kind === 'file' && item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file.size === 0) {
          return;
        }

        this.uploadImg(file);
      }
    }
  };

  onChange = () => {
    const value = document.getElementById(`${this.key}_matheditor_target_`).innerHTML;
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };

  uploadImg = async file => {
    this.setState({ loading: true });
    this.focus();
    try {
      let fileName = file.name.lastIndexOf('.'); //取到文件名开始到最后一个点的长度
      let fileNameLength = file.name.length; //取到文件名长度
      let fileFormat = file.name.substring(fileName + 1, fileNameLength); //截

      const { data } = await getToken();
      const uploadKey = `upload/${file.lastModified}_${parseInt(
        Math.random() * 1000000,
      )}.${fileFormat}`;

      const uploadHost = data.host;
      const uploadCdn = data.cdn;
      const uploadToken = data.token;
      const result = await upload(uploadHost, file, uploadKey, uploadToken);
      const url = `${uploadCdn}${result.key}`;
      this.insertHtmlAtCaret(
        `<img alt="" style="max-width: 250px; max-height: 250px;" src="${url}" />`,
      );
      this.onChange();
    } catch (e) {
      message.error(e.message);
    } finally {
      this.setState({ loading: false });
    }
  };

  insertHtmlAtCaret = html => {
    if (!window.getSelection) {
      return message.error('请升级浏览器');
    }

    // IE9 and non-IE
    const sel = window.getSelection();
    let range;

    if (sel.getRangeAt && sel.rangeCount) {
      range = sel.getRangeAt(0);
      if (
        !document
          .getElementById(`${this.key}_matheditor_target_`)
          .contains(range.commonAncestorContainer)
      ) {
        return;
      }

      range.deleteContents();
      // Range.createContextualFragment() would be useful here but is
      // non-standard and not supported in all browsers (IE9, for one)
      var el = document.createElement('div');
      el.innerHTML = html;
      var frag = document.createDocumentFragment(),
        node,
        lastNode;
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node);
      }
      range.insertNode(frag);
      // Preserve the selection
      if (lastNode) {
        range = range.cloneRange();
        range.setStartAfter(lastNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  };

  focus = () => {
    this.input.focus();
  };

  getDefaultValue = () => {
    if (this.props['data-__meta'] && this.props['data-__meta'].initialValue) {
      return this.props['data-__meta'].initialValue;
    }

    return '';
  };

  insertSpace = () => {
    this.insertHtmlAtCaret('____');
    this.onChange();
  };

  render() {
    return (
      <Spin spinning={this.state.loading} tip="上传中...">
        <Container>
          <Toolbar>
            <div id={`${this.key}_matheditor_toolbar_`} />

            <Upload accept="image/*" action={this.uploadImg} showUploadList={false}>
              <Tooltip placement="topLeft" title="上传图片 (可在编辑框直接粘贴截图)">
                <Icon type="upload" style={{ color: '#000', fontSize: 16, cursor: 'pointer' }} />
              </Tooltip>
            </Upload>

            <Tooltip placement="topLeft" title="插入填空题占位符">
              <Button
                style={{ marginLeft: 12, color: '#000', fontSize: 16 }}
                size="small"
                type="link"
                onClick={this.insertSpace}
                icon="border-bottom"
              />
            </Tooltip>

            {this.props.onSave && (
              <Button
                style={{ marginLeft: 12 }}
                size="small"
                type="link"
                onClick={this.props.onSave}
              >
                保存
              </Button>
            )}
          </Toolbar>

          <MathTarget
            ref={node => (this.input = node)}
            id={`${this.key}_matheditor_target_`}
            contentEditable="true"
            suppressContentEditableWarning="true"
            onInput={this.onChange}
            dangerouslySetInnerHTML={{ __html: this.getDefaultValue() }}
          />
        </Container>
      </Spin>
    );
  }
}

export default RichEditor;
