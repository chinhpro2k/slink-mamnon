/* eslint-disable no-underscore-dangle */
import { checkAllow } from '@/components/CheckAuthority';
import TableBase from '@/components/Table';
import type { DotDanhGiaSucKhoe as IDotDanhGiaSucKhoe } from '@/services/DotDanhGiaSucKhoe';
import { delDotDanhGiaSucKhoe } from '@/services/DotDanhGiaSucKhoe/dotdanhgiasuckhoe';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Descriptions, Divider, Input, message, Modal, Popconfirm, Select } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';

const DotDanhGiaSucKhoe = () => {
  const {
    loading: loadingDotDanhGiaSucKhoe,
    getDotDanhGiaSucKhoeModel,
    total,
    page,
    limit,
    cond,
    setRecord,
    setVisibleForm,
    setEdit,
    record: recordDot,
    setPage,
  } = useModel('dotdanhgiasuckhoe');
  const [visible, setVisible] = useState(false);
  const vaiTro = localStorage.getItem('vaiTro');
  const [dsTruong, setDSTruong] = useState([]);
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [donViId, setDonViId] = useState<string | undefined>(organizationId);

  const donVi = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=100`);
    const arrTruong: any = [];
    arrTruong.push({ tenDonVi: 'Tất cả các trường', _id: 'Tất cả' });
    result?.data?.data?.result?.map(
      (item: { loaiDonVi: string }) => item?.loaiDonVi === 'Truong' && arrTruong.push(item),
    );
    setDSTruong(arrTruong);
  };

  React.useEffect(() => {
    donVi();
  }, []);

  const handleEdit = (val: any) => {
    setVisibleForm(true);
    setEdit(true);
    setRecord(val);
  };
  const handleDel = async (val: any) => {
    try {
      const res = await delDotDanhGiaSucKhoe({ id: val });
      if (res?.status === 200) {
        message.success('Xóa thành công');
        getDotDanhGiaSucKhoeModel();
        return true;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return false;
  };
  const handleView = (val: any) => {
    setRecord(val);
    setVisible(true);
  };

  const onChange = (value: string) => {
    setPage(1);
    setDonViId(value);
  };

  const onCell = (record: IDotDanhGiaSucKhoe.Record) => ({
    onClick: () => {
      handleView(record);
    },
    style: { cursor: 'pointer' },
  });

  const renderLast1 = (record: IDotDanhGiaSucKhoe.Record) => {
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
          disabled={!checkAllow('EDIT_DOT_DANH_GIA_SUC_KHOE')}
        >
          <EditOutlined />
        </Button>

        <Divider type="vertical" />

        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDel(record._id)}
          disabled={!checkAllow('DEL_DOT_DANH_GIA_SUC_KHOE')}
        >
          <Button
            type="primary"
            shape="circle"
            title="Xóa"
            disabled={!checkAllow('DEL_DOT_DANH_GIA_SUC_KHOE')}
          >
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      </React.Fragment>
    );
  };

  const columns: IColumn<IDotDanhGiaSucKhoe.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'Tên đợt',
      dataIndex: 'ten',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => val ?? 'Không có',
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => val ?? 'Không có',
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'thoiGianDanhGia',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => moment(val?.thoiGianBatDau).format('HH:mm DD/MM/YYYY'),
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'thoiGianDanhGia',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => moment(val?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY'),
    },
    {
      title: 'Trường',
      dataIndex: ['donVi', 'tenDonVi'],
      align: 'center',
      width: 170,
      onCell,
      render: (val) => val ?? 'Không có',
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: IDotDanhGiaSucKhoe.Record) => renderLast1(record),
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
        getData={() => getDotDanhGiaSucKhoeModel(donViId)}
        dependencies={[page, limit, cond, donViId]}
        loading={loadingDotDanhGiaSucKhoe}
        modelName="dotdanhgiasuckhoe"
        title="Quản lý đợt đánh giá sức khỏe"
        scroll={{ x: 1300 }}
        Form={Form}
        formType="Drawer"
        widthDrawer="50%"
        hascreate={checkAllow('ADD_DOT_DANH_GIA_SUC_KHOE')}
      >
        {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
          <Select
            showSearch
            defaultValue="Tất cả"
            style={{ width: '15%', marginRight: '10px' }}
            placeholder="Chọn trường"
            optionFilterProp="children"
            onChange={onChange}
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {dsTruong?.map((item: { _id: string; tenDonVi: string }) => (
              <Select.Option key={item?._id} value={item?._id}>
                {item?.tenDonVi}
              </Select.Option>
            ))}
          </Select>
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
        visible={visible}
        centered
        title="Thông tin đợt đánh giá sức khỏe"
        closable
        onCancel={() => setVisible(false)}
        footer={[
          <Button type="primary" key="back" onClick={() => setVisible(false)}>
            OK
          </Button>,
        ]}
      >
        <Descriptions>
          <Descriptions.Item label="Tên đợt" span={3}>
            {recordDot?.ten}
          </Descriptions.Item>
          <Descriptions.Item label="Mô tả" span={3}>
            {recordDot?.moTa ?? 'Không có'}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian đánh giá" span={3}>
            {moment(recordDot?.thoiGianDanhGia?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')} -{' '}
            {moment(recordDot?.thoiGianDanhGia?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label="Trường" span={3}>
            {recordDot?.donVi?.tenDonVi}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};

export default DotDanhGiaSucKhoe;
