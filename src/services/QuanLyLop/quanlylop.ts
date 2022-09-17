/* eslint-disable no-underscore-dangle */
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getQuanLyLop(payload: {
  page: number;
  limit: number;
  cond?: any;
  parent?: string;
  vaiTro?: string | null;
}) {
  const { page, limit, cond, parent, vaiTro } = payload;
  if (cond?._id === 'Tất cả') delete cond?._id;
  if (parent && vaiTro !== 'GiaoVien') {
    return axios.get(`${ip3}/don-vi/pageable/my/child`, {
      params: {
        page,
        limit,
        cond: {
          parent,
          tenDonVi: cond?.tenDonVi,
        },
      },
    });
  }
  if (parent && vaiTro === 'GiaoVien') {
    return axios.get(`${ip3}/don-vi/pageable`, {
      params: {
        page,
        limit,
        cond: {
          _id: parent,
          tenDonVi: cond?.tenDonVi,
        },
      },
    });
  }
  return axios.get(`${ip3}/don-vi/pageable/my/child`, {
    params: {
      page,
      limit,
      cond: {
        parent: cond?._id,
        tenDonVi: cond?.tenDonVi,
        loaiDonVi: 'Lop',
      },
    },
  });
}
export async function getBangHocPhiHS(payload: {
  page: number;
  limit: number;
  cond?: any;
  donViId?: string;
  thang?: number;
  nam?: number;
}) {
  const { page, limit, cond, donViId, thang, nam } = payload;
  return axios.get(`${ip3}/hoc-phi/pageable`, {
    params: {
      page,
      limit,
      donViId,
      cond: {
        thang,
        nam,
        ...cond,
      },
    },
  });
}

export async function addQuanLyLop(payload: any) {
  return axios.post(`${ip3}/don-vi`, payload);
}

export async function updQuanLyLop(payload: any) {
  const { id } = payload;
  return axios.put(`${ip3}/don-vi/${id}`, payload);
}

export async function delQuanLyLop(payload: { id: string }) {
  const { id } = payload;
  return axios.delete(`${ip3}/don-vi/${id}`);
}

export async function tinhHocPhiThang(payload: { donViId?: string; thang?: number; nam?: number }) {
  const { donViId, thang, nam } = payload;
  return axios.post(`${ip3}/hoc-phi/tinh-hoc-phi-lop/don-vi/${donViId}/thang/${thang}/nam/${nam}`);
}
