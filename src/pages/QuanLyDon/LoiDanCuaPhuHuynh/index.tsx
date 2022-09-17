/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import TableBase from '@/components/Table';
import type { LoiDanCuaPhuHuynh as ILoiDanCuaPhuHuynh } from '@/services/LoiDanCuaPhuHuynh';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { EyeOutlined } from '@ant-design/icons';
import { Avatar, Button, DatePicker, Descriptions, Image, Input, Modal, Select } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';

const LoiDanCuaPhuHuynh = () => {
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [newRecord, setNewRecord] = useState<ILoiDanCuaPhuHuynh.Record>();
  const {
    loading: loadingLoiDanCuaPhuHuynh,
    getLoiDanCuaPhuHuynhModel,
    total,
    setPage,
    cond,
    page,
    limit,
  } = useModel('loidancuaphuhuynh');
  const [dsTruong, setDsTruong] = useState<any[]>([]);
  const [dsLop, setDsLop] = useState<any[]>([]);
  const vaiTro = localStorage.getItem('vaiTro');
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [idLop, setIdLop] = useState<string>();
  const [dsDonVi, setDsDonVi] = useState<any[]>([]);
  const [donViId, setDonViId] = useState<string | undefined>(organizationId);
  const [timeStart, setTimeStart] = useState(moment().startOf('date').toDate());
  const [timeEnd, setTimeEnd] = useState(moment().endOf('date').toDate());

  const handleView = (record: ILoiDanCuaPhuHuynh.Record) => {
    setNewRecord(record);
    setVisibleDrawer(true);
  };

  const onCell = (record: ILoiDanCuaPhuHuynh.Record) => ({
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
    getLoiDanCuaPhuHuynhModel(value, timeStart, timeEnd);
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
    if (val === null) {
      setTimeStart(val);
      setTimeEnd(val);
    } else {
      const start = moment(val).startOf('date').toDate();
      const end = moment(val).endOf('date').toDate();
      setTimeStart(start);
      setTimeEnd(end);
      setPage(1);
    }
  };

  const renderLast = (record: ILoiDanCuaPhuHuynh.Record) => {
    return (
      <React.Fragment>
        <Button type="default" shape="circle" title="Xem thêm" onClick={() => handleView(record)}>
          <EyeOutlined />
        </Button>
      </React.Fragment>
    );
  };

  const columns: IColumn<ILoiDanCuaPhuHuynh.Record>[] = [
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
      width: 220,
      onCell,
      render: (val) => val?.hoTen ?? 'Không có',
    },
    {
      title: 'Họ tên phụ huynh',
      dataIndex: 'phuHuynh',
      align: 'center',
      width: 200,
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
      title: 'Loại lời nhắn',
      dataIndex: 'loaiLoiNhan',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => val ?? 'Không có',
      search: 'filterString',
    },
    {
      title: 'Lớp',
      dataIndex: 'donVi',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => val?.tenDonVi ?? 'Không có',
    },
    {
      title: 'Ngày nhắn',
      dataIndex: 'createdAt',
      align: 'center',
      width: 150,
      render: (val) => moment(val).format('DD/MM/YYYY') ?? 'Không có',
      onCell,
    },
    {
      title: 'Nội dung lời nhắn',
      dataIndex: 'noiDung',
      align: 'center',
      width: 200,
      render: (val) => val ?? 'Không có',
      onCell,
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: ILoiDanCuaPhuHuynh.Record) => renderLast(record),
      fixed: 'right',
      width: 100,
    },
  ];
  if (vaiTro !== 'GiaoVien')
    columns.splice(8, 0, {
      title: 'Chuyên mục',
      dataIndex: 'chuyenMuc',
      align: 'center',
      width: 170,
      render: (val) => val ?? 'Không có',
      onCell,
    });

  useEffect(() => {}, []);

  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={() => getLoiDanCuaPhuHuynhModel(donViId, timeStart, timeEnd)}
        loading={loadingLoiDanCuaPhuHuynh}
        dependencies={[cond, page, limit, donViId, timeStart, timeEnd]}
        modelName="loidancuaphuhuynh"
        title="Danh sách lời nhắn của phụ huynh"
        scroll={{ x: 1300 }}
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
              <Select.Option key={item?._id} value={item?._id}>
                {item?.tenDonVi}
              </Select.Option>
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
        title="Chi tiết lời nhắn của phụ huynh"
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
          <Descriptions.Item label="Ngày nhắn" span={3}>
            {moment(newRecord?.ngayNhan).format('DD/MM/YYYY') ?? 'Không có'}
          </Descriptions.Item>
          <Descriptions.Item label="Loại lời nhắn" span={3}>
            {newRecord?.loaiLoiNhan}
            {newRecord?.loaiLoiNhan === 'Giáo viên' &&
              ` - ${newRecord?.giaoVien?.profile?.fullname}`}
          </Descriptions.Item>
          {newRecord?.chuyenMuc && (
            <Descriptions.Item label="Chuyên mục" span={3}>
              {newRecord?.chuyenMuc}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Nội dung lời nhắn" span={3}>
            {newRecord?.noiDung ?? 'Không có'}
          </Descriptions.Item>
          {newRecord?.file?.url && (
            <Descriptions.Item label="Ảnh đính kèm" span={3}>
              <Avatar shape="square" size={100} src={<Image src={newRecord?.file?.url} />} />
            </Descriptions.Item>
          )}
        </Descriptions>
      </Modal>
    </>
  );
};

export default LoiDanCuaPhuHuynh;
