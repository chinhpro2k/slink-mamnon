import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getDanhMucThucPham(payload: {
  page: number;
  limit: number;
  cond?: any;
  donViId?: string;
}) {
  // eslint-disable-next-line no-param-reassign
  if (payload?.donViId === 'Tất cả') delete payload?.donViId;
  return axios.get(`${ip3}/danh-muc-thuc-pham/pageable`, {
    params: payload,
  });
}

export async function getBangDinhDuong() {
  return axios.get(`${ip3}/danh-muc-mon-an/quy-dinh-dinh-duong/latest`);
}

export async function addDanhMucThucPham(payload: any) {
  return axios.post(`${ip3}/danh-muc-thuc-pham`, payload);
}

export async function updDanhMucThucPham(payload: any) {
  const { id } = payload;
  delete payload.id;
  return axios.put(`${ip3}/danh-muc-thuc-pham/${id}`, payload);
}
export async function delDanhMucThucPham(payload: any) {
  const { id } = payload;
  return axios.delete(`${ip3}/danh-muc-thuc-pham/${id}`);
}

export async function importDanhMucThucPham(payload: any) {
  const file = payload?.file?.fileList?.[0].originFileObj;
  const form = new FormData();
  form.append('file', file);
  // const vaiTro = localStorage.getItem('vaiTro');
  // form.append('datatype', vaiTro === 'SuperAdmin' || vaiTro === 'Admin' ? 'Hệ thống' : 'Khác');
  return axios.post(`${ip3}/danh-muc-thuc-pham/import/excel/don-vi/${payload?.donViId}`, form);
}

export async function importBangDinhDuong(payload: any) {
  const file = payload?.file?.fileList?.[0].originFileObj;
  const form = new FormData();
  form.append('file', file);
  return axios.post(`${ip3}/danh-muc-mon-an/import/excel/quy-dinh`, form);
}
