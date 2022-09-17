import React, { useEffect, useState } from 'react';
import { TaiKhoanHieuTruong as ITaiKhoanHieuTruong } from '@/services/TaiKhoanHieuTruong';
import { useModel } from '@@/plugin-model/useModel';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import {
  addChuTruong,
  addHieuTruong,
  addTaiKhoanHieuTruong,
  delTaiKhoanHieuTruong,
  delVaiTroChuTruong,
  resetPass,
  updTaiKhoanHieuTruong,
} from '@/services/TaiKhoanHieuTruong/taikhoanhieutruong';
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
  Tag,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleFilled,
  RetweetOutlined,
} from '@ant-design/icons';
import { checkAllow } from '@/components/CheckAuthority';
import { IColumn } from '@/utils/interfaces';
import moment from 'moment';
import TableBase from '@/components/Table';
import { DrawerForm, ProFormDatePicker, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import rules from '@/utils/rules';
import { formatPhoneNumber } from '@/functionCommon';
const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const TaiKhoanChuTruong = (props: {
  idTruong?: string;
  disable?: boolean;
  expireDate?: string;
  newRecord?: any;
}) => {
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [visibleModalAddTk, setVisibleModalAddTk] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [disableLop, setDisableLop] = useState<boolean>(false);
  const [disableTruongLop, setDisableTruongLop] = useState<boolean>(false);
  const [state, setstate] = useState<number>(0);
  const [recordTruong, setRecordTruong] = useState<ITaiKhoanHieuTruong.Record>();
  const [role, setRole] = useState<ITaiKhoanHieuTruong.Record>();
  const {
    loading: loadingTaiKhoanHieuTruong,
    getTaiKhoanChuTruongModelSelect,
    total,
    page,
    limit,
    cond,
    setCondition,
    setPage,
    danhSachTaiKhoan,
    getTaiKhoanChuTruongModel,
  } = useModel('taikhoanhieutruong');
  const [dsTruong, setDSTruong] = useState([]);
  const [dsLop, setDSLop] = useState([]);
  const [dsTenLop, setDSTenLop] = useState([]);
  const [newRecord, setNewRecord] = useState<ITaiKhoanHieuTruong.Record>();
  const [dsAllLop, setDSALLLop] = useState([]);
  const [dsTruongFind, setDSTruongFind] = useState([]);
  const [dsRoles, setDSRoles] = useState([]);
  const [valueLop, setValueLop] = useState([]);

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
    getTaiKhoanChuTruongModelSelect();
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
  };

  const handleEdit = (record: ITaiKhoanHieuTruong.Record) => {
    setVisibleDrawer(true);
    setEdit(true);
    setNewRecord(record);
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
      const res = await delVaiTroChuTruong({ id: record?._id, truongId: props?.idTruong ?? '' });
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
          type="primary"
          shape="circle"
          onClick={() => {
            handleView(record);
          }}
          title="Xem chi tiết"
        >
          <EyeOutlined />
        </Button>

        {/*<Divider type="vertical" />*/}
        {/*<Button*/}
        {/*  type="primary"*/}
        {/*  shape="circle"*/}
        {/*  onClick={() => {*/}
        {/*    handleEdit(record);*/}
        {/*  }}*/}
        {/*  title="Chỉnh sửa"*/}
        {/*  disabled={!checkAllow('EDIT_TK_HIEU_TRUONG')}*/}
        {/*>*/}
        {/*  <EditOutlined />*/}
        {/*</Button>*/}

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
      render: (val) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              width={16}
              height={16}
              style={{ marginRight: '4px', color: 'green' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            {formatPhoneNumber(val)}
          </div>
        );
      },
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
    //       // moment().format('DD-MM-YYYY')
    //       'Không có'
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
  const handleAddTkHieuTruong = () => {
    setVisibleModalAddTk(true);
  };
  const onFinish = async (values: any) => {
    const res = await addChuTruong(values.id, props.newRecord._id, values.roles);
    if (res?.status === 200) {
      message.success('Thêm thành công');
      setVisibleModalAddTk(false);
      getTaiKhoanChuTruongModel(props?.idTruong || organizationId);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  const handleChangeTaiKhoan = (value: string) => {
    console.log(`selected ${value}`);
  };
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
          <Popconfirm
            title="Bạn đã có tài khoản chủ trường trước đó chưa?"
            onConfirm={() => {
              setEdit(false);
              setVisibleDrawer(true);
            }}
            onCancel={handleAddTkHieuTruong}
            okText="Chưa có"
            cancelText="Có rồi"
          >
            <Button
              style={{ marginBottom: '10px', marginRight: '10px' }}
              // onClick={() => {
              //   setEdit(false);
              //   setVisibleDrawer(true);
              // }}
              type="primary"
            >
              <PlusCircleFilled />
              Thêm mới
            </Button>
          </Popconfirm>
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
            if (dataRole?.systemRole !== 'HieuTruong') setDisableTruongLop(true);
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
              systemRole: recordRole?.systemRole,
              // organizationId: props?.idTruong ?? values.organizationId,
              roleId: values?.roleId,
              name: recordRole?.name,
              expireDate: moment(values.expireDate).toISOString(),
              listOrgIdAccess: values?.listOrgIdAccess,
              listTruongAccess: [props?.idTruong ?? values.organizationId],
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
                    placeholder="Chọn trường"
                    rules={[...rules.required]}
                    initialValue={edit ? newRecord?.roles?.[0]?.organizationId : undefined}
                    options={dsTruong?.map((item: { _id: string; tenDonVi: string }) => ({
                      value: `${item?._id}`,
                      label: `${item?.tenDonVi}`,
                    }))}
                  />
                </Col>
              )}
            </Row>
            {(newRecord || recordTruong || props?.idTruong || organizationId) && (
              <Col span={24}>
                <ProFormSelect
                  name="listOrgIdAccess"
                  label="Lớp"
                  placeholder="Chọn lớp"
                  fieldProps={{
                    value: valueLop,
                  }}
                  mode={!disableLop ? 'multiple' : 'single'}
                  initialValue={edit ? newRecord?.roles?.[0]?.listOrgIdAccess : undefined}
                  options={dsLop?.map((item: { _id: string; tenDonVi: string }) => ({
                    value: `${item?._id}`,
                    label: `${item?.tenDonVi}`,
                  }))}
                />
              </Col>
            )}
          </>
        )}

        <ProFormDatePicker
          name={['profile', 'dateOfBirth']}
          label="Ngày sinh"
          placeholder="Chọn ngày sinh"
          rules={[...rules.truocHomNay]}
          initialValue={edit ? moment(newRecord?.profile?.dateOfBirth) : undefined}
        />
        {newRecord?.roles?.[0]?.expireDate && !props?.idTruong && !organizationId && (
          <ProFormDatePicker
            name="expireDate"
            label="Ngày hết hạn"
            placeholder="Chọn ngày hết hạn"
            // rules={[...rules.required, ...rules.sauHomNay]}
            initialValue={
              newRecord?.roles?.[0]?.expireDate
                ? moment(new Date(newRecord?.roles?.[0]?.expireDate))
                : undefined
            }
          />
        )}
        {/*{(props?.idTruong || organizationId) && (*/}
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
                <Select value={recordTruong?.tenDonVi ?? 'Không có'} disabled />
              </Form.Item>
            </Col>
            {dsTenLop?.length > 0 && (
              <Col span={24}>
                <Form.Item label="Lớp" style={{ marginBottom: 0 }}>
                  <Select mode="multiple" value={dsTenLop} disabled />
                </Form.Item>
              </Col>
            )}
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
      <Modal
        title="Thêm tài khoản chủ trường"
        visible={visibleModalAddTk}
        onCancel={() => {
          setVisibleModalAddTk(false);
        }}
        width="50%"
        footer={
          <Button
            onClick={() => {
              setVisibleModalAddTk(false);
            }}
          >
            OK
          </Button>
        }
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item label="Tài khoản" name="id" rules={[...rules.required]}>
            <Select defaultValue="" style={{ width: 300 }} onChange={handleChangeTaiKhoan}>
              {danhSachTaiKhoan.map((value: { _id: string; username: string }, i) => {
                return (
                  <Select.Option value={value._id} key={i}>
                    {value.username}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>

          {/*<Form.Item label="Mật khẩu" name="password" rules={[...rules.required]}>*/}
          {/*  <Input.Password />*/}
          {/*</Form.Item>*/}
          {/*<Form.Item label="Chọn vai trò" name="roles" rules={[...rules.required]}>*/}
          {/*  <Select defaultValue="" style={{ width: 300 }} onChange={handleChange}>*/}
          {/*    {dsRoles.map((value: { _id: string; name: string }, i) => {*/}
          {/*      return (*/}
          {/*        <Select.Option value={value._id} key={i}>*/}
          {/*          {value.name}*/}
          {/*        </Select.Option>*/}
          {/*      );*/}
          {/*    })}*/}
          {/*  </Select>*/}
          {/*</Form.Item>*/}

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Thêm
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default TaiKhoanChuTruong;
