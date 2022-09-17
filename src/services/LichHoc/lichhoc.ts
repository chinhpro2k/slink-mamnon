import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getTemplate(payload: any) {
  return axios.get(`${ip3}/template-lich-hoc/pageable`, { params: payload });
}

export async function deleteAllLich(payload: any) {
  return axios.delete(`${ip3}/lich-hoc/don-vi/${payload?.donViId}`);
}

export async function addLichFromTemplate(payload: any) {
  return axios.post(`${ip3}/lich-hoc/create-lich-hoc-from-template`, payload);
}

export async function addTemplateFromLich(payload: any) {
  return axios.post(`${ip3}/lich-hoc/create-template`, payload);
}

export async function addLichHocMany(payload: any) {
  return axios.post(`${ip3}/lich-hoc/many`, payload);
}

export async function addLichHoc(payload: any) {
  return axios.post(`${ip3}/lich-hoc`, payload);
}

export async function getLichHoc(payload: any) {
  return axios.get(`${ip3}/lich-hoc/pageable`, {
    params: { page: 1, limit: 20000, donViId: payload?.donViId ?? '' },
  });
}

export async function updLichHoc(payload: {
  ten: string;
  ma: string;
  mota: string;
  id: string;
  chuongTrinhDaoTaoId: string;
}) {
  const { id } = payload;
  return axios.put(`${ip3}/lich-hoc/${id}`, payload);
}

export async function delLichHoc(payload: { id: string }) {
  const { id } = payload;
  return axios.delete(`${ip3}/lich-hoc/${id}`);
}
