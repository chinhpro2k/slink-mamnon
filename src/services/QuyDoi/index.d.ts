export declare module IQuiDoi {
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
    };
    email: string;
    truong: string;
  }
  export interface DataCreate {
    "donViQuyDoi": string,
    "donViDuocQuyDoi": string,
    "giaTriDonViQuyDoi": number,
    "giaTriDonViDuocQuyDoi": number,
    "thucPhamId": string
  }

  export interface RootObject {
    data: Data;
    statusCode: number;
  }
}
