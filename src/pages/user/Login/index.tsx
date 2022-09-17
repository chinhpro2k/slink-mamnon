import Footer from '@/components/Footer';
import { getInfoAdmin, login } from '@/services/ant-design-pro/api';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { Avatar, Button, Card, Col, ConfigProvider, message, Modal, Row, Tabs } from 'antd';
import viVN from 'antd/lib/locale/vi_VN';
import moment from 'moment';
import React, { useState } from 'react';
import { FormattedMessage, history, Link, SelectLang, useIntl, useModel } from 'umi';
import styles from './index.less';
import { ipRedirectLanding } from '../../../utils/constants';
// const LoginMessage: React.FC<{
//   content: string;
// }> = ({ content }) => (
//   <Alert
//     style={{
//       marginBottom: 24,
//     }}
//     message={content}
//     type="error"
//     showIcon
//   />
// );

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
  const [submitting, setSubmitting] = useState(false);
  // const [userLoginState, setUserLoginState] = useState<IRecordLogin.RootObject>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [dsRoles, setDSRoles] = useState<any>([]);

  const intl = useIntl();
  const handleChangeVaiTro = async (val: { accessToken: string; role: { systemRole: string } }) => {
    const defaultloginSuccessMessage = intl.formatMessage({
      id: 'pages.login.success',
      defaultMessage: 'success',
    });
    localStorage.setItem('token', val?.accessToken);
    localStorage.setItem('vaiTro', val.role?.systemRole);
    const currentUser = (await getInfoAdmin()).data;

    //  localStorage.setItem()

    let info;

    if (val.role?.systemRole) {
      info = await getInfoAdmin();
    }
    localStorage.setItem('modules', JSON.stringify(info?.data?.currentUser?.modules ?? []));

    setInitialState({
      ...initialState,
      currentUser: info?.data,
    });

    message.success(defaultloginSuccessMessage);
    if (info?.data?.modules.includes('DASHBOARD')) {
      history.push('/dashboard');
    } else {
      history.push('/');
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    setSubmitting(true);
    try {
      const msg: any = await login({ ...values });
      if (msg.statusCode === 201 && msg?.data?.length > 1) {
        setDSRoles(msg);
        setVisibleModal(true);
        const newDataRole = JSON.stringify(msg?.data);
        localStorage.setItem('dataRole', newDataRole);
        return;
      }
      if (msg.statusCode === 201 && msg?.data?.length === 1) {
        if (msg?.data?.[0]?.accessToken === '') {
          message.error('Tài khoản của bạn đã hết hạn. Vui lòng gia hạn để sử dụng chức năng!');
          setSubmitting(false);
          return;
        }
        const defaultloginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: 'success',
        });
        localStorage.setItem('token', msg?.data?.[0]?.accessToken);

        localStorage.setItem('vaiTro', msg?.data?.[0]?.role?.systemRole);
        let info;

        if (msg?.data?.[0]?.accessToken) {
          info = await getInfoAdmin();
        }

        setInitialState({
          ...initialState,
          currentUser: info?.data,
        });

        message.success(defaultloginSuccessMessage);
        if (info?.data?.modules.includes('DASHBOARD')) {
          history.push('/dashboard');
        } else {
          history.push('/');
        }
      }
    } catch (error) {
      const defaultloginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: 'failure',
      });
      message.error(defaultloginFailureMessage);
    }
    setSubmitting(false);
  };

  const handleNoChange = () => {};
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

          {/* <div className={styles.desc}>
            {intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}
          </div> */}
        </div>
        <ConfigProvider locale={viVN}>
          <div className={styles.main}>
            <ProForm
              initialValues={{
                autoLogin: true,
              }}
              submitter={{
                searchConfig: {
                  submitText: intl.formatMessage({
                    id: 'pages.login.submit',
                    defaultMessage: 'submit',
                  }),
                },
                render: (_, dom) => dom.pop(), // ko hỉu
                submitButtonProps: {
                  loading: submitting,
                  size: 'large',
                  style: {
                    width: '100%',
                  },
                  htmlType: 'submit',
                },
              }}
              onFinish={async (values) => {
                handleSubmit(values as API.LoginParams);
              }}
            >
              {type === 'account' && (
                <Tabs activeKey={type} onChange={setType}>
                  <Tabs.TabPane
                    key="account"
                    tab={intl.formatMessage({
                      id: 'pages.login.accountLogin.tab',
                      defaultMessage: 'tab',
                    })}
                  />
                </Tabs>
              )}

              {type === 'account' && (
                <>
                  <ProFormText
                    name="username"
                    fieldProps={{
                      size: 'large',
                      prefix: <UserOutlined className={styles.prefixIcon} />,
                    }}
                    placeholder="Tên tài khoản/Số điện thoại"
                    rules={[
                      {
                        required: true,
                        message: (
                          <FormattedMessage
                            id="pages.login.username.required"
                            defaultMessage="required!"
                          />
                        ),
                      },
                    ]}
                  />
                  <ProFormText.Password
                    name="password"
                    fieldProps={{
                      size: 'large',
                      prefix: <LockOutlined className={styles.prefixIcon} />,
                    }}
                    placeholder={intl.formatMessage({
                      id: 'pages.login.password.placeholder',
                      defaultMessage: 'placeholder: ant.design',
                    })}
                    rules={[
                      {
                        required: true,
                        message: (
                          <FormattedMessage
                            id="pages.login.password.required"
                            defaultMessage="required"
                          />
                        ),
                      },
                    ]}
                  />
                </>
              )}

              {/* {status === 'error' && loginType === 'mobile' && (
                <LoginMessage content="LoginMessage" />
              )} */}
            </ProForm>
            <div style={{ textAlign: 'center', marginTop: '5px' }}>
              Chưa có tài khoản?{' '}
              <span
                style={{ cursor: 'pointer', fontWeight: 600, fontStyle: 'italic' }}
                onClick={() => {
                  history.push(`/user/register`);
                }}
              >
                Đăng ký
              </span>{' '}
              <i>or</i>{' '}
              <span
                style={{ cursor: 'pointer', fontWeight: 600, fontStyle: 'italic' }}
                onClick={() => {
                  history.push(`/user/forgetAcc`);
                }}
              >
                Quên mật khẩu
              </span>
            </div>
            <Modal
              title="Chọn vai trò"
              visible={visibleModal}
              destroyOnClose
              footer={
                <Button
                  onClick={() => {
                    setSubmitting(false);
                    setVisibleModal(false);
                  }}
                  type="primary"
                >
                  Ok
                </Button>
              }
              onCancel={() => {
                setVisibleModal(false);
                setSubmitting(false);
              }}
            >
              {dsRoles?.data?.map(
                (val: {
                  accessToken: string;
                  name: string;
                  role: {
                    systemRole: string;
                    organization: { tenDonVi: string };
                    child: { hoTen: string };
                    expireDate: string;
                  };
                }) => {
                  const ngayHetHan = new Date(val?.role?.expireDate).getTime();
                  const ngayHienTai = new Date().getTime();
                  const checkNgayHetHan = (ngayHetHan - ngayHienTai) / (1000 * 60 * 60 * 24);
                  return (
                    <Row justify="center">
                      <Col>
                        <Card
                          style={
                            val?.role?.systemRole && checkNgayHetHan < 0
                              ? {
                                  width: 300,
                                  marginTop: 16,
                                  opacity: 0.8,
                                  backgroundColor: '#f5f5f5',
                                  borderColor: '#d9d9d9',
                                  cursor: 'not-allowed',
                                }
                              : { width: 300, marginTop: 16, cursor: 'pointer' }
                          }
                          onClick={() => {
                            if (val?.role?.systemRole && checkNgayHetHan < 0) {
                              handleNoChange();
                            } else {
                              let a = val;
                              handleChangeVaiTro(val);
                            }
                          }}
                          hoverable={!(val?.role?.systemRole && checkNgayHetHan < 0)}
                        >
                          <Card.Meta
                            avatar={<Avatar src="/logo.png" />}
                            title={val?.role?.systemRole}
                            description={
                              // eslint-disable-next-line no-nested-ternary
                              val?.role?.systemRole === 'PhuHuynh' ? (
                                <div>
                                  {`Con: ${val?.role?.child?.hoTen ?? 'Chưa cập nhật'}`}
                                  <br />
                                  {`Đơn vị: ${
                                    val?.role?.organization?.tenDonVi ?? 'Chưa cập nhật'
                                  }`}
                                  <br />
                                  {checkNgayHetHan && checkNgayHetHan < 5 ? (
                                    <p style={{ color: 'red', fontWeight: 600 }}>
                                      {val?.role?.expireDate
                                        ? `Ngày hết hạn: ${moment(val?.role?.expireDate).format(
                                            'DD-MM-YYYY',
                                          )}`
                                        : undefined}
                                    </p>
                                  ) : (
                                    <p>
                                      {val?.role?.expireDate
                                        ? `Ngày hết hạn: ${moment(val?.role?.expireDate).format(
                                            'DD-MM-YYYY',
                                          )}`
                                        : undefined}
                                    </p>
                                  )}
                                </div>
                              ) : val?.role?.systemRole === 'GiaoVien' ||
                                val?.role?.systemRole === 'HieuTruong' ? (
                                <div>
                                  {`Đơn vị: ${
                                    val?.role?.organization?.tenDonVi ?? 'Chưa cập nhật'
                                  }`}
                                  <br />
                                  {checkNgayHetHan && checkNgayHetHan < 5 ? (
                                    <p style={{ color: 'red', fontWeight: 600 }}>
                                      {val?.role?.expireDate
                                        ? `Ngày hết hạn: ${moment(val?.role?.expireDate).format(
                                            'DD-MM-YYYY',
                                          )}`
                                        : undefined}
                                    </p>
                                  ) : (
                                    <p>
                                      {val?.role?.expireDate
                                        ? `Ngày hết hạn: ${moment(val?.role?.expireDate).format(
                                            'DD-MM-YYYY',
                                          )}`
                                        : undefined}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <div>
                                  {val?.role?.systemRole}
                                  <br />
                                  {checkNgayHetHan && checkNgayHetHan < 5 ? (
                                    <p style={{ color: 'red', fontWeight: 600 }}>
                                      {val?.role?.expireDate
                                        ? `Ngày hết hạn: ${moment(val?.role?.expireDate).format(
                                            'DD-MM-YYYY',
                                          )}`
                                        : undefined}
                                    </p>
                                  ) : (
                                    <p>
                                      {val?.role?.expireDate
                                        ? `Ngày hết hạn: ${moment(val?.role?.expireDate).format(
                                            'DD-MM-YYYY',
                                          )}`
                                        : undefined}
                                    </p>
                                  )}
                                </div>
                              )
                            }
                          />
                        </Card>
                      </Col>
                    </Row>
                  );
                },
              )}
            </Modal>
          </div>
        </ConfigProvider>
      </div>
      <Footer />
    </div>
  );
};

export default Login;

export { goto };
