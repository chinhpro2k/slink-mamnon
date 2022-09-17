/* eslint-disable no-return-assign */
/* eslint-disable no-underscore-dangle */
import KhoanChiTieu from '@/pages/DoanhThu/KhoanChiTieu';
import type { DoanhThu as IDoanhThu } from '@/services/DoanhThu';
import {
  getDoanhThuCacTruong,
  getSoTienChiGiaoVien,
  tinhDoanhThu,
} from '@/services/DoanhThu/doanhthu';
import { addKhoanChiTieu } from '@/services/KhoanChiTieu/khoanchitieu';
import { addKhoanThu } from '@/services/KhoanThu/khoanthu';
import type { Truong as ITruong } from '@/services/Truong';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import rules from '@/utils/rules';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Spin,
  Table,
  Tag,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import KhoanThu from '../KhoanThu';
import { DoanhThu } from '@/services/DoanhThu';
import { KhoanChiTieu as IKhoanChiTieu } from '@/services/KhoanChiTieu';
const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
});

const columnsTienThu: IColumn<IDoanhThu.Record>[] = [
  {
    title: 'Lớp',
    dataIndex: 'donVi',
    key: 'tenDonVi',
    width: '150px',
  },
  {
    title: 'Số tiền thu (VNĐ)',
    dataIndex: 'tongSoTien',
    key: 'soTienThu',
    align: 'center',
    render: (val: number | bigint) => formatter.format(val ?? 0),
  },
  {
    title: 'Số tiền đã đóng',
    dataIndex: 'hocPhiDaDong',
    key: 'soTienGiamTru',
    align: 'center',
    render: (val: number | bigint) => formatter.format(val ?? 0),
  },
];

const columnTongTien = [
  {
    title: 'Tổng tiền thu',
    dataIndex: 'soTienThuThucTe',
    key: 'tienThu',
    render: (val: number | bigint) => <Tag color="green">{formatter.format(val ?? 0)}</Tag>,
  },
  {
    title: 'Tổng thu dự kiến',
    dataIndex: 'soTienThuDuKien',
    key: 'tienGiamTru',
    render: (val: number | bigint) => <Tag color="red">{formatter.format(val ?? 0)}</Tag>,
  },
  {
    title: 'Tổng chi ',
    dataIndex: 'soTienChi',
    key: 'tienChiTieu',
    render: (val: number | bigint) => <Tag color="purple">{formatter.format(val ?? 0)}</Tag>,
  },
  {
    title: 'Tổng lợi nhuận thực tế',
    dataIndex: 'doanhThuThucTe',
    key: 'tienLoiNhuan',
    render: (val: number | bigint) => <Tag color="blue">{formatter.format(val ?? 0)}</Tag>,
  },
  {
    title: 'Tổng lợi nhuận dự kiến',
    dataIndex: 'doanhThuDuKien',
    key: 'tienLoiNhuan',
    render: (val: number | bigint) => <Tag color="blue">{formatter.format(val ?? 0)}</Tag>,
  },
];

const FormDoanhThu = () => {
  const [form] = Form.useForm();
  const {
    edit,
    loading,
    record,
    setVisibleForm,
    getDoanhThuModel,
    setLoading,
    disable,
    page,
    limit,
    getDoanhThuDonViModel,
    doanhThuDonVi,
  } = useModel('doanhthu');
  const { totalChiTieu, getDataTienChiGiaoVien } = useModel('khoanchitieu');
  const { totalThu: totalKhoanThu } = useModel('khoanthu');
  const [dsTruong, setDanhSachTruong] = useState([]);
  const vaiTro = localStorage.getItem('vaiTro');
  const [dataTienThu, setDataTienThu] = useState();
  const [totalTienThu, setTotalTienThu] = useState<number>(0);
  const [totalTienGiamTru, setTotalTienGiamTru] = useState<number>(0);
  const [donViId, setDonViId] = useState(record?.donViId);
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [dataHocPhiTruong, setDataHocPhiTruong] = useState<DoanhThu.IDataHocPhiTruong[]>();
  const dataTongTien = [
    {
      key: '1',
      tienThu: totalTienThu + totalKhoanThu,
      tienDuKien: totalTienGiamTru,
      tongChi: totalTienThu + totalKhoanThu - totalTienGiamTru,
      tongLoiNhuanThuc: totalChiTieu,
      tongLoiNhuanDuKien: totalTienThu + totalKhoanThu - totalChiTieu,
    },
  ];

  const getDonVi = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=1000`, {
      params: {
        cond: {
          loaiDonVi: 'Truong',
        },
      },
    });
    setDanhSachTruong(result?.data?.data?.result);
  };
  const getDataDoanhThuTruong = async () => {
    const res = await getDoanhThuCacTruong({
      truongId: organizationId as string,
      thang: record?.thang,
      nam: record?.nam,
    });
    if (res) {
      setDataHocPhiTruong(res?.data?.data);
    }
  };

  useEffect(() => {
    if (record) {
      getDataDoanhThuTruong();
      getDoanhThuDonViModel({
        donViId: organizationId as string,
        thang: record?.thang,
        nam: record?.nam,
      });
      // getDataTienChiGiaoVien(organizationId as string, record.thang, record.nam);
    }
  }, [record]);

  const changeTruong = async (val: string) => {
    const thang = new Date().getMonth();
    const nam = new Date().getFullYear();
    const reducer = (previousValue: number, currentValue: number) => previousValue + currentValue;
    setDonViId(val);
    // const result = await axios.get(
    //   `${ip3}/doanh-thu/so-tien-thu-giam-tru/don-vi/${val}/thang/${thang}/nam/${nam}`,
    // );
    // setDataTienThu(result?.data?.data);
    // const totalThu: number[] = [];
    // const totalGiamTru: number[] = [];
    // result?.data?.data?.forEach(
    //   (item: { soTienThu: number; soTienGiamTru: number }) =>
    //     totalThu.push(item?.soTienThu) && totalGiamTru.push(item?.soTienGiamTru),
    // );
    // setTotalTienThu(totalThu?.length > 0 ? totalThu.reduce(reducer) : 0);
    // setTotalTienGiamTru(totalGiamTru?.length > 0 ? totalGiamTru.reduce(reducer) : 0);
  };

  React.useEffect(() => {
    if (vaiTro === 'SuperAdmin' || vaiTro === 'Admin') {
      getDonVi();
    }
    changeTruong(donViId);
  }, []);

  const handleTinhDoanhThu = async (values: any) => {
    const thang = new Date().getMonth();
    const nam = new Date().getFullYear();
    try {
      const res = await tinhDoanhThu({ donViId: values, thang, nam });
      if (res?.data?.statusCode === 201) {
        getDoanhThuModel(organizationId);
        message.success('Cập nhật khoản chi tiêu thành công');
        setVisibleForm(false);
        setLoading(false);
        return true;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return true;
  };

  const onFinish = async (values: any) => {
    const newVal = values;
    if (!newVal?.chiTieu && !newVal?.khoanThu) {
      handleTinhDoanhThu(record?.donViId);
      return false;
    }
    try {
      if (newVal?.chiTieu?.length > 0) {
        newVal?.chiTieu?.map(
          (item: any, index: string | number) => (
            (newVal.chiTieu[index].donViId = record?.donViId),
            (newVal.chiTieu[index].loaiDoanhThu = 'Hệ thống')
          ),
        );
        const res = await addKhoanChiTieu([...newVal?.chiTieu]);
        if (res?.data?.statusCode === 201) {
          handleTinhDoanhThu(record?.donViId);
        }
      }
      if (newVal?.khoanThu?.length > 0) {
        newVal?.khoanThu?.map(
          (item: any, index: string | number) => (
            (newVal.khoanThu[index].donViId = record?.donViId),
            (newVal.khoanThu[index].loaiDoanhThu = 'Hệ thống')
          ),
        );
        const add = await addKhoanThu([...newVal?.khoanThu]);

        if (add?.data?.statusCode === 201) {
          handleTinhDoanhThu(record?.donViId);
        }
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      setLoading(false);
      return false;
    }
    return true;
  };

  return (
    <Card title={edit && !disable ? 'Chỉnh sửa' : 'Chi tiết'}>
      <Spin spinning={loading}>
        <Form onFinish={onFinish} labelCol={{ span: 24 }} form={form}>
          <Row gutter={[16, 0]}>
            {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
              <Col xs={24} lg={24}>
                <Form.Item
                  label="Trường"
                  name="donViId"
                  rules={[...rules.required]}
                  style={{ marginBottom: 5 }}
                  initialValue={record?.donViId}
                >
                  <Select
                    showSearch
                    allowClear
                    style={{ width: '100%' }}
                    placeholder="Chọn trường"
                    optionFilterProp="children"
                    filterOption={(input, option: any) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={changeTruong}
                    disabled={disable || edit}
                  >
                    {dsTruong?.map((item: ITruong.Record) => (
                      <Select.Option key={item?._id} value={item?._id}>
                        {item?.tenDonVi}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            )}
          </Row>
          <>
            <Divider>
              <b>Báo cáo số tiền Thu</b>
            </Divider>
            <Card>
              <Table
                columns={columnsTienThu}
                dataSource={dataHocPhiTruong}
                bordered
                pagination={false}
                summary={(pageData) => {
                  let totalPrice = 0;
                  let totalRepayment = 0;
                  pageData.forEach((val) => {
                    if (val.tongSoTien) {
                      totalPrice += +val.tongSoTien;
                    }
                    if (val.hocPhiDaDong) {
                      totalRepayment += +val.hocPhiDaDong;
                    }
                  });

                  return (
                    <>
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0}>
                          <Typography.Text type={'danger'} strong>
                            Tổng
                          </Typography.Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align={'center'} index={1}>
                          <Typography.Text type={'danger'} strong>
                            {formatter.format(totalPrice ?? 0)}
                          </Typography.Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align={'center'} index={2}>
                          <Typography.Text type={'danger'} strong>
                            {formatter.format(totalRepayment ?? 0)}
                          </Typography.Text>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    </>
                  );
                }}
              />
            </Card>
            <br />
            <KhoanThu donViId={record?.donViId} disable={disable} />

            {!disable && (
              <>
                <br />
                <Form.List name="khoanThu">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field, index) => (
                        <Row gutter={[20, 0]} align="middle" key={field.key}>
                          <Col lg={11} xs={24}>
                            <Form.Item
                              label="Hạng mục"
                              name={[index, 'ten']}
                              rules={[...rules.required]}
                              style={{ marginBottom: 5 }}
                            >
                              <Input placeholder="Nhập hạng mục khoản thu" />
                            </Form.Item>
                          </Col>
                          <Col lg={11} xs={24}>
                            <Form.Item
                              label="Số tiền"
                              name={[index, 'soTien']}
                              rules={[...rules.required]}
                              style={{ marginBottom: 5 }}
                            >
                              <InputNumber
                                placeholder="Nhập số tiền thu"
                                min={0}
                                formatter={(value) =>
                                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                }
                                style={{ width: '100%' }}
                              />
                            </Form.Item>
                          </Col>

                          <Col lg={2} xs={2}>
                            <MinusCircleOutlined onClick={() => remove(field.name)} />
                          </Col>
                        </Row>
                      ))}

                      <Form.Item style={{ marginTop: 20 }}>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          Thêm khoản thu
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </>
            )}
          </>

          <Divider>
            <b>Báo cáo số tiền Chi tiêu</b>
          </Divider>
          <KhoanChiTieu donViId={record?.donViId} disable={disable} record={record} />

          {!disable && (
            <>
              <br />
              <Form.List name="chiTieu">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, index) => (
                      <Row gutter={[20, 0]} align="middle" key={field.key}>
                        <Col lg={11} xs={24}>
                          <Form.Item
                            label="Hạng mục"
                            name={[index, 'ten']}
                            rules={[...rules.required]}
                            style={{ marginBottom: 5 }}
                          >
                            <Input placeholder="Nhập hạng mục khoản chi" />
                          </Form.Item>
                        </Col>
                        <Col lg={11} xs={24}>
                          <Form.Item
                            label="Số tiền"
                            name={[index, 'soTien']}
                            rules={[...rules.required]}
                            style={{ marginBottom: 5 }}
                          >
                            <InputNumber
                              placeholder="Nhập số tiền chi"
                              min={0}
                              formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                              }
                              style={{ width: '100%' }}
                            />
                          </Form.Item>
                        </Col>

                        <Col lg={2} xs={2}>
                          <MinusCircleOutlined onClick={() => remove(field.name)} />
                        </Col>
                      </Row>
                    ))}

                    <Form.Item style={{ marginTop: 20 }}>
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Thêm khoản chi tiêu
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </>
          )}

          {disable && (
            <>
              <Divider>
                <b>Tổng tiền</b>
              </Divider>
              <Table
                dataSource={doanhThuDonVi}
                columns={columnTongTien}
                bordered
                pagination={false}
              />
            </>
          )}

          <Divider />
          <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
            {!disable && (
              <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
                {!edit ? 'Thêm mới' : 'Lưu'}
              </Button>
            )}

            <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
};
export default FormDoanhThu;
