export declare module HocSinh {
  export interface Record {
    daDanhGia: boolean;
    donViId: string;
    trangThai: string;
    soDienThoai: string;
    _id: string;
    username: string;
    profile: {
      phoneNumber: string;
      fullname: string;
    };
    userId: string;
    conId: string;
    vaiTro: string;
    loaiThanhToan: string;
    maTruong: string;
    maLop: string;
    hoTen: string;
    ngaySinh: number;
    thangSinh: number;
    namSinh: number;
    con: {
      hoTen: string;
    };
    hinhThucThanhToan: string;
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
