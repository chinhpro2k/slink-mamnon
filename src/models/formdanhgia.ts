import type { FormDanhGia } from '@/services/FormDanhGia';
import {
  getDSHocSinhDanhGia,
  getFormDanhGia,
  getResultDanhGia,
} from '@/services/FormDanhGia/formdanhgia';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<FormDanhGia.Record[]>([]);
  const [danhSachHS, setDanhSachHS] = useState<FormDanhGia.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [totalHS, setTotalHS] = useState<number>(0);
  const [record, setRecord] = useState<FormDanhGia.Record>({} as any);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [edit, setEdit] = useState<boolean>(false);
  const [thongKe, setThongKe] = useState<any>([]);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);

  const getFormDanhGiaModel = async (donViId?: string) => {
    setLoading(true);
    const response = await getFormDanhGia({ page, limit, cond, donViId });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  const getDSHocSinhDanhGiaModel = async (formDanhGiaId?: string, donViId?: string) => {
    setLoading(true);
    const response = await getDSHocSinhDanhGia({ formDanhGiaId, donViId });
    setDanhSachHS(response?.data?.data ?? []);
    setTotalHS(response?.data?.data?.length ?? 0);
    setTotal(response?.data?.data?.length ?? 0);
    setLoading(false);
  };

  const getResultDanhGiaModel = async (formDanhGiaId?: string, conId?: string) => {
    setLoading(true);
    const response = await getResultDanhGia({ formDanhGiaId, conId });
    setThongKe(response?.data?.data ?? []);
    setLoading(false);
  };

  return {
    danhSach,
    record,
    setRecord,
    loading,
    setLoading,
    getFormDanhGiaModel,
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
    thongKe,
    setThongKe,
    getDSHocSinhDanhGiaModel,
    danhSachHS,
    totalHS,
    getResultDanhGiaModel,
  };
};
