/* eslint-disable no-param-reassign */
import TableBase from '@/components/Table';
import type { TaiKhoanKhach as ITaiKhoanKhach } from '@/services/TaiKhoanKhach';
import {
  addTaiKhoanKhach,
  delTaiKhoanKhach,
  importTaiKhoanKhach,
  updTaiKhoanKhachAd,
} from '@/services/TaiKhoanKhach/taikhoankhach';
import type { IColumn } from '@/utils/interfaces';
import rules from '@/utils/rules';
import ThongTinCon from '@/pages/KhaiBaoThongTin/components/ThongTinCon';
import { DeleteOutlined, EditOutlined, ExportOutlined, EyeOutlined } from '@ant-design/icons';
import { DrawerForm, ProFormDatePicker, ProFormText } from '@ant-design/pro-form';
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Tabs,
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import UploadFile from '@/components/Upload/UploadFile';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import { checkAllow } from '@/components/CheckAuthority';
import { resetPass } from '@/services/TaiKhoanHieuTruong/taikhoanhieutruong';
import { RetweetOutlined } from '@ant-design/icons';

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const TaiKhoanKhach = () => {
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [state, setstate] = useState<number>(0);
  const [newRecord, setNewRecord] = useState<ITaiKhoanKhach.Record>();
  const [visibleModalAdd, setVisibleModalAdd] = useState<boolean>(false);
  const {
    loading: loadingTaiKhoanKhach,
    getTaiKhoanKhachModel,
    total,
    page,
    limit,
    cond,
  } = useModel('taikhoankhach');
  const vaiTro = localStorage.getItem('vaiTro');
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [danhSachTruong, setDanhSachTruong] = useState([]);

  const getDSTruong = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=100`);
    const arrTruong: any = [];
    result?.data?.data?.result?.map(
      (item: { loaiDonVi: string }) => item?.loaiDonVi === 'Truong' && arrTruong.push(item),
    );
    setDanhSachTruong(arrTruong);
  };

  React.useEffect(() => {
    getDSTruong();
  }, []);

  const handleEdit = (record: ITaiKhoanKhach.Record) => {
    setVisibleDrawer(true);
    setEdit(true);
    setNewRecord(record);
  };

  const handleDel = async (record: ITaiKhoanKhach.Record) => {
    // eslint-disable-next-line no-underscore-dangle
    const res = await delTaiKhoanKhach({ id: record?._id });
    if (res?.status === 200) {
      message.success('Xóa thành công');
      getTaiKhoanKhachModel();
      return true;
    }
    message.error('Đã xảy ra lỗi');
    return false;
  };

  const handleView = (record: ITaiKhoanKhach.Record) => {
    setVisibleModal(true);
    setNewRecord(record);
  };

  const onSubmit = async (values: any) => {
    try {
      const result = await importTaiKhoanKhach({ ...values });
      if (result?.data?.statusCode === 201) {
        message.success('Import tài khoản thành công');
        getTaiKhoanKhachModel();
        setVisibleModalAdd(false);
        return true;
      }
    } catch (error) {
      const { response }: any = error;
      if (response?.data?.errorCode === 'INVALID_FORMAT') {
        message.error('Data import không đúng định dạng. Vui lòng thử lại sau');
        return false;
      }
    }
    return true;
  };

  const handleResetPass = async (record: ITaiKhoanKhach.Record) => {
    try {
      const res = await resetPass({ id: record?._id });
      if (res?.status === 200) {
        message.success('Đặt lại mật khẩu thành công');
        return true;
      }
    } catch (error) {
      const { response }: any = error;
      if (response?.data?.errorDescription === 'Forbidden resource') {
        message.error('Không được phép đặt lại mật khẩu');
        return false;
      }
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return false;
  };

  const renderLast = (record: ITaiKhoanKhach.Record) => {
    return (
      <React.Fragment>
        <Button
          type="default"
          shape="circle"
          onClick={() => {
            handleView(record);
          }}
          title="Xem chi tiết"
        >
          <EyeOutlined />
        </Button>

        <Divider type="vertical" />
        <Button
          type="primary"
          shape="circle"
          onClick={() => {
            handleEdit(record);
          }}
          title="Chỉnh sửa"
          disabled={!checkAllow('EDIT_TAI_KHOAN_KHACH')}
        >
          <EditOutlined />
        </Button>

        <Divider type="vertical" />

        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDel(record)}
          disabled={!checkAllow('DEL_TAI_KHOAN_KHACH')}
        >
          <Button
            type="default"
            shape="circle"
            title="Xóa"
            disabled={!checkAllow('DEL_TAI_KHOAN_KHACH')}
          >
            <DeleteOutlined />
          </Button>
        </Popconfirm>
        {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
          <>
            <Divider type="vertical" />

            <Popconfirm
              title="Bạn có chắc muốn đặt lại mật khẩu?"
              onConfirm={() => handleResetPass(record)}
              disabled={!checkAllow('RESET_TK_HIEU_TRUONG')}
            >
              <Button
                type="primary"
                shape="circle"
                title="Đặt lại mật khẩu"
                disabled={!checkAllow('RESET_TK_HIEU_TRUONG')}
              >
                <RetweetOutlined />
              </Button>
            </Popconfirm>
          </>
        )}
      </React.Fragment>
    );
  };

  const onCell = (record: ITaiKhoanKhach.Record) => ({
    onClick: () => {
      handleView(record);
    },
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<ITaiKhoanKhach.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullname',
      align: 'center',
      width: 200,
      onCell,
      render: (val, value) => <div>{value?.profile?.fullname}</div>,
      search: 'search',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      align: 'center',
      width: 150,
      onCell,
      render: (val, value) => <div>{value?.profile?.phoneNumber}</div>,
      search: 'search',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'profile',
      align: 'center',
      width: 150,
      render: (val) => <div>{moment(val?.dateOfBirth).format('DD/MM/YYYY')}</div>,
      onCell,
    },
  ];

  if (vaiTro === 'Admin' || vaiTro === 'SuperAdmin' || vaiTro === 'HieuTruong')
    columns.push({
      title: 'Thao tác',
      align: 'center',
      render: (record: ITaiKhoanKhach.Record) => renderLast(record),
      fixed: 'right',
      width: 200,
    });

  useEffect(() => {}, []);

  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={getTaiKhoanKhachModel}
        loading={loadingTaiKhoanKhach}
        dependencies={[page, limit, cond]}
        modelName="taikhoankhach"
        title="Quản lý tài khoản khách"
      >
        {checkAllow('IMPORT_TAI_KHOAN_KHACH') && (
          <Button
            style={{ marginBottom: '10px' }}
            onClick={() => {
              setVisibleModalAdd(true);
            }}
            type="primary"
          >
            <ExportOutlined />
            Import file
          </Button>
        )}
        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          Tổng số:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={total}
          />
        </h3>
      </TableBase>
      <DrawerForm<ITaiKhoanKhach.Record>
        visible={visibleDrawer}
        onVisibleChange={setVisibleDrawer}
        title={edit ? 'Chỉnh sửa' : 'Thêm mới'}
        drawerProps={{
          forceRender: false,
          destroyOnClose: true,
        }}
        onFinish={async (values: any) => {
          values.username = newRecord?.username;
          values.profile.dateOfBirth = moment(values.profile.dateOfBirth).format();
          if (edit) {
            // eslint-disable-next-line no-underscore-dangle
            const id = newRecord?._id;
            const res = await updTaiKhoanKhachAd({ ...values, id });
            if (res?.data?.statusCode === 200) {
              message.success('Cập nhật thành công');
              getTaiKhoanKhachModel();
              return true;
            }
            message.error('Đã xảy ra lỗi');
            return false;
          }

          const res = await addTaiKhoanKhach({ ...values });
          if (res?.data?.statusCode === 201) {
            message.success('Thêm mới thành công');
            setstate(state + 1);
            getTaiKhoanKhachModel();
            return true;
          }
          message.error('Đã xảy ra lỗi');
          return false;
          //
        }}
        submitter={{
          render: (newProps) => {
            // DefaultDom có thể dùng hoặc không

            return [
              // ...defaultDoms,
              <Button
                key="submit"
                onClick={() => {
                  newProps.submit();
                }}
                type="primary"
              >
                Lưu
              </Button>,
              <Button
                key="cancel"
                onClick={() => {
                  setVisibleDrawer(false);
                }}
              >
                Quay lại
              </Button>,
            ];
          },
        }}
        initialValues={{
          ...(edit && newRecord),
        }}
      >
        <Tabs>
          <Tabs.TabPane tab="Thông tin tài khoản" key="1">
            <Row gutter={[16, 0]}>
              <Col span={12}>
                <ProFormText
                  name={['profile', 'fullname']}
                  label="Họ và tên"
                  placeholder="Nhập họ và tên"
                  rules={[...rules.required]}
                  initialValue={edit ? newRecord?.profile?.fullname : ''}
                />
              </Col>
              <Col span={12}>
                <ProFormText
                  name={['profile', 'phoneNumber']}
                  label="Số điện thoại"
                  placeholder="Số điện thoại"
                  rules={[...rules.required]}
                  disabled={edit}
                  initialValue={edit ? newRecord?.profile?.phoneNumber : ''}
                />
              </Col>
            </Row>
            <Row gutter={[16, 0]}>
              <Col span={12}>
                <ProFormText
                  name={['profile', 'phoneNumber']}
                  label="Số điện thoại"
                  placeholder="Số điện thoại"
                  rules={[...rules.required]}
                  disabled={edit}
                  initialValue={edit ? newRecord?.profile?.phoneNumber : ''}
                />
              </Col>
              <Col span={12}>
                <ProFormDatePicker
                  name={['profile', 'dateOfBirth']}
                  label="Ngày sinh"
                  placeholder="Chọn ngày sinh"
                  rules={[...rules.required]}
                />
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Con" key="2">
            <ThongTinCon taiKhoanPH={false} />
          </Tabs.TabPane>
        </Tabs>

        {edit && <div style={{ width: '100%' }} />}
      </DrawerForm>
      <Modal
        title="Import file tài khoản khách"
        visible={visibleModalAdd}
        onCancel={() => {
          setVisibleModalAdd(false);
        }}
        footer={[]}
        destroyOnClose
      >
        <Form labelAlign="left" onFinish={onSubmit} {...formItemLayout}>
          <Row>
            <Col span={24}>
              <Form.Item name="organizationId" label="Trường">
                <Select
                  placeholder="Chọn trường"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option: any) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {danhSachTruong?.map((item: { _id: string; tenDonVi: string }, index: number) => (
                    // eslint-disable-next-line no-underscore-dangle
                    <Select.Option key={index} value={item?._id}>
                      {item?.tenDonVi}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="file">
            <UploadFile />
          </Form.Item>
          <Row justify="center">
            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit">
                Tải lên
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
      <Modal
        title="Chi tiết tài khoản khách"
        visible={visibleModal}
        onCancel={() => {
          setVisibleModal(false);
        }}
        width="50%"
        footer={
          <Button
            onClick={() => {
              setVisibleModal(false);
            }}
          >
            OK
          </Button>
        }
      >
        <Form labelAlign="left" {...formItemLayout}>
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item label="Họ và tên" style={{ marginBottom: 0 }} required>
                <Input value={`${newRecord?.profile?.fullname}`} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tài khoản" style={{ marginBottom: 0 }} required>
                <Input value={newRecord?.username} disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item label="Số điện thoại" style={{ marginBottom: 0 }} required>
                <Input value={newRecord?.profile?.phoneNumber} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ngày sinh" style={{ marginBottom: 0 }}>
                <DatePicker
                  style={{ width: '100%' }}
                  value={
                    newRecord?.profile?.dateOfBirth
                      ? moment(newRecord?.profile?.dateOfBirth)
                      : undefined
                  }
                  disabled
                  format="DD-MM-YYYY"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default TaiKhoanKhach;
