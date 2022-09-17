/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { FormDanhGia as IFormDanhGia } from '@/services/FormDanhGia';
import type { IColumn } from '@/utils/interfaces';
import { FilePdfOutlined, PieChartOutlined } from '@ant-design/icons';
import { Button, Input, Tag } from 'antd';
import React, { useEffect } from 'react';
import { useModel } from 'umi';
import FormResult from './FormResultHS';

const HocSinh = (props: { id?: string; tieuDe?: string }) => {
  const {
    loading: loadingHocSinh,
    getDSHocSinhDanhGiaModel,
    setVisibleForm,
    setEdit,
    setRecord,
    getResultDanhGiaModel,
    page,
    limit,
    cond,
    danhSachHS,
  } = useModel('formdanhgia');
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const idLop = localStorage.getItem('idLop');

  const renderLast = (record: IFormDanhGia.Record) => {
    return (
      <React.Fragment>
        <Button
          type="default"
          shape="circle"
          onClick={() => {
            setVisibleForm(true);
            setEdit(true);
            setRecord(record);
            getResultDanhGiaModel(props?.id, record?._id);
          }}
          disabled={!record?.daDanhGia}
          title="Xem kết quả"
        >
          <FilePdfOutlined />
        </Button>
      </React.Fragment>
    );
  };

  const columns: IColumn<IFormDanhGia.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Họ và tên con',
      dataIndex: 'hoTen',
      align: 'center',
      width: 200,
      render: (val) => val ?? 'Chưa cập nhật',
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
      dataIndex: 'user',
      align: 'center',
      width: 150,
      render: (val) => val?.profile?.phoneNumber ?? 'Chưa cập nhật',
    },
    {
      title: 'Trạng thái đánh giá',
      dataIndex: 'daDanhGia',
      align: 'center',
      width: 150,
      render: (val) =>
        val ? <Tag color="blue">Đã đánh giá</Tag> : <Tag color="red">Chưa đánh giá</Tag>,
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: IFormDanhGia.Record) => renderLast(record),
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
        getData={() => getDSHocSinhDanhGiaModel(props?.id, idLop ?? organizationId)}
        loading={loadingHocSinh}
        // dependencies={[page,limit,cond]}
        Form={FormResult}
        isNotPagination={true}
        modelName="formdanhgia"
        dataState="danhSachHS"
        formType="Modal"
        widthDrawer="50%"
        scroll={{ y: 600 }}
      >
        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          Tổng số:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={danhSachHS.length}
          />
        </h3>
      </TableBase>
    </>
  );
};

export default HocSinh;
