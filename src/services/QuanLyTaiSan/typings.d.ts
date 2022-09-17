export declare module QuanLyTaiSan {
  export interface DanhMucTaiSan {
    ghiChu: string;
    _id: string;
    tenDayDu: string;
    loaiTaiSan: string;
    soLuong: number;
    soLuongTot: number;
    soLuongHong: number;
    giaTri: number;
    ghiChu: string;
    lopId: string;
    truongId: string;
    truong: {
      tenDonVi: string;
    };
    lop: {
      tenDonVi: string;
    };
  }
  export interface BaoHong {
    taiSanId: string;
    trangThai: string;
    ghiChu: string;
    _id: string;
    tenDayDu: string;
    loaiTaiSan: string;
    soLuong: number;
    giaTri: number;
    ghiChu: string;
    lopId: string;
    truongId: string;
    truong: {
      tenDonVi: string;
    };
    lop: {
      tenDonVi: string;
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
