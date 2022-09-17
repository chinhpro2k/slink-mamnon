import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getDiemDanhPhuHuynh(payload: { page?: number; limit?: number; cond?: any }) {
  return axios.get(`${ip3}/diem-danh/my/pageable`, {
    params: payload,
  });
}

export async function postDiemDanh(payload: any) {
  return axios.post(`${ip3}/diem-danh`, payload);
}

export async function getDiemDanhTheoNgay(payload: any) {
  return axios.get(`${ip3}/diem-danh/my`, { params: payload });
}

export async function addDiemDanhPhuHuynh(payload: any) {
  return axios.post(`${ip3}/modules-fe`, payload);
}

export async function updDiemDanhPhuHuynh(newPay: any) {
  return axios.put(`${ip3}/modules-fe/key/${newPay?.key}`, newPay);
}

export async function delDiemDanhPhuHuynh(payload: { id: string }) {
  const { id } = payload;
  return axios.delete(`${ip3}/modules-fe/${id}`);
}
