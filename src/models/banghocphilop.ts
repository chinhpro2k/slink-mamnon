import type { QuanLyLop } from '@/services/QuanLyLop';
import { getBangHocPhiHS } from '@/services/QuanLyLop/quanlylop';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<QuanLyLop.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [record, setRecord] = useState<QuanLyLop.Record>({} as any);
  const [recordBangHocPhi, setRecordBangHocPhi] = useState<QuanLyLop.ViewHocPhi>({} as any);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [dataLop, setDataLop] = useState<QuanLyLop.Record>();

  const getBangHocPhiHSModel = async (donViId?: string, thang?: number, nam?: number) => {
    setLoading(true);
    const response = await getBangHocPhiHS({ page, limit, cond, donViId, thang, nam });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  return {
    danhSach,
    record,
    setRecord,
    loading,
    setLoading,
    total,
    setTotal,
    page,
    limit,
    setPage,
    setLimit,
    cond,
    setCondition,
    filterInfo,
    setFilterInfo,
    setVisibleForm,
    visibleForm,
    edit,
    setEdit,
    getBangHocPhiHSModel,
    setRecordBangHocPhi,
    recordBangHocPhi,
    dataLop,
    setDataLop,
  };
};
