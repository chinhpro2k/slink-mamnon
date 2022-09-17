import { getVaiTroQuanTri } from '@/services/VaiTroQuanTri/vaitroquantri';
import { useState } from 'react';
import type { VaiTroQuanTri } from '@/services/VaiTroQuanTri';

export default () => {
  const [danhSach, setDanhSach] = useState<VaiTroQuanTri.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [cond, setCondition] = useState<any>({});

  const getVaiTroQuanTriModel = async () => {
    setLoading(true);
    const response = await getVaiTroQuanTri(page, limit);
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
    return response?.data?.data?.result ?? [];
  };

  return {
    danhSach,
    loading,
    setLoading,
    getVaiTroQuanTriModel,
    total,
    setTotal,
    page,
    limit,
    setPage,
    setLimit,
    filterInfo,
    setCondition,
    setFilterInfo,
    cond,
  };
};
