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
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select, Tag,
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';

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
    getTaiKhoanHieuTruongModel,
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

  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const vaiTro = localStorage.getItem('vaiTro');

  const getTruong = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=100`, {
      params: { cond: { loaiDonVi: 'Truong' } },
    });
    setDSTruong(result?.data?.data?.result);
    const arrSelectTruong: any = [];
    arrSelectTruong.push({ tenDonVi: 'T???t c??? c??c tr?????ng', _id: 'T???t c???' });
    arrSelectTruong.push(...result?.data?.data?.result);
    setDSTruongFind(arrSelectTruong);
  };

  const getRoles = async () => {
    const result = await axios.get(`${ip3}/roles/pageable?page=1&limit=100`);
    const arrRoles: any = [];
    result?.data?.data?.result?.map(
      (item: { systemRole: string }) => item?.systemRole === 'HieuTruong' && arrRoles.push(item),
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
      arrLop.push({ tenDonVi: 'T???t c??? c??c l???p', _id: ['*'] });
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
      arrTenLop.push('T???t c??? c??c l???p');
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
    arrLop.push({ tenDonVi: 'T???t c??? c??c l???p', _id: ['*'] });
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
        message.success('X??a th??nh c??ng');
        getTaiKhoanHieuTruongModel(props?.idTruong || organizationId);
        return true;
      }
      message.error('???? x???y ra l???i');
      return false;
    }
    message.error('B???n kh??ng ???????c ph??p x??a t??i kho???n n??y!');
    return false;
  };

  const handleResetPass = async (record: ITaiKhoanHieuTruong.Record) => {
    try {
      const res = await resetPass({ id: record?._id });
      if (res?.status === 200) {
        message.success('?????t l???i m???t kh???u th??nh c??ng');
        return true;
      }
    } catch (error) {
      const { response }: any = error;
      if (response?.data?.errorDescription === 'Forbidden resource') {
        message.error('Kh??ng ???????c ph??p ?????t l???i m???t kh???u');
        return false;
      }
      message.error('???? x???y ra l???i');
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
          title="Xem chi ti???t"
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
          title="Ch???nh??s???a"
          disabled={!checkAllow('EDIT_TK_HIEU_TRUONG')}
        >
          <EditOutlined />
        </Button>

        <Divider type="vertical" />

        <Popconfirm
          title="B???n??c????ch???c??mu???n??x??a?"
          onConfirm={() => handleDel(record)}
          disabled={!checkAllow('DEL_TK_HIEU_TRUONG')}
        >
          <Button
            type="default"
            shape="circle"
            title="X??a"
            disabled={!checkAllow('DEL_TK_HIEU_TRUONG')}
          >
            <DeleteOutlined />
          </Button>
        </Popconfirm>

        {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
          <>
            <Divider type="vertical" />

            <Popconfirm
              title="B???n??c????ch???c??mu???n???????t l???i m???t kh???u?"
              onConfirm={() => handleResetPass(record)}
              disabled={!checkAllow('RESET_TK_HIEU_TRUONG')}
            >
              <Button
                type="primary"
                shape="circle"
                title="?????t l???i m???t kh???u"
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

  const columns: IColumn<ITaiKhoanHieuTruong.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'H??? v?? t??n',
      dataIndex: ['profile', 'fullname'],
      align: 'center',
      width: 200,
      onCell,
      search: 'search',
    },
    {
      title: 'S??? ??i???n tho???i',
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
      title: 'T??i kho???n',
      dataIndex: 'profile',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => <div>{val?.username}</div>,
    },
    {
      title: 'Tr?????ng',
      dataIndex: 'roles',
      align: 'center',
      width: 200,
      onCell,
      // render: (val) => (val?.[0] ? val?.[0]?.organization?.tenDonVi : 'Kh??ng c??'),
      render: (val) => (
        <>
          {val?.map(tag => {
            let color = tag?.organization?.tenDonVi.length > 5 ? 'geekblue' : 'green';

            return (
              <Tag color={color} key={tag}>
                {tag?.organization?.tenDonVi?.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Ng??y h???t h???n',
      dataIndex: 'expireDate',
      align: 'center',
      width: 150,
      onCell,
      render: (val, record) =>
        record?.roles?.[0]?.expireDate ? (
          <div>{moment(record?.roles?.[0]?.expireDate).format('DD/MM/YYYY')}</div>
        ) : (
          moment().format('DD-MM-YYYY')
        ),
    },
  ];

  if (!props?.disable) {
    columns.push({
      title: 'Thao t??c',
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
        getData={() => getTaiKhoanHieuTruongModel(props?.idTruong || organizationId)}
        dependencies={[page, limit, cond]}
        loading={loadingTaiKhoanHieuTruong}
        modelName="taikhoanhieutruong"
        title={props?.idTruong ? '' : 'Qu???n l?? t??i kho???n hi???u tr?????ng'}
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
            Th??m m???i
          </Button>
        )}
        {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && !props?.idTruong && (
          <>
            <Select
              showSearch
              defaultValue="T???t c???"
              style={{ width: '20%', marginLeft: '10px' }}
              placeholder="Ch???n ????n v???"
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
          T???ng s???:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={total}
          />
        </h3>
      </TableBase>
      <DrawerForm<ITaiKhoanHieuTruong.Record>
        visible={visibleDrawer}
        onVisibleChange={setVisibleDrawer}
        title={edit ? 'Ch???nh s???a' : 'Th??m m???i'}
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
            arrLop.push({ tenDonVi: 'T???t c??? c??c l???p', _id: ['*'] });
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
              systemRole: props?.idTruong ? 'HieuTruong' : recordRole?.systemRole,
              organizationId: props?.idTruong ?? values.organizationId,
              roleId: values?.roleId,
              name: recordRole?.name,
              expireDate: props?.expireDate
                ? moment(props?.expireDate).toISOString()
                : moment(edit ? values.expireDate : dataTruong?.expireDate).toISOString(),
              listOrgIdAccess: values?.listOrgIdAccess,
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
            //     message.success('C???p nh???t th??nh c??ng');
            //     getTaiKhoanHieuTruongModel(props?.idTruong ?? organizationId);
            //     return true;
            //   }
            //   message.error('???? x???y ra l???i');
            //   return false;
            // }
            const res = await updTaiKhoanHieuTruong({ ...values, id });
            if (res?.data?.statusCode === 200) {
              message.success('C???p nh???t th??nh c??ng');
              setRecordTruong(undefined);
              getTaiKhoanHieuTruongModel(props?.idTruong ?? organizationId);
              return true;
            }
            message.error('???? x???y ra l???i');
            return false;
          }
          try {
            const res = await addTaiKhoanHieuTruong({ ...values });
            if (res?.data?.statusCode === 201) {
              message.success('Th??m m???i th??nh c??ng');
              setstate(state + 1);
              setRecordTruong(undefined);
              getTaiKhoanHieuTruongModel(props?.idTruong ?? organizationId);
              return true;
            }
          } catch (error) {
            message.error('S??? ??i???n tho???i ho???c t??n t??i kho???n ???? ???????c s??? d???ng!');
            return false;
          }
          return false;
          //
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
                  setVisibleDrawer(false);
                  setRecordTruong(undefined);
                  setNewRecord(undefined);
                  setDisableTruongLop(false);
                  setValueLop([]);
                }}
              >
                Quay l???i
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
              label="H??? v?? t??n"
              placeholder="Nh???p h??? v?? t??n"
              rules={[...rules.required]}
              initialValue={edit ? newRecord?.profile?.fullname : undefined}
            />
          </Col>
          <Col span={12}>
            <ProFormText
              name={['profile', 'phoneNumber']}
              label="S??? ??i???n tho???i"
              placeholder="Nh???p s??? ??i???n tho???i"
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
              label="T??i kho???n"
              placeholder="Nh???p t??i kho???n"
              rules={[...rules.required]}
              disabled={edit}
              initialValue={edit ? newRecord?.username : undefined}
            />
          </Col>
          <Col span={12}>
            {!edit && (
              <ProFormText.Password
                name="password"
                label="M???t kh???u"
                placeholder="Nh???p m???t kh???u"
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
              label="Vai tr??"
              disabled={edit}
              placeholder="Ch???n vai tr??"
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
              placeholder="Nh???p email"
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
                    label="Tr?????ng"
                    placeholder="Ch???n tr?????ng"
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
                  label="L???p"
                  placeholder="Ch???n l???p"
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
          label="Ng??y sinh"
          placeholder="Ch???n ng??y sinh"
          rules={[...rules.truocHomNay]}
          initialValue={edit ? moment(newRecord?.profile?.dateOfBirth) : undefined}
        />
        {newRecord?.roles?.[0]?.expireDate && !props?.idTruong && !organizationId && (
          <ProFormDatePicker
            name="expireDate"
            label="Ng??y h???t h???n"
            placeholder="Ch???n ng??y h???t h???n"
            // rules={[...rules.required, ...rules.sauHomNay]}
            initialValue={
              newRecord?.roles?.[0]?.expireDate
                ? moment(new Date(newRecord?.roles?.[0]?.expireDate))
                : undefined
            }
          />
        )}
        {(props?.idTruong || organizationId) && edit && (
          <ProFormDatePicker
            name="expireDate"
            label="Ng??y h???t h???n"
            placeholder="Ch???n ng??y h???t h???n"
            rules={[...rules.required, ...rules.sauHomNay]}
            initialValue={
              newRecord?.roles?.[0]?.expireDate ?? props?.expireDate
                ? moment(new Date(newRecord?.roles?.[0]?.expireDate ?? props?.expireDate))
                : undefined
            }
            disabled
          />
        )}

        {edit && <div style={{ width: '100%' }} />}
      </DrawerForm>
      <Modal
        title="Chi ti???t t??i kho???n"
        visible={visibleModal}
        onCancel={handleOk}
        width="50%"
        footer={<Button onClick={handleOk}>OK</Button>}
      >
        <Form labelAlign="left" {...formItemLayout}>
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item label="H??? v?? t??n" style={{ marginBottom: 0 }} required>
                <Input value={newRecord?.profile?.fullname} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="T??i kho???n" style={{ marginBottom: 0 }} required>
                <Input value={newRecord?.username} disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item label="S??? ??i???n tho???i" style={{ marginBottom: 0 }} required>
                <Input value={newRecord?.profile?.phoneNumber} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Email" style={{ marginBottom: 0 }}>
                <Input value={newRecord?.profile?.email ?? 'Ch??a c???p nh???t'} disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item label="Vai tr??" style={{ marginBottom: 0 }} required>
                <Select value={role?.name ?? 'Kh??ng c??'} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tr?????ng" style={{ marginBottom: 0 }} required>
                <Select value={recordTruong?.tenDonVi ?? 'Kh??ng c??'} disabled />
              </Form.Item>
            </Col>
            {dsTenLop?.length > 0 && (
              <Col span={24}>
                <Form.Item label="L???p" style={{ marginBottom: 0 }}>
                  <Select mode="multiple" value={dsTenLop} disabled />
                </Form.Item>
              </Col>
            )}
          </Row>
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item label="Ng??y sinh" style={{ marginBottom: 0 }}>
                <DatePicker
                  style={{ width: '100%' }}
                  value={moment(newRecord?.profile?.dateOfBirth)}
                  disabled
                  format="DD-MM-YYYY"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ng??y h???t h???n" style={{ marginBottom: 0 }} required>
                <DatePicker
                  style={{ width: '100%' }}
                  value={
                    newRecord?.roles?.[0]?.expireDate
                      ? moment(new Date(newRecord?.roles?.[0]?.expireDate))
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

export default TaiKhoanHieuTruong;
