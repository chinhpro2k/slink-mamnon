export declare module DiemDanhGiaoVien {
  export interface Record {
    _id: string;
    content: string;
    taiLieu: any[];
    trangThai: string;
    profile: {
      fullname: string;
      phoneNumber: string;
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
