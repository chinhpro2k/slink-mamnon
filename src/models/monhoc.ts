import { getMonHoc } from '@/services/MonHoc/monhoc';
import { useState } from 'react';
import type { MonHoc } from '@/services/MonHoc';

export default () => {
  const [danhSach, setDanhSach] = useState<MonHoc.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});

  const getMonHocModel = async (payload: any = {}) => {
    setLoading(true);
    const response = await getMonHoc({ page: payload?.page?? page, limit: payload?.limit?? limit, cond: payload?.cond?? cond });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  return {
    danhSach,
    loading,
    setLoading,
    getMonHocModel,
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
