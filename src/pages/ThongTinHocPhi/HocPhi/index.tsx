/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { QuanLyLop } from '@/services/QuanLyLop';
import type { ThongTinHocPhi as IThongTinHocPhi } from '@/services/ThongTinHocPhi';
import {
  addThongTinHocPhiLop,
  updThongTinHocPhiLop,
} from '@/services/ThongTinHocPhi/thongtinhocphi';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import rules from '@/utils/rules';
import { EditOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Tabs,
} from 'antd';
import moment from 'moment';
import React, { useState, useRef, useEffect } from 'react';
import { useModel } from 'umi';
import BangHocPhiHS from './components/BangHocPhiHS';
import Formm from './components/FormHocPhi';
import ThongTinChiTiet from './components/ThongTinChiTiet';

const HocPhi = (props: { id?: string; idParent?: string }) => {
  const {
    loading: loadingDSHocPhi,
    getThongTinHocPhiLopModel,
    page,
    limit,
    cond,
    setRecord,
    setVisibleForm,
    setEdit,
    setRecordThongKeDiemDanh,
    thang,
    setThang,
    nam,
    setNam,
    message: messThongBao,
    setMessage,
    thongTinHocPhi,
    setThongTinHocPhi,
    setDate,
  } = useModel('thongtinhocphi');
  const [form] = Form.useForm();
  const [visibleHocPhi, setVisibleHocPhi] = useState<boolean>(false);
  const [danhSachThongKe, setDanhSachThongKe] = useState([]);
  const [dataLop, setDataLop] = useState<QuanLyLop.Record>();
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;

  const getDataLop = async () => {
    const result = await axios.get(`${ip3}/thong-tin-hoc-phi-lop/lop/${props.id}`, {
      params: {
        cond: {
          thang: thang,
          nam: nam,
        },
      },
    });
    setDataLop({ ...(result?.data?.data ?? {}) });
    const data = result?.data?.data ?? {};
    form.setFieldsValue({
      hocPhiDuKien: data?.hocPhiDuKien,
      tienAn1Ngay: data?.tienAn1Ngay,
      phuPhi: data?.phuPhi,
      soTienTrongMuon1Gio: data?.soTienTrongMuon1Gio,
      ghiChu: data?.ghiChu,
    });
  };
  const getThongKeDiemDanh = async () => {
    const result = await axios.get(
      `${ip3}/diem-danh/thong-ke/don-vi/${props?.id}/thang/${thang}/nam/${nam}`,
    );
    setDanhSachThongKe(result?.data?.data);
    const res = await axios.get(
      `${ip3}/thong-tin-hoc-phi-truong/truong/${organizationId}/thang/${thang}/nam/${nam}`,
    );
    setThongTinHocPhi({
      ...res?.data?.data,
    });
  };
  React.useEffect(() => {
    getDataLop();
    getThongKeDiemDanh();
  }, [thang, nam]);

  const onFinish = async (values: any) => {
    const newVal = values;
    newVal.lopId = props?.id;
    newVal.thang = thang;
    newVal.nam = nam;
    newVal.truongId = props?.idParent;
    if (dataLop?.hocPhiDuKien) {
      try {
        const res = await updThongTinHocPhiLop({
          ...newVal,
          id: dataLop?._id,
        });
        if (res?.status === 200) {
          message.success('Cập nhật thông tin học phí lớp thành công');
          getDataLop();
          return true;
        }
      } catch (error) {
        message.error('Cập nhật thông tin học phí lớp không thành công');
        return false;
      }
    }
    try {
      const res = await addThongTinHocPhiLop({
        ...newVal,
      });
      if (res?.status === 201) {
        message.success('Cập nhật thông tin học phí lớp thành công');
        setVisibleForm(false);
        getDataLop();
        return true;
      }
    } catch (error) {
      message.error('Cập nhật thông tin học phí lớp không thành công');
      return false;
    }

    return true;
  };
  const [valueDateChose, setValueDateChose] = useState<any>();
  const onChangeMonth = (val: any) => {
    setValueDateChose(val);
    setDate(val);
    if (val === null) {
      setThang(new Date().getMonth());
      setNam(new Date().getFullYear());
    } else {
      setThang(new Date(val).getMonth());
      setNam(new Date(val).getFullYear());
    }
  };
  useEffect(() => {
    if (thongTinHocPhi && new Date().getMonth() === thang) {
      localStorage.setItem('currentDayQuyetToan', thongTinHocPhi.ngayGuiThongBao.toString());
    }
  }, [thongTinHocPhi]);
  const renderLast = (record: IThongTinHocPhi.Record) => {
    return (
      <React.Fragment>
        <Button
          type="primary"
          shape="circle"
          title="Chỉnh sửa học phí"
          onClick={() => {
            setVisibleForm(true);
            setRecord(record);
            setEdit(true);
            setRecordThongKeDiemDanh(
              danhSachThongKe?.find((item: { conId: string }) => item?.conId === record?._id),
            );
          }}
        >
          <EditOutlined />
        </Button>
      </React.Fragment>
    );
  };

  const columns: IColumn<IThongTinHocPhi.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Họ và tên con',
      dataIndex: 'hoTen',
      align: 'center',
      width: 150,
    },
    {
      title: 'Họ và tên phụ huynh',
      dataIndex: ['user', 'profile', 'fullname'],
      align: 'center',
      width: 150,
    },
    {
      title: 'Số điện thoại phụ huynh',
      dataIndex: ['user', 'profile', 'phoneNumber'],
      align: 'center',
      width: 150,
    },

    {
      title: 'Thao tác',
      align: 'center',
      render: (record: IThongTinHocPhi.Record) => renderLast(record),
      fixed: 'right',
      width: 70,
    },
  ];

  const isOverdue = useRef(moment().date() > +thongTinHocPhi?.ngayGuiThongBao);

  const disableSuaThongTin = (): boolean => {
    let check: boolean = false;
    //Ngày hiện tại <= Ngày quyết toán(ở quản lý trường): Cho sửa thông tin chung ở tháng hiện tại , hiện tại +1, +2 ,... và tháng hiện tại -1
    // ngược lại Cho sửa thông tin chung ở tháng hiện tại , hiện tại +1, +2 ,...
    if (nam === moment().year() && localStorage.getItem('currentDayQuyetToan')) {
      if (moment().date() <= +(localStorage.getItem('currentDayQuyetToan') as string)) {
        if (
          moment(new Date(valueDateChose), 'DD/MM/YYYY').diff(
            moment(new Date(), 'DD/MM/YYYY'),
            'month',
          ) < -1
        ) {
          check = true;
        }
      } else {
        if (
          moment(new Date(valueDateChose), 'DD/MM/YYYY').diff(
            moment(new Date(), 'DD/MM/YYYY'),
            'month',
          ) < 0
        ) {
          check = true;
        }
      }
    }
    return check;
  };
  // const disableSuaThongTin =
  //   nam === moment().year() &&
  //   ((moment().date() <= +thongTinHocPhi?.ngayGuiThongBao ?
  //     (moment(new Date(valueDateChose), 'DD/MM/YYYY').diff(
  //       moment(new Date(), 'DD/MM/YYYY'),
  //       'month',
  //     ) < -1):())
  // ((isOverdue.current && moment().month() === thang) ||
  //   // Nếu chưa quá hạn thì có thể sửa tháng hiện tại và tháng trước (enable)
  //   (!isOverdue.current && (moment().month() === thang || moment().month() - 1 === thang)))

  return (
    <>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Thông tin chung" key="1">
          <DatePicker
            onChange={onChangeMonth}
            picker="month"
            format="MM-YYYY"
            style={{ marginRight: '10px', marginBottom: '15px' }}
            placeholder="Chọn tháng/năm"
            defaultValue={moment().year(nam).month(thang)}
          />
          <Card>
            <Form labelCol={{ span: 24 }} form={form} onFinish={onFinish}>
              <Row gutter={[16, 0]}>
                <Col xs={12} lg={6}>
                  <Form.Item
                    name="hocPhiDuKien"
                    label="Học phí dự kiến"
                    rules={[...rules.float(undefined, 0, 0), ...rules.required]}
                    style={{ marginBottom: 5 }}
                  >
                    <InputNumber
                      placeholder="Nhập học phí dự kiến"
                      style={{ width: '100%' }}
                      min={0}
                      step={5000}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      disabled={disableSuaThongTin()}
                    />
                  </Form.Item>
                </Col>
                <Col xs={12} lg={6}>
                  <Form.Item
                    name="tienAn1Ngay"
                    label="Tiền ăn/ngày"
                    rules={[...rules.float(undefined, 0, 0)]}
                    style={{ marginBottom: 5 }}
                  >
                    <InputNumber
                      placeholder="Nhập số tiền ăn/ngày"
                      style={{ width: '100%' }}
                      min={0}
                      step={5000}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      disabled={disableSuaThongTin()}
                    />
                  </Form.Item>
                </Col>
                <Col xs={12} lg={6}>
                  <Form.Item
                    name="phuPhi"
                    label="Phụ phí"
                    rules={[...rules.float(undefined, 0, 0)]}
                    style={{ marginBottom: 5 }}
                  >
                    <InputNumber
                      placeholder="Nhập phụ phí"
                      style={{ width: '100%' }}
                      min={0}
                      step={5000}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      disabled={disableSuaThongTin()}
                    />
                  </Form.Item>
                </Col>
                <Col xs={12} lg={6}>
                  <Form.Item
                    name="soTienTrongMuon1Gio"
                    label="Số tiền trông muộn/giờ/tháng"
                    rules={[...rules.float(undefined, 0, 0)]}
                    style={{ marginBottom: 5 }}
                  >
                    <InputNumber
                      placeholder="Nhập số tiền trông muộn/giờ/tháng"
                      style={{ width: '100%' }}
                      min={0}
                      step={5000}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      disabled={disableSuaThongTin()}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="ghiChu" label="Ghi chú" style={{ marginBottom: 5 }}>
                <Input.TextArea
                  rows={3}
                  placeholder="Nhập ghi chú"
                  disabled={disableSuaThongTin()}
                />
              </Form.Item>
              <br />
              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  style={{ marginRight: 8 }}
                  htmlType="submit"
                  type="primary"
                  disabled={disableSuaThongTin()}
                >
                  Chỉnh sửa
                </Button>
              </Form.Item>
            </Form>
          </Card>
          <br />
          <TableBase
            border
            columns={columns}
            getData={() => getThongTinHocPhiLopModel(props?.id)}
            loading={loadingDSHocPhi}
            dependencies={[page, limit, cond]}
            modelName="thongtinhocphi"
            formType="Drawer"
            Form={Formm}
            widthDrawer="50%"
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Thông tin chi tiết" key="2">
          <ThongTinChiTiet id={props?.id} />
        </Tabs.TabPane>
      </Tabs>

      <Modal
        title={<div>Học phí tháng {1}</div>}
        visible={visibleHocPhi}
        footer={
          <Button type="primary" onClick={() => setVisibleHocPhi(false)}>
            Ok
          </Button>
        }
        onCancel={() => setVisibleHocPhi(false)}
        width="70%"
      >
        <BangHocPhiHS donViId={props?.id} thang={1} nam={1} />
      </Modal>
    </>
  );
};
export default HocPhi;
