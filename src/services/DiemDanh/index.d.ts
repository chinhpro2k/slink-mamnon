export declare module DiemDanh {
  export interface Record {
    _id: string;
    id: string;
    tenDonVi: string;
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
