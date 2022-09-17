/* eslint-disable no-underscore-dangle */
import type { ThongTinHocPhi as IThongTinHocPhi } from '@/services/ThongTinHocPhi';
import { addThongTinHocPhi, updThongTinHocPhiCon } from '@/services/ThongTinHocPhi/thongtinhocphi';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, InputNumber, message, Row, Input, Select, Modal } from 'antd';
import React, { useState } from 'react';
import { useModel } from 'umi';
import { DeleteOutlined } from '@ant-design/icons';
import { currencyFormat } from '@/utils/utils';
import moment from 'moment';

const FormThongTinHocPhi = () => {
  const [form] = Form.useForm();
  const {
    edit,
    loading,
    record,
    setVisibleForm,
    recordThongKeDiemDanh,
    thang,
    nam,
    date,
    thongTinHocPhi,
    setThongTinHocPhi,
  } = useModel('thongtinhocphi');
  const [dataHocPhiCon, setDataHocPhiCon] = useState<IThongTinHocPhi.Record>();
  // const disableSuaThongTin =
  //   nam < moment().year() ||
  //   nam > moment().year() ||
  //   (nam === moment().year() && moment().month() > 0 && thang < moment().month() - 1) ||
  //   (nam === moment().year() && moment().month() === 0 && thang < 11) ||
  //   ((nam === moment().year() &&
  //     thang === moment().month() &&
  //     moment().date() > thongTinHocPhi?.ngayGuiThongBao) ??
  //     1);
  const disableSuaThongTin = (): boolean => {
    let check: boolean = false;
    //Ngày hiện tại <= Ngày quyết toán(ở quản lý trường): Cho sửa thông tin chung ở tháng hiện tại , hiện tại +1, +2 ,... và tháng hiện tại -1
    // ngược lại Cho sửa thông tin chung ở tháng hiện tại , hiện tại +1, +2 ,...
    if (nam === moment().year() && localStorage.getItem('currentDayQuyetToan')) {
      if (moment().date() <= +(localStorage.getItem('currentDayQuyetToan') as string)) {
        if (
          moment(new Date(date), 'DD/MM/YYYY').diff(
            moment(new Date(), 'DD/MM/YYYY'),
            'month',
          ) < -1
        ) {
          check = true;
        }
      } else {
        if (
          moment(new Date(date), 'DD/MM/YYYY').diff(
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
  const getThongTinHocPhiCon = async () => {
    const result = await axios.get(`${ip3}/thong-tin-hoc-phi/pageable?page=1&limit=100`, {
      params: {
        cond: {
          hocSinhId: record?._id,
          thang,
          nam,
        },
      },
    });
    const recordHocPhi = result?.data?.data?.result?.[0];

    setDataHocPhiCon(result?.data?.data?.result?.[0]);
    form.setFieldsValue({
      tienHocBanDau: recordHocPhi?.tienHocBanDau,
      phuPhiCaNhan: recordHocPhi?.phuPhiCaNhan,
    });
  };

  React.useEffect(() => {
    getThongTinHocPhiCon();
  }, []);

  const onFinish = async (values: any) => {
    const newVal = values;
    // if (values?.phuPhiCaNhan?.length === 0) {
    //   message.error('Vui lòng thêm phụ phí cá nhân');
    //   return;
    // }

    newVal.hocSinhId = record?._id;
    newVal.thang = thang;
    newVal.nam = nam;
    newVal.donViId = record?.donViId;
    newVal.phuHuynhId = record?.userId;
    if (dataHocPhiCon) {
      try {
        const res = await updThongTinHocPhiCon({
          ...newVal,
          id: dataHocPhiCon?._id,
        });

        if (res?.status === 200) {
          message.success('Cập nhật thông tin học phí thành công');
          setVisibleForm(false);

          getThongTinHocPhiCon();
          return true;
        }
      } catch (error) {
        message.error('Cập nhật thông tin học phí không thành công');
        return false;
      }
      setVisibleForm(false);
      return true;
    }
    if (!dataHocPhiCon?.updated) {
      Modal.confirm({
        title: 'Xác nhận',
        content: (
          <p>
            Tiền học đã đóng ban đầu là {currencyFormat(values?.tienHocBanDau ?? 0)}đ chỉ có thể
            nhập một lần. Bạn hãy kiểm tra kỹ thông tin.
          </p>
        ),
        okText: 'Đã đúng',
        cancelText: 'Nhập lại',
        onOk: async () => {
          try {
            const res = await addThongTinHocPhi({
              ...newVal,
            });
            if (res?.status === 201) {
              message.success('Cập nhật thông tin học phí thành công');
              setVisibleForm(false);
              getThongTinHocPhiCon();
              return true;
            }
          } catch (error) {
            message.error('Cập nhật thông tin học phí không thành công');
            return false;
          }
        },
      });
    }

    return true;
  };

  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form onFinish={onFinish} labelCol={{ span: 24 }} form={form}>
        <Row gutter={[16, 0]}>
          <Col xl={12} xs={24}>
            <Form.Item
              name="tienHocBanDau"
              label="Tiền học đã đóng ban đầu"
              rules={[...rules.float(undefined, 0, 0), ...rules.required]}
              initialValue={dataHocPhiCon?.tienHocBanDau}
              style={{ marginBottom: 5 }}
            >
              <InputNumber
                placeholder="Nhập số tiền học đã đóng ban đầu"
                style={{ width: '100%' }}
                min={0}
                step={5000}
                disabled={disableSuaThongTin() ? true : dataHocPhiCon?.updated ?? false}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>
          </Col>
          <Col xl={12} xs={24}>
            <Form.Item
              name="soNgayDiHoc"
              label="Số ngày đi học"
              initialValue={recordThongKeDiemDanh?.soNgayDiHoc}
              style={{ marginBottom: 5 }}
            >
              <InputNumber placeholder="Nhập số ngày đi học" style={{ width: '100%' }} disabled />
            </Form.Item>
          </Col>
          <Col xl={12} xs={24}>
            <Form.Item
              name="soNgayNghiCoPhep"
              label="Số ngày nghỉ có phép"
              initialValue={recordThongKeDiemDanh?.soNgayNghiCoPhep}
              style={{ marginBottom: 5 }}
            >
              <InputNumber
                placeholder="Nhập số ngày nghỉ có phép"
                style={{ width: '100%' }}
                disabled
              />
            </Form.Item>
          </Col>
          <Col xl={12} xs={24}>
            <Form.Item
              name="soNgayNghiKhongPhep"
              label="Số ngày nghỉ không phép"
              initialValue={recordThongKeDiemDanh?.soNgayNghiKhongPhep}
              style={{ marginBottom: 5 }}
            >
              <InputNumber
                placeholder="Nhập số ngày nghỉ không phép"
                style={{ width: '100%' }}
                disabled
              />
            </Form.Item>
          </Col>
        </Row>
        <p>Phụ phí cá nhân</p>
        <Row>
          <Form.List initialValue={dataHocPhiCon?.phuPhiCaNhan ?? []} name="phuPhiCaNhan">
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Row key={index} gutter={[16, 0]}>
                    <Col span={7}>
                      <Form.Item
                        {...field}
                        rules={[...rules.required]}
                        name={[field.name, 'tenPhuPhi']}
                      >
                        <Input placeholder="Tên phụ phí" disabled={disableSuaThongTin()} />
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item
                        {...field}
                        rules={[...rules.required]}
                        name={[field.name, 'soTien']}
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          placeholder="Số tiền"
                          disabled={disableSuaThongTin()}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item
                        {...field}
                        rules={[...rules.required]}
                        name={[field.name, 'loaiPhuPhi']}
                      >
                        <Select placeholder="Loại phụ phí" disabled={disableSuaThongTin()}>
                          <Select.Option value="Cố định">Cố định</Select.Option>
                          <Select.Option value="Lặp lại">Lặp lại</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={1}>
                      <Button
                        type="primary"
                        danger
                        disabled={disableSuaThongTin()}
                        onClick={() => {
                          remove(field.name);
                        }}
                      >
                        <DeleteOutlined />
                      </Button>
                    </Col>
                  </Row>
                ))}
                <br />
                <center>
                  <Button type="primary" onClick={() => add()} disabled={disableSuaThongTin()}>
                    Thêm mới phụ phí
                  </Button>
                </center>
              </>
            )}
          </Form.List>
        </Row>

        <br />
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button
            loading={loading}
            style={{ marginRight: 8 }}
            htmlType="submit"
            disabled={disableSuaThongTin()}
            type="primary"
          >
            {!edit ? 'Thêm mới' : 'Lưu'}
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
export default FormThongTinHocPhi;
