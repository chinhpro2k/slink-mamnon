import type { KhoanChiTieu as IKhoanChiTieu } from '@/services/KhoanChiTieu';
import type { GiamTru as IGiamTru } from '@/services/GiamTru';
import { useState } from 'react';
import { getDetailGiamTru, getGiamTru } from '@/services/GiamTru/giamtru';

export default () => {
  const [danhSach, setDanhSach] = useState<IKhoanChiTieu.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>();
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [dataDetailGiamTru, setDataDetailGiamTru] = useState<IGiamTru.DataDetail[]>([]);
  const getGiamTruModel = async (donViId?: string, condition?: any) => {
    setLoading(true);
    if (condition) {
      // setCondition({ ...cond, ...condition });
      const response = await getGiamTru({ page, limit, cond: condition, donViId });
      setDanhSach(response?.data?.data?.result ?? []);
      setTotal(response?.data?.data?.total ?? 0);
      setLoading(false);
    }
  };
  const getDetailGiamTruModel = async (thang: number, nam: number, donViId?: string) => {
    setLoading(true);
    const response = await getDetailGiamTru({ thang, nam, cond, donViId });
    setDataDetailGiamTru(response?.data?.data ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };
  return {
    danhSach,
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
    setVisibleForm,
    visibleForm,
    getGiamTruModel,
    getDetailGiamTruModel,
    dataDetailGiamTru,
  };
};
