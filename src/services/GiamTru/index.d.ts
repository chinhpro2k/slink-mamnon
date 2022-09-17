export declare module GiamTru {
  export interface Record {
    soTien: number;
    ten: string;
    _id: string;
    donViId: string;
    module: boolean;
    loaiDoanhThu: string;
    createdAt: string;
    updatedAt: string;
    ngay: number;
    thang: number;
    nam: number;
    __v: number;
    donVi: {
      _id: string;
      tenDonVi: string;
      id: string;
    };
    id: string;
  }

  export interface Data {
    page: number;
    offset: number;
    limit: number;
    total: number;
    result: Result[];
  }
  export interface DataDetail {
    _id: string;
    donVi: string;
    tongSoTien: number;
  }
  export interface RootObject {
    data: Data;
    statusCode: number;
  }
}
