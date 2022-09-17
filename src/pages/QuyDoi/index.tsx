import { Button, Divider, Input, message, Popconfirm } from 'antd';
import TableBase from '@/components/Table';
import React from 'react';
import { IColumn } from '@/utils/interfaces';
import { IQuiDoi } from '@/services/QuyDoi';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useModel } from '@@/plugin-model/useModel';
import FormCreate from '@/pages/QuyDoi/components/formCreate';

const QuyDoi = () => {
  const {
    loading: loadingThongBao,
    getQuyDoiModel,
    total,
    page,
    limit,
    cond,
    deleteQuyDoiModel,
  } = useModel('quydoi');
  const renderLast1 = (record: IQuiDoi.Record) => {
    return (
      <React.Fragment>
        {/*<Button*/}
        {/*  type="default"*/}
        {/*  shape="circle"*/}
        {/*  // onClick={() => handleView(record)}*/}
        {/*  title="Xem chi tiết"*/}
        {/*>*/}
        {/*  <EyeOutlined />*/}
        {/*</Button>*/}
        {/*<Divider type="vertical" />*/}
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa"
          onConfirm={() => {
            deleteQuyDoiModel(record?._id).then(() => {
              message.success('Xóa thành công!');
              getQuyDoiModel();
            });
          }}
          // onCancel={cancel}
          okText="Xóa"
          cancelText="Cancel"
        >
          <Button
            type="default"
            shape="circle"
            // onClick={() => handleView(record)}
            title="Xóa"
          >
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      </React.Fragment>
    );
  };
  const columns: IColumn<IQuiDoi.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Tên thực phẩm',
      dataIndex: ['thucPham', 'tenDayDu'],
      align: 'center',
      width: 150,
      render: (val) => val ?? 'Không có',
    },
    {
      title: 'Giá trị quy đổi',
      dataIndex: 'giaTriDonViQuyDoi',
      align: 'center',
      width: 200,
      render: (val) => val ?? 'Không có',
    },
    {
      title: 'Đơn vị quy đổi',
      dataIndex: 'donViQuyDoi',
      align: 'center',
      width: 150,
      render: (val) => val ?? 'Không có',
    },

    {
      title: 'Giá trị được quy đổi',
      dataIndex: 'giaTriDonViDuocQuyDoi',
      align: 'center',
      width: 150,
      render: (val) => val ?? 'Không có',
    },
    {
      title: 'Đơn vị được quy đổi',
      dataIndex: 'donViDuocQuyDoi',
      align: 'center',
      width: 150,
      render: (val) => val ?? 'Không có',
    },

    {
      title: 'Thao tác',
      align: 'center',
      render: (record: IThongBao.Record) => renderLast1(record),
      fixed: 'right',
      width: 100,
    },
  ];
  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={() => {
          getQuyDoiModel();
        }}
        dependencies={[page, limit, cond]}
        loading={loadingThongBao}
        modelName="quydoi"
        title="Quy đổi"
        scroll={{ x: 1000 }}
        Form={FormCreate}
        formType="Drawer"
        widthDrawer="60%"
        hascreate={true}
      >
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
export default QuyDoi;
