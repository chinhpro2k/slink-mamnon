import { ArrowLeftOutlined } from '@ant-design/icons';
import { Breadcrumb, Card } from 'antd';
import { history, useModel } from 'umi';
import TableGiaoVien from './components/TableGiaoVien';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import { useState } from 'react';
import React from 'react';

const DetailTaiKhoanGV = ({
  match: {
    params: { id },
  },
}: {
  match: { params: { id: string } };
}) => {
  const { recordGV } = useModel('taikhoangiaovien');
  const { setDanhSach, setTotal } = useModel('datagiaovien');
  const [dataGV, setDataGV] = useState<any>();
  const getGiaoVien = async () => {
    const result = await axios.get(`${ip3}/user/${id}`);
    setDataGV(result?.data?.data);
  };

  React.useEffect(() => {
    getGiaoVien();
  }, []);
  return (
    <Card
      title={
        <Breadcrumb style={{ cursor: 'pointer' }}>
          <Breadcrumb.Item
            onClick={() => {
              history.push('/quanlytaikhoan/taikhoangiaovien');
              setDanhSach([]);
              setTotal(0);
            }}
          >
            <ArrowLeftOutlined />
            Quản lý tài khoản giáo viên
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {recordGV?.profile?.fullname ?? dataGV?.profile?.fullname}
          </Breadcrumb.Item>
        </Breadcrumb>
      }
    >
      <TableGiaoVien idGiaoVien={id} />
    </Card>
  );
};

export default DetailTaiKhoanGV;
