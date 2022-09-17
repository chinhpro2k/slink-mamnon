import { getChuongTrinhDaoTao } from '@/services/chuongtrinhdaotao/chuongtrinhdaotao';
import { useState } from 'react';
import type { ChuongTrinhDaoTao } from '@/services/chuongtrinhdaotao';

export default () => {
  const [danhSach, setDanhSach] = useState<ChuongTrinhDaoTao.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});

  const getChuongTrinhDaoTaoModel = async () => {
    setLoading(true);
    const response = await getChuongTrinhDaoTao({ page, limit, cond });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  return {
    danhSach,
    loading,
    setLoading,
    getChuongTrinhDaoTaoModel,
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
