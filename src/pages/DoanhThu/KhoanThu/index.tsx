/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { KhoanThu as IKhoanThu } from '@/services/KhoanThu';
import { delKhoanThu } from '@/services/KhoanThu/khoanthu';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, message, Popconfirm } from 'antd';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useModel } from 'umi';
import Form from '../components/FormKhoanThu';

const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
});

const KhoanThu = (props: { donViId?: string; disable?: boolean }) => {
  const {
    loading: loadingKhoanThu,
    getKhoanThuModel,
    page,
    limit,
    cond,
    setRecord,
    setVisibleForm,
    setEdit,
  } = useModel('khoanthu');

  const handleEdit = (val: any) => {
    setVisibleForm(true);
    setEdit(true);
    setRecord(val);
  };

  const handleDel = async (val: string) => {
    try {
      const res = await delKhoanThu({ id: val });
      if (res?.status === 200) {
        message.success('Xóa thành công');
        getKhoanThuModel(props?.donViId);
        return true;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return false;
  };

  const renderLast = (record: IKhoanThu.Record) => {
    return (
      <React.Fragment>
        <Button
          type="default"
          shape="circle"
          onClick={() => handleEdit(record)}
          title="Chỉnh sửa"
          disabled={props?.disable}
        >
          <EditOutlined />
        </Button>
        <Divider type="vertical" />
        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDel(record._id)}
          disabled={props?.disable}
          cancelText="Hủy"
        >
          <Button type="primary" shape="circle" title="Xóa" disabled={props?.disable}>
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      </React.Fragment>
    );
  };

  const columns: IColumn<any>[] = [
    {
      title: 'Hạng mục',
      dataIndex: 'ten',
      align: 'left',
      width: 150,
    },
    {
      title: 'Ngày nhập',
      dataIndex: 'createdAt',
      align: 'center',
      width: 150,
      render: (val) => (val ? moment(val).format('DD-MM-YYYY') : moment().format('DD-MM-YYYY')),
    },
    {
      title: 'Số tiền',
      dataIndex: 'soTien',
      align: 'center',
      width: 130,
      render: (val) => formatter.format(val ?? 0),
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: IKhoanThu.Record) => renderLast(record),
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
        getData={() => getKhoanThuModel(props?.donViId)}
        dependencies={[page, limit, cond, props?.donViId]}
        loading={loadingKhoanThu}
        modelName="khoanthu"
        Form={Form}
      />
    </>
  );
};

export default KhoanThu;
