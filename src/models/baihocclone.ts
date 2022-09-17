import { getBaiHocClone } from '@/services/BaiHoc/baihoc';
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

  const getBaiHocCloneModel = async () => {
    setLoading(true);
    const response = await getBaiHocClone({ page, limit, cond });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  return {
    danhSach,
    loading,
    setLoading,
    getBaiHocCloneModel,
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
