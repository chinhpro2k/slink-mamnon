import { getDSHocSinh } from '@/services/HocSinh/hocsinh';
import { useState } from 'react';
import type { HocSinh } from '@/services/HocSinh';

export default () => {
  const [danhSach, setDanhSach] = useState<HocSinh.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [record, setRecord] = useState<HocSinh.Record>({} as any);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});

  const getDSHocSinhModel = async (donViId?: string) => {
    setLoading(true);
    const response = await getDSHocSinh({ page, limit, cond, donViId });
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
    getDSHocSinhModel,
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
