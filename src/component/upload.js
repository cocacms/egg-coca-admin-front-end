import React from 'react';
import { Upload, Icon, Modal } from 'antd';
import { debounce } from 'lodash';
import { getToken } from '@/service/upload';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };

  uploadHost = '';
  uploadCdn = '';
  uploadToken = '';
  uploadKey = '';

  componentDidMount() {
    const { value } = this.props;
    if (value) {
      let fileList = [];
      if (Array.isArray(value)) {
        fileList = this.props.value.map(url => ({ uid: url, url, status: 'done' }));
      }

      if (typeof value === 'string') {
        fileList = [{ uid: value, url: value, status: 'done' }];
      }

      this.setState({
        fileList,
      });
    }
  }

  componentWillUnmount() {
    this.destroy = true;
  }

  save = debounce(() => {
    let fileList = this.state.fileList
      .filter(it => it.status === 'done')
      .map(it => (it.response ? `${this.uploadCdn}${it.response.key}` : it.url));

    const { max = 1 } = this.props;
    fileList = fileList.filter((item, index) => index < max);
    if (this.props.onChange && this.destroy !== true) {
      this.props.onChange(max === 1 ? fileList[0] : fileList);
    }
  }, 1000);

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => {
    const { max = 1 } = this.props;
    fileList = fileList.filter((item, index) => index < max);
    this.setState({ fileList }, this.save);
  };

  beforeUpload = async file => {
    let fileName = file.name.lastIndexOf('.'); //取到文件名开始到最后一个点的长度
    let fileNameLength = file.name.length; //取到文件名长度
    let fileFormat = file.name.substring(fileName + 1, fileNameLength); //截

    const { data } = await getToken();

    this.uploadHost = data.host;
    this.uploadCdn = data.cdn;
    this.uploadToken = data.token;
    this.uploadKey = `upload/${file.uid}_${parseInt(Math.random() * 1000000)}.${fileFormat}`;

    return file;
  };

  render() {
    const { max = 1, tip = '上传图片' } = this.props;
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">{tip}</div>
      </div>
    );

    return (
      <div className="clearfix">
        <Upload
          {...this.props}
          data={() => ({
            key: this.uploadKey,
            token: this.uploadToken,
          })}
          beforeUpload={this.beforeUpload}
          action={() => this.uploadHost}
          headers={{
            Accept: 'application/json',
          }}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          multiple={max > 1}
          onChange={this.handleChange}
        >
          {fileList.length >= max ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default PicturesWall;
