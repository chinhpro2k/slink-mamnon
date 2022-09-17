import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getFormDanhGia(payload: {
  page: number;
  limit: number;
  cond?: any;
  donViId?: string;
}) {
  return axios.get(`${ip3}/danh-gia-hoc-sinh/form/pageable`, {
    params: payload,
  });
}

export async function getResultDanhGia(payload: { formDanhGiaId?: string; conId?: string }) {
  return axios.get(
    `${ip3}/danh-gia-hoc-sinh/chi-tiet-danh-gia/hoc-sinh/${payload?.conId}/form/${payload?.formDanhGiaId}`,
  );
}

export async function getDSHocSinhDanhGia(payload: { formDanhGiaId?: string; donViId?: string }) {
  return axios.get(
    `${ip3}/danh-gia-hoc-sinh/${payload?.formDanhGiaId}/don-vi/${payload?.donViId}/danh-sach-hoc-sinh`,
  );
}

export async function addFormDanhGia(payload: any) {
  return axios.post(`${ip3}/danh-gia-hoc-sinh/form`, payload);
}

export async function updFormDanhGia(payload: any) {
  const { id } = payload;
  return axios.put(`${ip3}/danh-gia-hoc-sinh/form/${id}`, payload);
}

export async function kichHoatDanhGiaHocSinh(payload: any) {
  const { _id } = payload;
  return axios.put(`${ip3}/danh-gia-hoc-sinh/form/${_id}`, payload);
}

export async function delFormDanhGia(payload: any) {
  const { id } = payload;
  return axios.delete(`${ip3}/danh-gia-hoc-sinh/form/${id}`);
}
