import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getTinTucMamNon(payload: {
  page: number;
  limit: number;
  cond?: any;
  donViId?: string;
}) {
  return axios.get(`${ip3}/tin-tuc/pageable`, {
    params: payload,
  });
}

export async function addTinTuc(payload: any) {
  return axios.post(`${ip3}/tin-tuc`, payload);
}

export async function editTinTuc(payload: any) {
  const { id } = payload;
  return axios.put(`${ip3}/tin-tuc/${id}`, payload);
}
export async function delTinTuc(payload: any) {
  const { id } = payload;
  return axios.delete(`${ip3}/tin-tuc/${id}`, payload);
}
