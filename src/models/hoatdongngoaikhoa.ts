import {
  getDanhSachLop,
  getDanhSachThamGia,
  getHoatDongNgoaiKhoa,
} from '@/services/HoatDongNgoaiKhoa/hoatdongngoaikhoa';
import { useState } from 'react';
import type { HoatDongNgoaiKhoa } from '@/services/HoatDongNgoaiKhoa';

export default () => {
  const [danhSach, setDanhSach] = useState<HoatDongNgoaiKhoa.Record[]>([]);
  const [danhSachThamGia, setDanhSachThamGia] = useState<HoatDongNgoaiKhoa.Record[]>([]);
  const [danhSachLop, setDanhSachLop] = useState<HoatDongNgoaiKhoa.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [totalThamGia, setTotalThamGia] = useState<number>(0);
  const [totalLop, setTotalLop] = useState<number>(0);
  const [record, setRecord] = useState<HoatDongNgoaiKhoa.Record>({} as any);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);

  const getHoatDongNgoaiKhoaModel = async (donViId?: string) => {
    setLoading(true);
    const response = await getHoatDongNgoaiKhoa({ page, limit, cond, donViId });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  const getDanhSachThamGiaModel = async (idHoatDong?: string, donViId?: string) => {
    setLoading(true);
    const response = await getDanhSachThamGia({ page, limit, cond, idHoatDong, donViId });
    const arrHocSinh: HoatDongNgoaiKhoa.Record[] = [];
    response?.data?.data?.result?.map((item: HoatDongNgoaiKhoa.Record, index: number) =>
      arrHocSinh.push({ ...item, index: index + 1 + (page - 1) * limit }),
    );
    setDanhSachThamGia(arrHocSinh ?? []);
    setTotalThamGia(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const getDanhSachLopModel = async (idHoatDong?: string) => {
    setLoading(true);
    const response = await getDanhSachLop({ page, limit, cond, idHoatDong });
    setDanhSachLop(response?.data?.data?.result ?? []);
    setTotalLop(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  return {
    danhSach,
    record,
    setRecord,
    loading,
    setLoading,
    getHoatDongNgoaiKhoaModel,
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
    getDanhSachThamGiaModel,
    danhSachThamGia,
    totalThamGia,
    getDanhSachLopModel,
    danhSachLop,
    totalLop,
  };
};
