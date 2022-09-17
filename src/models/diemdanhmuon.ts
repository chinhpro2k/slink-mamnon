import { getDiemDanhMuon, updateDiemDanhMuon } from '@/services/DiemDanhMuon/diemdanhmuon';
import { useState } from 'react';
import type { DiemDanhMuon } from '@/services/DiemDanhMuon';

export default () => {
  const [danhSach, setDanhSach] = useState<DiemDanhMuon.Record[]>([]);
  const [record, setRecord] = useState<DiemDanhMuon.Record>();
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});

  const getDiemDanhMuonModel = async (
    donViId?: string,
    ngay?: number,
    thang?: number,
    nam?: number,
  ) => {
    setLoading(true);
    const response = await getDiemDanhMuon({ page, limit, cond, donViId, ngay, thang, nam });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  const updateDiemDanhMuonModel = async (id: string, data: any) => {
    setLoading(true);
    const response = await updateDiemDanhMuon({ id, data });
    if (response){

    }
    setLoading(false);
  };
  return {
    danhSach,
    loading,
    setLoading,
    getDiemDanhMuonModel,
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
    updateDiemDanhMuonModel
  };
};
