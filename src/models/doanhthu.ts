import type { DoanhThu as IDoanhThu } from '@/services/DoanhThu';
import {
  exportBaoCaoDoanhThuTheoNam,
  getDoanhThu,
  getDoanhThuChuTruong,
  getDoanhThuDonVi,
  getHoaDonMuaHang,
  tinhLaiDoanhThu,
} from '@/services/DoanhThu/doanhthu';
import { useState } from 'react';
import FileDownload from 'js-file-download';
import moment from 'moment';
import { BaoCaoNoiBo } from '@/services/BaoCaoNoiBo';
import {
  thongKeBaoCaoThangChuTruong,
  thongKeTaiSanThang,
  thongKeTaiSanThangChuTruong,
} from '@/services/BaoCaoNoiBo/baocaonoibo';

export default () => {
  const [danhSach, setDanhSach] = useState<IDoanhThu.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [record, setRecord] = useState<IDoanhThu.Record>({} as any);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [disable, setDisable] = useState<boolean>(false);
  const [dataHoaDonMuaHang, setDataHoaDonMuaHang] = useState<IDoanhThu.IDataHoaDonMuaHang[]>([]);
  const [doanhThuDonVi, setDoanhThuDonVi] = useState<IDoanhThu.IDataDoanhThuDonVi[]>();
  const [loaiDoanhThu, setLoaiDoanhThu] = useState<'Hệ thống' | 'Khác'>('Hệ thống');
  const [dataThongKeTaiSanThang, setDataThongKeTaiSanThang] = useState<BaoCaoNoiBo.IThongKeThang[]>(
    [],
  );
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [date, setDate] = useState<any>(moment());
  const getDoanhThuModel = async (donViId?: string, thang?: number, nam?: number) => {
    setLoading(true);
    // if (thang && nam) {
    //   setCondition({ ...cond, thang: thang, nam: nam });
    // }
    const response = await getDoanhThu({
      page,
      limit,
      cond,
      donViId,
      loaiDoanhThu: loaiDoanhThu,
      thang,
      nam,
    });

    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };
  const getDoanhThuChuTruongModel = async (donViId?: string, thang?: number, nam?: number) => {
    setLoading(true);
    // if (thang && nam) {
    //   setCondition({ ...cond, thang: thang, nam: nam });
    // }
    const response = await getDoanhThuChuTruong({
      cond,
      loaiDoanhThu: loaiDoanhThu,
      thang,
      nam,
    });

    setDanhSach(response?.data?.data ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };
  const tinhLaiDoanhThuModel = async (payload: {
    truongId: string;
    thang: number;
    nam: number;
  }) => {
    setLoading(true);
    const response = await tinhLaiDoanhThu(payload);
    if (response) {
    }
  };
  // const getBaocaoDoanhThuModel = async (donViId?: string) => {
  //   setLoading(true);
  //   const response = await getDoanhThu({ page, limit, cond, donViId, loaiDoanhThu: 'Hệ thống' });
  //   setDanhSach(response?.data?.data?.result ?? []);
  //   setTotal(response?.data?.data?.total ?? 0);
  //   setLoading(false);
  // };

  // const exportCongTrinhNCKHByNamModel = async () => {
  //   setLoading(true);
  //   const response = await exportCongTrinhNCKHByNam(year);
  //   FileDownload(response.data, `NCKH-${year}.xlsx`);
  //   setLoading(false);
  // };

  const exportBaoCaoDoanhThuTheoNamModel = async (payload: {
    donViId: string;
    thang: number;
    nam: number;
    cond?: any;
  }) => {
    setLoading(true);
    const response = await exportBaoCaoDoanhThuTheoNam(payload);
    FileDownload(response.data, `BaoCaoDoanhThu-${payload.nam}.xlsx`);
    setLoading(false);
  };
  const getDataHoaDonMuaHang = async (payload: {
    truongId: string;
    thang: number;
    nam: number;
    cond?: any;
  }) => {
    setLoading(true);
    const res = await getHoaDonMuaHang(payload);
    if (res) {
      setDataHoaDonMuaHang(res?.data.data);
    }
    setLoading(false);
  };
  const getDoanhThuDonViModel = async (payload: {
    donViId: string;
    thang: number;
    nam: number;
    cond?: any;
  }) => {
    setLoading(true);
    const res = await getDoanhThuDonVi(payload);
    if (res) {
      const arr = [];
      arr.push(res?.data.data);
      setDoanhThuDonVi(arr);
    }
    setLoading(false);
  };
  return {
    year,
    setYear,
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
    getDoanhThuModel,
    exportBaoCaoDoanhThuTheoNamModel,
    setVisibleForm,
    visibleForm,
    edit,
    setEdit,
    setDisable,
    disable,
    getDataHoaDonMuaHang,
    dataHoaDonMuaHang,
    getDoanhThuDonViModel,
    doanhThuDonVi,
    loaiDoanhThu,
    setLoaiDoanhThu,
    tinhLaiDoanhThuModel,
    setMonth,
    month,
    getDoanhThuChuTruongModel,
    date,
    setDate,
  };
};
