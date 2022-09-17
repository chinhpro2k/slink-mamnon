import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getLoiDanCuaPhuHuynh(payload) {
  const { page, limit, cond, donViId, timeStart, timeEnd } = payload;
  const vaiTro = localStorage.getItem('vaiTro');
  // eslint-disable-next-line no-param-reassign
  if (vaiTro === 'GiaoVien') {
    return axios.get(`${ip3}/loi-nhan/pageable/giao-vien`, {
      params: {
        page,
        limit,
        donViId: donViId === 'Tất cả' ? null : donViId,
        cond: {
          ...cond,
          createdAt: timeEnd === null ? undefined : { $lte: timeEnd, $gte: timeStart },
        },
      },
    });
  }
  return axios.get(`${ip3}/loi-nhan/pageable`, {
    params: {
      page,
      limit,
      donViId: donViId === 'Tất cả' ? null : donViId,
      cond: {
        ...cond,
        createdAt: timeEnd === null ? undefined : { $lte: timeEnd, $gte: timeStart },
      },
    },
  });
}
