/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import { checkAllow } from '@/components/CheckAuthority';
import TableBase from '@/components/Table';
import UploadFile from '@/components/Upload/UploadFile';
import { importTaiKhoan } from '@/services/TaiKhoanGiaoVien/taikhoangiaovien';
import type { TaiKhoanPhuHuynh as ITaiKhoanPhuHuynh } from '@/services/TaiKhoanPhuHuynh';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import rules from '@/utils/rules';
import { BookOutlined, ExportOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Modal, Row, Select, Divider, Popconfirm } from 'antd';
import React, { useState } from 'react';
import { history, useModel } from 'umi';
import moment from 'moment';
import { resetPass } from '@/services/TaiKhoanHieuTruong/taikhoanhieutruong';
import { RetweetOutlined } from '@ant-design/icons';
import FileDownload from 'js-file-download';

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const TaiKhoanPhuHuynh = () => {
  const [visibleModalAdd, setVisibleModalAdd] = useState<boolean>(false);
  const vaiTro = localStorage.getItem('vaiTro');
  const {
    loading: loadingTaiKhoanPhuHuynh,
    getTaiKhoanPhuHuynhModel,
    total,
    page,
    limit,
    cond,
    setCondition,
    setPage,
  } = useModel('taikhoanphuhuynh');
  const { recordPH, setRecordPH } = useModel('taikhoanphuhuynh');
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [danhSachTruong, setDanhSachTruong] = useState([]);
  const [danhSachTruongFilter, setDanhSachTruongFilter] = useState([]);
  const [idTruong, setIdTruong] = useState<string>('Tất cả');
  const downloadTemplate = async () => {
    const result = await axios.get(`${ip3}/user/export/template/phu-huynh`,{
      responseType: 'arraybuffer',
    });
    FileDownload(result.data, `Template-import-phu-hunh.xlsx`);
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
    if (recordPH?.idTruong) setIdTruong(recordPH?.idTruong);
  };

  const onChange = (value: string) => {
    setCondition({ ...cond, organizationId: value });
    setIdTruong(value);
    setPage(1);
  };

  React.useEffect(() => {
    getDSTruong();
  }, []);

  const onSubmit = async (values: any) => {
    if (vaiTro !== 'SuperAdmin' && vaiTro !== 'Admin') {
      values.organizationId = organizationId;
    }
    try {
      const result = await importTaiKhoan({ ...values });
      if (result?.data?.statusCode === 201) {
        message.success('Import tài khoản thành công');
        getTaiKhoanPhuHuynhModel(organizationId);
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

  const handleResetPass = async (record: ITaiKhoanPhuHuynh.Record) => {
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

  const renderLast = (record: ITaiKhoanPhuHuynh.Record) => {
    return (
      <React.Fragment>
        <Button
          type="default"
          shape="circle"
          disabled={!checkAllow('VIEW_TAI_KHOAN_PH')}
          onClick={() => {
            setRecordPH({ ...record, idTruong });
            history.push(`/quanlytaikhoan/taikhoanphuhuynh/${record._id}`);
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
    );
  };

  const onCell = (record: ITaiKhoanPhuHuynh.Record) => ({
    onClick: !checkAllow('VIEW_TAI_KHOAN_PH')
      ? undefined
      : () => {
          setRecordPH({ ...record, idTruong });
          history.push(`/quanlytaikhoan/taikhoanphuhuynh/${record._id}`);
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
      title: 'Họ và tên',
      dataIndex: ['profile', 'fullname'],
      align: 'center',
      width: 300,
      onCell,
      search: 'search',
    },
    {
      title: 'Số điện thoại',
      dataIndex: ['profile', 'phoneNumber'],
      align: 'center',
      width: 200,
      onCell,
      search: 'search',
    },
    {
      title: 'Email',
      dataIndex: ['profile', 'email'],
      align: 'center',
      width: 250,
      onCell,
      render: (val) => val ?? 'Không có',
      search: 'search',
    },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'ngayDangKy',
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
      render: (record: ITaiKhoanPhuHuynh.Record) => renderLast(record),
      fixed: 'right',
      width: 200,
    });
  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={() => getTaiKhoanPhuHuynhModel(organizationId)}
        loading={loadingTaiKhoanPhuHuynh}
        dependencies={[page, limit, cond]}
        modelName="taikhoanphuhuynh"
        title="Quản lý tài khoản phụ huynh"
      >
        {checkAllow('IMPORT_TAI_KHOAN_PH') && (
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
        {checkAllow('IMPORT_TAI_KHOAN_PH') && (
          <Button
            style={{ marginBottom: '10px', marginLeft: '10px' }}
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
              style={{ width: '20%', marginLeft: '10px' }}
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
      <Modal
        title="Import file tài khoản phụ huynh"
        visible={visibleModalAdd}
        onCancel={() => {
          setVisibleModalAdd(false);
        }}
        footer={[]}
        destroyOnClose
      >
        <Form labelAlign="left" onFinish={onSubmit} {...formItemLayout}>
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
                        // eslint-disable-next-line no-underscore-dangle
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
    </>
  );
};

export default TaiKhoanPhuHuynh;
