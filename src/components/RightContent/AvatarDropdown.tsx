import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  LogoutOutlined,
  ReloadOutlined,
  SettingOutlined,
  UserOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Card, Col, Menu, message, Modal, Row, Spin, Form, Input } from 'antd';
import moment from 'moment';
import { stringify } from 'querystring';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback, useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import axios from '@/utils/axios';
import { domainOwn, ip3, ipRedirectLanding } from '@/utils/constants';
import { getInfoAdmin } from '@/services/ant-design-pro/api';
import Notification from './Notification';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  // await outLogin();
  const { query = {}, pathname } = history.location;
  const { redirect } = query;
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/user/login' && !redirect) {
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: pathname,
      }),
    });
  }
};

const handleChangeVaiTro = (val: { accessToken: string; systemRole: string }) => {
  localStorage.setItem('vaiTro', val?.systemRole);
  localStorage.setItem('token', val?.accessToken);
  window.location.reload();
  history.push('/thongtintruong');
  message.success('Đổi vai trò thành công');
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [changePassword, setChangePassword] = useState(false);
  const [form] = Form.useForm();

  // const newDataRole = JSON.parse(localStorage.getItem('dataRole') ?? '[]');

  const [newDataRole, setNewDataRole] = useState<any[]>();
  const getDataRoles = async () => {
    const currentUser = (await getInfoAdmin()).data;
    setNewDataRole(currentUser?.roles);
  };
  React.useEffect(() => {
    getDataRoles();
  }, []);

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'changePassword') {
        setChangePassword(true);
        return;
      }
      if (key === 'logout' && initialState) {
        setInitialState({ ...initialState, currentUser: undefined });
        localStorage.removeItem('vaiTro');
        localStorage.removeItem('token');
        localStorage.removeItem('dataRole');
        loginOut();
        document.location.href = `${ipRedirectLanding}/autologout?redirect=${domainOwn}`;
        return;
      }
      if (key === 'changeVaiTro' && initialState) {
        setVisibleModal(true);
        return;
      }
      if (key === 'xoaCon' && initialState) {
        Modal.confirm({
          title: 'Xác nhận',
          icon: <ExclamationCircleOutlined />,
          content: (
            <>
              Bạn có chắc chắn muốn xin thôi học cho con{' '}
              <b>{initialState?.currentUser?.role?.child?.hoTen}</b> ở lớp{' '}
              <b>{initialState?.currentUser?.role?.organization?.tenDonVi}</b>
            </>
          ),
          okText: 'Xác nhận',
          cancelText: 'Hủy',
          onOk: async () => {
            try {
              const result = await axios.delete(
                `${ip3}/con/${initialState?.currentUser?.role?.childId}/xoa-lop`,
              );
              if (result?.status === 200) {
                message.success('Xin thôi học thành công');
                loginOut();
              }
            } catch (error) {
              const { response }: any = error;
              if (response?.errorCode === 'NOT_FOUND_CON') {
                message.error('Xin thôi học thất bại. Con của bạn hiện đang không thuộc lớp nào');
                return false;
              }
              message.error('Đã xảy ra lỗi');
              return false;
            }
            return false;
          },
        });
        return;
      }
      if (key === 'xoaGiaoVien' && initialState) {
        Modal.confirm({
          title: 'Xác nhận',
          icon: <ExclamationCircleOutlined />,
          content: (
            <>
              Bạn có chắc chắn muốn xin nghỉ dạy ở lớp{' '}
              <b>{initialState?.currentUser?.role?.organization?.tenDonVi}</b>
            </>
          ),
          okText: 'Xác nhận',
          cancelText: 'Hủy',
          onOk: async () => {
            try {
              // const result = await axios.delete(
              //   // eslint-disable-next-line no-underscore-dangle
              //   `${ip3}/user/giaoVien/${initialState?.currentUser?._id}/lop/${initialState?.currentUser?.role?.organizationId}`,
              // );
              const result = await axios.put(
                // eslint-disable-next-line no-underscore-dangle
                `${ip3}/user/giao-vien/roi-lop`,
              );
              if (result?.status === 200) {
                message.success('Xin nghỉ dạy thành công');
                loginOut();
              }
            } catch (error) {
              message.error('Đã xảy ra lỗi');
              return false;
            }
            return false;
          },
        });
        return;
      }
      history.push(`/account/${key}`);
    },
    [initialState, setInitialState],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const handleNoChange = () => {};

  const { currentUser } = initialState;
  if (!currentUser || !currentUser.profile.fullname) {
    return loading;
  }
  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <Menu.Item key="center">
          <UserOutlined />
          Trang cá nhân
        </Menu.Item>
      )}
      {menu && currentUser?.roles?.length > 1 && newDataRole && (
        <Menu.Item key="changeVaiTro">
          <ReloadOutlined />
          Chọn vai trò
        </Menu.Item>
      )}
      {menu && currentUser?.role?.childId && (
        <Menu.Item key="xoaCon">
          <DeleteOutlined />
          Xin thôi học
        </Menu.Item>
      )}
      {menu && currentUser?.role?.systemRole === 'GiaoVien' && currentUser?.role?.organizationId && (
        <Menu.Item key="xoaGiaoVien">
          <DeleteOutlined />
          Xin nghỉ dạy
        </Menu.Item>
      )}
      {/* {menu && (
        <Menu.Item key="settings">
          <SettingOutlined />
          Cài đặt
        </Menu.Item>
      )} */}
      {menu && <Menu.Divider />}
      <Menu.Item key="changePassword">
        <UnlockOutlined />
        Đổi mật khẩu
      </Menu.Item>
      <Menu.Item key="logout">
        <LogoutOutlined />
        Đăng xuất
      </Menu.Item>
    </Menu>
  );
  return (
    <div>
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          {/* <Avatar size="small" className={styles.avatar} src={currentUser.AvatarSV} alt="avatar" /> */}
          <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: '5px' }} />
          <span className={`${styles.name} anticon`}>
            {currentUser.role.name
              ? currentUser.role.name.charAt(0).toUpperCase() + currentUser.role.name.slice(1)
              : currentUser.role?.systemRole}
          </span>
        </span>
      </HeaderDropdown>
      <Modal
        visible={changePassword}
        title="Đổi mật khẩu"
        footer={[]}
        width={500}
        centered
        onCancel={() => {
          setChangePassword(false);
        }}
        destroyOnClose
      >
        <Form
          // labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}
          onFinish={async (value) => {
            delete value.confirmPassword;
            const resp = await axios.post(`${ip3}/user/me/change/password`, { ...value });
            setInitialState({ ...initialState, currentUser: undefined });
            localStorage.removeItem('vaiTro');
            localStorage.removeItem('token');
            localStorage.removeItem('dataRole');
            loginOut();
            document.location.href = `${ipRedirectLanding}/autologout?redirect=${domainOwn}`;
          }}
          layout="vertical"
        >
          <Form.Item
            name="oldPassword"
            label="Mật khẩu cũ"
            rules={[
              {
                required: true,
                message: 'Bắt buộc!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              {
                required: true,
                message: 'Bắt buộc!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            rules={[
              {
                required: true,
                message: 'Bắt buộc!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu mới không trùng khớp!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <center>
            <Button htmlType="submit" type="primary">
              Xác nhận
            </Button>
          </center>
        </Form>
      </Modal>
      <Modal
        title="Chọn vai trò"
        visible={visibleModal}
        onOk={() => {
          setVisibleModal(false);
        }}
        footer={
          <Button
            type="primary"
            onClick={() => {
              setVisibleModal(false);
            }}
          >
            Ok
          </Button>
        }
        onCancel={() => {
          setVisibleModal(false);
        }}
      >
        {newDataRole?.map(
          (
            val: {
              accessToken: string;
              name: string;
              systemRole: string;
              organization: { tenDonVi: string };
              child: { hoTen: string };
              expireDate: string;
            },
            index: number,
          ) => {
            const ngayHetHan = new Date(val?.expireDate).getTime();
            const ngayHienTai = new Date().getTime();
            const checkNgayHetHan = (ngayHetHan - ngayHienTai) / (1000 * 60 * 60 * 24);
            return (
              <Row justify="center">
                <Col>
                  <Card
                    key={index}
                    style={
                      val?.systemRole && checkNgayHetHan < 0
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
                      if (val?.systemRole && checkNgayHetHan < 0) {
                        handleNoChange();
                      } else {
                        handleChangeVaiTro(val);
                      }
                    }}
                    hoverable={!(val?.systemRole && checkNgayHetHan < 0)}
                  >
                    <Card.Meta
                      avatar={<Avatar src="/logo.png" />}
                      title={val?.systemRole}
                      description={
                        // eslint-disable-next-line no-nested-ternary
                        val?.systemRole === 'PhuHuynh' ? (
                          <div>
                            {`Con: ${val?.child?.hoTen ?? 'Chưa cập nhật'}`}
                            <br />
                            {`Đơn vị: ${val?.organization?.tenDonVi ?? 'Chưa cập nhật'}`}
                            <br />
                            {checkNgayHetHan && checkNgayHetHan < 5 ? (
                              <p style={{ color: 'red', fontWeight: 600 }}>
                                {val?.expireDate
                                  ? `Ngày hết hạn: ${moment(val?.expireDate).format('DD-MM-YYYY')}`
                                  : undefined}
                              </p>
                            ) : (
                              <p>
                                {val?.expireDate
                                  ? `Ngày hết hạn: ${moment(val?.expireDate).format('DD-MM-YYYY')}`
                                  : undefined}
                              </p>
                            )}
                          </div>
                        ) : val?.systemRole === 'GiaoVien' || val?.systemRole === 'HieuTruong' ? (
                          <div>
                            {`Đơn vị: ${val?.organization?.tenDonVi ?? 'Chưa cập nhật'}`}
                            <br />
                            {checkNgayHetHan && checkNgayHetHan < 5 ? (
                              <p style={{ color: 'red', fontWeight: 600 }}>
                                {val?.expireDate
                                  ? `Ngày hết hạn: ${moment(val?.expireDate).format('DD-MM-YYYY')}`
                                  : undefined}
                              </p>
                            ) : (
                              <p>
                                {val?.expireDate
                                  ? `Ngày hết hạn: ${moment(val?.expireDate).format('DD-MM-YYYY')}`
                                  : undefined}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div>
                            {val?.systemRole}
                            <br />
                            {checkNgayHetHan && checkNgayHetHan < 5 ? (
                              <p style={{ color: 'red', fontWeight: 600 }}>
                                {val?.expireDate
                                  ? `Ngày hết hạn: ${moment(val?.expireDate).format('DD-MM-YYYY')}`
                                  : undefined}
                              </p>
                            ) : (
                              <p>
                                {val?.expireDate
                                  ? `Ngày hết hạn: ${moment(val?.expireDate).format('DD-MM-YYYY')}`
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
  );
};

export default AvatarDropdown;
