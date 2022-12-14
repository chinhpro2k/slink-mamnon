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
  const [valueSelect, setValueSelect] = useState<string>(vaiTro === 'ChuTruong' ? 'T???t c???' : '');
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
      title: 'H??? v?? t??n h???c sinh',
      dataIndex: 'hoTen',
      align: 'center',
      fixed: 'left',
      // render: (value) => value.khoiKienThuc,
    },
    {
      title: 'H??? v?? t??n ph??? huynh',
      dataIndex: 'user',
      align: 'center',
      fixed: 'left',
      render: (value: any) => value?.profile.fullname,
    },
    {
      title: 'S??T ph??? huynh',
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
      title: 'L???p',
      dataIndex: 'donVi',
      align: 'center',
      render: (value: { tenDonVi: any }) => value?.tenDonVi,
    },
    {
      title: 'T???ng h???c ph?? - S??? ti???n ph???i ????ng',
      dataIndex: 'hocPhi',
      align: 'center',
      render: (value: any) => formatter.format(value ?? 0),
    },
    {
      title: 'S??? ng??y ngh??? kh??ng ph??p trong th??ng',
      dataIndex: 'soNgayNghiKhongPhep',
      align: 'center',
    },
    {
      title: 'S??? ng??y ngh??? c?? ph??p trong th??ng',
      dataIndex: 'soNgayNghiCoPhep',
      align: 'center',
    },
    {
      title: 'Chi???u cao (cm)',
      dataIndex: 'chieuCao',
      align: 'center',
    },
    {
      title: 'C??n n???ng (kg)',
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
      title: 'H??? v?? t??n',
      dataIndex: 'hoTen',
      align: 'center',
      fixed: 'left',
      // render: (value) => value.khoiKienThuc,
    },
    {
      title: 'S??T gi??o vi??n',
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
      title: 'T???ng ng??y c??ng th??ng',
      dataIndex: 'soNgayCongQuyDinh',
      align: 'center',
    },
    {
      title: 'S??? ng??y ??i l??m/th??ng',
      dataIndex: 'soNgayDiLam',
      align: 'center',
    },
    {
      title: 'T???ng l????ng th??ng - Th???c l??nh',
      dataIndex: 'tienLuongThucLinh',
      align: 'center',
      render: (value: any) => formatter.format(value ?? 0),
    },
    {
      title: 'T???ng ??i???m th??ng',
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
          name: 'S??? h???c sinh',
          count: value?.soHocSinh ?? 0,
        });
        arr.push({
          name: 'S??? gi??o vi??n',
          count: value?.soGiaoVien ?? 0,
        });
        arr.push({
          name: 'S??? l???p hi???n t???i',
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
        category: 'S??? h???c sinh ??i h???c',
      });
      arr2.push({
        xData: val.ngay,
        yData: val.soHocSinhNghiCoPhep,
        category: 'S??? h???c sinh ngh??? c?? ph??p',
      });
      arr3.push({
        xData: val.ngay,
        yData: val.soHocSinhNghiKhongPhep,
        category: 'S??? h???c sinh ngh??? kh??ng ph??p',
      });
      arr4.push({
        xData: val.ngay,
        yData: val.soGiaoVienDiLam,
        category: 'S??? gi??o vi??n ??i l??m',
      });
      arr5.push({
        xData: val.ngay,
        yData: val.soGiaoVienNghiLam,
        category: 'S??? gi??o vi??n ngh??? l??m',
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
    if (vaiTro === 'ChuTruong' && valueSelect === 'T???t c???') {
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
    if (value === 'T???t c???') {
      setValueSelect('T???t c???');
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
            placeholder="Ch???n th??ng"
            style={{ marginRight: '10px' }}
          />
          {vaiTro === 'ChuTruong' && (
            <Select defaultValue="T???t c???" style={{ width: 120 }} onChange={handleChangeDonVi}>
              <Select.Option value={'T???t c???'}>T???t c???</Select.Option>
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
        {/*      { title: 'S??? l???p', value: dataThang?.[0]?.soLopHienTai ?? 0, unit: 'L???p' },*/}
        {/*      { title: 'S??? h???c sinh', value: dataThang?.[0]?.soHocSinh ?? 0, unit: 'H???c sinh' },*/}
        {/*      { title: 'S??? c??', value: dataThang?.[0]?.soGiaoVien ?? 0, unit: 'C??' },*/}
        {/*    ]}*/}
        {/*  />*/}
        {/*</Col>*/}
        <Col span={24}>
          <Card
            bordered={false}
            title="H???c sinh"
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
                xData: item?.xData.toString() || '??ang c???p nh???t',
                yData: item?.yData,
                category: item?.category,
              }))}
            />
          </Card>
        </Col>
        <Col span={24}>
          <Card
            bordered={false}
            title="Gi??o vi??n"
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
                xData: item?.xData.toString() || '??ang c???p nh???t',
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

          {(vaiTro !== 'ChuTruong' || (vaiTro === 'ChuTruong' && valueSelect !== 'T???t c???')) && (
            <Tabs defaultActiveKey="1" onChange={onChangeTab} activeKey={keyTab}>
              <Tabs.TabPane tab="H???c sinh" key="1">
                <div style={{ marginBottom: '8px' }} key={lop}>
                  Ch???n l???p:{' '}
                  <Select
                    defaultValue={lop[0]?.tenDonVi ?? 'T???t c???'}
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
                  title="Th??ng tin h???c sinh"
                ></TableBase>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Gi??o vi??n" key="2">
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
                  title="Th??ng tin Gi??o vi??n"
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
