import { getDSGiaoVien } from '@/services/GiaoVien/giaovien';
import { useState } from 'react';
import type { GiaoVien } from '@/services/GiaoVien';

export default () => {
  const [danhSach, setDanhSach] = useState<GiaoVien.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [record, setRecord] = useState<GiaoVien.Record>({} as any);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});

  const getDSGiaoVienModel = async (donViId?: string) => {
    setLoading(true);
    const response = await getDSGiaoVien({ page, limit, cond, donViId });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  return {
    danhSach,
    record,
    setRecord,
    loading,
    setLoading,
    getDSGiaoVienModel,
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
