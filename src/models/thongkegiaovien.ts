import type { BaoCaoNoiBo as IThongKeGiaoVien } from '@/services/BaoCaoNoiBo';
import { getThongKeGiaoVien } from '@/services/BaoCaoNoiBo/baocaonoibo';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<IThongKeGiaoVien.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});

  const getThongKeGiaoVienModel = async (donViId?: string) => {
    setLoading(true);
    const response = await getThongKeGiaoVien({ page, limit, cond, donViId });
    setDanhSach(response?.data?.data ?? []);
    setTotal(response?.data?.data?.length ?? 0);
    setLoading(false);
  };

  return {
    danhSach,
    loading,
    setLoading,
    getThongKeGiaoVienModel,
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
