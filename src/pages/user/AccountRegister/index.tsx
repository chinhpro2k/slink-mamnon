import Footer from '@/components/Footer';
import { addTaiKhoanKhach } from '@/services/TaiKhoanKhach/taikhoankhach';
import type { TaiKhoanPhuHuynh as ITaiKhoanPhuHuynh } from '@/services/TaiKhoanPhuHuynh';
import rules from '@/utils/rules';
import { LockOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import ProForm, { ProFormDatePicker, ProFormText } from '@ant-design/pro-form';
import { ConfigProvider, message, Modal, Tabs, Input, Form, Button } from 'antd';
import viVN from 'antd/lib/locale/vi_VN';
import moment from 'moment';
import React, { useState } from 'react';
import { history, Link, SelectLang, useIntl, useModel } from 'umi';
import styles from './index.less';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

/** = redirect */
const goto = () => {
  if (!history) return;
  setTimeout(() => {
    const { query } = history.location;
    const { redirect } = query as { redirect: string };
    history.push(redirect || '/');
  }, 2000);
};

const Login: React.FC = () => {
  const register = useModel('register');
  const form = Form.useForm();
  const [otpText, setOtpText] = useState('');
  const [waitOtp, setWaitOtp] = useState(false);
  const [type, setType] = useState<string>('register');

  const intl = useIntl();

  const handleSubmit = async (values: ITaiKhoanPhuHuynh.Record) => {
    if (values?.password !== values?.repassword) {
      message.error('Nhập lại mật khẩu không trùng khớp. Vui lòng kiểm tra lại!');
      return false;
    }
    const newValues = values;
    newValues.profile.dateOfBirth = moment(values.profile.dateOfBirth).format();
    newValues.profile.username = values.username;
    newValues.profile.phoneNumber = values.username;
    delete newValues.repassword;
    try {
      register.setInfoRegister(newValues);
      const response = await axios.post(`${ip3}/auth/verify-phonenumber-add`, {
        soDienThoai: values.username,
      });
      setWaitOtp(true);
    } catch (e) {
      console.log(e);
      message.error('Số điện thoại đã được đăng ký');
    }
    // Modal.confirm({
    //   title: 'Nhập mã OTP',
    //   content: (

    //   ),
    //   okText: 'Đăng ký',
    //   onOk: async () => {
    //     try {
    //       newValues = {
    //         ...newValues,
    //         otpCode: otpText,
    //       };
    //       const res = await addTaiKhoanKhach({ ...newValues });
    //       if (res?.data?.statusCode === 201) {
    //         message.success('Đăng ký thành công');
    //         history.push('/user/login');
    //         return true;
    //       }
    //     } catch (error) {
    //       message.error('Đăng ký không thành công do số điện thoại đã đăng ký tài khoản');
    //       return false;
    //     }
    //     return false;
    //   },
    // });
  };
  return (
    <div className={styles.container}>
      {/* <SelectRole /> */}
      <div className={styles.lang}>{SelectLang && <SelectLang />}</div>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src="/logo.png" />
              <span className={styles.title}>Hệ thống mầm non</span>
            </Link>
          </div>
        </div>

        <ConfigProvider locale={viVN}>
          <div className={styles.main}>
            {type === 'register' && (
              <Tabs activeKey={type} onChange={setType}>
                <Tabs.TabPane
                  key="register"
                  tab={intl.formatMessage({
                    id: 'pages.login.accountRegister.tab',
                    defaultMessage: 'tab',
                  })}
                />
              </Tabs>
            )}
            {waitOtp && (
              <Form
                // form={form}
                onFinish={async (values) => {
                  try {
                    let newValues = register.infoRegister;
                    newValues = {
                      ...newValues,
                      otpCode: values.otpCode,
                    };
            
                    const res = await addTaiKhoanKhach({ ...newValues });
                    if (res?.data?.statusCode === 201) {
                      message.success('Đăng ký thành công');
                      history.push('/user/login');
                      return true;
                    }
                  } catch (error) {
                    message.error('Đăng ký lỗi');
                    return false;
                  }
                  return false;
                }}
                layout="vertical"
              >
                <Form.Item
                  label={<b>Nhập mã otp được gửi về số điện thoại của bạn</b>}
                  name="otpCode"
                >
                  <Input placeholder="Nhập mã otp" />
                </Form.Item>
                <center>
                  <Button htmlType="submit" type="primary">
                    Đăng ký
                  </Button>
                </center>
              </Form>
            )}
            {!waitOtp && (
              <ProForm
                initialValues={{}}
                submitter={{
                  searchConfig: {
                    submitText: intl.formatMessage({
                      id: 'pages.register.submit',
                      defaultMessage: 'submit',
                    }),
                  },
                  render: (_, dom) => dom.pop(), // ko hỉu
                  submitButtonProps: {
                    loading: false,
                    size: 'large',
                    style: {
                      width: '100%',
                    },
                  },
                }}
                onFinish={async (values: ITaiKhoanPhuHuynh.Record) => {
                  handleSubmit(values);
                }}
              >
                {type === 'register' && (
                  <>
                    <ProFormText
                      name={['profile', 'fullname']}
                      fieldProps={{
                        size: 'large',
                        prefix: <UserOutlined className={styles.prefixIcon} />,
                      }}
                      placeholder="Họ và tên"
                      rules={[...rules.required]}
                    />
                    <ProFormText
                      name="username"
                      fieldProps={{
                        size: 'large',
                        prefix: <PhoneOutlined className={styles.prefixIcon} />,
                      }}
                      placeholder="Số điện thoại"
                      rules={[...rules.required, ...rules.soDienThoai]}
                    />
                    <ProFormText.Password
                      name="password"
                      fieldProps={{
                        size: 'large',
                        prefix: <LockOutlined className={styles.prefixIcon} />,
                      }}
                      placeholder="Mật khẩu"
                      rules={[...rules.required, ...rules.password]}
                    />
                    <ProFormText.Password
                      name="repassword"
                      fieldProps={{
                        size: 'large',
                        prefix: <LockOutlined className={styles.prefixIcon} />,
                      }}
                      placeholder="Nhập lại mật khẩu"
                      rules={[...rules.required, ...rules.password]}
                    />
                    <ProFormDatePicker
                      name={['profile', 'dateOfBirth']}
                      placeholder="Ngày sinh"
                      rules={[...rules.truocHomNay]}
                    />
                  </>
                )}
              </ProForm>
            )}
            <div style={{ textAlign: 'center', marginTop: '5px' }}>
              Đã có tài khoản?{' '}
              <span
                style={{ cursor: 'pointer', fontWeight: 600, fontStyle: 'italic' }}
                onClick={() => {
                  history.push('/user/login');
                }}
              >
                Đăng nhập
              </span>
            </div>
          </div>
        </ConfigProvider>
      </div>
      <Footer />
    </div>
  );
};

export default Login;

export { goto };
