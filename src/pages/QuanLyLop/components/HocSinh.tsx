/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { HocSinh as IHocSinh } from '@/services/HocSinh';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { CheckOutlined, CloseOutlined, QrcodeOutlined } from '@ant-design/icons';
import { Button, Divider, Input, message, Modal, Popconfirm, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import TaoCode from './TaoCode';

const HocSinh = (props: { id?: string; loai?: string; idParent?: string; sySo?: number }) => {
  const {
    loading: loadingHocSinh,
    getHocSinhModel,
    total,
    page,
    limit,
    cond,
  } = useModel('hocsinh');
  const { getDSHocSinhModel, total: totalDSHS } = useModel('xemdshocsinh');
  const [visible, setVisible] = useState<boolean>(false);
  const vaiTro = localStorage.getItem('vaiTro');
  const [recordTruong, setRecordTruong] = useState<IHocSinh.Record>();

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
    getDSHocSinhModel(props?.id);
  }, [props]);

  // Từ chối nâng cấp onl học sinh
  const handleTuChoi = async (record: IHocSinh.Record) => {
    const result = await axios.put(`${ip3}/user/nang-cap-user/thanh-toan-onl/huy/${record?._id}`);
    if (result?.status === 200) {
      message.success('Từ chối yêu cầu thành công');
      getHocSinhModel(props?.id);
      return true;
    }
    message.error('Từ chối yêu cầu không thành công');
    return false;
  };

  // duyệt nâng cấp onl học sinh
  const handleChapNhan = async (record: IHocSinh.Record) => {
    if (totalDSHS === props?.sySo) {
      message.error(
        'Không thể thêm học sinh vào lớp do sĩ số của lớp đã đủ. Vui lòng chọn nâng cấp ở lớp khác!',
      );
      return false;
    }
    const values = {
      userId: record?.userId,
      conId: record?.conId,
      vaiTro: record?.vaiTro,
      donViId: record?.donViId,
    };
    const result = await axios.put(
      `${ip3}/user/nang-cap-user/thanh-toan-onl/duyet/${record?._id}`,
      { ...values },
    );
    if (result?.status === 200) {
      message.success('Xác nhận thành công');
      getHocSinhModel(props?.id);
      getDSHocSinhModel(props?.id);
      return true;
    }
    message.error('Xác nhận không thành công');
    return false;
  };

  const renderLast = (record: IHocSinh.Record) => {
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

  const columns: IColumn<IHocSinh.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Họ và tên con',
      dataIndex: 'con',
      align: 'center',
      width: 200,
      render: (val) => val?.hoTen ?? 'Chưa cập nhật',
    },
    {
      title: 'Họ và tên phụ huynh',
      dataIndex: 'user',
      align: 'center',
      width: 200,
      render: (val) => val?.profile?.fullname ?? 'Chưa cập nhật',
    },
    {
      title: 'Số điện thoại phụ huynh',
      dataIndex: 'soDienThoai',
      align: 'center',
      width: 150,
      search: 'search',
    },
    {
      title: 'Loại thanh toán',
      dataIndex: 'loaiThanhToan',
      align: 'center',
      width: 150,
      render: (val) => (val === 'TrucTiep' ? 'Trực tiếp' : 'Thanh toán online'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      align: 'center',
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
      render: (record: IHocSinh.Record) => renderLast(record),
      fixed: 'right',
      width: 150,
    });
  }

  useEffect(() => {}, []);

  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={() => getHocSinhModel(props?.id)}
        loading={loadingHocSinh}
        dependencies={[page, limit, cond]}
        modelName="hocsinh"
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
        <TaoCode user="PhuHuynh" id={props?.id} />
      </Modal>
    </>
  );
};

export default HocSinh;
