export declare module GiaoVien {
  export interface Record {
    donViId: string;
    trangThai: string;
    soDienThoai: string;
    _id: string;
    username: string;
    profile: {
      fullname: string;
      gender: string;
      email: string;
      dateOfBirth: string;
      trinhDo: string;
      phoneNumber: string;
    };
    expireDate: string;
    user: {
      profile: {
        fullname: string;
        gender: string;
        email: string;
        dateOfBirth: string;
        trinhDo: string;
        phoneNumber: string;
      };
    };
    userId: string;
    conId: string;
    vaiTro: string;
    loaiThanhToan: string;
    maTruong: string;
    maLop: string;
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
