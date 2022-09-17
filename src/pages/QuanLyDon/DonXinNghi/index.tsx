/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import TableBase from '@/components/Table';
import type { DonXinNghi as IDonXinNghi } from '@/services/DonXinNghi';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, Modal, Row, Select } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const DonXinNghi = () => {
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [newRecord, setNewRecord] = useState<IDonXinNghi.Record>();
  const {
    loading: loadingDonXinNghi,
    getDonXinNghiModel,
    total,
    setPage,
    cond,
    page,
    limit,
  } = useModel('donxinnghi');
  const [dsTruong, setDsTruong] = useState<any[]>([]);
  const [dsLop, setDsLop] = useState<any[]>([]);
  const vaiTro = localStorage.getItem('vaiTro');
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [idLop, setIdLop] = useState<string>();
  const [dsDonVi, setDsDonVi] = useState<any[]>([]);
  const [donViId, setDonViId] = useState<string | undefined>(organizationId);
  const [ngay, setNgay] = useState<number>(new Date().getDate());
  const [thang, setThang] = useState<number>(new Date().getMonth());
  const [nam, setNam] = useState<number>(new Date().getFullYear());

  const handleView = (record: IDonXinNghi.Record) => {
    setNewRecord(record);
    setVisibleDrawer(true);
  };

  const onCell = (record: IDonXinNghi.Record) => ({
    onClick: () => {
      handleView(record);
    },
    style: { cursor: 'pointer' },
  });
  const donVi = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=100`);
    const arrTruong = [];
    arrTruong.push({ tenDonVi: 'Tất cả các trường', _id: 'Tất cả' });
    result?.data?.data?.result?.map(
      (item: { loaiDonVi: string }) => item?.loaiDonVi === 'Truong' && arrTruong.push(item),
    );
    const arrLop: any = [];
    arrLop.push({ tenDonVi: 'Tất cả các lớp', _id: 'Tất cả' });
    if (organizationId) {
      result?.data?.data?.result?.map(
        (item: { parent: string }) => item?.parent === organizationId && arrLop.push(item),
      );
    } else {
      result?.data?.data?.result?.map(
        (item: { loaiDonVi: string }) => item?.loaiDonVi === 'Lop' && arrLop.push(item),
      );
    }
    setDsDonVi(result?.data?.data?.result);
    setDsTruong(arrTruong);
    setDsLop(arrLop);
  };
  React.useEffect(() => {
    donVi();
  }, []);

  const onChange = (value: string) => {
    setDonViId(value);
    getDonXinNghiModel(value, ngay, thang, nam);
    setIdLop(undefined);
    setPage(1);
    const arrLop: any[] = [];
    if (value === 'Tất cả') {
      dsDonVi?.map((item) => item?.loaiDonVi === 'Lop' && arrLop.push(item));
    }
    dsDonVi?.map((item) => item?.parent === value && arrLop.push(item));
    setDsLop(arrLop);
  };

  const onChangeLop = (value: string) => {
    setDonViId(value);
    setIdLop(value);
    setPage(1);
    getDonXinNghiModel(value, ngay, thang, nam);
  };

  const changeDate = (val: any) => {
    setNgay(new Date(val).getDate());
    setThang(new Date(val).getMonth());
    setNam(new Date(val).getFullYear());
    getDonXinNghiModel(
      donViId,
      new Date(val).getDate(),
      new Date(val).getMonth(),
      new Date(val).getFullYear(),
    );
    setPage(1);
  };

  const renderLast = (record: IDonXinNghi.Record) => {
    return (
      <React.Fragment>
        <Button type="default" shape="circle" title="Xem thêm" onClick={() => handleView(record)}>
          <EyeOutlined />
        </Button>
      </React.Fragment>
    );
  };

  const columns: IColumn<IDonXinNghi.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'Họ tên con',
      dataIndex: 'con',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => val?.hoTen ?? 'Không có',
      search: 'search',
    },
    {
      title: 'Họ tên phụ huynh',
      dataIndex: 'phuHuynh',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => val?.profile?.fullname ?? 'Không có',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phuHuynh',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => val?.profile?.phoneNumber ?? 'Không có',
    },
    {
      title: 'Đơn vị',
      dataIndex: 'donVi',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => val?.tenDonVi ?? 'Không có',
    },
    {
      title: 'Ngày xin nghỉ',
      dataIndex: 'thoiGianXinNghi',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => moment(val).format('DD-MM-YYYY') ?? 'Không có',
    },
    {
      title: 'Lý do',
      dataIndex: 'lyDo',
      align: 'center',
      width: 200,
      render: (val) => val ?? 'Không có',
      onCell,
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: IDonXinNghi.Record) => renderLast(record),
      fixed: 'right',
      width: 100,
    },
  ];

  useEffect(() => {}, []);

  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={() => getDonXinNghiModel(donViId, ngay, thang, nam)}
        loading={loadingDonXinNghi}
        dependencies={[cond, page, limit]}
        modelName="donxinnghi"
        title="Đơn xin nghỉ học"
        scroll={{ x: 1000 }}
      >
        <DatePicker
          onChange={changeDate}
          defaultValue={moment()}
          format="DD-MM-YYYY"
          placeholder="Chọn ngày"
          style={{ marginRight: '10px' }}
        />
        {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
          <Select
            showSearch
            defaultValue="Tất cả"
            style={{ width: '15%', marginRight: '10px' }}
            placeholder="Chọn trường"
            optionFilterProp="children"
            onChange={onChange}
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {dsTruong?.map((item) => (
              <Select.Option key={item?._id} value={item?._id}>
                {item?.tenDonVi}
              </Select.Option>
            ))}
          </Select>
        )}
        {vaiTro !== 'GiaoVien' && (
          <Select
            showSearch
            value={idLop}
            style={{ width: '15%' }}
            defaultValue={vaiTro !== 'SuperAdmin' && vaiTro !== 'Admin' ? 'Tất cả' : undefined}
            placeholder="Chọn lớp"
            optionFilterProp="children"
            notFoundContent="Không có lớp"
            onChange={onChangeLop}
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {dsLop?.map((item) => (
              <Select.Option value={item?._id}>{item?.tenDonVi}</Select.Option>
            ))}
          </Select>
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
        title="Chi tiết đơn xin nghỉ học"
        visible={visibleDrawer}
        onCancel={() => {
          setVisibleDrawer(false);
        }}
        footer={
          <Button type="primary" onClick={() => setVisibleDrawer(false)}>
            Ok
          </Button>
        }
      >
        <Form {...formItemLayout}>
          <Row gutter={[16, 0]}>
            <Col xl={12} xs={24}>
              <Form.Item label="Họ tên con" style={{ marginBottom: 5 }}>
                <Input value={newRecord?.con?.hoTen ?? 'Không có'} disabled />
              </Form.Item>
            </Col>
            <Col xl={12} xs={24}>
              <Form.Item label="Họ tên phụ huynh" style={{ marginBottom: 5 }}>
                <Input value={newRecord?.phuHuynh?.profile?.fullname ?? 'Không có'} disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 0]}>
            <Col xl={12} xs={24}>
              <Form.Item label="Số điện thoại" style={{ marginBottom: 5 }}>
                <Input value={newRecord?.phuHuynh?.profile?.phoneNumber ?? 'Không có'} disabled />
              </Form.Item>
            </Col>
            <Col xl={12} xs={24}>
              <Form.Item label="Ngày xin nghỉ" style={{ marginBottom: 5 }}>
                <DatePicker
                  value={moment(newRecord?.thoiGianXinNghi) ?? moment()}
                  format="DD-MM-YYYY"
                  disabled
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Col span={24}>
            <Form.Item label="Lớp" style={{ marginBottom: 5 }}>
              <Input value={newRecord?.donVi?.tenDonVi ?? 'Không có'} disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Lý do xin nghỉ" style={{ marginBottom: 5 }}>
              <Input.TextArea value={newRecord?.lyDo ?? 'Không có'} disabled rows={3} />
            </Form.Item>
          </Col>
        </Form>
      </Modal>
    </>
  );
};

export default DonXinNghi;
