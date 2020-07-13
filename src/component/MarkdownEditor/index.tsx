import React, { useState } from 'react';
import Editor from 'for-editor';
import { Spin } from 'antd';

import { useControllableValue } from 'ahooks';
import { getToken, upload } from '@/service/upload';

const MarkdownEditor: React.FC = (props) => {
  const [value, onChange] = useControllableValue(props);

  const [uploading, setUploading] = useState(false);

  const vm: React.RefObject<Editor> = React.createRef();
  const addImg = async (file: File) => {
    setUploading(true);
    try {
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
        vm.current?.$img2Url(file.name, `${uploadCdn}${result.key}`);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <Spin tip="正在上传图片..." spinning={uploading}>
      <Editor
        addImg={addImg}
        ref={vm}
        value={value}
        onChange={onChange}
        toolbar={{
          h1: true, // h1
          h2: true, // h2
          h3: true, // h3
          h4: true, // h4
          img: true, // 图片
          link: true, // 链接
          code: true, // 代码块
          preview: true, // 预览
          expand: true, // 全屏
          /* v0.0.9 */
          undo: true, // 撤销
          redo: true, // 重做
          save: false, // 保存
          /* v0.2.3 */
          subfield: true, // 单双栏模式
        }}
        subfield
        preview
      />
    </Spin>
  );
};

export default MarkdownEditor;
