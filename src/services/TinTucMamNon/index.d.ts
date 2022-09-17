export declare module TinTucMamNon {
  export interface Record {
    donViTaoTinId: string;
    donViId: string[];
    loaiTinTuc: string;
    binhLuan: boolean;
    doiTuong: string[];
    noiDung: string;
    anhDaiDien: {
      url: string;
      mimetype: string;
    };
    moTa: string;
    ngayDang: string;
    tinhNang: string;
    nguoiDoc: string;
    tieuDe: string;
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
