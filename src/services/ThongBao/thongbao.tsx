import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getThongBao(payload: {
  page: number;
  limit: number;
  cond?: any;
  donViId?: string;
}) {
  return axios.get(`${ip3}/notifications/pageable`, {
    params: {
      ...payload,
      cond: {
        ...payload.cond,
        // senderID: '62331b37f0339ab69d58ce2f',
      },
    },
  });
}

export async function notiSendAll(payload: any) {
  return axios.post(`${ip3}/notifications/send-all`, payload);
}
export async function notiSendMany(payload: any) {
  return axios.post(`${ip3}/notifications/send-many`, payload);
}
export async function notiSendOne(payload: any) {
  return axios.post(`${ip3}/notifications/send-one`, payload);
}

export async function notiSendDonVi(payload: any) {
  return axios.post(`${ip3}/notifications/don-vi`, payload);
}

export async function updThongBao(payload: any) {
  const { id } = payload;
  return axios.put(`${ip3}/user/${id}`, payload);
}
