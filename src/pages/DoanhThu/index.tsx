/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { DoanhThu as IDoanhThu } from '@/services/DoanhThu';
import { tinhDoanhThu, tinhDoanhThuThuc } from '@/services/DoanhThu/doanhthu';
import type { IColumn } from '@/utils/interfaces';
import rules from '@/utils/rules';
import { CalculatorOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import {
  Button,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Select,
  DatePicker,
  Tabs,
  Card,
  Row,
  Col,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import Formm from './components/FormViewDoanhThu';
import DoanhThuThuc from './DoanhThuThuc';
import { ExportOutlined } from '@ant-design/icons';
import { getTruong } from '@/services/Truong/truong';
import moment from 'moment';
import { DataStatistic } from '@/pages/NoiBo/components/thongKeTheoNgay';
import DemoColumn from '@/components/Chart/Column';
import ColumnPlotChart from '@/components/Chart/ColumnPlot';
import axios from 'axios';
import { ip3 } from '@/utils/constants';
import PiePlotChart from '@/components/Chart/PiePlot';
import ThongKeTaiChinh from '@/pages/NoiBo/components/thongKeTaiChinh';

const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
});

const DoanhThu = () => {
  const modelDoanhThu = useModel('doanhthu');
  const doanhThuThuc = useModel('doanhthuthuc');
  const {
    page,
    limit,
    cond,
    getDoanhThuModel,
    getDoanhThuChuTruongModel,
    exportBaoCaoDoanhThuTheoNamModel,
    total,
    setRecord,
    setVisibleForm,
    setEdit,
    setPage,
    setCondition,
    setDisable,
    loading,
    danhSach,
    loaiDoanhThu,
    setLoaiDoanhThu,
    tinhLaiDoanhThuModel,
    month,
    year,
    setMonth,
    setYear,
    date,
    setDate,
  } = useModel('doanhthu');
  const { donViIdThuc, setDonViIdThuc } = useModel('doanhthuthuc');
  const vaiTro = localStorage.getItem('vaiTro');
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [donViId, setDonViId] = useState<string | undefined>(organizationId);
  const [arrYear, setArrYear] = useState([]);
  const [listTruong, setListTruong] = useState(
    initialState?.currentUser?.roles?.[0]?.listTruong ?? [],
  );
  const [visibleTinhToan, setVisibleTinhToan] = useState<boolean>(false);
  const [danhSachTruong, setDanhSachTruong] = useState([]);
  const [statistics, setStatistics] = useState<DataStatistic[]>([]);
  const [valueSelect, setValueSelect] = useState<string>(vaiTro === 'ChuTruong' ? 'Tất cả' : '');
  const getDataTruong = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=1000`, {
      params: {
        cond: {
          loaiDonVi: 'Truong',
        },
      },
    });
    setDanhSachTruong(result?.data?.data?.result);
  };
  useEffect(() => {
    if (Array.isArray(initialState?.currentUser?.roles)) {
      let arrObj = initialState?.currentUser?.roles.filter((item) => {
        return item.systemRole === initialState?.currentUser?.role?.systemRole;
      });
      setListTruong(arrObj?.[0]?.listTruong);
    }
  }, [initialState?.currentUser]);
  const CreateArrYear = () => {
    const arr: any = [];
    for (let i = 0; i <= 2050 - 2021; i += 1) {
      arr.push(2021 + i);
    }
    setArrYear(arr);
  };
  const setDataStatistic = (recordData: IDoanhThu.Record) => {
    const obj2: DataStatistic = {
      name: 'Thực tế thu',
      count: recordData?.soTienThuThucTe ?? 0,
    };
    const obj1: DataStatistic = {
      name: 'Doanh thu dự kiến',
      count: recordData?.soTienThuDuKien ?? 0,
    };
    const obj3: DataStatistic = {
      name: 'Chi dự kiến',
      count: recordData?.soTienChi ?? 0,
    };
    const obj7: DataStatistic = {
      name: 'Thực tế chi',
      count: recordData?.soTienChi ?? 0,
    };
    const obj5: DataStatistic = {
      name: 'Lợi nhuận dự kiến',
      count: recordData?.doanhThuDuKien ?? 0,
    };
    const obj6: DataStatistic = {
      name: 'Lợi nhuân thực tế',
      count: recordData?.doanhThuThucTe ?? 0,
    };
    const obj4: DataStatistic = {
      name: 'Giảm trừ',
      count: recordData?.soTienGiamTru ?? 0,
    };
    const arr: DataStatistic[] = [];
    arr.push(obj1);
    arr.push(obj2);
    arr.push(obj3);
    arr.push(obj7);
    arr.push(obj5);
    arr.push(obj6);
    arr.push(obj4);
    setStatistics(arr);
  };
  React.useEffect(() => {
    setDonViIdThuc(organizationId ?? '');
    setCondition({ nam: new Date().getFullYear(), thang: new Date().getMonth() });
    CreateArrYear();
    if (vaiTro === 'SuperAdmin' || vaiTro === 'Admin' || vaiTro === 'ChuTruong') {
      getDataTruong();
    }
  }, []);
  useEffect(() => {
    if (loaiDoanhThu === 'Hệ thống') {
      setDataStatistic(danhSach[0]);
    } else {
      setDataStatistic(doanhThuThuc.danhSach[0]);
    }
  }, [danhSach, doanhThuThuc.danhSach, loaiDoanhThu]);
  const changeYear = (val: number) => {
    setCondition({ nam: val });
  };

  const handleEdit = (val: any) => {
    setVisibleForm(true);
    setEdit(true);
    setRecord(val);
    setDisable(false);
  };

  const onChange = (value: string) => {
    setPage(1);
    if (value === 'Tất cả') {
      setDonViId(organizationId);
      setValueSelect(value);
      getDoanhThuChuTruongModel(donViId, month, year);
    } else {
      setValueSelect(value);
      getDoanhThuModel(value, month, year);
      setDonViId(value);
    }
  };
  const [changeTabs, setChangeTab] = useState<string>('1');
  const onChangeTabs = (value: string) => {
    // setYear(moment().year());
    // setMonth(moment().month());
    setCondition({ nam: year, thang: month });
    // setDate(moment());
    if (value === '1') {
      doanhThuThuc.setRecord({} as IDoanhThu.Record);
      setDataStatistic(danhSach[0]);
      setLoaiDoanhThu('Hệ thống');
    } else {
      setRecord({} as IDoanhThu.Record);
      setLoaiDoanhThu('Khác');
      setDataStatistic(doanhThuThuc.danhSach[0]);
    }
    setChangeTab(value);
    if (vaiTro === 'ChuTruong') {
      setValueSelect('Tất cả');
    }
    if (loaiDoanhThu === 'Hệ thống') {
      setDataStatistic(danhSach[0]);
    } else {
      setDataStatistic(doanhThuThuc.danhSach[0]);
    }
  };
  const handleTinhDoanhThu = async (values: any) => {
    // const thang = new Date().getMonth();
    // const nam = new Date().getFullYear();
    const truongId = vaiTro === 'ChuTruong' ? donViId : values?.truongId ?? organizationId;
    try {
      const res = await tinhDoanhThu({ donViId: truongId, thang: month, nam: year });
      if (res?.status === 201) {
        message.success('Tính doanh thu thành công');
        getDoanhThuModel(donViId, month, year);
        setVisibleTinhToan(false);
        return true;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return true;
  };
  const handleTinhDoanhThuEffect = async (values: any) => {
    const thang = new Date().getMonth();
    const nam = new Date().getFullYear();
    const truongId = values?.truongId ?? organizationId;
    try {
      const res = await tinhDoanhThu({ donViId: truongId, thang, nam });
      if (res?.status === 201) {
        return true;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return true;
  };
  const handleTinhDoanhThuThuc = async (values: any) => {
    const thang = new Date().getMonth();
    const nam = new Date().getFullYear();
    const truongId = values?.truongId ?? organizationId;
    try {
      const res = await tinhDoanhThuThuc({ donViId: truongId, thang, nam });
      if (res?.data?.statusCode === 201) {
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return true;
  };
  useEffect(() => {
    if (organizationId) {
      tinhLaiDoanhThuModel({
        truongId: organizationId ?? '',
        thang: new Date().getMonth(),
        nam: new Date().getFullYear(),
      });
      handleTinhDoanhThuEffect({} as any);
      handleTinhDoanhThuThuc({} as any);
    }
  }, [organizationId]);
  const renderLast = (record: IDoanhThu.Record) => {
    return (
      <React.Fragment>
        <Button
          disabled={valueSelect === 'Tất cả'}
          type="primary"
          shape="circle"
          onClick={() => {
            setLoaiDoanhThu('Hệ thống');
            setVisibleForm(true);
            setDisable(true);
            setRecord(record);
            // setEdit(true);
          }}
          title="Xem chi tiết"
        >
          <EyeOutlined />
        </Button>
        <Divider type="vertical" />

        <Button
          disabled={valueSelect === 'Tất cả'}
          type="default"
          shape="circle"
          onClick={() => handleEdit(record)}
          title="Chỉnh sửa"
          // disabled={!checkAllow('EDIT_DOANH_THU')}
        >
          <EditOutlined />
        </Button>
      </React.Fragment>
    );
  };

  const columns: IColumn<IDoanhThu.Record>[] = [
    // {
    //   title: 'STT',
    //   dataIndex: 'index',
    //   align: 'center',
    //   width: 80,
    // },
    // {
    //   title: 'Tháng',
    //   dataIndex: 'thang',
    //   align: 'center',
    //   // width: 130,
    //   render: (val, record) => `Tháng ${val + 1}/${record?.nam}`,
    // },
    // {
    //   title: 'Trường',
    //   dataIndex: ['donVi', 'tenDonVi'],
    //   align: 'center',
    //   // width: 150,
    //   render: (val) => {
    //     if (!val) {
    //       return 'Tất cả';
    //     } else return val;
    //   },
    // },
    {
      title: 'Doanh thu DK',
      dataIndex: 'soTienThuDuKien',
      align: 'center',
      width: 130,
      render: (val) => formatter.format(val ?? 0),
    },
    {
      title: 'Thực tế thu',
      dataIndex: 'soTienThuThucTe',
      align: 'center',
      width: 130,
      render: (val) => formatter.format(val ?? 0),
    },

    {
      title: 'Chi dự kiến',
      dataIndex: 'soTienChi',
      align: 'center',
      // width: 200,
      width: 130,
      render: (val) => formatter.format(val ?? 0),
    },
    {
      title: 'Thực tế chi',
      dataIndex: 'soTienChi',
      align: 'center',
      // width: 200,
      width: 130,
      render: (val) => formatter.format(val ?? 0),
    },
    {
      title: 'Lợi nhuận DK',
      dataIndex: 'doanhThuDuKien',
      align: 'center',
      // width: 200,
      width: 130,
      render: (val) => formatter.format(val ?? 0),
    },
    {
      title: 'Quỹ tiền mặt',
      dataIndex: 'doanhThuThucTe',
      align: 'center',
      // width: 200,
      width: 130,
      render: (val) => formatter.format(val ?? 0),
    },

    {
      title: `Giảm trừ doanh thu`,
      dataIndex: 'soTienGiamTru',
      align: 'center',
      // width: 200,
      width: 130,
      render: (val) => formatter.format(val ?? 0),
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: IDoanhThu.Record) => renderLast(record),
      // fixed: 'right',
      // width: 180,
    },
  ];
  return (
    <>
      <Tabs defaultActiveKey="1" onChange={onChangeTabs}>
        <Tabs.TabPane tab="Báo cáo doanh thu hệ thống" key="1">
          <ThongKeTaiChinh donViId={donViId} changeTabs={changeTabs}>
            <Card
              title="Doanh thu"
              bordered={false}
              headStyle={{ backgroundColor: '#009900', color: '#FFFFFF', fontWeight: 600 }}
              bodyStyle={{ backgroundColor: '#0099000d' }}
            >
              <ColumnPlotChart
                data={statistics?.map((item) => ({
                  type: item?.name || 'Đang cập nhật',
                  value: item?.count,
                }))}
                legend={true}
                xLabel={'Giá trị'}
              />
            </Card>
          </ThongKeTaiChinh>
          <Card style={{ marginTop: '16px' }}>
            <TableBase
              borderCard={false}
              // bodyStyle={{ backgroundColor: '#0099000d' }}
              border={false}
              columns={columns}
              getData={() => {
                if (vaiTro !== 'ChuTruong') getDoanhThuModel(donViId, month, year);
                else getDoanhThuChuTruongModel(donViId, month, year);
              }}
              dependencies={[page, limit, cond]}
              loading={modelDoanhThu.loading}
              modelName="doanhthu"
              // scroll={{ x: 1300 }}
              Form={Formm}
              formType="Drawer"
              widthDrawer="60%"
              isNotPagination={true}
              onCloseForm={() => setEdit(false)}
            >
              {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin' || vaiTro === 'ChuTruong') && (
                <Select
                  showSearch
                  value={valueSelect}
                  defaultValue={valueSelect}
                  style={{ width: '15%', marginRight: '10px', marginBottom: '10px' }}
                  placeholder="Chọn trường"
                  optionFilterProp="children"
                  onChange={onChange}
                  filterOption={(input, option: any) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Select.Option value="Tất cả">Tất cả các trường</Select.Option>
                  {listTruong?.map((item: any) => (
                    <Select.Option key={item?._id} value={item?._id}>
                      {item?.tenDonVi}
                    </Select.Option>
                  ))}
                </Select>
              )}
              {/* <Select
          allowClear
          placeholder="Chọn năm"
          showSearch
          style={{ width: '10%', marginRight: '10px' }}
          onChange={changeYear}
        >
          {arrYear?.map((item) => (
            <Select.Option key={item} value={item}>
              {item}
            </Select.Option>
          ))}
        </Select> */}
              <DatePicker
                picker="month"
                allowClear={false}
                defaultValue={date}
                value={moment().month(month).year(year)}
                format="MM-YYYY"
                onChange={(value) => {
                  if (value) {
                    setDate(value);
                    setMonth(moment(value).month());
                    setYear(moment(value)?.year());
                    setCondition({ nam: value?.year(), thang: value?.month() });
                  } else {
                    setDate(moment());
                    setYear(moment().year());
                    setMonth(moment().month());
                    setCondition({});
                  }
                }}
                style={{ marginRight: 10 }}
              />
              {valueSelect !== 'Tất cả' && (
                <Button
                  style={{ marginRight: '10px', marginBottom: '10px' }}
                  disabled={valueSelect === 'Tất cả'}
                  onClick={() =>
                    exportBaoCaoDoanhThuTheoNamModel({
                      donViId: donViId as string,
                      thang: danhSach[0].thang,
                      nam: danhSach[0].nam,
                    })
                  }
                  loading={loading}
                  type="primary"
                  icon={<ExportOutlined />}
                >
                  Xuất Excel
                </Button>
              )}
              {valueSelect !== 'Tất cả' && (
                <Button
                  style={{ marginRight: '10px' }}
                  type="primary"
                  icon={<CalculatorOutlined />}
                  onClick={
                    vaiTro === 'HieuTruong' || vaiTro === 'ChuTruong'
                      ? handleTinhDoanhThu
                      : () => setVisibleTinhToan(true)
                  }
                >
                  Tính doanh thu
                </Button>
              )}

              {/*<h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>*/}
              {/*  Tổng số:*/}
              {/*  <Input*/}
              {/*    style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}*/}
              {/*    value={total}*/}
              {/*  />*/}
              {/*</h3>*/}
            </TableBase>
          </Card>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Báo cáo doanh thu thực" key="2">
            <ThongKeTaiChinh donViIdThuc={donViIdThuc} changeTabs={changeTabs}>
              <Card
                title="Doanh thu thực"
                bordered={false}
                headStyle={{ backgroundColor: '#009900', color: '#FFFFFF', fontWeight: 600 }}
                bodyStyle={{ backgroundColor: '#0099000d' }}
              >
                <ColumnPlotChart
                  data={statistics?.map((item) => ({
                    type: item?.name || 'Đang cập nhật',
                    value: item?.count,
                  }))}
                  legend={true}
                  xLabel={'Giá trị'}
                  formatType={'currency'}
                />
              </Card>
            </ThongKeTaiChinh>
            <DoanhThuThuc />
        </Tabs.TabPane>
      </Tabs>
      <Modal
        title="Tính toán doanh thu"
        visible={visibleTinhToan}
        footer={false}
        onCancel={() => setVisibleTinhToan(false)}
        destroyOnClose
      >
        <Form labelCol={{ span: 24 }} onFinish={handleTinhDoanhThu}>
          <Form.Item label="Đơn vị tính toán" name="truongId" rules={[...rules.required]}>
            <Select
              showSearch
              placeholder="Chọn trường"
              optionFilterProp="children"
              filterOption={(input, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {danhSachTruong?.map((item: any) => (
                <Select.Option key={item?._id} value={item?._id}>
                  {item?.tenDonVi}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Divider />
          <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
            <Button style={{ marginRight: 8 }} htmlType="submit" type="primary">
              Tính toán
            </Button>
            <Button onClick={() => setVisibleTinhToan(false)}>Đóng</Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DoanhThu;
