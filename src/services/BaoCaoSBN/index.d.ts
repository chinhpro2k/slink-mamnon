export declare module BaoCaoSBN {
  export interface Record {
    _id: string;
    ten: string;
    fileDinhKem: string[];
    ghiChu: string;
    donViId: string;
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
