/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import TableBase from '@/components/Table';
import type { TaiKhoanGiaoVien as ITaiKhoanGiaoVien } from '@/services/TaiKhoanGiaoVien';
import {
  AddHoSoGiaoVien,
  DelTaiKhoanGiaoVien,
  delTaiKhoanGiaoVien,
  updHoSoGiaoVien,
  updTaiKhoanGiaoVien,
} from '@/services/TaiKhoanGiaoVien/taikhoangiaovien';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import rules from '@/utils/rules';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import {
  DrawerForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
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
import React, { useEffect, useState, useRef } from 'react';
import { useModel, history } from 'umi';
import type { ProFormInstance } from '@ant-design/pro-components';
import { checkAllow } from '@/components/CheckAuthority';

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const GiaoVien = (props: { idGiaoVien?: string }) => {
  // const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  // const [checkDataHoSo, setCheckDataHoSo] = useState<string>();
  const [edit, setEdit] = useState<boolean>(false);
  const [recordView, setRecordView] = useState<any>();
  // const [newRecord, setNewRecord] = useState<ITaiKhoanGiaoVien.Record>();
  // const [recordHoSo, setRecordHoSo] = useState<ITaiKhoanGiaoVien.Record>();
  const [danhSachLop, setDanhSachLop] = useState([]);
  const vaiTro = localStorage.getItem('vaiTro');
  const [dsRoles, setDSRoles] = useState([]);
  const [lop, setLop] = useState<boolean>(false);
  const [closeLop, setCloseLop] = useState<boolean>(false);
  const { initialState } = useModel('@@initialState');
  const [tab, setTab] = useState<string>();
  const [danhSachTruong, setDanhSachTruong] = useState([]);
  const {
    loading: loadingGiaoVien,
    getGiaoVienModel,
    total,
    page,
    limit,
    cond,
    danhSachRole,
    danhSach,
    visibleDrawer,
    setVisibleDrawer,
    checkDataHoSo,
    setCheckDataHoSo,
    recordHoSo,
    setRecordHoSo,
    newRecord,
    setNewRecord,
  } = useModel('datagiaovien');
  const { recordGV } = useModel('taikhoangiaovien');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [randomNumber, setRandomNumber] = useState<number>(0);
  useEffect(() => {
    if (!window.location.pathname.includes('/quanlygiaovien/hosogiaovien')) {
      if (newRecord?._id) {
        setVisibleDrawer(true);
        let a = newRecord;
        setEdit(true);
      }
      // else {
      //   setVisibleDrawer(true);
      //   setEdit(false);
      // }
    }
    let a = recordHoSo;
    let b = checkDataHoSo;
    if (
      window.location.pathname.includes('/quanlygiaovien/hosogiaovien') &&
      ((checkDataHoSo === 'Edit' && recordHoSo?._id) || checkDataHoSo === 'Add')
    ) {
      setVisibleDrawer(true);
      setEdit(checkDataHoSo === 'Edit');
    }
    setRandomNumber(Math.random);
  }, [recordHoSo, newRecord, checkDataHoSo, props.render]);

  useEffect(() => {
    return () => {
      setVisibleDrawer(false);
      setCheckDataHoSo(undefined);
      setRecordHoSo(undefined);
      setEdit(false);
      setNewRecord(undefined);
    };
  }, []);

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

  const getRoles = async () => {
    const result = await axios.get(`${ip3}/roles/pageable?page=1&limit=10000`);
    setDSRoles(result?.data?.data?.result);
  };

  React.useEffect(() => {
    getDSLop();
    getRoles();
    getTruong();
  }, []);

  const handleView = (record: ITaiKhoanGiaoVien.Record) => {
    setVisibleModal(true);
    setRecordView(record);
  };
  const [lopId, setLopId] = useState<string>('');
  const handleEdit = async (record: ITaiKhoanGiaoVien.Record) => {
    // const dataLop: any = danhSachLop?.find(
    //   (item: { _id: string }) => item?._id === record?.organizationId,
    // );

    // const result = await axios.get(
    //   `${ip3}/ho-so-giao-vien/pageable?donViId=${dataLop?.parent}&page=1&limit=10000`,
    // );
    // const dataHoSo = result?.data?.data?.result?.find(
    //   (item: { userId: string }) => item?.userId === record?._id,
    // );

    // if (!window.location.pathname.includes('/quanlygiaovien/hosogiaovien')) {
    //   setVisibleDrawer(true);
    //   setEdit(true);
    //   setNewRecord(record);
    // }
    setEdit(true);
    // let arr = record?.roles?.filter((item) => {
    //   return item?.systemRole === 'GiaoVien';
    // });
    // console.log('record',record)
    // console.log(arr)
    setLopId(record?.organizationId);
    setNewRecord(record);
  };

  const onCell = (record: ITaiKhoanGiaoVien.Record) => ({
    onClick: () => {
      handleView(record);
    },
    style: { cursor: 'pointer' },
  });

  const handleOk = () => {
    setVisibleModal(false);
  };

  const handleDel = async (record: any) => {
    console.log('record', record);
    const newArrRole: any = [];
    danhSachRole?.map(
      (item: { roleId: string }) => item?.roleId !== record?.roleId && newArrRole.push(item),
    );
    // record.role = danhSachRole?.filter(
    //   (item: { childId: string }) => item?.childId === record?.childId,
    // )?.[0];
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
      childId: record?.chill,
      name: record?.name,
      _id: record?.role?._id,
      ngayNangCap: record?.ngayNangCap,
      systemRole: record?.systemRole,
      expireDate: record?.expireDate,
      listOrgIdAccess: record?.listOrgIdAccess,
    };
    const res = await delTaiKhoanGiaoVien(dataDel, record?._id);
    if (res?.status === 200) {
      message.success('Xóa thành công');
      getGiaoVienModel(props?.idGiaoVien);
      if (danhSach?.length === 1) {
        history.push(`/quanlytaikhoan/taikhoangiaovien`);
      }
      return true;
    }
    message.error('Đã xảy ra lỗi');
    return false;
  };

  const changeTab = (val: string) => {
    setTab(val);
  };

  const renderLast = (record: ITaiKhoanGiaoVien.Record) => {
    return (
      <React.Fragment>
        <Button
          disabled={!checkAllow('VIEW_TAI_KHOAN_GV')}
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
          disabled={!checkAllow('EDIT_TAI_KHOAN_GV')}
          type="primary"
          shape="circle"
          onClick={() => {
            handleEdit(record);
          }}
          title="Chỉnh sửa"
        >
          <EditOutlined />
        </Button>
        {checkAllow('DELETE_TAI_KHOAN_GV') && (
          <>
            <Divider type="vertical" />

            <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDel(record)}>
              <Button type="default" shape="circle" title="Xóa">
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </>
        )}
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
      dataIndex: 'profile',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => val?.fullname,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'profile',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => val?.phoneNumber,
    },
    {
      title: 'Lớp',
      dataIndex: 'organization',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => val?.tenDonVi ?? 'Không có',
    },
    {
      title: 'Trường',
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
      render: (val) => val?.email ?? 'Không có',
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'expireDate',
      align: 'center',
      search: 'sort',
      width: 150,
      onCell,
      render: (val) => (val ? <div>{moment(val).format('DD/MM/YYYY')}</div> : ''),
    },
    {
      title: 'Ngày nâng cấp',
      dataIndex: 'ngayNangCap',
      align: 'center',
      search: 'sort',
      onCell,
      render: (val) => (val ? <div>{moment(val).format('DD/MM/YYYY')}</div> : ''),
    },
  ];

  if (vaiTro === 'Admin' || vaiTro === 'SuperAdmin' || vaiTro === 'HieuTruong')
    columns.push({
      title: 'Thao tác',
      align: 'center',
      render: (record: ITaiKhoanGiaoVien.Record) => renderLast(record),
      fixed: 'right',
      width: 170,
    });
  return (
    <>
      {!window.location.pathname.includes('/quanlygiaovien/hosogiaovien') && (
        <TableBase
          border
          columns={columns}
          getData={() => getGiaoVienModel(props?.idGiaoVien)}
          loading={loadingGiaoVien}
          dependencies={[page, limit, cond]}
          modelName="datagiaovien"
          scroll={{ x: 1400 }}
        >
          <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
            Tổng số:
            <Input
              style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
              value={total}
            />
          </h3>
        </TableBase>
      )}
      <DrawerForm<ITaiKhoanGiaoVien.Record>
        visible={visibleDrawer}
        onVisibleChange={(visibile) => {
          if (!visibile) {
            setVisibleDrawer(false);
            setCheckDataHoSo(undefined);
            setRecordHoSo(undefined);
            setEdit(false);
            setNewRecord(undefined);
          }
        }}
        title={edit ? 'Chỉnh sửa' : 'Thêm mới'}
        width={650}
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
        drawerProps={{
          forceRender: false,
          destroyOnClose: true,
          onClose: () => setTab('1'),
        }}
        onFinishFailed={(error) => {
          if (error?.errorFields) {
            message.error(
              'Thông tin đang thiếu, vui lòng kiểm tra lại thông tin cơ bản và hồ sơ giáo viên',
            );
            setTab('1');
          }
        }}
        onFinish={async (values: any) => {
          const id = newRecord?._id;
          // Thêm mới và chỉnh sửa hồ sơ giáo viên
          let a = tab;

          // if (tab === '2') {
          const dataLop: any = danhSachLop?.find(
            (item: { _id: string }) => item?._id === newRecord?.organizationId,
          );
          values.donViId = window.location.pathname.includes('/quanlygiaovien/hosogiaovien')
            ? props.idTruong
            : dataLop?.parent;
          values.hoTen = window.location.pathname.includes('/quanlygiaovien/hosogiaovien')
            ? recordGV?.profile?.fullname
            : values?.profile?.fullname;
          if (window.location.pathname.includes('/quanlygiaovien/hosogiaovien')) {
            values.ten = window.location.pathname.includes('/quanlygiaovien/hosogiaovien')
              ? recordGV?.profile?.firstname
              : values?.profile?.firstname;
            values.hoDem = window.location.pathname.includes('/quanlygiaovien/hosogiaovien')
              ? recordGV?.profile?.lastname
              : values?.profile?.lastname;
          }
          values.soDienThoai = window.location.pathname.includes('/quanlygiaovien/hosogiaovien')
            ? recordGV?.profile?.phoneNumber
            : values?.profile?.phoneNumber;
          values.userId = window.location.pathname.includes('/quanlygiaovien/hosogiaovien')
            ? props.idGiaoVien
            : id;
          if (values.tiLeDongBaoHiemNhaNuoc < values.tiLeDongBHCuaTruong) {
            message.error(
              'Tỉ lệ đóng bảo hiểu nhà nước phải lớn hơn tỉ lệ đóng bảo hiểm của trường',
            );
            return;
          }
          values.tiLeDongBHCuaGV = values.tiLeDongBaoHiemNhaNuoc - values.tiLeDongBHCuaTruong;
          if (checkDataHoSo === 'Add') {
            try {
              const res = await AddHoSoGiaoVien({ ...values });
              if (res?.data?.statusCode === 201) {
                message.success('Thêm mới hồ sơ thành công');
                getGiaoVienModel(props?.idGiaoVien);
                setTab('1');
                return true;
              }
            } catch (error) {
              message.error('Vui lòng kiểm tra thông tin học phí trường');
              return false;
            }
          } else if (checkDataHoSo === 'Edit') {
            const idHoSo = recordHoSo?._id;
            try {
              const res = await updHoSoGiaoVien({ ...values, idHoSo });
              if (res?.data?.statusCode === 200) {
                message.success('Cập nhật hồ sơ thành công');
                getGiaoVienModel(props?.idGiaoVien);
                setTab('1');
                if (window.location.pathname.includes('/quanlygiaovien/hosogiaovien')) {
                  return true;
                }
              }
            } catch (error) {
              message.error('Đã xảy ra lỗi. Vui lòng kiểm tra thông tin học phí trường');
              return false;
            }
          }
          // }

          if (!window.location.pathname.includes('/quanlygiaovien/hosogiaovien')) {
            // Chỉnh sửa tài khoản giáo viên
            const roleId = newRecord?.roleId;
            const recordRole: any = dsRoles?.find(
              (item: { _id: string }) => item?._id === values?.roleId,
            );
            const newArrRole = [];

            danhSachRole?.map(
              (item: { organizationId: string }) =>
                item?.organizationId !== values?.organizationId && newArrRole.push(item),
            );

            // update vai trò vào mảng vai trò ban đầu
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
            values.profile.dateOfBirth = moment(values.profile.dateOfBirth).format();
            values.expireDate = moment(values.expireDate).format();
            values.profile.expireDate = moment(values.profile.expireDate).format();
            values.username = newRecord?.profile?.username;
            delete values?.roleId;
            delete values?.organizationId;

            const res = await updTaiKhoanGiaoVien({ ...values, id });
            if (res?.data?.statusCode === 200) {
              message.success('Cập nhật thông tin giáo viên thành công');
              getGiaoVienModel(props?.idGiaoVien);
              return true;
            }
            message.error('Đã xảy ra lỗi');
            return false;
          }
        }}
        key={randomNumber}
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
                  setTab('1');
                }}
              >
                Quay lại
              </Button>,
            ];
          },
        }}
        // initialValues={{
        //   ...(edit && newRecord),
        // }}
      >
        <Tabs
          defaultActiveKey="1"
          style={{ marginTop: '-15px' }}
          onChange={changeTab}
          activeKey={tab}
        >
          {!window.location.pathname.includes('/quanlygiaovien/hosogiaovien') && (
            <Tabs.TabPane tab="Thông tin cơ bản" key="1">
              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <ProFormText
                    name={['profile', 'fullname']}
                    label="Họ và tên"
                    placeholder="Nhập họ và tên"
                    rules={[...rules.required]}
                    initialValue={edit ? newRecord?.profile.fullname : ''}
                  />
                </Col>
                <Col span={12}>
                  <ProFormText
                    name={['profile', 'phoneNumber']}
                    label="Số điện thoại"
                    placeholder="Nhập số điện thoại"
                    disabled={edit}
                    rules={[...rules.required]}
                    initialValue={edit ? newRecord?.phoneNumber : ''}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <ProFormText
                    name={['profile', 'phoneNumber']}
                    label="Tài khoản"
                    placeholder="Nhập tài khoản"
                    disabled={edit}
                    rules={[...rules.required]}
                    initialValue={edit ? newRecord?.profile?.phoneNumber : ''}
                  />
                </Col>
                <Col span={12}>
                  <ProFormSelect
                    name={['profile', 'trinhDo']}
                    label="Trình độ"
                    placeholder="Chọn trình độ"
                    initialValue={edit ? newRecord?.profile?.trinhDo : undefined}
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
                    label="Vai trò"
                    placeholder="Chọn vai trò"
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
                      label="Lớp"
                      placeholder="Chọn lớp"
                      disabled={edit && vaiTro !== 'SuperAdmin'}
                      initialValue={edit ? lopId : undefined}
                      options={danhSachLop?.map((item: any) => ({
                        value: `${item?._id}`,
                        label: `${item?.tenDonVi}`,
                      }))}
                    />
                  </Col>
                )}
              </Row>
              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <ProFormSelect
                    name={['profile', 'gender']}
                    label="Giới tính"
                    placeholder="Chọn giới tính"
                    initialValue={edit ? newRecord?.profile?.gender : undefined}
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
                    initialValue={edit ? newRecord?.profile?.email : ''}
                  />
                </Col>
              </Row>

              <ProFormDatePicker
                name={['profile', 'dateOfBirth']}
                label="Ngày sinh"
                placeholder="Chọn ngày sinh"
                initialValue={
                  edit
                    ? newRecord?.profile?.dateOfBirth
                      ? moment(newRecord?.profile?.dateOfBirth)
                      : undefined
                    : undefined
                }
              />

              <ProFormDatePicker
                name="expireDate"
                label="Ngày hết hạn"
                placeholder="Chọn ngày hết hạn"
                // rules={[...rules.required]}
                disabled={edit && vaiTro !== 'SuperAdmin'}
                initialValue={
                  edit
                    ? newRecord?.expireDate
                      ? moment(new Date(newRecord?.expireDate))
                      : undefined
                    : undefined
                }
              />
            </Tabs.TabPane>
          )}
          {window.location.pathname.includes('/quanlygiaovien/hosogiaovien') && (
            <Tabs.TabPane
              tab="Hồ sơ giáo viên"
              key={window.location.pathname.includes('/quanlygiaovien/hosogiaovien') ? '1' : '2'}
            >
              <Row gutter={[16, 0]}>
                <Col xl={12} lg={12} xs={24}>
                  <ProFormDigit
                    name="luongThoaThuan"
                    label="Lương thỏa thuận"
                    placeholder="Nhập lương thỏa thuận"
                    rules={[...rules.required]}
                    fieldProps={{
                      formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                    }}
                    initialValue={recordHoSo?.luongThoaThuan}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]}>
                <Col xl={12} lg={12} xs={24}>
                  <ProFormDigit
                    name="luongDongBaoHiem"
                    label="Lương cơ bản đóng bảo hiểm (theo vùng)"
                    placeholder="Nhập lương cơ bản đóng bảo hiểm theo vùng"
                    rules={[...rules.required]}
                    fieldProps={{
                      formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                    }}
                    initialValue={recordHoSo?.luongDongBaoHiem}
                  />
                </Col>
                <Col xl={12} lg={12} xs={24}>
                  <ProFormDigit
                    name="thuongThang"
                    label="Thưởng tháng"
                    placeholder="Nhập thưởng tháng"
                    rules={[...rules.required]}
                    fieldProps={{
                      formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                    }}
                    initialValue={recordHoSo?.thuongThang}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]}>
                <Col xl={12} lg={12} xs={24}>
                  <ProFormDigit
                    name="phuCap"
                    label="Phụ cấp"
                    placeholder="Nhập phụ cấp"
                    rules={[...rules.required]}
                    fieldProps={{
                      formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                    }}
                    initialValue={recordHoSo?.phuCap}
                  />
                </Col>
                <Col xl={12} lg={12} xs={24}>
                  <ProFormText
                    name="chucVu"
                    label="Chức vụ"
                    placeholder="Chức vụ"
                    rules={[...rules.required]}
                    initialValue={recordHoSo?.chucVu}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]}>
                <Col xl={12} lg={12} xs={24}>
                  <ProFormDigit
                    name="tiLeDongBaoHiemNhaNuoc"
                    label="Tỷ lệ đóng bảo hiểm quy định nhà nước (theo lương cơ bản)"
                    placeholder="Tỷ lệ đóng bảo hiểm quy định nhà nước (theo lương cơ bản)"
                    rules={[...rules.required, ...rules.float(100, 0, 2)]}
                    fieldProps={{
                      formatter: (value) => `${value}%`,
                    }}
                    max={100}
                    min={0}
                    initialValue={recordHoSo?.tiLeDongBaoHiemNhaNuoc}
                  />
                </Col>
                <Col xl={12} lg={12} xs={24}>
                  <ProFormDigit
                    name="tiLeDongBHCuaTruong"
                    label="Tỷ lệ đóng bảo hiểm của trường theo lương cơ bản"
                    placeholder="Tỷ lệ đóng bảo hiểm của trường theo lương cơ bản"
                    rules={[...rules.required, ...rules.float(100, 0, 2)]}
                    fieldProps={{
                      formatter: (value) => `${value}%`,
                    }}
                    max={100}
                    min={0}
                    initialValue={recordHoSo?.tiLeDongBHCuaTruong}
                  />
                </Col>
              </Row>
            </Tabs.TabPane>
          )}
        </Tabs>
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
                <Input value={recordView?.profile?.fullname} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tài khoản" style={{ marginBottom: 0 }} required>
                <Input value={recordView?.profile?.phoneNumber} disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item label="Số điện thoại" style={{ marginBottom: 0 }} required>
                <Input value={recordView?.profile?.phoneNumber} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Giới tính" style={{ marginBottom: 0 }}>
                <Input value={recordView?.profile?.gender === 'Male' ? 'Nam' : 'Nữ'} disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item label="Trình độ" style={{ marginBottom: 0 }}>
                <Input value={recordView?.profile?.trinhDo ?? 'Chưa cập nhật'} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Email" style={{ marginBottom: 0 }}>
                <Input value={recordView?.profile?.email ?? 'Chưa cập nhật'} disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item label="Ngày sinh" style={{ marginBottom: 0 }}>
                <DatePicker
                  style={{ width: '100%' }}
                  value={moment(recordView?.profile?.dateOfBirth) ?? 'Chưa cập nhật'}
                  disabled
                  format="DD-MM-YYYY"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ngày hết hạn" style={{ marginBottom: 0 }} required>
                <DatePicker
                  style={{ width: '100%' }}
                  value={
                    recordView?.expireDate ? moment(new Date(newRecord?.expireDate)) : undefined
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

export default GiaoVien;
