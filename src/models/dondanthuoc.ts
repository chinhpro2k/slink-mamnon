import { getDonDanThuoc } from '@/services/DonDanThuoc/dondanthuoc';
import { useState } from 'react';
import type { DonDanThuoc } from '@/services/DonDanThuoc';

export default () => {
  const [danhSach, setDanhSach] = useState<DonDanThuoc.Record[]>([]);
  const [record, setRecord] = useState<DonDanThuoc.Record>();
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});

  const getDonDanThuocModel = async (donViId?: string, timeStart?: any, timeEnd?: any) => {
    setLoading(true);
    const response = await getDonDanThuoc({ page, limit, cond, donViId, timeStart, timeEnd });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  return {
    danhSach,
    loading,
    setLoading,
    getDonDanThuocModel,
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
    setRecord,
    record,
  };
};
