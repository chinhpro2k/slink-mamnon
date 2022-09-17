/* eslint-disable no-underscore-dangle */
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getKhoanThu(payload: {
  page: number;
  limit: number;
  cond?: any;
  donViId?: string;
  sort?: any;
}) {
  const { page, limit, cond, donViId, sort } = payload;
  return axios.get(`${ip3}/khoan-thu/pageable`, {
    params: {
      page,
      limit,
      donViId,
      cond: {
        ...cond,
      },
      sort: {
        ...sort,
      },
    },
  });
}
export async function getDetailHocPhi(payload: {
  thang: number;
  nam: number;
  cond?: any;
  donViId?: string;
}) {
  const { thang, nam, cond, donViId } = payload;
  return axios.get(`${ip3}/doanh-thu/hoc-phi/truong/${donViId}/thang/${thang}/nam/${nam}`, {
    params: {
      cond: {
        ...cond,
      },
    },
  });
}
export async function addKhoanThu(payload: any) {
  return axios.post(`${ip3}/khoan-thu/many`, payload);
}

export async function updKhoanThu(payload: any) {
  const { id } = payload;
  return axios.put(`${ip3}/khoan-thu/${id}`, payload);
}

export async function delKhoanThu(payload: { id: string }) {
  const { id } = payload;
  return axios.delete(`${ip3}/khoan-thu/${id}`);
}
export async function getDetailKhoanThu(payload: { id: string }) {
  const { id } = payload;
  return axios.get(`${ip3}/khoan-thu/${id}`);
}
