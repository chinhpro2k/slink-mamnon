import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getChucNangQuanTri(page: number, limit: number, cond?: any) {
  return axios.get(`${ip3}/modules-fe/pageable`, {
    params: {
      page,
      limit,
      cond,
    },
  });
}

export async function addChucNangQuanTri(payload: any) {
  return axios.post(`${ip3}/modules-fe`, payload);
}

export async function updChucNangQuanTri(newPay: any) {
  return axios.put(`${ip3}/modules-fe/key/${newPay?.key}`, newPay);
}

export async function delChucNangQuanTri(payload: { id: string }) {
  const { id } = payload;
  return axios.delete(`${ip3}/modules-fe/${id}`);
}
