import { Card, Col, DatePicker, DatePickerProps, Row, Select, Table } from 'antd';
import DemoPie from '@/components/Chart/Pie';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { BaoCaoNoiBo } from '@/services/BaoCaoNoiBo';
import moment from 'moment';
import styled from 'styled-components';
import Statistic, { IDataStatistic } from '@/pages/DoanhThu/components/statistic';
import PiePlotChart from '@/components/Chart/PiePlot';
import BasicPie from '@/components/Chart/BasicPie';
export interface DataStatistic {
  name: string;
  count: number;
}
export interface DataStatisticRoseChart {
  name: string;
  count: number;
  user: string;
}
interface IProps {
  isTinhLai: boolean;
  listTruong?: any;
}
const StatisticDayWrapper = styled.div``;

const ThongKeTheoNgay = (props: IProps) => {
  const vaiTro = localStorage.getItem('vaiTro');
  const { dataGetBaoCao, getDataBaoCaoNgay, getDataBaoCaoNgayChuTruong } = useModel('baocaonoibo');
  const [statisticStudent, setStatisticStudent] = useState<DataStatistic[]>([]);
  const [statisticAlbum, setStatisticAlbum] = useState<DataStatistic[]>([]);
  const [statisticDanThuoc, setStatisticDanThuoc] = useState<DataStatistic[]>([]);
  const [statisticDonCon, setStatisticDonCon] = useState<DataStatistic[]>([]);
  const [statisticTeacher, setStatisticTeacher] = useState<DataStatistic[]>([]);
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [donViId, setDonViId] = useState<string | undefined>(organizationId);
  const [selectDate, setSelectDate] = useState<any>();
  const [dataStatisticsNgay, setStatisticsNgay] = useState<IDataStatistic[]>([]);
  const [valueSelect, setValueSelect] = useState<string>(vaiTro === 'ChuTruong' ? 'Tất cả' : '');
  const [dataBaoCao, setDataBaoCao] = useState<BaoCaoNoiBo.DataBaoCaoTheoNgay[]>([
    {
      soGiaoVienDiLam: 0,
      soGiaoVienNghiLam: 0,
      soHocSinhDiHoc: 0,
      soHocSinhNghiCoPhep: 0,
      soHocSinhNghiKhongPhep: 0,
      tongSoGiaoVien: 0,
      tongSoHocSinh: 0,
    },
  ]);
  const setDataHocSinh = (data: BaoCaoNoiBo.DataBaoCaoTheoNgay) => {
    const arr = [];
    arr.push({
      name: 'Đi học',
      count: data?.soHocSinhDiHoc ?? 0,
    });
    arr.push({
      name: 'Nghỉ có phép',
      count: data?.soHocSinhNghiCoPhep ?? 0,
    });
    arr.push({
      name: 'Nghỉ không phép',
      count: data?.soHocSinhNghiKhongPhep ?? 0,
    });
    setStatisticStudent(arr);
  };
  const setDataBottomStatistic = (data: BaoCaoNoiBo.DataBaoCaoTheoNgay) => {
    const arr = [];
    arr.push({
      name: 'Đã duyệt',
      count: data?.soAlbumAnhDaDuyet ?? 0,
    });
    arr.push({
      name: 'Chưa duyệt',
      count: data?.soAlbumAnhChuaDuyet ?? 0,
    });
    const arr2 = [];
    arr2.push({
      name: 'Đã xác nhận',
      count: data?.soDonDanThuocDaDuyet ?? 0,
    });
    arr2.push({
      name: 'Chưa xác nhận',
      count: data?.soDonDanThuocChuaDuyet ?? 0,
    });
    const arr3 = [];
    arr3.push({
      name: 'Đã xác nhận',
      count: data?.soDonDanDonConDaDuyet ?? 0,
    });
    arr3.push({
      name: 'Chưa xác nhận',
      count: data?.soDonDanDonConChuaDuyet ?? 0,
    });
    setStatisticAlbum(arr);
    console.log('arr', arr);
    setStatisticDanThuoc(arr2);
    setStatisticDonCon(arr3);
  };
  useEffect(() => {
    const day = new Date().getDate();
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    const dataReq: BaoCaoNoiBo.DataGetBaoCaoNgay = {
      ngay: day.toString(),
      thang: month.toString(),
      nam: year.toString(),
      donViId: donViId?.toString() ?? '',
    };
    if (vaiTro === 'ChuTruong') {
      getDataBaoCaoNgayChuTruong(dataReq).then();
    } else {
      getDataBaoCaoNgay(dataReq).then();
    }
  }, [props.isTinhLai]);
  const setDataGiaoVien = (data: BaoCaoNoiBo.DataBaoCaoTheoNgay) => {
    const arr = [];
    arr.push({
      name: 'Đi làm',
      count: data?.soGiaoVienDiLam ?? 0,
    });
    arr.push({
      name: 'Vắng mặt',
      count: data?.soGiaoVienNghiLam ?? 0,
    });
    setStatisticTeacher(arr);
  };
  const setDataStatisticNgay = () => {
    const obj2: IDataStatistic = {
      title: 'Tổng số học sinh',
      value: dataGetBaoCao?.tongSoHocSinh ?? 0,
      unit: 'Học sinh',
    };
    const obj3: IDataStatistic = {
      title: 'Tổng số giáo viên',
      value: dataGetBaoCao?.tongSoGiaoVien ?? 0,
      unit: 'Giáo viên',
    };
    const obj1: IDataStatistic = {
      title: 'Tổng số lớp',
      value: dataGetBaoCao?.tongSoLopHienTai ?? 0,
      unit: 'Lớp',
    };
    // const obj1: IDataStatistic = {
    //   title: 'Học sinh đi học',
    //   value: dataGetBaoCao?.soHocSinhDiHoc ?? 0,
    //   unit: 'Học sinh',
    // };
    // const obj2: IDataStatistic = {
    //   title: 'Học sinh nghỉ có phép',
    //   value: dataGetBaoCao?.soHocSinhNghiCoPhep ?? 0,
    //   unit: 'Học sinh',
    // };
    // const obj3: IDataStatistic = {
    //   title: 'Học sinh nghỉ không phép',
    //   value: dataGetBaoCao?.soHocSinhNghiKhongPhep ?? 0,
    //   unit: 'Học sinh',
    // };
    // const obj4: IDataStatistic = {
    //   title: 'Giáo viên đi làm',
    //   value: dataGetBaoCao?.soGiaoVienDiLam ?? 0,
    //   unit: 'GIáo viên',
    // };
    // const obj5: IDataStatistic = {
    //   title: 'Giáo viên nghỉ làm',
    //   value: dataGetBaoCao?.soGiaoVienNghiLam ?? 0,
    //   unit: 'Giáo viên',
    // };
    const arr: IDataStatistic[] = [];
    arr.push(obj1);
    arr.push(obj2);
    arr.push(obj3);
    // arr.push(obj4);
    // arr.push(obj5);
    setStatisticsNgay(arr);
  };
  useEffect(() => {
    setDataStatisticNgay();
    if (dataGetBaoCao) {
      setDataHocSinh(dataGetBaoCao);
      setDataGiaoVien(dataGetBaoCao);
      setDataBottomStatistic(dataGetBaoCao);
      const arr = [];
      arr.push(dataGetBaoCao);
      if (arr.length > 0) {
        setDataBaoCao(arr);
      }
    }
  }, [dataGetBaoCao]);

  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    if (date) {
      setSelectDate(date);

      // const day = new Date(dateString).getDate();
      // const month = new Date(dateString).getMonth();
      // const year = new Date(dateString).getFullYear();
      const day = moment(date).date();
      const month = moment(date).month();
      const year = moment(date).year();
      const dataReq: BaoCaoNoiBo.DataGetBaoCaoNgay = {
        ngay: day.toString(),
        thang: month.toString(),
        nam: year.toString(),
        donViId: donViId?.toString() ?? '',
      };
      if (vaiTro === 'ChuTruong' && valueSelect === 'Tất cả') {
        getDataBaoCaoNgayChuTruong(dataReq).then();
      } else {
        getDataBaoCaoNgay(dataReq).then();
      }
    } else {
      const dataReq: BaoCaoNoiBo.DataGetBaoCaoNgay = {
        ngay: moment().day().toString(),
        thang: moment().month().toString(),
        nam: moment().year().toString(),
        donViId: donViId,
      };
      if (vaiTro === 'ChuTruong' && valueSelect === 'Tất cả') {
        getDataBaoCaoNgayChuTruong(dataReq).then();
      } else {
        getDataBaoCaoNgay(dataReq).then();
      }
    }
  };
  const columns = [
    {
      title: 'Tổng số học sinh',
      dataIndex: 'tongSoHocSinh',
      align: 'center',
      render: (value: any, recordVal: any) =>
        +recordVal.soHocSinhDiHoc +
        +recordVal.soHocSinhNghiCoPhep +
        +recordVal.soHocSinhNghiKhongPhep,
    },
    {
      title: 'Số học sinh đi học',
      dataIndex: 'soHocSinhDiHoc',
      align: 'center',
      // render: (value) => value.khoiKienThuc,
    },
    {
      title: 'Số học sinh nghỉ có phép',
      dataIndex: 'soHocSinhNghiCoPhep',
      align: 'center',
    },
    {
      title: 'Số học sinh nghỉ không phép',
      dataIndex: 'soHocSinhNghiKhongPhep',
      align: 'center',
    },
  ];
  const columnsTeacher = [
    {
      title: 'Tổng số giáo viên',
      dataIndex: 'tongSoGiaoVien',
      align: 'center',
      render: (value: any, recordVal: any) =>
        +recordVal.soGiaoVienDiLam + +recordVal.soGiaoVienNghiLam,
    },
    {
      title: 'Số giáo viên đi làm',
      dataIndex: 'soGiaoVienDiLam',
      align: 'center',
      // render: (value) => value.khoiKienThuc,
    },
    {
      title: 'Số giáo viên vắng mặt',
      dataIndex: 'soGiaoVienNghiLam',
      align: 'center',
    },
  ];
  const handleChange = (value: string) => {
    if (value === 'Tất cả') {
      setValueSelect('Tất cả');
      const dataReq: BaoCaoNoiBo.DataGetBaoCaoNgay = {
        ngay: moment(selectDate).day().toString(),
        thang: moment(selectDate).month().toString(),
        nam: moment(selectDate).year().toString(),
        donViId: donViId?.toString() ?? '',
      };
      getDataBaoCaoNgayChuTruong(dataReq).then();
    } else {
      const dataReq: BaoCaoNoiBo.DataGetBaoCaoNgay = {
        ngay: moment(selectDate).day().toString(),
        thang: moment(selectDate).month().toString(),
        nam: moment(selectDate).year().toString(),
        donViId: value,
      };
      setDonViId(value);
      setValueSelect('');
      getDataBaoCaoNgay(dataReq).then();
    }
  };
  return (
    <StatisticDayWrapper>
      <Row gutter={[16, 16]}>
        <Col span={24} style={{ marginBottom: '8px' }}>
          <DatePicker
            onChange={onChange}
            defaultValue={moment()}
            format="DD-MM-YYYY"
            placeholder="Chọn ngày"
            style={{ marginRight: '10px' }}
            disabledDate={(current) => {
              return current && current > moment().endOf('day');
            }}
          />
          {vaiTro === 'ChuTruong' && (
            <Select defaultValue="Tất cả" style={{ width: 120 }} onChange={handleChange}>
              <Select.Option value={'Tất cả'}>Tất cả</Select.Option>
              {Array.isArray(props.listTruong) &&
                props.listTruong.map((value, i) => {
                  return (
                    <Select.Option value={value._id} key={i}>
                      {value.tenDonVi}
                    </Select.Option>
                  );
                })}
            </Select>
          )}
        </Col>
        <Col xs={24} lg={24}>
          <Statistic data={dataStatisticsNgay} type={'color'} />
        </Col>
        <Col xs={24} lg={12}>
          <Card
            bordered={false}
            title="Số lượng học sinh"
            // bodyStyle={{ padding: 0,backgroundColor: '#63c2df0d'  }}
            // headStyle={{ backgroundColor: '#63C2DF', color: '#FFFFFF',fontWeight:600 }}
            bodyStyle={{ padding: 0, backgroundColor: '#5a9bd33d' }}
            headStyle={{
              backgroundColor: '#5a9bd3',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '18px',
            }}
          >
            <BasicPie
              data={statisticStudent?.map((item) => ({
                name: item?.name || 'Đang cập nhật',
                value: item?.count,
              }))}
              position="right"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            bordered={false}
            title="Số lượng giáo viên"
            // bodyStyle={{ padding: 0, backgroundColor: '#ff00330d' }}
            // headStyle={{ backgroundColor: '#FF0033', color: '#FFFFFF',fontWeight:600 }}
            bodyStyle={{ padding: 0, backgroundColor: '#4ec58d3d' }}
            headStyle={{
              backgroundColor: '#4ec58d',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '18px',
            }}
          >
            <BasicPie
              data={statisticTeacher?.map((item: any) => ({
                name: item?.name || 'Đang cập nhật',
                value: item.count,
              }))}
              position="right"
            />
          </Card>
        </Col>
        <Col span={8}>
          {/*<Card bordered={false} title={'Thông tin học sinh'}>*/}
          {/*  <Table columns={columns} dataSource={dataBaoCao} pagination={false} />*/}
          {/*</Card>*/}
          {/*<Card bordered={false} title={'Thông tin giáo viên'}>*/}
          {/*  <Table columns={columnsTeacher} dataSource={dataBaoCao} pagination={false} />*/}
          {/*</Card>*/}
          <Card
            bordered={false}
            title="Album"
            bodyStyle={{ padding: 20, backgroundColor: '#5a9bd33d' }}
            headStyle={{
              backgroundColor: '#5a9bd3',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '18px',
            }}
          >
            <PiePlotChart
              // height={350}
              // hideLegend
              // hideLabel={true}
              height={200}
              labelTotal={'Album'}
              data={statisticAlbum?.map((item: any) => ({
                type: item?.name || 'Đang cập nhật',
                value: item.count,
              }))}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            bordered={false}
            title="Dặn thuốc"
            bodyStyle={{ padding: 20, backgroundColor: '#4ec58d3d' }}
            headStyle={{
              backgroundColor: '#4ec58d',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '18px',
            }}
          >
            <PiePlotChart
              // height={350}
              // hideLegend
              // hideLabel={true}
              height={200}
              labelTotal={'Đơn'}
              data={statisticDanThuoc?.map((item: any) => ({
                type: item?.name || 'Đang cập nhật',
                value: item.count,
              }))}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            bordered={false}
            bodyStyle={{ padding: 20, backgroundColor: '#70ad463d' }}
            title="Dặn đón con"
            headStyle={{ backgroundColor: '#70ad46', color: '#FFFFFF', fontWeight: 600 }}
          >
            <PiePlotChart
              // height={350}
              // hideLegend
              // hideLabel={true}
              height={200}
              labelTotal={'Đơn'}
              data={statisticDonCon?.map((item: any) => ({
                type: item?.name || 'Đang cập nhật',
                value: item.count,
              }))}
            />
          </Card>
        </Col>
      </Row>
    </StatisticDayWrapper>
  );
};
export default ThongKeTheoNgay;
