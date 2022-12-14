import ChartCard from '@/pages/dashboard/analysis/components/Charts/ChartCard';
import {
  getCountGV,
  getCountHS,
  getCountLop,
  getDiemDanhGV,
  getDiemDanhHS,
} from '@/services/BaoCaoNoiBo/baocaonoibo';
import { Badge, Card, Col, Row, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ThongKeGiaoVien from './components/ThongKeGV';
import ThongKeHocSinh from './components/ThongKeHS';

const BaoCaoNoiBo = () => {
  const [countLop, setCountLop] = useState<number>(0);
  const [countHS, setCountHS] = useState<number>(0);
  const [countGV, setCountGV] = useState<number>(0);
  const [countDiemDanh, setCountDiemDanh] = useState<number>(0);
  const [countDiemDanhGV, setCountDiemDanhGV] = useState<number>(0);
  const [diemDanh, setDiemDanh] =
    useState<{ soDiHoc: number; soNghiCoPhep: number; soNghiKhongPhep: number }>();
  const [diemDanhGV, setDiemDanhGV] = useState<{ soLuongDiLam: number; soLuongNghi: number }>();
  const { initialState } = useModel('@@initialState');
  const donViId = initialState?.currentUser?.role?.organizationId;

  const getLop = async () => {
    const result = await getCountLop(donViId);
    setCountLop(result?.data?.data);
  };

  const getHS = async () => {
    const result = await getCountHS(donViId);
    setCountHS(result?.data?.data?.tongSoHocSinh);
  };

  const getGV = async () => {
    const result = await getCountGV(donViId);
    setCountGV(result?.data?.data?.total);
  };

  const getDiemDanh = async () => {
    const result = await getDiemDanhHS(donViId);
    setDiemDanh(result?.data?.data);
    const totalDiemDanh =
      result?.data?.data?.soDiHoc +
      result?.data?.data?.soNghiCoPhep +
      result?.data?.data?.soNghiKhongPhep;
    setCountDiemDanh(totalDiemDanh);
  };

  const getDiemDanhGiaoVien = async () => {
    const result = await getDiemDanhGV(donViId);
    setDiemDanhGV(result?.data?.data);
    const totalDiemDanh = result?.data?.data?.soLuongDiLam + result?.data?.data?.soLuongNghi;
    setCountDiemDanhGV(totalDiemDanh);
  };

  useEffect(() => {
    getLop();
    getHS();
    getGV();
    getDiemDanh();
    getDiemDanhGiaoVien();
  }, []);
  return (
    <>
      <div>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12} xl={6}>
            <ChartCard
              title={<div style={{ color: 'black', fontWeight: 'bold' }}>T???ng s??? l???p</div>}
              bordered
              total={<p style={{ fontSize: 30 }}>{countLop ?? 0}</p>}
              contentHeight={70}
            >
              <Badge color="purple" text={`S??? h???c sinh: ${countHS ?? 0}`} /> <br />
              <Badge color="green" text={`S??? gi??o vi??n: ${countGV ?? 0} `} />
            </ChartCard>
          </Col>
          <Col xs={24} md={12} xl={6}>
            <ChartCard
              title={
                <div style={{ color: 'black', fontWeight: 'bold' }}>
                  Th???ng k?? ??i???m danh h???c sinh
                </div>
              }
              bordered
              total={<p style={{ fontSize: 30 }}>{countDiemDanh ?? 0}</p>}
              contentHeight={70}
            >
              <Badge color="purple" text={`S??? h???c sinh ??i h???c: ${diemDanh?.soDiHoc ?? 0}`} /> <br />
              <Badge
                color="green"
                text={`S??? h???c sinh ngh??? c?? ph??p: ${diemDanh?.soNghiCoPhep ?? 0} `}
              />
              <br />
              <Badge
                color="blue"
                text={`S??? h???c sinh ngh??? kh??ng ph??p: ${diemDanh?.soNghiKhongPhep ?? 0} `}
              />
            </ChartCard>
          </Col>
          <Col xs={24} md={12} xl={6}>
            <ChartCard
              title={
                <div style={{ color: 'black', fontWeight: 'bold' }}>
                  Th???ng k?? ??i???m danh gi??o vi??n
                </div>
              }
              bordered
              total={<p style={{ fontSize: 30 }}>{countDiemDanhGV}</p>}
              contentHeight={70}
            >
              <Badge
                color="purple"
                text={`S??? gi??o vi??n ??i l??m: ${diemDanhGV?.soLuongDiLam ?? 0}`}
              />{' '}
              <br />
              <Badge
                color="green"
                text={`S??? gi??o vi??n ngh??? l??m: ${diemDanhGV?.soLuongNghi ?? 0} `}
              />
            </ChartCard>
          </Col>
          <Col xs={24} md={12} xl={6}>
            <ChartCard
              title={<div style={{ color: 'black', fontWeight: 'bold' }}>S??? l?????ng kh???o s??t</div>}
              bordered
              total={<p style={{ fontSize: 30 }}>{20}</p>}
              contentHeight={70}
            >
              <Badge color="purple" text={`S??? l?????ng l??m kh???o s??t: 0`} /> <br />
              <Badge color="green" text={`S??? l?????ng ch??a l??m kh???o s??t: 0 `} />
            </ChartCard>
          </Col>
        </Row>
        <br />
        <Card>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Th???ng k?? h???c sinh" key="1">
              <ThongKeHocSinh />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Th???ng k?? gi??o vi??n" key="2">
              <ThongKeGiaoVien />
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </div>
    </>
  );
};

export default BaoCaoNoiBo;
