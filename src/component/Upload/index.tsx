import React from 'react';
import { Upload, Modal } from 'antd';
import { debounce } from 'lodash';
import { getToken } from '@/service/upload';
import { UploadFile, UploadChangeParam, RcFile } from 'antd/es/upload/interface';
import { PlusOutlined } from '@ant-design/icons';

function getBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

class PicturesWall extends React.Component<
  {
    value: string[] | string;
    max: number;
    tip: string;
    onChange: (value: string | string[]) => void;
  },
  {
    previewVisible: boolean;
    previewImage: string | undefined;
    fileList: UploadFile[];
  }
> {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };

  uploadHost: string = '';
  uploadCdn: string = '';
  uploadToken: string = '';
  uploadKey: string = '';

  destroy: boolean = false;

  componentDidMount() {
    const { value } = this.props;
    if (value) {
      let fileList: UploadFile[] = [];
      if (Array.isArray(value)) {
        fileList = value.map(url => ({ uid: url, url, status: 'done' } as UploadFile));
      }

      if (typeof value === 'string') {
        fileList = [{ uid: value, url: value, status: 'done' } as UploadFile];
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
    let fileList: string[] = [...this.state.fileList]
      .filter((it: UploadFile) => it.status === 'done')
      .map((it: UploadFile) =>
        it.response ? `${this.uploadCdn}${it.response.key}` : (it.url as string),
      );

    const { max = 1 } = this.props;
    fileList = fileList.filter((item, index) => index < max);
    if (this.props.onChange && this.destroy !== true) {
      this.props.onChange(max === 1 ? (fileList[0] as string) : fileList);
    }
  }, 1000);

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = (info: UploadChangeParam) => {
    let { fileList } = info;
    const { max = 1 } = this.props;
    fileList = [...fileList].filter((item, index) => index < max);
    this.setState({ fileList }, this.save);
  };

  beforeUpload = async (file: RcFile): Promise<void> => {
    let fileName = file.name.lastIndexOf('.'); //取到文件名开始到最后一个点的长度
    let fileNameLength = file.name.length; //取到文件名长度
    let fileFormat = file.name.substring(fileName + 1, fileNameLength); //截
    const { data } = await getToken();
    this.uploadHost = data.host;
    this.uploadCdn = data.cdn;
    this.uploadToken = data.token;
    this.uploadKey = `upload/${file.uid}_${(Math.random() * 99999999).toFixed(0)}.${fileFormat}`;
  };

  render() {
    const { max = 1, tip = '上传图片' } = this.props;
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
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
