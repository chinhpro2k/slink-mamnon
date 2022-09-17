import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import moment from "moment";

export async function getDiemDanhMuon(payload: {
  page?: number;
  limit?: number;
  cond?: any;
  donViId?: string;
  ngay?: number;
  thang?: number;
  nam?: number;
}) {
  const { page, limit, donViId, ngay, thang, nam } = payload;
  return axios.get(
    `${ip3}/diem-danh/trong-muon/don-vi/${donViId}/nam/${nam}/thang/${thang}/ngay/${ngay}`,
    {
      params: {
        page,
        limit,
      },
    },
  );
}
export async function updateDiemDanhMuon(payload: { id: string; data: any }) {
  const { id,data } = payload;
  return axios.put(`${ip3}/diem-danh/diem-danh-muon/${id}`, data);
}
