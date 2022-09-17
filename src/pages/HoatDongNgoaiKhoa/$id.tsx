import { ArrowLeftOutlined } from '@ant-design/icons';
import { Breadcrumb, Card } from 'antd';
import React, { useState } from 'react';
import { history, useModel } from 'umi';
import DSLop from './components/DSLop';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

const DanhSachLopThamGia = ({
  match: {
    params: { id },
  },
}: {
  match: { params: { id: string } };
}) => {
  const { record } = useModel('hoatdongngoaikhoa');
  const [dataHDNK, setDataHDNK] = useState<any>();
  const vaiTro = localStorage.getItem('vaiTro');
  const getDataHoatDongNgoaiKhoa = async () => {
    const result = await axios.get(`${ip3}/hoat-dong-ngoai-khoa/${id}`);
    setDataHDNK(result?.data?.data);
  };

  React.useEffect(() => {
    getDataHoatDongNgoaiKhoa();
  }, []);

  return (
    <Card
      title={
        <Breadcrumb style={{ cursor: 'pointer' }}>
          <Breadcrumb.Item
            onClick={() => {
              history.push('/quanlytuongtac/hoatdongngoaikhoa');
            }}
          >
            <ArrowLeftOutlined /> Hoạt động ngoại khóa
          </Breadcrumb.Item>
          {vaiTro === 'HieuTruong' ? (
            <Breadcrumb.Item>{record?.tenHoatDong ?? dataHDNK?.tenHoatDong}</Breadcrumb.Item>
          ) : (
            <Breadcrumb.Item>{record?.tenHoatDong ?? dataHDNK?.tenHoatDong}</Breadcrumb.Item>
          )}
        </Breadcrumb>
      }
    >
      <DSLop id={id} tieuDe={record?.tenHoatDong ?? dataHDNK?.tenHoatDong} />
    </Card>
  );
};

export default DanhSachLopThamGia;
