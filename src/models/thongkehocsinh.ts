import { getLop, getThongKeHocSinh } from '@/services/BaoCaoNoiBo/baocaonoibo';
import { useState } from 'react';
import type { BaoCaoNoiBo as IThongKeHocSinh } from '@/services/BaoCaoNoiBo';
import type { Truong as ITruong } from '@/services/Truong';

export default () => {
  const [danhSach, setDanhSach] = useState<IThongKeHocSinh.Record[]>([]);
  const [danhSachLop, setDanhSachLop] = useState<ITruong.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});

  const getThongKeHocSinhModel = async (donViId?: string) => {
    setLoading(true);
    const response = await getThongKeHocSinh({ page, limit, cond, donViId });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const getLopModel = async (donViId?: string) => {
    setLoading(true);
    const response = await getLop({ page: 1, limit: 100, donViId });
    setDanhSachLop(response?.data?.data?.result ?? []);
    setLoading(false);
  };

  return {
    danhSach,
    loading,
    setLoading,
    getThongKeHocSinhModel,
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
    getLopModel,
    danhSachLop,
  };
};
