import { getQuanHuyenS, getTinhS, getXaPhuongS } from '@/services/DonViHanhChinh/donvihanhchinh';
import { useState } from 'react';
import type { DonViHanhChinh } from '@/services/DonViHanhChinh';

export default () => {
  const [danhSachTinhTP, setDanhSachTinhTP] = useState<DonViHanhChinh.Record[]>([]);
  const [danhSachQuanHuyen, setDanhSachQuanHuyen] = useState<DonViHanhChinh.Record[]>([]);
  const [danhSachXaPhuong, setDanhSachXaPhuong] = useState<DonViHanhChinh.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [tenTinh, setTenTinh] = useState<string>();
  const [tenQuanHuyen, setTenQuanHuyen] = useState<string>();
  const [tenPhuongXa, setTenXaPhuong] = useState<string>();

  const getDanhSachTinhModel = async () => {
    setLoading(true);
    const response = await getTinhS();
    setDanhSachTinhTP(response?.data?.data ?? []);
    setLoading(false);
  };

  const getDanhSachQuanHuyenModel = async (maTinh: string) => {
    setLoading(true);
    const response = await getQuanHuyenS({ maTinh });
    setDanhSachQuanHuyen(response?.data?.data ?? []);
    setLoading(false);
  };

  const getDanhSachXaPhuongModel = async (maQH: string) => {
    setLoading(true);
    const response = await getXaPhuongS({ maQH });
    setDanhSachXaPhuong(response?.data?.data ?? []);
    setLoading(false);
  };

  return {
    tenTinh,
    tenQuanHuyen,
    tenPhuongXa,
    setTenTinh,
    setTenQuanHuyen,
    setTenXaPhuong,
    getDanhSachXaPhuongModel,
    getDanhSachQuanHuyenModel,
    loading,
    setLoading,
    getDanhSachTinhModel,
    danhSachQuanHuyen,
    danhSachTinhTP,
    danhSachXaPhuong,
    setDanhSachQuanHuyen,
    setDanhSachTinhTP,
    setDanhSachXaPhuong,
  };
};
