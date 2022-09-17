import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function postSdt(payload: { values: any }) {
  return axios.post(`${ip3}/auth/verify-phonenumber-forgot`, payload);
}

export async function postNewPassword(payload: { values: any }) {
  return axios.post(`${ip3}/auth/forgot`, payload);
}
