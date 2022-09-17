/* eslint-disable no-underscore-dangle */
import { checkAllow } from '@/components/CheckAuthority';
import TableBase from '@/components/Table';
import type { HoatDongNgoaiKhoa as IHoatDongNgoaiKhoa } from '@/services/HoatDongNgoaiKhoa';
import { delHoatDongNgoaiKhoa } from '@/services/HoatDongNgoaiKhoa/hoatdongngoaikhoa';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Divider, Input, message, Popconfirm, Select } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useModel, history } from 'umi';
import Form from './components/Form';

const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
});

const HoatDongNgoaiKhoa = () => {
  const {
    loading: loadingHoatDongNgoaiKhoa,
    getHoatDongNgoaiKhoaModel,
    total,
    page,
    limit,
    cond,
    setRecord,
    setVisibleForm,
    setEdit,
    setPage,
  } = useModel('hoatdongngoaikhoa');

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
      const res = await delHoatDongNgoaiKhoa({ id: val });
      if (res?.status === 200) {
        message.success('Xóa thành công');
        getHoatDongNgoaiKhoaModel();
        return true;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return false;
  };

  const onChange = (value: string) => {
    setPage(1);
    setDonViId(value);
  };
  const onCell = (record: IHoatDongNgoaiKhoa.Record) => ({
    onClick: () => {
      setRecord(record);
      history.push(`/quanlytuongtac/hoatdongngoaikhoa/${record._id}`);
    },
    style: { cursor: 'pointer' },
  });

  const renderLast1 = (record: IHoatDongNgoaiKhoa.Record) => {
    return (
      <React.Fragment>
        <Button
          type="primary"
          shape="circle"
          onClick={() => {
            setRecord(record);
            history.push(`/quanlytuongtac/hoatdongngoaikhoa/${record._id}`);
          }}
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
          disabled={!checkAllow('EDIT_HOAT_DONG_NGOAI_KHOA')}
        >
          <EditOutlined />
        </Button>

        <Divider type="vertical" />

        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDel(record._id)}
          disabled={!checkAllow('DEL_HOAT_DONG_NGOAI_KHOA')}
        >
          <Button
            type="primary"
            shape="circle"
            title="Xóa"
            disabled={!checkAllow('DEL_HOAT_DONG_NGOAI_KHOA')}
          >
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      </React.Fragment>
    );
  };

  const columns: IColumn<IHoatDongNgoaiKhoa.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'Tên hoạt động',
      dataIndex: 'tenHoatDong',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => val ?? 'Không có',
    },
    {
      title: 'Địa điểm',
      dataIndex: 'diaDiem',
      align: 'center',
      width: 200,
      onCell,
      render: (val) =>
        `${val?.soNhaTenDuong}, ${val?.tenPhuongXa}, ${val?.tenQuanHuyen}, ${val?.tenTinh}` ??
        'Không có',
    },
    {
      title: 'Thời gian dự kiến',
      dataIndex: 'thoiGianDuKien',
      align: 'center',
      width: 170,
      onCell,
      render: (val) =>
        `${moment(val?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')} - ${moment(
          val?.thoiGianKetThuc,
        ).format('HH:mm DD/MM/YYYY')}` ?? 'Không có',
    },
    {
      title: 'Chi phí dự kiến',
      dataIndex: 'chiPhiDuKien',
      align: 'center',
      width: 130,
      onCell,
      render: (val) => <div>{formatter.format(val)}</div> ?? 'Không có',
    },
    {
      title: 'Đơn vị tổ chức',
      dataIndex: 'donViToChuc',
      align: 'center',
      width: 130,
      onCell,
      render: (val) => val?.tenDonVi ?? 'Không có',
    },
    {
      title: 'Thời gian đăng ký',
      dataIndex: 'thoiGianDangKy',
      align: 'center',
      width: 170,
      onCell,
      render: (val) =>
        `${moment(val?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')} - ${moment(
          val?.thoiGianKetThuc,
        ).format('HH:mm DD/MM/YYYY')}` ?? 'Không có',
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: IHoatDongNgoaiKhoa.Record) => renderLast1(record),
      fixed: 'right',
      width: 170,
    },
  ];

  useEffect(() => {}, []);

  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={() => getHoatDongNgoaiKhoaModel(donViId)}
        dependencies={[page, limit, cond, donViId]}
        loading={loadingHoatDongNgoaiKhoa}
        modelName="hoatdongngoaikhoa"
        title="Hoạt động ngoại khóa"
        scroll={{ x: 1300 }}
        Form={Form}
        formType="Drawer"
        widthDrawer="60%"
        hascreate={checkAllow('ADD_HOAT_DONG_NGOAI_KHOA')}
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
    </>
  );
};

export default HoatDongNgoaiKhoa;
