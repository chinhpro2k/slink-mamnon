export declare module ITienThua {
  export interface Record {
    _id: string;
    donViId: string;
    nam: number;
    ngay: number;
    thang: number;
    __v: number;
    createdAt: string;
    tienHoTro: number;
    updatedAt: string;
  }
  export interface DataReq {
    donViId: string;
    nam: number;
    thang: number;
    ngay: number;
    tienHoTro: number;
  }
}
