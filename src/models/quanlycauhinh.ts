import { addCauHinh, getCauHinh } from '@/services/QuanLyCauHinh/quanlycauhinh';
import { useState } from 'react';
import { QuangCao as IQuangCao } from '@/services/QuangCao';
import { CauHinh } from '@/services/QuanLyCauHinh';

export default () => {
  const [danhSach, setDanhSach] = useState<IQuangCao.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [record, setRecord] = useState<IQuangCao.Record>({} as any);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [edit, setEdit] = useState<boolean>(false);
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const setUpCauHinh = async (paload: CauHinh.IReq) => {
    setLoading(true);
    const response = await addCauHinh(paload);
    setLoading(false);
  };
  const getCauHinhModel = async () => {
    setLoading(true);
    const response = await getCauHinh({ page, limit,cond:{"key": {"$in": ["THOI_GIAN_TINH_DOANH_THU"]}} });
    setDanhSach(response?.data?.data?.result);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };
  return {
    setUpCauHinh,
    cond,
    setCondition,
    limit,
    setLimit,
    page,
    setPage,
    record,
    setRecord,
    danhSach,
    setDanhSach,
    loading,
    setLoading,
    setVisibleForm,
    getCauHinhModel,
    total,
    edit,
    setEdit,
    visibleForm,setFilterInfo
  };
};
