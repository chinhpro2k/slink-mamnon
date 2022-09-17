import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getThucPhamKho(payload: {
  page: number;
  limit: number;
  cond?: any;
  donViId?: string;
}) {
  // eslint-disable-next-line no-param-reassign
  if (payload?.donViId === 'Tất cả') delete payload?.donViId;
  return axios.get(`${ip3}/kho-thuc-pham/pageable`, {
    params: payload,
  });
}

export async function getNhapKho(payload: {
  page: number;
  limit: number;
  cond?: any;
  donViId?: string;
  timeStart?: any;
  timeEnd?: any;
}) {
  const { page, limit, cond, timeEnd, timeStart } = payload;
  // eslint-disable-next-line no-param-reassign
  if (payload?.donViId === 'Tất cả') delete payload?.donViId;
  return axios.get(`${ip3}/kho-thuc-pham/pageable/lich-su`, {
    params: {
      page,
      limit,
      donViId: payload?.donViId,
      cond: {
        ...cond,
        updatedAt: { $lte: timeEnd, $gte: timeStart },
        loaiLichSuKho: 'Nhập kho',
      },
    },
  });
}

export async function capNhatNhaCungCap({ donViId, ngay, thang, nam, nhaCungCap }) {
  return axios.put(
    `${ip3}
/kho-thuc-pham/nha-cung-cap/don-vi/${donViId}/nam/${nam}/thang/${thang}/ngay/${ngay}`,
    {
      nhaCungCap,
    },
  );
}

export async function getXuatKho(payload: {
  page: number;
  limit: number;
  cond?: any;
  donViId?: string;
  ngay?: number;
  thang?: number;
  nam?: number;
  loaiThucPham?: string;
}) {
  const { page, limit, cond, ngay, thang, nam, loaiThucPham } = payload;
  // eslint-disable-next-line no-param-reassign
  if (payload?.donViId === 'Tất cả') delete payload?.donViId;

  if (loaiThucPham === 'Tươi') {
    return axios.get(`${ip3}/kho-thuc-pham/pageable/hoa-don`, {
      params: {
        page,
        limit,
        donViId: payload?.donViId,
        cond: {
          ...cond,
          ngay,
          thang,
          nam,
        },
      },
    });
  }

  return axios.get(`${ip3}/kho-thuc-pham/pageable/lich-su`, {
    params: {
      page,
      limit,
      donViId: payload?.donViId,
      cond: {
        ...cond,
        ngay,
        thang,
        nam,
        loaiLichSuKho: 'Xuất kho',
      },
    },
  });
}
export async function getHoaDon(payload: {
  page: number;
  limit: number;
  cond?: any;
  donViId?: string;
  ngay?: number;
  thang?: number;
  nam?: number;
  loaiThucPham?: string;
}) {
  const { page, limit, cond, ngay, thang, nam } = payload;
  // eslint-disable-next-line no-param-reassign
  if (payload?.donViId === 'Tất cả') delete payload?.donViId;

  return axios.get(`${ip3}/kho-thuc-pham/pageable/hoa-don`, {
    params: {
      page,
      limit,
      donViId: payload?.donViId,
      cond: {
        ...cond,
        ngay,
        thang,
        nam,
      },
    },
  });
}

export async function addThucPhamKho(payload: any) {
  return axios.post(`${ip3}/kho-thuc-pham`, payload);
}
export async function addNhienLieuKho(payload: any) {
  return axios.post(`${ip3}/kho-thuc-pham/nhien-lieu`, payload);
}

export async function updThucPhamKho(payload: any) {
  const { id } = payload;
  return axios.put(`${ip3}/kho-thuc-pham/${id}`, payload);
}
export async function delThucPhamKho(payload: any) {
  const { id } = payload;
  return axios.delete(`${ip3}/kho-thuc-pham/${id}`);
}

export async function importThucPhamKho(payload: any) {
  const file = payload?.file?.fileList?.[0].originFileObj;
  const form = new FormData();
  form.append('file', file);
  return axios.post(`${ip3}/kho-thuc-pham/import/excel/${payload?.organizationId}`, form);
}
