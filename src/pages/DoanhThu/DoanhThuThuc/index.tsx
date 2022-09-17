/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { DoanhThu as IDoanhThuThuc } from '@/services/DoanhThu';
import { tinhDoanhThu, tinhDoanhThuThuc } from '@/services/DoanhThu/doanhthu';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { CalculatorOutlined, EditOutlined, ExportOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Modal, Select, DatePicker, message, Drawer, Form } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import Formm from '../components/FormDoanhThuThuc';
import ViewDoanhThuThuc from '../components/ViewDoanhThuThuc';
import FormDoanhThu from '@/pages/DoanhThu/components/FormDoanhThu';
import moment from 'moment';
import FormViewDoanhThu from '@/pages/DoanhThu/components/FormViewDoanhThu';
import rules from '@/utils/rules';
import { DoanhThu as IDoanhThu } from '@/services/DoanhThu';

const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
});

const DoanhThuThuc = () => {
  const {
    loading: loadingDoanhThuThuc,
    getDoanhThuThucModel,
    total,
    page,
    limit,
    cond,
    danhSach,
    setRecord,
    setVisibleForm,
    setPage,
    setCondition,
    setViewDoanhThuThuc,
    viewDoanhThuThuc,
    loading,
    setLoading,
    record,
    setDonViIdThuc,
    exportBaoCaoDoanhThuTheoNamModel,
    getDoanhThuChuTruongModel,
  } = useModel('doanhthuthuc');
  const { setLoaiDoanhThu, setEdit, month, year, setMonth, setYear, date, setDate } =
    useModel('doanhthu');
  const vaiTro = localStorage.getItem('vaiTro');
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [donViId, setDonViId] = useState<string | undefined>(organizationId);
  const [arrYear, setArrYear] = useState([]);
  const [listTruong, setListTruong] = useState<any>(
    initialState?.currentUser?.roles?.[0]?.listTruong ?? [],
  );
  const [danhSachTruong, setDanhSachTruong] = useState([]);
  const [visibleTinhToan, setVisibleTinhToan] = useState<boolean>(false);
  const [newRecord, setNewRecord] = useState<any>();
  const [valueSelect, setValueSelect] = useState<string>(vaiTro === 'ChuTruong' ? 'Tất cả' : '');
  useEffect(() => {
    if (Array.isArray(initialState?.currentUser?.roles)) {
      let arrObj = initialState?.currentUser?.roles.filter((item) => {
        return item.systemRole === initialState?.currentUser?.role?.systemRole;
      });
      setListTruong(arrObj?.[0]?.listTruong);
    }
  }, [initialState?.currentUser]);
  const getTruong = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=1000`, {
      params: {
        cond: {
          loaiDonVi: 'Truong',
        },
      },
    });
    setDanhSachTruong(result?.data?.data?.result);
  };

  const CreateArrYear = () => {
    const arr: any = [];
    for (let i = 0; i <= 2050 - 2021; i += 1) {
      arr.push(2021 + i);
    }
    setArrYear(arr);
  };

  React.useEffect(() => {
    CreateArrYear();
    getTruong();
  }, []);
  useEffect(() => {
    setCondition({ nam: year, thang: month });
  }, [month, year]);
  const handleTinhDoanhThu = async (values: any) => {
    const thang = new Date().getMonth();
    const nam = new Date().getFullYear();
    const truongId = vaiTro === 'ChuTruong' ? donViId : values?.truongId ?? organizationId;
    try {
      const res = await tinhDoanhThuThuc({ donViId: truongId, thang: month, nam: year });
      if (res?.status === 201) {
        message.success('Tính doanh thu thành công');
        getDoanhThuThucModel(donViId, month, year);
        setVisibleTinhToan(false);
        return true;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return true;
  };

  const changeYear = (val: number) => {
    setCondition({ nam: val });
  };

  const handleEdit = (val: any) => {
    setVisibleForm(true);
    setEdit(true);
    setRecord(val);
  };

  const onChange = (value: string) => {
    setPage(1);
    if (value === 'Tất cả') {
      getDoanhThuChuTruongModel(donViId, month, year);
      setDonViId(organizationId);
      setDonViIdThuc(organizationId ?? '');
    } else {
      getDoanhThuThucModel(value, month, year);
      setDonViId(value);
      setDonViIdThuc(value);
      setValueSelect(value);
    }
  };

  const renderLast = (record: IDoanhThuThuc.Record) => {
    return (
      <React.Fragment>
        <Button
          disabled={valueSelect === 'Tất cả'}
          type="primary"
          shape="circle"
          onClick={() => {
            // setViewDoanhThuThuc(true);
            // setRecord(record);
            setLoaiDoanhThu('Khác');
            setVisibleForm(true);
            // setDisable(true);
            setNewRecord(record);
            setRecord(record);
            setEdit(false);
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
        >
          <EditOutlined />
        </Button>
      </React.Fragment>
    );
  };

  const columns: IColumn<IDoanhThuThuc.Record>[] = [
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
      width: 120,
      render: (val) => formatter.format(val ?? 0),
    },
    {
      title: 'Thực tế thu',
      dataIndex: 'soTienThuThucTe',
      align: 'center',
      width: 120,
      render: (val) => formatter.format(val ?? 0),
    },

    {
      title: 'Chi dự kiến',
      dataIndex: 'soTienChi',
      align: 'center',
      // width: 200,
      // width: 100,
      render: (val) => formatter.format(val ?? 0),
    },
    {
      title: 'Thực tế chi',
      dataIndex: 'soTienChi',
      align: 'center',
      // width: 200,
      width: 120,
      render: (val) => formatter.format(val ?? 0),
    },
    {
      title: 'Lợi nhuận DK',
      dataIndex: 'doanhThuDuKien',
      align: 'center',
      // width: 200,
      width: 120,
      render: (val) => formatter.format(val ?? 0),
    },
    {
      title: 'Quỹ tiền mặt',
      dataIndex: 'doanhThuThucTe',
      align: 'center',
      // width: 200,
      width: 120,
      render: (val) => formatter.format(val ?? 0),
    },

    {
      title: `Giảm trừ doanh thu`,
      dataIndex: 'soTienGiamTru',
      align: 'center',
      // width: 200,
      width: 120,
      render: (val) => formatter.format(val ?? 0),
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: IDoanhThu.Record) => renderLast(record),
      fixed: 'right',
      width: 180,
    },
  ];

  useEffect(() => {}, []);

  return (
    <div style={{marginTop:'16px'}}>
      <TableBase
        border={false}
        columns={columns}
        getData={() => {
          if (vaiTro !== 'ChuTruong') getDoanhThuThucModel(donViId, month, year);
          else getDoanhThuChuTruongModel(donViId, month, year);
        }}
        dependencies={[page, limit, cond]}
        loading={loadingDoanhThuThuc}
        modelName="doanhthuthuc"
        // title="Báo cáo doanh thu thực"
        // scroll={{ x: 1300 }}
        Form={FormViewDoanhThu}
        formType="Drawer"
        widthDrawer="60%"
        isNotPagination={true}
        onCloseForm={() => setEdit(false)}
        // hascreate
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
        <DatePicker
          picker="month"
          allowClear={false}
          defaultValue={date}
          value={moment().month(month).year(year)}
          format="MM-YYYY"
          onChange={(value) => {
            if (value) {
              setDate(value);
              setMonth(moment(value)?.month());
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
            style={{  marginRight: '10px' }}
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
            style={{ marginRight: '10px', marginBottom: '10px' }}
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
      {/*<Drawer*/}
      {/*  visible={viewDoanhThuThuc}*/}
      {/*  // footer={<Button onClick={() => setViewDoanhThuThuc(false)}>Ok</Button>}*/}
      {/*  // onCancel={() => setViewDoanhThuThuc(false)}*/}
      {/*  width="60%"*/}
      {/*>*/}
      {/*  /!*<ViewDoanhThuThuc />*!/*/}
      {/*  <FormDoanhThu />*/}
      {/*</Drawer>*/}
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
    </div>
  );
};

export default DoanhThuThuc;
