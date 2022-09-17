import { formatterMoney } from '@/utils/utils';
import {Card, Descriptions, Divider, Table, Tag} from 'antd';
import { useModel } from 'umi';
import type { DoanhThu as IDoanhThu } from '@/services/DoanhThu';
import type { IColumn } from '@/utils/interfaces';
import moment from 'moment';
import React from "react";
import KhoanThu from "@/pages/DoanhThu/KhoanThu";
import KhoanChiTieu from "@/pages/DoanhThu/KhoanChiTieu";
const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
});
const ViewDoanhThuThuc = () => {
  const { record,disable } = useModel('doanhthuthuc');

  const columnsThu: IColumn<IDoanhThu.Record>[] = [
    {
      title: 'Hạng mục',
      dataIndex: 'ten',
      width: 150,
    },
    {
      title: 'Số tiền',
      dataIndex: 'soTien',
      align: 'center',
      width: 130,
      render: (val) => formatterMoney(val ?? 0),
    },
    {
      title: 'Thời gian',
      dataIndex: 'thoiGian',
      align: 'center',
      width: 130,
      render: (val) => moment(val).format('DD/MM/YYYY'),
    },
  ];
  const columnsTong: IColumn<IDoanhThu.Record>[] = [
    {
      title: 'Tổng tiền thu thực tế',
      dataIndex: 'ten',
      width: 150,
    },
    {
      title: 'Tổng thu dự kiến',
      dataIndex: 'soTien',
      align: 'center',
      width: 130,
      render: (val) => formatterMoney(val ?? 0),
    },
    {
      title: 'Tổng chi',
      dataIndex: 'thoiGian',
      align: 'center',
      width: 130,
      render: (val) => moment(val).format('DD/MM/YYYY'),
    },
    {
      title: 'Tổng lợi nhuận thực tế',
      dataIndex: 'soTien',
      align: 'center',
      width: 130,
      render: (val) => formatterMoney(val ?? 0),
    },
    {
      title: 'Tổng lợi nhuận dự kiến',
      dataIndex: 'soTien',
      align: 'center',
      width: 130,
      render: (val) => formatterMoney(val ?? 0),
    },
  ];
  const columnsTienThu: IColumn<IDoanhThu.Record>[] = [
    {
      title: 'Lớp',
      dataIndex: 'tenDonVi',
      key: 'tenDonVi',
      width: '150px',
    },
    {
      title: 'Số tiền thu (VNĐ)',
      dataIndex: 'soTienThu',
      key: 'soTienThu',
      align: 'center',
      render: (val: number | bigint) => formatter.format(val),
    },
    {
      title: 'Số tiền đã đóng',
      dataIndex: 'soTienGiamTru',
      key: 'soTienGiamTru',
      align: 'center',
      render: (val: number | bigint) => formatter.format(val),
    },
  ];
  return (
    <div>
      <Divider>
        <b>Doanh thu thực</b>
      </Divider>
      <Descriptions bordered>
        <Descriptions.Item label="Đơn vị" span={2}>
          {record?.donVi?.tenDonVi}
        </Descriptions.Item>
        <Descriptions.Item label="Doanh thu tháng">
          {record?.thang === 12 ? 1 : record?.thang + 1}/{record?.nam}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng số tiền thu" span={2}>
          <Tag color="green"> {formatterMoney(record?.soTienThu)}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Tổng số tiền giảm trừ">
          <Tag color="red"> {formatterMoney(record?.soTienGiamTru)}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Tổng số tiền chi" span={2}>
          <Tag color="purple"> {formatterMoney(record?.soTienChi)}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Doanh thu">
          <Tag color="blue"> {formatterMoney(record?.doanhThu)}</Tag>
        </Descriptions.Item>
      </Descriptions>
      <Divider>
        <b>Báo cáo số tiền Thu</b>
      </Divider>
      <Card>
        <Table
          columns={columnsTienThu}
          dataSource={[]}
          bordered
          pagination={false}
        />
      </Card>
      <KhoanThu donViId={record?.donViId} disable={disable} />

      {/*<Table dataSource={record?.khoanThu} columns={columnsThu} pagination={false} bordered />*/}
      {/*<Divider>*/}
      {/*  <b>Báo cáo số tiền Giảm trừ</b>*/}
      {/*</Divider>*/}
      {/*<Table dataSource={record?.khoanGiamTru} columns={columnsThu} pagination={false} bordered />*/}
      <Divider>
        <b>Báo cáo số tiền Chi</b>
      </Divider>
      <KhoanChiTieu donViId={record?.donViId} disable={disable} />
      <Divider>
        <b>Tổng hợp</b>
      </Divider>
      <Table dataSource={record?.khoanChi} columns={columnsTong} pagination={false} bordered />
    </div>
  );
};

export default ViewDoanhThuThuc;
