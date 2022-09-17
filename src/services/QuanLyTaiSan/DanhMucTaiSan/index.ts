/* eslint-disable no-underscore-dangle */
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getDanhMucTaiSan(payload: { page: number; limit: number; cond?: any }) {
  const { page, limit, cond } = payload;
  return axios.get(`${ip3}/danh-muc-tai-san/pageable`, {
    params: {
      page,
      limit,
      cond,
    },
  });
}

export async function addDanhMucTaiSan(payload: any) {
  return axios.post(`${ip3}/danh-muc-tai-san`, payload);
}

export async function updDanhMucTaiSan(payload: any) {
  const { id } = payload;
  return axios.put(`${ip3}/danh-muc-tai-san/${id}`, payload);
}

export async function delDanhMucTaiSan(payload: { id: string }) {
  const { id } = payload;
  return axios.delete(`${ip3}/danh-muc-tai-san/${id}`);
}
