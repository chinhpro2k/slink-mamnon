/* eslint-disable no-underscore-dangle */
/* eslint-disable no-nested-ternary */
import TableBase from '@/components/Table';
import type { QuanLyDanhGia as IQuanLyDanhGia } from '@/services/QuanLyDanhGia';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { Select } from 'antd';
import React, { useState } from 'react';
import { useModel } from 'umi';

const TableDiemTB = (props: { idForm?: string; idDonVi?: string }) => {
  const { getResultGVModel, loading, page, limit, cond, record, setPage } =
    useModel('quanlydanhgia');
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [donViId, setDonViId] = useState(organizationId);
  const [danhSachLop, setDanhSachLop] = useState([]);

  const getLopDanhGia = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable/my/child?page=1&limit=100`, {
      params: {
        cond: {
          parent: organizationId,
        },
      },
    });
    setDanhSachLop(result?.data?.data?.result);
  };

  React.useEffect(() => {
    getLopDanhGia();
  }, []);

  const changeIdLop = (val: string) => {
    setDonViId(val);
    setPage(1);
  };

  const columns: IColumn<IQuanLyDanhGia.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Họ và tên',
      dataIndex: ['profile', 'fullname'],
      align: 'center',
      width: 200,
    },
    {
      title: 'Số điện thoại',
      dataIndex: ['profile', 'phoneNumber'],
      align: 'center',
      width: 150,
    },
    {
      title: 'Email',
      dataIndex: ['profile', 'email'],
      align: 'center',
      width: 150,
      render: (val) => val ?? 'Chưa cập nhật',
    },
    {
      title: 'Điểm trung bình',
      dataIndex: 'diemTB',
      align: 'center',
      width: 150,
      render: (val) => (val ? parseFloat(val).toFixed(2) : 'Chưa đánh giá'),
    },
    {
      title: 'Số lượt đánh giá',
      dataIndex: 'soLuotDanhGia',
      align: 'center',
      width: 150,
      render: (val) => (val ? val : 0),
    },
  ];

  return (
    <>
      <Select
        placeholder="Chọn lớp"
        onChange={changeIdLop}
        style={{ width: '30%', marginBottom: '10px' }}
        defaultValue={record?.donViTaoDanhGiaId}
      >
        <Select.Option value={record?.donViTaoDanhGiaId}>Tất cả các lớp</Select.Option>
        {danhSachLop?.map((item: { _id: string; tenDonVi: string }) => (
          <Select.Option key={item?._id} value={item?._id}>
            {item?.tenDonVi}
          </Select.Option>
        ))}
      </Select>
      <TableBase
        border
        columns={columns}
        getData={() => getResultGVModel(props?.idForm, donViId)}
        dependencies={[page, limit, cond, donViId]}
        loading={loading}
        modelName="quanlydanhgia"
        dataState="danhSachResultGV"
      />
    </>
  );
};
export default TableDiemTB;
