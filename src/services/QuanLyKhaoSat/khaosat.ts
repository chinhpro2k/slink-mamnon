import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getKhaoSat(payload: {
  page: number;
  limit: number;
  cond?: any;
  donViId?: string;
  filterInfo?: object;
}) {
  return axios.get(`${ip3}/sotay/khaosat-v2`, {
    params: payload,
  });
}

export async function getResultKhaoSat(payload: { id?: string }) {
  return axios.get(`${ip3}/sotay/khaosat-v2/result/${payload?.id}`);
}
export async function getKhaoSatData(payload: { id?: string }) {
  return axios.get(`${ip3}/sotay/khaosat-v2/${payload?.id}`);
}

export async function addKhaoSat(payload: any) {
  return axios.post(`${ip3}/sotay/khaosat-v2`, payload);
}

export async function updKhaoSat(payload: any) {
  const { id } = payload;
  return axios.put(`${ip3}/sotay/khaosat-v2/${id}`, payload);
}

export async function kichHoatBieuMau(payload: any) {
  const { _id } = payload;
  return axios.put(`${ip3}/sotay/khaosat-v2/${_id}`, payload);
}

export async function delKhaoSat(payload: any) {
  const { id } = payload;
  return axios.delete(`${ip3}/sotay/khaosat-v2/${id}`);
}
export async function getCauTraLoi(
  id: string,
  payload: {
    page: number;
    limit: number;
    cond?: any;
  },
) {
  return axios.get(`${ip3}/sotay/khaosat-v2/cau-hoi/${id}/cau-tra-loi`, {
    params: payload,
  });
}
export async function getCauDataStatistic(khaoSatId: string, cauHoiId: string) {
  return axios.get(`${ip3}/sotay/khaosat-v2/result/${khaoSatId}/cau-hoi/${cauHoiId}`, );
}
