export declare module VaiTroQuanTri {
  export interface Record {
    tenVaiTro: string;
    _id: string;
    modules: any[];
    name: string;
    _id: string;
    parent: string;
    key: string;
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
