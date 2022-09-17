import { getKhauPhanAn } from '@/services/KhauPhanAn/khauphanan';
import { useState } from 'react';
import type { KhauPhanAn as IKhauPhanAn } from '@/services/KhauPhanAn';
import type { DanhMucMonAn as IDanhMucMonAn } from '@/services/DanhMucMonAn';
import type { Truong as ITruong } from '@/services/Truong';
import {IReport} from "@/services/KhauPhanAn";

export default () => {
  const [danhSach, setDanhSach] = useState<IKhauPhanAn.Record[]>([]);
  const [danhSachNhaTre, setDanhSachNhaTre] = useState<IKhauPhanAn.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [totalNhaTre, setTotalNhaTre] = useState<number>(0);
  const [record, setRecord] = useState<IKhauPhanAn.Record>({} as any);
  const [dataEdit, setDataEdit] = useState<IKhauPhanAn.Record>({} as any);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [danhSachMonAn, setDanhSachMonAn] = useState<IDanhMucMonAn.Record[]>();
  const [visibleTinhToan, setVisibleTinhToan] = useState<boolean>(false);
  const [recordDieuChinh, setRecordDieuChinh] = useState<IKhauPhanAn.Record>();
  const [recordReport, setRecordReport] = useState<IKhauPhanAn.IReport[]>([]);
  const [danhSachTruong, setDanhSachTruong] = useState<ITruong.Record[]>([]);
  const [loaiHinh, setLoaiHinh] = useState<string>('Mầm non');

  const getKhauPhanAnModel = async () => {
    setLoading(true);
    const response = await getKhauPhanAn({
      page,
      limit,
      cond,
      loaiHinh: 'Mầm non',
      sort: { ngayAn: -1 },
    });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  const getKhauPhanAnNhaTreModel = async () => {
    setLoading(true);
    const response = await getKhauPhanAn({
      page,
      limit,
      cond,
      loaiHinh: 'Nhà trẻ',
      sort: { ngayAn: -1 },
    });
    setDanhSachNhaTre(response?.data?.data?.result ?? []);
    setTotalNhaTre(response?.data?.data?.total);
    setLoading(false);
  };

  return {
    danhSach,
    record,
    setRecord,
    loading,
    setLoading,
    getKhauPhanAnModel,
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
    setDanhSachMonAn,
    danhSachMonAn,
    setVisibleTinhToan,
    visibleTinhToan,
    setRecordDieuChinh,
    recordDieuChinh,
    danhSachTruong,
    setDanhSachTruong,
    loaiHinh,
    setLoaiHinh,
    getKhauPhanAnNhaTreModel,
    totalNhaTre,
    danhSachNhaTre,
    setRecordReport,recordReport,setDataEdit,dataEdit
  };
};
