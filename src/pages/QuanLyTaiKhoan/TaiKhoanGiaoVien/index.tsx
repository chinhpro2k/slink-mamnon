/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import { checkAllow } from '@/components/CheckAuthority';
import TableBase from '@/components/Table';
import UploadFiles from '@/components/Upload/UploadFile';
import type { TaiKhoanGiaoVien as ITaiKhoanGiaoVien } from '@/services/TaiKhoanGiaoVien';
import { importTaiKhoan } from '@/services/TaiKhoanGiaoVien/taikhoangiaovien';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import rules from '@/utils/rules';
import { ExportOutlined, EyeOutlined, EditOutlined, BookOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Modal, Row, Select, Divider, Popconfirm } from 'antd';
import React, { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import moment from 'moment';
import { resetPass } from '@/services/TaiKhoanHieuTruong/taikhoanhieutruong';
import { RetweetOutlined } from '@ant-design/icons';
import TableGiaoVien from './components/TableGiaoVien';
import fileDownload from 'js-file-download';
import FileDownload from 'js-file-download';

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const TaiKhoanGiaoVien = () => {
  const [visibleModalAdd, setVisibleModalAdd] = useState<boolean>(false);
  const [danhSachTruong, setDanhSachTruong] = useState([]);
  const [danhSachTruongFilter, setDanhSachTruongFilter] = useState([]);
  const vaiTro = localStorage.getItem('vaiTro');
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [render, setRender] = useState(true);

  const {
    loading: loadingTaiKhoanGiaoVien,
    getTaiKhoanGiaoVienModel,
    total,
    page,
    limit,
    cond,
    setPage,
    setCondition,
    danhSach,
  } = useModel('taikhoangiaovien');
  const { setRecordHoSo, setCheckDataHoSo } = useModel('datagiaovien');
  const { recordGV, setRecordGV } = useModel('taikhoangiaovien');
  const [idTruong, setIdTruong] = useState<string>('Tất cả');
  const [danhSachLop, setDanhSachLop] = useState([]);

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
  const downloadTemplate = async () => {
    const result = await axios.get(`${ip3}/user/export/template/giao-vien`,{
      responseType: 'arraybuffer',
    });
    FileDownload(result.data, `Template-import-GV.xlsx`);
  };
  const getDSTruong = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=100`);
    const arrTruong: any = [];
    result?.data?.data?.result?.map(
      (item: { loaiDonVi: string }) => item?.loaiDonVi === 'Truong' && arrTruong.push(item),
    );
    setDanhSachTruong(arrTruong);
    const arrTruongFilter: any = [];
    arrTruongFilter.push({ tenDonVi: 'Tất cả các trường', _id: 'Tất cả' });
    arrTruongFilter.push(...arrTruong);
    setDanhSachTruongFilter(arrTruongFilter);
    if (recordGV?.idTruong) setIdTruong(recordGV?.idTruong);
  };

  React.useEffect(() => {
    getDSTruong();
    if (window.location.pathname.includes('/quanlygiaovien/hosogiaovien')) {
      setCheckDataHoSo('');
      setRecordHoSo(undefined);
    }
    getDSLop();
  }, []);

  const onCell = (record: ITaiKhoanGiaoVien.Record) => ({
    onClick: !checkAllow('VIEW_TAI_KHOAN_GV')
      ? undefined
      : () => {
          setRecordGV({ ...record, idTruong });
          history.push(`/quanlytaikhoan/taikhoangiaovien/${record._id}`);
        },
    style: { cursor: 'pointer' },
  });

  const onSubmit = async (values: any) => {
    if (vaiTro !== 'SuperAdmin' && vaiTro !== 'Admin') {
      values.organizationId = organizationId;
    }
    try {
      const result = await importTaiKhoan({ ...values });
      if (result?.data?.statusCode === 201) {
        message.success('Import tài khoản thành công');
        getTaiKhoanGiaoVienModel(organizationId);
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

  const onChange = (value: string) => {
    setCondition({ ...cond, organizationId: value });
    setIdTruong(value);
    setPage(1);
  };

  const handleResetPass = async (record: ITaiKhoanGiaoVien.Record) => {
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

  const handleEditHoSo = async (record: ITaiKhoanGiaoVien.Record) => {
    let a = organizationId;

    const result = await axios.get(
      `${ip3}/ho-so-giao-vien/pageable?donViId=${organizationId}&page=1&limit=10000`,
    );
    const dataHoSo = result?.data?.data?.result?.find(
      (item: { userId: string }) => item?.userId === record?._id,
    );
    setRecordGV({ ...record, idTruong });
    // if (!window.location.pathname.includes('/quanlygiaovien/hosogiaovien')) {
    //   setVisibleDrawer(true);
    //   setEdit(true);
    //   setNewRecord(record);
    // }
    // ;
    if (dataHoSo) {
      setCheckDataHoSo('Edit');
      setRecordHoSo(dataHoSo);
    } else {
      setCheckDataHoSo('Add');
      setRecordHoSo(undefined);
    }
    setRender(!render);
  };

  const renderLast = (record: ITaiKhoanGiaoVien.Record) => {
    return !window.location.pathname.includes('/quanlygiaovien/hosogiaovien') ? (
      <React.Fragment>
        <Button
          type="default"
          shape="circle"
          disabled={!checkAllow('VIEW_TAI_KHOAN_GV')}
          onClick={() => {
            setRecordGV({ ...record, idTruong });
            history.push(
              window.location.pathname.includes('/quanlygiaovien/hosogiaovien')
                ? `/quanlygiaovien/hosogiaovien/${record._id}`
                : `/quanlytaikhoan/taikhoangiaovien/${record._id}`,
            );
          }}
          title="Xem chi tiết"
        >
          <EyeOutlined />
        </Button>

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
    ) : (
      <>
        <Button
          type="default"
          shape="circle"
          onClick={() => {
            handleEditHoSo(record);
          }}
          title="Chỉnh sửa hồ sơ giáo viên"
        >
          <EditOutlined />
        </Button>
      </>
    );
  };

  const columns: IColumn<ITaiKhoanGiaoVien.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Họ và tên',
      dataIndex: ['profile', 'fullname'],
      align: 'center',
      width: 300,
      search: 'search',
    },
    {
      title: 'Số điện thoại',
      dataIndex: ['profile', 'phoneNumber'],
      align: 'center',
      width: 200,
      search: 'search',
    },
    {
      title: 'Lớp',
      dataIndex: 'roles',
      align: 'center',
      width: 300,
      render: (val) =>
        val.filter((item) => item?.systemRole === 'GiaoVien')?.[0]?.organization?.tenDonVi,
    },
    {
      title: 'Email',
      dataIndex: ['profile', 'email'],
      align: 'center',
      width: 250,
      search: 'search',
      render: (val) => val ?? 'Không có',
    },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'ngayDangKy',
      align: 'center',
      search: 'sort',
      render: (val) => (val ? <div>{moment(val).format('DD/MM/YYYY')}</div> : ''),
    },
  ];

  if (vaiTro === 'Admin' || vaiTro === 'SuperAdmin' || vaiTro === 'HieuTruong')
    columns.push({
      title: 'Thao tác',
      align: 'center',
      render: (record: ITaiKhoanGiaoVien.Record) => renderLast(record),
      fixed: 'right',
      width: 200,
    });

  useEffect(() => {}, []);
  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={() => getTaiKhoanGiaoVienModel(organizationId)}
        loading={loadingTaiKhoanGiaoVien}
        dependencies={[page, limit, cond]}
        modelName="taikhoangiaovien"
        title={
          window.location.pathname === '/quanlygiaovien/hosogiaovien'
            ? 'Thông tin lương'
            : 'Quản lý tài khoản giáo viên'
        }
      >
        {checkAllow('IMPORT_TAI_KHOAN_GV') && (
          <Button
            style={{ marginBottom: '10px', marginRight: '10px' }}
            onClick={() => {
              setVisibleModalAdd(true);
            }}
            type="primary"
          >
            <ExportOutlined />
            Import file
          </Button>
        )}
        {checkAllow('IMPORT_TAI_KHOAN_GV') && (
          <Button
            style={{ marginBottom: '10px', marginRight: '10px' }}
            onClick={() => {
              downloadTemplate();
            }}
            type="default"
          >
            <BookOutlined />
            File mẫu
          </Button>
        )}
        {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
          <>
            <Select
              value={idTruong}
              showSearch
              style={{ width: '20%' }}
              placeholder="Chọn đơn vị"
              optionFilterProp="children"
              onChange={onChange}
              filterOption={(input, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {danhSachTruongFilter?.map((item: { _id: string; tenDonVi: string }) => (
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
      {window.location.pathname.includes('/quanlygiaovien/hosogiaovien') && (
        <TableGiaoVien render={render} idGiaoVien={recordGV?._id} idTruong={organizationId} />
      )}
      <Modal
        title="Import file tài khoản giáo viên"
        visible={visibleModalAdd}
        onCancel={() => {
          setVisibleModalAdd(false);
        }}
        footer={[]}
        destroyOnClose
      >
        <Form onFinish={onSubmit} {...formItemLayout}>
          {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
            <Row>
              <Col span={24}>
                <Form.Item name="organizationId" label="Trường" rules={[...rules.required]}>
                  <Select
                    placeholder="Chọn trường"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option: any) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {danhSachTruong?.map(
                      (item: { _id: string; tenDonVi: string }, index: number) => (
                        <Select.Option key={index} value={item?._id}>
                          {item?.tenDonVi}
                        </Select.Option>
                      ),
                    )}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          )}
          <Form.Item name="file">
            <UploadFiles />
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
    </>
  );
};

export default TaiKhoanGiaoVien;
