/* eslint-disable no-underscore-dangle */
import type { IColumn } from '@/utils/interfaces';
import { Table } from 'antd';
import type { HoatDongNgoaiKhoa as IHoatDongNgoaiKhoa } from '@/services/HoatDongNgoaiKhoa';
import React from 'react';
import { useModel } from 'umi';

const DSHocSinhThamGia = (props: { idHoatDong?: string; donViId?: string }) => {
  const { getDanhSachThamGiaModel, danhSachThamGia, totalThamGia } = useModel('hoatdongngoaikhoa');

  React.useEffect(() => {
    getDanhSachThamGiaModel(props?.idHoatDong, props?.donViId);
  }, [props?.donViId]);

  const columns: IColumn<IHoatDongNgoaiKhoa.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 100,
    },
    {
      title: 'Họ tên con',
      dataIndex: 'hoTen',
      align: 'center',
      width: 150,
    },
    {
      title: 'Họ tên phụ huynh',
      dataIndex: 'user',
      align: 'center',
      width: 150,
      render: (val) => val?.profile?.fullname,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'user',
      align: 'center',
      width: 150,
      render: (val) => val?.profile?.phoneNumber,
    },
    {
      title: 'Lớp',
      dataIndex: 'donVi',
      align: 'center',
      width: 150,
      render: (val) => val?.tenDonVi,
    },
  ];
  return (
    <>
      <div style={{ marginBottom: '10px' }}>
        <b>Danh sách học sinh đăng ký tham gia ({totalThamGia})</b>
      </div>
      <Table
        dataSource={danhSachThamGia}
        columns={columns}
        bordered
        scroll={{ y: 400 }}
        pagination={{
          showTotal: (tongSo: number) => {
            return <div>Tổng số: {tongSo}</div>;
          },
        }}
      />
    </>
  );
};
export default DSHocSinhThamGia;
