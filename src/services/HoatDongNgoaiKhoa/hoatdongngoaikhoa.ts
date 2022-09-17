import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getHoatDongNgoaiKhoa(payload: {
  page: number;
  limit: number;
  cond?: any;
  donViId?: string;
}) {
  const { page, limit, cond, donViId } = payload;
  return axios.get(`${ip3}/hoat-dong-ngoai-khoa/pageable`, {
    params: {
      page,
      limit,
      donViId: donViId === 'Tất cả' ? null : donViId,
      cond,
    },
  });
}

export async function getDanhSachThamGia(payload: {
  page?: number;
  limit?: number;
  cond: any;
  idHoatDong?: string;
  donViId?: string;
}) {
  const { page, limit, cond, idHoatDong, donViId } = payload;
  return axios.get(`${ip3}/hoat-dong-ngoai-khoa/danh-sach-hoc-sinh/${idHoatDong}`, {
    params: {
      page,
      limit,
      donViId,
      cond,
    },
  });
}

export async function getDanhSachLop(payload: {
  page?: number;
  limit?: number;
  cond: any;
  idHoatDong?: string;
}) {
  const { page, limit, cond, idHoatDong } = payload;
  return axios.get(`${ip3}/hoat-dong-ngoai-khoa/danh-sach-lop/${idHoatDong}`, {
    params: {
      page,
      limit,
      cond,
    },
  });
}

export async function addHoatDongNgoaiKhoa(payload: any) {
  return axios.post(`${ip3}/hoat-dong-ngoai-khoa`, payload);
}

export async function updHoatDongNgoaiKhoa(payload: any) {
  const { id } = payload;
  return axios.put(`${ip3}/hoat-dong-ngoai-khoa/${id}`, payload);
}
export async function delHoatDongNgoaiKhoa(payload: any) {
  const { id } = payload;
  return axios.delete(`${ip3}/hoat-dong-ngoai-khoa/${id}`);
}
