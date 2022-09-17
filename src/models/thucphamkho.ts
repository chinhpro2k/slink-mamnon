import { getThucPhamKho, getXuatKho } from '@/services/ThucPhamKho/thucphamkho';
import { useState } from 'react';
import type { ThucPhamKho as IThucPhamKho } from '@/services/ThucPhamKho';
import type { DanhMucThucPham as IDanhMucThucPham } from '@/services/DanhMucThucPham';

export default () => {
  const [danhSach, setDanhSach] = useState<IThucPhamKho.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [record, setRecord] = useState<IThucPhamKho.Record>({} as any);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [dsThucPham, setDsThucPham] = useState<IDanhMucThucPham.Record[]>([]);
  const [danhSachTruong, setDanhSachTruong] = useState([]);

  const getThucPhamKhoModel = async (donViId?: string) => {
    setLoading(true);
    const response = await getThucPhamKho({ page, limit, cond, donViId });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  return {
    danhSach,
    record,
    setRecord,
    loading,
    setLoading,
    getThucPhamKhoModel,
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
    setDsThucPham,
    dsThucPham,
    danhSachTruong,
    setDanhSachTruong,
  };
};
