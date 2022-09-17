import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getDanhMucMonAn(payload: {
  page: number;
  limit: number;
  cond?: any;
  donViId?: string;
}) {
  if (payload.donViId === 'Tất cả') delete payload.donViId;
  return axios.get(`${ip3}/danh-muc-mon-an/pageable`, {
    params: payload,
  });
}

export async function postDanhMucMonAn(payload: any) {
  return axios.post(`${ip3}/danh-muc-mon-an`, payload);
}

export async function updDanhMucMonAn(payload: any) {
  const { id } = payload;
  delete payload.id;
  return axios.put(`${ip3}/danh-muc-mon-an/${id}`, payload);
}
export async function delDanhMucMonAn(payload: any) {
  const { id } = payload;
  return axios.delete(`${ip3}/danh-muc-mon-an/${id}`);
}

export async function importDanhMucMonAn(payload: any) {
  const file = payload?.file?.fileList?.[0].originFileObj;
  const vaiTro = localStorage.getItem('vaiTro');
  const form = new FormData();
  form.append('file', file);
  form.append('datatype', vaiTro === 'SuperAdmin' || vaiTro === 'Admin' ? 'Hệ thống' : 'Khác');
  return axios.post(`${ip3}/danh-muc-mon-an/import/excel`, form);
}
