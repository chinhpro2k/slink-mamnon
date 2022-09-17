/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import { checkAllow } from '@/components/CheckAuthority';
import TableBase from '@/components/Table';
import type { DonDanThuoc as IDonDanThuoc } from '@/services/DonDanThuoc';
import { acceptDonDanThuoc } from '@/services/DonDanThuoc/dondanthuoc';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { CheckOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  DatePicker,
  Descriptions,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Image,
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';

const DonDanThuoc = () => {
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [newRecord, setNewRecord] = useState<IDonDanThuoc.Record>();
  const {
    loading: loadingDonDanThuoc,
    getDonDanThuocModel,
    total,
    setPage,
    cond,
    page,
    limit,
  } = useModel('dondanthuoc');
  const [dsTruong, setDsTruong] = useState<any[]>([]);
  const [dsLop, setDsLop] = useState<any[]>([]);
  const vaiTro = localStorage.getItem('vaiTro');
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [idLop, setIdLop] = useState<string>();
  const [dsDonVi, setDsDonVi] = useState<any[]>([]);
  const [donViId, setDonViId] = useState<string | undefined>(organizationId);
  const [timeStart, setTimeStart] = useState(moment().endOf('date').toDate());
  const [timeEnd, setTimeEnd] = useState(moment().startOf('date').toDate());
  const [ngay, setNgay] = useState<number>(new Date().getDate());
  const [thang, setThang] = useState<number>(new Date().getMonth());
  const [nam, setNam] = useState<number>(new Date().getFullYear());

  const handleView = (record: IDonDanThuoc.Record) => {
    setNewRecord(record);
    setVisibleDrawer(true);
  };

  const onCell = (record: IDonDanThuoc.Record) => ({
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
  };

  const changeDate = (val: any) => {
    const start = moment(val).endOf('date').toDate();
    const end = moment(val).startOf('date').toDate();
    setNgay(new Date(val).getDate());
    setThang(new Date(val).getMonth());
    setNam(new Date(val).getFullYear());
    setTimeStart(start);
    setTimeEnd(end);
    setPage(1);
  };

  const handleAccept = async (record: IDonDanThuoc.Record) => {
    try {
      const result = await acceptDonDanThuoc({ id: record?._id, ngay, thang, nam });
      if (result?.data?.statusCode === 200) {
        message.success('Chấp nhận đơn thành công');
        getDonDanThuocModel(donViId, timeStart, timeEnd);
        return true;
      }
    } catch (error) {
      message.error('Chấp nhận đơn không thành công');
      return false;
    }
    return false;
  };

  const renderLast = (record: IDonDanThuoc.Record) => {
    return (
      <React.Fragment>
        <Popconfirm
          title="Bạn có chắc muốn xác nhận?"
          onConfirm={() => handleAccept(record)}
          okText="Đồng ý"
          disabled={
            record?.xacNhan?.find((item) => item?.ngay === ngay && item?.thang === thang)?.status ||
            !checkAllow('ACCEPT_DON_DAN_THUOC')
          }
        >
          <Button
            type="primary"
            shape="circle"
            title="Xác nhận"
            disabled={
              record?.xacNhan?.find((item) => item?.ngay === ngay && item?.thang === thang)
                ?.status || !checkAllow('ACCEPT_DON_DAN_THUOC')
            }
          >
            <CheckOutlined />
          </Button>
        </Popconfirm>
      </React.Fragment>
    );
  };

  const columns: IColumn<IDonDanThuoc.Record>[] = [
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
      width: 170,
      onCell,
      render: (val) => val?.hoTen ?? 'Không có',
    },
    {
      title: 'Họ tên phụ huynh',
      dataIndex: 'phuHuynh',
      align: 'center',
      width: 170,
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
      title: 'Từ ngày',
      dataIndex: 'tuNgay',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => moment(val).format('DD-MM-YYYY') ?? 'Không có',
    },
    {
      title: 'Đến ngày',
      dataIndex: 'denNgay',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => moment(val).format('DD-MM-YYYY') ?? 'Không có',
    },
    {
      title: 'Liều thuốc',
      dataIndex: 'lieuThuoc',
      align: 'center',
      width: 250,
      render: (val) =>
        val?.map((item: { tenThuoc: string; cachDung: string }, index: number) => (
          <div key={index}>
            {item?.tenThuoc} - Cách dùng: {item?.cachDung}
          </div>
        )),
      onCell,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'ghiChu',
      align: 'center',
      width: 200,
      render: (val) => val ?? 'Không có',
      onCell,
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: IDonDanThuoc.Record) => renderLast(record),
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
        getData={() => getDonDanThuocModel(donViId, timeStart, timeEnd)}
        loading={loadingDonDanThuoc}
        dependencies={[cond, page, limit, donViId, timeStart, timeEnd]}
        modelName="dondanthuoc"
        title="Đơn dặn thuốc"
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
        title="Chi tiết đơn dặn thuốc"
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
        <Descriptions>
          <Descriptions.Item label="Họ tên con" span={3}>
            {newRecord?.con?.hoTen ?? 'Không có'}
          </Descriptions.Item>
          <Descriptions.Item label="Phụ huynh" span={3}>
            {newRecord?.phuHuynh?.profile?.fullname ?? 'Không có'} -{' '}
            {newRecord?.phuHuynh?.profile?.phoneNumber ?? 'Không có'}
          </Descriptions.Item>
          <Descriptions.Item label="Lớp" span={3}>
            {newRecord?.donVi?.tenDonVi ?? 'Không có'}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian" span={3}>
            {moment(newRecord?.tuNgay).format('DD/MM/YYYY') ?? 'Không có'} -{' '}
            {moment(newRecord?.denNgay).format('DD/MM/YYYY') ?? 'Không có'}
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú" span={3}>
            {newRecord?.ghiChu ?? 'Không có'}
          </Descriptions.Item>
          {newRecord?.file?.url && (
            <Descriptions.Item label="Ảnh thuốc" span={3}>
              <Avatar shape="square" size={100} src={<Image src={newRecord?.file?.url} />} />
            </Descriptions.Item>
          )}
        </Descriptions>
        <b>Liều thuốc</b>
        <Descriptions>
          {newRecord?.lieuThuoc?.map(
            (item: { tenThuoc: string; cachDung: string }, index: number) => (
              <Descriptions.Item span={3} key={index}>
                {`- ${item?.tenThuoc ?? 'Không có'} - Cách dùng: ${item?.cachDung ?? 'Không có'}`}{' '}
              </Descriptions.Item>
            ),
          )}
        </Descriptions>
      </Modal>
    </>
  );
};

export default DonDanThuoc;
