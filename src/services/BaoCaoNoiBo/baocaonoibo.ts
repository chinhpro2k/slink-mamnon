/* eslint-disable no-underscore-dangle */
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import { BaoCaoNoiBo, DataGetBaoCaoNgay } from '@/services/BaoCaoNoiBo/index';

export async function getCountLop(donViId: any) {
  return axios.get(`${ip3}/dashboard/count/lop`, {
    params: {
      donViId,
    },
  });
}

export async function getCountHS(donViId: any) {
  return axios.get(`${ip3}/dashboard/count/hoc-sinh`, {
    params: {
      donViId,
    },
  });
}

export async function getCountGV(donViId: any) {
  return axios.get(`${ip3}/dashboard/count/user/vai-tro`, {
    params: {
      donViId,
      systemRole: 'GiaoVien',
    },
  });
}

export async function getDiemDanhHS(donViId: any) {
  return axios.get(`${ip3}/dashboard/diem-danh`, {
    params: {
      donViId,
    },
  });
}

export async function getDiemDanhGV(donViId: any) {
  return axios.get(`${ip3}/dashboard/giao-vien/diem-danh`, {
    params: {
      donViId,
    },
  });
}

export async function getThongKeHocSinh(payload: any) {
  return axios.get(`${ip3}/dashboard/hoc-sinh`, {
    params: payload,
  });
}

export async function getThongKeGiaoVien(payload: any) {
  return axios.get(`${ip3}/dashboard/giao-vien`, {
    params: payload,
  });
}

export async function getLop(payload: any) {
  const { page, limit, donViId } = payload;
  return axios.get(`${ip3}/don-vi/pageable/my/child`, {
    params: {
      page,
      limit,
      cond: {
        parent: donViId,
        loaiDonVi: 'Lop',
      },
    },
  });
}

export async function getBaoCaoTheoNgay(payload: BaoCaoNoiBo.DataGetBaoCaoNgay) {
  const { ngay, thang, nam, donViId } = payload;
  return axios.get(
    `${ip3}/bao-cao-noi-bo-v2/thong-ke-theo-ngay/ngay/${ngay}/thang/${thang}/nam/${nam}/don-vi/${donViId}`,
  );
}
export async function getBaoCaoTheoNgayChuTruong(payload: BaoCaoNoiBo.DataGetBaoCaoNgay) {
  const { ngay, thang, nam } = payload;
  return axios.get(
    `${ip3}/bao-cao-noi-bo-v2/thong-ke-bao-cao-ngay/ngay/${ngay}/thang/${thang}/nam/${nam}`,
  );
}
export async function getBaoCaoTheoThangChuTruong(payload: BaoCaoNoiBo.DataGetBaoCaoNgay) {
  const { ngay, thang, nam } = payload;
  return axios.get(`${ip3}/bao-cao-noi-bo-v2/thong-ke-bao-cao-thang/thang/${thang}/nam/${nam}`);
}
export async function getBaoCaoHocSinhTheoThang(payload: BaoCaoNoiBo.DataGetBaoCaoThang) {
  const { thang, nam, truongId } = payload;
  return axios.get(
    `${ip3}/bao-cao-noi-bo-v2/thong-ke-hoc-sinh-thang/truong/${truongId}/thang/${thang}/nam/${nam}`,
    { params: { page: payload.page, limit: payload.limit, donViId: payload.donViId } },
  );
}
export async function getBaoCaoGiaoVienTheoThang(payload: BaoCaoNoiBo.DataGetBaoCaoThang) {
  const { thang, nam, truongId } = payload;
  return axios.get(
    `${ip3}/bao-cao-noi-bo-v2/thong-ke-giao-vien-thang/truong/${truongId}/thang/${thang}/nam/${nam}`,
    { params: { page: payload.page, limit: payload.limit } },
  );
}
export async function getBaoCaoThang(payload: BaoCaoNoiBo.DataGetBaoCaoThang) {
  const { thang, nam, truongId } = payload;
  return axios.get(
    `${ip3}/bao-cao-noi-bo-v2/bao-cao-noi-bo-thang/truong/${truongId}/thang/${thang}/nam/${nam}`,
  );
}
export async function getLopHocSinh(payload: { page: number; limit: number; cond?: any }) {
  return axios.get(`${ip3}/don-vi/pageable/my/child`, { params: payload });
}
export async function getLopHocSinhWithSchool(
  donViId: string,
  payload: { page: number; limit: number; cond?: any },
) {
  return axios.get(`${ip3}/don-vi/pageable/${donViId}/child`, { params: payload });
}
export async function tinhLaiBaoCao(payload: BaoCaoNoiBo.DataGetBaoCaoThang) {
  const { ngay, thang, nam, truongId } = payload;
  return axios.put(
    `${ip3}/bao-cao-noi-bo-v2/tinh-lai-bao-cao-noi-bo/truong/${truongId}/ngay/${ngay}/thang/${thang}/nam/${nam}`,
  );
}
export async function tinhLaiBaoCaoThang(payload: BaoCaoNoiBo.DataGetBaoCaoThang) {
  const { ngay, thang, nam, truongId } = payload;
  return axios.put(
    `${ip3}/bao-cao-noi-bo-v2/bao-cao-noi-bo-thang/truong/${truongId}/thang/${thang}/nam/${nam}`,
  );
}
export async function tinhLaiBaoCaoNgayChuTruong(payload: BaoCaoNoiBo.DataGetBaoCaoThang) {
  const { ngay, thang, nam, truongId } = payload;
  return axios.put(
    `${ip3}/bao-cao-noi-bo-v2/chu-truong/bao-cao-noi-bo-ngay/ngay/${ngay}/thang/${thang}/nam/${nam}`,
  );
}
export async function tinhLaiBaoCaoThangChuTruong(payload: BaoCaoNoiBo.DataGetBaoCaoThang) {
  const { ngay, thang, nam, truongId } = payload;
  return axios.put(
    `${ip3}/bao-cao-noi-bo-v2/chu-truong/bao-cao-noi-bo-thang/thang/${thang}/nam/${nam}`,
  );
}
export async function thongKeBaoCaoThang(payload: BaoCaoNoiBo.DataGetBaoCaoThang) {
  const { thang, nam, truongId } = payload;
  return axios.get(
    `${ip3}/bao-cao-noi-bo-v2/thong-ke-bao-cao-noi-bo-thang/truong/${truongId}/thang/${thang}/nam/${nam}`,
  );
}
export async function thongKeBaoCaoThangChuTruong(payload: BaoCaoNoiBo.DataGetBaoCaoNgay) {
  const { thang, nam } = payload;
  return axios.get(
    `${ip3}/bao-cao-noi-bo-v2/thong-ke-bao-cao-noi-bo-thang/chu-truong/thang/${thang}/nam/${nam}`,
  );
}
export async function thongKeTaiSanThang(truongId: string) {
  return axios.get(`${ip3}/bao-hong/thong-ke-tai-san/truong/${truongId}`);
}
export async function thongKeTaiSanThangChuTruong() {
  return axios.get(`${ip3}/bao-hong/chu-truong/thong-ke-tai-san`);
}
export async function thongKeTienHoc(truongId: string, thang: number, nam: number) {
  return axios.get(
    `${ip3}/doanh-thu/hoc-phi/stat-hoc-sinh/truong/${truongId}/thang/${thang}/nam/${nam}`,
  );
}
export async function thongKeTienHocChuTruong(thang: number, nam: number) {
  return axios.get(`${ip3}/doanh-thu/chu-truong/hoc-phi/stat/thang/${thang}/nam/${nam}`);
}
