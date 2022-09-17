export declare module KhauPhanAn {
  export interface Record {
    thanhPhanMonAn: readonly Record[] | undefined;
    monAn: any;
    name: string;
    loaiThucPham: string;
    xuatKho: boolean | undefined;
    donVi: {
      tenDonVi: string;
    };
    _id: string;
    buaAn: [
      {
        monAn: [
          {
            thanhPhanMonAn: any[];
            name: string;
            idMonAn: string;
            weight: number;
            _id: string;
          },
        ];
        name: string;
        _id: string;
      },
    ];
    report: IReport[];
    ngayAn: string;
    soTienAn: number;
    soHocSinh: number;
    donViId: string;
    result: string[];
    type: number;
    tongDinhLuongDieuChinh: number;
  }
  export interface IReport {
    name: 'Calo';
    value: 123.32;
    tongCalo: 686.499155891255;
    tenBua: 'chiều';
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
