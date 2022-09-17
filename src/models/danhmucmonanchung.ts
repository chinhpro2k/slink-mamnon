import {
  getDanhMucMonAn,
  postDanhMucMonAn,
  updDanhMucMonAn,
} from '@/services/DanhMucMonAn/danhmucmonan';
import { useState } from 'react';
import type { DanhMucMonAn as IDanhMucMonAn } from '@/services/DanhMucMonAn';
import Notification from '@/components/Notification';

export default () => {
  const [danhSach, setDanhSach] = useState<IDanhMucMonAn.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [record, setRecord] = useState<IDanhMucMonAn.Record>({} as any);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [isClone, setIsClone] = useState(false);
  const vaiTro = localStorage.getItem('vaiTro');

  const getDanhMucMonAnModel = async () => {
    setLoading(true);
    const response = await getDanhMucMonAn({
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

  const postDanhMucMonAnModel = async (payload) => {
    const response = await postDanhMucMonAn(payload);
    Notification('success', 'Thêm mới thành công');
  };

  const updDanhMucMonAnModel = async (payload) => {
    const response = await updDanhMucMonAn(payload);
    Notification('success', 'Chỉnh sửa thành công');
  };

  return {
    isClone,
    setIsClone,
    danhSach,
    record,
    setRecord,
    loading,
    setLoading,
    getDanhMucMonAnModel,
    postDanhMucMonAnModel,
    updDanhMucMonAnModel,
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
