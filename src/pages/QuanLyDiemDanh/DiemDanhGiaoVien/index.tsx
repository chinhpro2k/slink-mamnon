/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { DiemDanhGiaoVien as IDiemDanhGiaoVien } from '@/services/DiemDanhGiaoVien';
import { xuLyDiemDanhGV } from '@/services/DiemDanhGiaoVien/diemdanhgiaovien';
import type { IColumn } from '@/utils/interfaces';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, DatePicker, Divider, Input, message, Popconfirm, Switch, Tag } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

const DiemDanhGiaoVien = () => {
  const {
    loading: loadingDiemDanhGiaoVien,
    getDiemDanhGiaoVienModel,
    total,
    page,
    limit,
    cond,
    setPage,
    doiTrangThai,
    danhSach,
  } = useModel('diemdanhgiaovien');
  const { initialState } = useModel('@@initialState');
  const donViId = initialState?.currentUser?.role?.organizationId;
  const [ngay, setNgay] = useState<number>(new Date().getDate());
  const [thang, setThang] = useState<number>(new Date().getMonth());
  const [nam, setNam] = useState<number>(new Date().getFullYear());
  const [dsGiaoVien, setDSGiaoVien] = useState([]);
  console.log(danhSach, 'danhSach');
  const getGiaoVien = async () => {
    const result = await axios.get(
      `${ip3}/user/pageable/organization/${donViId}?systemRole=GiaoVien&page=1&limit=10000`,
    );
    setDSGiaoVien(result?.data?.data?.result);
  };

  React.useEffect(() => {
    getGiaoVien();
  }, []);

  const handleXuLy = async (record: IDiemDanhGiaoVien.Record, trangThai: string) => {
    try {
      const result = await xuLyDiemDanhGV({ id: record?._id, trangThai });
      if (result?.data?.statusCode === 200) {
        message.success('Xử lý thành công');
        getDiemDanhGiaoVienModel(donViId, ngay, thang, nam);
      }
    } catch (error) {
      message.error('Xử lý không thành công');
    }
  };

  const changeDate = (val: any) => {
    setNgay(new Date(val).getDate());
    setThang(new Date(val).getMonth());
    setNam(new Date(val).getFullYear());
    getDiemDanhGiaoVienModel(
      donViId,
      new Date(val).getDate(),
      new Date(val).getMonth(),
      new Date(val).getFullYear(),
    );
    setPage(1);
  };

  const renderLast1 = (record: IDiemDanhGiaoVien.Record) => {
    return (
      <React.Fragment>
        <Button
          type="default"
          shape="circle"
          onClick={() => handleXuLy(record, 'Đã đi làm')}
          title="Xác nhận"
          disabled={
            record?.trangThai === 'Đã đi làm' ||
            record?.trangThai === 'Không đi làm' ||
            record?.trangThai === 'Chưa chấm công'
          }
        >
          <CheckOutlined />
        </Button>
        <Divider type="vertical" />

        <Popconfirm
          title="Bạn có chắc chắn muốn từ chối?"
          onConfirm={() => handleXuLy(record, 'Không đi làm')}
          placement="topRight"
          disabled={
            record?.trangThai === 'Đã đi làm' ||
            record?.trangThai === 'Không đi làm' ||
            record?.trangThai === 'Chưa chấm công'
          }
        >
          <Button
            type="primary"
            shape="circle"
            title="Từ chối"
            disabled={
              record?.trangThai === 'Đã đi làm' ||
              record?.trangThai === 'Không đi làm' ||
              record?.trangThai === 'Chưa chấm công'
            }
          >
            <CloseOutlined />
          </Button>
        </Popconfirm>
      </React.Fragment>
    );
  };

  const columns: IColumn<IDiemDanhGiaoVien.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Họ tên',
      dataIndex: 'user',
      align: 'center',
      width: 150,
      // render: (val) =>
      //   dsGiaoVien?.map((item: { _id: string; profile: { fullname: string } }, index: number) =>
      //     item?._id === val ? <div key={index}>{item?.profile?.fullname}</div> : undefined,
      //   ),
      render: (val) => val?.profile?.fullname ?? '',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'user',
      align: 'center',
      width: 200,
      // render: (val) =>
      //   dsGiaoVien?.map((item: { _id: string; profile: { phoneNumber: string } }, index: number) =>
      //     item?._id === val ? <div key={index}>{item?.profile?.phoneNumber}</div> : undefined,
      //   ),
      render: (val) => val?.profile?.phoneNumber ?? '',
    },
    {
      title: 'Thời gian điểm danh',
      dataIndex: 'thoiGianChamCong',
      align: 'center',
      width: 150,
      render: (val) => moment(val).format('HH:mm DD/MM/YYYY') ?? 'Không có',
    },
    {
      title: 'Trạng thái điểm danh',
      dataIndex: 'trangThai',
      align: 'center',
      width: 150,
      render: (val, record) => {
        return val === 'Đã đi làm' || val === 'Không đi làm' || val === 'Chưa chấm công' ? (
          <Switch
            // defaultChecked={val === 'Đã đi làm'}
            checked={val === 'Đã đi làm'}
            checkedChildren="Đã đi làm"
            unCheckedChildren="Không đi làm"
            // disabled={val === 'Chưa chấm công'}
            onChange={async (value) => {
              await doiTrangThai(
                record?._id,
                value ? 'Đã đi làm' : 'Không đi làm',
                donViId,
                ngay,
                thang,
                nam,
              );
            }}
          />
        ) : (
          val
        );
      },
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: IDiemDanhGiaoVien.Record) => renderLast1(record),
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
        getData={() => getDiemDanhGiaoVienModel(donViId, ngay, thang, nam)}
        dependencies={[page, limit, cond]}
        loading={loadingDiemDanhGiaoVien}
        modelName="diemdanhgiaovien"
        title="Điểm danh giáo viên"
        scroll={{ x: 1000 }}
        formType="Drawer"
        widthDrawer="60%"
      >
        <DatePicker
          onChange={changeDate}
          defaultValue={moment()}
          format="DD-MM-YYYY"
          placeholder="Chọn ngày"
          style={{ marginRight: '10px' }}
          disabledDate={(current) => {
            return current && current > moment().endOf('day');
          }}
        />
        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          Tổng số:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={total}
          />
        </h3>
      </TableBase>
    </>
  );
};

export default DiemDanhGiaoVien;
