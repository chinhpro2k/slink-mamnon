import {
  getDanhGiaGiaoVien,
  getDSGiaoVienDanhGia,
  getResultGiaoVien,
  getThongKeAllDot,
  getThongKeGiaoVien,
} from '@/services/QuanLyDanhGia/quanlydanhgia';
import { useState } from 'react';
import type { QuanLyDanhGia as IQuanLyDanhGia } from '@/services/QuanLyDanhGia';

export default () => {
  const [danhSach, setDanhSach] = useState<IQuanLyDanhGia.Record[]>([]);
  const [danhSachThongKe, setDanhSachThongKe] = useState<IQuanLyDanhGia.Record[]>([]);
  const [danhSachGV, setDanhSachGV] = useState<IQuanLyDanhGia.Record[]>([]);
  const [diemThongKeAllDot, setDiemThongKeAllDot] = useState<IQuanLyDanhGia.Record[]>([]);
  const [danhSachResultGV, setDanhSachResultGV] = useState<IQuanLyDanhGia.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [totalGV, setTotalGV] = useState<number>(0);
  const [totalThongKeAllDot, setTotalThongKeAllDot] = useState<number>(0);
  const [totalResultGV, setTotalResultGV] = useState<number>(0);
  const [totalThongKe, setTotalThongKe] = useState<number>(0);
  const [record, setRecord] = useState<IQuanLyDanhGia.Record>({} as any);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [visibleDiemTB, setVisibleDiemTB] = useState<boolean>(false);
  const [visibleDiemTBAllDot, setVisibleDiemTBAllDot] = useState<boolean>(false);

  const getQuanLyDanhGiaModel = async (donViId?: string) => {
    setLoading(true);
    const response = await getDanhGiaGiaoVien({ page, limit, cond, donViId });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  const getDSGiaoVienDanhGiaModel = async (formDanhGiaId?: string) => {
    setLoading(true);
    const response = await getDSGiaoVienDanhGia({ formDanhGiaId, page, limit });
    setDanhSachGV(response?.data?.data?.result ?? []);
    setTotalGV(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const getResultGVModel = async (formDanhGiaId?: string, donViId?: string) => {
    setLoading(true);
    const response = await getResultGiaoVien({ formDanhGiaId, donViId, page, limit });
    const arrResult: IQuanLyDanhGia.Record[] = [];
    response?.data?.data?.map((item: IQuanLyDanhGia.Record, index: number) =>
      arrResult.push({ ...item, index: index + 1 }),
    );
    setDanhSachResultGV(arrResult ?? []);
    setTotalResultGV(response?.data?.data?.length ?? 0);
    setLoading(false);
  };

  const getThongKeGVModel = async (danhGiaId?: string) => {
    setLoading(true);
    const response = await getThongKeGiaoVien({ danhGiaId, page, limit });
    setDanhSachThongKe(response?.data?.data ?? []);
    setTotalThongKe(response?.data?.data?.length ?? 0);
    setLoading(false);
  };

  const getThongKeAllDotModel = async (donViId?: string) => {
    setLoading(true);
    const response = await getThongKeAllDot({ donViId, page, limit });
    setDiemThongKeAllDot(response?.data?.data ?? []);
    setTotalThongKeAllDot(response?.data?.data?.length ?? 0);
    setTotal(response?.data?.data?.length ?? 0)
    setLoading(false);
  };

  return {
    danhSach,
    record,
    setRecord,
    loading,
    setLoading,
    getQuanLyDanhGiaModel,
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
    setVisibleDiemTB,
    visibleDiemTB,
    totalGV,
    danhSachGV,
    getDSGiaoVienDanhGiaModel,
    getResultGVModel,
    danhSachResultGV,
    totalResultGV,
    getThongKeGVModel,
    totalThongKe,
    danhSachThongKe,
    setVisibleDiemTBAllDot,
    visibleDiemTBAllDot,
    getThongKeAllDotModel,
    diemThongKeAllDot,
    totalThongKeAllDot,
    setDiemThongKeAllDot,
  };
};
