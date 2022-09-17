import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import {ITrongMuon} from "@/services/TrongMuon/index";

export async function getTrongMuon(payload: { page: number; limit: number; cond?: any }) {
  const { page, limit, cond } = payload;
  return axios.get(`${ip3}/trong-muon-ngoai-gio/pageable`, {
    params: {
      page,
      limit,
    },
  });
}
export async function getGiaoVien(payload: {
  donViId: string;
  page: number;
  limit: number;
  cond?: any;
}) {
  const { page, limit, cond, donViId } = payload;
  return axios.get(`${ip3}/ho-so-giao-vien/pageable`, {
    params: {
      donViId,
      page,
      limit,
    },
  });
}
export async function getLop(payload: {
  donViId: string;
  page: number;
  limit: number;
  cond?: any;
}) {
  const { page, limit, cond, donViId } = payload;
  return axios.get(`${ip3}/don-vi/pageable/${donViId}/child`, {
    params: {
      page,
      limit,
    },
  });
}

export async function createTrongMuon(payload: ITrongMuon.DataReq) {
  return axios.post(`${ip3}/trong-muon-ngoai-gio/hieu-truong`, payload);
}

export async function confirmTrongMuon(id: string, trangThai: string) {
  return axios.put(`${ip3}/trong-muon-ngoai-gio/${id}/xac-nhan`, { trangThai: trangThai });
}

export async function updTaiKhoanKhachAd(payload: any) {
  const { id } = payload;
  return axios.put(`${ip3}/user/${id}`, payload);
}

export async function delTaiKhoanKhach(payload: { id: string }) {
  const { id } = payload;
  return axios.delete(`${ip3}/user/${id}`);
}

export async function importTaiKhoanKhach(payload: any) {
  const file = payload?.file.fileList?.[0].originFileObj;
  const form = new FormData();
  form.append('file', file);
  return axios.post(`${ip3}/user/import/excel/guest/${payload?.organizationId}`, form);
}
