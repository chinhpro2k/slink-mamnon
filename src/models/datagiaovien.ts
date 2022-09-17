/* eslint-disable no-underscore-dangle */
import { getGiaoVien } from '@/services/TaiKhoanGiaoVien/taikhoangiaovien';
import { useState } from 'react';
import type { TaiKhoanGiaoVien } from '@/services/TaiKhoanGiaoVien';

export default () => {
  const [danhSach, setDanhSach] = useState<TaiKhoanGiaoVien.Record[]>([]);
  const [danhSachRole, setDanhSachRole] = useState<TaiKhoanGiaoVien.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [recordGV, setRecordGV] = useState<TaiKhoanGiaoVien.Record>();
  const [checkDataHoSo, setCheckDataHoSo] = useState<string>();
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [recordHoSo, setRecordHoSo] = useState<ITaiKhoanGiaoVien.Record>();
  const [newRecord, setNewRecord] = useState<ITaiKhoanGiaoVien.Record>();

  const getGiaoVienModel = async (idGiaoVien?: string) => {
    setLoading(true);
    const response = await getGiaoVien({
      page,
      limit,
      cond: { ...cond, _id: idGiaoVien },
      filterInfo,
    });
    const newArr: any[] = [];
    console.log('data giao vien', response?.data?.data?.result)
    response?.data?.data?.result?.map((item: any) =>
      item?.roles?.map(
        (val: any) =>
          val?.systemRole === 'GiaoVien' &&
          newArr?.push({ ...val, profile: { ...item?.profile }, _id: item?._id }),
      ),
    );
    setDanhSachRole(response?.data?.data?.result?.[0]?.roles);
    setDanhSach(newArr ?? []);
    setTotal(newArr?.length ?? 0);
    setLoading(false);
  };

  return {
    newRecord,
    setNewRecord,
    visibleDrawer,
    setVisibleDrawer,
    checkDataHoSo,
    setCheckDataHoSo,
    recordHoSo,
    setRecordHoSo,
    danhSach,
    recordGV,
    setRecordGV,
    loading,
    setLoading,
    getGiaoVienModel,
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
    danhSachRole,
    setDanhSach,
  };
};
