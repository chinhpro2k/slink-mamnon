export declare module KhoanThu {
  export interface Record {
    soTien: number;
    ten: string;
    _id: string;
    donViId: string;
    loaiDoanhThu: string;
    createdAt: string;
    updatedAt: string;
    ngay: number;
    thang: number;
    nam: number;
    module: boolean;
    __v: number;
    donVi: {
      _id: string;
      tenDonVi: string;
      id: string;
    };
    id: string;
  }
  export interface DataDetailHocPhi {
    _id: string;
    donVi: string;
    tongSoTien: number;
    hocPhi: number;
    tienAn: number;
    soTienTrongMuon: number;
    phuPhiCaNhan: number;
    phuPhiChung: number;
    hocPhiDaDong: number;
  }
  export interface DataDetailNhapTay {
    _id: string;
    ten: string;
    soTien: number;
    ghiChu: string;
    loaiDoanhThu: string;
    donViId: string;
    soTienDuKien: number;
    createdAt: string;
    updatedAt: string;
    ngay: number;
    thang: number;
    nam: number;
    __v: number;
    donVi: {
      _id: string;
      tenDonVi: string;
      id: string;
    };
    id: string;
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
