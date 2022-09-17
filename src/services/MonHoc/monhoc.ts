import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getMonHoc(payload: { page?: number; limit?: number; cond?: any }) {
  const vaiTro = localStorage.getItem('vaiTro');
  const { cond, page, limit } = payload;
  if (cond?.donViId === 'Tất cả') delete cond?.donViId;
  if (cond?.chuongTrinhDaoTaoId === 'Tất cả') delete cond?.chuongTrinhDaoTaoId;
  if (
    cond?.donViId !== 'Tất cả' &&
    cond?.donViId &&
    (vaiTro === 'SuperAdmin' || vaiTro === 'Admin')
  ) {
    return axios.get(`${ip3}/mon-hoc/pageable`, {
      params: {
        page,
        limit,
        donViId: cond?.donViId,
        cond: {
          ten: cond?.ten,
          chuongTrinhDaoTaoId: cond?.chuongTrinhDaoTaoId,
        },
      },
    });
  }
  return axios.get(`${ip3}/mon-hoc/pageable/parents`, {
    params: payload,
  });
}

export async function getMonHocClone(payload: { page?: number; limit?: number; cond?: any }) {
  const { cond } = payload;
  if (cond?.donViId === 'Tất cả') delete cond?.donViId;
  if (cond?.chuongTrinhDaoTaoId === 'Tất cả') delete cond?.chuongTrinhDaoTaoId;
  return axios.get(`${ip3}/mon-hoc/pageable/manageable`, { params: payload });
}

export async function addMonHoc(payload: {
  ten: string;
  ma: string;
  moTa: string;
  chuongTrinhDaoTaoId: string;
}) {
  return axios.post(`${ip3}/mon-hoc`, payload);
}

export async function cloneMonHoc(payload: { idGoc?: string }) {
  const { idGoc } = payload;
  const newVal = payload;
  delete newVal?.idGoc;
  return axios.post(`${ip3}/mon-hoc/clone/${idGoc}`, payload);
}

export async function updMonHoc(payload: {
  ten: string;
  ma: string;
  mota: string;
  id: string;
  chuongTrinhDaoTaoId: string;
}) {
  const { id } = payload;
  return axios.put(`${ip3}/mon-hoc/${id}`, payload);
}

export async function delMonHoc(payload: { id: string }) {
  const { id } = payload;
  return axios.delete(`${ip3}/mon-hoc/${id}`);
}
