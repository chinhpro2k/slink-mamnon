import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getDiemDanh(payload: {
  page?: number;
  limit?: number;
  cond?: any;
  parent?: string | undefined;
}) {
  const { page, limit, cond, parent } = payload;
  const vaiTro = localStorage.getItem('vaiTro');
  if (cond?.parent === 'Tất cả') delete cond?.parent;
  if (vaiTro === 'GiaoVien') {
    return axios.get(`${ip3}/don-vi/pageable`, {
      params: {
        page,
        limit,
        cond: {
          _id: parent,
          ...cond,
        },
      },
    });
  }
  return axios.get(`${ip3}/don-vi/pageable/my/child`, {
    params: {
      page,
      limit,
      cond: {
        parent: cond?.parent,
        loaiDonVi: 'Lop',
        ...cond,
      },
    },
  });
}
