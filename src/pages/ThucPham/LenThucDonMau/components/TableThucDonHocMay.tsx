import {
  Card,
  Col,
  InputNumber,
  Row,
  Form,
  Table,
  Input,
  Select,
  Button,
  Divider,
  message,
} from 'antd';
import { useModel } from 'umi';
import { useState, useEffect } from 'react';
import rules from '@/utils/rules';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import { Spin } from 'antd';
import { getTongDonGia } from '@/utils/utils';

const TableThucDonHocMay = (props: { taoThucDonMau: Function; thucDonMauType: boolean }) => {
  const [form] = Form.useForm();
  const thucDonMau = useModel('thucdonmau');
  const [danhSachThucDon, setDanhSachThucDon] = useState([]);
  const [thu, setThu] = useState(1);
  const [loading, setLoading] = useState(false);
  const initialStateModel = useModel('@@initialState');
  const vaiTro = initialStateModel?.initialState?.currentUser?.role?.systemRole;

  const getThongTinKhauPhan = async () => {
    const result = await axios.get(`${ip3}/thong-tin-khau-phan-an/pageable?page=1&limit=20`, {
      params: {
        cond: {
          donViId: thucDonMau?.record?.donViId,
          loaiHinh: thucDonMau?.record?.loaiHinhLop,
        },
      },
    });

    const data = result?.data?.data.result?.[0];
    form.setFieldsValue({
      soBua: data?.soBua,
      donViId: thucDonMau?.record?.donViId,
    });
  };

  useEffect(() => {
    getThongTinKhauPhan();
  }, []);

  const dataTable = danhSachThucDon?.map((item, index) => ({
    ...item,
    index: index + 1,
  }));

  return (
    <Card>
      <Spin spinning={!!loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={async (values) => {
            // values.soBua = 2;
            setLoading(true);
            const monAn = values?.monAn;
            const donViId = values?.donViId;
            delete values.monAn;
            delete values.donViId;
            try {
              const response = await axios.get(`${ip3}/khau-phan-an/kho`, {
                params: {
                  donViId: donViId,
                  page: 1,
                  limit: 1000000,
                  cond: {
                    ...values,
                    loaiHinhLop: thucDonMau?.loaiHinh,
                    ...(monAn && { 'buaAn.monAn.name': { $regex: monAn, $options: 'i' } }),
                  },
                },
              });
              setDanhSachThucDon(response?.data?.data?.result);
              if (response?.data?.data?.result?.length === 0) {
                message.error('Chưa có thực đơn mẫu với dữ liệu này');
              } else {
                message.success('Lấy dữ liệu thực đơn mới thành công');
              }
              setLoading(false);
            } catch (e) {
              setLoading(false);
              message.error('Chưa có thực đơn mẫu với dữ liệu này');
            }
          }}
        >
          <Row gutter={[10, 10]}>
            {props.thucDonMauType && (
              <Col span={12}>
                <Form.Item label="Thứ" rules={[...rules.required]}>
                  <Select
                    placeholder="Thứ ..."
                    style={{ width: 100 }}
                    defaultValue={thu}
                    onChange={(value) => {
                      setThu(value);
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                      <Select.Option value={item}>
                        {
                          [
                            'Thứ hai',
                            'Thứ ba',
                            'Thứ tư',
                            'Thứ năm',
                            'Thứ sáu',
                            'Thứ bảy',
                            'Chủ nhật',
                          ][item - 1]
                        }
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            )}
            <Col span={24}>
              <Form.Item
                name="donViId"
                label="Trường"
                rules={[...rules.required]}
                style={{ marginBottom: 5 }}
              >
                <Select
                  showSearch
                  allowClear
                  disabled
                  style={{ width: '100%' }}
                  placeholder="Chọn trường"
                  optionFilterProp="children"
                  filterOption={(input, option: any) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {thucDonMau.danhSachTruong?.map((item: ITruong.Record) => (
                    <Select.Option key={item?._id} value={item?._id}>
                      {item?.tenDonVi}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="giaTienDuKien" label="Giá tiền" rules={[...rules.required]}>
                <Select placeholder="Giá tiền trong khoảng">
                  <Select.Option value={30000}>Khoảng 1 [21.000 - 30.000]</Select.Option>
                  <Select.Option value={40000}>Khoảng 2 [28.000 - 40.000]</Select.Option>
                  <Select.Option value={50000}>Khoảng 3 [35.000 - 50.000]</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="soBua" label="Số bữa" rules={[...rules.required]}>
                <InputNumber disabled placeholder="Nhập số bữa" style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
            {/* <Col span={12}>
            <Form.Item
              name="soLuongMenu"
              label="Số lượng thực đơn"
              // rules={[...rules.required]}
            >
              <Input placeholder="Số lượng thực đơn" />
            </Form.Item>
          </Col> */}
            <Col span={12}>
              <Form.Item name="monAn" label="Tên món ăn">
                <Input placeholder="Món ăn" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label=" ">
                <Button type="primary" htmlType="submit">
                  Lấy dữ liệu
                </Button>
              </Form.Item>
            </Col>
          </Row>
          <Table
            columns={[
              {
                title: 'STT',
                width: 80,
                align: 'center',
                dataIndex: 'index',
              },
              {
                title: 'Thành phần bữa ăn',
                render: (_, record) => (
                  <>
                    {record?.buaAn?.map((buaAn) => (
                      <>
                        <Row>
                          <Col span={8}>
                            <b>Bữa {buaAn?.name}</b>
                          </Col>
                          <Col span={16}>
                            {buaAn?.monAn?.map((item) => (
                              <p>- {item?.name}</p>
                            ))}
                          </Col>
                          <Divider />
                        </Row>
                      </>
                    ))}
                  </>
                ),
              },
              {
                title: 'Thao tác',
                align: 'center',
                render: (_, record) => (
                  <>
                    <Button
                      type="primary"
                      onClick={async () => {
                        setLoading(true);
                        let tmp = {
                          buaAn: record?.buaAn,
                          thu,
                          soTienAn: getTongDonGia(record),
                        };
                        const response = await axios.post(
                          `${ip3}/template-thuc-don-chi-tiet/thuc-don-mau`,
                          tmp,
                        );
                        let a = thu;
                        await props.taoThucDonMau(response?.data?.data?._id, thu);
                        setLoading(false);
                      }}
                    >
                      Thêm thực đơn
                    </Button>
                  </>
                ),
              },
            ]}
            dataSource={dataTable}
            pagination={{
              pageSize: 2,
            }}
          />
        </Form>
      </Spin>
    </Card>
  );
};

export default TableThucDonHocMay;
