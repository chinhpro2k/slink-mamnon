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
              title={<div style={{ color: 'black', fontWeight: 'bold' }}>Tổng số lớp</div>}
              bordered
              total={<p style={{ fontSize: 30 }}>{countLop ?? 0}</p>}
              contentHeight={70}
            >
              <Badge color="purple" text={`Số học sinh: ${countHS ?? 0}`} /> <br />
              <Badge color="green" text={`Số giáo viên: ${countGV ?? 0} `} />
            </ChartCard>
          </Col>
          <Col xs={24} md={12} xl={6}>
            <ChartCard
              title={
                <div style={{ color: 'black', fontWeight: 'bold' }}>
                  Thống kê điểm danh học sinh
                </div>
              }
              bordered
              total={<p style={{ fontSize: 30 }}>{countDiemDanh ?? 0}</p>}
              contentHeight={70}
            >
              <Badge color="purple" text={`Số học sinh đi học: ${diemDanh?.soDiHoc ?? 0}`} /> <br />
              <Badge
                color="green"
                text={`Số học sinh nghỉ có phép: ${diemDanh?.soNghiCoPhep ?? 0} `}
              />
              <br />
              <Badge
                color="blue"
                text={`Số học sinh nghỉ không phép: ${diemDanh?.soNghiKhongPhep ?? 0} `}
              />
            </ChartCard>
          </Col>
          <Col xs={24} md={12} xl={6}>
            <ChartCard
              title={
                <div style={{ color: 'black', fontWeight: 'bold' }}>
                  Thống kê điểm danh giáo viên
                </div>
              }
              bordered
              total={<p style={{ fontSize: 30 }}>{countDiemDanhGV}</p>}
              contentHeight={70}
            >
              <Badge
                color="purple"
                text={`Số giáo viên đi làm: ${diemDanhGV?.soLuongDiLam ?? 0}`}
              />{' '}
              <br />
              <Badge
                color="green"
                text={`Số giáo viên nghỉ làm: ${diemDanhGV?.soLuongNghi ?? 0} `}
              />
            </ChartCard>
          </Col>
          <Col xs={24} md={12} xl={6}>
            <ChartCard
              title={<div style={{ color: 'black', fontWeight: 'bold' }}>Số lượng khảo sát</div>}
              bordered
              total={<p style={{ fontSize: 30 }}>{20}</p>}
              contentHeight={70}
            >
              <Badge color="purple" text={`Số lượng làm khảo sát: 0`} /> <br />
              <Badge color="green" text={`Số lượng chưa làm khảo sát: 0 `} />
            </ChartCard>
          </Col>
        </Row>
        <br />
        <Card>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Thống kê học sinh" key="1">
              <ThongKeHocSinh />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Thống kê giáo viên" key="2">
              <ThongKeGiaoVien />
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </div>
    </>
  );
};

export default BaoCaoNoiBo;
