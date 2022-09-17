/* eslint-disable no-underscore-dangle */
import {
  exportMau1,
  exportMau2,
  exportMau3,
  exportMau4,
  exportMau5,
} from '@/services/KhauPhanAn/khauphanan';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { CloudDownloadOutlined } from '@ant-design/icons';
import { Button, Card, message, Select, Table, DatePicker } from 'antd';
import axios from 'axios';
import FileDownload from 'js-file-download';
import moment from 'moment';
import React, { useState } from 'react';
import { useModel } from 'umi';
import type { Truong as ITruong } from '@/services/Truong';

const KiemThu = () => {
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [danhSachTruong, setDanhSachTruong] = useState([]);
  const [donViId, setDonViId] = useState<any>(organizationId);
  const [ngayKiemThu, setNgayKiemThu] = useState(moment());
  const [loaiHinh, setLoaiHinh] = useState('Mầm non');
  const vaiTro = localStorage.getItem('vaiTro');

  const gettruong = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=1000`, {
      params: {
        cond: {
          loaiDonVi: 'Truong',
        },
      },
    });

    setDanhSachTruong(result?.data?.data?.result);
  };

  React.useEffect(() => {
    gettruong();
  }, []);

  const changeTruong = (val: string) => {
    setDonViId(val);
  };

  const dataSource = [
    {
      index: 1,
      name: 'Mẫu 1: Kiểm tra trước khi chế biến thức ăn',
    },
    {
      index: 2,
      name: 'Mẫu 2: Kiểm tra khi chế biến thức ăn',
    },
    {
      index: 3,
      name: 'Mẫu 3: Kiểm tra trước khi ăn',
    },
    {
      index: 4,
      name: 'Mẫu 4: Nhãn mẫu thức ăn lưu',
    },
    {
      index: 5,
      name: 'Mẫu 5: Mẫu theo dõi thức ăn lưu và hủy mẫu thức ăn lưu',
    },
  ];

  const exportKiemThu = async (record: { index: number }) => {
    const val: any = danhSachTruong?.find((item: { _id: string }) => item?._id === donViId);
    switch (record?.index) {
      case 1: {
        const result = await exportMau1({
          donViId,
          loaiHinh,
          nam: ngayKiemThu.year(),
          thang: ngayKiemThu.month(),
          ngay: ngayKiemThu.date(),
        });
        const dateString = ngayKiemThu.format('DDMMYYYY');
        FileDownload(result.data, `Mẫu 1_${dateString}_${val?.tenDonVi}.doc`);
        break;
      }
      case 2: {
        const result = await exportMau2({
          donViId,
          loaiHinh,
          nam: ngayKiemThu.year(),
          thang: ngayKiemThu.month(),
          ngay: ngayKiemThu.date(),
        });
        const dateString = ngayKiemThu.format('DDMMYYYY');
        FileDownload(result.data, `Mẫu 2_${dateString}_${val?.tenDonVi}.doc`);
        break;
      }
      case 3: {
        const result = await exportMau3({
          donViId,
          loaiHinh,
          nam: ngayKiemThu.year(),
          thang: ngayKiemThu.month(),
          ngay: ngayKiemThu.date(),
        });
        const dateString = ngayKiemThu.format('DDMMYYYY');
        FileDownload(result.data, `Mẫu 3_${dateString}_${val?.tenDonVi}.doc`);
        break;
      }
      case 4: {
        const result = await exportMau4();
        const dateString = ngayKiemThu.format('DDMMYYYY');
        FileDownload(result.data, `Mẫu 4_${dateString}_${val?.tenDonVi}.doc`);
        break;
      }
      case 5: {
        const result = await exportMau5({
          donViId,
          loaiHinh,
          nam: ngayKiemThu.year(),
          thang: ngayKiemThu.month(),
          ngay: ngayKiemThu.date(),
        });
        const dateString = ngayKiemThu.format('DDMMYYYY');
        FileDownload(result.data, `Mẫu 5_${dateString}_${val?.tenDonVi}.doc`);
        break;
      }
      default:
        break;
    }
  };

  const renderLast1 = (record: any) => {
    return (
      <React.Fragment>
        <Button
          type="primary"
          shape="circle"
          onClick={() =>
            !donViId
              ? message.error('Vui lòng chọn trường trước khi xuất file')
              : exportKiemThu(record)
          }
          title="Xuất file"
        >
          <CloudDownloadOutlined />
        </Button>
      </React.Fragment>
    );
  };

  const columns: IColumn<any>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      width: 70,
    },
    {
      title: 'Tên mẫu',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Thao tác',
      align: 'center',
      fixed: 'right',
      render: (record) => renderLast1(record),
      width: 100,
    },
  ];
  return (
    <Card title="Kiểm thử ba bước">
      {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
        <Select
          showSearch
          allowClear
          style={{ width: '20%', marginBottom: '10px' }}
          placeholder="Chọn trường"
          optionFilterProp="children"
          filterOption={(input, option: any) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          onChange={changeTruong}
        >
          {danhSachTruong?.map((item: ITruong.Record) => (
            <Select.Option key={item?._id} value={item?._id}>
              {item?.tenDonVi}
            </Select.Option>
          ))}
        </Select>
      )}
      <DatePicker
        format="DD/MM/YYYY"
        value={ngayKiemThu}
        style={{ marginRight: 10,marginBottom:'8px' }}
        onChange={(value) => {
          setNgayKiemThu(value);
        }}
        disabledDate={(current) => current.isAfter(moment())}
      />
      <Select
        value={loaiHinh}
        onChange={(value) => {
          setLoaiHinh(value);
        }}
      >
        <Select.Option value="Mầm non">Mẫu giáo</Select.Option>
        <Select.Option value="Nhà trẻ">Nhà trẻ</Select.Option>
      </Select>
      <Table dataSource={dataSource} columns={columns} bordered pagination={false} />
    </Card>
  );
};

export default KiemThu;
