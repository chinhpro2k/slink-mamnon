export declare module ThongKeLuong {
  export interface Record {
    _id: string;
    hoTen: string;
    soDienThoai: string;
    ngayCongQuyDinh: number;
    ngayCongThucTe: number;
    luongThoaThuan: number;
    luongThang: number;
    thuongThang: number;
    phuCap: number;
    tienDongBHCuaTruong: number;
    tienDongBHCuaGV: number;
    luongThucTe: number;
    donViId: string;
    userId: string;
    luongDongBaoHiem: number;
    chucVu: string;
    tiLeDongBaoHiemNhaNuoc: number;
    tiLeDongBHCuaTruong: number;
    tiLeDongBHCuaGV: number;
    soGioTrongMuon: number;
    soTienTrongMuon1Gio?: number;
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
