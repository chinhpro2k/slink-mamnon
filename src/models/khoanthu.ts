import type { KhoanThu as IKhoanThu } from '@/services/KhoanThu';
import { getDetailHocPhi, getDetailKhoanThu, getKhoanThu } from '@/services/KhoanThu/khoanthu';
import { useState } from 'react';
import { DataDetailNhapTay } from '@/services/KhoanThu';

export default () => {
  const [danhSach, setDanhSach] = useState<IKhoanThu.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [record, setRecord] = useState<IKhoanThu.Record>({} as any);
  const [totalThu, setTotalThu] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>();
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [dataDetail, setDataDetail] = useState<IKhoanThu.DataDetailHocPhi[]>([]);
  const [dataDetailNhapTay, setDataDetailNhapTay] = useState<IKhoanThu.DataDetailNhapTay[]>();
  const [isNhapTay, setIsNhapTay] = useState<boolean>(false);
  const getKhoanThuModel = async (donViId?: string, condition?: any) => {
    setLoading(true);
    if (condition) {
      // setCondition({...cond,...condition})
      const sort = { module: -1 };
      const response = await getKhoanThu({ page, limit, cond: condition, donViId, sort });
      setDanhSach(response?.data?.data?.result ?? []);
      setTotal(response?.data?.data?.total ?? 0);
      setLoading(false);

      let totalKhoanThu: number = 0;
      response?.data?.data?.result?.forEach((item: { soTien: number }) => {
        totalKhoanThu += item?.soTien;
        return totalKhoanThu;
      });
      setTotalThu(totalKhoanThu);
    }
  };

  const getDetailKhoanThuModel = async (
    thang: number,
    nam: number,
    donViId?: string,
    condition?: any,
  ) => {
    setLoading(true);
    const response = await getDetailHocPhi({ thang, nam, condition, donViId });
    setLoading(false);
    setDataDetail(response?.data?.data);
  };
  const getDetail = async (id: string) => {
    setLoading(true);
    const response = await getDetailKhoanThu({ id });
    setLoading(false);
    const arr: IKhoanThu.DataDetailNhapTay[] = [];
    arr.push(response?.data?.data);
    setDataDetailNhapTay(arr);
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
    getKhoanThuModel,
    setVisibleForm,
    visibleForm,
    edit,
    setEdit,
    totalThu,
    getDetailKhoanThuModel,
    dataDetail,
    getDetail,
    dataDetailNhapTay,
    isNhapTay,
    setIsNhapTay,
  };
};
