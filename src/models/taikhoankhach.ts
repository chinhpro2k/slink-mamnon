import { getTaiKhoanKhach } from '@/services/TaiKhoanKhach/taikhoankhach';
import { useState } from 'react';
import type { TaiKhoanKhach } from '@/services/TaiKhoanKhach';

export default () => {
  const [danhSach, setDanhSach] = useState<TaiKhoanKhach.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});

  const getTaiKhoanKhachModel = async () => {
    setLoading(true);
    const response = await getTaiKhoanKhach({ page, limit, cond });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  return {
    danhSach,
    loading,
    setLoading,
    getTaiKhoanKhachModel,
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
