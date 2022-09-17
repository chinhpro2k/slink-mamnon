/* eslint-disable no-return-assign */
/* eslint-disable no-underscore-dangle */
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
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
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import type { DoanhThu as IDoanhThu } from '@/services/DoanhThu';
import { addDoanhThuThuc, getDoanhThuCacTruong, updDoanhThu } from '@/services/DoanhThu/doanhthu';
import { Truong as ITruong } from '@/services/Truong';
import KhoanThu from '@/pages/DoanhThu/KhoanThu';
import KhoanChiTieu from '@/pages/DoanhThu/KhoanChiTieu';
import { IColumn } from '@/utils/interfaces';
import { DoanhThu } from '@/services/DoanhThu';
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
  const { edit, loading, setVisibleForm, record, getDoanhThuThucModel, disable } =
    useModel('doanhthuthuc');
  const { danhSach, getDoanhThuDonViModel, doanhThuDonVi } = useModel('doanhthu');
  const [donViId, setDonViId] = useState<string | undefined>(record?.donViId);
  const [recordDoanhThu, setRecordDoanhThu] = useState<IDoanhThu.Record>();
  const [dataHocPhiTruong, setDataHocPhiTruong] = useState<DoanhThu.IDataHocPhiTruong[]>();
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const dataTongTien = [
    {
      key: '1',
      // tienThu: totalTienThu + totalKhoanThu,
      // tienGiamTru: totalTienGiamTru,
      // tienDoanhThu: totalTienThu + totalKhoanThu - totalTienGiamTru,
      // tienChiTieu: totalChiTieu,
      // tienLoiNhuan: totalTienThu + totalKhoanThu - totalChiTieu,
    },
  ];
  const changeDoanhThuHT = async (val: string) => {
    const dataDoanhThu = danhSach?.find((item) => item?._id === val);
    setDonViId(dataDoanhThu?.donViId);
    setRecordDoanhThu(dataDoanhThu);
    const resultGiamTru = await axios.get(
      `${ip3}/doanh-thu/so-tien-thu-giam-tru/don-vi/${dataDoanhThu?.donViId}/thang/${dataDoanhThu?.thang}/nam/${dataDoanhThu?.nam}`,
    );
    const resultKhoanThu = await axios.get(`${ip3}/khoan-thu/pageable?page=1&limit=100`, {
      params: {
        donViId: dataDoanhThu?.donViId,
      },
    });
    const resultKhoanChi = await axios.get(`${ip3}/khoan-chi-tieu/pageable?page=1&limit=100`, {
      params: {
        donViId: dataDoanhThu?.donViId,
      },
    });
    const dataGiamTru: any = [];
    const dataThu: any = [];
    const dataChi: any = [];
    resultGiamTru?.data?.data?.map(
      (item: { tenDonVi: string; soTienGiamTru: number; soTienThu: number }) =>
        dataGiamTru.push({
          ten: item?.tenDonVi,
          soTien: item?.soTienGiamTru,
          thoiGian: moment().toISOString(),
        }) &&
        dataThu.push({
          ten: item?.tenDonVi,
          soTien: item?.soTienThu,
          thoiGian: moment().toISOString(),
        }),
    );
    resultKhoanThu?.data?.data?.result?.map(
      (item: { ten: string; soTien: number; createdAt: string }) =>
        dataThu.push({
          ten: item?.ten,
          soTien: item?.soTien,
          thoiGian: item?.createdAt,
        }),
    );
    resultKhoanChi?.data?.data?.result?.map(
      (item: { ten: string; soTien: number; createdAt: string }) =>
        dataChi.push({
          ten: item?.ten,
          soTien: item?.soTien,
          thoiGian: item?.createdAt,
        }),
    );
    form.setFieldsValue({
      khoanGiamTru: dataGiamTru,
      khoanThu: dataThu,
      khoanChi: dataChi,
    });
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
    }
  }, [record]);

  const onFinish = async (values: any) => {
    const newVal = { ...values };
    const reducer = (previousValue: number, currentValue: number) => previousValue + currentValue;
    newVal.loaiDoanhThu = 'Khác';
    newVal.donViId = recordDoanhThu?.donViId ?? record?.donViId;
    newVal.thang = recordDoanhThu?.thang ?? record?.thang;
    newVal.nam = recordDoanhThu?.nam ?? record?.nam;
    // tính tổng tiền
    const totalThu: number[] = [];
    const totalChi: number[] = [];
    const totalGiamTru: number[] = [];
    newVal?.khoanThu?.forEach((item: { soTien: number }) => totalThu.push(item?.soTien));
    newVal.soTienThu = totalThu.length > 0 ? totalThu.reduce(reducer) : 0;
    newVal?.khoanChi?.forEach((item: { soTien: number }) => totalChi.push(item?.soTien));
    newVal.soTienChi = totalChi.length > 0 ? totalChi.reduce(reducer) : 0;
    newVal?.khoanGiamTru?.forEach((item: { soTien: number }) => totalGiamTru.push(item?.soTien));
    newVal.soTienGiamTru = totalGiamTru?.length > 0 ? totalGiamTru.reduce(reducer) : 0;
    newVal.doanhThu = newVal?.soTienThu - newVal?.soTienGiamTru - newVal?.soTienChi;

    if (edit) {
      try {
        const res = await updDoanhThu({
          ...newVal,
          loaiDoanhThu: 'Khác',
          id: record?._id,
        });
        if (res?.data?.statusCode === 200) {
          message.success('Cập nhật doanh thu thực thành công');
          getDoanhThuThucModel(record?.donViId);
          setVisibleForm(false);
          return true;
        }
      } catch (error) {
        message.error('Đã xảy ra lỗi');
        return false;
      }
    }

    try {
      const res = await addDoanhThuThuc({ ...newVal });
      if (res?.data?.statusCode === 201) {
        getDoanhThuThucModel(donViId);
        message.success('Thêm mới doanh thu thực thành công');
        setVisibleForm(false);
        return true;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return true;
  };
  if (edit) {
    return (
      <Card title={edit ? 'Chỉnh sửa' : 'Chi tiết'}>
        <Spin spinning={loading}>
          <Form onFinish={onFinish} labelCol={{ span: 24 }} form={form}>
            {!edit && (
              <Form.Item
                label="Doanh thu hệ thống"
                name="heThong"
                rules={[...rules.required]}
                style={{ marginBottom: 5 }}
              >
                <Select placeholder="Chọn doanh thu từ hệ thống" onChange={changeDoanhThuHT}>
                  {danhSach?.map(
                    (item: {
                      _id: string;
                      thang: number;
                      nam: number;
                      donVi: { tenDonVi: string };
                    }) => (
                      <Select.Option value={item?._id} key={item?._id}>
                        {`Tháng ${item?.thang + 1}/${item?.nam}`} - {item?.donVi?.tenDonVi}
                      </Select.Option>
                    ),
                  )}
                </Select>
              </Form.Item>
            )}
            {edit && (
              <Form.Item
                label="Đơn vị"
                name="tenDonVi"
                rules={[...rules.required]}
                style={{ marginBottom: 5 }}
                initialValue={record?.donVi?.tenDonVi}
              >
                <Select placeholder="Chọn đơn vị" disabled />
              </Form.Item>
            )}
            {((!edit && donViId) || edit) && (
              <div>
                <Divider>
                  <b>Báo cáo số tiền Thu</b>
                </Divider>
                <Form.List initialValue={record?.khoanThu ?? []} name="khoanThu">
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
                              <Input
                                placeholder="Nhập hạng mục khoản thu"
                                // disabled
                              />
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
                                // disabled
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

                {/*<Divider>*/}
                {/*  <b>Báo cáo số tiền Giảm trừ</b>*/}
                {/*</Divider>*/}
                {/*<Form.List initialValue={record?.khoanGiamTru ?? []} name="khoanGiamTru">*/}
                {/*  {(fields, { add, remove }) => (*/}
                {/*    <>*/}
                {/*      {fields.map((field, index) => (*/}
                {/*        <Row gutter={[20, 0]} align="middle" key={field.key}>*/}
                {/*          <Col lg={11} xs={24}>*/}
                {/*            <Form.Item*/}
                {/*              label="Hạng mục"*/}
                {/*              name={[index, 'ten']}*/}
                {/*              rules={[...rules.required]}*/}
                {/*              style={{ marginBottom: 5 }}*/}
                {/*            >*/}
                {/*              <Input placeholder="Nhập hạng mục khoản giảm trừ" />*/}
                {/*            </Form.Item>*/}
                {/*          </Col>*/}
                {/*          <Col lg={11} xs={24}>*/}
                {/*            <Form.Item*/}
                {/*              label="Số tiền"*/}
                {/*              name={[index, 'soTien']}*/}
                {/*              rules={[...rules.required]}*/}
                {/*              style={{ marginBottom: 5 }}*/}
                {/*            >*/}
                {/*              <InputNumber*/}
                {/*                placeholder="Nhập số tiền giảm trừ"*/}
                {/*                min={0}*/}
                {/*                formatter={(value) =>*/}
                {/*                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')*/}
                {/*                }*/}
                {/*                style={{ width: '100%' }}*/}
                {/*              />*/}
                {/*            </Form.Item>*/}
                {/*          </Col>*/}

                {/*          <Col lg={2} xs={2}>*/}
                {/*            <MinusCircleOutlined onClick={() => remove(field.name)} />*/}
                {/*          </Col>*/}
                {/*        </Row>*/}
                {/*      ))}*/}

                {/*      <Form.Item style={{ marginTop: 20 }}>*/}
                {/*        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>*/}
                {/*          Thêm khoản giảm trừ*/}
                {/*        </Button>*/}
                {/*      </Form.Item>*/}
                {/*    </>*/}
                {/*  )}*/}
                {/*</Form.List>*/}

                <Divider>
                  <b>Báo cáo số tiền Chi tiêu</b>
                </Divider>
                <Form.List name="khoanChi" initialValue={record?.khoanChi ?? []}>
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
              </div>
            )}

            <Divider />
            <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
              <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
                {!edit ? 'Thêm mới' : 'Lưu'}
              </Button>

              <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    );
  } else {
    return (
      <Card title={edit && !disable ? 'Chỉnh sửa' : 'Chi tiết'}>
        <Spin spinning={loading}>
          <Form onFinish={onFinish} labelCol={{ span: 24 }} form={form}>
            <Row gutter={[16, 0]}>
              {/*{(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (*/}
              {/*  <Col xs={24} lg={24}>*/}
              {/*    <Form.Item*/}
              {/*      label="Trường"*/}
              {/*      name="donViId"*/}
              {/*      rules={[...rules.required]}*/}
              {/*      style={{ marginBottom: 5 }}*/}
              {/*      initialValue={record?.donViId}*/}
              {/*    >*/}
              {/*      <Select*/}
              {/*        showSearch*/}
              {/*        allowClear*/}
              {/*        style={{ width: '100%' }}*/}
              {/*        placeholder="Chọn trường"*/}
              {/*        optionFilterProp="children"*/}
              {/*        filterOption={(input, option: any) =>*/}
              {/*          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0*/}
              {/*        }*/}
              {/*        onChange={changeTruong}*/}
              {/*        disabled={disable || edit}*/}
              {/*      >*/}
              {/*        {dsTruong?.map((item: ITruong.Record) => (*/}
              {/*          <Select.Option key={item?._id} value={item?._id}>*/}
              {/*            {item?.tenDonVi}*/}
              {/*          </Select.Option>*/}
              {/*        ))}*/}
              {/*      </Select>*/}
              {/*    </Form.Item>*/}
              {/*  </Col>*/}
              {/*)}*/}
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
                      totalPrice += +val.tongSoTien;
                      totalRepayment += +val.hocPhiDaDong;
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
            </>

            <Divider>
              <b>Báo cáo số tiền Chi tiêu</b>
            </Divider>
            <KhoanChiTieu
              donViId={record?.donViId}
              disable={disable}
              record={record}
              type={'linh-hoat'}
            />

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

            <Divider />
            {/*<Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>*/}
            {/*  {!disable && (*/}
            {/*    <Button*/}
            {/*      loading={loading}*/}
            {/*      style={{ marginRight: 8 }}*/}
            {/*      htmlType="submit"*/}
            {/*      type="primary"*/}
            {/*    >*/}
            {/*      {!edit ? 'Thêm mới' : 'Lưu'}*/}
            {/*    </Button>*/}
            {/*  )}*/}

            {/*  <Button onClick={() => setVisibleForm(false)}>Đóng</Button>*/}
            {/*</Form.Item>*/}
          </Form>
        </Spin>
      </Card>
    );
  }
};
export default FormDoanhThu;
