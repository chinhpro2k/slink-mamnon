import { getBangDinhDuong, getDanhMucThucPham } from '@/services/DanhMucThucPham/danhmucthucpham';
import { useState } from 'react';
import type { DanhMucThucPham as IDanhMucThucPham } from '@/services/DanhMucThucPham';

export default () => {
  const [danhSach, setDanhSach] = useState<IDanhMucThucPham.Record[]>([]);
  const [dataBangDinhDuong2, setDataBangDinhDuong2] = useState<IDanhMucThucPham.Record[]>([]);
  const [dataBangDinhDuong3, setDataBangDinhDuong3] = useState<IDanhMucThucPham.Record[]>([]);
  const [dataBangDinhDuong4, setDataBangDinhDuong4] = useState<IDanhMucThucPham.Record[]>([]);
  const [dataBangDinhDuong5, setDataBangDinhDuong5] = useState<IDanhMucThucPham.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [record, setRecord] = useState<IDanhMucThucPham.Record>({} as any);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const vaiTro = localStorage.getItem('vaiTro');
  const getDanhMucThucPhamModel = async (donViId?: string, limitOther?: number) => {
    setLoading(true);
    const response = await getDanhMucThucPham({
      page,
      limit: limitOther ? limitOther : limit,
      cond: {
        ...cond,
        // ...(donViId === 'Tất cả' && {
        //   datatype: vaiTro === 'SuperAdmin' || vaiTro === 'Admin' ? 'Hệ thống' : 'Khác',
        // }),
        // datatype: vaiTro === 'SuperAdmin' || vaiTro === 'Admin' ? 'Hệ thống' : 'Khác',
        ...(vaiTro === 'SuperAdmin' || vaiTro === 'Admin' ? {} : { datatype: 'Khác' }),
      },
      donViId,
    });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };
  const getBangDinhDuongModel = async () => {
    setLoading(true);
    const response = await getBangDinhDuong();
    const calo2: any[] = [];
    const calo3: any[] = [];
    const calo4: any[] = [];
    const calo5: any[] = [];

    response?.data?.data?.calo?.forEach((item: { soBua: number }, index: number) => {
      if (item?.soBua === 2) {
        calo2?.push(response?.data?.data?.calo?.[index]);
      }
      if (item?.soBua === 3) {
        calo3?.push(response?.data?.data?.calo?.[index]);
      }
      if (item?.soBua === 4) {
        calo4?.push(response?.data?.data?.calo?.[index]);
      }
      if (item?.soBua === 5) {
        calo5?.push(response?.data?.data?.calo?.[index]);
      }
    });
    if (calo2.length > 0) calo2[0].dinhDuong = response?.data?.data?.dinhDuong;
    if (calo3.length > 0) calo3[0].dinhDuong = response?.data?.data?.dinhDuong;
    if (calo4.length > 0) calo4[0].dinhDuong = response?.data?.data?.dinhDuong;
    if (calo5.length > 0) calo5[0].dinhDuong = response?.data?.data?.dinhDuong;

    setDataBangDinhDuong2(calo2);
    setDataBangDinhDuong3(calo3);
    setDataBangDinhDuong4(calo4);
    setDataBangDinhDuong5(calo5);
    setLoading(false);
  };

  return {
    danhSach,
    record,
    setRecord,
    loading,
    setLoading,
    getDanhMucThucPhamModel,
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
    dataBangDinhDuong2,
    dataBangDinhDuong3,
    dataBangDinhDuong4,
    dataBangDinhDuong5,
    getBangDinhDuongModel,
  };
};
