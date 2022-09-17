import { getDiemDanhGiaoVien, xuLyDiemDanhGV } from '@/services/DiemDanhGiaoVien/diemdanhgiaovien';
import { useState } from 'react';
import type { DiemDanhGiaoVien as IDiemDanhGiaoVien } from '@/services/DiemDanhGiaoVien';
import moment from 'moment';

export default () => {
  const [danhSach, setDanhSach] = useState<IDiemDanhGiaoVien.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [record, setRecord] = useState<IDiemDanhGiaoVien.Record>({} as any);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);

  const getDiemDanhGiaoVienModel = async (
    donViId?: string,
    ngay?: number,
    thang?: number,
    nam?: number,
  ) => {
    setLoading(true);
    const response = await getDiemDanhGiaoVien({ page, limit, cond, donViId, ngay, thang, nam });
    let danhSach = response?.data?.data?.result ?? [];
    let danhSachDaFilter = [];
    // for (let i = 0; i < danhSach.length; i++) {
    //   let item = danhSach[i];
    //   let len = danhSachDaFilter.filter((x) => x.userId === item.userId)?.length ?? 0;
    //   if (len < 1) {
    //     let arr = [];
    //     let tmp = item;
    //     for (let j = i; j < danhSach.length; j++) {
    //       let e = danhSach[j];
    //       if (e?.userId === item?.userId) {
    //         arr = arr.concat(e);
    //       }
    //     }
    //     arr.map((x) => {
    //       if (
    //         moment(new Date(x.thoiGianChamCong)).isAfter(moment(new Date(tmp.thoiGianChamCong)))
    //       ) {
    //         tmp = x;
    //       }
    //     });
    //     danhSachDaFilter = danhSachDaFilter.concat(tmp);
    //   }
    // }
    setDanhSach(danhSach);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  const doiTrangThai = async (
    id: string,
    value: string,
    donViId?: string,
    ngay?: number,
    thang?: number,
    nam?: number,
  ) => {
    setLoading(true);
    await xuLyDiemDanhGV({ id, trangThai: value });

    await getDiemDanhGiaoVienModel(donViId, ngay, thang, nam);
    setLoading(false);
  };

  return {
    danhSach,
    record,
    setRecord,
    loading,
    setLoading,
    getDiemDanhGiaoVienModel,
    doiTrangThai,
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
  };
};
