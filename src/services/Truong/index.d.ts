export declare module Truong {
  export interface Record {
    danhSachCTDTId: array<string>;
    _id?: string | any;
    tenDonVi: string;
    ma: string;
    maTruong: string;
    nhapSoLuongHocSinh: boolean;
    chuongTrinhDaoTaoId: string;
    chuongTrinhDaoTao: {
      ten: string;
      _id: string;
    };
    parent: string;
    duyetAlbumAnh: boolean;
    duyetDonTrongMuon: boolean;
    cachTinhPhiTrongMuon: string;
    diaChi: {
      maTinh: string;
      tenTinh: string;
      maQuanHuyen: string;
      tenQuanHuyen: string;
      maPhuongXa: string;
      tenPhuongXa: string;
      soNhaTenDuong: string;
    };
    expireDate: string;
    email: string;
    fanpageTruong: string;
    quyMoTruong: string;
    hinhAnhDaiDienTruong: string;
    ngayHocTrongTuan: string;
    thoiGianMoCua: string;
    thoiGianDongCua: string;
    doTuoiNhanTre: number;
    mucDongHocPhi: number | bigint;
    soDienThoaiTruong: string;
    sanNgoaiTroi: string;
    sanTrongNha: string;
    camera: string;
    mayChieu: boolean;
    anSang: boolean;
    donMuon: boolean;
    phongDaNang: boolean;
    xeDuaDon: boolean;
    hinhThucThanhToan: string;
    doTuoi: number;
    sySo: number;
    soQuanLyToiDa: number;
    diemDanhMuon: {
      gioBatDau: string;
      gioKetThuc: string;
    };
    diemDanhLai: {
      gioBatDau: string;
      gioKetThuc: string;
    };
    diemDanhDauGio: {
      gioBatDau: string;
      gioKetThuc: string;
    };
    diemDanhCuoiGio: {
      gioBatDau: string;
      gioKetThuc: string;
    };
    thongTinHocPhi: {
      soNgayHocDuKien: number;
      ngayGuiThongBao: string;
      soNgayHocThucTeThangTruoc: number;
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
      quyTacTinhHocPhi: string[];
      soNgayLamViec: number;
      soNgayLamViecThangTruoc: number;
    };
    thang: number;
    nam: number;
    truongId: string;
    thongTinDanhGiaSK: {
      lapLai: boolean;
      ngayGuiThongBao: string;
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
