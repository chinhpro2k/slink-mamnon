/* eslint-disable no-underscore-dangle */
/* eslint-disable no-nested-ternary */
import TableBase from '@/components/Table';
import type { QuanLyDanhGia as IQuanLyDanhGia } from '@/services/QuanLyDanhGia';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';

const TableDiemTB = () => {
  const { getThongKeAllDotModel, loading, page, limit, cond, setPage } = useModel('quanlydanhgia');
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [danhSachTruong, setDanhSachTruong] = useState([]);
  const vaiTro = localStorage.getItem('vaiTro');
  const [donViId, setDonViId] = useState(organizationId);

  const getDSTruong = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable/my/child?page=1&limit=100`, {
      params: {
        cond: {
          loaiDonVi: 'Truong',
        },
      },
    });
    setDanhSachTruong(result?.data?.data?.result);
  };

  React.useEffect(() => {
    getDSTruong();
  }, [])

  useEffect(() => {
   if (danhSachTruong.length>0){
     setDonViId(danhSachTruong?.[0]?._id)
   }
  }, [danhSachTruong])

  const changeIdTruong = (val: string) => {
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
     <div key={donViId}>
       {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
         <Select
           placeholder="Chọn trường"
           onChange={changeIdTruong}
           style={{ width: '30%', marginBottom: '10px' }}
           defaultValue={donViId}
           allowClear
           showSearch
           optionFilterProp="children"
           filterOption={(input, option: any) =>
             option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
           }
         >
           {danhSachTruong?.map((item: { _id: string; tenDonVi: string }) => (
             <Select.Option key={item?._id} value={item?._id}>
               {item?.tenDonVi}
             </Select.Option>
           ))}
         </Select>
       )}
     </div>
      <div key={danhSachTruong}>
        <TableBase
        border
        columns={columns}
        getData={() => {
          if ( danhSachTruong.length > 0) getThongKeAllDotModel(donViId);
        }}
        dependencies={[page, limit, cond, donViId]}
        loading={loading}
        modelName="quanlydanhgia"
        dataState="diemThongKeAllDot"
      />
      </div>
    </>
  );
};
export default TableDiemTB;
