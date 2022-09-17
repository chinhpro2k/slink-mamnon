import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getTruong(payload: {
  page: number;
  limit: number;
  cond?: any;
  organizationId?: string;
  filterInfo?: object;
}) {
  const { page, limit, cond, organizationId } = payload;
  // eslint-disable-next-line no-underscore-dangle
  if (cond?._id === 'Tất cả') delete cond?._id;
  if (organizationId) {
    return axios.get(`${ip3}/don-vi/pageable`, {
      params: {
        page,
        limit,
        cond: {
          loaiDonVi: 'Truong',
          ...cond,
          _id: organizationId,
        },
        ...(payload?.filterInfo?.sort && {
          sort: {
            ...payload?.filterInfo?.sort,
          },
        }),
      },
    });
  }
  return axios.get(`${ip3}/don-vi/pageable`, {
    params: {
      page,
      limit,
      cond: {
        loaiDonVi: 'Truong',
        ...cond,
      },
      ...(payload?.filterInfo?.sort && {
        sort: {
          ...payload?.filterInfo?.sort,
        },
      }),
    },
  });
}

export async function addTruong(payload: any) {
  return axios.post(`${ip3}/don-vi`, payload);
}

export async function addThongTinHocPhiTruong(payload: any) {
  return axios.post(`${ip3}/thong-tin-hoc-phi-truong`, payload);
}

export async function updThongTinHocPhiTruong(payload: any) {
  const { id } = payload;
  return axios.put(`${ip3}/thong-tin-hoc-phi-truong/${id}`, payload);
}
export async function updTruong(payload: any) {
  const { id } = payload;
  delete payload.id;
  return axios.put(`${ip3}/don-vi/${id}`, payload);
}

export async function delTruong(payload: { id: string }) {
  const { id } = payload;
  return axios.delete(`${ip3}/don-vi/${id}`);
}
