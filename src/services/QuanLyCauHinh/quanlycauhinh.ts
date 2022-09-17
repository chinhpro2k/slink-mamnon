import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import { CauHinh } from '@/services/QuanLyCauHinh/index';

export async function addCauHinh(payload: CauHinh.IReq) {
  return axios.post(`${ip3}/setting/upsert`, payload);
}
export async function getCauHinh(paload: { page: number; limit: number,cond:any }) {
  return axios.get(`${ip3}/setting/pageable`,{params:paload});
}
