import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Breadcrumb, Card } from 'antd';
import React, { useState } from 'react';
import { history, useModel } from 'umi';
import HocPhi from './HocPhi';

const DetailQuanLyLop = ({
  match: {
    params: { id },
  },
}: {
  match: { params: { id: string } };
}) => {
  const { record } = useModel('quanlylop');
  const [recordLop, setRecordLop] = useState<any>();
  const getDataLop = async () => {
    const result = await axios.get(`${ip3}/don-vi/${id}`);
    setRecordLop({ ...result?.data?.data });
  };

  React.useEffect(() => {
    getDataLop();
  }, []);
  return (
    <Card
      title={
        <Breadcrumb style={{ cursor: 'pointer' }}>
          <Breadcrumb.Item
            onClick={() => {
              history.push('/quanlyhocsinh/thongtinhocphi');
            }}
          >
            <ArrowLeftOutlined /> Danh sách lớp
          </Breadcrumb.Item>
          <Breadcrumb.Item>{record?.tenDonVi ?? recordLop?.tenDonVi}</Breadcrumb.Item>
        </Breadcrumb>
      }
    >
      <HocPhi id={id} idParent={record?.parent ?? recordLop?.parent} />
    </Card>
  );
};

export default DetailQuanLyLop;
