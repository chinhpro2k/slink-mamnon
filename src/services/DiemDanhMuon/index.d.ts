export declare module DiemDanhMuon {
  export interface Record {
    _id: string;
    id: string;
    tenDonVi: string;
    conId: string;
    phuHuynhId: string;
    donViId: string;
    trangThai: string;
    con: { hoTen: string };
    gioBatDauTrongMuon: string;
    gioKetThucTrongMuon: string;
    soGioTrongMuon: number;
    thoiGianDiemDanh: Date;
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
