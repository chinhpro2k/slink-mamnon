import type { KhoanChiTieu as IKhoanChiTieu } from '@/services/KhoanChiTieu';
import {
  getHoaDonMuaHang,
  getKhoanChiTieu,
  getLuongThang,
  getSoTienChiGiaoVien,
} from '@/services/KhoanChiTieu/khoanchitieu';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<IKhoanChiTieu.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [record, setRecord] = useState<IKhoanChiTieu.Record>({} as any);
  const [totalChiTieu, setTotalChiTieu] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>();
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [dataChiCoGiao, setDataChiCoGiao] = useState<IKhoanChiTieu.IDataChiCoGiao[]>([]);
  const [dataLuongThang, setDataLuongThang] = useState<IKhoanChiTieu.IDataLuong[]>([]);
  const [dataHoaDon, setDataHoaDon] = useState<IKhoanChiTieu.IDataHoaDon[]>([]);
  const [type, setType] = useState<'hoaDonMuaHang' | 'luongThang'>();
  const getKhoanChiTieuModel = async (donViId?: string, condition?: any) => {
    setLoading(true);
    if (condition) {
      // setCondition({...cond,...condition})
      const sort = { module: -1 };
      const response = await getKhoanChiTieu({ page, limit, cond: condition, donViId, sort });
      setDanhSach(response?.data?.data?.result ?? []);
      setTotal(response?.data?.data?.total ?? 0);
      setLoading(false);

      let totalKhoanChiTieu: number = 0;
      response?.data?.data?.result?.forEach((item: { soTien: number }) => {
        totalKhoanChiTieu += item?.soTien;
        return totalKhoanChiTieu;
      });
      setTotalChiTieu(totalKhoanChiTieu);
    }
  };
  const getDataTienChiGiaoVien = async (organizationId: string, thang: number, nam: number) => {
    const res = await getSoTienChiGiaoVien({
      donViId: organizationId as string,
      page: page,
      limit: limit,
      cond: { thang: thang, nam: nam },
    });
    if (res) {
      setDataChiCoGiao(res?.data?.data.result);
    }
  };
  const getLuongThangModel = async (
    thang: number,
    nam: number,
    donViId?: string,
    condition?: any,
  ) => {
    setLoading(true);
    const response = await getLuongThang({ thang, nam, cond:condition, donViId });
    setLoading(false);
    setDataLuongThang(response?.data?.data);
  };
  const getHoaDonModel = async (thang: number, nam: number, donViId?: string, condition?: any) => {
    setLoading(true);
    const response = await getHoaDonMuaHang({ thang, nam, cond:condition, donViId });
    setLoading(false);
    setDataHoaDon(response?.data?.data);
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
    getKhoanChiTieuModel,
    setVisibleForm,
    visibleForm,
    edit,
    setEdit,
    totalChiTieu,
    dataChiCoGiao,
    getDataTienChiGiaoVien,
    getHoaDonModel,
    getLuongThangModel,
    dataLuongThang,
    dataHoaDon,
    type,
    setType,
  };
};
