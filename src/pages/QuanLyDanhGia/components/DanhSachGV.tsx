/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { QuanLyDanhGia as IQuanLyDanhGia } from '@/services/QuanLyDanhGia';
import type { IColumn } from '@/utils/interfaces';
import { PieChartOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { useModel } from 'umi';
import FormThongKe from './ThongKeDanhGiaGV';

const HocSinh = (props: { id?: string; tieuDe?: string }) => {
  const {
    loading: loadingGiaoVien,
    getDSGiaoVienDanhGiaModel,
    setVisibleForm,
    setEdit,
    setRecord,
    getThongKeGVModel,
  } = useModel('quanlydanhgia');

  const renderLast = (record: IQuanLyDanhGia.Record) => {
    return (
      <React.Fragment>
        <Button
          type="default"
          shape="circle"
          onClick={() => {
            setVisibleForm(true);
            setEdit(true);
            setRecord(record);
            getThongKeGVModel(record?._id);
          }}
          title="Xem kết quả"
        >
          <PieChartOutlined />
        </Button>
      </React.Fragment>
    );
  };

  const columns: IColumn<IQuanLyDanhGia.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Phụ huynh đánh giá',
      dataIndex: ['nguoiDanhGia', 'profile', 'fullname'],
      align: 'center',
      width: 200,
    },
    {
      title: 'Số điện thoại',
      dataIndex: ['nguoiDanhGia', 'profile', 'phoneNumber'],
      align: 'center',
      width: 150,
    },
    {
      title: 'Giáo viên',
      dataIndex: ['giaoVien', 'profile', 'fullname'],
      align: 'center',
      width: 150,
    },
    {
      title: 'Lớp',
      dataIndex: ['donVi', 'tenDonVi'],
      align: 'center',
      width: 150,
    },
    {
      title: 'Điểm đánh giá',
      dataIndex: 'diem',
      align: 'center',
      width: 100,
    },
    // {
    //   title: 'Số lượt đánh giá',
    //   dataIndex: 'soLuotDanhGia',
    //   align: 'center',
    //   width: 100,
    // },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: IQuanLyDanhGia.Record) => renderLast(record),
      fixed: 'right',
      width: 100,
    },
  ];

  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={() => getDSGiaoVienDanhGiaModel(props?.id)}
        loading={loadingGiaoVien}
        modelName="quanlydanhgia"
        dataState="danhSachGV"
        formType="Drawer"
        widthDrawer="50%"
        Form={FormThongKe}
      />
    </>
  );
};

export default HocSinh;
