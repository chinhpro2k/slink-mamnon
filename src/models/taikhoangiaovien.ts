import { getTaiKhoanGiaoVien } from '@/services/TaiKhoanGiaoVien/taikhoangiaovien';
import { useState } from 'react';
import type { TaiKhoanGiaoVien } from '@/services/TaiKhoanGiaoVien';

export default () => {
  const [danhSach, setDanhSach] = useState<TaiKhoanGiaoVien.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [recordGV, setRecordGV] = useState<TaiKhoanGiaoVien.Record>();

  const getTaiKhoanGiaoVienModel = async (organizationId?: string) => {
    setLoading(true);
    const idTruong = cond?.organizationId || organizationId;
    const response = await getTaiKhoanGiaoVien({ page, limit, cond, idTruong, filterInfo });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  return {
    danhSach,
    recordGV,
    setRecordGV,
    loading,
    setLoading,
    getTaiKhoanGiaoVienModel,
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
