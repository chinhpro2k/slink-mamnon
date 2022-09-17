export declare module ChuongTrinhDaoTao {
  export interface Record {
    _id?: string | any;
    ten: string;
    ma: string;
    moTa: string;
    donViId?: string;
    donVi: {
      tenDonVi: string;
    };
    chuongTrinhDaoTaoId: string;
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
