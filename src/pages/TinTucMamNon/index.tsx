/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { TinTucMamNon as ITinTucMamNon } from '@/services/TinTucMamNon';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Divider,
  Input,
  message,
  Modal,
  Popconfirm,
  Tooltip,
  Typography,
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';
import _ from 'lodash';
import { checkAllow } from '@/components/CheckAuthority';
import { delTinTuc } from '@/services/TinTucMamNon/tintucmamnon';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

const TinTucMamNon = () => {
  const {
    loading: loadingTinTucMamNon,
    getTinTucMamNonModel,
    total,
    page,
    limit,
    cond,
    setRecord,
    setVisibleForm,
    setEdit,
  } = useModel('tintucmamnon');
  const [visible, setVisible] = useState(false);
  const [newRecord, setNewRecord] = useState<ITinTucMamNon.Record>();
  const [danhSachDonVi, setDanhSachDonVi] = useState([]);

  const getDonVi = async () => {
    const response = await axios.get(`${ip3}/don-vi/pageable`, {
      params: {
        page: 1,
        limit: 100000,
      },
    });
    setDanhSachDonVi(response?.data?.data?.result);
  };

  React.useEffect(() => {
    getDonVi();
  }, []);
  const handleEdit = (val: any) => {
    setVisibleForm(true);
    setEdit(true);
    setRecord(val);
  };
  const handleDel = async (val: any) => {
    try {
      const res = await delTinTuc({ id: val });
      if (res?.status === 200) {
        message.success('Xóa thành công');
        getTinTucMamNonModel();
        return true;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return false;
  };
  const handleView = (val: any) => {
    setNewRecord(val);
    setVisible(true);
  };

  const onCell = (record: ITinTucMamNon.Record) => ({
    onClick: () => {
      handleView(record);
    },
    style: { cursor: 'pointer' },
  });

  const renderLast1 = (record: ITinTucMamNon.Record) => {
    return (
      <React.Fragment>
        <Button
          type="primary"
          shape="circle"
          onClick={() => handleView(record)}
          title="Xem chi tiết"
        >
          <EyeOutlined />
        </Button>
        <Divider type="vertical" />

        <Button
          type="default"
          shape="circle"
          onClick={() => handleEdit(record)}
          title="Chỉnh sửa"
          disabled={!checkAllow('EDIT_TIN_TUC')}
        >
          <EditOutlined />
        </Button>

        <Divider type="vertical" />

        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDel(record._id)}
          disabled={!checkAllow('DEL_TIN_TUC')}
        >
          <Button type="primary" shape="circle" title="Xóa" disabled={!checkAllow('DEL_TIN_TUC')}>
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      </React.Fragment>
    );
  };

  const columns: IColumn<ITinTucMamNon.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'tieuDe',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => val ?? 'Không có',
      search: 'search',
    },
    {
      title: 'Loại tin tức',
      dataIndex: 'loaiTinTuc',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => (val === 'TRUONG' ? 'Tin trường' : val === 'LOP' ? 'Tin lớp' : 'Tin chung'),
    },
    {
      title: 'Đơn vị',
      dataIndex: 'donViTaoTinId',
      align: 'center',
      width: 150,
      onCell,
      render: (val) =>
        val ? danhSachDonVi?.filter((item) => item?._id === val)?.[0]?.tenDonVi ?? '' : 'Tin chung',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      align: 'center',
      width: 100,
      onCell,
      render: (val) => moment(val).format('DD/MM/YYYY') ?? 'Không có',
    },
    {
      title: 'Ngày đăng',
      dataIndex: 'ngayDang',
      align: 'center',
      width: 100,
      onCell,
      render: (val) => moment(val).format('DD/MM/YYYY') ?? moment().format('DD/MM/YYYY'),
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: ITinTucMamNon.Record) => renderLast1(record),
      fixed: 'right',
      width: 150,
    },
  ];

  useEffect(() => {}, []);

  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={getTinTucMamNonModel}
        dependencies={[page, limit, cond]}
        loading={loadingTinTucMamNon}
        modelName="tintucmamnon"
        title="Danh sách bài viết"
        scroll={{ x: 1000 }}
        Form={Form}
        formType="Drawer"
        widthDrawer="60%"
        hascreate={checkAllow('ADD_TIN_TUC')}
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
        visible={visible}
        centered
        width="80vw"
        closable
        onCancel={() => setVisible(false)}
        footer={[
          <Button type="primary" key="back" onClick={() => setVisible(false)}>
            OK
          </Button>,
        ]}
      >
        <div>
          <Tooltip placement="bottom" title={newRecord?.tieuDe}>
            <Typography.Title level={3}>{newRecord?.tieuDe}</Typography.Title>
          </Tooltip>
          <Card.Meta
            avatar={
              newRecord?.anhDaiDien !== undefined ? (
                <Avatar src={_.get(newRecord.anhDaiDien, 'url', null)} size="large" />
              ) : (
                <Avatar icon="user" size="large" />
              )
            }
            description={
              <div>
                <div>{newRecord?.moTa}</div>
                <i>Ngày đăng: {moment(newRecord?.ngayDang).format('DD/MM/YYYY')}</i>
              </div>
            }
          />
          {newRecord?.noiDung !== undefined ? (
            <p style={{ marginTop: 20 }} dangerouslySetInnerHTML={{ __html: newRecord?.noiDung }} />
          ) : null}
        </div>
      </Modal>
    </>
  );
};

export default TinTucMamNon;
