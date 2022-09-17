import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import { IQuiDoi} from '@/services/QuyDoi/index';

export async function getQuyDoi(payload: { page: number; limit: number; cond?: any }) {
  const { page, limit, cond } = payload;
  return axios.get(`${ip3}/quy-doi/pageable`, {
    params: {
      page,
      limit,
      cond: cond,
    },
  });
}
export async function deleteQuyDoi(id: string) {
  return axios.delete(`${ip3}/quy-doi/${id}`);
}

export async function createQuyDoi(data: IQuiDoi.DataCreate) {
  return axios.post(`${ip3}/quy-doi`, data);
}
