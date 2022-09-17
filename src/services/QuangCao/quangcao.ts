/* eslint-disable no-underscore-dangle */
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getQuangCao(payload: {
  page: number;
  limit: number;
  cond?: any;
  donViId?: string;
  filterInfo?: object;
}) {
  const { page, limit, cond, donViId, filterInfo } = payload;
  return axios.get(`${ip3}/tin-quang-cao/pageable`, {
    params: {
      page,
      limit,
      cond: {
        ...cond,
        ...(donViId !== 'Tất cả' && {
          donViId,
        }),
      },
      sort: {
        mucUuTien: filterInfo?.sort?.mucUuTien ?? -1,
        ngayDang: filterInfo?.sort?.ngayDang ?? -1,
      },
    },
  });
}

export async function addQuangCao(payload: any) {
  return axios.post(`${ip3}/tin-quang-cao`, payload);
}

export async function updQuangCao(payload: any) {
  const { id } = payload;
  return axios.put(`${ip3}/tin-quang-cao/${id}`, payload);
}

export async function delQuangCao(payload: { id: string }) {
  const { id } = payload;
  return axios.delete(`${ip3}/tin-quang-cao/${id}`);
}
