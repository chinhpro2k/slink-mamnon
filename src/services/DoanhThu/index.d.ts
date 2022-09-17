export declare module DoanhThu {
  export interface Record {
    khoanGiamTru: any[];
    khoanThu: any[];
    khoanChi: any[];
    thang: number;
    nam: number;
    _id: string;
    soTienThu: number;
    soTienGiamTru: number;
    soTienChi: number;
    doanhThu: number;
    donViId: string;
    tenDonVi: string;
    loaiDoanhThu: 'Hệ thống';
    __v: 0;
    createdAt: '2022-07-27T08:21:29.635Z';
    doanhThuDuKien: 19985384.615384616;
    doanhThuThucTe: 19985384.615384616;
    soTienThuDuKien: 22270000;
    soTienThuThucTe: 22270000;
    updatedAt: '2022-07-28T08:17:28.412Z';
    donVi: {
      _id: '62e0c533b935bcaf65310b8a';
      tenDonVi: 'A.I.Soft';
      id: '62e0c533b935bcaf65310b8a';
    };
    id: '62e0f5893e2816c05814525e';
    index: 1;
  }
  export interface IDataHocPhiTruong {
    _id: '62ba8e1454b644a0eb120a07';
    donVi: 'AIS01';
    tongSoTien: 95680000;
    hocPhiDaDong: 2905000;
  }
  export interface IDataHoaDonMuaHang {
    _id: 'Gia vị';
    tenTP: 'Gia vị';
    tongSoTien: 4919.3407011883355;
  }
  export interface IDataDoanhThuDonVi {
    _id: '62ccfa9b406a3aefd01be18a';
    donViId: '62ba8cc054b644a0eb1209f4';
    loaiDoanhThu: 'Hệ thống';
    nam: 2022;
    thang: 6;
    soTienChi: 11010147.826086957;
    soTienGiamTru: 0;
    khoanGiamTru: [{}];
    khoanChi: [{}];
    khoanThu: [{}];
    createdAt: '2022-07-12T04:37:47.972Z';
    updatedAt: '2022-07-21T05:08:07.516Z';
    __v: 0;
    doanhThuDuKien: 174814852.17391303;
    doanhThuThucTe: 609852.173913043;
    soTienThuDuKien: 185825000;
    soTienThuThucTe: 11620000;
    id: '62ccfa9b406a3aefd01be18a';
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
