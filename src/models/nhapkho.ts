import type { ThucPhamKho as IThucPhamKho } from '@/services/ThucPhamKho';
import { getNhapKho } from '@/services/ThucPhamKho/thucphamkho';
import moment from 'moment';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<IThucPhamKho.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [record, setRecord] = useState<IThucPhamKho.Record>({} as any);
  const [recordNhienLieu, setRecordNhienLieu] = useState<IThucPhamKho.Record>({} as any);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [timeStart, setTimeStart] = useState(moment().startOf('date').toDate());
  const [timeEnd, setTimeEnd] = useState(moment().endOf('date').toDate());

  const getNhapKhoModel = async (donViId?: string) => {
    setLoading(true);
    const response = await getNhapKho({ page, limit, cond, donViId, timeStart, timeEnd });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  return {
    danhSach,
    record,
    setRecord,
    loading,
    setLoading,
    getNhapKhoModel,
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
    timeStart,
    setTimeStart,
    timeEnd,
    setTimeEnd,
    recordNhienLieu,setRecordNhienLieu
  };
};
