import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getKhauPhanAn(payload: {
  page: number;
  limit: number;
  cond?: any;
  loaiHinh?: string;
  sort?: any;
}) {
  const { page, limit, cond, loaiHinh, sort } = payload;
  return axios.get(`${ip3}/khau-phan-an/pageable`, {
    params: {
      page,
      limit,
      cond: {
        loaiHinh,
        ...cond,
      },
      sort,
    },
  });
}

export async function addKhauPhanAn(payload: any) {
  return axios.post(`${ip3}/khau-phan-an/many`, payload);
}

export async function addThongTinKhauPhanAn(payload: any) {
  return axios.post(`${ip3}/thong-tin-khau-phan-an`, payload);
}

export async function dieuChinhKhauPhanAn(payload: any) {
  return axios.post(`${ip3}/khau-phan-an/dieu-chinh`, payload);
}

export async function updKhauPhanAn(payload: any) {
  const { id } = payload;
  return axios.put(`${ip3}/khau-phan-an/${id}`, payload);
}

export async function updThongTinKhauPhanAn(payload: any) {
  const { id } = payload;
  return axios.put(`${ip3}/thong-tin-khau-phan-an/${id}`, payload);
}

export async function delKhauPhanAn(payload: any) {
  const { id } = payload;
  return axios.delete(`${ip3}/khau-phan-an/${id}`);
}

export async function exportKhauPhanAn(payload: any) {
  const { id } = payload;
  return axios.put(`${ip3}/khau-phan-an/${id}/xuat-kho`, null, { params: payload });
}

export async function exportMau1(payload: any) {
  const { donViId } = payload;
  return axios.get(`${ip3}/khau-phan-an/export/mau-1/${donViId}`, {
    responseType: 'arraybuffer',
    params: payload,
  });
}
export async function exportMau2(payload: any) {
  const { donViId } = payload;
  return axios.get(`${ip3}/khau-phan-an/export/mau-2/${donViId}`, {
    responseType: 'arraybuffer',
    params: payload,
  });
}
export async function exportMau3(payload: any) {
  const { donViId } = payload;
  return axios.get(`${ip3}/khau-phan-an/export/mau-3/${donViId}`, {
    responseType: 'arraybuffer',
    params: payload,
  });
}
export async function exportMau4() {
  return axios.get(`${ip3}/khau-phan-an/export/mau-4`, {
    responseType: 'arraybuffer',
  });
}
export async function exportMau5(payload: any) {
  const { donViId } = payload;
  return axios.get(`${ip3}/khau-phan-an/export/mau-5/${donViId}`, {
    responseType: 'arraybuffer',
    params: payload,
  });
}
