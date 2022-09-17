import type { TaiKhoanPhuHuynh as ITaiKhoanPhuHuynh } from '@/services/TaiKhoanPhuHuynh';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import { Button, Col, Form, Input, message, Row } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { history, Link, useIntl, useModel } from 'umi';
import styles from './index.less';
import { data } from '@/utils/data';

const ForgetAcc: React.FC = () => {
  const form = Form.useForm();

  const [sdt, setSdt] = useState('');
  const [otp, setOtp] = useState('');
  const { postSdtModel, postNewPasswordModel, showOtp, setShowOtp, mess } =
    useModel('forgetPassword');

  return (
    <div className={styles.container}>
      <div className={styles.top} style={{ textAlign: 'center', margin: '5% 35%' }}>
        <div style={{ marginBottom: '40px' }}>
          <Link to="/">
            <img alt="logo" className={styles.logo} src="/logo.png" />
            <span className={styles.title}>Hệ thống mầm non</span>
          </Link>
        </div>
        {showOtp ? (
          <Form
            onFinish={async (values) => {
              setSdt(values.soDienThoai);
              const otp1 = await postSdtModel(values);
              setOtp(otp1?.data?.otpCode);
              if (mess === 'Gửi số điện thoại thành công') setShowOtp(false);
            }}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Row gutter={24} justify={'space-between'}>
              <Col xl={24}>
                <Form.Item
                  label={
                    <i>
                      <b>Nhập số điện thoại của bạn để lấy mã OTP và đổi mật khẩu</b>
                    </i>
                  }
                  name="soDienThoai"
                  style={{ width: '100%' }}
                >
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
              </Col>
              <Col xl={24}>
                <Form.Item style={{ textAlign: 'center' }}>
                  <Button style={{ marginRight: 8 }} htmlType="submit" type="primary">
                    Gửi
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        ) : (
          <Form
            onFinish={(values) => {
              // if (values.password !== values.passwordagain) {
              //   message.error('Mật khẩu không trùng khớp');
              // } else if (values.otpCode !== otp) {
              //   message.error('Sai mã OTP');
              // } else {
              //   const payload = {};
              //   payload.otpCode = values.otpCode;
              //   payload.username = sdt;
              //   payload.password = values.password;
              //   postNewPasswordModel(payload);
              //   history.push(`/user/login`);
              // }
              const payload = {};
              payload.otpCode = values.otpCode;
              payload.username = sdt;
              payload.password = values.password;
              postNewPasswordModel(payload);
            }}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Row gutter={24} justify={'space-between'}>
              <Col xl={24}>
                <Form.Item
                  label={
                    <i>
                      <b>Nhập mã OTP</b>
                    </i>
                  }
                  name="otpCode"
                  style={{ width: '100%', textAlign: 'center' }}
                >
                  <Input placeholder="Nhập OTP" />
                </Form.Item>
              </Col>
              <Col xl={24}>
                <Form.Item
                  label={
                    <i>
                      <b>Nhập mật khẩu mới</b>
                    </i>
                  }
                  name="password"
                  style={{ width: '100%', textAlign: 'center' }}
                >
                  <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>
              </Col>
              <Col xl={24}>
                <Form.Item
                  label={
                    <i>
                      <b>Nhập lại mật khẩu</b>
                    </i>
                  }
                  name="passwordagain"
                  style={{ width: '100%', textAlign: 'center' }}
                >
                  <Input.Password placeholder="Nhập mật khẩu mới" />
                </Form.Item>
              </Col>
              <Col xl={24}>
                <Form.Item style={{ textAlign: 'center' }}>
                  <Button style={{ marginRight: 8 }} htmlType="submit" type="primary">
                    Đổi mật khẩu
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </div>
    </div>
  );
};

export default ForgetAcc;
