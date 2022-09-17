import {
  getDiemDanhPhuHuynh,
  postDiemDanh,
  getDiemDanhTheoNgay,
} from '@/services/DiemDanhPhuHuynh/diemdanhphuhuynh';
import { useState } from 'react';
import type { DiemDanhPhuHuynh } from '@/services/DiemDanhPhuHuynh';
import moment from 'moment';
import { notification } from 'antd';

export default () => {
  const [danhSach, setDanhSach] = useState<DiemDanhPhuHuynh.Record[]>([]);
  const [record, setRecord] = useState<DiemDanhPhuHuynh.Record>();
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [date, setDate] = useState(moment(new Date()));

  const getDiemDanhPhuHuynhModel = async () => {
    setLoading(true);
    const response = await getDiemDanhPhuHuynh({ page, limit, cond });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  const postDiemDanhModel = async (payload: any) => {
    try {
      await postDiemDanh(payload);
      notification.success({
        message: 'Điểm danh thành công',
      });
    } catch (e) {
      notification.error({
        message: 'Điểm danh không thành công',
      });
    }
  };

  const getDiemDanhTheoNgayModel = async (payload: any) => {
    const response = await getDiemDanhTheoNgay(payload);
    return response?.data?.data;
  };

  return {
    date,
    setDate,
    danhSach,
    loading,
    setLoading,
    getDiemDanhPhuHuynhModel,
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
    setRecord,
    record,
    postDiemDanhModel,
    getDiemDanhTheoNgayModel,
  };
};
