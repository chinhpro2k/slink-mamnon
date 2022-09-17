import { useState } from 'react';
import { ITrongMuon } from '@/services/TrongMuon';
import {
  confirmTrongMuon,
  createTrongMuon,
  getGiaoVien,
  getLop,
  getTrongMuon,
} from '@/services/TrongMuon/trongmuon';

export default () => {
  const [danhSach, setDanhSach] = useState<ITrongMuon.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [record, setRecord] = useState<ITrongMuon.Record>({} as any);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [dataGiaoVien, setDataGiaoVien] = useState<ITrongMuon.DataGiaoVien[]>([]);
  const [dataLop, setDataLop] = useState<ITrongMuon.DataLop[]>([]);
  const [dataView, setDataView] = useState<ITrongMuon.DataReq>();
  const [view, setView] = useState<boolean>(false);
  const getDataTrongMuon = async () => {
    setLoading(true);
    const res = await getTrongMuon({ page, limit, cond });
    if (res) {
      console.log(res);
      setDanhSach(res?.data?.data?.result);
      setTotal(res?.data?.data?.total);
    }
    setLoading(false);
  };
  const getDataGiaoVienModel = async (truongId: string) => {
    setLoading(true);
    const res = await getGiaoVien({ donViId: truongId, page, limit, cond });
    if (res) {
      setDataGiaoVien(res?.data?.data?.result);
    }
    setLoading(false);
  };
  const getDataLopModel = async (truongId: string) => {
    setLoading(true);
    const res = await getLop({ donViId: truongId, page, limit, cond });
    if (res) {
      setDataLop(res?.data?.data?.result);
    }
    setLoading(false);
  };
  const confirmTrongMuonModel = async (id: string, trangThai: string) => {
    setLoading(true);
    const res = await confirmTrongMuon(id, trangThai);
    if (res) {
    }
    setLoading(false);
  };
  const createTrongMuonModel = async (data: ITrongMuon.DataReq) => {
    setLoading(true);
    const res = await createTrongMuon(data);
    if (res) {
    }
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
    setVisibleForm,
    visibleForm,
    edit,
    setEdit,
    getDataTrongMuon,
    confirmTrongMuonModel,
    dataLop,
    dataGiaoVien,
    getDataLopModel,
    getDataGiaoVienModel,
    createTrongMuonModel,
    dataView,
    setDataView,
    view,
    setView,
  };
};
