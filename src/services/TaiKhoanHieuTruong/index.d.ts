export declare module TaiKhoanHieuTruong {
  export interface Record {
    _id: string;
    username: string;
    hoTen: string;
    password: string;
    profile: {
      phoneNumber: string;
      fullname: string;
      dateOfBirth: string;
      firstname: string;
      lastname: string;
      address: string;
      gender: string;
      username: string;
      ngayHetHan: string;
      email: string;
      maTruong: string;
    };
    email: string;
    truong: string;
    expireDate: string;
    roles: [
      {
        listOrgIdAccess: string[];
        organizationId: string;
        roleId: string;
        expireDate: string;
        listTruong: {
          id: string;
          tenDonVi: string;
        }[];
      },
    ];
    tenDonVi: string;
    name: string;
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
