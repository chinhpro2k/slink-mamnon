export declare module ThongTinHocPhi {
  export interface Record {
    donViId: string;
    trangThaiThanhToan: boolean;
    tienDaDong: number;
    soNgayHocThucTe: number;
    soTienTrongMuon1Gio: number;
    _id: string;
    thang: number;
    nam: number;
    truongId: string;
    lopId: string;
    hocPhi1Ngay: number;
    tienAn1Ngay: number;
    phuPhi: number;
    tienHocBanDau: number;
    soNgayHocDuKien: number;
    userId: string;
    soNgayDiHoc: number;
    soNgayNghiCoPhep: number;
    soNgayNghiKhongPhep: number;
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
