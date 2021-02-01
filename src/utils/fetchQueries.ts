import axios from 'axios';

export async function fetchFolders(url: string, token: string) {
  let { data } = await axios.get(`${url}/figma-sync`, {
    headers: {
      Authorization: token,
    },
  });

  return data;
}
