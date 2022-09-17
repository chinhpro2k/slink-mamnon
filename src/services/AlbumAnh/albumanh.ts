import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import { AlbumAnh } from '@/services/AlbumAnh/index';

export async function getAlbumAnh(payload: {
  page: number;
  limit: number;
  cond?: any;
  donViId?: string;
}) {
  return axios.get(`${ip3}/album-anh/pageable`, {
    params: {
      ...payload,
      cond: {
        ...payload.cond,
        // senderID: '62331b37f0339ab69d58ce2f',
      },
    },
  });
}
export async function createAlbumAnh(payload: AlbumAnh.DataCreate) {
  return axios.post(`${ip3}/album-anh`, payload);
}
export async function deleteAlbumAnh(id: string) {
  return axios.delete(`${ip3}/album-anh/${id}`);
}
export async function updateAlbumAnh(id: string, payload: AlbumAnh.DataCreate) {
  return axios.put(`${ip3}/album-anh/${id}`, payload);
}
export async function confirmAlbumAnh(id: string, trangThai: string) {
  return axios.put(`${ip3}/album-anh/${id}/xac-nhan`, { trangThai: trangThai });
}
