/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import TableBase from '@/components/Table';
import ThongTinCon from '@/pages/KhaiBaoThongTin/components/ThongTinCon';
import type { TaiKhoanPhuHuynh as ITaiKhoanPhuHuynh } from '@/services/TaiKhoanPhuHuynh';
import {
  delTaiKhoanPhuHuynh,
  updTaiKhoanPhuHuynh,
} from '@/services/TaiKhoanPhuHuynh/taikhoanphuhuynh';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import rules from '@/utils/rules';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
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
  Tabs,
} from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { useModel, history } from 'umi';
import { DelTaiKhoanGiaoVien } from '@/services/TaiKhoanGiaoVien/taikhoangiaovien';
import { checkAllow } from '@/components/CheckAuthority';

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const TaiKhoanPhuHuynh = (props: { idPhuHuynh: string }) => {
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [newRecord, setNewRecord] = useState<ITaiKhoanPhuHuynh.Record>();
  const vaiTro = localStorage.getItem('vaiTro');
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [dsRoles, setDSRoles] = useState([]);
  const [lop, setLop] = useState<boolean>(false);
  const [danhSachLop, setDanhSachLop] = useState([]);
  const [danhSachTruong, setDanhSachTruong] = useState([]);
  const [closeLop, setCloseLop] = useState<boolean>(false);
  const { initialState } = useModel('@@initialState');
  const {
    loading: loadingTaiKhoanPhuHuynh,
    getPhuHuynhModel,
    total,
    page,
    limit,
    cond,
    danhSachRole,
    danhSach,
  } = useModel('dataphuhuynh');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const handleEdit = (record: ITaiKhoanPhuHuynh.Record) => {
    setVisibleDrawer(true);
    setEdit(true);
    ;
    setNewRecord(record);
  };
  const getRoles = async () => {
    const result = await axios.get(`${ip3}/roles/pageable?page=1&limit=100000`);
    setDSRoles(result?.data?.data?.result);
  };
  const getTruong = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=10000`, {
      params: {
        cond: {
          loaiDonVi: 'Truong',
        },
      },
    });
    setDanhSachTruong(result?.data?.data?.result);
  };
  const getDSLop = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable/my/child?page=1&limit=20`, {
      params: {
        cond: {
          loaiDonVi: 'Lop',
          parent: organizationId,
        },
      },
    });
    setDanhSachLop(result?.data?.data?.result);
  };

  React.useEffect(() => {
    getRoles();
    getDSLop();
    getTruong();
  }, []);

  const handleDel = async (record: any) => {
    // return;
    const newArrRole: any = [];
    const roleDete = undefined;
    danhSachRole?.map(
      (item: { childId: string }) => item?.childId !== record?.childId && newArrRole.push(item),
    );
    record.role = danhSachRole?.filter(
      (item: { childId: string }) => item?.childId === record?.childId,
    )?.[0];
    record.roles = newArrRole;
    record.profile.dateOfBirth = moment(record.profile.dateOfBirth).format();
    record.profile.expireDate = moment(record.profile.expireDate).format();
    record.username = newRecord?.profile?.username;
    // delete record?.roleId;
    // delete record?.organizationId;
    // delete record?.organization;
    // delete record?.name;
    // delete record?.chill;
    // delete record?.systemRole;
    const dataDel: DelTaiKhoanGiaoVien = {
      organizationId: record?.organizationId,
      roleId: record?.roleId,
      childId: record?.childId,
      name: record?.name,
      _id: record?.role?._id,
      ngayNangCap: record?.ngayNangCap,
      systemRole: record?.systemRole,
      expireDate: record?.expireDate,
      listOrgIdAccess: record?.listOrgIdAccess,
    };
    const res = await delTaiKhoanPhuHuynh({ dataDel, id: record?._id });
    if (res?.status === 200) {
      message.success('X??a th??nh c??ng');
      getPhuHuynhModel(props?.idPhuHuynh);
      if (danhSach?.length === 1) {
        history.push(`/quanlytaikhoan/taikhoanphuhuynh`);
      }
      return true;
    }
    message.error('???? x???y ra l???i');
    return false;
  };

  const handleView = (record: ITaiKhoanPhuHuynh.Record) => {
    setVisibleModal(true);
    setNewRecord(record);
  };

  const renderLast = (record: ITaiKhoanPhuHuynh.Record) => {
    return (
      <React.Fragment>
        <Button
          disabled={!checkAllow('VIEW_TAI_KHOAN_PH')}
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
        >
          <EditOutlined />
        </Button>
        {checkAllow('DELETE_TAI_KHOAN_PH') && (
          <>
            <Divider type="vertical" />

            <Popconfirm title="B???n??c????ch???c??mu???n??x??a?" onConfirm={() => handleDel(record)}>
              <Button type="default" shape="circle" title="X??a">
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </>
        )}
      </React.Fragment>
    );
  };

  const onCell = (record: ITaiKhoanPhuHuynh.Record) => ({
    onClick: () => {
      handleView(record);
    },
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<ITaiKhoanPhuHuynh.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'H??? v?? t??n ph??? huynh',
      dataIndex: 'profile',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => val?.fullname,
    },
    {
      title: 'S??? ??i???n tho???i',
      dataIndex: 'profile',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => val?.phoneNumber,
    },
    {
      title: 'H??? v?? t??n con',
      dataIndex: 'child',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => (val && val?.hoTen !== '' ? val?.hoTen : 'Kh??ng c??'),
    },
    {
      title: 'L???p',
      dataIndex: 'organization',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => val?.tenDonVi ?? 'Kh??ng c??',
    },
    {
      title: 'Tr?????ng',
      dataIndex: 'organization',
      align: 'center',
      width: 150,
      onCell,
      render: (val) =>
        danhSachTruong?.filter((item) => item?._id === val?.parent)?.[0]?.tenDonVi ?? '',
    },
    {
      title: 'Email',
      dataIndex: 'profile',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => val?.email ?? 'Kh??ng c??',
    },
    {
      title: 'Ng??y h???t h???n',
      dataIndex: 'expireDate',
      align: 'center',
      width: 150,
      search: 'sort',
      onCell,
      render: (val) => (val ? <div>{moment(val).format('DD/MM/YYYY')}</div> : ''),
    },
    {
      title: 'Ng??y n??ng c???p',
      dataIndex: 'ngayNangCap',
      align: 'center',
      search: 'sort',
      onCell,
      render: (val) => (val ? <div>{moment(val).format('DD/MM/YYYY')}</div> : ''),
    },
  ];

  if (vaiTro === 'Admin' || vaiTro === 'SuperAdmin' || vaiTro === 'HieuTruong')
    columns.push({
      title: 'Thao t??c',
      align: 'center',
      render: (record: ITaiKhoanPhuHuynh.Record) => renderLast(record),
      fixed: 'right',
      width: 170,
    });
  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={() => getPhuHuynhModel(props?.idPhuHuynh)}
        loading={loadingTaiKhoanPhuHuynh}
        dependencies={[page, limit, cond]}
        modelName="dataphuhuynh"
        scroll={{ x: 1700 }}
      >
        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          T???ng s???:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={total}
          />
        </h3>
      </TableBase>
      <DrawerForm<ITaiKhoanPhuHuynh.Record>
        visible={visibleDrawer}
        onVisibleChange={setVisibleDrawer}
        title={edit ? 'Ch???nh s???a' : 'Th??m m???i'}
        drawerProps={{
          forceRender: false,
          destroyOnClose: true,
          width: '60%',
        }}
        onValuesChange={(val) => {
          if (val?.roleId) {
            const recordRole: any = dsRoles?.find(
              (item: { _id: string }) => item?._id === val?.roleId,
            );
            if (recordRole?.systemRole === 'GiaoVien' || recordRole?.systemRole === 'PhuHuynh') {
              setLop(true);
            }
            if (recordRole?.systemRole !== 'GiaoVien' && recordRole?.systemRole !== 'PhuHuynh') {
              setLop(false);
              setCloseLop(true);
            }
          }
        }}
        onFinish={async (values: any) => {
          const roleId = newRecord?.roleId;
          const recordRole: any = dsRoles?.find(
            (item: { _id: string }) => item?._id === values?.roleId,
          );
          const newArrRole = [];
          danhSachRole?.map(
            (item: { organizationId: string }) =>
              item?.organizationId !== values?.organizationId && newArrRole.push(item),
          );
          // update vai tr?? v??o m???ng vai tr?? ban ?????u
          newArrRole?.push({
            systemRole: recordRole?.systemRole,
            organizationId:
              recordRole?.systemRole === 'GiaoVien' || recordRole?.systemRole === 'PhuHuynh'
                ? values.organizationId || newRecord?.organizationId
                : undefined,
            roleId: values?.roleId || roleId,
            expireDate: moment(values?.expireDate).format(),
            name: recordRole?.name,
          });
          values.roles = newArrRole;
          values.username = newRecord?.profile?.username;
          values.profile.dateOfBirth = moment(values.profile.dateOfBirth).format();
          values.expireDate = moment(values.expireDate).format();
          values.profile.expireDate = moment(values.profile.expireDate).format();
          const id = newRecord?._id;
          const res = await updTaiKhoanPhuHuynh({ ...values, id });
          if (res?.data?.statusCode === 200) {
            message.success('C???p nh???t th??nh c??ng');
            getPhuHuynhModel(props?.idPhuHuynh);
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
                  setVisibleDrawer(false);
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
        <Tabs defaultActiveKey="1" style={{ marginTop: '-15px' }}>
          <Tabs.TabPane tab="Ph??? huynh" key="1">
            <Row gutter={[16, 0]}>
              <Col span={12}>
                <ProFormText
                  name={['profile', 'fullname']}
                  label="H??? v?? t??n"
                  placeholder="Nh???p h??? v?? t??n"
                  disabled={!checkAllow('EDIT_TAI_KHOAN_PH')}
                  rules={[...rules.required]}
                  initialValue={edit ? newRecord?.profile?.fullname : ''}
                />
              </Col>
              <Col span={12}>
                <ProFormText
                  name={['profile', 'phoneNumber']}
                  label="S??? ??i???n tho???i"
                  placeholder="Nh???p s??? ??i???n tho???i"
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
                  label="T??i kho???n"
                  placeholder="Nh???p t??i kho???n"
                  rules={[...rules.required]}
                  disabled={edit}
                  initialValue={edit ? newRecord?.profile?.phoneNumber : ''}
                />
              </Col>
              <Col span={12}>
                <ProFormText
                  name={['profile', 'email']}
                  label="Email"
                  disabled={!checkAllow('EDIT_TAI_KHOAN_PH')}
                  placeholder="Nh???p email"
                  initialValue={edit ? newRecord?.profile?.email : undefined}
                />
              </Col>
            </Row>
            <Row gutter={[16, 0]}>
              <Col
                span={
                  lop ||
                  (!closeLop && newRecord?.systemRole === 'GiaoVien') ||
                  (!closeLop && newRecord?.systemRole === 'PhuHuynh')
                    ? 12
                    : 24
                }
              >
                <ProFormSelect
                  name="roleId"
                  label="Vai tr??"
                  placeholder="Ch???n vai tr??"
                  rules={[...rules.required]}
                  initialValue={edit ? newRecord?.roleId : undefined}
                  disabled={edit && vaiTro !== 'SuperAdmin'}
                  options={dsRoles?.map((item: { _id: string; name: string }) => ({
                    // eslint-disable-next-line no-underscore-dangle
                    value: `${item?._id}`,
                    label: `${item?.name}`,
                  }))}
                />
              </Col>
              {(lop ||
                (!closeLop && newRecord?.systemRole === 'GiaoVien') ||
                (!closeLop && newRecord?.systemRole === 'PhuHuynh')) && (
                <Col span={12}>
                  <ProFormSelect
                    name="organizationId"
                    label="L???p"
                    placeholder="Ch???n l???p"
                    disabled={edit && vaiTro !== 'SuperAdmin'}
                    initialValue={edit ? newRecord?.roles?.[0]?.organizationId : undefined}
                    options={danhSachLop?.map((item: any) => ({
                      value: `${item?._id}`,
                      label: `${item?.tenDonVi}`,
                    }))}
                  />
                </Col>
              )}
            </Row>

            <Col>
              <ProFormDatePicker
                name={['profile', 'dateOfBirth']}
                label="Ng??y sinh"
                disabled={!checkAllow('EDIT_TAI_KHOAN_PH')}
                placeholder="Ch???n ng??y sinh"
                initialValue={edit ? moment(newRecord?.profile?.dateOfBirth) : undefined}
              />
            </Col>
            <Col>
              <ProFormDatePicker
                name="expireDate"
                label="Ng??y h???t h???n"
                placeholder="Ch???n ng??y h???t h???n"
                disabled={edit && vaiTro !== 'SuperAdmin'}
                // rules={[...rules.required, ...rules.sauHomNay]}
                initialValue={
                  edit
                    ? newRecord?.expireDate
                      ? moment(new Date(newRecord?.expireDate))
                      : undefined
                    : undefined
                }
              />
            </Col>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Con" key="2">
            <ThongTinCon childId={newRecord?.childId} taiKhoanPH={true} />
          </Tabs.TabPane>
        </Tabs>

        {edit && <div style={{ width: '100%' }} />}
      </DrawerForm>
      <Modal
        title="Chi ti???t t??i kho???n ph??? huynh"
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
              <Form.Item label="H??? v?? t??n ph??? huynh" style={{ marginBottom: 0 }} required>
                <Input value={`${newRecord?.profile?.fullname}`} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="T??i kho???n" style={{ marginBottom: 0 }} required>
                <Input value={newRecord?.profile?.username} disabled />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="H??? v?? t??n con" style={{ marginBottom: 0 }} required>
            <Input value={newRecord?.child?.hoTen ?? 'Kh??ng c??'} disabled />
          </Form.Item>
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
              <Form.Item label="Ng??y sinh" style={{ marginBottom: 0 }}>
                <DatePicker
                  style={{ width: '100%' }}
                  value={moment(newRecord?.profile?.dateOfBirth) ?? 'Ch??a c???p nh???t'}
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
                    newRecord?.expireDate ? moment(new Date(newRecord?.expireDate)) : undefined
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

export default TaiKhoanPhuHuynh;
