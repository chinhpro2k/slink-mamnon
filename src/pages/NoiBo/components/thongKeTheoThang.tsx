import { Card, Col, DatePicker, Modal, Row, Select, Spin, Tabs } from 'antd';
import DemoColumn from '@/components/Chart/Column';
import React, { useEffect, useState } from 'react';
import { DataStatistic } from '@/pages/NoiBo/components/thongKeTheoNgay';
import TableBase from '@/components/Table';
import moment from 'moment';
import { useModel } from '@@/plugin-model/useModel';
import { BaoCaoNoiBo } from '@/services/BaoCaoNoiBo';
import ColumnPlotChart from '@/components/Chart/ColumnPlot';
import LineChart from '@/components/Chart/Line';
import MultiLine, { IDataMulti } from '@/components/Chart/MultiLine';
import styled from 'styled-components';
import { formatPhoneNumber } from '@/functionCommon';
import Statistic from '@/pages/DoanhThu/components/statistic';
import LineArea from '@/components/Chart/LineArea';
const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
});
interface Iprops {
  isTinhLai: boolean;
  listTruong?: any;
}
const ThongKeTheoThang = (props: Iprops) => {
  const vaiTro = localStorage.getItem('vaiTro');
  const [selectDate, setSelectDate] = useState<any>();
  const {
    limit,
    cond,
    page,
    setPage,
    loadingBaoCaoNoiBo,
    getDataBaoCaoHocSinhThang,
    getDataBaoCaoGiaoVienThang,
    getDataBaoCaoThang,
    getDataBaoCaoThangChuTruong,
    lop,
    dataThang,
    getDataLopWithSchool,
    getDataThongKeThang,
    getDataThongKeChuTruongThang,
    dataThongKeThang,
  } = useModel('baocaonoibo');
  const [ngay, setNgay] = useState<number>(new Date().getDate());
  const [thang, setThang] = useState<number>(new Date().getMonth());
  const [nam, setNam] = useState<number>(new Date().getFullYear());
  const [statistics, setStatistics] = useState<DataStatistic[]>([]);
  const [statisticsThongKeStudent, setStatisticsThongKeStudent] = useState<IDataMulti[]>([]);
  const [statisticsThongKeGV, setStatisticsThongKeGV] = useState<IDataMulti[]>([]);
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId ?? '';
  const [truongId, setTruongId] = useState<string | undefined>(organizationId);
  const [valueSelect, setValueSelect] = useState<string>(vaiTro === 'ChuTruong' ? 'Tất cả' : '');
  const [donViId, setDonViId] = useState<string>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      fixed: 'left',
    },
    {
      title: 'Họ và tên học sinh',
      dataIndex: 'hoTen',
      align: 'center',
      fixed: 'left',
      // render: (value) => value.khoiKienThuc,
    },
    {
      title: 'Họ và tên phụ huynh',
      dataIndex: 'user',
      align: 'center',
      fixed: 'left',
      render: (value: any) => value?.profile.fullname,
    },
    {
      title: 'SĐT phụ huynh',
      dataIndex: 'user',
      align: 'center',
      width: 150,
      // render: (value: { profile: { phoneNumber: any } }) => value?.profile.phoneNumber,
      render: (val: { profile: { phoneNumber: string } }) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              width={16}
              height={16}
              style={{ marginRight: '4px', color: 'green' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            {formatPhoneNumber(val?.profile.phoneNumber)}
          </div>
        );
      },
    },
    {
      title: 'Lớp',
      dataIndex: 'donVi',
      align: 'center',
      render: (value: { tenDonVi: any }) => value?.tenDonVi,
    },
    {
      title: 'Tổng học phí - Số tiền phải đóng',
      dataIndex: 'hocPhi',
      align: 'center',
      render: (value: any) => formatter.format(value ?? 0),
    },
    {
      title: 'Số ngày nghỉ không phép trong tháng',
      dataIndex: 'soNgayNghiKhongPhep',
      align: 'center',
    },
    {
      title: 'Số ngày nghỉ có phép trong tháng',
      dataIndex: 'soNgayNghiCoPhep',
      align: 'center',
    },
    {
      title: 'Chiều cao (cm)',
      dataIndex: 'chieuCao',
      align: 'center',
    },
    {
      title: 'Cân nặng (kg)',
      dataIndex: 'canNang',
      align: 'center',
    },
  ];
  const columnsGiaoVien = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      fixed: 'left',
    },
    {
      title: 'Họ và tên',
      dataIndex: 'hoTen',
      align: 'center',
      fixed: 'left',
      // render: (value) => value.khoiKienThuc,
    },
    {
      title: 'SĐT giáo viên',
      dataIndex: 'soDienThoai',
      align: 'center',
      width: 150,
      render: (val: string) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              width={16}
              height={16}
              style={{ marginRight: '4px', color: 'green' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            {formatPhoneNumber(val)}
          </div>
        );
      },
    },
    {
      title: 'Tổng ngày công tháng',
      dataIndex: 'soNgayCongQuyDinh',
      align: 'center',
    },
    {
      title: 'Số ngày đi làm/tháng',
      dataIndex: 'soNgayDiLam',
      align: 'center',
    },
    {
      title: 'Tổng lương tháng - Thực lĩnh',
      dataIndex: 'tienLuongThucLinh',
      align: 'center',
      render: (value: any) => formatter.format(value ?? 0),
    },
    {
      title: 'Tổng điểm tháng',
      dataIndex: 'diemDanhGia',
      align: 'center',
      render: (value: number) => {
        return +value.toFixed(1);
      },
    },
  ];
  useEffect(() => {
    if (dataThang) {
      dataThang.map((value) => {
        const arr: DataStatistic[] = [];
        arr.push({
          name: 'Số học sinh',
          count: value?.soHocSinh ?? 0,
        });
        arr.push({
          name: 'Số giáo viên',
          count: value?.soGiaoVien ?? 0,
        });
        arr.push({
          name: 'Số lớp hiện tại',
          count: value?.soLopHienTai ?? 0,
        });
        setStatistics(arr);
      });
    }
  }, [dataThang]);
  useEffect(() => {
    if (dataThongKeThang.length > 0) {
      setDataThongKeThang(dataThongKeThang);
    }
  }, [dataThongKeThang]);
  useEffect(() => {
    if (vaiTro === 'ChuTruong') {
      getDataBaoCaoThangChuTruong({
        donViId: truongId,
        ngay: ngay?.toString(),
        thang: thang?.toString(),
        nam: nam?.toString(),
      });
      getDataThongKeChuTruongThang({
        donViId: truongId,
        ngay: ngay?.toString(),
        thang: thang?.toString(),
        nam: nam?.toString(),
      });
    } else {
      getDataBaoCaoThang({
        truongId,
        ngay,
        thang,
        nam,
      });
      getDataThongKeThang({
        truongId,
        ngay,
        thang,
        nam,
      });
    }
  }, []);
  const setDataThongKeThang = (data: BaoCaoNoiBo.IThongKeThang[]) => {
    const arr1: IDataMulti[] = [];
    const arr2: IDataMulti[] = [];
    const arr3: IDataMulti[] = [];
    const arr4: IDataMulti[] = [];
    const arr5: IDataMulti[] = [];
    data.forEach((val) => {
      arr1.push({
        xData: val.ngay,
        yData: val.soHocSinhDiHoc,
        category: 'Số học sinh đi học',
      });
      arr2.push({
        xData: val.ngay,
        yData: val.soHocSinhNghiCoPhep,
        category: 'Số học sinh nghỉ có phép',
      });
      arr3.push({
        xData: val.ngay,
        yData: val.soHocSinhNghiKhongPhep,
        category: 'Số học sinh nghỉ không phép',
      });
      arr4.push({
        xData: val.ngay,
        yData: val.soGiaoVienDiLam,
        category: 'Số giáo viên đi làm',
      });
      arr5.push({
        xData: val.ngay,
        yData: val.soGiaoVienNghiLam,
        category: 'Số giáo viên nghỉ làm',
      });
    });
    const arrTotal = arr1.concat(arr2, arr3);
    const arrTotal2 = arr4.concat(arr5);
    setStatisticsThongKeStudent(arrTotal);
    setStatisticsThongKeGV(arrTotal2);
  };
  const onChange = (date: any) => {
    setSelectDate(date);
    setNgay(new Date(date).getDate());
    setThang(new Date(date).getMonth());
    setNam(new Date(date).getFullYear());
    if (vaiTro === 'ChuTruong' && valueSelect === 'Tất cả') {
      getDataBaoCaoThangChuTruong({
        donViId: donViId,
        ngay: new Date(date).getDate()?.toString(),
        thang: new Date(date).getMonth()?.toString(),
        nam: new Date(date).getFullYear()?.toString(),
      });
      getDataThongKeChuTruongThang({
        donViId: donViId,
        ngay: new Date(date).getDate()?.toString(),
        thang: new Date(date).getMonth()?.toString(),
        nam: new Date(date).getFullYear()?.toString(),
      });
    } else {
      getDataBaoCaoHocSinhThang({
        truongId: truongId,
        ngay: new Date(date).getDate(),
        thang: new Date(date).getMonth(),
        nam: new Date(date).getFullYear(),
        donViId: donViId,
      });
      getDataBaoCaoGiaoVienThang({
        truongId: truongId,
        ngay: new Date(date).getDate(),
        thang: new Date(date).getMonth(),
        nam: new Date(date).getFullYear(),
      });
      getDataBaoCaoThang({
        truongId,
        ngay: new Date(date).getDate(),
        thang: new Date(date).getMonth(),
        nam: new Date(date).getFullYear(),
      });
      getDataThongKeThang({
        truongId,
        ngay: new Date(date).getDate(),
        thang: new Date(date).getMonth(),
        nam: new Date(date).getFullYear(),
      });
    }
    setPage(1);
  };
  useEffect(() => {
    setDonViId(lop[0]?._id);
    if (vaiTro === 'ChuTruong') {
    } else {
      if (props.isTinhLai) {
        getDataBaoCaoGiaoVienThang({
          truongId,
          ngay,
          thang,
          nam,
        });
        getDataBaoCaoHocSinhThang({
          truongId,
          ngay,
          thang,
          nam,
          donViId: lop[0]?._id,
        });
      }
    }
  }, [props.isTinhLai, lop]);
  const [keyTab, setKeyTab] = useState<string>('1');
  const onChangeTab = (value: string) => {
    setKeyTab(value);
  };
  const handleChange = (value: string) => {
    setDonViId(value);
    // getDataBaoCaoHocSinhThang({
    //   truongId,
    //   ngay,
    //   thang,
    //   nam,
    //   donViId: value,
    // });
  };
  const handleChangeDonVi = (value: string) => {
    if (value === 'Tất cả') {
      setValueSelect('Tất cả');
      const dataReq: BaoCaoNoiBo.DataGetBaoCaoNgay = {
        ngay: moment(selectDate).day().toString(),
        thang: moment(selectDate).month().toString(),
        nam: moment(selectDate).year().toString(),
        donViId: organizationId?.toString() ?? '',
      };
      getDataBaoCaoThangChuTruong(dataReq).then();
      getDataThongKeChuTruongThang(dataReq);
    } else {
      const dataReq: BaoCaoNoiBo.DataGetBaoCaoThang = {
        truongId: value,
        ngay: moment(selectDate).day(),
        thang: moment(selectDate).month(),
        nam: moment(selectDate).year(),
      };
      setTruongId(value);
      setValueSelect('');
      getDataBaoCaoThang(dataReq).then();
      getDataThongKeThang(dataReq).then();
      getDataLopWithSchool(value).then();
    }
  };
  // useEffect(() => {
  //   setDonViId(lop[0]?._id);
  //   if (vaiTro === 'ChuTruong' && lop.length > 0) {
  //     getDataBaoCaoGiaoVienThang({
  //       truongId: truongId,
  //       ngay,
  //       thang,
  //       nam,
  //     });
  //     getDataBaoCaoHocSinhThang({
  //       truongId: truongId,
  //       ngay,
  //       thang,
  //       nam,
  //       donViId: lop[0]?._id,
  //     });
  //   }
  // }, [lop]);
  return (
    <ThangWraper>
      <Row gutter={[16, 16]}>
        <Col span={24} style={{ marginBottom: '8px' }}>
          <DatePicker
            onChange={onChange}
            defaultValue={moment()}
            picker="month"
            format="MM-YYYY"
            placeholder="Chọn tháng"
            style={{ marginRight: '10px' }}
          />
          {vaiTro === 'ChuTruong' && (
            <Select defaultValue="Tất cả" style={{ width: 120 }} onChange={handleChangeDonVi}>
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

        {/*<Col xs={24} lg={24}>*/}
        {/*  <Statistic*/}
        {/*    data={[*/}
        {/*      { title: 'Số lớp', value: dataThang?.[0]?.soLopHienTai ?? 0, unit: 'Lớp' },*/}
        {/*      { title: 'Số học sinh', value: dataThang?.[0]?.soHocSinh ?? 0, unit: 'Học sinh' },*/}
        {/*      { title: 'Số cô', value: dataThang?.[0]?.soGiaoVien ?? 0, unit: 'Cô' },*/}
        {/*    ]}*/}
        {/*  />*/}
        {/*</Col>*/}
        <Col span={24}>
          <Card
            bordered={false}
            title="Học sinh"
            bodyStyle={{ padding: 20, backgroundColor: '#5a9bd30d' }}
            headStyle={{
              backgroundColor: '#5a9bd3',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '18px',
            }}
          >
            <LineArea
              data={statisticsThongKeStudent?.map((item) => ({
                xData: item?.xData.toString() || 'Đang cập nhật',
                yData: item?.yData,
                category: item?.category,
              }))}
            />
          </Card>
        </Col>
        <Col span={24}>
          <Card
            bordered={false}
            title="Giáo viên"
            bodyStyle={{ padding: 20, backgroundColor: '#4ec58d0d' }}
            headStyle={{
              backgroundColor: '#4ec58d',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '18px',
            }}
          >
            <LineArea
              data={statisticsThongKeGV?.map((item) => ({
                xData: item?.xData.toString() || 'Đang cập nhật',
                yData: item?.yData,
                category: item?.category,
              }))}
            />
          </Card>
        </Col>
        <Col span={24}>
          {/*<TableBase*/}
          {/*  border*/}
          {/*  columns={columsThang}*/}
          {/*  getData={() =>*/}
          {/*    getDataBaoCaoThang({*/}
          {/*      truongId,*/}
          {/*      ngay,*/}
          {/*      thang,*/}
          {/*      nam,*/}
          {/*    })*/}
          {/*  }*/}
          {/*  dependencies={[page, limit, cond]}*/}
          {/*  loading={loadingBaoCaoNoiBo}*/}
          {/*  modelName="baocaonoibo"*/}
          {/*  dataState={'dataThang'}*/}
          {/*></TableBase>*/}

          {(vaiTro !== 'ChuTruong' || (vaiTro === 'ChuTruong' && valueSelect !== 'Tất cả')) && (
            <Tabs defaultActiveKey="1" onChange={onChangeTab} activeKey={keyTab}>
              <Tabs.TabPane tab="Học sinh" key="1">
                <div style={{ marginBottom: '8px' }} key={lop}>
                  Chọn lớp:{' '}
                  <Select
                    defaultValue={lop[0]?.tenDonVi ?? 'Tất cả'}
                    style={{ width: 120 }}
                    onChange={handleChange}
                    allowClear
                  >
                    {lop
                      .filter((val) => {
                        return val.loaiDonVi === 'Lop';
                      })
                      .map((value, i) => {
                        return (
                          <Select.Option value={value?._id} key={i}>
                            {value?.tenDonVi}
                          </Select.Option>
                        );
                      })}
                  </Select>
                </div>
                <TableBase
                  border
                  columns={columns}
                  getData={() =>
                    getDataBaoCaoHocSinhThang({
                      truongId,
                      ngay,
                      thang,
                      nam,
                      donViId,
                    })
                  }
                  dependencies={[page, limit, cond, donViId]}
                  loading={loadingBaoCaoNoiBo}
                  modelName="baocaonoibo"
                  dataState={'dataBaoCaoHocSinhThang'}
                  scroll={{ x: 1300 }}
                  title="Thông tin học sinh"
                ></TableBase>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Giáo viên" key="2">
                <TableBase
                  border
                  columns={columnsGiaoVien}
                  getData={() =>
                    getDataBaoCaoGiaoVienThang({
                      truongId,
                      ngay,
                      thang,
                      nam,
                    })
                  }
                  dependencies={[page, limit, cond]}
                  loading={loadingBaoCaoNoiBo}
                  modelName="baocaonoibo"
                  scroll={{ x: 1300 }}
                  dataState={'dataBaoCaoGiaoVienThang'}
                  title="Thông tin Giáo viên"
                ></TableBase>
              </Tabs.TabPane>
            </Tabs>
          )}
        </Col>
      </Row>
    </ThangWraper>
  );
};
export default ThongKeTheoThang;

const ThangWraper = styled.div``;
