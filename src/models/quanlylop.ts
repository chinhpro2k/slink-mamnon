import type { QuanLyLop } from '@/services/QuanLyLop';
import { getQuanLyLop } from '@/services/QuanLyLop/quanlylop';
import { useState } from 'react';
import { useModel } from 'umi';

export default () => {
  const [danhSach, setDanhSach] = useState<QuanLyLop.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [record, setRecord] = useState<QuanLyLop.Record>({} as any);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [pageHocPhi, setPageHocPhi] = useState<number>(1);
  const [limitHocPhi, setLimitHocPhi] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);

  const { initialState } = useModel('@@initialState');
  const parent = initialState?.currentUser?.role?.organizationId;
  const vaiTro = localStorage.getItem('vaiTro');

  const getQuanLyLopModel = async () => {
    setLoading(true);
    const response = await getQuanLyLop({ page, limit, cond, parent, vaiTro });
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
    getQuanLyLopModel,
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
    setPageHocPhi,
    setLimitHocPhi,
    pageHocPhi,
    limitHocPhi,
  };
};
