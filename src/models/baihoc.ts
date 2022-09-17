import { getBaiHoc } from '@/services/BaiHoc/baihoc';
import { useState } from 'react';
import type { BaiHoc } from '@/services/BaiHoc';

export default () => {
  const [danhSach, setDanhSach] = useState<BaiHoc.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const vaiTro = localStorage.getItem('vaiTro');
  const getBaiHocModel = async (passPayload?: any) => {
    setLoading(true);
    const payload = passPayload;
    let response;
    if (!window.location.pathname.includes('/quanlylichhoc/thongtindaotao/quanlybaihoc')) {
      response = await getBaiHoc({
        page: payload?.page ?? page,
        limit: payload?.limit ?? limit,
        cond: {
          ...(payload?.cond ?? cond),
        },
      });
    } else {
      if (vaiTro !== 'SuperAdmin' && vaiTro !== 'Admin') {
           response = await getBaiHoc({
             page: payload?.page ?? page,
             limit: payload?.limit ?? limit,
             cond: {
               ...(payload?.cond ?? cond),
               donViId: { $exists: false },
             },
           });
         } else {
           response = await getBaiHoc({
             page: payload?.page ?? page,
             limit: payload?.limit ?? limit,
             cond: {},
           });
         }
    }

    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  return {
    danhSach,
    loading,
    setLoading,
    getBaiHocModel,
    total,
    setTotal,
    page,
    setPage,
    limit,
    setLimit,
    cond,
    setCondition,
    filterInfo,
    setFilterInfo,
  };
};
