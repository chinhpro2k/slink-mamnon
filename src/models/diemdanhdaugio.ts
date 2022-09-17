import { getDiemDanhDauGio, updateDiemDanh } from '@/services/DiemDanhDauGio/diemdanhdaugio';
import { useState } from 'react';
import type { DiemDanhDauGio } from '@/services/DiemDanhDauGio';

export default () => {
  const [danhSach, setDanhSach] = useState<DiemDanhDauGio.Record[]>([]);
  const [record, setRecord] = useState<DiemDanhDauGio.Record>();
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});

  const getDiemDanhDauGioModel = async (
    donViId?: string,
    ngay?: number,
    thang?: number,
    nam?: number,
  ) => {
    setLoading(true);
    const response = await getDiemDanhDauGio({ page, limit, cond, donViId, ngay, thang, nam });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  const updateDiemDanhModel = async (id: string, data: any) => {
    setLoading(true);
    const response = await updateDiemDanh({ id, data });
    if (response) {
    }
    setLoading(false);
  };

  return {
    danhSach,
    loading,
    setLoading,
    getDiemDanhDauGioModel,
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
    updateDiemDanhModel
  };
};
