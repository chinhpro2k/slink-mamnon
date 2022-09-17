export declare module ThongBao {
  export interface Record {
    _id: string;
    content: string;
    taiLieu: any[];
    htmlContent: string;
    title: string;
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
