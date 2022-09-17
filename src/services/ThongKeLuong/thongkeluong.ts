import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getThongKeLuong(payload: {
  page: number;
  limit: number;
  cond?: any;
  donViId?: string;
  thang?: number;
  nam?: number;
}) {
  const vaiTro = localStorage.getItem('vaiTro');
  const { page, limit, donViId, cond, thang, nam } = payload;
  if (vaiTro === 'GiaoVien') {
    return axios.get(`${ip3}/luong-thang/pageable/giao-vien/my`, {
      params: {
        page,
        limit,
        cond: {
          ...cond,
          thang,
          nam,
        },
      },
    });
  }

  return axios.get(`${ip3}/luong-thang/pageable/${donViId}`, {
    params: {
      page,
      limit,
      cond: {
        ...cond,
        thang,
        nam,
      },
    },
  });
}

export async function addThongKeLuong(payload: any) {
  return axios.post(`${ip3}/user`, payload);
}

export async function updThongKeLuong(payload: any) {
  const { id } = payload;
  return axios.put(`${ip3}/luong-thang/${id}`, payload);
}

export async function delThongKeLuong(payload: { id: string }) {
  const { id } = payload;
  return axios.delete(`${ip3}/user/${id}`);
}
