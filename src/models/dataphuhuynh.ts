/* eslint-disable no-underscore-dangle */
import { getPhuHuynh } from '@/services/TaiKhoanPhuHuynh/taikhoanphuhuynh';
import { useState } from 'react';
import type { TaiKhoanPhuHuynh } from '@/services/TaiKhoanPhuHuynh';

export default () => {
  const [danhSach, setDanhSach] = useState<TaiKhoanPhuHuynh.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [recordPH, setRecordPH] = useState<TaiKhoanPhuHuynh.Record>();
  const [danhSachRole, setDanhSachRole] = useState<TaiKhoanPhuHuynh.Record[]>([]);

  const getPhuHuynhModel = async (idPhuHuynh?: string) => {
    setLoading(true);
    const response = await getPhuHuynh({ page, limit, cond: { ...cond, _id: idPhuHuynh } });
    const newArr: any[] = [];
    response?.data?.data?.result?.map((item: any) =>
      item?.roles?.map(
        (val: any) =>
          val?.systemRole === 'PhuHuynh' &&
          newArr?.push({ ...val, profile: { ...item?.profile }, _id: item?._id }),
      ),
    );
    let a = newArr;

    setDanhSachRole(response?.data?.data?.result?.[0]?.roles);
    setDanhSach(newArr ?? []);
    setTotal(newArr?.length ?? 0);
    setLoading(false);
  };

  return {
    danhSach,
    loading,
    setLoading,
    getPhuHuynhModel,
    setRecordPH,
    recordPH,
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
