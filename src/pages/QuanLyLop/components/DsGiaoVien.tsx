/* eslint-disable no-underscore-dangle */
import { checkAllow } from '@/components/CheckAuthority';
import TableBase from '@/components/Table';
import type { GiaoVien as IGiaoVien } from '@/services/GiaoVien';
import type { TaiKhoanGiaoVien as ITaiKhoanGiaoVien } from '@/services/TaiKhoanGiaoVien';
import {
  chuyenLopGiaoVien,
  delGiaoVien,
  IDataReqChuyenLopGiaoVien,
  updTaiKhoanGiaoVien,
} from '@/services/TaiKhoanGiaoVien/taikhoangiaovien';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import rules from '@/utils/rules';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleFilled } from '@ant-design/icons';
import { DrawerForm, ProFormDatePicker, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import {
  Button,
  Col,
  DatePicker,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

export const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const DanhSachGiaoVien = (props: { id?: string; idParent?: string; soQuanLyToiDa: number }) => {
  const {
    loading: loadingGiaoVien,
    getDSGiaoVienModel,
    total,
    page,
    limit,
    cond,
  } = useModel('xemdsgiaovien');
  const [visible, setVisible] = useState<boolean>(false);
  const [visibleEdit, setVisibleEdit] = useState<boolean>(false);
  const [newRecord, setNewRecord] = useState<ITaiKhoanGiaoVien.Record>();
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [dsGiaoVien, setDSGiaoVien] = useState([]);
  const [recordGiaoVien, setRecordGiaoVien] = useState<IGiaoVien.Record>();
  const [form] = Form.useForm();
  const vaiTro = localStorage.getItem('vaiTro');
  const [edit, setEdit] = useState<boolean>(false);
  const [danhSachLop, setDanhSachLop] = useState([]);
  const [dsRoles, setDSRoles] = useState([]);
  const [danhSachRole, setDanhSachRole] = useState([]);
  const { initialState } = useModel('@@initialState');
  const truongId = initialState?.currentUser?.role?.organizationId;
  const getDSLop = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable/my/child?page=1&limit=100000`, {
      params: {
        cond: {
          loaiDonVi: 'Lop',
          parent: props?.idParent,
        },
      },
    });
    setDanhSachLop(result?.data?.data?.result);
  };
  const getRoles = async () => {
    const result = await axios.get(`${ip3}/roles/pageable?page=1&limit=100000`);
    setDSRoles(result?.data?.data?.result);
  };
  const getDSGiaoVien = async () => {
    const result = await axios.get(`${ip3}/user/pageable/organization/${props?.idParent}`, {
      params: {
        page,
        limit,
        systemRole: 'GiaoVien',
      },
    });
    setDSGiaoVien(result?.data?.data?.result);
  };

  React.useEffect(() => {
    getDSLop();
    getRoles();
    getDSGiaoVien();
  }, [props]);

  const handleView = (record: ITaiKhoanGiaoVien.Record) => {
    setNewRecord(record);
    setVisible(true);
  };

  const onCell = (record: ITaiKhoanGiaoVien.Record) => ({
    onClick: () => {
      handleView(record);
    },
    style: { cursor: 'pointer' },
  });

  const onChange = (val: string) => {
    setRecordGiaoVien(dsGiaoVien?.find((item: { _id: string }) => item?._id === val));
    const dataGiaoVien: any = dsGiaoVien?.find((item: { _id: string }) => item?._id === val);
    form.setFieldsValue({
      profile: {
        fullname: dataGiaoVien?.profile?.fullname,
        gender: dataGiaoVien?.profile?.gender,
        email: dataGiaoVien?.profile?.email,
        trinhDo: dataGiaoVien?.profile?.trinhDo,
        dateOfBirth: dataGiaoVien?.profile?.dateOfBirth
          ? moment(dataGiaoVien?.profile?.dateOfBirth)
          : moment(),
      },
      expireDate: dataGiaoVien?.expireDate ? moment(dataGiaoVien?.expireDate) : moment(),
    });
  };

  const onFinish = async (value: { userId?: string }) => {
    if (total === props?.soQuanLyToiDa) {
      message.error('Chuyển lớp không thành công do số lượng giáo viên quản lý trong lớp đã đủ');
      return false;
    }
    try {
      const result = await axios.put(`${ip3}/user/giaoVien/${value?.userId}/lop/${props?.id}`);
      if (result?.status === 200) {
        message.success('Chuyển lớp thành công');
        getDSGiaoVienModel(props?.id);
        setVisibleDrawer(false);
        return true;
      }
    } catch (error) {
      message.error('Chuyển lớp không thành công');
      return false;
    }
    return true;
  };

  const handleEdit = (record: ITaiKhoanGiaoVien.Record) => {
    // ;
    const newData: any = record;
    setDanhSachRole(newData?.roles);
    setVisibleEdit(true);
    setEdit(true);
    const newArrRoles: any = [];
    record?.roles?.map((item) =>
      item?.organizationId === props?.id ? newArrRoles.push(item) : undefined,
    );
    newData.roles = newArrRoles;
    setNewRecord(newData);
  };
  const handleDel = async (record: ITaiKhoanGiaoVien.Record) => {
    const res = await delGiaoVien({ userId: record?._id, donViId: props?.id });
    if (res?.status === 200) {
      message.success('Xóa thành công');
      getDSGiaoVienModel(props?.id);
      return true;
    }
    message.error('Đã xảy ra lỗi');
    return false;
  };

  const renderLast = (record: ITaiKhoanGiaoVien.Record) => {
    return (
      <React.Fragment>
        <Button type="default" shape="circle" title="Xem thêm" onClick={() => handleView(record)}>
          <EyeOutlined />
        </Button>
        <Divider type="vertical" />

        <Button
          type="primary"
          shape="circle"
          disabled={!checkAllow('EDIT_GIAO_VIEN')}
          onClick={() => {
            handleEdit(record);
          }}
          title="Chỉnh sửa"
        >
          <EditOutlined />
        </Button>

        <Divider type="vertical" />

        <Popconfirm
          disabled={!checkAllow('DEL_GIAO_VIEN')}
          title="Thao tác này sẽ xóa giáo viên ra khỏi lớp. Bạn sẽ không thực hiện được thao tác chuyển lớp nữa"
          onConfirm={() => handleDel(record)}
          okText="Đồng ý"
        >
          <Button type="default" shape="circle" title="Xóa" disabled={!checkAllow('DEL_GIAO_VIEN')}>
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      </React.Fragment>
    );
  };

  const columns: IColumn<ITaiKhoanGiaoVien.Record>[] = [
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
      title: 'Email',
      dataIndex: 'profile',
      align: 'center',
      width: 200,
      render: (val) => val?.email ?? 'Chưa cập nhật',
      onCell,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'profile',
      align: 'center',
      width: 200,
      render: (val) => moment(val?.dateOfBirth).format('DD-MM-YYYY') ?? 'Chưa cập nhật',
      onCell,
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: ITaiKhoanGiaoVien.Record) => renderLast(record),
      fixed: 'right',
      width: 170,
    },
  ];

  useEffect(() => {}, []);
  const handleSubmitForm = async (values: any) => {
    const newVal = values;
    const id = newRecord?._id;
    const recordRole: any = dsRoles?.find((item: { _id: string }) => item?._id === newVal?.roleId);
    const newArrRole = [];

    danhSachRole?.map(
      (item: { organizationId: string }) =>
        item?.organizationId !== props?.id && newArrRole.push(item),
    );
    // update vai trò vào mảng vai trò ban đầu
    newArrRole?.push({
      systemRole: recordRole?.systemRole,
      organizationId:
        recordRole?.systemRole === 'GiaoVien' || recordRole?.systemRole === 'PhuHuynh'
          ? newVal.organizationId
          : undefined,
      roleId: newVal?.roleId,
      expireDate: moment(newVal?.expireDate).format(),
      name: recordRole?.name,
    });
    newVal.roles = newArrRole;
    // delete newVal?.roleId;
    // delete newVal?.expireDate;
    // delete newVal?.organizationId;
    const dataReq: IDataReqChuyenLopGiaoVien = {
      userId: newVal.userId,
      donViIdFrom: newRecord?.roles[0].organizationId,
      donViIdTo: newVal.organizationId,
    };
    // const res = await chuyenLopGiaoVien(dataReq, truongId);
    // if (res?.data?.statusCode === 200) {
    //   message.success('Cập nhật thành công');
    //   getDSGiaoVienModel(props?.id);
    //   setVisibleEdit(false);
    //   return true;
    // }
    // message.error('Đã xảy ra lỗi');
    return false;
  };
  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={() => getDSGiaoVienModel(props?.id)}
        loading={loadingGiaoVien}
        modelName="xemdsgiaovien"
        dependencies={[page, limit, cond]}
        scroll={{ x: 1000 }}
      >
        {checkAllow('ADD_GIAO_VIEN') && (
          <Button
            style={{ marginBottom: '10px' }}
            onClick={() => {
              setVisibleDrawer(true);
            }}
            type="primary"
          >
            <PlusCircleFilled />
            Thêm mới
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
      <DrawerForm<IGiaoVien.Record>
        visible={visibleEdit}
        onVisibleChange={setVisibleEdit}
        title={edit ? 'Chỉnh sửa' : 'Thêm mới'}
        drawerProps={{
          forceRender: false,
          destroyOnClose: true,
        }}
        onFinish={async (values: any) => {
          const newVal = values;
          const id = newRecord?._id;
          const recordRole: any = dsRoles?.find(
            (item: { _id: string }) => item?._id === newVal?.roleId,
          );
          const newArrRole = [];

          danhSachRole?.map(
            (item: { organizationId: string }) =>
              item?.organizationId !== props?.id && newArrRole.push(item),
          );
          // update vai trò vào mảng vai trò ban đầu
          newArrRole?.push({
            systemRole: recordRole?.systemRole,
            organizationId:
              recordRole?.systemRole === 'GiaoVien' || recordRole?.systemRole === 'PhuHuynh'
                ? newVal.organizationId
                : undefined,
            roleId: newVal?.roleId,
            expireDate: moment(newVal?.expireDate).format(),
            name: recordRole?.name,
          });
          newVal.roles = newArrRole;
          // delete newVal?.roleId;
          // delete newVal?.expireDate;
          // delete newVal?.organizationId;
          const dataReq: IDataReqChuyenLopGiaoVien = {
            userId: newRecord?._id ? newRecord?._id : '',
            donViIdFrom: newRecord?.roles[0].organizationId,
            donViIdTo: newVal.organizationId,
          };
          const res = await chuyenLopGiaoVien(dataReq);
          if (res?.data?.statusCode === 200) {
            message.success('Cập nhật thành công');
            getDSGiaoVienModel(props?.id);
            setVisibleEdit(false);
            return true;
          }
          message.error('Đã xảy ra lỗi');
          return false;
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
                  setVisibleEdit(false);
                }}
              >
                Quay lại
              </Button>,
            ];
          },
        }}
        initialValues={{
          ...newRecord,
        }}
      >
        {newRecord && (
          <div key={newRecord}>
            <Row gutter={[16, 0]}>
              <Col span={12}>
                <ProFormText
                  name={['profile', 'fullname']}
                  label="Họ và tên"
                  initialValue={newRecord.profile.fullname}
                  placeholder="Nhập họ và tên"
                  rules={[...rules.required]}
                  disabled
                />
              </Col>
              <Col span={12}>
                <ProFormText
                  name={['profile', 'phoneNumber']}
                  label="Số điện thoại"
                  initialValue={newRecord.profile.phoneNumber}
                  placeholder="Nhập số điện thoại"
                  disabled
                  rules={[...rules.required]}
                />
              </Col>
            </Row>
            <Row gutter={[16, 0]}>
              <Col span={12}>
                <ProFormText
                  name={['profile', 'phoneNumber']}
                  label="Tài khoản"
                  initialValue={newRecord.profile.phoneNumber}
                  placeholder="Nhập tài khoản"
                  disabled
                  rules={[...rules.required]}
                />
              </Col>
              <Col span={12}>
                <ProFormSelect
                  name={['profile', 'trinhDo']}
                  label="Trình độ"
                  initialValue={newRecord.profile.trinhDo}
                  placeholder="Chọn trình độ"
                  disabled
                  options={[
                    {
                      value: 'Cao học',
                      label: 'Cao học',
                    },
                    {
                      value: 'Đại học',
                      label: 'Đại học',
                    },
                    {
                      value: 'Cao đẳng',
                      label: 'Cao đẳng',
                    },
                    {
                      value: 'Trung cấp',
                      label: 'Trung cấp',
                    },
                  ]}
                />
              </Col>
            </Row>
            <Row gutter={[16, 0]}>
              <Col span={12}>
                <ProFormSelect
                  name={['profile', 'gender']}
                  initialValue={newRecord.profile.gender}
                  label="Giới tính"
                  placeholder="Chọn giới tính"
                  disabled
                  options={[
                    {
                      value: 'Male',
                      label: 'Nam',
                    },
                    {
                      value: 'Female',
                      label: 'Nữ',
                    },
                  ]}
                />
              </Col>
              <Col span={12}>
                <ProFormText
                  name={['profile', 'email']}
                  label="Email"
                  placeholder="Nhập email"
                  disabled
                />
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
                  disabled
                  options={dsRoles?.map((item: { _id: string; name: string }) => ({
                    // eslint-disable-next-line no-underscore-dangle
                    value: `${item?._id}`,
                    label: `${item?.name}`,
                  }))}
                />
              </Col>
              <Col span={12}>
                <ProFormSelect
                  name="organizationId"
                  label="Lớp"
                  placeholder="Chọn lớp"
                  disabled={
                    edit && vaiTro !== 'SuperAdmin' && vaiTro !== 'Admin' && vaiTro !== 'HieuTruong'
                  }
                  initialValue={edit ? newRecord?.roles?.[0]?.organizationId : undefined}
                  options={danhSachLop?.map((item: any) => ({
                    value: `${item?._id}`,
                    label: `${item?.tenDonVi}`,
                  }))}
                />
              </Col>
            </Row>

            <ProFormDatePicker
              name={['profile', 'dateOfBirth']}
              label="Ngày sinh"
              placeholder="Chọn ngày sinh"
              disabled
              initialValue={edit ? moment(newRecord?.profile?.dateOfBirth) : moment()}
            />

            <ProFormDatePicker
              name="expireDate"
              label="Ngày hết hạn"
              placeholder="Chọn ngày hết hạn"
              // rules={[...rules.required]}
              disabled
              initialValue={
                edit
                  ? newRecord?.roles.filter((item) => item?.systemRole === 'GiaoVien')?.[0]
                      .expireDate
                    ? moment(
                        newRecord?.roles.filter((item) => item?.systemRole === 'GiaoVien')?.[0]
                          .expireDate,
                      )
                    : undefined
                  : undefined
              }
            />

            {edit && <div style={{ width: '100%' }} />}
          </div>
        )}
      </DrawerForm>

      <Modal
        title="Thêm mới giáo viên"
        visible={visibleDrawer}
        destroyOnClose
        width="40%"
        footer={[]}
        onCancel={() => {
          setVisibleDrawer(false);
          setRecordGiaoVien(undefined);
        }}
      >
        <Form onFinish={onFinish} {...formItemLayout} form={form}>
          <Form.Item
            name="userId"
            label="Giáo viên"
            style={{ marginBottom: '5px' }}
            rules={[...rules.required]}
          >
            <Select
              showSearch
              allowClear
              style={{ width: '100%' }}
              placeholder="Tìm giáo viên theo tên"
              optionFilterProp="children"
              notFoundContent="Không có giáo viên nào"
              onChange={onChange}
              filterOption={(input, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {dsGiaoVien?.map(
                (item: { _id: string; profile: { fullname: string; phoneNumber: string } }) => (
                  <Select.Option
                    value={item?._id}
                  >{`${item?.profile?.fullname} - ${item?.profile?.phoneNumber}`}</Select.Option>
                ),
              )}
            </Select>
          </Form.Item>
          {recordGiaoVien && (
            <>
              <Divider />
              <div style={{ fontWeight: 600, marginBottom: '5px', fontSize: '16px' }}>
                Thông tin giáo viên
              </div>
              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <Form.Item
                    name={['profile', 'fullname']}
                    label="Họ và tên"
                    rules={[...rules.required]}
                    initialValue={recordGiaoVien?.profile?.fullname}
                    style={{ marginBottom: '5px' }}
                  >
                    <Input placeholder="Nhập họ và tên" disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={['profile', 'gender']}
                    label="Giới tính"
                    initialValue={recordGiaoVien?.profile?.gender}
                    style={{ marginBottom: '5px' }}
                  >
                    <Select placeholder="Chọn giới tính" disabled>
                      <Select.Option value="Male">Nam</Select.Option>
                      <Select.Option value="Female">Nữ</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <Form.Item
                    name={['profile', 'email']}
                    label="Email"
                    initialValue={recordGiaoVien?.profile?.email}
                    style={{ marginBottom: '5px' }}
                  >
                    <Input placeholder="Nhập email" disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={['profile', 'trinhDo']}
                    label="Trình độ"
                    initialValue={recordGiaoVien?.profile?.trinhDo}
                    style={{ marginBottom: '5px' }}
                  >
                    <Select placeholder="Chọn trình độ" disabled>
                      <Select.Option value="Cao học">Cao học</Select.Option>
                      <Select.Option value="Đại học">Đại học</Select.Option>
                      <Select.Option value="Cao đẳng">Cao đẳng</Select.Option>
                      <Select.Option value="Trung cấp">Trung cấp</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Col span={24}>
                <Form.Item
                  name={['profile', 'dateOfBirth']}
                  label="Ngày sinh"
                  rules={[...rules.truocHomNay]}
                  initialValue={moment(recordGiaoVien?.profile?.dateOfBirth) ?? moment()}
                  style={{ marginBottom: '5px' }}
                >
                  <DatePicker placeholder="Chọn ngày sinh" format="DD-MM-YYYY" disabled />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="expireDate"
                  label="Ngày hết hạn"
                  // rules={[...rules.required, ...rules.sauHomNay]}
                  initialValue={
                    () => {
                      let expireDate = recordGiaoVien?.roles.filter(
                        (item) => item?.systemRole === 'GiaoVien',
                      )?.[0]?.expireDate;
                      if (expireDate) return moment(new Date(expireDate));
                      return undefined;
                    }
                    // recordGiaoVien?.expireDate ? moment(recordGiaoVien?.expireDate) : undefined
                  }
                  style={{ marginBottom: '5px' }}
                >
                  <DatePicker placeholder="Chọn ngày hết hạn" format="DD-MM-YYYY" disabled />
                </Form.Item>
              </Col>
              <Divider />
              <Row justify="center">
                <Button
                  type="default"
                  onClick={() => setVisibleDrawer(false)}
                  style={{ marginRight: '10px' }}
                >
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit">
                  Xác nhận
                </Button>
              </Row>
            </>
          )}
        </Form>
      </Modal>
      <Modal
        title="Thông tin giáo viên"
        visible={visible}
        width="60%"
        footer={
          <Button
            type="primary"
            onClick={() => {
              setVisible(false);
            }}
          >
            Ok
          </Button>
        }
        onCancel={() => {
          setVisible(false);
        }}
      >
        <Descriptions bordered>
          <Descriptions.Item label="Họ và tên">
            {newRecord?.profile?.fullname ?? 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label="Giới tính">
            {newRecord?.profile?.gender === 'Male' ? 'Nam' : 'Nữ'}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {newRecord?.profile?.phoneNumber ?? 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {newRecord?.profile?.email ?? 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {moment(newRecord?.profile?.dateOfBirth).format('DD-MM-YYYY') ?? moment()}
          </Descriptions.Item>
          <Descriptions.Item label="Trình độ">
            {newRecord?.profile?.trinhDo ?? 'Chưa cập nhật'}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};

export default DanhSachGiaoVien;
