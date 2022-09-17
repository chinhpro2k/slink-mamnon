export declare module HoatDongNgoaiKhoa {
  export interface Record {
    index: number;
    soLanLap: number;
    loaiLap: string;
    _id: string;
    tenHoatDong: string;
    diaDiem: {
      soNhaTenDuong: string;
      tenTinh: string;
      tenQuanHuyen: string;
      tenPhuongXa: string;
    };
    thoiGianDuKien: {
      thoiGianBatDau: string;
      thoiGianKetThuc: string;
    };
    thoiGianDangKy: {
      thoiGianBatDau: string;
      thoiGianKetThuc: string;
    };
    chiPhiDuKien: number;
    donViToChuc: {
      tenDonVi: string;
    };
    files: {
      url: string;
    }[];
    donViToChucId: string;
    donViId: string[];
    loaiTinTuc: string;
    diemDanhDauGio: {
      gioBatDau: string;
      gioKetThuc: string;
    };
    diemDanhCuoiGio: {
      gioBatDau: string;
      gioKetThuc: string;
    };
  }
  export interface Data {
    page: number;
    offset: number;
    limit: number;
    total: number;
    result: Result[];
  }

  export interface RootObject {
    data: Data;
    statusCode: number;
  }
}
