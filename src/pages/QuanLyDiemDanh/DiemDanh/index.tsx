/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { DiemDanh as IDiemDanh } from '@/services/DiemDanh';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Input, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { history, useModel } from 'umi';

const DiemDanh = () => {
  const vaiTro = localStorage.getItem('vaiTro');
  const [arrDonVi, setArrDonVi] = useState<any[]>([]);
  const {
    loading: loadingDiemDanh,
    getDiemDanhModel,
    total,
    page,
    limit,
    cond,
    setCondition,
    setPage,
  } = useModel('diemdanh');
  const { setRecord } = useModel('diemdanh');

  const getDSTruong = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=20`, {
      params: {
        cond: {
          loaiDonVi: 'Truong',
        },
      },
    });
    const arrDV = [];
    arrDV.push({ tenDonVi: 'Tất cả các trường', _id: 'Tất cả' });
    arrDV.push(...result?.data?.data?.result);
    setArrDonVi(arrDV);
  };

  React.useEffect(() => {
    getDSTruong();
  }, []);

  const onChange = (value: string) => {
    setCondition({ parent: value });
    setPage(1);
  };

  const onCell = (record: IDiemDanh.Record) => ({
    onClick: () => {
      setRecord(record);
      history.push(`/quanlyhocsinh/quanlydiemdanh/diemdanh/${record._id}`);
    },
    style: { cursor: 'pointer' },
  });

  const renderLast1 = (record: IDiemDanh.Record) => {
    return (
      <React.Fragment>
        <Button
          type="default"
          shape="circle"
          onClick={() => {
            setRecord(record);
            history.push(`/quanlyhocsinh/quanlydiemdanh/diemdanh/${record._id}`);
          }}
          title="Xem chi tiết"
        >
          <EyeOutlined />
        </Button>
      </React.Fragment>
    );
  };

  const columns: IColumn<IDiemDanh.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'Tên lớp',
      dataIndex: 'tenDonVi',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => val ?? 'Không có',
      search: 'search',
    },
    {
      title: 'Độ tuổi (tháng)',
      dataIndex: 'doTuoi',
      align: 'center',
      width: 100,
      onCell,
      render: (val) => val ?? 'Không có',
    },
    {
      title: 'Trường',
      dataIndex: 'parent',
      align: 'center',
      width: 150,
      onCell,
      render: (val) =>
        val
          ? arrDonVi?.map((item: { tenDonVi: string; _id: string }, index) =>
              item?._id === val ? <div key={index}>{item?.tenDonVi}</div> : undefined,
            )
          : 'Không có',
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: IDiemDanh.Record) => renderLast1(record),
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
        getData={getDiemDanhModel}
        dependencies={[page, limit, cond]}
        loading={loadingDiemDanh}
        modelName="diemdanh"
        title="Điểm danh"
        scroll={{ x: 1000, y: 500 }}
      >
        {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
          <Select
            showSearch
            defaultValue="Tất cả"
            style={{ width: '20%', marginRight: '10px' }}
            placeholder="Chọn đơn vị"
            optionFilterProp="children"
            onChange={onChange}
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {arrDonVi?.map((item) => (
              <Select.Option value={item?._id}>{item?.tenDonVi}</Select.Option>
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

export default DiemDanh;
