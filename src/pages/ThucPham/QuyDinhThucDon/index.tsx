/* eslint-disable no-underscore-dangle */
import { addThongTinKhauPhanAn, updThongTinKhauPhanAn } from '@/services/KhauPhanAn/khauphanan';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import rules from '@/utils/rules';
import { Button, Card, Col, Divider, Form, InputNumber, message, Row, Select, Tabs } from 'antd';
import React from 'react';
import { useState } from 'react';
import { useModel } from 'umi';
import type { DanhMucMonAn as IDanhMucMonAn } from '@/services/DanhMucMonAn';
import type { Truong as ITruong } from '@/services/Truong';

const width100 = {
  width: '100%',
};

const ThongTinChung = () => {
  const [form] = Form.useForm();
  const vaiTro = localStorage.getItem('vaiTro');
  const [loaiHinh, setLoaiHinh] = useState<string>('Mầm non');
  const [recordKhauPhan, setRecordKhauPhan] = useState<IDanhMucMonAn.Record>();
  const [danhSachKhauPhan, setDanhSachKhauPhan] = useState<IDanhMucMonAn.Record[]>();
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [donViId, setDonViId] = useState<any>(organizationId);
  const [danhSachTruong, setDanhSachTruong] = useState<ITruong.Record[]>([]);

  const getThongTinKhauPhan = async (val?: string) => {
    if (val) {
      const result = await axios.get(`${ip3}/thong-tin-khau-phan-an/pageable?page=1&limit=1000`);
      setDanhSachKhauPhan(result?.data?.data?.result);
    } else {
      const result = await axios.get(`${ip3}/thong-tin-khau-phan-an/pageable?page=1&limit=1000`);
      setDanhSachKhauPhan(result?.data?.data?.result);
      const data = result?.data?.data.result?.find(
        (item: { loaiHinh: string }) => item?.loaiHinh === loaiHinh,
      );
      setRecordKhauPhan(data);
      setDonViId(data?.donViId);
      form.setFieldsValue({
        donViId: donViId ?? data?.donViId,
        trietKhauTienAn: data?.trietKhauTienAn,
        tienAn1Ngay: data?.tienAn1Ngay,
        soBua: data?.soBua,
      });
    }
  };

  const getTruong = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=1000`, {
      params: {
        cond: {
          loaiDonVi: 'Truong',
        },
      },
    });

    setDanhSachTruong(result?.data?.data?.result);
  };

  React.useEffect(() => {
    getThongTinKhauPhan();
    getTruong();
  }, []);

  const changeLoaiHinh = (val: string) => {
    setLoaiHinh(val);
    const result = danhSachKhauPhan?.find(
      (item) => item?.loaiHinh === val && item?.donViId === donViId,
    );
    setRecordKhauPhan(result);
    form.setFieldsValue({
      donViId: donViId ?? result?.donViId,
      trietKhauTienAn: result?.trietKhauTienAn,
      tienAn1Ngay: result?.tienAn1Ngay,
      soBua: result?.soBua,
    });
  };

  const changeTruong = async (val: string) => {
    setDonViId(val);
    const result = danhSachKhauPhan?.find(
      (item) => item?.loaiHinh === loaiHinh && item?.donViId === val,
    );
    setRecordKhauPhan(result);
    form.setFieldsValue({
      trietKhauTienAn: result?.trietKhauTienAn,
      tienAn1Ngay: result?.tienAn1Ngay,
      soBua: result?.soBua,
    });
  };

  const onFinish = async (values: any) => {
    const newVal = { ...values };
    newVal.loaiHinh = loaiHinh;
    if (vaiTro === 'HieuTruong') {
      newVal.donViId = organizationId;
    }

    if (recordKhauPhan?.trietKhauTienAn) {
      try {
        const res = await updThongTinKhauPhanAn({
          ...newVal,
          id: recordKhauPhan?._id,
        });
        if (res?.status === 200) {
          message.success('Cập nhật thông tin khẩu phần ăn thành công');
          getThongTinKhauPhan(newVal?.donViId);
          return true;
        }
      } catch (error) {
        message.error('Cập nhật thông tin khẩu phần ăn không thành công');
        return false;
      }
    }
    try {
      const res = await addThongTinKhauPhanAn({
        ...newVal,
      });
      if (res?.status === 201) {
        message.success('Cập nhật thông tin khẩu phần ăn thành công');
        getThongTinKhauPhan(newVal?.donViId);
        return true;
      }
    } catch (error) {
      message.error('Cập nhật thông tin khẩu phần ăn không thành công');
      return false;
    }

    return false;
  };
  return (
    <Card>
      <Tabs defaultActiveKey="Mầm non" onChange={changeLoaiHinh}>
        <Tabs.TabPane tab="Mẫu giáo" key="Mầm non">
          <Form labelCol={{ span: 24 }} onFinish={onFinish} form={form}>
            {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
              <Form.Item
                name="donViId"
                label="Trường"
                rules={[...rules.required]}
                style={{ marginBottom: 5 }}
              >
                <Select
                  showSearch
                  allowClear
                  style={{ width: '100%' }}
                  placeholder="Chọn trường"
                  optionFilterProp="children"
                  filterOption={(input, option: any) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={changeTruong}
                >
                  {danhSachTruong?.map((item) => (
                    <Select.Option key={item?._id} value={item?._id}>
                      {item?.tenDonVi}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
            <Row gutter={[16, 0]}>
              <Col xs={24} lg={8}>
                <Form.Item
                  name="tienAn1Ngay"
                  label="Số tiền ăn/ngày"
                  rules={[...rules.required]}
                  style={{ marginBottom: 5 }}
                >
                  <InputNumber
                    placeholder="Nhập số tiền ăn/ngày"
                    style={width100}
                    min={10000}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={8}>
                <Form.Item
                  name="soBua"
                  label="Số bữa ăn"
                  rules={[...rules.required]}
                  style={{ marginBottom: 5 }}
                >
                  <Select placeholder="Chọn số bữa ăn">
                    {loaiHinh === 'Mầm non' && <Select.Option value={2}>2 bữa</Select.Option>}
                    <Select.Option value={3}>3 bữa</Select.Option>
                    <Select.Option value={4}>4 bữa</Select.Option>
                    <Select.Option value={5}>5 bữa</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={8}>
                <Form.Item
                  name="trietKhauTienAn"
                  label="Triết khấu tiền ăn/ngày"
                  rules={[...rules.required]}
                  style={{ marginBottom: 5 }}
                >
                  <InputNumber
                    placeholder="Nhập triết khấu tiền ăn/ngay"
                    min={0}
                    style={width100}
                    formatter={(value) => `${value}%`}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Divider />

            <Form.Item style={{ marginBottom: 0 }}>
              <Button style={{ marginRight: 8 }} htmlType="submit" type="primary">
                Chỉnh sửa
              </Button>
            </Form.Item>
          </Form>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Nhà trẻ" key="Nhà trẻ">
          <Form labelCol={{ span: 24 }} onFinish={onFinish} form={form}>
            {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
              <Form.Item
                name="donViId"
                label="Trường"
                rules={[...rules.required]}
                style={{ marginBottom: 5 }}
              >
                <Select
                  showSearch
                  allowClear
                  style={{ width: '100%' }}
                  placeholder="Chọn trường"
                  optionFilterProp="children"
                  filterOption={(input, option: any) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={changeTruong}
                >
                  {danhSachTruong?.map((item) => (
                    <Select.Option key={item?._id} value={item?._id}>
                      {item?.tenDonVi}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
            <Row gutter={[16, 0]}>
              <Col xs={24} lg={8}>
                <Form.Item
                  name="tienAn1Ngay"
                  label="Số tiền ăn/ngày"
                  rules={[...rules.required]}
                  style={{ marginBottom: 5 }}
                >
                  <InputNumber
                    placeholder="Nhập số tiền ăn/ngày"
                    style={width100}
                    min={10000}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={8}>
                <Form.Item
                  name="soBua"
                  label="Số bữa ăn"
                  rules={[...rules.required]}
                  style={{ marginBottom: 5 }}
                >
                  <Select placeholder="Chọn số bữa ăn">
                    <Select.Option value={3}>3 bữa</Select.Option>
                    <Select.Option value={4}>4 bữa</Select.Option>
                    <Select.Option value={5}>5 bữa</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={8}>
                <Form.Item
                  name="trietKhauTienAn"
                  label="Triết khấu tiền ăn/ngày"
                  rules={[...rules.required]}
                  style={{ marginBottom: 5 }}
                >
                  <InputNumber
                    placeholder="Nhập triết khấu tiền ăn/ngay"
                    min={0}
                    style={width100}
                    formatter={(value) => `${value}%`}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Divider />

            <Form.Item style={{ marginBottom: 0 }}>
              <Button style={{ marginRight: 8 }} htmlType="submit" type="primary">
                Chỉnh sửa
              </Button>
            </Form.Item>
          </Form>
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default ThongTinChung;
