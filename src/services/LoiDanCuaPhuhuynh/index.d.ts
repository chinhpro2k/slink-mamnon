export declare module LoiDanCuaPhuHuynh {
  export interface Record {
    _id: string;
    id: string;
    tenDonVi: string;
    con: {
      hoTen: string;
    };
    phuHuynh: {
      profile: {
        fullname: string;
        phoneNumber: string;
      };
    };
    thoiGianXinNghi: string;
    donVi: {
      tenDonVi: string;
    };
    noiDung: string;
    loaiLoiNhan: string;
    ngayNhan: string;
    chuyenMuc: string;
    file: {
      url: string;
    };
    giaoVien: {
      profile: {
        fullname: string;
      };
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
