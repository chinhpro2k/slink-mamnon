import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getDonDanDonVe(payload: {
  page?: number;
  limit?: number;
  cond?: any;
  donViId?: string;
  timeStart?: any;
  timeEnd?: any;
}) {
  const { page, limit, cond, donViId, timeStart, timeEnd } = payload;
  return axios.get(`${ip3}/dan-don-con/pageable`, {
    params: {
      page,
      limit,
      donViId: donViId === 'Tất cả' ? null : donViId,
      cond: {
        ...cond,
        createdAt: { $lte: timeEnd, $gte: timeStart },
      },
    },
  });
}

export async function acceptDonDanDonVe(payload: any) {
  const { id } = payload;
  return axios.put(`${ip3}/dan-don-con/xac-nhan/${id}`, payload);
}
