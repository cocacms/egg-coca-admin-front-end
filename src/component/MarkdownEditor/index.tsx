import React, { Component } from 'react';
import Editor from 'for-editor';
import { getToken, upload } from '@/service/upload';
import { message } from 'antd';

export default class extends Component<{
  value: string;
  onChange: any;
}> {
  vm: React.RefObject<Editor> = React.createRef();

  addImg = async (file: File) => {
    let fileName = file.name.lastIndexOf('.'); //取到文件名开始到最后一个点的长度
    let fileNameLength = file.name.length; //取到文件名长度
    let fileFormat = file.name.substring(fileName + 1, fileNameLength); //截
    const { data } = await getToken();
    const uploadKey = `upload/${file.lastModified}_${(Math.random() * 9999999).toFixed(
      0,
    )}.${fileFormat}`;

    const uploadHost = data.host;
    const uploadCdn = data.cdn;
    const uploadToken = data.token;
    const result = await upload(uploadHost, file, uploadKey, uploadToken);
    if (result.key) {
      this.vm.current?.$img2Url(file.name, `${uploadCdn}${result.key}`);
    }
  };

  render() {
    const { value, onChange } = this.props;
    return (
      <Editor
        addImg={this.addImg}
        ref={this.vm}
        value={value}
        onChange={onChange}
        subfield
        preview
      />
    );
  }
}
