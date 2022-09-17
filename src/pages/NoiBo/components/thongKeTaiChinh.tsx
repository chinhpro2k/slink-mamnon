import { Card, Col, Row } from 'antd';
import ColumnPlotChart from '@/components/Chart/ColumnPlot';
import React, { useEffect, useState } from 'react';
import { DataStatistic } from '@/pages/NoiBo/components/thongKeTheoNgay';
import { useModel } from '@@/plugin-model/useModel';
import { BaoCaoNoiBo } from '@/services/BaoCaoNoiBo';
import moment from 'moment';
import Statistic, { IDataStatistic } from '@/pages/DoanhThu/components/statistic';
import BasicPie from '@/components/Chart/BasicPie';
const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
});
const ThongKeTaiChinh = (props: {
  children?: any;
  // dataSoft?: { donViId?: string; date?: any };
  donViId?: string;
  donViIdThuc?: string;

  changeTabs?: string;
}) => {
  const {
    getDataThongKeTaiSanThang,
    getDataThongKeTaiSanChuTruongThang,
    dataThongKeTaiSanThang,
    getDataThongKeHocPhi,
    dataThongKeHocPhiThang,
    getDataThongKeHocPhiChuTruong,
  } = useModel('baocaonoibo');
  const { date, month, year } = useModel('doanhthu');
  const [statisticsTaiSan, setStatisticsTaiSan] = useState<DataStatistic[]>([]);
  const [statisticsHocPhi, setStatisticsHocPhi] = useState<IDataStatistic[]>([]);
  const vaiTro = localStorage.getItem('vaiTro');
  const { initialState } = useModel('@@initialState');
  const [donViId, setDonViId] = useState<string>(props.donViId ?? '');
  const [donViIdThuc, setDonViIdThuc] = useState<string>(props.donViIdThuc ?? '');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const setDataHocPhi = (recordData: BaoCaoNoiBo.IThongKeHocPhiThang) => {
    const obj1: IDataStatistic = {
      title: 'Tổng số tiền học',
      value: formatter.format(recordData?.tongTienHoc ?? 0),
    };
    const obj2: IDataStatistic = {
      title: 'Số tiền đã đóng',
      value: formatter.format(recordData?.tongTienDaDong ?? 0),
    };
    const obj3: IDataStatistic = {
      title: 'Tổng số học sinh',
      value: recordData?.tongSoHocSinh ?? 0,
      unit: 'Học sinh',
    };
    const obj4: IDataStatistic = {
      title: 'Số học sinh đã đóng',
      value: recordData?.soHocSinhDaDong ?? 0,
      unit: 'Học sinh',
    };
    const arr: IDataStatistic[] = [];
    arr.push(obj1);
    arr.push(obj2);
    arr.push(obj3);
    arr.push(obj4);
    setStatisticsHocPhi(arr);
  };
  const setDataTaiSan = (recordData: BaoCaoNoiBo.IThongKeTaiSanThang) => {
    const obj1: DataStatistic = {
      name: 'Tổng tài sản hiện tại',
      count: recordData?.tongSoTien ?? 0,
    };
    const obj2: DataStatistic = {
      name: 'Đang hỏng',
      count: recordData?.tongTaiSanHong ?? 0,
    };
    const obj3: DataStatistic = {
      name: 'Đã thanh lý',
      count: recordData?.tongTaiSanThanhLy ?? 0,
    };
    const arr: DataStatistic[] = [];
    arr.push(obj1);
    arr.push(obj2);
    arr.push(obj3);
    setStatisticsTaiSan(arr);
  };
  useEffect(() => {
    if (vaiTro !== 'ChuTruong') {
      getDataThongKeTaiSanThang(organizationId ?? '');
      getDataThongKeHocPhi(organizationId ?? '', month, year);
    } else {
      getDataThongKeTaiSanChuTruongThang();
      getDataThongKeHocPhiChuTruong(month, year);
    }
  }, []);
  useEffect(() => {
    if (props.changeTabs === '1') {
      console.log('donviprops', props.donViId);
      console.log('don vi id', donViId);
      if (props.donViId && props.donViId !== '') {
        getDataThongKeTaiSanThang(props.donViId ?? '');
        getDataThongKeHocPhi(props.donViId ?? '', month, year);
      } else {
        if (vaiTro === 'ChuTruong') {
          getDataThongKeTaiSanChuTruongThang();
          getDataThongKeHocPhiChuTruong(month, year);
        }
      }
    } else {
      console.log('thuc', donViIdThuc);
      if (props.donViIdThuc && props.donViIdThuc !== '') {
        getDataThongKeTaiSanThang(props.donViIdThuc ?? '');
        getDataThongKeHocPhi(props.donViIdThuc ?? '', month, year);
      } else {
        if (vaiTro === 'ChuTruong') {
          getDataThongKeTaiSanChuTruongThang();
          getDataThongKeHocPhiChuTruong(month, year);
        }
      }
    }
  }, [props.changeTabs, props.donViIdThuc, props.donViId, date]);
  useEffect(() => {
    setDataTaiSan(dataThongKeTaiSanThang);
    setDataHocPhi(dataThongKeHocPhiThang);
  }, [dataThongKeTaiSanThang, dataThongKeHocPhiThang]);
  return (
    <>
      <Row style={{ marginTop: '24px' }} gutter={[16, 16]}>
        <Col span={24}>
          <div>
            <Statistic data={statisticsHocPhi} type={'color'} />
          </div>
        </Col>
        <Col span={16}>{props.children}</Col>
        <Col span={8}>
          <Card
            title={'Tài sản'}
            bordered={false}
            // headStyle={{ backgroundColor: '#FF9933', color: '#FFFFFF', fontWeight: 600 }}
            // bodyStyle={{ backgroundColor: '#ff99330d' }}
            headStyle={{ backgroundColor: '#009900', color: '#FFFFFF', fontWeight: 600 }}
            bodyStyle={{ backgroundColor: '#0099000d' }}
          >
            <BasicPie
              data={statisticsTaiSan?.map((item) => ({
                name: item?.name || 'Đang cập nhật',
                value: item?.count,
              }))}
              format={'currency'}
              // xLabel={'Giá trị'}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default ThongKeTaiChinh;
