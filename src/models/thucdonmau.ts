import { useState } from 'react';
import { getThucDonMau } from '@/pages/ThucPham/LenThucDonMau/service';
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
  const [visibleChiTietTDMau, setVisibleChiTietTDMau] = useState<boolean>(false);
  const [loaiHinh, setLoaiHinh] = useState('Mầm non');
  const [danhSachTruong, setDanhSachTruong] = useState([]);

  const getThucDonMauModel = async (payloadCond: any) => {
    setLoading(true);
    const resp = await getThucDonMau({ page, limit, cond: { ...cond, ...payloadCond } });
    setDanhSach(resp?.data?.data?.result);
    setLoading(false);
  };

  return {
    danhSachTruong,
    setDanhSachTruong,
    loaiHinh,
    setLoaiHinh,
    visibleChiTietTDMau,
    setVisibleChiTietTDMau,
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
    getThucDonMauModel,
  };
};
