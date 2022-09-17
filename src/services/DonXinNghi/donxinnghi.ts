import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getDonXinNghi(payload: {
  page?: number;
  limit?: number;
  cond?: any;
  donViId?: string;
  ngay?: number;
  thang?: number;
  nam?: number;
}) {
  const { page, limit, cond, donViId, ngay, thang, nam } = payload;
  if (donViId && donViId !== 'Tất cả') {
    return axios.get(`${ip3}/xin-nghi-hoc/pageable`, {
      params: {
        page,
        limit,
        donViId,
        cond: {
          ...cond,
          ngay,
          thang,
          nam,
        },
      },
    });
  }
  return axios.get(`${ip3}/xin-nghi-hoc/pageable`, {
    params: {
      page,
      limit,
      cond: {
        ...cond,
        ngay,
        thang,
        nam,
      },
    },
  });
}
