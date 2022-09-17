/* eslint-disable no-underscore-dangle */
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getBaoCao(payload: { page: number; limit: number; cond?: any }) {
  return axios.get(`${ip3}/bao-cao-quan-tri/pageable`, {
    params: {
      cond: payload.cond,
      page: payload.page,
      limit: payload.limit,
    },
  });
}
export async function exportExcel(payload: { cond?: any }) {
  return axios.get(`${ip3}/bao-cao-quan-tri/export`, {
    params: {
      cond: payload.cond,
    },
    responseType: 'arraybuffer',
  });
}
export async function tinhToanBaoCaoQuanTri() {
  return axios.post(`${ip3}/bao-cao-quan-tri`);
}
