import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getBaiHoc(payload: {
  page: number;
  limit: number;
  cond?: any;
  donViId?: string;
}) {
  const { cond, page, limit } = payload;
  const vaiTro = localStorage.getItem('vaiTro');
  if (cond?.donViId === 'Tất cả') delete cond?.donViId;
  if (cond?.doTuoi === 'Tất cả') delete cond?.doTuoi;
  if (cond?.chuongTrinhDaoTaoId === 'Tất cả') delete cond?.chuongTrinhDaoTaoId;
  if (
    cond?.donViId !== 'Tất cả' &&
    cond?.donViId &&
    (vaiTro === 'SuperAdmin' || vaiTro === 'Admin')
  ) {
    return axios.get(`${ip3}/bai-hoc/pageable`, {
      params: {
        page,
        limit,
        donViId: cond?.donViId,
        cond: {
          tenBaiHoc: cond?.tenBaiHoc,
          tenMonHoc: cond?.tenMonHoc,
          chuongTrinhDaoTaoId: cond?.chuongTrinhDaoTaoId,
          monHocId: cond?.monHocId,
        },
      },
    });
  }
  delete payload.donViId;
  return axios.get(`${ip3}/bai-hoc/pageable`, {
    params: payload,
  });
}

export async function getBaiHocClone(payload: { page: number; limit: number; cond?: any }) {
  const { cond } = payload;
  if (cond?.chuongTrinhDaoTaoId === 'Tất cả') delete cond?.chuongTrinhDaoTaoId;
  if (cond?.donViId === 'Tất cả') delete cond?.donViId;
  if (cond?.monHocId === 'Tất cả') delete cond?.monHocId;
  if (cond?.doTuoi === 'Tất cả') delete cond?.doTuoi;
  return axios.get(`${ip3}/bai-hoc/pageable/manageable`, { params: payload });
}

export async function addBaiHoc(payload: any) {
  return axios.post(`${ip3}/bai-hoc`, payload);
}

export async function cloneBaiHoc(payload: { idGoc?: string }) {
  const { idGoc } = payload;
  const newVal = payload;
  delete newVal?.idGoc;
  return axios.post(`${ip3}/bai-hoc/clone/${idGoc}`, payload);
}

export async function importBaiHoc(payload: any) {
  const file = payload?.file?.fileList?.[0].originFileObj;
  const form = new FormData();
  form.append('file', file);
  if (payload?.donViId === 'Trường chung') {
    return axios.post(`${ip3}/bai-hoc/import/excel`, form);
  }
  return axios.post(`${ip3}/bai-hoc/import/excel?donViId=${payload?.donViId}`, form);
}

export async function updBaiHoc(payload: { id: string }) {
  const { id } = payload;
  return axios.put(`${ip3}/bai-hoc/${id}`, payload);
}

export async function delBaiHoc(payload: { id: string }) {
  const { id } = payload;
  return axios.delete(`${ip3}/bai-hoc/${id}`);
}
