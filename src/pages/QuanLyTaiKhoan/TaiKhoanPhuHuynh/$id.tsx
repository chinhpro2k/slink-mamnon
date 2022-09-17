import { ArrowLeftOutlined } from '@ant-design/icons';
import { Breadcrumb, Card } from 'antd';
import { history, useModel } from 'umi';
import TablePhuHuynh from './components/TablePhuHuynh';
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
  const { recordPH } = useModel('taikhoanphuhuynh');
  const { setDanhSach, setTotal } = useModel('dataphuhuynh');
  const [dataPH, setDataPH] = useState<any>();
  const getPhuHuynh = async () => {
    const result = await axios.get(`${ip3}/user/${id}`);
    setDataPH(result?.data?.data);
  };

  React.useEffect(() => {
    getPhuHuynh();
  }, []);
  return (
    <Card
      title={
        <Breadcrumb style={{ cursor: 'pointer' }}>
          <Breadcrumb.Item
            onClick={() => {
              history.push('/quanlytaikhoan/taikhoanphuhuynh');
              setDanhSach([]);
              setTotal(0);
            }}
          >
            <ArrowLeftOutlined />
            Quản lý tài khoản phụ huynh
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {recordPH?.profile?.fullname ?? dataPH?.profile?.fullname}
          </Breadcrumb.Item>
        </Breadcrumb>
      }
    >
      <TablePhuHuynh idPhuHuynh={id} />
    </Card>
  );
};

export default DetailTaiKhoanGV;
