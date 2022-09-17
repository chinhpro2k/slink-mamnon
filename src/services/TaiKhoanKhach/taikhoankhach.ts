import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getTaiKhoanKhach(payload: { page: number; limit: number; cond?: any }) {
  const { page, limit, cond } = payload;
  return axios.get(`${ip3}/user/pageable`, {
    params: {
      page,
      limit,
      cond: {
        'roles.systemRole': 'Guest',
        'profile.phoneNumber': cond?.phoneNumber,
        'profile.fullname': cond?.fullname,
      },
    },
  });
}

export async function addTaiKhoanKhach(payload: any) {
  return axios.post(`${ip3}/user/register`, payload);
}

export async function updTaiKhoanKhach(payload: any) {
  return axios.put(`${ip3}/user/my`, payload);
}

export async function updTaiKhoanKhachAd(payload: any) {
  const { id } = payload;
  return axios.put(`${ip3}/user/${id}`, payload);
}

export async function delTaiKhoanKhach(payload: { id: string }) {
  const { id } = payload;
  return axios.delete(`${ip3}/user/${id}`);
}

export async function importTaiKhoanKhach(payload: any) {
  const file = payload?.file.fileList?.[0].originFileObj;
  const form = new FormData();
  form.append('file', file);
  return axios.post(`${ip3}/user/import/excel/guest/${payload?.organizationId}`, form);
}
