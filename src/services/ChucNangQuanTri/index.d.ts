export declare module ChucNangQuanTri {
  export interface Record {
    _id: string;
    id: string;
    sua: any;
    APISuDung: string[];
    name: string;
    key: string;
    parent: string | null;
    chucNangCha: [
      {
        _id: string;
        ten: string;
        ma: string;
        id: string;
      },
    ];
    vaiTroQuanTriChoPhep: IVaiTro[];
    modules: any[];
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
