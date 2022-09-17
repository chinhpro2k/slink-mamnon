export declare module BaoCaoNoiBo {
  export interface Record {
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
  export interface DataGetBaoCaoNgay {
    ngay: string;
    thang: string;
    nam: string;
    donViId?: string;
  }
  export interface DataGetBaoCaoThang {
    truongId?: string;
    ngay?: number;
    thang?: number;
    nam?: number;
    page?: any;
    limit?: any;
    donViId?: string;
  }
  export interface DataBaoCaoTheoNgay {
    _id: string;
    nam: number;
    ngay: number;
    thang: number;
    truongId: string;
    __v: number;
    createdAt: string;
    soAlbumAnhChuaDuyet: number;
    soAlbumAnhDaDuyet: number;
    soDonDanDonConChuaDuyet: number;
    soDonDanDonConDaDuyet: number;
    soDonDanThuocChuaDuyet: number;
    soDonDanThuocDaDuyet: number;
    soGiaoVienDiLam: number;
    soGiaoVienNghiLam: number;
    soHocSinhDiHoc: number;
    soHocSinhNghiCoPhep: number;
    soHocSinhNghiKhongPhep: number;
    tongSoGiaoVien: number;
    tongSoHocSinh: number;
    tongSoLopHienTai: number;
    updatedAt: string;
    id: string;
  }

  export interface IDataGVThang {
    _id: string;
    luongThoaThuan: number;
    luongDongBaoHiem: 100000;
    thuongThang: 100000;
    phuCap: 100000;
    chucVu: string;
    tiLeDongBaoHiemNhaNuoc: 0;
    tiLeDongBHCuaTruong: 0;
    donViId: string;
    hoTen: string;
    ten: string;
    hoDem: string;
    soDienThoai: string;
    userId: string;
    tiLeDongBHCuaGV: 0;
    soNgayCongQuyDinh: 23;
    createdAt: string;
    updatedAt: string;
    __v: 0;
    soNgayDiLam: 8;
    soNgayKhongDiLam: 6;
    tienLuongThucLinh: 3678260.8695652173;
  }
  export interface IDataHsThang {
    _id: string;
    hoTen: string;
    status: true;
    userId: string;
    __v: 0;
    createdAt: string;
    expireDate: string;
    namSinh: 2022;
    ngaySinh: 7;
    thangSinh: 7;
    updatedAt: string;
    donViId: string;
    user: {
      _id: string;
      profile: {
        fullname: string;
        phoneNumber: string;
        username: string;
        lastname: string;
        firstname: string;
      };
    };
    soNgayDiHoc: 2;
    soNgayNghiCoPhep: 0;
    soNgayNghiKhongPhep: 2;
    hocPhi: 5015000;
  }
  export interface IDataLop {
    _id: '62ba927c54b644a0eb120a0b';
    danhSachCTDTId: ['*'];
    ancestors: string[];
    tenDonVi: 'AIS02';
    parent: '62ba8cc054b644a0eb1209f4';
    doTuoi: 24;
    sySo: 20;
    soQuanLyToiDa: 3;
    loaiHinh: 'Nhà trẻ';
    loaiDonVi: 'Lop';
    thongTinDanhGiaSK: {};
    diemDanhCuoiGio: {};
    diemDanhMuon: {};
    diemDanhLai: {};
    diemDanhDauGio: {};
    createdAt: '2022-06-28T05:32:44.915Z';
    updatedAt: '2022-06-28T05:32:44.915Z';
    __v: 0;
    chuongTrinhDaoTao: null;
    soHocSinhThucTe: 14;
  }
  export interface IDataThang {
    _id: '62d7add33e2816c058ad0ffa';
    nam: 2022;
    thang: 6;
    truongId: '62ba8cc054b644a0eb1209f4';
    __v: 0;
    soGiaoVien: 3;
    soHocSinh: 29;
    soLopHienTai: 2;
  }
  export interface IThongKeThang {
    _id: {
      ngay: 1;
      thang: 7;
      nam: 2022;
    };
    ngay: 1;
    thang: 7;
    nam: 2022;
    soGiaoVienDiLam: 4;
    soGiaoVienNghiLam: 2;
    soHocSinhNghiCoPhep: 0;
    soHocSinhNghiKhongPhep: 44;
    soHocSinhDiHoc: 0;
  }
  export interface IThongKeTaiSanThang {
    tongSoTien: number;
    tongTaiSanHong: number;
    tongTaiSanThanhLy: number;
  }
  export interface IThongKeHocPhiThang {
    tongTienHoc: number;
    tongTienDaDong: number;
    tongSoHocSinh: number;
    soHocSinhDaDong: number;
  }
}
