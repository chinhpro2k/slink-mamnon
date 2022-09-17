export declare module QuanLyDanhGia {
  export interface Record {
    giaoVien: { profile: { fullname: string } };
    index: number;
    daDanhGia: boolean;
    trangThai: boolean;
    ngayKetThuc: MomentInput;
    ngayBatDau: MomentInput;
    chamDiem: {
      cauHoi: string;
      diemToiDa: number;
      diemToiThieu: number;
    };
    noiDungCamKet: string;
    noiDungKhaoSat: any[];
    donViTaoDanhGiaId: string;
    moTa: string;
    tieuDe: string;
    donViId: string[];
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
