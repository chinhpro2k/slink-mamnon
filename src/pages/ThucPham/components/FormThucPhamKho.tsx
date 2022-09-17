/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import {
  addNhienLieuKho,
  addThucPhamKho,
  updThucPhamKho,
} from '@/services/ThucPhamKho/thucphamkho';
import rules from '@/utils/rules';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Tabs,
} from 'antd';
import React from 'react';
import { useModel } from 'umi';
import type { DanhMucThucPham as IDanhMucThucPham } from '@/services/DanhMucThucPham';

const width100 = {
  width: '100%',
};

const FormThucPhamKho = () => {
  const { loading, setVisibleForm, edit, getNhapKhoModel, record, recordNhienLieu } =
    useModel('nhapkho');
  const { dsThucPham, getThucPhamKhoModel } = useModel('thucphamkho');
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;

  const changeThucPham = (val: string) => {
    const recordThucPham = dsThucPham?.find((item: { _id: string }) => item?._id === val);
    form.setFieldsValue({
      tenVietTat: recordThucPham?.tenVietTat,
      ten: recordThucPham?.tenDayDu,
      donGia: recordThucPham?.giaTien ?? 0,
      donViTinh: recordThucPham?.donViTinh ?? 'gam',
    });
  };

  const onFinish = async (values: any) => {
    const newVal = values;
    console.log('value', values);
    const thucPham: any = dsThucPham?.find(
      (item: { _id: string }) => item?._id === newVal?.thucPhamId,
    );

    // newVal.donViId = thucPham?.donViId;
    newVal.donViId = organizationId;
    if (edit) {
      try {
        const res = await updThucPhamKho({ ...newVal, id: record?._id });
        if (res?.data?.statusCode === 200) {
          message.success('Chỉnh sửa thành công');
          setVisibleForm(false);
          getNhapKhoModel(organizationId);
          getThucPhamKhoModel(organizationId);
          return true;
        }
      } catch (error) {
        message.error('Đã xảy ra lỗi');
        return false;
      }
    }
    try {
      const res = await addThucPhamKho({ ...newVal });
      if (res?.data?.statusCode === 201) {
        message.success('Thêm mới thành công');
        setVisibleForm(false);
        getNhapKhoModel(organizationId);
        getThucPhamKhoModel(organizationId);
        return true;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return false;
  };
  const onFinishNhienLieu = async (values: any) => {
    const newVal = values;
    console.log('value', values);

    // newVal.donViId = thucPham?.donViId;
    newVal.donViId = organizationId;
    newVal.loaiNguyenLieu = 'Nhiên liệu';

    if (edit) {
      // try {
      //   const res = await updThucPhamKho({ ...newVal, id: record?._id });
      //   if (res?.data?.statusCode === 200) {
      //     message.success('Chỉnh sửa thành công');
      //     setVisibleForm(false);
      //     getNhapKhoModel(organizationId);
      //     getThucPhamKhoModel(organizationId);
      //     return true;
      //   }
      // } catch (error) {
      //   message.error('Đã xảy ra lỗi');
      //   return false;
      // }
    }
    try {
      const res = await addNhienLieuKho({ ...newVal });
      if (res?.data?.statusCode === 201) {
        message.success('Thêm mới thành công');
        setVisibleForm(false);
        getNhapKhoModel(organizationId);
        getThucPhamKhoModel(organizationId);
        return true;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return false;
  };
  return (
    <Tabs style={{ padding: '20px' }}>
      <Tabs.TabPane tab="Thực phẩm" key="item-1">
        <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'} bordered={false}>
          <Form labelCol={{ span: 24 }} onFinish={onFinish} form={form} initialValues={record}>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="thucPhamId"
                  label="Danh mục thực phẩm"
                  rules={[...rules.required]}
                  style={{ marginBottom: 5 }}
                >
                  <Select
                    placeholder="Chọn danh mục thực phẩm"
                    filterOption={(input, option: any) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    showSearch
                    optionFilterProp="children"
                    onChange={changeThucPham}
                  >
                    {dsThucPham?.map((item: IDanhMucThucPham.Record) => (
                      <Select.Option key={item?._id} value={item?._id}>
                        {item?.tenDayDu}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 0]}>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="tenVietTat"
                  label="Tên tắt"
                  rules={[...rules.required, ...rules.length(255)]}
                  style={{ marginBottom: 5 }}
                >
                  <Input placeholder="Nhập tên tắt" disabled />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="ten"
                  label="Tên đầy đủ"
                  rules={[...rules.required, ...rules.length(255)]}
                  style={{ marginBottom: 5 }}
                >
                  <Input placeholder="Nhập tên đầy đủ" disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 0]}>
              <Col xs={24} lg={12}>
                <Form.Item name="nhaCungCap" label="Nhà cung cấp" style={{ marginBottom: 5 }}>
                  <Input placeholder="Nhà cung cấp" style={width100} />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item name="donGia" label="Đơn giá" style={{ marginBottom: 5 }}>
                  <InputNumber placeholder="Đơn giá" style={width100} disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 0]}>
              {/* <Col xs={24} lg={12}>
            <Form.Item name="theTich" label="Thể tích (ml)" style={{ marginBottom: 5 }}>
              <InputNumber placeholder="Thể tích" style={width100} />
            </Form.Item>
          </Col> */}
              <Col xs={24} lg={12}>
                <Form.Item name="khoiLuong" label="Khối lượng" style={{ marginBottom: 5 }}>
                  <InputNumber placeholder="Khối lượng" style={width100} />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item name="donViTinh" label="Đơn vị tính" style={{ marginBottom: 5 }}>
                  <Input placeholder="Đơn vị tính" style={width100} disabled />
                </Form.Item>
              </Col>
            </Row>
            <Divider />

            <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
              <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
                Gửi
              </Button>
              <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
            </Form.Item>
          </Form>
        </Card>
      </Tabs.TabPane>
      <Tabs.TabPane tab="Nhiên liệu" key="item-2">
        <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'} bordered={false}>
          <Form
            labelCol={{ span: 24 }}
            onFinish={onFinishNhienLieu}
            form={form2}
            initialValues={recordNhienLieu}
          >
            <Row>
              <Col span={24}>
                <Form.Item
                  name="ten"
                  label="Tên nhiên liệu"
                  rules={[...rules.required]}
                  style={{ marginBottom: 5 }}
                >
                  <Input placeholder="Nhập tên nhiên liệu" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 0]}>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="ngayTieuHaoTrungBinh"
                  label="Ngày tiêu hao trung bình"
                  rules={[...rules.required]}
                  style={{ marginBottom: 5 }}
                >
                  <InputNumber placeholder="Ngày tiêu hao trung bình" />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="ten"
                  label="Tên đầy đủ"
                  rules={[...rules.required, ...rules.length(255)]}
                  style={{ marginBottom: 5 }}
                >
                  <Input placeholder="Nhập tên đầy đủ" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 0]}>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="nhaCungCap"
                  label="Nhà cung cấp"
                  style={{ marginBottom: 5 }}
                  rules={[...rules.required]}
                >
                  <Input placeholder="Nhà cung cấp" style={width100} />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="donGia"
                  label="Đơn giá"
                  style={{ marginBottom: 5 }}
                  rules={[...rules.required]}
                >
                  <InputNumber placeholder="Đơn giá" style={width100} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 0]}>
              {/* <Col xs={24} lg={12}>
            <Form.Item name="theTich" label="Thể tích (ml)" style={{ marginBottom: 5 }}>
              <InputNumber placeholder="Thể tích" style={width100} />
            </Form.Item>
          </Col> */}
              <Col xs={24} lg={12}>
                <Form.Item
                  name="khoiLuong"
                  label="Khối lượng"
                  style={{ marginBottom: 5 }}
                  rules={[...rules.required]}
                >
                  <InputNumber placeholder="Khối lượng" style={width100} />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="donViTinh"
                  label="Đơn vị tính"
                  style={{ marginBottom: 5 }}
                  rules={[...rules.required]}
                >
                  <Input placeholder="Đơn vị tính" style={width100} />
                </Form.Item>
              </Col>
            </Row>
            <Divider />

            <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
              <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
                Gửi
              </Button>
              <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
            </Form.Item>
          </Form>
        </Card>
      </Tabs.TabPane>
    </Tabs>
  );
};
export default FormThucPhamKho;
