/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { ThucPhamKho as IThucPhamKho } from '@/services/ThucPhamKho';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { Button, Card, Descriptions, Input, Modal, Select, Tabs } from 'antd';
import React, { useState } from 'react';
import { useModel } from 'umi';
import NhapKho from '../components/NhapKho';
import XuatKho from '../components/XuatKho';
const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
});
const ThucPhamKho = () => {
  const {
    loading: loadingThucPhamKho,
    getThucPhamKhoModel,
    total,
    page,
    limit,
    cond,
    record: recordThucPham,
    setDsThucPham,
    setDanhSachTruong,
    danhSachTruong,
  } = useModel('thucphamkho');
  const [visible, setVisible] = useState(false);
  const vaiTro = localStorage.getItem('vaiTro');
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;

  const [donViId, setDonViId] = useState(organizationId);

  const getDSTruong = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=100`, {
      params: {
        cond: {
          loaiDonVi: 'Truong',
        },
      },
    });
    setDanhSachTruong(result?.data?.data?.result);
  };
  const getDSThucPham = async () => {
    const result = await axios.get(`${ip3}/danh-muc-thuc-pham/pageable?page=1&limit=5000`, {
      params: {
        donViId: organizationId,
      },
    });
    setDsThucPham(result?.data?.data?.result);
  };

  React.useEffect(() => {
    getDSTruong();
    getDSThucPham();
  }, []);

  const onChange = (value: string) => {
    setDonViId(value);
  };

  const columns: IColumn<IThucPhamKho.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'T??n t???t',
      dataIndex: 'tenVietTat',
      align: 'center',
      width: 150,
      render: (val) => val ?? 'Kh??ng c??',
      search: 'search',
    },
    {
      title: 'T??n ?????y ?????',
      dataIndex: 'ten',
      align: 'center',
      width: 200,
    },
    {
      title: 'Gi?? th???c ph???m',
      dataIndex: 'donGia',
      align: 'center',
      width: 150,
      render: (val) => formatter.format(val ?? 0),
    },
    // {
    //   title: 'Th??? t??ch',
    //   dataIndex: 'theTich',
    //   align: 'center',
    //   width: 100,
    //   render: (val) => val && `${val}ml`,
    // },
    {
      title: 'Kh???i l?????ng',
      dataIndex: 'khoiLuong',
      align: 'center',
      width: 100,
      render: (val) => val && `${Number(val ?? 0).toFixed(2)}`,
    },
    {
      title: '????n v??? t??nh',
      dataIndex: 'donViTinh',
      align: 'center',
      width: 100,
    },
  ];

  if (vaiTro === 'SuperAdmin' || vaiTro === 'Admin') {
    columns.splice(5, 0, {
      title: 'Tr?????ng',
      dataIndex: ['donVi', 'tenDonVi'],
      align: 'center',
      width: 200,
    });
  }

  return (
    <Card>
      <Tabs defaultActiveKey="1" destroyInactiveTabPane>
        <Tabs.TabPane tab="Nh???p kho" key="">
          <NhapKho />
        </Tabs.TabPane>
        <Tabs.TabPane tab="D??? li???u kho" key="2">
          <TableBase
            border
            columns={columns}
            getData={() => getThucPhamKhoModel(donViId)}
            dependencies={[page, limit, cond, donViId]}
            loading={loadingThucPhamKho}
            modelName="thucphamkho"
            scroll={{ x: 1000 }}
          >
            {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
              <Select
                defaultValue="T???t c???"
                showSearch
                style={{ width: '15%', marginRight: '10px' }}
                placeholder="Ch???n ????n v???"
                optionFilterProp="children"
                onChange={onChange}
                filterOption={(input, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Select.Option key="T???t c???" value="T???t c???">
                  T???t c??? c??c tr?????ng
                </Select.Option>
                {danhSachTruong?.map((item: { _id: string; tenDonVi: string }) => (
                  <Select.Option key={item?._id} value={item?._id}>
                    {item?.tenDonVi}
                  </Select.Option>
                ))}
              </Select>
            )}
            <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
              T???ng s???:
              <Input
                style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
                value={total}
              />
            </h3>
          </TableBase>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Xu???t kho" key="3">
          <XuatKho />
        </Tabs.TabPane>
      </Tabs>

      {/* Modal view th??ng tin th???c ph???m kho */}
      <Modal
        visible={visible}
        centered
        closable
        onCancel={() => setVisible(false)}
        width="50%"
        footer={[
          <Button type="primary" key="back" onClick={() => setVisible(false)}>
            OK
          </Button>,
        ]}
      >
        <Descriptions title="Chi ti???t th???c ph???m kho">
          {recordThucPham?.tenVietTat && (
            <Descriptions.Item label="T??n t???t">{recordThucPham?.tenVietTat}</Descriptions.Item>
          )}
          <Descriptions.Item label="T??n ?????y ?????">{recordThucPham?.ten}</Descriptions.Item>
          {recordThucPham?.khoiLuong && (
            <Descriptions.Item label="Kh???i l?????ng">
              {Number(recordThucPham?.khoiLuong).toFixed(2)}g
            </Descriptions.Item>
          )}
          {recordThucPham?.theTich && (
            <Descriptions.Item label="Kh???i l?????ng">{recordThucPham?.theTich}ml</Descriptions.Item>
          )}
          {(vaiTro === 'Admin' || vaiTro === 'SuperAdmin') && (
            <Descriptions.Item label="Tr?????ng">{recordThucPham?.donVi?.tenDonVi}</Descriptions.Item>
          )}
        </Descriptions>
      </Modal>
    </Card>
  );
};

export default ThucPhamKho;
