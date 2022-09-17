export declare module TaiKhoanPhuHuynh {
  export interface Record {
    childId: string;
    idTruong: string;
    repassword: string;
    hoTenBo: string;
    hoTenMe: string;
    _id: string;
    conId: string;
    maCode: string;
    thangSinh: number | any;
    namSinh: number | any;
    maLop: string;
    username: string;
    hoTen: string;
    password: string;
    trinhDo: string;
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
    systemRoles: string[];
    gioiTinh: string;
    ngaySinh: number | any;
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
    benhNgoaiDa: boolean;
    ghiChuCheDoAn: string;
    cheDoAnDacBiet: boolean;
    coThe: string;
    soDienThoai: string;
    gender: string;
    userId: string;
    ghiChu: string;
    roleId: string;
    organizationId: string;
    child: {
      hoTen: string;
    };
    systemRole: string;
    roles: [
      {
        organizationId: string;
      },
    ];
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
