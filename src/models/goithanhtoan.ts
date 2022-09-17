import { useState } from 'react';
import { getGoiThanhToan } from '@/pages/GoiThanhToan/service';
import { useModel } from 'umi';

export default () => {
  const initialStateModel = useModel('@@initialState');
  const [danhSach, setDanhSach] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [record, setRecord] = useState({} as any);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);

  const getGoiThanhToanModel = async (payloadCond?: any) => {
    setLoading(true);
    const resp = await getGoiThanhToan({ page, limit, cond: { ...cond, ...payloadCond } });
    setDanhSach(resp?.data?.data?.result);
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
    getGoiThanhToanModel,
  };
};
