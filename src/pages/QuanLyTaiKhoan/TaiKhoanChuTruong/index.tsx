/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import { checkAllow } from '@/components/CheckAuthority';
import TableBase from '@/components/Table';
import type { TaiKhoanHieuTruong as ITaiKhoanHieuTruong } from '@/services/TaiKhoanHieuTruong';
import {
  addTaiKhoanHieuTruong,
  delTaiKhoanHieuTruong,
  resetPass,
  updTaiKhoanHieuTruong,
} from '@/services/TaiKhoanHieuTruong/taikhoanhieutruong';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import rules from '@/utils/rules';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleFilled,
  RetweetOutlined,
} from '@ant-design/icons';
import { DrawerForm, ProFormDatePicker, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Drawer,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Tag,
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import Text from '@/pages/QuanLyKhaoSat/components/Question/Text';

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const TaiKhoanHieuTruong = (props: {
  idTruong?: string;
  disable?: boolean;
  expireDate?: string;
}) => {
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [disableLop, setDisableLop] = useState<boolean>(false);
  const [disableTruongLop, setDisableTruongLop] = useState<boolean>(false);
  const [state, setstate] = useState<number>(0);
  const [recordTruong, setRecordTruong] = useState<ITaiKhoanHieuTruong.Record>();
  const [role, setRole] = useState<ITaiKhoanHieuTruong.Record>();
  const {
    loading: loadingTaiKhoanHieuTruong,
    getTaiKhoanChuTruongModel,
    total,
    page,
    limit,
    cond,
    setCondition,
    setPage,
  } = useModel('taikhoanhieutruong');
  const [dsTruong, setDSTruong] = useState([]);
  const [dsLop, setDSLop] = useState([]);
  const [dsTenLop, setDSTenLop] = useState([]);
  const [newRecord, setNewRecord] = useState<ITaiKhoanHieuTruong.Record>();
  const [dsAllLop, setDSALLLop] = useState([]);
  const [dsTruongFind, setDSTruongFind] = useState([]);
  const [dsRoles, setDSRoles] = useState([]);
  const [valueLop, setValueLop] = useState([]);
  const [dataSelect, setDataSelect] = useState<string[]>([]);
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const vaiTro = localStorage.getItem('vaiTro');

  const getTruong = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=100`, {
      params: { cond: { loaiDonVi: 'Truong' } },
    });
    setDSTruong(result?.data?.data?.result);
    const arrSelectTruong: any = [];
    arrSelectTruong.push({ tenDonVi: 'Tất cả các trường', _id: 'Tất cả' });
    arrSelectTruong.push(...result?.data?.data?.result);
    setDSTruongFind(arrSelectTruong);
  };

  const getRoles = async () => {
    const result = await axios.get(`${ip3}/roles/pageable?page=1&limit=100`);
    const arrRoles: any = [];
    result?.data?.data?.result?.map(
      (item: { systemRole: string }) => item?.systemRole === 'ChuTruong' && arrRoles.push(item),
    );
    setDSRoles(arrRoles);
    console.log('ar role', arrRoles);
  };

  const getLop = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable/my/child?page=1&limit=100`, {
      params: { cond: { loaiDonVi: 'Lop' } },
    });
    setDSALLLop(result?.data?.data?.result);
    if (props?.idTruong || organizationId) {
      const arrLop: any = [];
      arrLop.push({ tenDonVi: 'Tất cả các lớp', _id: ['*'] });
      result?.data?.data?.result?.map((item: { parent: string }) =>
        item?.parent === (props?.idTruong || organizationId) ? arrLop?.push(item) : undefined,
      );
      setDSLop(arrLop);
    }
  };

  React.useEffect(() => {
    getTruong();
    getRoles();
    getLop();
    setCondition({ ...cond, organizationId: undefined });
  }, []);

  const handleView = (record: ITaiKhoanHieuTruong.Record) => {
    setRecordTruong(
      dsTruong?.find(
        (item: { _id: string; tenDonVi: string }) =>
          item?._id === record?.roles?.[0]?.organizationId,
      ),
    );
    setRole(
      dsRoles?.find(
        (item: { _id: string; name: string }) => item?._id === record?.roles?.[0]?.roleId,
      ),
    );
    setVisibleModal(true);
    setNewRecord(record);
    const arrTenLop: any = [];
    if (record?.roles?.[0]?.listOrgIdAccess?.[0] === '*') {
      arrTenLop.push('Tất cả các lớp');
    }
    dsAllLop?.map((item: { _id: string; tenDonVi: string }) =>
      record?.roles?.[0]?.listOrgIdAccess?.map(
        (val: string) => val === item?._id && arrTenLop.push(item?.tenDonVi),
      ),
    );
    setDSTenLop(arrTenLop);
    let arr: string[] = [];
    record?.roles?.[0]?.listTruong.map((val) => {
      arr.push(val.tenDonVi);
    });
    setDataSelect(arr);
  };
  const handleEdit = (record: ITaiKhoanHieuTruong.Record) => {
    console.log('record', record);
    setEdit(true);
    setNewRecord(record);
    const arr: string[] = [];
    record?.roles?.[0]?.listTruong.map((val) => {
      arr.push(val.id);
    });
    setDataSelect(arr);
    setVisibleDrawer(true);
    const arrLop: any = [];
    arrLop.push({ tenDonVi: 'Tất cả các lớp', _id: ['*'] });
    dsAllLop?.map((item: { parent: string }) =>
      item?.parent === record?.roles?.[0]?.organizationId ? arrLop?.push(item) : undefined,
    );
    setRecordTruong(
      dsTruong?.find(
        (item: { _id: string; tenDonVi: string }) =>
          item?._id === record?.roles?.[0]?.organizationId,
      ),
    );
    setDSLop(arrLop);
    for (let i = 0; i < record?.roles?.[0]?.listOrgIdAccess?.length; i += 1) {
      if (record?.roles?.[0]?.listOrgIdAccess?.[i] === '*') {
        setDisableLop(true);
      } else {
        setDisableLop(false);
      }
    }
    setValueLop(record?.roles?.[0]?.listOrgIdAccess);
  };

  const onCell = (record: ITaiKhoanHieuTruong.Record) => ({
    onClick: () => {
      handleView(record);
    },
    style: { cursor: 'pointer' },
  });

  const handleOk = () => {
    setVisibleModal(false);
  };

  const handleDel = async (record: ITaiKhoanHieuTruong.Record) => {
    if (vaiTro === 'SuperAdmin' || vaiTro === 'Admin') {
      const res = await delTaiKhoanHieuTruong({ id: record?._id });
      if (res?.status === 200) {
        message.success('Xóa thành công');
        getTaiKhoanChuTruongModel(props?.idTruong || organizationId);
        return true;
      }
      message.error('Đã xảy ra lỗi');
      return false;
    }
    message.error('Bạn không được phép xóa tài khoản này!');
    return false;
  };

  const handleResetPass = async (record: ITaiKhoanHieuTruong.Record) => {
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

  const onChange = (value: string) => {
    setCondition({ ...cond, organizationId: value });
    setPage(1);
  };

  const renderLast = (record: ITaiKhoanHieuTruong.Record) => {
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
          disabled={!checkAllow('EDIT_TK_CHU_TRUONG')}
        >
          <EditOutlined />
        </Button>

        <Divider type="vertical" />

        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDel(record)}
          disabled={!checkAllow('DEL_TK_CHU_TRUONG')}
        >
          <Button
            type="default"
            shape="circle"
            title="Xóa"
            disabled={!checkAllow('DEL_TK_CHU_TRUONG')}
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
              disabled={!checkAllow('RESET_TK_CHU_TRUONG')}
            >
              <Button
                type="primary"
                shape="circle"
                title="Đặt lại mật khẩu"
                disabled={!checkAllow('RESET_TK_CHU_TRUONG')}
              >
                <RetweetOutlined />
              </Button>
            </Popconfirm>
          </>
        )}
      </React.Fragment>
    );
  };

  const columns: IColumn<ITaiKhoanHieuTruong.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'Họ và tên',
      dataIndex: ['profile', 'fullname'],
      align: 'center',
      width: 200,
      onCell,
      search: 'search',
    },
    {
      title: 'Số điện thoại',
      dataIndex: ['profile', 'phoneNumber'],
      align: 'center',
      width: 150,
      onCell,
      search: 'search',
    },
    {
      title: 'Email',
      dataIndex: ['profile', 'email'],
      align: 'center',
      width: 200,
      onCell,
      search: 'search',
    },
    {
      title: 'Tài khoản',
      dataIndex: 'profile',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => <div>{val?.username}</div>,
    },
    {
      title: 'Trường',
      dataIndex: 'roles',
      align: 'center',
      width: 200,
      onCell,
      // render: (val) => (val?.[0] ? val?.[0]?.organization?.tenDonVi : 'Không có'),
      render: (val) => {
        if (Array.isArray(val)) {
          const arrObj = val.filter((item) => {
            return item.systemRole === 'ChuTruong';
          });
          return (
            <>
              {arrObj?.[0]?.listTruong?.map((tag) => {
                let color = tag?.tenDonVi.length > 5 ? 'geekblue' : 'green';

                return (
                  <Tag color={color} key={tag} style={{ marginTop: '4px' }}>
                    {tag?.tenDonVi?.toUpperCase()}
                  </Tag>
                );
              })}
            </>
          );
        }
      },
    },
    // {
    //   title: 'Ngày hết hạn',
    //   dataIndex: 'expireDate',
    //   align: 'center',
    //   width: 150,
    //   onCell,
    //   render: (val, record) =>
    //     record?.roles?.[0]?.expireDate ? (
    //       <div>{moment(record?.roles?.[0]?.expireDate).format('DD/MM/YYYY')}</div>
    //     ) : (
    //       moment().format('DD-MM-YYYY')
    //     ),
    // },
  ];

  if (!props?.disable) {
    columns.push({
      title: 'Thao tác',
      align: 'center',
      render: (record: ITaiKhoanHieuTruong.Record) => renderLast(record),
      fixed: 'right',
      width: 220,
    });
  }

  useEffect(() => {}, []);

  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={() => getTaiKhoanChuTruongModel(props?.idTruong || organizationId)}
        dependencies={[page, limit, cond]}
        loading={loadingTaiKhoanHieuTruong}
        modelName="taikhoanhieutruong"
        title={props?.idTruong ? '' : 'Quản lý tài khoản chủ trường'}
        scroll={{ x: 1300, y: 500 }}
      >
        {!props?.disable && checkAllow('ADD_TK_HIEU_TRUONG') && (
          <Button
            style={{ marginBottom: '10px', marginRight: '10px' }}
            onClick={() => {
              setEdit(false);
              setVisibleDrawer(true);
            }}
            type="primary"
          >
            <PlusCircleFilled />
            Thêm mới
          </Button>
        )}
        {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && !props?.idTruong && (
          <>
            <Select
              showSearch
              defaultValue="Tất cả"
              style={{ width: '20%', marginLeft: '10px' }}
              placeholder="Chọn đơn vị"
              optionFilterProp="children"
              onChange={onChange}
              filterOption={(input, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {dsTruongFind?.map((item: { _id: string; tenDonVi: string }) => (
                <Select.Option key={item?._id} value={item?._id}>
                  {item?.tenDonVi}
                </Select.Option>
              ))}
            </Select>
          </>
        )}
        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          Tổng số:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={total}
          />
        </h3>
      </TableBase>
      <DrawerForm<ITaiKhoanHieuTruong.Record>
        visible={visibleDrawer}
        onVisibleChange={setVisibleDrawer}
        title={edit ? 'Chỉnh sửa' : 'Thêm mới'}
        drawerProps={{
          forceRender: false,
          destroyOnClose: true,
          onClose: () => {
            setVisibleDrawer(false);
            setRecordTruong(undefined);
            setNewRecord(undefined);
            setDisableTruongLop(false);
            setValueLop([]);
          },
        }}
        onValuesChange={async (val) => {
          if (val?.organizationId) {
            const arrLop: any = [];
            arrLop.push({ tenDonVi: 'Tất cả các lớp', _id: ['*'] });
            dsAllLop?.map((item: { parent: string }) =>
              item?.parent === val?.organizationId ? arrLop.push(item) : undefined,
            );
            setDSLop(arrLop);
            setRecordTruong(
              dsTruong?.find(
                (item: { _id: string; tenDonVi: string }) => item?._id === val?.organizationId,
              ),
            );
            setValueLop([]);
          }
          if (val?.listOrgIdAccess) setValueLop(val?.listOrgIdAccess);
          for (let i = 0; i < val?.listOrgIdAccess?.length; i += 1) {
            if (val?.listOrgIdAccess?.[i] === '*') {
              setDisableLop(true);
            } else {
              setDisableLop(false);
            }
          }
          if (val?.roleId) {
            const dataRole: any = dsRoles?.find(
              (item: { _id: string }) => item?._id === val?.roleId,
            );
            if (dataRole?.systemRole !== 'HieuTruong' && dataRole?.systemRole !== 'ChuTruong')
              setDisableTruongLop(true);
            else setDisableTruongLop(false);
          }
        }}
        onFinish={async (values: any) => {
          if (organizationId) {
            values.organizationId = organizationId;
          }
          const recordRole: any = dsRoles?.find(
            (item: { _id: string }) => item?._id === values?.roleId,
          );

          const dataTruong: any = dsTruong?.find(
            (item: { _id: string }) => item?._id === values?.organizationId,
          );

          values.roles = [
            {
              systemRole: props?.idTruong ? 'ChuTruong' : recordRole?.systemRole,
              // organizationId: props?.idTruong ?? values.organizationId,
              roleId: values?.roleId,
              name: recordRole?.name,
              expireDate: props?.expireDate
                ? moment(props?.expireDate).toISOString()
                : moment(edit ? values.expireDate : dataTruong?.expireDate).toISOString(),
              listOrgIdAccess: values?.listOrgIdAccess,
              listTruongAccess: values.organizationId,
            },
          ];
          values.profile.username = values.username;
          values.profile.dateOfBirth = moment(values.profile.dateOfBirth).format();
          delete values.organizationId;
          delete values.listOrgIdAccess;
          if (edit) {
            const id = newRecord?._id;
            // if (vaiTro === 'HieuTruong') {
            //   const res = await updMe({ ...values });
            //   if (res?.data?.statusCode === 200) {
            //     message.success('Cập nhật thành công');
            //     getTaiKhoanHieuTruongModel(props?.idTruong ?? organizationId);
            //     return true;
            //   }
            //   message.error('Đã xảy ra lỗi');
            //   return false;
            // }
            const res = await updTaiKhoanHieuTruong({ ...values, id });
            if (res?.data?.statusCode === 200) {
              message.success('Cập nhật thành công');
              setRecordTruong(undefined);
              getTaiKhoanChuTruongModel(props?.idTruong ?? organizationId);
              return true;
            }
            message.error('Đã xảy ra lỗi');
            return false;
          }
          try {
            const res = await addTaiKhoanHieuTruong({ ...values });
            if (res?.data?.statusCode === 201) {
              message.success('Thêm mới thành công');
              setstate(state + 1);
              setRecordTruong(undefined);
              getTaiKhoanChuTruongModel(props?.idTruong ?? organizationId);
              return true;
            }
          } catch (error) {
            message.error('Số điện thoại hoặc tên tài khoản đã được sử dụng!');
            return false;
          }
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
                  setRecordTruong(undefined);
                  setNewRecord(undefined);
                  setDisableTruongLop(false);
                  setValueLop([]);
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
        <Row gutter={[16, 0]}>
          <Col span={12}>
            <ProFormText
              name={['profile', 'fullname']}
              label="Họ và tên"
              placeholder="Nhập họ và tên"
              rules={[...rules.required]}
              initialValue={edit ? newRecord?.profile?.fullname : undefined}
            />
          </Col>
          <Col span={12}>
            <ProFormText
              name={['profile', 'phoneNumber']}
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              rules={[...rules.required, ...rules.soDienThoai]}
              initialValue={edit ? newRecord?.profile?.phoneNumber : undefined}
              disabled={edit}
            />
          </Col>
        </Row>

        <Row gutter={[16, 0]}>
          <Col span={edit ? 24 : 12}>
            <ProFormText
              name="username"
              label="Tài khoản"
              placeholder="Nhập tài khoản"
              rules={[...rules.required]}
              disabled={edit}
              initialValue={edit ? newRecord?.username : undefined}
            />
          </Col>
          <Col span={12}>
            {!edit && (
              <ProFormText.Password
                name="password"
                label="Mật khẩu"
                placeholder="Nhập mật khẩu"
                rules={[...rules.required]}
                initialValue={edit ? newRecord?.password : undefined}
              />
            )}
          </Col>
        </Row>

        <Row gutter={[16, 0]}>
          <Col span={12}>
            <ProFormSelect
              name="roleId"
              label="Vai trò"
              placeholder="Chọn vai trò"
              disabled={edit}
              rules={[...rules.required]}
              initialValue={edit ? newRecord?.roles?.[0]?.roleId : undefined}
              options={dsRoles?.map((item: { _id: string; name: string }) => ({
                value: `${item?._id}`,
                label: `${item?.name}`,
              }))}
            />
          </Col>
          <Col span={12}>
            <ProFormText
              name={['profile', 'email']}
              label="Email"
              placeholder="Nhập email"
              initialValue={edit ? newRecord?.profile?.email : undefined}
            />
          </Col>
        </Row>
        {!disableTruongLop && (
          <>
            <Row gutter={[16, 0]}>
              {!props?.idTruong && !organizationId && (
                <Col span={24}>
                  <ProFormSelect
                    name="organizationId"
                    label="Trường"
                    fieldProps={{
                      mode: 'multiple',
                    }}
                    placeholder="Chọn trường"
                    rules={[...rules.required]}
                    initialValue={edit ? dataSelect : undefined}
                    options={dsTruong?.map((item: { _id: string; tenDonVi: string }) => ({
                      value: `${item?._id}`,
                      label: `${item?.tenDonVi}`,
                    }))}
                  />
                </Col>
              )}
            </Row>
            {/*{(newRecord || recordTruong || props?.idTruong || organizationId) && (*/}
            {/*  <Col span={24}>*/}
            {/*    <ProFormSelect*/}
            {/*      name="listOrgIdAccess"*/}
            {/*      label="Lớp"*/}
            {/*      placeholder="Chọn lớp"*/}
            {/*      fieldProps={{*/}
            {/*        value: valueLop,*/}
            {/*      }}*/}
            {/*      mode={!disableLop ? 'multiple' : 'single'}*/}
            {/*      initialValue={edit ? newRecord?.roles?.[0]?.listOrgIdAccess : undefined}*/}
            {/*      options={dsLop?.map((item: { _id: string; tenDonVi: string }) => ({*/}
            {/*        value: `${item?._id}`,*/}
            {/*        label: `${item?.tenDonVi}`,*/}
            {/*      }))}*/}
            {/*    />*/}
            {/*  </Col>*/}
            {/*)}*/}
          </>
        )}

        <ProFormDatePicker
          name={['profile', 'dateOfBirth']}
          label="Ngày sinh"
          placeholder="Chọn ngày sinh"
          rules={[...rules.truocHomNay]}
          initialValue={edit ? moment(newRecord?.profile?.dateOfBirth) : undefined}
        />
        {/*{newRecord?.roles?.[0]?.expireDate && !props?.idTruong && !organizationId && (*/}
        {/*  <ProFormDatePicker*/}
        {/*    name="expireDate"*/}
        {/*    label="Ngày hết hạn"*/}
        {/*    placeholder="Chọn ngày hết hạn"*/}
        {/*    // rules={[...rules.required, ...rules.sauHomNay]}*/}
        {/*    initialValue={*/}
        {/*      newRecord?.roles?.[0]?.expireDate*/}
        {/*        ? moment(new Date(newRecord?.roles?.[0]?.expireDate))*/}
        {/*        : undefined*/}
        {/*    }*/}
        {/*  />*/}
        {/*)}*/}
        {/*{(props?.idTruong || organizationId) && edit && (*/}
        {/*  <ProFormDatePicker*/}
        {/*    name="expireDate"*/}
        {/*    label="Ngày hết hạn"*/}
        {/*    placeholder="Chọn ngày hết hạn"*/}
        {/*    rules={[...rules.required, ...rules.sauHomNay]}*/}
        {/*    initialValue={*/}
        {/*      newRecord?.roles?.[0]?.expireDate ?? props?.expireDate*/}
        {/*        ? moment(new Date(newRecord?.roles?.[0]?.expireDate ?? props?.expireDate))*/}
        {/*        : undefined*/}
        {/*    }*/}
        {/*    disabled*/}
        {/*  />*/}
        {/*)}*/}

        {edit && <div style={{ width: '100%' }} />}
      </DrawerForm>
      <Modal
        title="Chi tiết tài khoản"
        visible={visibleModal}
        onCancel={handleOk}
        width="50%"
        footer={<Button onClick={handleOk}>OK</Button>}
      >
        <Form labelAlign="left" {...formItemLayout}>
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item label="Họ và tên" style={{ marginBottom: 0 }} required>
                <Input value={newRecord?.profile?.fullname} disabled />
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
              <Form.Item label="Email" style={{ marginBottom: 0 }}>
                <Input value={newRecord?.profile?.email ?? 'Chưa cập nhật'} disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item label="Vai trò" style={{ marginBottom: 0 }} required>
                <Select value={role?.name ?? 'Không có'} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Trường" style={{ marginBottom: 0 }} required>
                <Select value={dataSelect ?? 'Không có'} disabled mode="multiple" />
              </Form.Item>
            </Col>
            {/*{dsTenLop?.length > 0 && (*/}
            {/*  <Col span={24}>*/}
            {/*    <Form.Item*/}
            {/*      label="Lớp"*/}
            {/*      style={{ marginBottom: 0 }}*/}
            {/*      initialValue={edit ? newRecord?.roles?.[0]?.listOrgIdAccess : undefined}*/}
            {/*    >*/}
            {/*      <Select mode="multiple" value={dsTenLop} disabled />*/}
            {/*    </Form.Item>*/}
            {/*  </Col>*/}
            {/*)}*/}
          </Row>
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item label="Ngày sinh" style={{ marginBottom: 0 }}>
                <DatePicker
                  style={{ width: '100%' }}
                  value={moment(newRecord?.profile?.dateOfBirth)}
                  disabled
                  format="DD-MM-YYYY"
                />
              </Form.Item>
            </Col>
            {/*<Col span={12}>*/}
            {/*  <Form.Item label="Ngày hết hạn" style={{ marginBottom: 0 }} required>*/}
            {/*    <DatePicker*/}
            {/*      style={{ width: '100%' }}*/}
            {/*      value={*/}
            {/*        newRecord?.roles?.[0]?.expireDate*/}
            {/*          ? moment(new Date(newRecord?.roles?.[0]?.expireDate))*/}
            {/*          : undefined*/}
            {/*      }*/}
            {/*      disabled*/}
            {/*      format="DD-MM-YYYY"*/}
            {/*    />*/}
            {/*  </Form.Item>*/}
            {/*</Col>*/}
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default TaiKhoanHieuTruong;
