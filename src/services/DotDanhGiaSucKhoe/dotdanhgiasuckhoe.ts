import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getDotDanhGiaSucKhoe(payload: {
  page: number;
  limit: number;
  cond?: any;
  donViId?: string;
}) {
  const { page, limit, cond, donViId } = payload;
  return axios.get(`${ip3}/dot-danh-gia-sk/pageable`, {
    params: {
      page,
      limit,
      donViId: donViId === 'Tất cả' ? null : donViId,
      cond,
    },
  });
}

export async function addDotDanhGiaSucKhoe(payload: any) {
  return axios.post(`${ip3}/dot-danh-gia-sk`, payload);
}

export async function updDotDanhGiaSucKhoe(payload: any) {
  const { id } = payload;
  return axios.put(`${ip3}/dot-danh-gia-sk/${id}`, payload);
}
export async function delDotDanhGiaSucKhoe(payload: any) {
  const { id } = payload;
  return axios.delete(`${ip3}/dot-danh-gia-sk/${id}`);
}
