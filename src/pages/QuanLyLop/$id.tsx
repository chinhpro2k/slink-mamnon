import { ArrowLeftOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Tabs } from 'antd';
import { history, useModel } from 'umi';
import DanhSachGiaoVien from './components/DsGiaoVien';
import DanhSachHocSinh from './components/DsHocSinh';
import DanhSachGiaoVienNangCap from './components/GiaoVien';
import DanhSachHocSinhNangCap from './components/HocSinh';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import { useState } from 'react';
import React from 'react';
import { checkAllow } from '@/components/CheckAuthority';

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
              history.push('/quanlylop');
            }}
          >
            <ArrowLeftOutlined /> Quản lý lớp
          </Breadcrumb.Item>
          <Breadcrumb.Item>{record?.tenDonVi ?? recordLop?.tenDonVi}</Breadcrumb.Item>
        </Breadcrumb>
      }
    >
      <Tabs>
        <Tabs.TabPane tab="Danh sách giáo viên" key="2">
          <DanhSachGiaoVien
            id={id}
            idParent={record?.parent ?? recordLop?.parent}
            soQuanLyToiDa={record?.soQuanLyToiDa ?? recordLop?.soQuanLyToiDa}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Danh sách học sinh" key="3">
          <DanhSachHocSinh
            id={id}
            idParent={record?.parent ?? recordLop?.parent}
            sySo={record?.sySo ?? recordLop?.sySo}
          />
        </Tabs.TabPane>
        {checkAllow('NANG_CAP_GIAO_VIEN') && (
          <Tabs.TabPane tab="Nâng cấp tài khoản giáo viên" key="4">
            <DanhSachGiaoVienNangCap
              id={id}
              loai="Nâng cấp"
              idParent={record?.parent ?? recordLop?.parent}
            />
          </Tabs.TabPane>
        )}
        {checkAllow('NANG_CAP_HOC_SINH') && (
          <Tabs.TabPane tab="Nâng cấp tài khoản học sinh" key="5">
            <DanhSachHocSinhNangCap
              id={id}
              loai="Nâng cấp"
              idParent={record?.parent ?? recordLop?.parent}
              sySo={record?.sySo ?? recordLop?.sySo}
            />
          </Tabs.TabPane>
        )}
      </Tabs>
    </Card>
  );
};

export default DetailQuanLyLop;
