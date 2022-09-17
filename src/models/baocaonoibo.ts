import { useState } from 'react';
import {
  getBaoCaoGiaoVienTheoThang,
  getBaoCaoHocSinhTheoThang,
  getBaoCaoThang,
  getBaoCaoTheoNgay,
  getBaoCaoTheoNgayChuTruong,
  getBaoCaoTheoThangChuTruong,
  getLopHocSinh,
  getLopHocSinhWithSchool,
  thongKeBaoCaoThang,
  thongKeBaoCaoThangChuTruong,
  thongKeTaiSanThang,
  thongKeTaiSanThangChuTruong,
  thongKeTienHoc,
  thongKeTienHocChuTruong,
  tinhLaiBaoCao,
  tinhLaiBaoCaoNgayChuTruong,
  tinhLaiBaoCaoThang,
  tinhLaiBaoCaoThangChuTruong,
} from '@/services/BaoCaoNoiBo/baocaonoibo';
import {BaoCaoNoiBo, IThongKeHocPhiThang, IThongKeTaiSanThang, IThongKeThang} from '@/services/BaoCaoNoiBo';
import thongKeTheoThang from '@/pages/NoiBo/components/thongKeTheoThang';

export default () => {
  const [dataGetBaoCao, setDataGetBaoCao] = useState<BaoCaoNoiBo.DataBaoCaoTheoNgay>();
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [loadingBaoCaoNoiBo, setLoadingBaoCaoNoiBo] = useState<boolean>(false);
  const [dataBaoCaoHocSinhThang, setDataBaoCaoHocSinhThang] = useState<BaoCaoNoiBo.IDataHsThang[]>(
    [],
  );
  const [lop, setLop] = useState<BaoCaoNoiBo.IDataLop[]>([]);
  const [dataBaoCaoGiaoVienThang, setDataBaoCaoGiaoVienThang] = useState<
    BaoCaoNoiBo.IDataGVThang[]
  >([]);
  const [dataThang, setDataThang] = useState<BaoCaoNoiBo.IDataThang[]>([]);
  const [dataThongKeThang, setDataThongKeThang] = useState<BaoCaoNoiBo.IThongKeThang[]>([]);
  const [dataThongKeTaiSanThang, setDataThongKeTaiSanThang] = useState<BaoCaoNoiBo.IThongKeTaiSanThang>();
  const [dataThongKeHocPhiThang, setDataThongKeHocPhiThang] = useState<BaoCaoNoiBo.IThongKeHocPhiThang>();
  const getDataBaoCaoNgay = async (data: BaoCaoNoiBo.DataGetBaoCaoNgay) => {
    const res = await getBaoCaoTheoNgay(data);
    if (res) {
      setDataGetBaoCao(res?.data?.data);
    }
  };
  const getDataBaoCaoHocSinhThang = async (data: BaoCaoNoiBo.DataGetBaoCaoThang) => {
    setLoadingBaoCaoNoiBo(true);
    const obj = { ...data, page: page, limit: limit };
    const res = await getBaoCaoHocSinhTheoThang(obj);
    if (res) {
      setDataBaoCaoHocSinhThang(res?.data?.result);
      setTotal(res?.data?.total);
    }
    setLoadingBaoCaoNoiBo(false);
  };
  const getDataBaoCaoGiaoVienThang = async (data: BaoCaoNoiBo.DataGetBaoCaoThang) => {
    setLoadingBaoCaoNoiBo(true);
    const obj = { ...data, page: page, limit: limit };
    const res = await getBaoCaoGiaoVienTheoThang(obj);
    if (res) {
      setDataBaoCaoGiaoVienThang(res?.data?.data.result);
      setTotal(res?.data?.data.total);
    }
    setLoadingBaoCaoNoiBo(false);
  };
  const getDataBaoCaoNgayChuTruong = async (data: BaoCaoNoiBo.DataGetBaoCaoNgay) => {
    const res = await getBaoCaoTheoNgayChuTruong(data);
    if (res) {
      setDataGetBaoCao(res?.data?.data);
    }
  };
  const getDataBaoCaoThangChuTruong = async (data: BaoCaoNoiBo.DataGetBaoCaoNgay) => {
    const res = await getBaoCaoTheoThangChuTruong(data);
    if (res) {
      const arr: BaoCaoNoiBo.IDataThang[] = [];
      arr.push(res?.data?.data);
      setDataThang(arr);
    }
  };
  const tinhLaiBaoCaoNoiBo = async (data: BaoCaoNoiBo.DataGetBaoCaoThang) => {
    const obj = { ...data, page: page, limit: limit };
    const res = await tinhLaiBaoCao(obj);
    if (res) {
    }
  };
  const tinhLaiBaoCaoNoiBoThang = async (data: BaoCaoNoiBo.DataGetBaoCaoThang) => {
    const obj = { ...data, page: page, limit: limit };
    const res = await tinhLaiBaoCaoThang(obj);
    if (res) {
    }
  };
  const tinhLaiBaoCaoNoiBoNgayChuTruong = async (data: BaoCaoNoiBo.DataGetBaoCaoThang) => {
    const obj = { ...data, page: page, limit: limit };
    const res = await tinhLaiBaoCaoNgayChuTruong(obj);
    if (res) {
    }
  };
  const tinhLaiBaoCaoNoiBoThangChuTruong = async (data: BaoCaoNoiBo.DataGetBaoCaoThang) => {
    const obj = { ...data, page: page, limit: limit };
    const res = await tinhLaiBaoCaoThangChuTruong(obj);
    if (res) {
    }
  };
  const getDataBaoCaoThang = async (data: BaoCaoNoiBo.DataGetBaoCaoThang) => {
    setLoadingBaoCaoNoiBo(true);
    const obj = { ...data, page: page, limit: limit };
    const res = await getBaoCaoThang(obj);
    if (res) {
      const arr: BaoCaoNoiBo.IDataThang[] = [];
      arr.push(res?.data?.data);
      setDataThang(arr);
    }
    setLoadingBaoCaoNoiBo(false);
  };
  const getDataLop = async () => {
    setLoadingBaoCaoNoiBo(true);
    const res = await getLopHocSinh({ page: page, limit: 10000 });
    if (res) {
      setLop(res?.data.data.result);
    }
    setLoadingBaoCaoNoiBo(false);
  };
  const getDataLopWithSchool = async (donViId: string) => {
    const res = await getLopHocSinhWithSchool(donViId, { page: page, limit: 10000 });
    if (res) {
      setLop(res?.data.data.result);
    }
  };
  const getDataThongKeThang = async (data: BaoCaoNoiBo.DataGetBaoCaoThang) => {
    setLoadingBaoCaoNoiBo(true);
    const obj = { ...data, page: page, limit: limit };
    const res = await thongKeBaoCaoThang(obj);
    if (res) {
      // const arr: BaoCaoNoiBo.IDataThang[] = [];
      // arr.push(res?.data?.data);
      setDataThongKeThang(res?.data?.data);
    }
    setLoadingBaoCaoNoiBo(false);
  };
  const getDataThongKeChuTruongThang = async (data: BaoCaoNoiBo.DataGetBaoCaoNgay) => {
    setLoadingBaoCaoNoiBo(true);
    const obj = { ...data, page: page, limit: limit };
    const res = await thongKeBaoCaoThangChuTruong(obj);
    if (res) {
      // const arr: BaoCaoNoiBo.IDataThang[] = [];
      // arr.push(res?.data?.data);
      setDataThongKeThang(res?.data?.data);
    }
    setLoadingBaoCaoNoiBo(false);
  };
  const getDataThongKeTaiSanThang = async (truongId: string) => {
    setLoadingBaoCaoNoiBo(true);
    const res = await thongKeTaiSanThang(truongId);
    if (res) {
      // const arr: BaoCaoNoiBo.IDataThang[] = [];
      // arr.push(res?.data?.data);
      setDataThongKeTaiSanThang(res?.data?.data);
    }
    setLoadingBaoCaoNoiBo(false);
  };
  const getDataThongKeTaiSanChuTruongThang = async () => {
    setLoadingBaoCaoNoiBo(true);
    const res = await thongKeTaiSanThangChuTruong();
    if (res) {
      setDataThongKeTaiSanThang(res?.data);
    }
    setLoadingBaoCaoNoiBo(false);
  };
  const getDataThongKeHocPhi = async (truongId: string, ngay: number, nam: number) => {
    setLoadingBaoCaoNoiBo(true);
    const res = await thongKeTienHoc(truongId, ngay, nam);
    if (res) {
      console.log(res);
      setDataThongKeHocPhiThang(res?.data?.data)
    }
    setLoadingBaoCaoNoiBo(false);
  };
  const getDataThongKeHocPhiChuTruong = async ( ngay: number, nam: number) => {
    setLoadingBaoCaoNoiBo(true);
    const res = await thongKeTienHocChuTruong( ngay, nam);
    if (res) {
      console.log(res);
      setDataThongKeHocPhiThang(res?.data?.data)
    }
    setLoadingBaoCaoNoiBo(false);
  };
  return {
    dataGetBaoCao,
    getDataBaoCaoNgay,
    total,
    setTotal,
    page,
    setPage,
    limit,
    setLimit,
    cond,
    setCondition,
    loadingBaoCaoNoiBo,
    setLoadingBaoCaoNoiBo,
    getDataBaoCaoHocSinhThang,
    getDataBaoCaoGiaoVienThang,
    dataBaoCaoHocSinhThang,
    dataBaoCaoGiaoVienThang,
    tinhLaiBaoCaoNoiBo,
    getDataBaoCaoThang,
    dataThang,
    filterInfo,
    setFilterInfo,
    getDataLop,
    lop,
    getDataBaoCaoNgayChuTruong,
    tinhLaiBaoCaoNoiBoThangChuTruong,
    tinhLaiBaoCaoNoiBoNgayChuTruong,
    getDataBaoCaoThangChuTruong,
    getDataLopWithSchool,
    tinhLaiBaoCaoNoiBoThang,
    getDataThongKeThang,
    dataThongKeThang,
    getDataThongKeChuTruongThang,
    dataThongKeTaiSanThang,
    getDataThongKeTaiSanThang,
    getDataThongKeTaiSanChuTruongThang,
    getDataThongKeHocPhi,
    getDataThongKeHocPhiChuTruong,
    dataThongKeHocPhiThang
  };
};
