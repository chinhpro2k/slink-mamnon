export declare module DanhMucMonAn {
  export interface Record {
    loaiHinh: string;
    donViId: string;
    ten: string;
    thanhPhanMonAn: {
      ten: string;
      dinhLuongMauGiao: number;
      dinhLuongNhaTre: number;
      donGia: number;
      tyLeThai: number;
      protid: number;
      lipid: number;
      glucid: number;
      calo: number;
      _id: string;
      loaiThucPham: string;
    }[];
    monAn: array<{}>;
    _id: string;
    trietKhauTienAn: number;
    tienAn1Ngay: number;
    soBua: number;
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
