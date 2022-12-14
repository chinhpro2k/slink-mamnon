/* eslint-disable no-underscore-dangle */
import { checkAllow } from '@/components/CheckAuthority';
import TableBase from '@/components/Table';
import type { ThongKeLuong as IThongKeLuong } from '@/services/ThongKeLuong';
import { updThongKeLuong } from '@/services/ThongKeLuong/thongkeluong';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import rules from '@/utils/rules';
import { EditOutlined, ExportOutlined, EyeOutlined } from '@ant-design/icons';
import { DrawerForm, ProFormDigit, ProFormText } from '@ant-design/pro-form';
import { Button, Col, DatePicker, Divider, Form, Input, message, Modal, Row } from 'antd';
import locale from 'antd/es/date-picker/locale/vi_VN';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import axios from '../../utils/axios';

const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
});

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const styleMarginBottom = {
  marginBottom: 5,
};

const styleColor = {
  color: 'black',
};

const ThongKeLuong = () => {
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [viewModal, setViewModal] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [luongThucNhan, setLuongThucNhan] = useState<any>(0);
  const [ngayCongQuyDinh, setNgayCongQuyDinh] = useState<any>(0);
  const [ngayCongThucTe, setNgayCongThucTe] = useState<any>(0);
  const [luongThoaThuan, setLuongThoaThuan] = useState<any>(0);
  const [phuCap, setPhuCap] = useState<any>(0);
  const [thuongThang, setThuongThang] = useState<any>(0);
  const [baoHiemGV, setBaoHiemGiaoVien] = useState<any>(0);
  const [recordThongKe, setRecordThongKe] = useState<IThongKeLuong.Record>();
  const [thang, setThang] = useState<number>(new Date().getMonth());
  const [nam, setNam] = useState<number>(new Date().getFullYear());
  const vaiTro = localStorage.getItem('vaiTro');
  const {
    loading: loadingThongKeLuong,
    getThongKeLuongModel,
    total,
    page,
    limit,
    cond,
    setPage,
    setLoading,
  } = useModel('thongkeluong');
  const { initialState } = useModel('@@initialState');
  const donViId = initialState?.currentUser?.role?.organizationId;
  const [recordHocPhi, setRecordHocPhi] = useState<ITruong.Record>();
  const changeDate = (val: any) => {
    setThang(new Date(val).getMonth());
    setNam(new Date(val).getFullYear());
    getThongKeLuongModel(donViId, new Date(val).getMonth(), new Date(val).getFullYear());
    getRecordHocPhi();
    setPage(1);
  };

  const handleEdit = async (record: IThongKeLuong.Record) => {
    setEdit(true);
    setRecordThongKe(record);
    setVisibleDrawer(true);
    setLuongThucNhan(record?.luongThucTe);
    setNgayCongQuyDinh(record?.ngayCongQuyDinh);
    setNgayCongThucTe(record?.ngayCongThucTe);
    setLuongThoaThuan(record?.luongThoaThuan);
    setPhuCap(record?.phuCap);
    setThuongThang(record?.thuongThang);
    setBaoHiemGiaoVien(record?.tienDongBHCuaGV);
  };

  const handleView = async (record: IThongKeLuong.Record) => {
    setViewModal(true);
    setRecordThongKe(record);
  };

  const changeNgayCongQuyDinh = (val: any) => {
    setNgayCongQuyDinh(val);
    const thucNhan = (luongThoaThuan / val) * ngayCongThucTe + thuongThang + phuCap - baoHiemGV;
    setLuongThucNhan(thucNhan);
  };
  const changeNgayCongThucTe = (val: any) => {
    setNgayCongThucTe(val);
    const thucNhan = (luongThoaThuan / ngayCongQuyDinh) * val + thuongThang + phuCap - baoHiemGV;
    setLuongThucNhan(thucNhan);
  };
  const changeLuongThoaThuan = (val: any) => {
    setLuongThoaThuan(val);
    const thucNhan = (val / ngayCongQuyDinh) * ngayCongThucTe + thuongThang + phuCap - baoHiemGV;
    setLuongThucNhan(thucNhan);
  };
  const changePhuCap = (val: any) => {
    setPhuCap(val);
    const thucNhan =
      (luongThoaThuan / ngayCongQuyDinh) * ngayCongThucTe + thuongThang + val - baoHiemGV;
    setLuongThucNhan(thucNhan);
  };
  const changeThuongThang = (val: any) => {
    setThuongThang(val);
    const thucNhan = (luongThoaThuan / ngayCongQuyDinh) * ngayCongThucTe + val + phuCap - baoHiemGV;
    setLuongThucNhan(thucNhan);
  };
  const changeBaoHiemGV = (val: any) => {
    setBaoHiemGiaoVien(val);
    const thucNhan =
      (luongThoaThuan / ngayCongQuyDinh) * ngayCongThucTe + thuongThang + phuCap - val;
    setLuongThucNhan(thucNhan);
  };

  const onCell = (record: IThongKeLuong.Record) => ({
    onClick: () => {
      handleView(record);
    },
    style: { cursor: 'pointer' },
  });

  const renderLast = (record: IThongKeLuong.Record) => {
    return (
      <React.Fragment>
        <Button
          type="default"
          shape="circle"
          onClick={() => {
            handleView(record);
          }}
          title="Xem chi ti???t"
        >
          <EyeOutlined />
        </Button>

        {/* <Divider type="vertical" />

        <Button
          type="primary"
          shape="circle"
          onClick={() => {
            handleEdit(record);
          }}
          title="Ch???nh??s???a"
          disabled={!checkAllow('EDIT_THONG_KE_LUONG')}
        >
          <EditOutlined />
        </Button> */}
      </React.Fragment>
    );
  };

  const columns: IColumn<IThongKeLuong.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'H??? t??n gi??o vi??n',
      dataIndex: 'hoTen',
      align: 'center',
      width: 200,
      onCell,
      search: 'search',
    },
    {
      title: 'S??? ??i???n tho???i',
      dataIndex: 'soDienThoai',
      align: 'center',
      width: 150,
      onCell,
      search: 'search',
    },
    {
      title: 'L????ng th???a thu???n',
      dataIndex: 'luongThoaThuan',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => <div>{formatter.format(val)}</div>,
    },
    {
      title: 'Ng??y c??ng th??ng',
      dataIndex: 'ngayCongQuyDinh',
      align: 'center',
      width: 130,
      onCell,
    },
    {
      title: 'Ng??y c??ng th???c',
      dataIndex: 'ngayCongThucTe',
      align: 'center',
      width: 130,
      onCell,
    },
    {
      title: 'Th?????ng',
      dataIndex: 'thuongThang',
      align: 'center',
      width: 130,
      onCell,
      render: (val) => <div>{formatter.format(val)}</div>,
    },
    {
      title: 'Ph??? c???p',
      dataIndex: 'phuCap',
      align: 'center',
      width: 130,
      onCell,
      render: (val) => <div>{formatter.format(val)}</div>,
    },
    {
      title: 'Ti???n ????ng b??o hi???m tr?????ng',
      dataIndex: 'tienDongBHCuaTruong',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => <div>{formatter.format(val)}</div>,
    },
    {
      title: 'Ti???n ????ng b??o hi???m gi??o vi??n',
      dataIndex: 'tienDongBHCuaGV',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => <div>{formatter.format(val)}</div>,
    },
    {
      title: 'Ti???n l????ng th???c l??nh',
      dataIndex: 'luongThucTe',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => <div>{formatter.format(val)}</div>,
    },
  ];
  if (vaiTro === 'HieuTruong') {
    columns.push({
      title: 'Thao t??c',
      align: 'center',
      render: (record: IThongKeLuong.Record) => renderLast(record),
      fixed: 'right',
      width: 150,
    });
  }

  const getRecordHocPhi = async () => {
    const res = await axios.get(
      `${ip3}/thong-tin-hoc-phi-truong/truong/${donViId}/thang/${thang}/nam/${nam}`,
    );
    setRecordHocPhi(res?.data?.data);
  };

  useEffect(() => {
    getRecordHocPhi();
  }, []);

  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={() => getThongKeLuongModel(donViId, thang, nam)}
        loading={loadingThongKeLuong}
        dependencies={[page, limit, cond]}
        modelName="thongkeluong"
        title="Th???ng k?? l????ng"
        scroll={{ x: 1500 }}
      >
        <DatePicker
          locale={locale}
          picker="month"
          placeholder="Ch???n th??ng"
          format={(val) => `Th??ng ${val.format('MM/YYYY')}`}
          defaultValue={moment()}
          onChange={changeDate}
        />
        {checkAllow('EXPORT_THONG_KE_LUONG') && (
          <Button
            style={{ marginBottom: '10px', marginLeft: '10px' }}
            type="primary"
            onClick={async () => {
              const response = await axios.get(
                `${ip3}/luong-thang/export/nam/${nam}/thang/${thang}/don-vi/${donViId}`,
              );
              window.open(response?.data?.data?.url);
            }}
          >
            <ExportOutlined />
            Export
          </Button>
        )}
        <Button
          type="primary"
          style={{ marginLeft: 10 }}
          // disabled={recordHocPhi?.ngayGuiThongBao < moment().date()}
          onClick={async () => {
            try {
              setLoading(true);
              const response = await axios.put(
                `${ip3}/luong-thang/tinh-lai-luong/truong/${donViId}`,
                null,
                { params: { donViId, thang, nam } },
              );
            } catch (e) {
              setLoading(false);
              message.error('T??nh to??n g???p l???i');
            }
            getThongKeLuongModel(donViId, thang, nam);
          }}
        >
          T??nh l????ng d??? ki???n
        </Button>
        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          T???ng s???:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={total}
          />
        </h3>
      </TableBase>
      <DrawerForm<IThongKeLuong.Record>
        visible={visibleDrawer}
        onVisibleChange={setVisibleDrawer}
        title={edit ? 'Ch???nh s???a' : 'Th??m m???i'}
        drawerProps={{
          forceRender: false,
          destroyOnClose: true,
        }}
        onFinish={async (values: any) => {
          const newVal = values;
          newVal.luongThucTe = luongThucNhan;
          newVal.userId = recordThongKe?.userId;
          newVal.donViId = recordThongKe?.donViId;
          newVal.hoTen = recordThongKe?.hoTen;
          try {
            const res = await updThongKeLuong({ ...newVal, id: recordThongKe?._id });
            if (res?.data?.statusCode === 200) {
              message.success('C???p nh???t h??? s?? th??nh c??ng');
              getThongKeLuongModel(donViId, thang, nam);
              return true;
            }
          } catch (error) {
            message.error('???? x???y ra l???i');
            return false;
          }
          return false;
        }}
        submitter={{
          render: (newProps) => {
            return [
              <Button
                key="submit"
                onClick={() => {
                  newProps.submit();
                }}
                type="primary"
              >
                L??u
              </Button>,
              <Button
                key="cancel"
                onClick={() => {
                  setVisibleDrawer(false);
                }}
              >
                Quay l???i
              </Button>,
            ];
          },
        }}
      >
        <Row gutter={[16, 0]}>
          <Col xl={12} lg={12} xs={24}>
            <ProFormDigit
              name="ngayCongQuyDinh"
              label="S??? ng??y c??ng trong th??ng"
              placeholder="Nh???p s??? ng??y c??ng trong th??ng"
              rules={[...rules.required]}
              initialValue={recordThongKe?.ngayCongQuyDinh}
              fieldProps={{
                onChange: changeNgayCongQuyDinh,
              }}
            />
          </Col>
          <Col xl={12} lg={12} xs={24}>
            <ProFormDigit
              name="ngayCongThucTe"
              label="S??? ng??y c??ng th???c"
              placeholder="Nh???p s??? ng??y c??ng th???c"
              rules={[...rules.required]}
              initialValue={recordThongKe?.ngayCongThucTe}
              fieldProps={{
                onChange: changeNgayCongThucTe,
              }}
            />
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          <Col xl={12} lg={12} xs={24}>
            <ProFormDigit
              name="luongThoaThuan"
              label="L????ng th???a thu???n"
              placeholder="Nh???p l????ng th???a thu???n"
              rules={[...rules.required]}
              fieldProps={{
                formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                onChange: changeLuongThoaThuan,
              }}
              initialValue={recordThongKe?.luongThoaThuan}
            />
          </Col>
          <Col xl={12} lg={12} xs={24}>
            <ProFormDigit
              name="luongDongBaoHiem"
              label="L????ng c?? b???n ????ng b???o hi???m (theo v??ng)"
              placeholder="Nh???p l????ng c?? b???n ????ng b???o hi???m theo v??ng"
              rules={[...rules.required]}
              fieldProps={{
                formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
              }}
              initialValue={recordThongKe?.luongDongBaoHiem}
            />
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          <Col xl={12} lg={12} xs={24}>
            <ProFormDigit
              name="phuCap"
              label="Ph??? c???p"
              placeholder="Nh???p ph??? c???p"
              rules={[...rules.required]}
              fieldProps={{
                formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                onChange: changePhuCap,
              }}
              initialValue={recordThongKe?.phuCap}
            />
          </Col>
          <Col xl={12} lg={12} xs={24}>
            <ProFormDigit
              name="thuongThang"
              label="Th?????ng th??ng"
              placeholder="Nh???p th?????ng th??ng"
              rules={[...rules.required]}
              fieldProps={{
                formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                onChange: changeThuongThang,
              }}
              initialValue={recordThongKe?.thuongThang}
            />
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          <Col xl={12} lg={12} xs={24}>
            <ProFormDigit
              name="tienDongBHCuaGV"
              label="Ti???n ????ng b???o hi???m c???a gi??o vi??n"
              placeholder="Nh???p ti???n ????ng b???o hi???m c???a gi??o vi??n"
              rules={[...rules.required]}
              fieldProps={{
                formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                onChange: changeBaoHiemGV,
              }}
              initialValue={recordThongKe?.tienDongBHCuaGV}
            />
          </Col>
          <Col xl={12} lg={12} xs={24}>
            <ProFormDigit
              name="tienDongBHCuaTruong"
              label="Ti???n ????ng b???o hi???m c???a tr?????ng"
              placeholder="Nh???p ti???n ????ng b???o hi???m c???a tr?????ng"
              rules={[...rules.required]}
              fieldProps={{
                formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
              }}
              initialValue={recordThongKe?.tienDongBHCuaTruong}
            />
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          <Col xl={12} lg={12} xs={24}>
            <ProFormText
              name="chucVu"
              label="Ch???c v???"
              placeholder="Nh???p ch???c v???"
              rules={[...rules.required]}
              initialValue={recordThongKe?.chucVu}
            />
          </Col>
        </Row>
        <b>L????ng th???c l??nh: {formatter.format(luongThucNhan)}</b>

        {edit && <div style={{ width: '100%' }} />}
      </DrawerForm>
      <Modal
        title={
          <div>
            Chi ti???t l????ng gi??o vi??n: <b>{recordThongKe?.hoTen}</b>
          </div>
        }
        width="40%"
        visible={viewModal}
        footer={
          <Button type="primary" onClick={() => setViewModal(false)}>
            Ok
          </Button>
        }
        onCancel={() => setViewModal(false)}
      >
        <Form {...formItemLayout}>
          <Row gutter={[16, 0]}>
            <Col xl={12} lg={12} xs={24}>
              <Form.Item label="H??? v?? t??n gi??o vi??n" required style={styleMarginBottom}>
                <Input value={recordThongKe?.hoTen} disabled style={styleColor} />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} xs={24}>
              <Form.Item label="S??? ??i???n tho???i" required style={styleMarginBottom}>
                <Input value={recordThongKe?.soDienThoai} disabled style={styleColor} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 0]}>
            <Col xl={12} lg={12} xs={24}>
              <Form.Item label="S??? ng??y c??ng trong th??ng" required style={styleMarginBottom}>
                <Input value={recordThongKe?.ngayCongQuyDinh} disabled style={styleColor} />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} xs={24}>
              <Form.Item label="S??? ng??y c??ng th???c" required style={styleMarginBottom}>
                <Input value={recordThongKe?.ngayCongThucTe} disabled style={styleColor} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 0]}>
            <Col xl={12} lg={12} xs={24}>
              <Form.Item label="L????ng th???a thu???n" required style={styleMarginBottom}>
                <Input
                  value={formatter.format(recordThongKe?.luongThoaThuan ?? 0)}
                  disabled
                  style={styleColor}
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} xs={24}>
              <Form.Item label="Th?????ng" required style={styleMarginBottom}>
                <Input
                  value={formatter.format(recordThongKe?.thuongThang ?? 0)}
                  disabled
                  style={styleColor}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 0]}>
            <Col xl={12} lg={12} xs={24}>
              <Form.Item label="Ph??? c???p" required style={styleMarginBottom}>
                <Input
                  value={formatter.format(recordThongKe?.phuCap ?? 0)}
                  disabled
                  style={styleColor}
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} xs={24}>
              <Form.Item label="Ti???n ????ng b???o hi???m tr?????ng" required style={styleMarginBottom}>
                <Input
                  value={formatter.format(recordThongKe?.tienDongBHCuaTruong ?? 0)}
                  disabled
                  style={styleColor}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 0]}>
            <Col xl={12} lg={12} xs={24}>
              <Form.Item label="Ti???n ????ng b???o hi???m gi??o vi??n" required style={styleMarginBottom}>
                <Input
                  value={formatter.format(recordThongKe?.tienDongBHCuaGV ?? 0)}
                  disabled
                  style={styleColor}
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} xs={24}>
              <Form.Item label="Ti???n l????ng th???c l??nh" required style={styleMarginBottom}>
                <Input
                  value={formatter.format(recordThongKe?.luongThucTe ?? 0)}
                  disabled
                  style={styleColor}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ThongKeLuong;
