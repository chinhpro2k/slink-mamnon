export declare module MonHoc {
  export interface Record {
    _id: string;
    ten: string;
    ma: string;
    moTa: string;
    chuongTrinhDaoTaoId: string;
    chuongTrinhDaoTao: {
      ten: string;
    };
    donViId?: string;
    donVi: {
      tenDonVi: string;
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
