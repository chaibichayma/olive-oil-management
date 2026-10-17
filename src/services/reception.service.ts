
import axios from 'axios';

const API_BASE_URL =
  'http://72.62.191.179:8080/olive_app';

export async function getListBean() {
  const response = await axios.get(
    `${API_BASE_URL}/reception/getListBean`,
  );

  return response.data;
}
