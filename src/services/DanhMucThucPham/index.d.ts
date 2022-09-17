export declare module DanhMucThucPham {
  export interface Record {
    loai: string;
    nhomLoaiThucPham: string;
    nguonThucPham: string;
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
    giaTien: number;
    canxi: number;
    heSoThaiBo: string;
    nhom: string;
    tenDayDu: string;
    tenVietTat: string;
    donViTinh: string;
    _id: string;
    loaiThucPham: string;
    donVi: {
      tenDonVi: string;
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
