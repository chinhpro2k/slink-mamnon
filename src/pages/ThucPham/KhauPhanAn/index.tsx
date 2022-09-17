/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import { checkAllow } from '@/components/CheckAuthority';
import TableBase from '@/components/Table';
import type { KhauPhanAn as IKhauPhanAn } from '@/services/KhauPhanAn';
import { delKhauPhanAn, exportKhauPhanAn } from '@/services/KhauPhanAn/khauphanan';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { formatterMoney, getTongDonGia } from '@/utils/utils';
import {
  DeleteOutlined,
  EyeOutlined,
  FileDoneOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Descriptions,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Table,
  Tabs,
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import Formm from '../components/FormKhauPhanAn';
import LichThucDon from './components/LichThucDon';
import { kiemTraThucPhamThieu } from '../components/FormKhauPhanAn';
import { Row, Col } from 'antd';
import DateObject from 'react-date-object';

const KhauPhanAn = () => {
  const {
    getKhauPhanAnModel,
    setPage,
    setLimit,
    danhSach,
    danhSachNhaTre,
    total,
    page,
    limit,
    cond,
    setDanhSachMonAn,
    setDanhSachTruong,
    setLoaiHinh,
    totalNhaTre,
    getKhauPhanAnNhaTreModel,
    loaiHinh,
    setVisibleForm,
    setRecord,
    setDataEdit,
    setEdit,
  } = useModel('khauphanan');
  const { getTruongModel, danhSach: danhSachTruong } = useModel('truong');
  const [visible, setVisible] = useState(false);
  const [loadMonAn, setLoadMonAn] = useState<boolean>(false);
  const [visibleDanhSachThucPham, setVisibleDanhSachThucPham] = useState<boolean>(false);
  const [soHocSinhDiHoc, setSoHocSinhDiHoc] = useState(0);
  const [recordKhauPhanAn, setRecordKhauPhanAn] = useState<IKhauPhanAn.Record>({} as any);
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [visibleDanhSachThieu, setVisibleDanhSachThieu] = useState(false);
  const [checkAddThucPham, setCheckAddThucPham] = useState(0);
  const [danhSachThucPhamThieu, setDanhSachThucPhamThieu] = useState({});
  const [isCheckInputStudent, setIsCheckInputStudent] = useState<boolean>(false);
  const [dataExport, setDataExport] = useState(null);
  const [canCalculate, setCanCalculate] = useState(true);
  const [modalInputStudent, setModalInputStudent] = useState<boolean>(false);
  const [dataStudent, setDataStudent] = useState<string>('');
  const [dataKhauPhan, setDataKhauPhan] = useState<IKhauPhanAn.Record>({} as any);
  const [loadingThemHocSinh, setLoadingThemHocSinh] = useState<boolean>(false);
  const columnsReport: IColumn<IKhauPhanAn.IReport>[] = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      width: '200px',
      render: (val, record) => (
        <span>
          {val} ({record.tenBua})
        </span>
      ),
    },
    {
      title: 'Kcal',
      dataIndex: 'value',
      key: 'name',
      width: '200px',
      render: (val) => <span>{val.toFixed(2)}</span>,
    },
    {
      title: 'Phần trăm dinh dưỡng',
      dataIndex: 'name',
      key: 'name',
      width: '200px',
      render: (val, record) => <span>{((record.value / record.tongCalo) * 100).toFixed(2)}%</span>,
    },
  ];
  const getDanhSachMonAn = async () => {
    setLoadMonAn(true);
    const result = await axios.get(`${ip3}/danh-muc-mon-an/pageable?page=1&limit=10000`);
    setDanhSachMonAn(result?.data?.data?.result);
    setLoadMonAn(false);
  };

  const gettruong = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=1000`, {
      params: {
        cond: {
          loaiDonVi: 'Truong',
        },
      },
    });

    setDanhSachTruong(result?.data?.data?.result);
    const res = await getTruongModel(organizationId);
  };
  useEffect(() => {
    if (danhSachTruong) {
      setIsCheckInputStudent(danhSachTruong?.[0]?.nhapSoLuongHocSinh);
    }
  }, [danhSachTruong]);
  React.useEffect(() => {
    getDanhSachMonAn();
    gettruong();
    setPage(1);
    setLimit(10000000);
  }, []);
  const handleView = async (val?: any) => {
    const dataHocSinh = await axios.get(
      `${ip3}/xin-nghi-hoc/don-vi/${val?.donViId}/nam/${val?.nam}/thang/${val?.thang}/ngay/${val?.ngay}`,
    );
    const soHocSinhDiHoc = dataHocSinh?.data?.data?.soHocSinhDiHoc;
    setRecordKhauPhanAn({ ...val });
    setVisible(true);
  };

  const exportMenu = async (val, dieuChinh) => {
    try {
      const res = await exportKhauPhanAn({ id: val?._id, dieuChinh });
      if (res?.status === 200) {
        message.success('Xuất kho thành công');
        getKhauPhanAnModel();
        setDataExport(null);
        return true;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return false;
  };

  const checkThieuExport = async (val) => {
    let response = await axios.get(`${ip3}/kho-thuc-pham/search`);
    const danhSachTPKho = response?.data?.data?.filter((item) => item?.donViId === organizationId);
    const a = val;
    response = await axios.get(
      `${ip3}/xin-nghi-hoc/don-vi/${organizationId}/nam/${val?.nam}/thang/${val?.thang}/ngay/${val?.ngay}`,
    );
    let soHocSinh = 0;
    if (loaiHinh === 'Mầm non') {
      soHocSinh = response?.data?.data?.soHocSinhMauGiao;
    } else {
      soHocSinh = response?.data?.data?.soHocSinhNhaTre;
    }
    // ;
    const danhSachThieu = kiemTraThucPhamThieu([val], danhSachTPKho, val, soHocSinh);
    return { danhSachThieu, soHocSinh };
  };

  const checkExportDieuChinh = async (val) => {
    try {
      const response = await axios.get(`${ip3}/khau-phan-an/${val?.id}/dieu-chinh-xuat-kho`);
      const mustDieuChinh = response?.data?.data?.checkTongGia ?? false;
      if (!mustDieuChinh) {
        exportMenu(val, false);
      } else {
        const disableDieuChinh = response?.data?.data?.checkDonGiaTrongKho ?? false;
        if (disableDieuChinh) setCanCalculate(false);
        setDataExport(val);
      }
    } catch (e) {
      // const { response } = e;
      // if (
      //   response?.data?.statusCode === 400 &&
      //   response?.data?.errorDescription === 'Ngoài khoảng giá điều chỉnh'
      // ) {
      //   setDataExport(val);
      //   setCanCalculate(false);
      // }
    }
  };
  const sendDataSLHocSinh = async (val: string, idKhauPhanAn: string): Promise<boolean> => {
    const response = await axios.put(`${ip3}/khau-phan-an/${idKhauPhanAn}/so-hoc-sinh`, {
      soHocSinh: +val,
    });
    if (response.status === 200) {
      return true;
    }
    return false;
  };
  const handleExport = async (val?: object) => {
    setCanCalculate(true);
    // ;
    // return;
    const { danhSachThieu, soHocSinh } = await checkThieuExport(val);
    if (!isCheckInputStudent) {
      sendDataSLHocSinh(soHocSinh.toString(), val?._id);
    }

    if (soHocSinh <= 0) {
      Modal.info({
        title: 'Xác nhận',
        content: `Loại hình ${
          loaiHinh === 'Mầm non' ? 'Mẫu giáo' : 'Nhà trẻ'
        } không có học sinh nào`,
        okText: 'Đồng ý',
        cancelText: 'Thoát',
      });
      return;
    }
    if (Object.keys(danhSachThieu).length > 0) {
      setDanhSachThucPhamThieu(danhSachThieu);
      setRecordKhauPhanAn(val);
      setVisibleDanhSachThieu(true);
      return;
    }
    checkExportDieuChinh(val);
  };

  const handleCheckExport = (val?: object) => {
    if (!isCheckInputStudent) {
      handleExport(val);
    } else {
      setDataKhauPhan(val);
      setModalInputStudent(true);
    }
  };
  const handleOk = async () => {
    if (dataStudent !== '') {
      setLoadingThemHocSinh(true);
      if (await sendDataSLHocSinh(dataStudent, dataKhauPhan?._id)) {
        setTimeout(() => {
          setLoadingThemHocSinh(false);
          handleExport(dataKhauPhan);
          setModalInputStudent(false);
        }, 2000);
      }
    } else {
      message.warn('Nhập số lượng học sinh');
    }
  };
  const handleCancel = () => {
    setModalInputStudent(false);
  };
  const columns1 = [
    {
      title: 'Tên thành phần',
      dataIndex: 'name',
      key: 'name',
      width: '200px',
    },
    {
      title: 'Loại thực phẩm',
      dataIndex: 'loaiThucPham',
      key: 'loaiThucPham',
      align: 'center',
    },
    {
      title: 'Định lượng điều chỉnh',
      dataIndex: 'dinhLuongDieuChinh',
      key: 'dinhLuongDieuChinh',
      align: 'center',
      render: (val: number, record) => Number(val ?? 0).toFixed(2),
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'donViTinh',
      key: 'donGiaDieuChinh',
      align: 'center',
      // render: (val: number, record) => Number(val ?? 0).toFixed(2),
    },
    {
      title: 'Đơn giá điều chỉnh',
      dataIndex: 'donGiaDieuChinh',
      key: 'donGiaDieuChinh',
      align: 'center',
      render: (val: number, record) => Number(val ?? 0).toFixed(2),
    },
  ];

  const handleThucPhamKho = async (record?: IKhauPhanAn.Record) => {
    console.log('record', record);
    const newVal = record;
    newVal?.buaAn?.forEach((item) =>
      item?.monAn?.forEach((x) =>
        x?.thanhPhanMonAn?.forEach((y) => {
          y.soHocSinh = newVal?.soHocSinh ?? 0;
        }),
      ),
    );
    const dataHocSinh = await axios.get(
      `${ip3}/xin-nghi-hoc/don-vi/${record?.donViId}/nam/${record?.nam}/thang/${record?.thang}/ngay/${record?.ngay}`,
    );
    let soHocSinh = 0;
    if (loaiHinh === 'Mầm non') {
      soHocSinh = dataHocSinh?.data?.data?.soHocSinhMauGiao ?? 0;
    } else {
      soHocSinh = dataHocSinh?.data?.data?.soHocSinhNhaTre ?? 0;
    }

    setSoHocSinhDiHoc(newVal?.soHocSinh ?? 0);

    // ;
    setRecordKhauPhanAn({ ...newVal, soHocSinh: soHocSinhDiHoc });

    setVisibleDanhSachThucPham(true);
  };

  const handleDel = async (val?: string) => {
    try {
      const res = await delKhauPhanAn({ id: val });

      if (res?.status === 200) {
        message.success('Xóa thành công');
        if (loaiHinh === 'Mầm non') getKhauPhanAnModel();
        if (loaiHinh === 'Nhà trẻ') getKhauPhanAnNhaTreModel();
        return true;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return false;
  };

  const changeLoaiHinh = (val: string) => {
    setLoaiHinh(val);
  };

  const handleXemThucPham = (val?: IKhauPhanAn.Record) => {
    handleThucPhamKho(val);
  };

  const onCell = (record: IKhauPhanAn.Record) => ({
    onClick: () => {
      handleView(record);
    },
    style: { cursor: 'pointer' },
  });

  const renderLast1 = (record: IKhauPhanAn.Record) => {
    return (
      <React.Fragment>
        <Button
          type="default"
          shape="circle"
          onClick={() => {
            handleXemThucPham(record);
          }}
          title="Thực phẩm"
        >
          <ShoppingCartOutlined />
        </Button>
        <Divider type="vertical" />
        <Button
          type="primary"
          shape="circle"
          onClick={() => handleCheckExport(record)}
          title="Xuất kho"
          disabled={moment().isBefore(moment(new Date(record?.ngayAn)))}
        >
          <FileDoneOutlined />
        </Button>
        <Divider type="vertical" />
        <Button
          type="default"
          shape="circle"
          onClick={() => handleView(record)}
          title="Xem chi tiết"
          disabled={!checkAllow('VIEW_KHAU_PHAN_AN')}
        >
          <EyeOutlined />
        </Button>
        <Divider type="vertical" />
        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDel(record._id)}
          disabled={!checkAllow('DEL_KHAU_PHAN_AN')}
          cancelText="Hủy"
        >
          <Button
            type="primary"
            shape="circle"
            title="Xóa"
            disabled={!checkAllow('DEL_KHAU_PHAN_AN')}
          >
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      </React.Fragment>
    );
  };

  const columns: IColumn<IKhauPhanAn.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 70,
      onCell,
    },
    {
      title: 'Ngày ăn',
      dataIndex: 'ngayAn',
      align: 'center',
      width: 100,
      onCell,
      render: (val) => (val ? moment(val).format('DD/MM/YYYY') : 'Không có'),
    },
    {
      title: 'Bữa sáng',
      dataIndex: 'buaAn',
      width: 130,
      align: 'center',
      onCell,
      render: (val) =>
        val?.map(
          (item: { name: string }, index: string | number) =>
            item?.name === 'sáng' &&
            val?.[index]?.monAn?.map((x: { name: string }) => <div>{x?.name},</div>),
        ),
    },
    {
      title: 'Bữa phụ sáng',
      dataIndex: 'buaAn',
      width: 130,
      align: 'center',
      onCell,
      render: (val) =>
        val?.map(
          (item: { name: string }, index: string | number) =>
            item?.name === 'phụ sáng' &&
            val?.[index]?.monAn?.map((x: { name: string }) => <div>{x?.name},</div>),
        ),
    },
    {
      title: 'Bữa trưa',
      dataIndex: 'buaAn',
      width: 220,
      align: 'center',
      onCell,
      render: (val) =>
        val?.map(
          (item: { name: string }, index: string | number) =>
            item?.name === 'trưa' &&
            val?.[index]?.monAn?.map((x: { name: string }) => <div>{x?.name},</div>),
        ),
    },
    {
      title: 'Bữa chiều',
      dataIndex: 'buaAn',
      width: 130,
      align: 'center',
      onCell,
      render: (val) =>
        val?.map(
          (item: { name: string }, index: string | number) =>
            item?.name === 'chiều' &&
            val?.[index]?.monAn?.map((x: { name: string }) => <div>{x?.name},</div>),
        ),
    },
    {
      title: 'Bữa phụ chiều',
      dataIndex: 'buaAn',
      width: 130,
      align: 'center',
      onCell,
      render: (val) =>
        val?.map(
          (item: { name: string }, index: string | number) =>
            item?.name === 'phụ chiều' &&
            val?.[index]?.monAn?.map((x: { name: string }) => <div>{x?.name},</div>),
        ),
    },
    {
      title: 'Số tiền ăn/ngày',
      dataIndex: 'soTienAn',
      align: 'center',
      width: 130,
      onCell,
      render: (val) => <div>{formatterMoney(val ?? 0)}</div>,
    },
    {
      title: 'Số lượng (học sinh)',
      dataIndex: 'soHocSinh',
      align: 'center',
      width: 130,
      onCell,
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: IKhauPhanAn.Record) => renderLast1(record),
      fixed: 'right',
      width: 200,
    },
  ];

  const handleEdit = (val: object) => {
    setDataEdit(val);
    setVisibleForm(true);
    console.log('vallll', val);
    setRecord({
      ngayAn: [new DateObject(new Date(val.ngayAn))],
    });

    setEdit(true);
  };
  return (
    <Card>
      <Modal
        visible={dataExport != null}
        title="Xác nhận"
        destroyOnClose
        width={600}
        onCancel={() => {
          setDataExport(null);
        }}
        footer={[
          <Button
            onClick={() => {
              setDataExport(null);
            }}
          >
            Thoát
          </Button>,
          <Button
            type="primary"
            onClick={() => {
              exportMenu(dataExport, false);
            }}
          >
            {canCalculate ? 'Không điều chỉnh và Xuất kho' : 'Tiếp tục xuất kho'}
          </Button>,
          canCalculate && (
            <Button
              type="primary"
              onClick={() => {
                exportMenu(dataExport, true);
              }}
            >
              Điều chỉnh và Xuất kho
            </Button>
          ),
        ]}
      >
        Thành tiền của thực đơn{' '}
        {canCalculate ? 'chưa đảm bảo yêu cầu' : 'không thể điều chỉnh đáp ứng yêu cầu'} của quy
        định chung, bạn có muốn điều chỉnh giá của thực đơn này không?
      </Modal>
      <Modal
        title="Nhập số lượng học sinh"
        visible={modalInputStudent}
        // onOk={handleOk}
        // onCancel={handleCancel}
        footer={
          <>
            <Button onClick={handleCancel}>Hủy</Button>
            <Button loading={loadingThemHocSinh} type="primary" onClick={handleOk}>
              Xác nhận
            </Button>
          </>
        }
      >
        <Form>
          <Form.Item name="student" label="Nhập số lượng học sinh">
            <Input
              placeholder="Nhập số lượng học sinh"
              onChange={(e: any) => setDataStudent(e.currentTarget.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        width={500}
        visible={visibleDanhSachThieu}
        onCancel={() => {
          setVisibleDanhSachThieu(false);
          setCheckAddThucPham(0);
          // getThongTinThucDonTheoDonVi();
        }}
        title="Danh sách thực phẩm thiếu"
        footer={
          <>
            <Button
              onClick={() => {
                setVisibleDanhSachThieu(false);
                setCheckAddThucPham(0);
                // if (checkAddThucPham) {
                //   getThongTinThucDonTheoDonVi();
                // }
              }}
            >
              Hủy
            </Button>
            <Button
              type="primary"
              onClick={async () => {
                if (checkAddThucPham === 0) {
                  setCheckAddThucPham(1);
                  window.open('/quanlythucpham/thucphamkho');
                }
                if (checkAddThucPham === 3) {
                  setCheckAddThucPham(1);
                  window.open('/quanlythucpham/thucphamkho');
                }
                if (checkAddThucPham === 1) {
                  const { danhSachThieu } = await checkThieuExport(recordKhauPhanAn);
                  setDanhSachThucPhamThieu(danhSachThieu);
                  if (Object.keys(danhSachThieu).length > 0) {
                    setCheckAddThucPham(3);

                    return;
                  }
                  setCheckAddThucPham(2);
                  // getThongTinThucDonTheoDonVi();
                }
                if (checkAddThucPham === 2) {
                  checkExportDieuChinh(recordKhauPhanAn);
                  setCheckAddThucPham(0);
                  setVisibleDanhSachThieu(false);
                  setDanhSachThucPhamThieu([]);
                }
              }}
            >
              {checkAddThucPham === 1
                ? 'Kiểm tra lại thực phẩm trong kho'
                : checkAddThucPham === 2
                ? 'Đã thêm đủ thực phẩm vào kho'
                : checkAddThucPham === 3
                ? 'Tiếp tục thêm thực phẩm vào kho'
                : 'Thêm thực phẩm vào kho'}
            </Button>
          </>
        }
      >
        <Row>
          {(checkAddThucPham === 1 || checkAddThucPham === 3) && <b>Còn thiếu những thực phẩm: </b>}
          {Object.keys(danhSachThucPhamThieu).length === 0 && (
            <i>Không có thực phẩm nào thiếu trong kho</i>
          )}
          {Object.keys(danhSachThucPhamThieu)
            .filter((item) => danhSachThucPhamThieu?.[item] && danhSachThucPhamThieu?.[item] > 0)
            .map((item, index) => (
              <Col key={index} span={24}>
                - {item} thiếu {danhSachThucPhamThieu?.[item]} trong kho
              </Col>
            ))}
        </Row>
      </Modal>
      <Modal
        title="Danh sách thực phẩm"
        visible={visibleDanhSachThucPham}
        width={700}
        onCancel={() => {
          setVisibleDanhSachThucPham(false);
          setRecordKhauPhanAn({});
        }}
        onOk={() => {
          setVisibleDanhSachThucPham(false);
          setRecordKhauPhanAn({});
        }}
      >
        <Descriptions bordered>
          <Descriptions.Item label="Ngày ăn">
            {recordKhauPhanAn?.ngayAn
              ? moment(recordKhauPhanAn?.ngayAn).format('DD/MM/YYYY')
              : moment().format('DD/MM/YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label="Số học sinh" span={2}>
            {soHocSinhDiHoc ?? 0}
          </Descriptions.Item>
          <Descriptions.Item label="Đơn vị">{recordKhauPhanAn?.donVi?.tenDonVi}</Descriptions.Item>
          <Descriptions.Item label="Tổng tiền" span={2}>
            {Number(getTongDonGia(recordKhauPhanAn)).toFixed(2)}
          </Descriptions.Item>
        </Descriptions>
        <br />

        <div>
          <b>Bảng dinh dưỡng</b>
        </div>
        <Table
          size="small"
          dataSource={recordKhauPhanAn.report}
          columns={columnsReport}
          pagination={false}
          bordered
        />

        {recordKhauPhanAn?.buaAn?.map(
          (item, index: number) =>
            item?.name && (
              <div key={index}>
                {item?.monAn?.map((val, index2: number) => (
                  <div key={index2}>
                    <div>
                      <b>
                        Bữa {item?.name}: {val?.name}
                      </b>
                    </div>
                    <Table
                      size="small"
                      dataSource={val?.thanhPhanMonAn}
                      columns={columns1}
                      pagination={false}
                      bordered
                    />
                  </div>
                ))}
              </div>
            ),
        )}
      </Modal>
      <Tabs defaultActiveKey="Mầm non" onChange={changeLoaiHinh} destroyInactiveTabPane>
        <Tabs.TabPane tab="Mẫu giáo" key="Mầm non">
          <LichThucDon
            thucPham={handleXemThucPham}
            xem={handleView}
            xuat={handleCheckExport}
            xoa={handleDel}
            get={() => {
              getKhauPhanAnModel();
            }}
            danhSach={danhSach}
            edit={handleEdit}
          />
          {/* <TableBase
            border
            columns={columns}
            getData={getKhauPhanAnModel}
            dependencies={[page, limit, cond]}
            loading={loadMonAn}
            modelName="khauphanan"
            scroll={{ x: 1500 }}
            Form={Formm}
            formType="Drawer"
            widthDrawer="60%"
            hascreate={checkAllow('ADD_KHAU_PHAN_AN')}
          >
            <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
              Tổng số:
              <Input
                style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
                value={total}
              />
            </h3>
          </TableBase> */}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Nhà trẻ" key="Nhà trẻ">
          <LichThucDon
            thucPham={handleXemThucPham}
            xem={handleView}
            xuat={handleCheckExport}
            xoa={handleDel}
            get={() => {
              getKhauPhanAnNhaTreModel();
            }}
            danhSach={danhSachNhaTre}
            edit={handleEdit}
          />
          {/* <TableBase
            border
            columns={columns}
            getData={getKhauPhanAnNhaTreModel}
            dependencies={[page, limit, cond]}
            loading={loadMonAn}
            modelName="khauphanan"
            scroll={{ x: 1500 }}
            Form={Formm}
            formType="Drawer"
            widthDrawer="60%"
            hascreate={checkAllow('ADD_KHAU_PHAN_AN')}
            dataState="danhSachNhaTre"
          >
            <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
              Tổng số:
              <Input
                style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
                value={totalNhaTre}
              />
            </h3>
          </TableBase> */}
        </Tabs.TabPane>
      </Tabs>
      {/* Modal view thông tin khẩu phần ăn */}
      <Modal
        visible={visible}
        centered
        width="50%"
        closable
        title="Chi tiết thông tin khẩu phần ăn"
        onCancel={() => setVisible(false)}
        footer={[
          <Button type="primary" key="back" onClick={() => setVisible(false)}>
            OK
          </Button>,
        ]}
      >
        <Descriptions bordered>
          <Descriptions.Item label="Ngày ăn">
            {recordKhauPhanAn?.ngayAn
              ? moment(recordKhauPhanAn?.ngayAn).format('DD/MM/YYYY')
              : moment().format('DD/MM/YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label="Số học sinh">
            {recordKhauPhanAn?.soHocSinh ?? 0}
          </Descriptions.Item>
          <Descriptions.Item label="Số tiền ăn/ngày">
            {formatterMoney(recordKhauPhanAn?.soTienAn ?? 0)}
          </Descriptions.Item>
          <Descriptions.Item label="Đơn vị" span={3}>
            {recordKhauPhanAn?.donVi?.tenDonVi}
          </Descriptions.Item>
          {recordKhauPhanAn?.buaAn?.map(
            (item) =>
              item?.name && (
                <Descriptions.Item label={`Bữa ${item?.name}`} span={3}>
                  {item?.monAn?.map((val) => (
                    <div>{val?.name}, </div>
                  ))}
                </Descriptions.Item>
              ),
          )}
        </Descriptions>
        {/* <Descriptions>
          {recordKhauPhanAn?.buaAn?.map(
            (item) =>
              item?.name && (
                <Descriptions.Item label={`Bữa ${item?.name}`} span={3}>
                  {item?.monAn?.map((val) => (
                    <div>{val?.name}, </div>
                  ))}
                </Descriptions.Item>
              ),
          )}
        </Descriptions> */}
      </Modal>
    </Card>
  );
};

export default KhauPhanAn;
