import type { DotDanhGiaSucKhoe } from '@/services/DotDanhGiaSucKhoe';
import { getDotDanhGiaSucKhoe } from '@/services/DotDanhGiaSucKhoe/dotdanhgiasuckhoe';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<DotDanhGiaSucKhoe.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [record, setRecord] = useState<DotDanhGiaSucKhoe.Record>({} as any);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);

  const getDotDanhGiaSucKhoeModel = async (donViId?: string) => {
    setLoading(true);
    const response = await getDotDanhGiaSucKhoe({ page, limit, cond, donViId });
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
    getDotDanhGiaSucKhoeModel,
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
    setVisibleForm,
    edit,
    setEdit,
    visibleForm,
  };
};
