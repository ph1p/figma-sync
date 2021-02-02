import axios from 'axios';

export async function fetchFolders(url: string, token: string) {
  const { data } = await axios.get(`${url}/figma-sync`, {
    headers: {
      Authorization: token,
    },
  });

  return data;
}

export async function sendBlobToServer(url: string, blob: Blob, name: string) {
  const formData = new FormData();

  formData.append('name', name);
  formData.append('file', blob);

  const { data } = await axios.post(`${url}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data;
}
