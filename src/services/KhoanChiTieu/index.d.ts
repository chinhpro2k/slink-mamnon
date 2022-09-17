export declare module KhoanChiTieu {
  export interface Record {
    soTien: number;
    ten: string;
    _id: string;
    donViId: string;
    loaiDoanhThu: 'Hệ thống';
    nam: 2022;
    thang: 6;
    __v: 0;
    createdAt: '2022-07-28T07:50:02.593Z';
    module: true;
    updatedAt: '2022-07-28T07:50:12.688Z';
    donVi: {
      _id: '62e0c533b935bcaf65310b8a';
      tenDonVi: 'A.I.Soft';
      id: '62e0c533b935bcaf65310b8a';
    };
    id: '62e23faa3e2816c058232aed';
  }

  export interface Data {
    page: number;
    offset: number;
    limit: number;
    total: number;
    result: Result[];
  }
  export interface IDataChiCoGiao {
    _id: '62bdeba83e2816c058ffdf49';
    nam: 2022;
    thang: 6;
    userId: '62ba8dd554b644a0eb1209ff';
    __v: 0;
    chucVu: 'Giáo viên';
    createdAt: '2022-06-30T18:30:00.056Z';
    donViId: '62ba8cc054b644a0eb1209f4';
    hoTen: 'Hiệu Trưởng Trường A.i.soft';
    luongDongBaoHiem: 100000;
    luongThoaThuan: 10000000;
    luongThucTe: 3678260.8695652173;
    ngayCongThucTe: 8;
    phuCap: 100000;
    soDienThoai: '0357618629';
    thuongThang: 100000;
    tienDongBHCuaGV: 0;
    tienDongBHCuaTruong: 0;
    updatedAt: '2022-07-11T10:59:26.679Z';
    ngayCongQuyDinh: 23;
    id: '62bdeba83e2816c058ffdf49';
  }
  export interface IDataHoaDon {
    _id: {
      ngay: number;
      thang: number;
      nam: number;
    };
    ngay: number;
    thang: number;
    nam: number;
    tongSoTien: number;
  }
  export interface IDataLuong {
    _id: string;
    hoTen: string;
    tongSoTien: number;
  }
  export interface RootObject {
    data: Data;
    statusCode: number;
  }
}
