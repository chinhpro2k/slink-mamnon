import { useState } from 'react';
import type { QuangCao as IQuangCao } from '@/services/QuangCao';
import type { Truong as ITruong } from '@/services/Truong';
import { getQuangCao } from '@/services/QuangCao/quangcao';
import { useModel } from 'umi';

export default () => {
  const [danhSach, setDanhSach] = useState<IQuangCao.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [record, setRecord] = useState<IQuangCao.Record>({} as any);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [danhSachTruong, setDanhSachTruong] = useState<ITruong.Record[]>([]);
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const vaiTro = localStorage.getItem('vaiTro');
  const [donViId, setDonViId] = useState<string>(
    vaiTro === 'SuperAdmin' || vaiTro === 'Admin' || vaiTro === 'Guest' ? 'Tất cả' : organizationId,
  );
  const getQuangCaoModel = async () => {
    setLoading(true);
    // if (!donViId && vaiTro !== 'SuperAdmin' && vaiTro !== 'Admin' && vaiTro !== 'Guest') {
    //   setLoading(false);
    //   return;
    // }
    const response = await getQuangCao({
      page,
      limit,
      cond: {
        ...cond,
        nguoiDang: initialState?.currentUser?._id,
      },
      donViId,
      filterInfo,
    });
    setDanhSach(response?.data?.data?.result);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  return {
    danhSach,
    record,
    setRecord,
    loading,
    setLoading,
    getQuangCaoModel,
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
    danhSachTruong,
    setDanhSachTruong,
    setDonViId,
    donViId,
  };
};
