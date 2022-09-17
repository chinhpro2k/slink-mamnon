import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import { ITienThua } from '@/services/TienThua/index';

export async function getTienThua(payload: {
  donViId: string;
  page: number;
  limit: number;
  cond?: any;
}) {
  const { page, limit, cond, donViId } = payload;
  return axios.get(`${ip3}/khau-phan-an/tien-an/pageable/don-vi/${donViId}`, {
    params: {
      page,
      limit,
      cond,
    },
  });
}
export async function updateTienThua(data: ITienThua.DataReq) {
  const { ngay, thang, nam, donViId, tienHoTro } = data;
  return axios.put(
    `${ip3}/khau-phan-an/tien-an/don-vi/${donViId}/nam/${nam}/thang/${thang}/ngay/${ngay}`,
    {
      tienHoTro: tienHoTro,
    },
  );
}
