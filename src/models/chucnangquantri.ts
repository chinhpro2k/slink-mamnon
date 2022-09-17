import type { ChucNangQuanTri as IChucNangQuanTri } from '@/services/ChucNangQuanTri';
import { getChucNangQuanTri } from '@/services/ChucNangQuanTri/chucnangquantri';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<IChucNangQuanTri.Record[]>([]);
  const [danhSachChucNang, setDanhSachChucNang] = useState<IChucNangQuanTri.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [cond, setCondition] = useState<any>({});

  const getChucNangQuanTriModel = async () => {
    setLoading(true);
    const response = await getChucNangQuanTri(page, limit, cond);
    setDanhSach(response?.data?.data?.result ?? []);
    setDanhSachChucNang(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  return {
    danhSach,
    loading,
    setLoading,
    getChucNangQuanTriModel,
    total,
    setTotal,
    page,
    setPage,
    limit,
    setLimit,
    danhSachChucNang,
    filterInfo,
    setFilterInfo,
    cond,
    setCondition,
  };
};
