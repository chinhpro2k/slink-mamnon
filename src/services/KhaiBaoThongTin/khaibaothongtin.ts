import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getCon(payload: {
  page?: number;
  limit?: number;
  cond?: number;
  childId?: string;
}) {
  const { page, limit, cond, childId } = payload;
  if (childId) {
    return axios.get(`${ip3}/con/${childId}`, {
      params: {
        page,
        limit,
        cond,
      },
    });
  }
  return axios.get(`${ip3}/con/pageable/my`, {
    params: {
      page,
      limit,
      cond,
    },
  });
}

export async function getKhaiBaoThongTin() {
  return axios.get(`${ip3}/khaibaothongtin/pageable`, { params: { page: 1, limit: 20 } });
}

export async function addConKhach(payload: any) {
  return axios.post(`${ip3}/con/my`, payload);
}

export async function updConKhach(payload: any) {
  const { id } = payload;
  const vaiTro = localStorage.getItem('vaiTro');
  if (vaiTro === 'PhuHuynh'||vaiTro === 'Guest') {
    return axios.put(`${ip3}/con/my/${id}`, payload);
  }
  return axios.put(`${ip3}/con/${id}`, payload);
}

export async function updKhach(payload: any) {
  return axios.put(`${ip3}/user/my`, payload);
}

export async function delConKhach(payload: any) {
  const { id } = payload;
  return axios.delete(`${ip3}/con/my/${id}`, payload);
}
