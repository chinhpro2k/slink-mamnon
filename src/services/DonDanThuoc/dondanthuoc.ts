import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getDonDanThuoc(payload: {
  page?: number;
  limit?: number;
  cond?: any;
  donViId?: string;
  timeStart?: any;
  timeEnd?: any;
}) {
  const { page, limit, cond, donViId, timeStart, timeEnd } = payload;
  return axios.get(`${ip3}/dan-thuoc/pageable`, {
    params: {
      page,
      limit,
      donViId: donViId === 'Tất cả' ? null : donViId,
      cond: {
        ...cond,
        tuNgay: { $lte: timeStart },
        denNgay: { $gte: timeEnd },
      },
    },
  });
}

export async function acceptDonDanThuoc(payload: any) {
  const { id, ngay, thang, nam } = payload;
  return axios.put(`${ip3}/dan-thuoc/xac-nhan/${id}/ngay/${ngay}/thang/${thang}/nam/${nam}`);
}
