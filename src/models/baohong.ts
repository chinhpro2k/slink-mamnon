import { getBaoHong } from '@/services/QuanLyTaiSan/BaoHong';
import type { QuanLyTaiSan as IQuanLyTaiSan } from '@/services/QuanLyTaiSan/typings';
import { useState } from 'react';
import axios from "@/utils/axios";
import {ip3} from "@/utils/constants";

export default () => {
  const [danhSach, setDanhSach] = useState<IQuanLyTaiSan.BaoHong[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [record, setRecord] = useState<IQuanLyTaiSan.BaoHong>({} as any);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [dsLop, setDsLop] = useState([]);
  const [dsTaiSan, setDsTaiSan] = useState([]);

  const getBaoHongModel = async () => {
    setLoading(true);
    const response = await getBaoHong({ page, limit, cond });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };
  const getTaiSan = async () => {
    const result = await axios.get(`${ip3}/danh-muc-tai-san/pageable?page=1&limit=1000`);
    setDsTaiSan(result?.data?.data?.result);
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
    getBaoHongModel,
    setVisibleForm,
    visibleForm,
    edit,
    setEdit,
    setDsLop,
    dsLop,
    setDsTaiSan,
    dsTaiSan,
    getTaiSan
  };
};
