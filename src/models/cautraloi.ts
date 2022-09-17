import { useModel } from 'umi';
import type { KhaoSat } from '@/services/QuanLyKhaoSat';
import { getCauTraLoi, getKhaoSat, getResultKhaoSat } from '@/services/QuanLyKhaoSat/khaosat';
import { useState } from 'react';

export default () => {
  const initialStateModel = useModel('@@initialState');
  const [danhSach, setDanhSach] = useState<KhaoSat.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [record, setRecord] = useState<KhaoSat.Record>({} as any);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const vaiTro = localStorage.getItem('vaiTro');
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [edit, setEdit] = useState<boolean>(false);
  const [thongKe, setThongKe] = useState<any>([]);
  const [recordCauHoi, setRecordCauHoi] = useState<any>({} as any);
  const [cauTraLoi, setCauTraLoi] = useState();
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [formStatistic, setFormStatistic] = useState<boolean>(false);
  const getCauTraLoiModel = async (id: string, loaiCauHoi: number) => {
    let response = null;
    // if (loaiCauHoi === 0) {
    //   response = await getCauTraLoi(id, {
    //     page,
    //     limit,
    //     cond: { loaiCauHoi: loaiCauHoi, isKhac: true },
    //   });
    // } else {
      response = await getCauTraLoi(id, { page, limit, cond: {} });
    // }
    if (response) {
      setLoading(false);
      setCauTraLoi(response?.data?.data?.result);
      setTotal(response?.data?.data?.total);
    }
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
    getCauTraLoiModel,
    setCauTraLoi,
    cauTraLoi,
    formStatistic,
    setFormStatistic,
    setRecordCauHoi,
    recordCauHoi,
  };
};
