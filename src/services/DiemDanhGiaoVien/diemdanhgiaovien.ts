import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getDiemDanhGiaoVien(payload: {
  page: number;
  limit: number;
  cond?: any;
  donViId?: string;
  ngay?: number;
  thang?: number;
  nam?: number;
}) {
  const { page, limit, cond, donViId, ngay, thang, nam } = payload;
  return axios.get(`${ip3}/cham-cong/pageable/${donViId}`, {
    params: {
      page,
      limit,
      cond: {
        ...cond,
        ngay,
        thang,
        nam,
        // trangThai: { $ne: 'Chưa chấm công' },
      },
    },
  });
}

export async function xuLyDiemDanhGV(payload: any) {
  const { id } = payload;
  return axios.put(`${ip3}/cham-cong/${id}/trang-thai`, payload);
}
