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
          message.success('C???p nh???t th??nh c??ng');
          setVisibleForm(false);
          getDanhMucTaiSanModel();
          return true;
        }
      } catch (error) {
        message.error('C???p nh???t kh??ng th??nh c??ng');
        return false;
      }
    }
    try {
      const res = await addDanhMucTaiSan({ ...newVal });
      if (res?.status === 201) {
        message.success('T???o th??nh c??ng');
        setVisibleForm(false);
        getDanhMucTaiSanModel();
        return true;
      }
    } catch (error) {
      message.error('T???o kh??ng th??nh c??ng');
    }
    return true;
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Card title={edit ? 'Ch???nh s???a' : 'Th??m m???i'}>
      <Form onFinish={onFinish} onFinishFailed={onFinishFailed} labelCol={{ span: 24 }} form={form}>
        <Row gutter={[16, 0]}>
          <Col xs={24} xl={12}>
            <Form.Item
              name="tenDayDu"
              label="T??n t??i s???n"
              rules={[...rules.required]}
              initialValue={record?.tenDayDu}
              style={{ marginBottom: 5 }}
            >
              <Input placeholder="Nh???p t??n t??i s???n" />
            </Form.Item>
          </Col>
          <Col xs={24} xl={12}>
            <Form.Item
              name="loaiTaiSan"
              label="Lo???i t??i s???n"
              rules={[...rules.required]}
              initialValue={record?.loaiTaiSan}
              style={{ marginBottom: 5 }}
            >
              <Select placeholder="Ch???n lo???i t??i s???n" onChange={changeLoaiTaiSan}>
                <Select.Option value="Tr?????ng">Tr?????ng</Select.Option>
                <Select.Option value="L???p">L???p</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          {(vaiTro === 'Admin' || vaiTro === 'SuperAdmin') && (
            <Col xs={24} xl={24}>
              <Form.Item
                name="truongId"
                label="Tr?????ng"
                rules={[...rules.required]}
                initialValue={record?.truongId}
                style={{ marginBottom: 5 }}
              >
                <Select
                  placeholder="Ch???n tr?????ng"
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
          {(idTruong || vaiTro === 'HieuTruong' || record?.lopId) && loaiTaiSan === 'L???p' && (
            <Col xs={24} xl={24}>
              <Form.Item
                label="L???p"
                name="lopId"
                rules={[...rules.required]}
                style={{ marginBottom: 5 }}
                initialValue={record?.lopId}
              >
                <Select
                  showSearch
                  allowClear
                  style={{ width: '100%' }}
                  placeholder="Ch???n l???p"
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
              label="S??? l?????ng"
              rules={[...rules.required, ...rules.float(undefined, 1, 0)]}
              initialValue={record?.soLuong}
              style={{ marginBottom: 5 }}
            >
              <InputNumber placeholder="Nh???p s??? l?????ng" style={{ width: '100%' }} min={1} step={1} />
            </Form.Item>
          </Col>
          <Col xs={24} xl={12}>
            <Form.Item
              name="giaTri"
              label="Gi?? tr??? t??i s???n"
              rules={[...rules.float(undefined, 10000, 0)]}
              initialValue={record?.giaTri}
              style={{ marginBottom: 5 }}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nh???p gi?? tr??? t??i s???n"
                min={10000}
                step={5000}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="ghiChu" label="Ghi ch??" initialValue={record?.ghiChu}>
          <Input.TextArea placeholder="Nh???p ghi ch??" rows={3} />
        </Form.Item>

        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            {!edit ? 'Th??m m???i' : 'L??u'}
          </Button>
          <Button onClick={() => setVisibleForm(false)}>????ng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
export default FormDanhMucTaiSan;
