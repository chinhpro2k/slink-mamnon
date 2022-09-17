import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getDanhGiaGiaoVien(payload: {
  page: number;
  limit: number;
  cond?: any;
  donViId?: string;
}) {
  return axios.get(`${ip3}/danh-gia-co/form/pageable`, {
    params: payload,
  });
}

export async function getResultGiaoVien(payload: {
  formDanhGiaId?: string;
  donViId?: string;
  page?: number;
  limit?: number;
}) {
  const { formDanhGiaId, donViId, page, limit } = payload;
  return axios.get(`${ip3}/danh-gia-co/${formDanhGiaId}/don-vi/${donViId}/danh-sach-giao-vien`, {
    params: {
      page,
      limit,
    },
  });
}

export async function getThongKeGiaoVien(payload: {
  danhGiaId?: string;
  page?: number;
  limit?: number;
}) {
  const { danhGiaId, page, limit } = payload;
  return axios.get(`${ip3}/danh-gia-co/chi-tiet-danh-gia/${danhGiaId}`, {
    params: {
      page,
      limit,
    },
  });
}

export async function getThongKeAllDot(payload: {
  donViId?: string;
  page?: number;
  limit?: number;
}) {
  const { donViId, page, limit } = payload;
  return axios.get(`${ip3}/danh-gia-co/diem-tb/${donViId}/danh-sach-giao-vien`, {
    params: {
      page,
      limit,
    },
  });
}

export async function getDSGiaoVienDanhGia(payload: {
  formDanhGiaId?: string;
  page?: number;
  limit?: number;
}) {
  const { formDanhGiaId, page, limit } = payload;
  return axios.get(`${ip3}/danh-gia-co/pageable/form/${formDanhGiaId}`, {
    params: {
      page,
      limit,
    },
  });
}

export async function addDanhGiaGiaoVien(payload: any) {
  return axios.post(`${ip3}/danh-gia-co/form`, payload);
}

export async function updDanhGiaGiaoVien(payload: any) {
  const { id } = payload;
  return axios.put(`${ip3}/danh-gia-co/form/${id}`, payload);
}

export async function kichHoatDanhGiaGiaoVien(payload: any) {
  const { _id } = payload;
  return axios.put(`${ip3}/danh-gia-co/form/${_id}`, payload);
}

export async function delDanhGiaGiaoVien(payload: any) {
  const { id } = payload;
  return axios.delete(`${ip3}/danh-gia-co/form/${id}`);
}
