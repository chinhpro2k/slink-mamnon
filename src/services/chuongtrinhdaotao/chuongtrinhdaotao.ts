import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getChuongTrinhDaoTao(payload: {
  page?: number;
  limit?: number;
  cond?: { ten?: string; donViId?: string; _id?: string };
}) {
  const vaiTro = localStorage.getItem('vaiTro');
  const { cond, page, limit } = payload;
  if (cond?.donViId === 'Tất cả') delete cond?.donViId;
  if (
    cond?.donViId !== 'Tất cả' &&
    cond?.donViId &&
    (vaiTro === 'SuperAdmin' || vaiTro === 'Admin')
  ) {
    return axios.get(`${ip3}/chuong-trinh-dao-tao/pageable`, {
      params: {
        page,
        limit,
        donViId: cond?.donViId,
        cond: {
          ten: cond?.ten,
        },
      },
    });
  }
  return axios.get(`${ip3}/chuong-trinh-dao-tao/pageable/parents`, {
    params: payload,
  });
}

export async function getChuongTrinhDaoTaoClone(payload: {
  page: number;
  limit: number;
  cond: any;
}) {
  const { cond } = payload;
  if (cond?.donViId === 'Tất cả') delete cond?.donViId;
  return axios.get(`${ip3}/chuong-trinh-dao-tao/pageable/manageable`, {
    params: payload,
  });
}

export async function addChuongTrinhDaoTao(payload: { ten: string; ma: string; moTa: string }) {
  return axios.post(`${ip3}/chuong-trinh-dao-tao`, payload);
}
export async function cloneChuongTrinhDaoTao(payload: { idGoc?: string }) {
  const { idGoc } = payload;
  const newVal = payload;
  delete newVal?.idGoc;
  return axios.post(`${ip3}/chuong-trinh-dao-tao/clone/${idGoc}`, newVal);
}

export async function updChuongTrinhDaoTao(payload: {
  ten: string;
  ma: string;
  mota: string;
  id: string;
}) {
  const { id } = payload;
  return axios.put(`${ip3}/chuong-trinh-dao-tao/${id}`, payload);
}

export async function delChuongTrinhDaoTao(payload: { id: string }) {
  const { id } = payload;
  return axios.delete(`${ip3}/chuong-trinh-dao-tao/${id}`);
}
