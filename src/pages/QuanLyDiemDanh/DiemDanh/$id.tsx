import { ArrowLeftOutlined } from '@ant-design/icons';
import { Breadcrumb, Card } from 'antd';
import { history, useModel } from 'umi';
import DiemDanhDauGio from './components/DiemDanhDauGio';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import { useState } from 'react';
import React from 'react';

const DetailQuanLyLop = ({
  match: {
    params: { id },
  },
}: {
  match: { params: { id: string } };
}) => {
  const { record } = useModel('diemdanh');
  const [dataLop, setDataLop] = useState<any>();
  const getDSLop = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=20`, {
      params: {
        cond: {
          _id: id,
        },
      },
    });
    setDataLop({ ...result?.data?.data?.result?.[0] });
  };

  React.useEffect(() => {
    getDSLop();
  }, []);
  return (
    <Card
      title={
        <Breadcrumb style={{ cursor: 'pointer' }}>
          <Breadcrumb.Item
            onClick={() => {
              history.push('/quanlyhocsinh/quanlydiemdanh/diemdanh');
            }}
          >
            <ArrowLeftOutlined /> Điểm danh
          </Breadcrumb.Item>
          <Breadcrumb.Item>{record?.tenDonVi ?? dataLop?.tenDonVi}</Breadcrumb.Item>
        </Breadcrumb>
      }
    >
      <DiemDanhDauGio donViId={id} />
    </Card>
  );
};

export default DetailQuanLyLop;
