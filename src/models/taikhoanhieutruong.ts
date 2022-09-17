import {
  getTaiKhoan,
  getTaiKhoanChuTruong,
  getTaiKhoanChuTruongSelect,
  getTaiKhoanHieuTruong,
} from '@/services/TaiKhoanHieuTruong/taikhoanhieutruong';
import { useState } from 'react';
import type { TaiKhoanHieuTruong } from '@/services/TaiKhoanHieuTruong';

export default () => {
  const [danhSach, setDanhSach] = useState<TaiKhoanHieuTruong.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [danhSachTaiKhoan, setDanhSachTaiKhoan] = useState<TaiKhoanHieuTruong.Record[]>([]);
  const [danhSachTaiKhoanChuTruong, setDanhSachTaiKhoanChuTruong] = useState<
    TaiKhoanHieuTruong.Record[]
  >([]);
  const getTaiKhoanHieuTruongModel = async (idTruong?: string) => {
    setLoading(true);
    const idDonVi = cond?.organizationId || idTruong;
    const response = await getTaiKhoanHieuTruong({ page, limit, cond, idDonVi });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };
  const getTaiKhoanModel = async () => {
    setLoading(true);

    const response = await getTaiKhoan();
    setDanhSachTaiKhoan(response?.data?.data ?? []);
    // setTotal(response?.data?.data?.total);
    setLoading(false);
  };
  const getTaiKhoanChuTruongModelSelect = async () => {
    setLoading(true);

    const response = await getTaiKhoanChuTruongSelect();
    setDanhSachTaiKhoan(response?.data?.data ?? []);
    // setTotal(response?.data?.data?.total);
    setLoading(false);
  };
  const getTaiKhoanChuTruongModel = async (idTruong?: string) => {
    setLoading(true);
    const idDonVi = cond?.organizationId || idTruong;
    const response = await getTaiKhoanChuTruong({ page, limit, cond, idDonVi });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };
  return {
    danhSach,
    loading,
    setLoading,
    getTaiKhoanHieuTruongModel,
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
    getTaiKhoanChuTruongModel,
    getTaiKhoanModel,
    danhSachTaiKhoan,
    getTaiKhoanChuTruongModelSelect,
    setDanhSach,
  };
};
