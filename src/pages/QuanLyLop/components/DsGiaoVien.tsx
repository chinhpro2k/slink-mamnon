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
      message.error('Chuy???n l???p kh??ng th??nh c??ng do s??? l?????ng gi??o vi??n qu???n l?? trong l???p ???? ?????');
      return false;
    }
    try {
      const result = await axios.put(`${ip3}/user/giaoVien/${value?.userId}/lop/${props?.id}`);
      if (result?.status === 200) {
        message.success('Chuy???n l???p th??nh c??ng');
        getDSGiaoVienModel(props?.id);
        setVisibleDrawer(false);
        return true;
      }
    } catch (error) {
      message.error('Chuy???n l???p kh??ng th??nh c??ng');
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
      message.success('X??a th??nh c??ng');
      getDSGiaoVienModel(props?.id);
      return true;
    }
    message.error('???? x???y ra l???i');
    return false;
  };

  const renderLast = (record: ITaiKhoanGiaoVien.Record) => {
    return (
      <React.Fragment>
        <Button type="default" shape="circle" title="Xem th??m" onClick={() => handleView(record)}>
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
          title="Ch???nh??s???a"
        >
          <EditOutlined />
        </Button>

        <Divider type="vertical" />

        <Popconfirm
          disabled={!checkAllow('DEL_GIAO_VIEN')}
          title="Thao t??c n??y s??? x??a gi??o vi??n ra kh???i l???p. B???n s??? kh??ng th???c hi???n ???????c thao t??c chuy???n l???p n???a"
          onConfirm={() => handleDel(record)}
          okText="?????ng ??"
        >
          <Button type="default" shape="circle" title="X??a" disabled={!checkAllow('DEL_GIAO_VIEN')}>
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
      title: 'H??? v?? t??n',
      dataIndex: 'fullname',
      align: 'center',
      width: 200,
      onCell,
      render: (val, value) => <div>{value?.profile?.fullname}</div>,
      search: 'search',
    },
    {
      title: 'S??? ??i???n tho???i',
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
      render: (val) => val?.email ?? 'Ch??a c???p nh???t',
      onCell,
    },
    {
      title: 'Ng??y sinh',
      dataIndex: 'profile',
      align: 'center',
      width: 200,
      render: (val) => moment(val?.dateOfBirth).format('DD-MM-YYYY') ?? 'Ch??a c???p nh???t',
      onCell,
    },
    {
      title: 'Thao t??c',
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
    // update vai tr?? v??o m???ng vai tr?? ban ?????u
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
    //   message.success('C???p nh???t th??nh c??ng');
    //   getDSGiaoVienModel(props?.id);
    //   setVisibleEdit(false);
    //   return true;
    // }
    // message.error('???? x???y ra l???i');
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
            Th??m m???i
          </Button>
        )}

        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          T???ng s???:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={total}
          />
        </h3>
      </TableBase>
      <DrawerForm<IGiaoVien.Record>
        visible={visibleEdit}
        onVisibleChange={setVisibleEdit}
        title={edit ? 'Ch???nh s???a' : 'Th??m m???i'}
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
          // update vai tr?? v??o m???ng vai tr?? ban ?????u
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
            message.success('C???p nh???t th??nh c??ng');
            getDSGiaoVienModel(props?.id);
            setVisibleEdit(false);
            return true;
          }
          message.error('???? x???y ra l???i');
          return false;
        }}
        submitter={{
          render: (newProps) => {
            // DefaultDom c?? th??? d??ng ho???c kh??ng

            return [
              // ...defaultDoms,
              <Button
                key="submit"
                onClick={() => {
                  newProps.submit();
                }}
                type="primary"
              >
                L??u
              </Button>,
              <Button
                key="cancel"
                onClick={() => {
                  setVisibleEdit(false);
                }}
              >
                Quay l???i
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
                  label="H??? v?? t??n"
                  initialValue={newRecord.profile.fullname}
                  placeholder="Nh???p h??? v?? t??n"
                  rules={[...rules.required]}
                  disabled
                />
              </Col>
              <Col span={12}>
                <ProFormText
                  name={['profile', 'phoneNumber']}
                  label="S??? ??i???n tho???i"
                  initialValue={newRecord.profile.phoneNumber}
                  placeholder="Nh???p s??? ??i???n tho???i"
                  disabled
                  rules={[...rules.required]}
                />
              </Col>
            </Row>
            <Row gutter={[16, 0]}>
              <Col span={12}>
                <ProFormText
                  name={['profile', 'phoneNumber']}
                  label="T??i kho???n"
                  initialValue={newRecord.profile.phoneNumber}
                  placeholder="Nh???p t??i kho???n"
                  disabled
                  rules={[...rules.required]}
                />
              </Col>
              <Col span={12}>
                <ProFormSelect
                  name={['profile', 'trinhDo']}
                  label="Tr??nh ?????"
                  initialValue={newRecord.profile.trinhDo}
                  placeholder="Ch???n tr??nh ?????"
                  disabled
                  options={[
                    {
                      value: 'Cao h???c',
                      label: 'Cao h???c',
                    },
                    {
                      value: '?????i h???c',
                      label: '?????i h???c',
                    },
                    {
                      value: 'Cao ?????ng',
                      label: 'Cao ?????ng',
                    },
                    {
                      value: 'Trung c???p',
                      label: 'Trung c???p',
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
                  label="Gi???i t??nh"
                  placeholder="Ch???n gi???i t??nh"
                  disabled
                  options={[
                    {
                      value: 'Male',
                      label: 'Nam',
                    },
                    {
                      value: 'Female',
                      label: 'N???',
                    },
                  ]}
                />
              </Col>
              <Col span={12}>
                <ProFormText
                  name={['profile', 'email']}
                  label="Email"
                  placeholder="Nh???p email"
                  disabled
                />
              </Col>
            </Row>
            <Row gutter={[16, 0]}>
              <Col span={12}>
                <ProFormSelect
                  name="roleId"
                  label="Vai tr??"
                  placeholder="Ch???n vai tr??"
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
                  label="L???p"
                  placeholder="Ch???n l???p"
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
              label="Ng??y sinh"
              placeholder="Ch???n ng??y sinh"
              disabled
              initialValue={edit ? moment(newRecord?.profile?.dateOfBirth) : moment()}
            />

            <ProFormDatePicker
              name="expireDate"
              label="Ng??y h???t h???n"
              placeholder="Ch???n ng??y h???t h???n"
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
        title="Th??m m???i gi??o vi??n"
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
            label="Gi??o vi??n"
            style={{ marginBottom: '5px' }}
            rules={[...rules.required]}
          >
            <Select
              showSearch
              allowClear
              style={{ width: '100%' }}
              placeholder="T??m gi??o vi??n theo t??n"
              optionFilterProp="children"
              notFoundContent="Kh??ng c?? gi??o vi??n n??o"
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
                Th??ng tin gi??o vi??n
              </div>
              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <Form.Item
                    name={['profile', 'fullname']}
                    label="H??? v?? t??n"
                    rules={[...rules.required]}
                    initialValue={recordGiaoVien?.profile?.fullname}
                    style={{ marginBottom: '5px' }}
                  >
                    <Input placeholder="Nh???p h??? v?? t??n" disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={['profile', 'gender']}
                    label="Gi???i t??nh"
                    initialValue={recordGiaoVien?.profile?.gender}
                    style={{ marginBottom: '5px' }}
                  >
                    <Select placeholder="Ch???n gi???i t??nh" disabled>
                      <Select.Option value="Male">Nam</Select.Option>
                      <Select.Option value="Female">N???</Select.Option>
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
                    <Input placeholder="Nh???p email" disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={['profile', 'trinhDo']}
                    label="Tr??nh ?????"
                    initialValue={recordGiaoVien?.profile?.trinhDo}
                    style={{ marginBottom: '5px' }}
                  >
                    <Select placeholder="Ch???n tr??nh ?????" disabled>
                      <Select.Option value="Cao h???c">Cao h???c</Select.Option>
                      <Select.Option value="?????i h???c">?????i h???c</Select.Option>
                      <Select.Option value="Cao ?????ng">Cao ?????ng</Select.Option>
                      <Select.Option value="Trung c???p">Trung c???p</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Col span={24}>
                <Form.Item
                  name={['profile', 'dateOfBirth']}
                  label="Ng??y sinh"
                  rules={[...rules.truocHomNay]}
                  initialValue={moment(recordGiaoVien?.profile?.dateOfBirth) ?? moment()}
                  style={{ marginBottom: '5px' }}
                >
                  <DatePicker placeholder="Ch???n ng??y sinh" format="DD-MM-YYYY" disabled />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="expireDate"
                  label="Ng??y h???t h???n"
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
                  <DatePicker placeholder="Ch???n ng??y h???t h???n" format="DD-MM-YYYY" disabled />
                </Form.Item>
              </Col>
              <Divider />
              <Row justify="center">
                <Button
                  type="default"
                  onClick={() => setVisibleDrawer(false)}
                  style={{ marginRight: '10px' }}
                >
                  H???y
                </Button>
                <Button type="primary" htmlType="submit">
                  X??c nh???n
                </Button>
              </Row>
            </>
          )}
        </Form>
      </Modal>
      <Modal
        title="Th??ng tin gi??o vi??n"
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
          <Descriptions.Item label="H??? v?? t??n">
            {newRecord?.profile?.fullname ?? 'Ch??a c???p nh???t'}
          </Descriptions.Item>
          <Descriptions.Item label="Gi???i t??nh">
            {newRecord?.profile?.gender === 'Male' ? 'Nam' : 'N???'}
          </Descriptions.Item>
          <Descriptions.Item label="S??? ??i???n tho???i">
            {newRecord?.profile?.phoneNumber ?? 'Ch??a c???p nh???t'}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {newRecord?.profile?.email ?? 'Ch??a c???p nh???t'}
          </Descriptions.Item>
          <Descriptions.Item label="Ng??y sinh">
            {moment(newRecord?.profile?.dateOfBirth).format('DD-MM-YYYY') ?? moment()}
          </Descriptions.Item>
          <Descriptions.Item label="Tr??nh ?????">
            {newRecord?.profile?.trinhDo ?? 'Ch??a c???p nh???t'}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};

export default DanhSachGiaoVien;
