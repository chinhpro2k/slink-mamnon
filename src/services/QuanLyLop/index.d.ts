export declare module QuanLyLop {
  export interface Record {
    parent: string;
    _id: string;
    ten: string;
    tuoi: number;
    soHocSinh: number;
    soGiaoVien: number;
    chuongTrinhDaoTaoId: string;
    profile: {
      firstname: string;
      lastname: string;
    };
    maLop: string;
    maTruong: string;
    tenDonVi: string;
    doTuoiNhanTre: any;
    sySo: number;
    soQuanLyToiDa: number;
    quyMoTruong?: number | undefined;
    idTruong: string;
    soGiaoVienQuanLyTT: number;
    soHocSinhThucTe: number;
    thang: number;
    nam: number;
    thongTinHocPhi: {
      soTienTrongMuon: number;
      ngayGuiThongBao: string;
      tyLeGiam1: {
        tyLeGiam: number;
        gte: number;
      };
      tyLeGiam2: {
        tyLeGiam: number;
        gte: number;
      };
      tyLeGiam3: {
        tyLeGiam: number;
        gte: number;
      };
    };
    hocPhiDuKien: number;
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

  export interface ViewHocPhi {
    _id: string;
    con: {
      hoTen: string;
    };
    phuHuynh: {
      profile: {
        fullname: string;
        phoneNumber: string;
      };
    };
    trangThaiThanhToan: string;
    thang: number;
    nam: number;
    tienDaDong: number;
    soNgayHocThucTe: number;
    tiLeGiamHocPhi: number;
    hocPhi1Ngay: number;
    tienAn1Ngay: number;
    phuPhi: number;
    soTienTrongMuon1Gio: number;
    soTienTrongMuon: number;
    hocPhiThucTe: number;
    soDu: number;
    hocPhiPhaiDong: number;
  }
}
