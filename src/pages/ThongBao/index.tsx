/* eslint-disable no-underscore-dangle */
import { checkAllow } from '@/components/CheckAuthority';
import TableBase from '@/components/Table';
import type { ThongBao as IThongBao } from '@/services/ThongBao';
import type { IColumn } from '@/utils/interfaces';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Input, Modal } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';

const ThongBao = () => {
  const {
    loading: loadingThongBao,
    getThongBaoModel,
    total,
    page,
    limit,
    cond,
  } = useModel('thongbao');
  const [visibleView, setVisibleView] = useState<boolean>(false);
  const [recordThongBao, setRecordThongBao] = useState<IThongBao.Record>();
  const initialStateModel = useModel('@@initialState');
  // const currentUser = initialStateModel?.currentUser;
  const handleView = (val: any) => {
    setVisibleView(true);
    setRecordThongBao(val);
  };

  const onCell = (record: IThongBao.Record) => ({
    onClick: () => {
      handleView(record);
    },
    style: { cursor: 'pointer' },
  });

  const renderLast1 = (record: IThongBao.Record) => {
    return (
      <React.Fragment>
        <Button
          type="default"
          shape="circle"
          onClick={() => handleView(record)}
          title="Xem chi tiết"
        >
          <EyeOutlined />
        </Button>
      </React.Fragment>
    );
  };

  const columns: IColumn<IThongBao.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => val ?? 'Không có',
    },
    {
      title: 'Mô tả',
      dataIndex: 'content',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => val ?? 'Không có',
    },
    {
      title: 'Thời gian gửi',
      dataIndex: 'sentAt',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => (val ? moment(val).format('HH:mm DD/MM/YYYY') : 'Không có'),
    },
    {
      title: 'Người gửi',
      dataIndex: 'senderID',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => val?.profile?.fullname ?? 'Không có',
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: IThongBao.Record) => renderLast1(record),
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
        getData={() => {
          getThongBaoModel(undefined, initialStateModel?.initialState?.currentUser?._id);
        }}
        dependencies={[page, limit, cond]}
        loading={loadingThongBao}
        modelName="thongbao"
        title="Thông báo"
        scroll={{ x: 1000 }}
        Form={Form}
        formType="Drawer"
        widthDrawer="60%"
        hascreate={checkAllow('ADD_THONG_BAO')}
      >
        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          Tổng số:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={total}
          />
        </h3>
      </TableBase>
      <Modal
        title="Chi tiết thông báo"
        width="60%"
        visible={visibleView}
        onCancel={() => setVisibleView(false)}
        footer={<Button onClick={() => setVisibleView(false)}>Ok</Button>}
        destroyOnClose
      >
        <div>
          <div style={{ fontWeight: 600, fontSize: '18px', marginBottom: '5px' }}>
            {recordThongBao?.title}
          </div>
          <div style={{ fontSize: '16px', marginBottom: '5px' }}>{recordThongBao?.content}</div>
          <div
            dangerouslySetInnerHTML={{ __html: recordThongBao?.htmlContent || '' }}
            style={{ width: '100%', overflowX: 'auto', fontSize: '15px' }}
          />
        </div>
      </Modal>
    </>
  );
};

export default ThongBao;
