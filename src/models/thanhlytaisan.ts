import { getThanhLy } from '@/services/QuanLyTaiSan/BaoHong';
import type { QuanLyTaiSan as IQuanLyTaiSan } from '@/services/QuanLyTaiSan/typings';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<IQuanLyTaiSan.BaoHong[]>([]);
  const [loadingThanhLy, setLoadingThanhLy] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [record, setRecord] = useState<IQuanLyTaiSan.BaoHong>({} as any);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [dsLop, setDsLop] = useState([]);
  const [dsTaiSan, setDsTaiSan] = useState([]);

  const getThanhLyModel = async () => {
    setLoadingThanhLy(true);
    const response = await getThanhLy({ page, limit, cond });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoadingThanhLy(false);
  };

  return {
    record,
    setRecord,
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
    setDsLop,
    dsLop,
    setDsTaiSan,
    dsTaiSan,
    getThanhLyModel,
    total,
    danhSach,
    loadingThanhLy,
  };
};
