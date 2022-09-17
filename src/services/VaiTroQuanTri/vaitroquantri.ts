import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getVaiTroQuanTri(page: number, limit: number) {
  return axios.get(`${ip3}/roles/pageable`, {
    params: {
      page,
      limit,
    },
  });
}

export async function addVaiTroQuanTri(payload: any) {
  return axios.post(`${ip3}/roles`, payload);
}

export async function updVaiTroQuanTri(newPay: any) {
  return axios.put(`${ip3}/roles/${newPay?.id}`, newPay);
}

export async function delVaiTroQuanTri(payload: { id: string }) {
  const { id } = payload;
  return axios.delete(`${ip3}/roles/${id}`);
}
