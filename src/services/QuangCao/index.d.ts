export declare module QuangCao {
  export interface Record {
    donViId: string;
    hanCuoi: string;
    viTri: string;
    mucLuong: number;
    _id: string;
    tieuDe: string;
    loaiTin: string;
    moTa: string;
    anhDaiDien: string;
    ngayDang: string;
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
