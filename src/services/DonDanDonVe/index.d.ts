export declare module DonDanDonVe {
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
    lyDo: string;
    createdAt: string;
    hoTen: string;
    ghiChu: string;
    xacNhan: boolean;
    thoiDiemDon: string;
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
