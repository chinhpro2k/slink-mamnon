/* eslint-disable @typescript-eslint/method-signature-style */
export declare module LichHoc {
  export interface Record {
    noiDungHoatDong: string;
    moTaHoatDong: string;
    thoiGianBatDau: string;
    thoiGianKetThuc: string;
    _id: string;
    ten: string;
    ma: string;
    mota: string;
    donViId: string;
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
