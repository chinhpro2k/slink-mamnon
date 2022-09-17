import { useState } from 'react';
import { getLichSuThanhToanAdmin } from '@/pages/LichSuThanhToan/service';
import { useModel } from 'umi';
import { getLichSuThanhToanCaNhan } from '../pages/LichSuThanhToan/service';

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
  const vaiTro = localStorage.getItem('vaiTro');

  const getLichSuThanhToanModel = async (payloadCond?: any) => {
    setLoading(true);
    const resp =
      vaiTro === 'SuperAdmin' || vaiTro === 'Admin'
        ? await getLichSuThanhToanAdmin({ page, limit, cond: { ...cond, ...payloadCond } })
        : await getLichSuThanhToanCaNhan({ page, limit, cond: { ...cond, ...payloadCond } });
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
    getLichSuThanhToanModel,
  };
};
