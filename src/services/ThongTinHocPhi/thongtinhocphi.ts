/* eslint-disable no-underscore-dangle */
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getThongTinHocPhiLop(payload: {
  page: number;
  limit: number;
  cond?: any;
  lopId?: string;
}) {
  const { page, limit, cond, lopId } = payload;
  return axios.get(`${ip3}/con/pageable/lop/${lopId}`, {
    params: {
      page,
      limit,
      donViId: lopId,
      cond: {
        ...cond,
      },
    },
  });
}

export async function getThongTinChiTiet(payload: {
  page: number;
  limit: number;
  cond?: any;
  lopId?: string;
}) {
  const { page, limit, cond, lopId } = payload;
  return axios.get(`${ip3}/hoc-phi/pageable`, {
    params: {
      page,
      limit,
      donViId: lopId,
      cond: {
        ...cond,
      },
    },
  });
}

export async function addThongTinHocPhi(payload: any) {
  return axios.post(`${ip3}/thong-tin-hoc-phi`, payload);
}

export async function addThongTinHocPhiLop(payload: any) {
  return axios.post(`${ip3}/thong-tin-hoc-phi-lop`, payload);
}

export async function updTrangThaiThanhToan(payload: any) {
  const { id } = payload;
  return axios.put(`${ip3}/hoc-phi/${id}`, payload);
}
export async function updThongTinHocPhiCon(payload: any) {
  const { id } = payload;
  return axios.put(`${ip3}/thong-tin-hoc-phi/${id}`, payload);
}
export async function updThongTinHocPhiLop(payload: any) {
  const { id } = payload;
  return axios.put(`${ip3}/thong-tin-hoc-phi-lop/${id}`, payload);
}

export async function delThongTinHocPhi(payload: { id: string }) {
  const { id } = payload;
  return axios.delete(`${ip3}/hoc-phi/${id}`);
}
