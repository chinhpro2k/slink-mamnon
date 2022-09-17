/* eslint-disable no-underscore-dangle */
import { addDanhMucTaiSan, updDanhMucTaiSan } from '@/services/QuanLyTaiSan/DanhMucTaiSan';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, InputNumber, message, Row, Select } from 'antd';
import React, { useState } from 'react';
import { useModel } from 'umi';

const FormDanhMucTaiSan = () => {
  const [form] = Form.useForm();
  const { edit, loading, record, setVisibleForm, getDanhMucTaiSanModel } =
    useModel('danhmuctaisan');
  const [loaiTaiSan, setLoaiTaiSan] = useState<string>(record?.loaiTaiSan);
  const vaiTro = localStorage.getItem('vaiTro');
  const [dsTruong, setDsTruong] = useState([]);
  const [dsLop, setDsLop] = useState([]);
  const [dsDonVi, setDsDonVi] = useState([]);
  const [idTruong, setIdTruong] = useState<string>();
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;

  const getTruong = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=100`);
    setDsDonVi(result?.data?.data?.result);
    const arrTruong: any = [];
    result?.data?.data?.result?.map((item: { loaiDonVi: string }) =>
      item?.loaiDonVi === 'Truong' ? arrTruong.push(item) : undefined,
    );
    setDsTruong(arrTruong);
  };

  const getLop = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable/my/child?page=1&limit=1000`, {
      params: {
        cond: {
          loaiDonVi: 'Lop',
          parent: record?.truongId,
        },
      },
    });
    setDsLop(result?.data?.data?.result);
  };

  React.useEffect(() => {
    getTruong();
    if (vaiTro === 'HieuTruong' || edit) getLop();
  }, []);

  const changeLoaiTaiSan = (val: string) => {
    setLoaiTaiSan(val);
  };

  const changeIdTruong = (val: string) => {
    setIdTruong(val);
    form.setFieldsValue({
      lopId: undefined,
    });
    const arrLop: any = [];
    dsDonVi?.map((item: { parent: string }) =>
      item?.parent === val ? arrLop.push(item) : undefined,
    );
    setDsLop(arrLop);
  };

  const onFinish = async (values: any) => {
    const newVal = values;
    if (vaiTro === 'HieuTruong') {
      newVal.truongId = organizationId;
    }
    if (vaiTro === 'GiaoVien') {
      newVal.lopId = organizationId;
    }

    if (edit) {
      try {
        const res = await updDanhMucTaiSan({
          ...newVal,
          id: record?._id,
        });
        if (res?.status === 200) {
          message.success('Cập nhật thành công');
          setVisibleForm(false);
          getDanhMucTaiSanModel();
          return true;
        }
      } catch (error) {
        message.error('Cập nhật không thành công');
        return false;
      }
    }
    try {
      const res = await addDanhMucTaiSan({ ...newVal });
      if (res?.status === 201) {
        message.success('Tạo thành công');
        setVisibleForm(false);
        getDanhMucTaiSanModel();
        return true;
      }
    } catch (error) {
      message.error('Tạo không thành công');
    }
    return true;
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form onFinish={onFinish} onFinishFailed={onFinishFailed} labelCol={{ span: 24 }} form={form}>
        <Row gutter={[16, 0]}>
          <Col xs={24} xl={12}>
            <Form.Item
              name="tenDayDu"
              label="Tên tài sản"
              rules={[...rules.required]}
              initialValue={record?.tenDayDu}
              style={{ marginBottom: 5 }}
            >
              <Input placeholder="Nhập tên tài sản" />
            </Form.Item>
          </Col>
          <Col xs={24} xl={12}>
            <Form.Item
              name="loaiTaiSan"
              label="Loại tài sản"
              rules={[...rules.required]}
              initialValue={record?.loaiTaiSan}
              style={{ marginBottom: 5 }}
            >
              <Select placeholder="Chọn loại tài sản" onChange={changeLoaiTaiSan}>
                <Select.Option value="Trường">Trường</Select.Option>
                <Select.Option value="Lớp">Lớp</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          {(vaiTro === 'Admin' || vaiTro === 'SuperAdmin') && (
            <Col xs={24} xl={24}>
              <Form.Item
                name="truongId"
                label="Trường"
                rules={[...rules.required]}
                initialValue={record?.truongId}
                style={{ marginBottom: 5 }}
              >
                <Select
                  placeholder="Chọn trường"
                  optionFilterProp="children"
                  showSearch
                  allowClear
                  onChange={changeIdTruong}
                  filterOption={(input, option: any) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {dsTruong?.map((item: { tenDonVi: string; _id: string }) => (
                    <Select.Option key={item?._id} value={item?._id}>
                      {item?.tenDonVi}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}
          {(idTruong || vaiTro === 'HieuTruong' || record?.lopId) && loaiTaiSan === 'Lớp' && (
            <Col xs={24} xl={24}>
              <Form.Item
                label="Lớp"
                name="lopId"
                rules={[...rules.required]}
                style={{ marginBottom: 5 }}
                initialValue={record?.lopId}
              >
                <Select
                  showSearch
                  allowClear
                  style={{ width: '100%' }}
                  placeholder="Chọn lớp"
                  optionFilterProp="children"
                  filterOption={(input, option: any) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {dsLop?.map((item: { tenDonVi: string; _id: string }) => (
                    <Select.Option key={item?._id} value={item?._id}>
                      {item?.tenDonVi}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}
        </Row>
        <Row gutter={[16, 0]}>
          <Col xs={24} xl={12}>
            <Form.Item
              name="soLuong"
              label="Số lượng"
              rules={[...rules.required, ...rules.float(undefined, 1, 0)]}
              initialValue={record?.soLuong}
              style={{ marginBottom: 5 }}
            >
              <InputNumber placeholder="Nhập số lượng" style={{ width: '100%' }} min={1} step={1} />
            </Form.Item>
          </Col>
          <Col xs={24} xl={12}>
            <Form.Item
              name="giaTri"
              label="Giá trị tài sản"
              rules={[...rules.float(undefined, 10000, 0)]}
              initialValue={record?.giaTri}
              style={{ marginBottom: 5 }}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập giá trị tài sản"
                min={10000}
                step={5000}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="ghiChu" label="Ghi chú" initialValue={record?.ghiChu}>
          <Input.TextArea placeholder="Nhập ghi chú" rows={3} />
        </Form.Item>

        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            {!edit ? 'Thêm mới' : 'Lưu'}
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
export default FormDanhMucTaiSan;
