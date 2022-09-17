export declare module TaiKhoanKhach {
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
