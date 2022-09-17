/* eslint-disable no-underscore-dangle */
import { addDanhMucThucPham, updDanhMucThucPham } from '@/services/DanhMucThucPham/danhmucthucpham';
import rules from '@/utils/rules';
import { Button, Card, Col, Divider, Form, Input, InputNumber, message, Row, Select } from 'antd';
import React from 'react';
import { useModel } from 'umi';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import DanhMucThucPham from '../DanhMucThucPham/index';

const width100 = {
  width: '100%',
};

const FormDanhMucPhucPham = () => {
  const { loading, setVisibleForm, edit, getDanhMucThucPhamModel, record, setRecord } =
    useModel('danhmucthucpham');
  const danhMucThucPhamChung = useModel('danhmucthucphamchung');
  const [form] = Form.useForm();
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const vaiTro = initialState?.currentUser?.role?.systemRole;
  const { danhSach: danhSachTruong, getTruongModel } = useModel('truong');
  React.useEffect(() => {
    if (vaiTro === 'SuperAdmin' || vaiTro === 'Admin') getTruongModel();
    return () => {
      danhMucThucPhamChung.setRecord({});
      danhMucThucPhamChung.setIsClone(false);
      setRecord({});
      form.resetFields();
    };
  }, []);

  const onFinish = async (values: any) => {
    const newVal = values;
    if (organizationId) {
      newVal.donViId = organizationId;
    }
    if (danhMucThucPhamChung.isClone) {
      const newValue = {
        ...danhMucThucPhamChung?.record,
        ...values,
        datatype: 'Khác',
      };
      if (newValue.tenVietTat === danhMucThucPhamChung?.record?.tenVietTat) {
        message.error('Tên viết tắt không được trùng với dữ liệu cũ');
        return;
      }
      const { _id, id, index, createdAt, updatedAt, __v, donVi, ...rest } = newValue;
      const response = await axios.post(`${ip3}/danh-muc-thuc-pham`, rest);

      danhMucThucPhamChung.getDanhMucThucPhamChungModel();
      getDanhMucThucPhamModel(organizationId);
      danhMucThucPhamChung.setVisibleForm(false);
      danhMucThucPhamChung.setRecord({});
      danhMucThucPhamChung.setIsClone(false);
      return;
    }
    if (edit) {
      try {
        const { donVi, index, updatedAt, createdAt, __v, _id, ...rest } = {
          ...record,
          ...newVal,
          id: record?._id,
        };
        const res = await updDanhMucThucPham(rest);
        if (res?.data?.statusCode === 200) {
          message.success('Chỉnh sửa thành công');
          setVisibleForm(false);
          getDanhMucThucPhamModel(organizationId);
          return true;
        }
      } catch (error) {
        message.error('Đã xảy ra lỗi');
        return false;
      }
    }
    try {
      if (vaiTro === 'SuperAdmin' || vaiTro === 'Admin') {
        newVal.datatype = 'Hệ thống';
      } else {
        newVal.datatype = 'Khác';
      }
      const res = await addDanhMucThucPham({ ...newVal });
      if (res?.data?.statusCode === 201) {
        message.success('Thêm mới thành công');
        setVisibleForm(false);
        getDanhMucThucPhamModel(
          vaiTro === 'SuperAdmin' || vaiTro === 'Admin' ? 'Tất cả' : organizationId,
        );
        danhMucThucPhamChung.getDanhMucThucPhamChungModel();
        return true;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return false;
  };

  return (
    <Card title={danhMucThucPhamChung.isClone ? 'Sao chép' : edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={onFinish}
        form={form}
        initialValues={danhMucThucPhamChung?.isClone ? danhMucThucPhamChung?.record : record}
      >
        {(vaiTro === 'Admin' || vaiTro === 'SuperAdmin') && (
          <Col span={24}>
            <Form.Item
              name="listDonVi"
              label="Trường"
              // rules={[...rules.required]}
              style={{ marginBottom: 5 }}
            >
              <Select
                placeholder="Chọn trường"
                filterOption={(input, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                showSearch
                optionFilterProp="children"
                mode="multiple"
              >
                {danhSachTruong?.map((item: any) => (
                  <Select.Option key={item?._id} value={item?._id}>
                    {item?.tenDonVi}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        )}
        <Row gutter={[16, 0]}>
          <Col xs={24} lg={12}>
            <Form.Item
              name="tenVietTat"
              label="Tên tắt"
              rules={[...rules.required, ...rules.length(255), ...rules.text]}
              style={{ marginBottom: 5 }}
            >
              <Input placeholder="Nhập tên tắt" />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="tenDayDu"
              label="Tên đầy đủ"
              rules={[...rules.required, ...rules.length(255), ...rules.text]}
              style={{ marginBottom: 5 }}
            >
              <Input placeholder="Nhập tên đầy đủ" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          <Col xs={24} lg={12}>
            <Form.Item
              name="heSoThaiBo"
              label="Hệ số thải bỏ"
              rules={[...rules.required, ...rules.length(5)]}
              style={{ marginBottom: 5 }}
            >
              <Input placeholder="Nhập hệ số thải bỏ" />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="donViTinh"
              label="Đơn vị tính"
              rules={[...rules.required]}
              style={{ marginBottom: 5 }}
            >
              <Input placeholder="Nhập đơn vị tính" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          <Col xs={24} lg={8}>
            <Form.Item
              name="giaTien"
              label="Giá tiền"
              rules={[...rules.required, ...rules.float(undefined, 0, 20)]}
              style={{ marginBottom: 5 }}
            >
              <InputNumber
                placeholder="Nhập giá tiền"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                style={width100}
                min={0}
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item name="canxi" label="Canxi" style={{ marginBottom: 5 }}>
              <InputNumber placeholder="Canxi" style={width100} min={0} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item name="dam" label="Chất đạm" style={{ marginBottom: 5 }}>
              <InputNumber placeholder="Chất đạm" style={width100} min={0} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          <Col xs={24} lg={8}>
            <Form.Item name="beo" label="Chất béo" style={{ marginBottom: 5 }}>
              <InputNumber placeholder="Chất béo" style={width100} min={0} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item name="duong" label="Đường" style={{ marginBottom: 5 }}>
              <InputNumber placeholder="Đường" style={width100} min={0} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item name="calo" label="Calo" style={{ marginBottom: 5 }}>
              <InputNumber placeholder="Calo" style={width100} min={0} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          <Col xs={24} lg={8}>
            <Form.Item name="caloDam" label="Calo đạm" style={{ marginBottom: 5 }}>
              <InputNumber placeholder="Calo đạm" style={width100} min={0} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item name="caloDuong" label="Calo đường" style={{ marginBottom: 5 }}>
              <InputNumber placeholder="Calo đường" style={width100} min={0} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item name="caloBeo" label="Calo béo" style={{ marginBottom: 5 }}>
              <InputNumber placeholder="Calo béo" style={width100} min={0} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          <Col xs={24} lg={8}>
            <Form.Item name="tyLeDuong" label="Tỷ lệ đường" style={{ marginBottom: 5 }}>
              <InputNumber
                placeholder="Tỷ lệ đường"
                style={width100}
                formatter={(value) => `${value}%`}
                min={0}
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item name="tyLeDam" label="Tỷ lệ đạm" style={{ marginBottom: 5 }}>
              <InputNumber
                placeholder="Tỷ lệ đạm"
                style={width100}
                formatter={(value) => `${value}%`}
                min={0}
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item name="tyLeBeo" label="Tỷ lệ béo" style={{ marginBottom: 5 }}>
              <InputNumber
                placeholder="Tỷ lệ béo"
                style={width100}
                formatter={(value) => `${value}%`}
                min={0}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          <Col xs={24} lg={12}>
            <Form.Item
              name="phanLoai"
              label="Phân loại"
              rules={[...rules.required, ...rules.text]}
              style={{ marginBottom: 5 }}
            >
              <Input placeholder="Phân loại" />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="nguonThucPham"
              label="Nguồn thực phẩm"
              rules={[...rules.required, ...rules.text]}
              style={{ marginBottom: 5 }}
            >
              <Input placeholder="Nguồn thực phẩm" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          <Col xs={24} lg={12}>
            <Form.Item
              name="nhomLoaiThucPham"
              label="Nhóm loại thực phẩm"
              rules={[...rules.required, ...rules.text]}
              style={{ marginBottom: 5 }}
            >
              <Input placeholder="Nhóm loại thực phẩm" />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="loaiThucPham"
              label="Loại thực phẩm"
              rules={[...rules.required]}
              style={{ marginBottom: 5 }}
            >
              <Select placeholder="Chọn loại thực phẩm">
                <Select.Option value="Khô">Khô</Select.Option>
                <Select.Option value="Tươi">Tươi</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Divider />

        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            {danhMucThucPhamChung?.isClone ? 'Sao chép' : 'Gửi'}
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
export default FormDanhMucPhucPham;
