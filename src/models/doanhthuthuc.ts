import type { DoanhThu as IDoanhThu } from '@/services/DoanhThu';
import {
  exportBaoCaoDoanhThuTheoNam,
  exportBaoCaoDoanhThuThucTheoNam,
  getDoanhThu,
  getDoanhThuChuTruong,
} from '@/services/DoanhThu/doanhthu';
import { useState } from 'react';
import FileDownload from 'js-file-download';

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
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [viewDoanhThuThuc, setViewDoanhThuThuc] = useState<boolean>(false);
const [donViIdThuc,setDonViIdThuc]=useState<string>('')
  const getDoanhThuThucModel = async (donViId?: string, thang?: number, nam?: number) => {
    setLoading(true);
    // if (thang && nam) {
    //   setCondition({ ...cond, thang: thang, nam: nam });
    // }
    const response = await getDoanhThu({
      page,
      limit,
      cond,
      donViId,
      loaiDoanhThu: 'Khác',
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
      loaiDoanhThu: 'Khác',
      thang,
      nam,
    });

    setDanhSach(response?.data?.data ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };
  const exportBaoCaoDoanhThuTheoNamModel = async (payload: {
    donViId: string;
    thang: number;
    nam: number;
    cond?: any;
    type?: string;
  }) => {
    // setLoading(true);
    const response = await exportBaoCaoDoanhThuThucTheoNam(payload);
    FileDownload(response.data, `BaoCaoDoanhThuLinhHoat-${payload.nam}.xlsx`);
    // setLoading(false);
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
    limit,
    setPage,
    setLimit,
    cond,
    setCondition,
    filterInfo,
    setFilterInfo,
    getDoanhThuThucModel,
    setVisibleForm,
    visibleForm,
    edit,
    setEdit,
    setDisable,
    disable,
    viewDoanhThuThuc,
    setViewDoanhThuThuc,
    exportBaoCaoDoanhThuTheoNamModel,
    month,
    setMonth,
    year,
    setYear,
    getDoanhThuChuTruongModel,
    setDonViIdThuc,donViIdThuc
  };
};
