import {
  getTemplateLichService,
  getDonViLopService,
  delTemplateChiTiet,
} from '@/pages/QuanLyTemplateLichHoc/service';
import { useState } from 'react';
import type { QuanLyLop } from '@/services/QuanLyLop';
import {
  addTemplate,
  updTemplate,
  delTemplate,
  addTemplateChiTiet,
  getTemplateChiTiet,
  updTemplateChiTiet,
} from '@/pages/QuanLyTemplateLichHoc/service';
import { notification } from 'antd';

export default () => {
  const [danhSach, setDanhSach] = useState<QuanLyLop.Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [record, setRecord] = useState<QuanLyLop.Record>({} as any);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [danhSachLop, setDanhSachLop] = useState<any>([]);
  const [danhSachEvent, setDanhSachEvent] = useState([]);

  const getTemplateLich = async (payload?: any) => {
    setLoading(true);
    const response = await getTemplateLichService({
      page: payload?.page ?? page,
      limit: payload?.limit ?? limit,
      cond: payload?.cond ?? cond,
    });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const getDonViLop = async (payload = {}) => {
    setLoading(true);
    const response = await getDonViLopService({
      page: 1,
      limit: 10000,
      cond: {
        ...payload,
        loaiDonVi: 'Lop',
      },
    });
    setDanhSachLop(response?.data?.data?.result ?? []);
    setLoading(false);
  };

  const getTemplateChiTietModel = async (id: string) => {
    setLoading(true);
    const response = await getTemplateChiTiet({ page: 1, limit: 100000, cond: {}, id });
    setDanhSachEvent(response?.data?.data?.result ?? []);
    setLoading(false);
  };

  const addTemplateChiTietModel = async (payload: { templateId: string }) => {
    try {
      setLoading(true);
      await addTemplateChiTiet(payload);
      getTemplateChiTietModel(payload?.templateId);
      setLoading(false);
      notification.success({
        message: 'Thêm mới thành công',
      });
    } catch (e) {
      notification.error({
        message: 'Thêm mới không thành công',
      });
    }
  };

  const updTemplateChiTietModel = async (payload: any) => {
    const newPayload = { ...payload };
    try {
      setLoading(true);
      delete newPayload.title;
      delete newPayload.start;
      delete newPayload.end;
      await updTemplateChiTiet(newPayload);
      getTemplateChiTietModel(newPayload?.templateId);
      setLoading(false);
      notification.success({
        message: 'Chỉnh sửa thành công',
      });
    } catch (e) {
      notification.error({
        message: 'Chỉnh sửa không thành công',
      });
    }
  };

  const delTemplateChiTietModel = async (payload: { templateId: string }) => {
    try {
      setLoading(true);
      await delTemplateChiTiet(payload);
      getTemplateChiTietModel(payload?.templateId);
      setLoading(false);
      notification.success({
        message: 'Xóa thành công',
      });
    } catch (e) {
      notification.error({
        message: 'Xóa không thành công',
      });
    }
  };

  const addTemplateModel = async (payload: any) => {
    try {
      setLoading(true);
      const response = await addTemplate(payload);
      getTemplateLich();
      setLoading(false);
      notification.success({
        message: 'Thêm mới thành công',
      });
      return response?.data?.data;
    } catch (e) {
      notification.error({
        message: 'Thêm mới không thành công',
      });
    }
    return true;
  };

  const updTemplateModel = async (payload: any) => {
    try {
      setLoading(true);
      await updTemplate(payload);
      getTemplateLich();
      setLoading(false);
      notification.success({
        message: 'Chỉnh sửa thành công',
      });
    } catch (e) {
      notification.error({
        message: 'Chỉnh sửa không thành công',
      });
    }
  };

  const delTemplateModel = async (payload: any) => {
    try {
      setLoading(true);
      await delTemplate(payload);
      getTemplateLich();
      setLoading(false);
      notification.success({
        message: 'Xóa thành công',
      });
    } catch (e) {
      notification.error({
        message: 'Xóa không thành công',
      });
    }
  };

  return {
    danhSach,
    record,
    setRecord,
    loading,
    setLoading,
    getTemplateLich,
    addTemplateModel,
    updTemplateModel,
    delTemplateModel,
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
    getDonViLop,
    danhSachLop,
    addTemplateChiTietModel,
    getTemplateChiTietModel,
    updTemplateChiTietModel,
    delTemplateChiTietModel,
    danhSachEvent,
  };
};
