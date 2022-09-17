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
          title="Xem chi tiết"
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
          title="Chỉnh sửa"
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
      title: 'Họ tên giáo viên',
      dataIndex: 'hoTen',
      align: 'center',
      width: 200,
      onCell,
      search: 'search',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'soDienThoai',
      align: 'center',
      width: 150,
      onCell,
      search: 'search',
    },
    {
      title: 'Lương thỏa thuận',
      dataIndex: 'luongThoaThuan',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => <div>{formatter.format(val)}</div>,
    },
    {
      title: 'Ngày công tháng',
      dataIndex: 'ngayCongQuyDinh',
      align: 'center',
      width: 130,
      onCell,
    },
    {
      title: 'Ngày công thực',
      dataIndex: 'ngayCongThucTe',
      align: 'center',
      width: 130,
      onCell,
    },
    {
      title: 'Thưởng',
      dataIndex: 'thuongThang',
      align: 'center',
      width: 130,
      onCell,
      render: (val) => <div>{formatter.format(val)}</div>,
    },
    {
      title: 'Phụ cấp',
      dataIndex: 'phuCap',
      align: 'center',
      width: 130,
      onCell,
      render: (val) => <div>{formatter.format(val)}</div>,
    },
    {
      title: 'Tiền đóng báo hiểm trường',
      dataIndex: 'tienDongBHCuaTruong',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => <div>{formatter.format(val)}</div>,
    },
    {
      title: 'Tiền đóng báo hiểm giáo viên',
      dataIndex: 'tienDongBHCuaGV',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => <div>{formatter.format(val)}</div>,
    },
    {
      title: 'Tiền lương thực lĩnh',
      dataIndex: 'luongThucTe',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => <div>{formatter.format(val)}</div>,
    },
  ];
  if (vaiTro === 'HieuTruong') {
    columns.push({
      title: 'Thao tác',
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
        title="Thống kê lương"
        scroll={{ x: 1500 }}
      >
        <DatePicker
          locale={locale}
          picker="month"
          placeholder="Chọn tháng"
          format={(val) => `Tháng ${val.format('MM/YYYY')}`}
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
              message.error('Tính toán gặp lỗi');
            }
            getThongKeLuongModel(donViId, thang, nam);
          }}
        >
          Tính lương dự kiến
        </Button>
        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          Tổng số:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={total}
          />
        </h3>
      </TableBase>
      <DrawerForm<IThongKeLuong.Record>
        visible={visibleDrawer}
        onVisibleChange={setVisibleDrawer}
        title={edit ? 'Chỉnh sửa' : 'Thêm mới'}
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
              message.success('Cập nhật hồ sơ thành công');
              getThongKeLuongModel(donViId, thang, nam);
              return true;
            }
          } catch (error) {
            message.error('Đã xảy ra lỗi');
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
                Lưu
              </Button>,
              <Button
                key="cancel"
                onClick={() => {
                  setVisibleDrawer(false);
                }}
              >
                Quay lại
              </Button>,
            ];
          },
        }}
      >
        <Row gutter={[16, 0]}>
          <Col xl={12} lg={12} xs={24}>
            <ProFormDigit
              name="ngayCongQuyDinh"
              label="Số ngày công trong tháng"
              placeholder="Nhập số ngày công trong tháng"
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
              label="Số ngày công thực"
              placeholder="Nhập số ngày công thực"
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
              label="Lương thỏa thuận"
              placeholder="Nhập lương thỏa thuận"
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
              label="Lương cơ bản đóng bảo hiểm (theo vùng)"
              placeholder="Nhập lương cơ bản đóng bảo hiểm theo vùng"
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
              label="Phụ cấp"
              placeholder="Nhập phụ cấp"
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
              label="Thưởng tháng"
              placeholder="Nhập thưởng tháng"
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
              label="Tiền đóng bảo hiểm của giáo viên"
              placeholder="Nhập tiền đóng bảo hiểm của giáo viên"
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
              label="Tiền đóng bảo hiểm của trường"
              placeholder="Nhập tiền đóng bảo hiểm của trường"
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
              label="Chức vụ"
              placeholder="Nhập chức vụ"
              rules={[...rules.required]}
              initialValue={recordThongKe?.chucVu}
            />
          </Col>
        </Row>
        <b>Lương thực lĩnh: {formatter.format(luongThucNhan)}</b>

        {edit && <div style={{ width: '100%' }} />}
      </DrawerForm>
      <Modal
        title={
          <div>
            Chi tiết lương giáo viên: <b>{recordThongKe?.hoTen}</b>
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
              <Form.Item label="Họ và tên giáo viên" required style={styleMarginBottom}>
                <Input value={recordThongKe?.hoTen} disabled style={styleColor} />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} xs={24}>
              <Form.Item label="Số điện thoại" required style={styleMarginBottom}>
                <Input value={recordThongKe?.soDienThoai} disabled style={styleColor} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 0]}>
            <Col xl={12} lg={12} xs={24}>
              <Form.Item label="Số ngày công trong tháng" required style={styleMarginBottom}>
                <Input value={recordThongKe?.ngayCongQuyDinh} disabled style={styleColor} />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} xs={24}>
              <Form.Item label="Số ngày công thực" required style={styleMarginBottom}>
                <Input value={recordThongKe?.ngayCongThucTe} disabled style={styleColor} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 0]}>
            <Col xl={12} lg={12} xs={24}>
              <Form.Item label="Lương thỏa thuận" required style={styleMarginBottom}>
                <Input
                  value={formatter.format(recordThongKe?.luongThoaThuan ?? 0)}
                  disabled
                  style={styleColor}
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} xs={24}>
              <Form.Item label="Thưởng" required style={styleMarginBottom}>
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
              <Form.Item label="Phụ cấp" required style={styleMarginBottom}>
                <Input
                  value={formatter.format(recordThongKe?.phuCap ?? 0)}
                  disabled
                  style={styleColor}
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} xs={24}>
              <Form.Item label="Tiền đóng bảo hiểm trường" required style={styleMarginBottom}>
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
              <Form.Item label="Tiền đóng bảo hiểm giáo viên" required style={styleMarginBottom}>
                <Input
                  value={formatter.format(recordThongKe?.tienDongBHCuaGV ?? 0)}
                  disabled
                  style={styleColor}
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} xs={24}>
              <Form.Item label="Tiền lương thực lĩnh" required style={styleMarginBottom}>
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
