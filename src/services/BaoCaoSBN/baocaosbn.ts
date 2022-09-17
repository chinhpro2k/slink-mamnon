/* eslint-disable no-underscore-dangle */
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getBaoCaoSBN(payload: {
  page: number;
  limit: number;
  cond?: any;
  donViId?: string;
}) {
  const { page, limit, cond, donViId } = payload;
  return axios.get(`${ip3}/bao-cao-sbn/pageable`, {
    params: {
      page,
      limit,
      donViId,
      cond: {
        ...cond,
      },
    },
  });
}

export async function addBaoCaoSBN(payload: any) {
  return axios.post(`${ip3}/bao-cao-sbn`, payload);
}

export async function updBaoCaoSBN(payload: any) {
  const { id } = payload;
  return axios.put(`${ip3}/bao-cao-sbn/${id}`, payload);
}

export async function delBaoCaoSBN(payload: { id: string }) {
  const { id } = payload;
  return axios.delete(`${ip3}/bao-cao-sbn/${id}`);
}
