import { getCon } from '@/services/KhaiBaoThongTin/khaibaothongtin';
import { useState } from 'react';
import type { KhaiBaoThongTin } from '@/services/KhaiBaoThongTin';

export default () => {
  const [danhSach, setDanhSach] = useState<KhaiBaoThongTin.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [record, setRecord] = useState<KhaiBaoThongTin.Record>({} as any);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});

  const getKhaiBaoThongTinModel = async (childId?: string) => {
    setLoading(true);
    const response = await getCon({ page, limit, cond, childId });
    if (childId) {
      const dataCon = [];
      dataCon.push({ ...response?.data?.data, index: 1 });
      setDanhSach(dataCon);
      setTotal(1);
    } else {
      setDanhSach(response?.data?.data?.result ?? []);
      setTotal(response?.data?.data?.total);
    }
    setLoading(false);
  };

  return {
    danhSach,
    record,
    setRecord,
    loading,
    setLoading,
    getKhaiBaoThongTinModel,
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
