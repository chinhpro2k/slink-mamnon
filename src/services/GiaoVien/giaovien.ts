import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

// get ds giáo viên để nâng cấp
export async function getGiaoVien(payload: {
  page: number;
  limit: number;
  cond?: any;
  donViId?: string;
}) {
  const { page, limit, donViId, cond } = payload;
  return axios.get(`${ip3}/user/pageable/nang-cap`, {
    params: {
      page,
      limit,
      cond: { vaiTro: 'GiaoVien', donViId, soDienThoai: cond.soDienThoai },
    },
  });
}

// get danh sách giáo viên trong lớp
export async function getDSGiaoVien(payload: {
  page: number;
  limit: number;
  cond?: any;
  donViId?: string;
}) {
  const { page, limit, cond, donViId } = payload;
  return axios.get(`${ip3}/user/pageable/organization/${donViId}`, {
    params: {
      page,
      limit,
      systemRole: 'GiaoVien',
      cond: {
        'profile.phoneNumber': cond?.phoneNumber,
        'profile.fullname': cond?.fullname,
      },
    },
  });
}

export async function addGiaoVien(payload: any) {
  return axios.post(`${ip3}/user`, payload);
}

export async function updGiaoVien(payload: any) {
  const { id } = payload;
  return axios.put(`${ip3}/user/${id}`, payload);
}

export async function delGiaoVien(payload: { id: string }) {
  const { id } = payload;
  return axios.delete(`${ip3}/user/${id}`);
}
