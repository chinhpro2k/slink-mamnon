export declare module DonViHanhChinh {
  export interface Record {
    maPhuongXa?: string;
    maQuanHuyen?: string;
    maTinh?: string;
    soNhaTenDuong?: string;
    tenPhuongXa?: string;
    tenQuanHuyen?: string;
    tenTinh?: string;
    tenDonVi?: string;
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
