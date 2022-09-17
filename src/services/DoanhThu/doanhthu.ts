/* eslint-disable no-underscore-dangle */
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getDoanhThu(payload: {
  page: number;
  limit: number;
  cond?: any;
  donViId?: string;
  loaiDoanhThu?: string;
  thang?: number;
  nam?: number;
}) {
  const { page, limit, cond, donViId, loaiDoanhThu, thang, nam } = payload;
  return axios.get(`${ip3}/doanh-thu/pageable`, {
    params: {
      page,
      limit,
      donViId,
      cond: {
        ...cond,
        loaiDoanhThu,
        thang: thang,
        nam: nam,
      },
    },
  });
}
export async function getDoanhThuChuTruong(payload: {
  cond?: any;
  loaiDoanhThu?: string;
  thang?: number;
  nam?: number;
}) {
  const { cond, loaiDoanhThu, thang, nam } = payload;
  return axios.get(`${ip3}/doanh-thu/chu-truong/thang/${thang}/nam/${nam}`, {
    params: {
      cond: {
        ...cond,
        loaiDoanhThu,
      },
    },
  });
}
export async function getDoanhThuCacTruong(payload: {
  truongId: string;
  thang: number;
  nam: number;
  cond?: any;
}) {
  const { truongId, thang, nam, cond } = payload;
  return axios.get(`${ip3}/doanh-thu/hoc-phi/truong/${truongId}/thang/${thang}/nam/${nam}`, {
    params: { cond: cond },
  });
}
export async function tinhLaiDoanhThu(payload: { truongId: string; thang: number; nam: number }) {
  const { truongId, thang, nam } = payload;
  return axios.put(
    `${ip3}/doanh-thu/tinh-lai-doanh-thu/truong/${truongId}/thang/${thang}/nam/${nam}`,
  );
}
export async function getHoaDonMuaHang(payload: {
  truongId: string;
  thang: number;
  nam: number;
  cond?: any;
}) {
  const { truongId, thang, nam, cond } = payload;
  return axios.get(
    `${ip3}/doanh-thu/hoa-don-mua-hang/truong/${truongId}/thang/${thang}/nam/${nam}`,
    { params: { cond: cond } },
  );
}
export async function getDoanhThuDonVi(payload: {
  donViId: string;
  thang: number;
  nam: number;
  cond?: any;
}) {
  const { donViId, thang, nam, cond } = payload;
  return axios.get(`${ip3}/doanh-thu/don-vi/${donViId}/thang/${thang}/nam/${nam}`, {
    params: { cond: cond },
  });
}
export async function tinhDoanhThu(payload: any) {
  const { donViId, thang, nam } = payload;
  return axios.post(`${ip3}/doanh-thu/co-dinh/don-vi/${donViId}/thang/${thang}/nam/${nam}`);
}

export async function tinhDoanhThuThuc(payload: any) {
  const { donViId, thang, nam } = payload;
  return axios.post(
    `${ip3}/doanh-thu/linh-hoat/don-vi/${donViId}/thang/${thang}/nam/${nam}`,
    payload,
  );
}

export async function exportBaoCaoDoanhThuTheoNam(payload: {
  donViId: string;
  thang: number;
  nam: number;
  cond?: any;
  type?: string;
}) {
  const { donViId, thang, nam, cond, type = 'Hệ thống' } = payload;
  return axios.get(
    `${ip3}/doanh-thu/export/don-vi/${donViId}/thang/${thang}/nam/${nam}/loai/${type}`,
    {
      responseType: 'arraybuffer',
    },
  );
}
export async function exportBaoCaoDoanhThuThucTheoNam(payload: {
  donViId: string;
  thang: number;
  nam: number;
  cond?: any;
  type?: string;
}) {
  const { donViId, thang, nam, cond, type = 'Khác' } = payload;
  return axios.get(
    `${ip3}/doanh-thu/export/don-vi/${donViId}/thang/${thang}/nam/${nam}/loai/${type}`,
    {
      responseType: 'arraybuffer',
    },
  );
}
export async function addDoanhThuThuc(payload: any) {
  return axios.post(`${ip3}/doanh-thu`, payload);
}

export async function updDoanhThu(payload: any) {
  const { id } = payload;
  return axios.put(`${ip3}/doanh-thu/${id}`, payload);
}

export async function delDoanhThu(payload: { id: string }) {
  const { id } = payload;
  return axios.delete(`${ip3}/doanh-thu/${id}`);
}
