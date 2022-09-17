/* eslint-disable no-underscore-dangle */
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getKhoanChiTieu(payload: {
  page: number;
  limit: number;
  cond?: any;
  donViId?: string;
  sort?: any;
}) {
  const { page, limit, cond, donViId, sort } = payload;
  return axios.get(`${ip3}/khoan-chi-tieu/pageable`, {
    params: {
      page,
      limit,
      donViId,
      cond: {
        ...cond,
      },
      sort: {
        ...sort,
      },
    },
  });
}
export async function getSoTienChiGiaoVien(payload: {
  donViId: string;
  page: number;
  limit: number;
  cond?: any;
}) {
  const { donViId, cond, page, limit } = payload;
  return axios.get(`${ip3}/luong-thang/pageable/${donViId}`, {
    params: { page: page, limit: limit, cond: cond },
  });
}
export async function addKhoanChiTieu(payload: any) {
  return axios.post(`${ip3}/khoan-chi-tieu/many`, payload);
}

export async function updKhoanChiTieu(payload: any) {
  const { id } = payload;
  return axios.put(`${ip3}/khoan-chi-tieu/${id}`, payload);
}

export async function delKhoanChiTieu(payload: { id: string }) {
  const { id } = payload;
  return axios.delete(`${ip3}/khoan-chi-tieu/${id}`);
}
export async function getLuongThang(payload: {
  thang: number;
  nam: number;
  cond?: any;
  donViId?: string;
}) {
  const { thang, nam, cond, donViId } = payload;
  return axios.get(`${ip3}/doanh-thu/luong-thang/truong/${donViId}/thang/${thang}/nam/${nam}`, {
    params: {
      cond: {
        ...cond,
      },
    },
  });
}
export async function getHoaDonMuaHang(payload: {
  thang: number;
  nam: number;
  cond?: any;
  donViId?: string;
}) {
  const { thang, nam, cond, donViId } = payload;
  return axios.get(
    `${ip3}/doanh-thu/hoa-don-mua-hang/truong/${donViId}/thang/${thang}/nam/${nam}`,
    {
      params: {
        cond: {
          ...cond,
        },
      },
    },
  );
}
