/* eslint-disable no-underscore-dangle */
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getBaoCaoHeThong(payload: { from: number; to: number }) {
  const { from, to } = payload;
  return axios.get(`${ip3}/dashboard/users/login`, {
    params: {
      from,
      to,
    },
  });
}

export async function getDashboardUser() {
  return axios.get(`${ip3}/dashboard/users`);
}
