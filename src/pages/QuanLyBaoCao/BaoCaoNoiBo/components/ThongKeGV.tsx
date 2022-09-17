/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { BaoCaoNoiBo as IThongKeGiaoVien } from '@/services/BaoCaoNoiBo';
import type { IColumn } from '@/utils/interfaces';
import { formatterMoney } from '@/utils/utils';
import { Input, Select } from 'antd';
import React, { useState } from 'react';
import { useModel } from 'umi';

const ThongKeGiaoVien = () => {
  const {
    loading: loadingThongKeGiaoVien,
    getThongKeGiaoVienModel,
    page,
    limit,
    cond,
    total,
    setPage,
  } = useModel('thongkegiaovien');
  const { danhSachLop } = useModel('thongkehocsinh');

  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [donViId, setDonViId] = useState(organizationId);

  const onChange = (value: string) => {
    setPage(1);
    if (value === 'Tất cả') {
      setDonViId(organizationId);
    } else {
      setDonViId(value);
    }
  };

  const columns: IColumn<IThongKeGiaoVien.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 60,
    },
    {
      title: 'Họ và tên giáo viên',
      dataIndex: ['profile', 'fullname'],
      align: 'center',
      width: 170,
    },
    {
      title: 'SĐT giáo viên',
      dataIndex: ['profile', 'phoneNumber'],
      align: 'center',
      width: 150,
    },
    {
      title: 'Số ngày đi làm/tháng',
      dataIndex: 'soNgayDiLam',
      align: 'center',
      width: 120,
    },
    {
      title: 'Số ngày nghỉ',
      dataIndex: 'soNgayNghi',
      align: 'center',
      width: 120,
    },
    {
      title: 'Điểm tháng',
      dataIndex: 'diemTb',
      align: 'center',
      width: 120,
      render: (val) => Number(val).toFixed(1),
    },
  ];

  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={() => getThongKeGiaoVienModel(donViId)}
        dependencies={[page, limit, cond, donViId]}
        loading={loadingThongKeGiaoVien}
        modelName="thongkegiaovien"
      >
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
          <Select.Option value="Tất cả">Tất cả các lớp</Select.Option>
          {danhSachLop?.map((item: any) => (
            <Select.Option key={item?._id} value={item?._id}>
              {item?.tenDonVi}
            </Select.Option>
          ))}
        </Select>
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

export default ThongKeGiaoVien;
