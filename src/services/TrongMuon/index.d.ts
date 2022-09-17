export declare module ITrongMuon {
  export interface Record {
    _id: string;
    thang: number;
    nam: number;
    truongId: string;
    giaoVienId: string;
    giaoVien: {
      _id: string;
      profile: {
        fullname: string;
        phoneNumber: string;
        username: string;
        lastname: string;
        firstname: string;
      };
      roles: {
        listTruongAccess: [];
        listOrgIdAccess: [];
        _id: string;
        roleId: string;
        systemRole: string;
        name: string;
        organization: {
          _id: string;
          tenDonVi: string;
          id: string;
        };
      }[];
    };
    chiTietTrongMuon: {
      danhSachLopDangKyId: string[];
      _id: string;
      ngay: number;
      lop: {
        _id: string;
        tenDonVi: string;
        id: string;
      }[];
    }[];
    trangThai: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    id: string;
  }
  export interface DataReq {
    chiTietTrongMuon: DataChiTietTrongMuon[];
    truongId: string;
    giaoVienId: string;
    nam: number;
    thang: number;
  }
  export interface DataChiTietTrongMuon {
    ngay: number;
    danhSachLopDangKyId: string[];
  }

  export interface DataGiaoVien {
    _id: string;
    luongThoaThuan: number;
    luongDongBaoHiem: number;
    thuongThang: number;
    phuCap: number;
    chucVu: string;
    tiLeDongBaoHiemNhaNuoc: number;
    tiLeDongBHCuaTruong: number;
    donViId: string;
    hoTen: string;
    ten: string;
    hoDem: string;
    soDienThoai: string;
    userId: string;
    tiLeDongBHCuaGV: number;
    soNgayCongQuyDinh: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
    donVi: {
      _id: string;
      tenDonVi: string;
      id: string;
    };
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
    id: string;
  }
  export interface DataLop {
    _id: string;
    danhSachCTDTId: string[];
    ancestors: string[];
    tenDonVi: string;
    chuongTrinhDaoTaoId: string;
    doTuoi: number;
    sySo: number;
    soQuanLyToiDa: number;
    loaiHinh: string;
    loaiDonVi: string;
    parent: string;
    thongTinDanhGiaSK: {};
    diemDanhCuoiGio: {};
    diemDanhMuon: {};
    diemDanhLai: {};
    diemDanhDauGio: {};
    createdAt: string;
    updatedAt: string;
    __v: number;
    chuongTrinhDaoTao: {
      _id: string;
      ten: string;
      moTa: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
    soHocSinhThucTe: number;
    soGiaoVienQuanLyTT: number;
  }
}
