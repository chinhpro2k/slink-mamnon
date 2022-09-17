import type { ThongTinHocPhi as IThongTinHocPhi } from '@/services/ThongTinHocPhi';
import { getThongTinChiTiet } from '@/services/ThongTinHocPhi/thongtinhocphi';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<IThongTinHocPhi.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [record, setRecord] = useState<IThongTinHocPhi.Record>({} as any);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [thang, setThang] = useState<number>(new Date().getMonth());
  const [nam, setNam] = useState<number>(new Date().getFullYear());

  const getThongTinChiTietModel = async (lopId?: string) => {
    setLoading(true);
    const response = await getThongTinChiTiet({ page, limit, cond, lopId });
    // data trả về nhiều giá trị với tháng trùng nhau, chỉ lấy 1 trong số đó
    const newArr = await response?.data?.data?.result.filter(
      (item: IThongTinHocPhi.Record, index: number, self: IThongTinHocPhi.Record[]) =>
        self.findIndex((val) => val?.thang === item?.thang) === index,
    );
    setDanhSach(newArr ?? []);
    setTotal(newArr?.length ?? 0);
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
    getThongTinChiTietModel,
    setVisibleForm,
    visibleForm,
    edit,
    setEdit,
    thang,
    setThang,
    nam,
    setNam,
  };
};
