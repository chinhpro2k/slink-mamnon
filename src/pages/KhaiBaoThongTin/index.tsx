import { updTaiKhoanKhach } from '@/services/TaiKhoanKhach/taikhoankhach';
import type { TaiKhoanPhuHuynh as ITaiKhoanPhuHuynh } from '@/services/TaiKhoanPhuHuynh/index';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import { Button, Card, Col, DatePicker, Form, Input, message, Row, Select } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import rules from '../../utils/rules';

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const KhaiBaoThongTin = () => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [form] = Form.useForm();
  const getDataMe = async () => {
    const result = await axios.get(`${ip3}/user/me`);
    form.setFieldsValue({
      profile: {
        ...result?.data?.data?.profile,
        dateOfBirth: result?.data?.data?.profile?.dateOfBirth
          ? moment(result?.data?.data?.profile?.dateOfBirth)
          : undefined,
      },
    });
  };
  React.useEffect(() => {
    getDataMe();
  }, []);

  const onFinish = async (values: ITaiKhoanPhuHuynh.Record) => {
    const res = await updTaiKhoanKhach({ ...values });
    if (res?.data?.statusCode === 200) {
      message.success('Cập nhật thành công');
      setDisabled(true);
      return true;
    }
    message.error('Đã xảy ra lỗi');
    return false;
  };
  return (
    <Card title="Khai báo thông tin">
      <Row justify="center">
        <Col span={8}>
          <Form form={form} onFinish={onFinish} {...formItemLayout}>
            <Form.Item
              name={['profile', 'fullname']}
              style={{ marginBottom: 5 }}
              label="Họ và tên"
              rules={[...rules.required]}
            >
              <Input placeholder="Nhập họ và tên" disabled={disabled} />
            </Form.Item>
            <Form.Item
              name={['profile', 'phoneNumber']}
              style={{ marginBottom: 5 }}
              label="Số điện thoại"
              rules={[...rules.required, ...rules.soDienThoai]}
            >
              <Input placeholder="Nhập số điện thoại" disabled />
            </Form.Item>
            <Form.Item name={['profile', 'email']} style={{ marginBottom: 5 }} label="Email">
              <Input placeholder="Nhập email" disabled={disabled} />
            </Form.Item>
            <Form.Item name={['profile', 'gender']} style={{ marginBottom: 5 }} label="Giới tính">
              <Select placeholder="Chọn giới tính" disabled={disabled}>
                <Select.Option value="Male">Nam</Select.Option>
                <Select.Option value="Female">Nữ</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name={['profile', 'trinhDo']} style={{ marginBottom: 5 }} label="Trình độ">
              <Select placeholder="Chọn trình độ" disabled={disabled}>
                <Select.Option value="Cao học">Cao học</Select.Option>
                <Select.Option value="Đại học">Đại học</Select.Option>
                <Select.Option value="Cao đẳng">Cao đẳng</Select.Option>
                <Select.Option value="Trung cấp">Trung cấp</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name={['profile', 'dateOfBirth']}
              label="Ngày sinh"
              rules={[...rules.truocHomNay]}
            >
              <DatePicker placeholder="Chọn ngày sinh" format="DD-MM-YYYY" disabled={disabled} />
            </Form.Item>
            {disabled && (
              <Form.Item>
                <Row justify="center" gutter={[16, 0]}>
                  <Col span={4}>
                    <Button
                      type="primary"
                      onClick={() => {
                        setDisabled(false);
                      }}
                    >
                      Chỉnh sửa
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            )}
            {!disabled && (
              <Form.Item>
                <Row justify="center" gutter={[16, 0]}>
                  <Col span={4}>
                    <Button type="primary" htmlType="submit">
                      Lưu thông tin
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            )}
          </Form>
        </Col>
      </Row>
    </Card>
  );
};
export default KhaiBaoThongTin;
