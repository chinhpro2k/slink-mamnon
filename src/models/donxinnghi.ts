import { getDonXinNghi } from '@/services/DonXinNghi/donxinnghi';
import { useState } from 'react';
import type { DonXinNghi } from '@/services/DonXinNghi';

export default () => {
  const [danhSach, setDanhSach] = useState<DonXinNghi.Record[]>([]);
  const [record, setRecord] = useState<DonXinNghi.Record>();
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});

  const getDonXinNghiModel = async (
    donViId?: string,
    ngay?: number,
    thang?: number,
    nam?: number,
  ) => {
    setLoading(true);
    const response = await getDonXinNghi({ page, limit, cond, donViId, ngay, thang, nam });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  return {
    danhSach,
    loading,
    setLoading,
    getDonXinNghiModel,
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
