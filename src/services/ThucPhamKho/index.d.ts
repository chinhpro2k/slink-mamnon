export declare module ThucPhamKho {
  export interface Record {
    theTich: number;
    donVi: {
      tenDonVi: string;
    };
    ten: string;
    tenVietTat: string;
    khoiLuong: number;
    soLuong: number;
    loai: string;
    nhomLoai: string;
    nguon: string;
    phanLoai: string;
    tyLeBeo: number;
    tyLeDam: number;
    tyLeDuong: number;
    caloBeo: number;
    caloDuong: number;
    caloDam: number;
    calo: number;
    duong: number;
    beo: number;
    dam: number;
    gia: number;
    heSoThaiBo: number;
    nhom: string;
    tenDayDu: string;
    tenTat: string;
    _id: string;
    ngay: number;
    thang: number;
    nam: number;
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
