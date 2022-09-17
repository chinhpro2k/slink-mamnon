import { getThongBao } from '@/services/ThongBao/thongbao';
import { useState } from 'react';
import type { ThongBao as IThongBao } from '@/services/ThongBao';
import {
  confirmAlbumAnh,
  createAlbumAnh,
  deleteAlbumAnh,
  getAlbumAnh,
  updateAlbumAnh,
} from '@/services/AlbumAnh/albumanh';
import { AlbumAnh } from '@/services/AlbumAnh';
import { message } from 'antd';

export default () => {
  const [danhSach, setDanhSach] = useState<IThongBao.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [record, setRecord] = useState<IThongBao.Record>({} as any);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);

  const getAlbumAnhModel = async (donViId?: string) => {
    setLoading(true);
    const response = await getAlbumAnh({ page, limit, cond: { ...cond }, donViId });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };
  const createAlbumAnhModel = async (data: AlbumAnh.DataCreate) => {
    setLoading(true);
    const response = await createAlbumAnh(data);
    if (response) {
    }
    setLoading(false);
  };
  const updateAlbumAnhModel = async (id: string, data: AlbumAnh.DataCreate) => {
    setLoading(true);
    const response = await updateAlbumAnh(id, data);
    if (response) {
    }
    setLoading(false);
  };
  const deleteAlbumAnhModel = async (id: string) => {
    setLoading(true);
    const response = await deleteAlbumAnh(id);
    if (response) {
    }
    setLoading(false);
  };
  const confirmAlbumAnhModel = async (id: string, status: string) => {
    setLoading(true);
    const response = await confirmAlbumAnh(id, status);
    if (response) {
    }
    setLoading(false);
  };
  return {
    danhSach,
    record,
    setRecord,
    loading,
    setLoading,
    getAlbumAnhModel,
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
    createAlbumAnhModel,
    updateAlbumAnhModel,
    deleteAlbumAnhModel,
    confirmAlbumAnhModel,
  };
};
