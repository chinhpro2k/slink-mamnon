/* eslint-disable no-underscore-dangle */
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getBaoHong(payload: { page: number; limit: number; cond?: any }) {
  const { page, limit, cond } = payload;
  return axios.get(`${ip3}/bao-hong/pageable`, {
    params: {
      page,
      limit,
      sort: {
        updatedAt: -1,
      },
      cond: {
        ...cond,
        trangThai: { $in: ['Chờ sửa chữa', 'Đã xử lý'] },
      },
    },
  });
}

export async function getThanhLy(payload: { page: number; limit: number; cond?: any }) {
  const { page, limit, cond } = payload;
  return axios.get(`${ip3}/bao-hong/pageable`, {
    params: {
      page,
      limit,
      sort: {
        updatedAt: -1,
      },
      cond: {
        ...cond,
        trangThai: { $in: ['Chờ thanh lý', 'Đã thanh lý'] },
      },
    },
  });
}

export async function addBaoHong(payload: any) {
  return axios.post(`${ip3}/bao-hong`, payload);
}

export async function updBaoHong(payload: any) {
  const { id } = payload;
  return axios.put(`${ip3}/bao-hong/${id}`, payload);
}

export async function delBaoHong(payload: { id: string }) {
  const { id } = payload;
  return axios.delete(`${ip3}/bao-hong/${id}`);
}

export async function daSuaBaoHong(payload: { id: string }) {
  const { id } = payload;
  return axios.put(`${ip3}/bao-hong/${id}/da-sua`);
}
export async function choThanhLyBaoHong(payload: { id: string }) {
  const { id } = payload;
  return axios.put(`${ip3}/bao-hong/${id}/cho-thanh-ly`);
}
export async function daThanhLyBaoHong(payload: { id: string }) {
  const { id } = payload;
  return axios.put(`${ip3}/bao-hong/${id}/thanh-ly`);
}
