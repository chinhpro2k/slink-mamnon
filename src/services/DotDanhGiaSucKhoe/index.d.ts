export declare module DotDanhGiaSucKhoe {
  export interface Record {
    donVi: { tenDonVi: string };
    donViId: string;
    moTa: string;
    thoiGianDanhGia: {
      thoiGianBatDau: string;
      thoiGianKetThuc: string;
    };
    ten: string;
    _id: string;
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
