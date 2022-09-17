import { Button, Card, Col, Form, Input, InputNumber, message, Row, Table } from 'antd';
import { useModel } from '@@/plugin-model/useModel';
import { IColumn } from '@/utils/interfaces';
import rules from '@/utils/rules';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import React, {useEffect, useState} from 'react';
import { addKhoanThu } from '@/services/KhoanThu/khoanthu';
import { tinhDoanhThu } from '@/services/DoanhThu/doanhthu';
import { addKhoanChiTieu } from '@/services/KhoanChiTieu/khoanchitieu';
import moment from "moment";
const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
});
const DetailChiPhi = () => {
  const { dataLuongThang, dataHoaDon, type, getKhoanChiTieuModel, setVisibleForm } =
    useModel('khoanchitieu');
  const { edit, loaiDoanhThu, record, setLoading, month, year } =
    useModel('doanhthu');
  const modelDoanhThuThuc = useModel('doanhthuthuc');
  const [form] = Form.useForm();
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
  const handleTinhDoanhThu = async (values: any) => {
    const thang = new Date().getMonth();
    const nam = new Date().getFullYear();
    try {
      const res = await tinhDoanhThu({ donViId: values, thang, nam });
      if (res?.data?.statusCode === 201) {
        getKhoanChiTieuModel(values, {
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
      if (newVal?.chiTieu?.length > 0) {
        newVal?.chiTieu?.map(
          (item: any, index: string | number) => (
            (newVal.chiTieu[index].donViId = currentRecordData?.donViId),
              (newVal.chiTieu[index].loaiDoanhThu = loaiDoanhThu),
              (newVal.chiTieu[index].soTienDuKien = newVal.chiTieu[index].soTien)
          ),
        );
        const res = await addKhoanChiTieu([...newVal?.chiTieu]);
        if (res?.data?.statusCode === 201) {
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
  const columnsMuaHang: IColumn<any>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 50,
    },
    {
      title: 'Hạng mục',
      dataIndex: 'tenTP',
      align: 'left',
      width: 150,
      render: () => <span>Hóa đơn mua hàng từ hệ thống</span>,
    },
    {
      title: 'Thời gian',
      dataIndex: 'tenTP',
      align: 'center',
      width: 150,
      render: (val, recordVal) => (
        <span>
          {moment().date(recordVal.ngay).month(recordVal.thang).year(recordVal.nam).format("DD/MM/YYYY")}
          {/*{recordVal.ngay}/{recordVal.thang}/{recordVal.nam}*/}
        </span>
      ),
    },
    // {
    //   title: 'Ngày nhập',
    //   dataIndex: 'createdAt',
    //   align: 'center',
    //   width: 150,
    //   render: (val) => (val ? moment(val).format('DD-MM-YYYY') : moment().format('DD-MM-YYYY')),
    // },
    {
      title: 'Số tiền',
      dataIndex: 'tongSoTien',
      align: 'center',
      width: 130,
      render: (val) => formatter.format(val ?? 0),
    },
  ];
  const columnsTeacher: IColumn<any>[] = [
    {
      title: 'Họ tên',
      dataIndex: 'hoTen',
      align: 'left',
      width: 150,
    },
    {
      title: 'Số tiền',
      dataIndex: 'tongSoTien',
      align: 'center',
      width: 130,
      render: (val) => formatter.format(val ?? 0),
    },
  ];
  if (!edit) {
    if (type === 'hoaDonMuaHang') {
      return (
        <Card title={'Hóa đơn mua hàng'} bordered={false}>
          <Table
            columns={columnsMuaHang}
            dataSource={dataHoaDon?.map((value: any, i: number) => {
              return { ...value, index: i + 1 };
            })}
            scroll={{ y: 500 }}
            pagination={false}
          />
        </Card>
      );
    } else {
      if (type === 'luongThang') {
        return (
          <Card title={'Lương tháng'} bordered={false}>
            <Table
              bordered
              columns={columnsTeacher}
              dataSource={dataLuongThang?.map((value: any, i: number) => {
                return { ...value, index: i + 1 };
              })}
              scroll={{ y: 500 }}
              pagination={false}
            />
          </Card>
        );
      } else {
        return null;
      }
    }
  } else {
    return (
      <Form onFinish={onFinish} labelCol={{ span: 24 }} form={form}>
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
                  Thêm khoản chi tiêu
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
};
export default DetailChiPhi;
