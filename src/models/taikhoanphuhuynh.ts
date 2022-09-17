import { getTaiKhoanPhuHuynh } from '@/services/TaiKhoanPhuHuynh/taikhoanphuhuynh';
import { useState } from 'react';
import type { TaiKhoanPhuHuynh } from '@/services/TaiKhoanPhuHuynh';

export default () => {
  const [danhSach, setDanhSach] = useState<TaiKhoanPhuHuynh.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [recordPH, setRecordPH] = useState<TaiKhoanPhuHuynh.Record>();

  const getTaiKhoanPhuHuynhModel = async (organizationId?: string) => {
    setLoading(true);
    const idTruong = cond?.organizationId || organizationId;
    const response = await getTaiKhoanPhuHuynh({ page, limit, cond, idTruong, filterInfo });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  return {
    danhSach,
    loading,
    setLoading,
    getTaiKhoanPhuHuynhModel,
    setRecordPH,
    recordPH,
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
