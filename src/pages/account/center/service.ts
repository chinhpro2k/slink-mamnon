import { ip3 } from '@/utils/constants';
import request from 'umi-request';

export async function queryCurrent() {
  return request(`${ip3}/user/me`);
}

export async function queryFakeList(params: { count: number }) {
  return request('/api/fake_list', {
    params,
  });
}
