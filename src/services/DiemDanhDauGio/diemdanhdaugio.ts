import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getDiemDanhDauGio(payload: {
  page?: number;
  limit?: number;
  cond?: any;
  donViId?: string;
  ngay?: number;
  thang?: number;
  nam?: number;
}) {
  const { page, limit, cond, donViId, ngay, thang, nam } = payload;
  return axios.get(`${ip3}/diem-danh/pageable`, {
    params: {
      page,
      limit,
      cond: {
        ...cond,
        ngay,
        thang,
        nam,
        donViId,
      },
    },
  });
}
export async function updateDiemDanh(payload: { id: string; data: any }) {
  const { data, id } = payload;
  return axios.put(`${ip3}/diem-danh/${id}/update-thoi-gian-diem-danh`, data);
}
