export declare module TaiKhoanGiaoVien {
  export interface Record {
    _id: string;
    username: string;
    hoTen: string;
    userId: string;
    password: string;
    roles: [
      {
        organizationId: string;
        roleId: string;
      },
    ];
    profile: {
      phoneNumber: string;
      fullname: string;
      dateOfBirth: string;
      firstname: string;
      lastname: string;
      address: string;
      gender: string;
      trinhDo: string;
      email: string;
      username: string;
    };
    email: string;
    truong: string;
    expireDate: string;
    phoneNumber: string;
    fullname: string;
    dateOfBirth: string;
    gender: string;
    trinhDo: string;
    roleId: string;
    systemRole: string;
    organizationId: string;
    idTruong: string;
    ngayCongQuyDinh: number;
    luongThoaThuan: number;
    luongDongBaoHiem: number;
    thuongThang: number;
    phuCap: number;
    tiLeDongBaoHiemNhaNuoc: number;
    tiLeDongBHCuaTruong: number;
    tiLeDongBHCuaGV: number;
    chucVu: string;
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
