import { ArrowLeftOutlined } from '@ant-design/icons';
import { Breadcrumb, Card } from 'antd';
import React, { useState } from 'react';
import { history, useModel } from 'umi';
import DanhSachHocSinh from '../components/DanhSachHS';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

const DetailQuanLyLop = ({
  match: {
    params: { id },
  },
}: {
  match: { params: { id: string } };
}) => {
  const { record } = useModel('formdanhgia');
  const [dataFormDanhGia, setDataFormDanhGia] = useState<any>();
  const vaiTro = localStorage.getItem('vaiTro');
  const getDataDanhGia = async () => {
    const result = await axios.get(`${ip3}/danh-gia-hoc-sinh/form/${id}`);
    setDataFormDanhGia(result?.data?.data);
  };
  const tenDonVi = localStorage.getItem('tenDonVi');

  React.useEffect(() => {
    getDataDanhGia();
  }, []);

  return (
    <Card
      title={
        <Breadcrumb style={{ cursor: 'pointer' }}>
          <Breadcrumb.Item
            onClick={() => {
              history.push('/quanlyhocsinh/danhgiadinhkyhocsinh');
            }}
          >
            <ArrowLeftOutlined /> Form đánh giá
          </Breadcrumb.Item>
          {vaiTro === 'HieuTruong' ? (
            <Breadcrumb.Item>
              {record?.tieuDe ?? dataFormDanhGia?.tieuDe} ({tenDonVi})
            </Breadcrumb.Item>
          ) : (
            <Breadcrumb.Item>{record?.tieuDe ?? dataFormDanhGia?.tieuDe}</Breadcrumb.Item>
          )}
        </Breadcrumb>
      }
    >
      <DanhSachHocSinh id={id} tieuDe={record?.tieuDe ?? dataFormDanhGia?.tieuDe} />
    </Card>
  );
};

export default DetailQuanLyLop;
