import { getThongKeLuong } from '@/services/ThongKeLuong/thongkeluong';
import { useState } from 'react';
import type { ThongKeLuong } from '@/services/ThongKeLuong';

export default () => {
  const [danhSach, setDanhSach] = useState<ThongKeLuong.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});

  const getThongKeLuongModel = async (donViId?: string, thang?: number, nam?: number) => {
    setLoading(true);
    const response = await getThongKeLuong({ page, limit, cond, donViId, thang, nam });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  return {
    danhSach,
    loading,
    setLoading,
    getThongKeLuongModel,
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
