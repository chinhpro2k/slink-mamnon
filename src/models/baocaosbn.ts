import type { BaoCaoSBN as IBaoCaoSBN } from '@/services/BaoCaoSBN';
import type { Truong as ITruong } from '@/services/Truong';
import { getBaoCaoSBN } from '@/services/BaoCaoSBN/baocaosbn';
import { getTruong } from '@/services/Truong/truong';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<IBaoCaoSBN.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [record, setRecord] = useState<IBaoCaoSBN.Record>({} as any);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [danhSachTruong, setDanhSachTruong] = useState<ITruong.Record[]>();

  const getBaoCaoSBNModel = async (donViId?: string) => {
    setLoading(true);
    const response = await getBaoCaoSBN({ page, limit, cond, donViId });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const getTruongModel = async () => {
    setLoading(true);
    const response = await getTruong({ page: 1, limit: 100 });
    setDanhSachTruong(response?.data?.data?.result ?? []);
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
    getBaoCaoSBNModel,
    setVisibleForm,
    visibleForm,
    edit,
    setEdit,
    danhSachTruong,
    setDanhSachTruong,
    getTruongModel,
  };
};
