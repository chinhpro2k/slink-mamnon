import TableBase from '@/components/Table';
import { checkAllow } from '@/components/CheckAuthority';
import { Button, Divider, Input, Popconfirm, Select, Tag } from 'antd';
import {
  CloseOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleFilled,
  RetweetOutlined,
} from '@ant-design/icons';
import React from 'react';
import { useModel } from '@@/plugin-model/useModel';
import { IColumn } from '@/utils/interfaces';
import { TaiKhoanHieuTruong as ITaiKhoanHieuTruong } from '@/services/TaiKhoanHieuTruong';
import moment from 'moment';
import { ITrongMuon } from '@/services/TrongMuon';
import FormThemMoi from './components/formThemMoi';

const QuanLyTrongMuon = () => {
  const {
    getDataTrongMuon,
    page,
    limit,
    cond,
    loading,
    total,
    confirmTrongMuonModel,
    setVisibleForm,
  } = useModel('trongmuon');
  const renderLast = (record: ITrongMuon.Record) => {
    return (
      <React.Fragment>
        <Button
          type="default"
          shape="circle"
          onClick={() => {
            // handleView(record);
          }}
          title="Xem chi tiết"
        >
          <EyeOutlined />
        </Button>

        {record?.trangThai === 'Chưa duyệt' && (
          <>
            <Divider type="vertical" />
            <Popconfirm
              title="Bạn có chắc chắn muốn duyệt?"
              onConfirm={() => {
                confirmTrongMuonModel(record._id, 'Đã duyệt').then(() => {
                  getDataTrongMuon();
                });
              }}
            >
              <Button
                type="default"
                shape="circle"
                // onClick={() => {
                //   confirmTrongMuonModel(record._id, 'Đã duyệt').then(() => {
                //     getDataTrongMuon();
                //   });
                // }}
                title="Duyệt"
              >
                <DownOutlined />
              </Button>
            </Popconfirm>
            <Divider type="vertical" />
            <Popconfirm
              title="Bạn có chắc chắn muốn từ chối?"
              onConfirm={() => {
                confirmTrongMuonModel(record._id, 'Từ chối').then(() => {
                  getDataTrongMuon();
                });
              }}
            >
              <Button
                type="default"
                shape="circle"
                // onClick={() => {
                //   confirmTrongMuonModel(record._id, 'Từ chối').then(() => {
                //     getDataTrongMuon();
                //   });
                // }}
                title="Từ chối"
              >
                <CloseOutlined />
              </Button>
            </Popconfirm>
          </>
        )}
      </React.Fragment>
    );
  };
  const columns: IColumn<ITrongMuon.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Họ và tên',
      dataIndex: ['giaoVien', 'profile', 'fullname'],
      align: 'center',
      width: 200,
      search: 'search',
    },
    {
      title: 'Lớp đang dạy',
      dataIndex: ['profile', 'phoneNumber'],
      align: 'center',
      width: 150,
      search: 'search',
    },
    {
      title: 'lớp đăng ký',
      dataIndex: 'chiTietTrongMuon',
      align: 'center',
      width: 200,
      search: 'search',
      render: (val, recordVal) => {
        recordVal?.chiTietTrongMuon?.map((value) => {
          return JSON.stringify(value)
        });
      },
    },
    {
      title: 'Số ngày đăng ký',
      dataIndex: 'chiTietTrongMuon',
      align: 'center',
      width: 150,
      render: (val, record) => {
        record?.chiTietTrongMuon?.map((value, i) => {
          return <span key={i}>Ngày:{value?.ngay}</span>;
        });
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      align: 'center',
      render: (val) => {
        const color = val === 'Đã duyệt' ? 'green' : val === 'Chưa duyệt' ? 'geekblue' : 'red';
        return <Tag color={color}>{val}</Tag>;
      },
      width: 180,
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: ITaiKhoanHieuTruong.Record) => renderLast(record),
      fixed: 'right',
      width: 220,
    },
  ];
  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={() => getDataTrongMuon()}
        dependencies={[page, limit, cond]}
        loading={loading}
        modelName="trongmuon"
        Form={FormThemMoi}
        formType={'Modal'}
        // title={props?.idTruong ? '' : 'Quản lý tài khoản hiệu trưởng'}
        // scroll={{ x: 1300, y: 500 }}
        // widthDrawer={'40%'}
      >
        <Button
          style={{ marginBottom: '10px', marginRight: '10px' }}
          onClick={() => {
            // setEdit(false);
            setVisibleForm(true);
          }}
          type="primary"
        >
          <PlusCircleFilled />
          Thêm mới
        </Button>

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
export default QuanLyTrongMuon;
