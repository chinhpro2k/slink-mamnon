/* eslint-disable no-underscore-dangle */
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import rules from '@/utils/rules';
import { CopyOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Row } from 'antd';
import React, { useState } from 'react';

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const TaoCode = (props: { user?: string; id?: string }) => {
  const [code, setCode] = useState<string>();
  const [disabled, setDisabled] = useState<boolean>(false);

  const onSubmit = async (val: { soDienThoai: string }) => {
    const values = {
      vaiTro: props?.user,
      soDienThoai: val.soDienThoai,
      donViId: props?.id,
    };
    const result = await axios.put(`${ip3}/user/nang-cap-user/admin/tao-code`, { ...values });
    if (result?.status === 200) {
      message.success('Tạo mã code thành công');
      setCode(result?.data?.data?.code);
      setDisabled(true);
      return true;
    }
    message.error('Đã xảy ra lỗi');
    return false;
  };

  return (
    <>
      <Form onFinish={onSubmit} {...formItemLayout}>
        <Row gutter={[16, 0]}>
          <Col lg={24} md={24} sm={24}>
            <Form.Item
              name="soDienThoai"
              label="Số điện thoại"
              rules={[...rules.required, ...rules.soDienThoai]}
            >
              <Input placeholder="Nhập số điện thoại" disabled={disabled} />
            </Form.Item>
          </Col>
        </Row>
        {code && (
          <>
            <Row>
              <Col span={22}>
                <Input value={code} style={{ color: 'black' }} />
              </Col>
              <Col span={2}>
                <CopyOutlined
                  style={{ float: 'right', color: 'black', fontSize: '20px' }}
                  onClick={() => {
                    navigator.clipboard.writeText(code);
                    message.success('Copy thành công');
                  }}
                />
              </Col>
            </Row>
            <br />
          </>
        )}
        <Row justify="center">
          <Col>
            <Form.Item>
              <Button type="primary" htmlType="submit" disabled={disabled}>
                Xác nhận
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default TaoCode;
