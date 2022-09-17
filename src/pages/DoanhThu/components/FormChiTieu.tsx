/* eslint-disable no-return-assign */
/* eslint-disable no-underscore-dangle */
import { updKhoanChiTieu } from '@/services/KhoanChiTieu/khoanchitieu';
import rules from '@/utils/rules';
import { Button, Card, Col, Divider, Form, Input, InputNumber, message, Row, Spin } from 'antd';
import React from 'react';
import { useModel } from 'umi';

const FormKhoanChiTieu = () => {
  const [form] = Form.useForm();
  const { edit, loading, record, setVisibleForm, getKhoanChiTieuModel } = useModel('khoanchitieu');

  const onFinish = async (values: any) => {
    const newVal = values;
    try {
      const res = await updKhoanChiTieu({
        ...newVal,
        id: record?._id,
      });
      if (res?.data?.statusCode === 200) {
        message.success('Cập nhật thành công');
        getKhoanChiTieuModel(record?.donViId);
        setVisibleForm(false);
        return true;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return true;
  };

  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Spin spinning={loading}>
        <Form onFinish={onFinish} labelCol={{ span: 24 }} form={form}>
          <Row gutter={[20, 0]}>
            <Col span={24}>
              <Form.Item
                label="Hạng mục"
                name="ten"
                rules={[...rules.required]}
                style={{ marginBottom: 5 }}
                initialValue={record?.ten}
              >
                <Input placeholder="Nhập tên khoản chi" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Số tiền"
                name="soTien"
                rules={[...rules.required]}
                style={{ marginBottom: 5 }}
                initialValue={record?.soTien}
              >
                <InputNumber
                  placeholder="Nhập số tiền chi"
                  min={0}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider />
          <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
            <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
              {!edit ? 'Thêm mới' : 'Lưu'}
            </Button>
            <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
};
export default FormKhoanChiTieu;
