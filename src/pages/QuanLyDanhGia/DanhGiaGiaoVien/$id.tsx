import { ArrowLeftOutlined } from '@ant-design/icons';
import { Breadcrumb, Card } from 'antd';
import React, { useState } from 'react';
import { history, useModel } from 'umi';
import DanhSachGiaoVien from '../components/DanhSachGV';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

const DetailDanhGiaCo = ({
  match: {
    params: { id },
  },
}: {
  match: { params: { id: string } };
}) => {
  const { record } = useModel('quanlydanhgia');
  const [dataFormDanhGia, setDataFormDanhGia] = useState<any>();
  const vaiTro = localStorage.getItem('vaiTro');
  const getDataDanhGia = async () => {
    const result = await axios.get(`${ip3}/danh-gia-co/form/${id}`);
    setDataFormDanhGia(result?.data?.data);
  };

  React.useEffect(() => {
    getDataDanhGia();
  }, []);

  return (
    <Card
      title={
        <Breadcrumb style={{ cursor: 'pointer' }}>
          <Breadcrumb.Item
            onClick={() => {
              history.push('/quanlygiaovien/danhgiagiaovien');
            }}
          >
            <ArrowLeftOutlined /> Form đánh giá
          </Breadcrumb.Item>
          {vaiTro === 'HieuTruong' ? (
            <Breadcrumb.Item>{record?.tieuDe ?? dataFormDanhGia?.tieuDe}</Breadcrumb.Item>
          ) : (
            <Breadcrumb.Item>{record?.tieuDe ?? dataFormDanhGia?.tieuDe}</Breadcrumb.Item>
          )}
        </Breadcrumb>
      }
    >
      <DanhSachGiaoVien id={id} tieuDe={record?.tieuDe ?? dataFormDanhGia?.tieuDe} />
    </Card>
  );
};

export default DetailDanhGiaCo;
