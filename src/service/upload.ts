import axios from '@/util/axios';

const api = '/backend';

export const getToken = async (): Promise<any> => {
  return await axios.post(`${api}/upload`);
};

export const upload = async (
  host: string,
  file: File,
  key: string,
  token: string,
  progress?: (progress: number) => void,
) => {
  let formData = new FormData();
  formData.append('key', key);
  formData.append('file', file);
  formData.append('token', token);

  const { data: resultData } = await axios.post(host, formData, {
    onUploadProgress: function(progressEvent) {
      if (progressEvent.lengthComputable && progress) {
        progress((progressEvent.loaded / progressEvent.total) * 100);
      }
    },
  });

  return resultData;
};

export const parse = async (file: File) => {
  let formData = new FormData();
  formData.append('file', file);
  return await axios.post(`${api}/parse`, formData);
};
