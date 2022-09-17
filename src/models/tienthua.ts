import { useState } from 'react';
import type { ThucPhamKho as IThucPhamKho } from '@/services/ThucPhamKho';
import type { DanhMucThucPham as IDanhMucThucPham } from '@/services/DanhMucThucPham';
import { getTienThua, updateTienThua } from '@/services/TienThua/tienthua';
import { ITienThua } from '@/services/TienThua';

export default () => {
  const [danhSach, setDanhSach] = useState<ITienThua.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [record, setRecord] = useState<ITienThua.Record>({} as any);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [dsThucPham, setDsThucPham] = useState<ITienThua.Record[]>([]);
  const [danhSachTruong, setDanhSachTruong] = useState([]);

  const getTienThuaModel = async (donViId: string) => {
    setLoading(true);
    const res = await getTienThua({ donViId, page, limit, cond });
    if (res) {
      setDanhSach(res?.data?.data?.result ?? []);
      setTotal(res?.data?.data?.total);
    }
    setLoading(false);
  };
  const updateTienThuaModel = async (data: ITienThua.DataReq) => {
    setLoading(true);
    const res = await updateTienThua(data);
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
    getTienThuaModel,
    updateTienThuaModel
  };
};
