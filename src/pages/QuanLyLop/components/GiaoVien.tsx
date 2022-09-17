/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { GiaoVien as IGiaoVien } from '@/services/GiaoVien';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { CheckOutlined, CloseOutlined, QrcodeOutlined } from '@ant-design/icons';
import { Button, Descriptions, Divider, Input, message, Modal, Popconfirm, Tag } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import TaoCode from './TaoCode';

const GiaoVien = (props: { id?: string; loai?: string; idParent?: string }) => {
  const {
    loading: loadingGiaoVien,
    getGiaoVienModel,
    total,
    page,
    limit,
    cond,
  } = useModel('giaovien');
  const { getDSGiaoVienModel } = useModel('xemdsgiaovien');
  const [visible, setVisible] = useState<boolean>(false);
  const [visibleThongTin, setVisibleThongTin] = useState<boolean>(false);
  const [newRecord, setNewRecord] = useState<IGiaoVien.Record>();
  const [recordTruong, setRecordTruong] = useState<IGiaoVien.Record>();
  const vaiTro = localStorage.getItem('vaiTro');

  const getTruong = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=100`, {
      params: { cond: { loaiDonVi: 'Truong' } },
    });
    setRecordTruong(
      result?.data?.data?.result?.find((item: { _id: string }) => item?._id === props?.idParent),
    );
  };

  React.useEffect(() => {
    getTruong();
  }, [props]);

  // duyệt nâng cấp onl giáo viên
  const handleChapNhan = async (record: IGiaoVien.Record) => {
    const values = {
      userId: record?.userId,
      vaiTro: record?.vaiTro,
      donViId: record?.donViId,
    };
    const result = await axios.put(
      `${ip3}/user/nang-cap-user/thanh-toan-onl/duyet/${record?._id}`,
      {
        ...values,
      },
    );
    if (result?.status === 200) {
      message.success('Xác nhận thành công');
      getGiaoVienModel(props?.id);
      getDSGiaoVienModel(props?.id);
      return true;
    }
    message.error('Xác nhận không thành công');
    return false;
  };

  // Từ chối nâng cấp onl giáo viên
  const handleTuChoi = async (record: IGiaoVien.Record) => {
    const result = await axios.put(`${ip3}/user/nang-cap-user/thanh-toan-onl/huy/${record?._id}`);
    if (result?.status === 200) {
      message.success('Từ chối yêu cầu thành công');
      getGiaoVienModel(props?.id);
      return true;
    }
    message.error('Từ chối yêu cầu không thành công');
    return false;
  };

  const handleView = (record: IGiaoVien.Record) => {
    setNewRecord(record);
    setVisibleThongTin(true);
  };

  const onCell = (record: IGiaoVien.Record) => ({
    onClick: () => {
      handleView(record);
    },
    style: { cursor: 'pointer' },
  });

  const renderLast = (record: IGiaoVien.Record) => {
    return (
      <React.Fragment>
        <Button
          type="default"
          shape="circle"
          onClick={() => handleChapNhan(record)}
          title="Chấp nhận"
          disabled={record?.trangThai === 'Đã xử lý' || record?.trangThai === 'Từ chối'}
        >
          <CheckOutlined />
        </Button>
        <Divider type="vertical" />

        <Popconfirm
          title="Bạn có chắc chắn muốn từ chối?"
          onConfirm={() => handleTuChoi(record)}
          disabled={record?.trangThai === 'Đã xử lý' || record?.trangThai === 'Từ chối'}
        >
          <Button
            type="primary"
            shape="circle"
            title="Từ chối"
            disabled={record?.trangThai === 'Đã xử lý' || record?.trangThai === 'Từ chối'}
          >
            <CloseOutlined />
          </Button>
        </Popconfirm>
      </React.Fragment>
    );
  };

  const columns: IColumn<IGiaoVien.Record>[] = [
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
      render: (val, value) => <div>{value?.user?.profile?.fullname}</div>,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'soDienThoai',
      align: 'center',
      width: 150,
      onCell,
      search: 'search',
    },
    {
      title: 'Loại thanh toán',
      dataIndex: 'loaiThanhToan',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => (val === 'TrucTiep' ? 'Trực tiếp' : 'Thanh toán online'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      align: 'center',
      onCell,
      width: 150,
      render: (val) =>
        // eslint-disable-next-line no-nested-ternary
        val === 'Đã xử lý' ? (
          <Tag color="blue">Đã xử lý</Tag>
        ) : val === 'Từ chối' ? (
          <Tag color="purple">Từ chối</Tag>
        ) : (
          <Tag color="red">Chưa xử lý</Tag>
        ),
    },
  ];

  if (
    props.loai === 'Nâng cấp' &&
    (vaiTro === 'SuperAdmin' || vaiTro === 'Admin' || vaiTro === 'HieuTruong')
  ) {
    columns.push({
      title: 'Thao tác',
      align: 'center',
      render: (record: IGiaoVien.Record) => renderLast(record),
      fixed: 'right',
      width: 100,
    });
  }

  useEffect(() => {}, []);

  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={() => getGiaoVienModel(props?.id)}
        loading={loadingGiaoVien}
        dependencies={[page, limit, cond]}
        modelName="giaovien"
        scroll={{ x: 1000 }}
      >
        {props?.loai === 'Nâng cấp' && recordTruong?.hinhThucThanhToan === 'TrucTiep' && (
          <Button
            type="primary"
            onClick={() => {
              setVisible(true);
            }}
          >
            <QrcodeOutlined />
            Tạo mã code
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
      <Modal
        title="Tạo mã code"
        visible={visible}
        destroyOnClose
        footer={[]}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <TaoCode user="GiaoVien" id={props?.id} />
      </Modal>
      <Modal
        title="Thông tin giáo viên"
        visible={visibleThongTin}
        width="60%"
        footer={
          <Button
            type="primary"
            onClick={() => {
              setVisibleThongTin(false);
            }}
          >
            Ok
          </Button>
        }
        onCancel={() => {
          setVisibleThongTin(false);
        }}
      >
        <Descriptions bordered>
          <Descriptions.Item label="Họ và tên">
            {newRecord?.user.profile?.fullname ?? 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label="Giới tính">
            {newRecord?.user.profile?.gender === 'Male' ? 'Nam' : 'Nữ'}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {newRecord?.user.profile?.phoneNumber ?? 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {newRecord?.user.profile?.email ?? 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {moment(newRecord?.user.profile?.dateOfBirth).format('DD-MM-YYYY') ?? moment()}
          </Descriptions.Item>
          <Descriptions.Item label="Trình độ">
            {newRecord?.user.profile?.trinhDo ?? 'Chưa cập nhật'}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};

export default GiaoVien;
