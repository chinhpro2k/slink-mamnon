import { getDanhMucThucPham } from '@/services/DanhMucThucPham/danhmucthucpham';
import { useState } from 'react';
import type { DanhMucThucPham as IDanhMucThucPham } from '@/services/DanhMucThucPham';

export default () => {
  const [danhSach, setDanhSach] = useState<IDanhMucThucPham.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [record, setRecord] = useState<IDanhMucThucPham.Record>({} as any);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const vaiTro = localStorage.getItem('vaiTro');
  const [isClone, setIsClone] = useState(false);
  const getDanhMucThucPhamChungModel = async () => {
    setLoading(true);
    const response = await getDanhMucThucPham({
      page,
      limit,
      cond: {
        ...cond,
        datatype: 'Hệ thống',
      },
    });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  return {
    isClone,
    setIsClone,
    danhSach,
    record,
    setRecord,
    loading,
    setLoading,
    getDanhMucThucPhamChungModel,
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
  };
};
