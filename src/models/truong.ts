import { getTruong } from '@/services/Truong/truong';
import { useState } from 'react';
import type { Truong } from '@/services/Truong';

export default () => {
  const [danhSach, setDanhSach] = useState<Truong.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [typeForm, setTypeForm] = useState<string>();
  const [truongId, setTruongId] = useState<string>();
  const [filterInfo, setFilterInfo] = useState<any>(undefined);

  const getTruongModel = async (organizationId?: string) => {
    setLoading(true);
    let a = filterInfo;
    const response = await getTruong({ page, limit, cond, organizationId, filterInfo });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  return {
    danhSach,
    loading,
    setLoading,
    getTruongModel,
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
    typeForm,
    setTypeForm,
    setTruongId,
    truongId,
  };
};
