import type { QuanLyTaiSan as IQuanLyTaiSan } from '@/services/QuanLyTaiSan/typings';
import { getDanhMucTaiSan } from '@/services/QuanLyTaiSan/DanhMucTaiSan';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<IQuanLyTaiSan.DanhMucTaiSan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [record, setRecord] = useState<IQuanLyTaiSan.DanhMucTaiSan>({} as any);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);

  const getDanhMucTaiSanModel = async () => {
    setLoading(true);
    const response = await getDanhMucTaiSan({ page, limit, cond });
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
    getDanhMucTaiSanModel,
    setVisibleForm,
    visibleForm,
    edit,
    setEdit,
  };
};
