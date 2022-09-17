export declare module KhaoSat {
  export interface CauHoi {
    loai: any;
    batBuoc: boolean;
    noiDungCauHoi: string;
    noiDungKhaoSat: any[];
    cauTraLoiKhac: boolean;
    luaChon: {
      noiDung: string;
      _id: string;
    }[];
    cauTraLoi: {
      noiDung: string;
      isKhac: boolean;
      luaChon: luaChon;
    }[];
    luaChonCot: {
      noiDung: string;
      _id: string;
    }[];
    luaChonHang: {
      noiDung: string;
      _id: string;
    }[];
    gioiHanDuoiTuyenTinh: number;
    gioiHanTrenTuyenTinh: number;
    _id: string;
    cauHoi: string;
    hang: string[];
    cot: string[];
  }

  export interface Khoi {
    tieuDe: string;
    moTa: string;
    danhSachCauHoi: CauHoi[];
  }

  export interface Record {
    noiDungKhaoSat: any;
    coCamKet: boolean;
    noiDungCamKet: string;
    thoiGian?: string[];
    danhSachVaiTro: string[];
    loai: string;
    tieuDe: string;
    moTa: string;
    thoiGianBatDau: string;
    thoiGianKetThuc: string;
    kichHoat: boolean;
    danhSachKhoi: Khoi[];
    doiTuong: string;
    _id: string;
    ngayBatDau: string;
    ngayKetThuc: string;
    trangThai: boolean;
    donViId: string[];
  }

  export interface ThongKeLuaChon {
    cauTraLoi: any;
    tongHop: any;
    cauHoi: string;
    noiDungLuaChon: string;
    idLuaChon: string;
    soLuong: number;
  }

  export interface ThongKeCot {
    idCot: string;
    noiDungCot: string;
    soLuong: number;
  }
  export interface ThongKeLuaChonGrid {
    noiDungHang: string;
    idHang: string;
    thongKeCot: ThongKeCot[];
    tongHop: string[];
    cauHoi: string;
  }

  export interface ThongKeLuaChonNumeric {
    giaTriTuyenTinh: number;
    soLuong: number;
  }

  export interface ThongKeCauHoi {
    _id: string;
    noiDungCauHoi: string;
    loai: string;
    soLuongTraLoi: number;
    ketQua: ThongKeLuaChon[] | ThongKeLuaChonGrid[] | ThongKeLuaChonNumeric[];
  }
  export interface ThongKeKhoi {
    _id: string;
    tieuDe: string;
    loai: number;
    moTa: string;
    cauHoiId: string;
    thongKeCauHoi: ThongKeCauHoi[];
  }

  export interface ThongKe {
    _id: string;
    tieuDe: string;
    moTa: string;
    loai: string;
    thongKeKhoi: ThongKeKhoi[];
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
