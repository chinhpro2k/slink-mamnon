export declare module AlbumAnh {
  export interface Record {
    danhSachNguoiThichId: [];
    _id: string;
    ten: string;
    moTa: string;
    donViId: string;
    files: {
      url: string;
      _id: string;
      mimetype: string;
      filename: string;
    }[];
    nguoiTaoId: string;
    soBinhLuan: 0;
    trangThai: string;
    createdAt: string;
    updatedAt: string;
    soVideo: 0;
    soAnh: 1;
    __v: 0;
    donVi: {
      _id: string;
      tenDonVi: string;
      id: string;
    };
    nguoiTao: {
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
    index: number;
  }
  export interface Data {
    page: number;
    offset: number;
    limit: number;
    total: number;
    result: Result[];
  }
  export interface DataCreate {
    ten: 'string';
    moTa: 'string';
    donViId: 'string';
    files: [
      {
        filename: 'string';
        url: 'string';
        mimetype: 'string';
      },
    ];
    trangThai: 'CHO_XU_LY';
  }

  export interface RootObject {
    data: Data;
    statusCode: number;
  }
}
