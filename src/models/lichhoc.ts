import {
  getLichHoc,
  getTemplate,
  addLichFromTemplate,
  addTemplateFromLich,
  deleteAllLich,
} from '@/services/LichHoc/lichhoc';
import { useState } from 'react';
import type { LichHoc } from '@/services/LichHoc';
import { notification } from 'antd';

export default () => {
  const [danhSach, setDanhSach] = useState<LichHoc.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [danhSachTemplate, setDanhSachTemplate] = useState([]);

  const getLichHocModel = async (payload: any) => {
    setLoading(true);
    const response = await getLichHoc(payload);
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  const getTemplateModel = async (payload: any) => {
    setLoading(true);
    const response = await getTemplate(payload);
    setDanhSachTemplate(response?.data?.data?.result ?? []);
    setLoading(false);
  };

  const addLichFromTemplateModel = async (payload: any) => {
    try {
      setLoading(true);
      await addLichFromTemplate(payload);
      setLoading(false);
      notification.success({
        message: 'Thêm lịch thành công',
      });
    } catch (e) {
      notification.error({
        message: 'Thêm lịch không thành công',
      });
    }
  };

  const addTemplateFromLichModel = async (payload: any) => {
    try {
      setLoading(true);
      await addTemplateFromLich(payload);
      setLoading(false);
      notification.success({
        message: 'Thêm template thành công',
      });
    } catch (e) {
      notification.error({
        message: 'Thêm template không thành công',
      });
    }
  };

  const deleteAllLichModel = async (payload: any) => {
    try {
      setLoading(true);
      await deleteAllLich(payload);
      getLichHocModel(payload);
      setLoading(false);
      notification.success({
        message: 'Xóa tất cả lịch thành công',
      });
    } catch (e) {
      notification.error({
        message: 'Xóa tất cả lịch không thành công',
      });
    }
  };

  return {
    danhSach,
    loading,
    setLoading,
    getLichHocModel,
    total,
    setTotal,
    getTemplateModel,
    danhSachTemplate,
    addLichFromTemplateModel,
    addTemplateFromLichModel,
    deleteAllLichModel,
  };
};
