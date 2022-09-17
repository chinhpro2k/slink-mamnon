import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

// get ds học sinh nâng cấp
export async function getHocSinh(payload: {
  page: number;
  limit: number;
  cond?: any;
  donViId?: string;
}) {
  const { page, limit, cond, donViId } = payload;
  return axios.get(`${ip3}/user/pageable/nang-cap`, {
    params: {
      page,
      limit,
      cond: {
        vaiTro: 'PhuHuynh',
        donViId,
        'con.hoTen': cond?.hoTen,
        soDienThoai: cond?.soDienThoai,
      },
    },
  });
}

// get ds học sinh trong lớp
export async function getDSHocSinh(payload: {
  page: number;
  limit: number;
  cond?: any;
  donViId?: string;
}) {
  const { page, limit, cond, donViId } = payload;
  return axios.get(`${ip3}/con/pageable/lop/${donViId}`, {
    params: {
      page,
      limit,
      cond,
    },
  });
}

export async function addHocSinh(payload: any) {
  return axios.post(`${ip3}/user`, payload);
}

export async function updHocSinh(payload: any) {
  const { id } = payload;
  return axios.put(`${ip3}/user/${id}`, payload);
}

export async function delHocSinh(payload: { id: string }) {
  const { id } = payload;
  return axios.delete(`${ip3}/user/${id}`);
}

export async function delHocSinhLop(payload: { id: string }) {
  const { id } = payload;
  return axios.delete(`${ip3}/con/${id}/xoa-lop`);
}
