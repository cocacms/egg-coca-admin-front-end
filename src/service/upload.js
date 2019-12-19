import axios from '@/util/axios';

const api = '/backend';

export const getToken = async () => {
  return await axios.post(`${api}/upload`);
};

export const upload = async (host, file, key, token, progress) => {
  let formData = new FormData();
  formData.append('key', key);
  formData.append('file', file);
  formData.append('token', token);

  const { data: resultData } = await axios.post(host, formData, {
    onUploadProgress: function(progressEvent) {
      //原生获取上传进度的事件
      if (progressEvent.lengthComputable && typeof progress === 'function') {
        //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
        //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
        progress((progressEvent.loaded / progressEvent.total) * 100);
      }
    },
  });

  return resultData;
};

export const parse = async file => {
  let formData = new FormData();
  formData.append('file', file);
  return await axios.post(`${api}/parse`, formData);
};
