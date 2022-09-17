export declare module KhaiBaoThongTin {
  export interface Record {
    parent: string;
    status: boolean;
    _id: string;
    thangSinh: number;
    namSinh: number;
    maLop: string;
    username: string;
    maHocSinh: string;
    bietDanh: string;
    hoTen: string;
    password: string;
    expireDate: string;
    profile: {
      phoneNumber: string;
      fullname: string;
      dateOfBirth: string;
      firstname: string;
      lastname: string;
      address: string;
      gender: string;
      username: string;
      email: string;
      trinhDo: string;
    };
    user: {
      profile: {
        phoneNumber: string;
        fullname: string;
        username: sting;
      };
    };
    donVi: {
      tenDonVi: string;
    };
    systemRoles: string[];
    gioiTinh: string;
    ngaySinh: number;
    maTruong: string;
    lopHoc: string;
    hocPhiHangThang: number;
    tienAnHangThang: number;
    phuPhiHangThang: number;
    tongTienGiamTru: number;
    tongTienHocPhaiDong: number;
    soNgayHoc: number;
    nhanXet: string;
    email: string;
    truong: string;
    fullnameCon: string;
    vaiTro: string;
    nhomMau: string;
    chieuCao: number;
    canNang: number;
    ghiChuBenhVeMat: string;
    benhVeMat: boolean;
    ghiChuBenhVeMui: string;
    benhVeMui: boolean;
    ghiChuBenhVeTai: string;
    benhVeTai: boolean;
    ghiChuCheDoAn: string;
    cheDoAnDacBiet: boolean;
    coThe: string;
    gender: string;
    hoTenBo: string;
    hoTenMe: string;
    conId: string;
    maCode: string;
    soDienThoai: string;
    userId: string;
    trinhDo: string;
    benhNgoaiDa: boolean;
    ghiChuBenhNgoaiDa: string;
    ghiChu: string;
    donViId: string;
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
