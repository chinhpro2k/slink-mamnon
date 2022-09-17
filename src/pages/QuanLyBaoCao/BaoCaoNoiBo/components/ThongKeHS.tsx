/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { BaoCaoNoiBo as IThongKeHocSinh } from '@/services/BaoCaoNoiBo';
import type { IColumn } from '@/utils/interfaces';
import { formatterMoney } from '@/utils/utils';
import { Input, Select } from 'antd';
import React, { useState } from 'react';
import { useModel } from 'umi';

const ThongKeHocSinh = () => {
  const {
    loading: loadingThongKeHocSinh,
    getThongKeHocSinhModel,
    page,
    limit,
    cond,
    total,
    danhSachLop,
    setPage,
    getLopModel,
  } = useModel('thongkehocsinh');

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

  React.useEffect(() => {
    getLopModel(donViId);
  }, []);

  const columns: IColumn<IThongKeHocSinh.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 60,
    },
    {
      title: 'Họ và tên học sinh',
      dataIndex: 'hoTen',
      align: 'center',
      width: 170,
    },
    {
      title: 'Họ và tên phụ huynh',
      dataIndex: ['user', 'profile', 'fullname'],
      align: 'center',
      width: 170,
    },
    {
      title: 'SĐT phụ huynh',
      dataIndex: ['user', 'profile', 'phoneNumber'],
      align: 'center',
      width: 150,
    },
    {
      title: 'Tổng học phí',
      dataIndex: 'tongHocPhi',
      align: 'center',
      width: 130,
      render: (val) => formatterMoney(val),
    },
    {
      title: 'Số ngày nghỉ trong tháng',
      dataIndex: 'soNgayNghi',
      align: 'center',
      width: 120,
    },
    {
      title: 'Lớp',
      dataIndex: ['donVi', 'tenDonVi'],
      align: 'center',
      width: 150,
    },
    {
      title: 'Sức khỏe',
      align: 'center',
      children: [
        {
          title: 'Chiều cao',
          dataIndex: ['sucKhoe', 'chieuCao'],
          width: 100,
          align: 'center',
          render: (val: number) => (val ? <div>{val} cm</div> : undefined),
        },
        {
          title: 'Cân nặng',
          dataIndex: ['sucKhoe', 'canNang'],
          width: 100,
          align: 'center',
          render: (val: number) => (val ? <div>{val} kg</div> : undefined),
        },
      ],
    },
  ];

  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={() => getThongKeHocSinhModel(donViId)}
        dependencies={[page, limit, cond, donViId]}
        loading={loadingThongKeHocSinh}
        modelName="thongkehocsinh"
        scroll={{ x: 1300 }}
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

export default ThongKeHocSinh;
