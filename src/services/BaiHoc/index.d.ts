export declare module BaiHoc {
  export interface Record {
    _id: string;
    tenBaiHoc: string;
    ma: string;
    moTa: string;
    chuongTrinhDaoTaoId: string;
    monHocId: string;
    taiLieu: any[];
    donViId?: string;
    tenDonVi: string;
    tenMonHoc: string;
    chiTiet: string;
    chuongTrinhDaoTao: {
      ten: string;
    };
    donVi: {
      tenDonVi: string;
    };
    doTuoi: string;
    monHoc: {
      ten: string;
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
