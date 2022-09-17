import { Button, Card, Col, Form, Input, InputNumber, message, Row, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useModel } from '@@/plugin-model/useModel';
import moment from 'moment';
import { KhoanThu as IKhoanThu } from '@/services/KhoanThu';
import rules from '@/utils/rules';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { addKhoanChiTieu } from '@/services/KhoanChiTieu/khoanchitieu';
import { addKhoanThu } from '@/services/KhoanThu/khoanthu';
import { tinhDoanhThu } from '@/services/DoanhThu/doanhthu';
import React, { useEffect, useState } from 'react';
interface DataType {}
const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
});
const DetailDoanhThu = () => {
  const { dataDetail, isNhapTay, dataDetailNhapTay, getKhoanThuModel,setVisibleForm } = useModel('khoanthu');
  const modelDoanhThuThuc = useModel('doanhthuthuc');
  const { record, loaiDoanhThu, edit, getDoanhThuModel, setLoading, month, year } =
    useModel('doanhthu');
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [currentRecordData, setCurrentRecordData] = useState<any>();
  useEffect(() => {
    if (loaiDoanhThu === 'Hệ thống') {
      setCurrentRecordData(record);
    } else {
      setCurrentRecordData(modelDoanhThuThuc.record);
    }
  }, [loaiDoanhThu]);
  const columns: ColumnsType<DataType> = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'name',
    },
    {
      title: 'Tên lớp',
      dataIndex: 'donVi',
      key: 'age',
    },
    {
      title: 'Học phí',
      dataIndex: 'hocPhi',
      key: 'address',
      align: 'center',
      render: (value) => formatter.format(value ?? 0),
    },
    {
      title: 'Tiền ăn',
      dataIndex: 'tienAn',
      key: 'address',
      align: 'center',
      render: (value) => formatter.format(value ?? 0),
    },
    {
      title: 'Tiền trông muộn',
      dataIndex: 'soTienTrongMuon',
      key: 'address',
      align: 'center',
      render: (value) => formatter.format(value ?? 0),
    },
    {
      title: 'Phụ phí cá nhân',
      dataIndex: 'phuPhiCaNhan',
      key: 'address',
      align: 'center',
      render: (value) => formatter.format(value ?? 0),
    },
    {
      title: 'Phụ phí chung',
      dataIndex: 'phuPhiChung',
      key: 'address',
      align: 'center',
      render: (value) => formatter.format(value ?? 0),
    },
  ];
  const columns2: ColumnsType<DataType> = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'name',
    },
    {
      title: 'Tên lớp',
      dataIndex: 'donVi',
      key: 'age',
    },
    {
      title: 'Tổng tiền học phải nộp',
      key: 'address',
      children: [
        {
          title: 'Dự kiến',
          dataIndex: 'tongSoTien',
          key: 'age',
          render: (value) => formatter.format(value ?? 0),
        },
        {
          title: 'Đã nộp',
          dataIndex: 'hocPhiDaDong',
          key: 'age',
          render: (value) => formatter.format(value ?? 0),
        },
      ],
    },
  ];
  const columnsNhapTay: ColumnsType<IKhoanThu.DataDetailNhapTay> = [
    {
      title: 'Hạng mục',
      dataIndex: 'ten',
      align: 'left',
      width: 150,
    },
    {
      title: 'Ngày nhập',
      dataIndex: 'createdAt',
      align: 'center',
      width: 150,
      render: (val) => (val ? moment(val).format('DD-MM-YYYY') : moment().format('DD-MM-YYYY')),
    },
    {
      title: 'Số tiền',
      dataIndex: 'soTien',
      align: 'center',
      width: 130,
      render: (val) => formatter.format(val ?? 0),
    },
  ];
  const [form] = Form.useForm();
  const handleTinhDoanhThu = async (values: any) => {
    const thang = new Date().getMonth();
    const nam = new Date().getFullYear();
    try {
      const res = await tinhDoanhThu({ donViId: values, thang, nam });
      if (res?.data?.statusCode === 201) {
        getKhoanThuModel(currentRecordData.donViId, {
          thang: month,
          nam: year,
          loaiDoanhThu: loaiDoanhThu,
        });
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
      handleTinhDoanhThu(currentRecordData?.donViId);
      return false;
    }
    try {
      if (newVal?.khoanThu?.length > 0) {
        newVal?.khoanThu?.map(
          (item: any, index: string | number) => (
            (newVal.khoanThu[index].donViId = currentRecordData?.donViId),
            (newVal.khoanThu[index].loaiDoanhThu = loaiDoanhThu),
            (newVal.khoanThu[index].soTienDuKien = newVal.khoanThu[index].soTien)
          ),
        );
        const add = await addKhoanThu([...newVal?.khoanThu]);

        if (add?.data?.statusCode === 201) {
          handleTinhDoanhThu(currentRecordData?.donViId);
        }
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      setLoading(false);
      return false;
    }
    return true;
  };
  if (currentRecordData) {
    if (!edit) {
      if (!isNhapTay) {
        return (
          <Card title={'BẢNG CHI TIẾT HỌC PHÍ'} bordered={false}>
            <Card title={`Tháng ${currentRecordData.thang} (đã quyết toán)`} bordered={false}>
              <Table
                columns={columns}
                dataSource={dataDetail?.map((value, i) => {
                  return { ...value, index: i + 1 };
                })}
                pagination={false}
                summary={(pageData) => {
                  let totalPrice = 0;
                  let totalRepayment = 0;
                  let totalTrongMuon = 0;
                  let totalPhuPhi = 0;
                  let totalChung = 0;
                  pageData.forEach((val) => {
                    if (val.hocPhi) {
                      totalPrice += +val.hocPhi;
                    }
                    if (val.tienAn) {
                      totalRepayment += +val.tienAn;
                    }
                    if (val.soTienTrongMuon) {
                      totalTrongMuon += +val.soTienTrongMuon;
                    }
                    if (val.phuPhiCaNhan) {
                      totalPhuPhi += +val.phuPhiCaNhan;
                    }
                    if (val.phuPhiChung) {
                      totalChung += +val.phuPhiChung;
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
                        <Table.Summary.Cell align={'center'} index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell align={'center'} index={2}>
                          <Typography.Text type={'danger'} strong>
                            {formatter.format(totalPrice ?? 0)}
                          </Typography.Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align={'center'} index={3}>
                          <Typography.Text type={'danger'} strong>
                            {formatter.format(totalRepayment ?? 0)}
                          </Typography.Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align={'center'} index={4}>
                          <Typography.Text type={'danger'} strong>
                            {formatter.format(totalTrongMuon ?? 0)}
                          </Typography.Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align={'center'} index={5}>
                          <Typography.Text type={'danger'} strong>
                            {formatter.format(totalPhuPhi ?? 0)}
                          </Typography.Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align={'center'} index={6}>
                          <Typography.Text type={'danger'} strong>
                            {formatter.format(totalChung ?? 0)}
                          </Typography.Text>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    </>
                  );
                }}
              />
            </Card>
            <Card
              title={`Tháng ${currentRecordData.thang + 1} (hiện tại tính trên số quyết toán)`}
              bordered={false}
            >
              <Table
                bordered
                columns={columns2}
                dataSource={dataDetail?.map((value, i) => {
                  return { ...value, index: i + 1 };
                })}
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
                        <Table.Summary.Cell align={'center'} index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell align={'left'} index={2}>
                          <Typography.Text type={'danger'} strong>
                            {formatter.format(totalPrice ?? 0)}
                          </Typography.Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align={'left'} index={3}>
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
          </Card>
        );
      } else {
        return (
          <Card title={'BẢNG CHI TIẾT HỌC PHÍ'} bordered={false}>
            <Card title={'Học phí tính trên số quyết toán'} bordered={false}>
              <Table
                bordered
                columns={columnsNhapTay}
                dataSource={dataDetailNhapTay?.map((value, i) => {
                  return { ...value, index: i + 1 };
                })}
                pagination={false}
              />
            </Card>
          </Card>
        );
      }
    } else {
      return (
        <Form onFinish={onFinish} labelCol={{ span: 24 }} form={form}>
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
                          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
          <Form.Item>
            <Button type={'primary'} htmlType={'submit'}>
              Lưu
            </Button>
          </Form.Item>
        </Form>
      );
    }
  } else return null;
};
export default DetailDoanhThu;
