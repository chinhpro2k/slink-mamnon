import type { ThongTinHocPhi as IThongTinHocPhi } from '@/services/ThongTinHocPhi';
import { getThongTinHocPhiLop } from '@/services/ThongTinHocPhi/thongtinhocphi';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<IThongTinHocPhi.Record[]>([]);
  const [recordThongKeDiemDanh, setRecordThongKeDiemDanh] = useState<IThongTinHocPhi.Record>();
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
  const [message, setMessage] = useState({ value: '' });
  const [saveMessage, setSaveMessage] = useState(false);
  const [thongTinHocPhi, setThongTinHocPhi] = useState(undefined);
  const [date,setDate]=useState<any>()

  const getThongTinHocPhiLopModel = async (lopId?: string) => {
    setLoading(true);
    const response = await getThongTinHocPhiLop({ page, limit, cond, lopId });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  return {
    thongTinHocPhi,
    setThongTinHocPhi,
    saveMessage,
    setSaveMessage,
    message,
    setMessage,
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
    getThongTinHocPhiLopModel,
    setVisibleForm,
    visibleForm,
    edit,
    setEdit,
    thang,
    setThang,
    nam,
    setNam,
    recordThongKeDiemDanh,
    setRecordThongKeDiemDanh,
    setDate,date
  };
};
