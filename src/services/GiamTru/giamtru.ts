/* eslint-disable no-underscore-dangle */
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getGiamTru(payload: {
  page: number;
  limit: number;
  cond?: any;
  donViId?: string;
}) {
  const { page, limit, cond, donViId } = payload;
  return axios.get(`${ip3}/khoan-giam-tru/pageable`, {
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

export async function getDetailGiamTru(payload: {
  thang: number;
  nam: number;
  cond?: any;
  donViId?: string;
}) {
  const { thang, nam, cond, donViId } = payload;
  return axios.get(`${ip3}/doanh-thu/giam-tru-hoc-phi/truong/${donViId}/thang/${thang}/nam/${nam}`, {
    params: {
      cond: {
        ...cond,
      },
    },
  });
}
