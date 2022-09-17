import { getDiemDanh } from '@/services/DiemDanh/diemdanh';
import { useState } from 'react';
import type { DiemDanh } from '@/services/DiemDanh';
import { useModel } from 'umi';

export default () => {
  const [danhSach, setDanhSach] = useState<DiemDanh.Record[]>([]);
  const [record, setRecord] = useState<DiemDanh.Record>();
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const { initialState } = useModel('@@initialState');

  const getDiemDanhModel = async () => {
    const parent = initialState?.currentUser?.role?.organizationId;
    setLoading(true);
    const response = await getDiemDanh({ page, limit, cond, parent });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  return {
    danhSach,
    loading,
    setLoading,
    getDiemDanhModel,
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
    setRecord,
    record,
  };
};
