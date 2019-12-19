import React, { Component } from 'react';
import { message, Button, Popconfirm } from 'antd';
import BraftEditor from 'braft-editor';
import { debounce } from 'lodash';
import { getToken, upload } from '@/service/upload';

import 'braft-editor/dist/index.css';

class RichEditor extends Component {
  state = {
    editorState: BraftEditor.createEditorState(null),
    html: '',
  };

  componentDidMount() {
    this.setState({
      editorState: BraftEditor.createEditorState(this.props.value),
    });
  }

  uploadFn = async param => {
    try {
      const file = param.file;
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
      const result = await upload(uploadHost, file, uploadKey, uploadToken, param.progress);
      if (result.key) {
        param.success({
          url: `${uploadCdn}${result.key}`,
        });
      }
    } catch (e) {
      param.error(e.message);
      message.error(e.message);
    }
  };

  componentWillUnmount() {
    this.destroy = true;
  }

  save = debounce(() => {
    const htmlString = this.state.editorState.toHTML();
    this.props.onChange && this.destroy !== true && this.props.onChange(htmlString);
  }, 1000);

  handleEditorChange = editorState => {
    this.setState({ editorState }, this.save);
  };

  render() {
    const { editorState } = this.state;

    return (
      <div>
        <BraftEditor
          value={editorState}
          onChange={this.handleEditorChange}
          media={{ uploadFn: this.uploadFn }}
          accepts={{
            video: false,
            audio: false,
          }}
          style={{ border: '1px solid #eeeeee' }}
        />
        <div>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              localStorage.RichEditor = this.state.editorState.toHTML();
              message.success('保存草稿成功');
            }}
          >
            保存草稿
          </Button>
          &nbsp;
          <Popconfirm
            placement="top"
            title="恢复草稿，您现在编辑的内容将会消失，确认这样操作吗？"
            onConfirm={() => {
              if (localStorage.RichEditor) {
                this.setState({
                  editorState: BraftEditor.createEditorState(localStorage.RichEditor),
                });
              }
            }}
            okText="是的"
            cancelText="不了"
          >
            <Button type="primary" size="small">
              恢复草稿
            </Button>
          </Popconfirm>
        </div>
      </div>
    );
  }
}

export default RichEditor;
