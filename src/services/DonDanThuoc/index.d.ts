export declare module DonDanThuoc {
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
    ghiChu: string;
    xacNhan: any[];
    tuNgay: string;
    denNgay: string;
    lieuThuoc: array<{
      tenThuoc: string;
      cachDung: string;
    }>;
    file: {
      url: string;
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
