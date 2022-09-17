/* eslint-disable no-underscore-dangle */
import type { TaiKhoanPhuHuynh as ITaiKhoanPhuHuynh } from '@/services/TaiKhoanPhuHuynh/index';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
} from 'antd';
import moment from 'moment';
import { stringify } from 'querystring';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import rules from '../../utils/rules';
import { Table } from 'antd';
import { currencyFormat } from '../../utils/utils';

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const NangCapTaiKhoan = () => {
  const [checkVaiTro, setCheckVaiTro] = useState('');
  const [step, setStep] = useState<number>(1);
  const [hinhThuc, setHinhThuc] = useState<string>('');
  const [danhSachCon, setDanhSachCon] = useState([]);
  const [visibleCheckThanhToan, setVisibleCheckThanhToan] = useState(false);
  const [record, setRecord] = useState<ITaiKhoanPhuHuynh.Record>();
  const [form] = Form.useForm();
  const [danhSachTruong, setDanhSachTruong] = useState([]);
  const [danhSachDonVi, setDanhSachDonVi] = useState([]);
  const [danhSachLop, setDanhSachLop] = useState([]);
  const [danhSachNangCap, setDanhSachNangCap] = useState([]);
  const [checkSubmit, setCheckSubmit] = useState<boolean>(false);
  const [visibleGoiThanhToan, setVisibleGoiThanhToan] = useState(false);
  const [danhSachGoiThanhToan, setDanhSachGoiThanhToan] = useState([]);
  const { initialState } = useModel('@@initialState');
  const [identityCode, setIdentityCode] = useState(undefined);

  const getDSTruong = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=100`);
    setDanhSachDonVi(result?.data?.data?.result);
    const dsTruong: any = [];
    result?.data?.data?.result?.map(
      (item: { loaiDonVi: string }) => item?.loaiDonVi === 'Truong' && dsTruong.push(item),
    );
    setDanhSachTruong(dsTruong);
  };

  const getDanhSachConKhach = async () => {
    const result = await axios.get(`${ip3}/con/pageable/my?page=1&limit=20`);
    setDanhSachCon(result?.data?.data?.result);
  };

  const getDanhSachNangCap = async () => {
    const result = await axios.get(`${ip3}/user/pageable/nang-cap?page=1&limit=200000`);
    setDanhSachNangCap(result?.data?.data?.result);
  };
  useEffect(() => {
    getDanhSachConKhach();
    getDSTruong();
    getDanhSachNangCap();
  }, []);

  useEffect(() => {}, []);

  const showThanhToan = async () => {
    // const nangCapGiaoVien = await axios.post()
    setVisibleCheckThanhToan(true);
  };

  const loginOut = async () => {
    const { query = {}, pathname } = history.location;
    const { redirect } = query;
    // Note: There may be security issues, please note
    if (window.location.pathname !== '/user/login' && !redirect) {
      localStorage.removeItem('vaiTro');
      localStorage.removeItem('token');
      localStorage.removeItem('dataRole');
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: pathname,
        }),
      });
    }
  };

  const checkThanhToan = async () => {
    const res = await axios.post(`${ip3}/user/nang-cap-user/thanh-toan-onl/thanh-toan`);
    if (res) {
      if (res.status === 201) {
        message.success('Thanh toán thành công!');
        setVisibleCheckThanhToan(false);
      } else {
        message.error('Thanh toán thất bại xin vui lòng thử lại.');
      }
    }
  };

  const onFinish = async (values: ITaiKhoanPhuHuynh.Record) => {
    const newVal = values;
    // Nhập mã code nâng cấp phụ huynh
    if (newVal.conId && checkVaiTro === 'PhuHuynh' && checkSubmit) {
      try {
        const result = await axios.put(
          `${ip3}/user/nang-cap-user/active-code/${newVal.maCode}?conId=${newVal.conId}`,
        );
        if (result?.data?.statusCode === 200) {
          message.success(
            'Chúc mừng bạn đã nâng cấp tài khoản lên phụ huynh thành công. Vui lòng đăng nhập lại để sử dụng chức năng.',
          );
          loginOut();
          return true;
        }
      } catch (error) {
        const { response }: any = error;
        if (response?.data?.errorCode === 'INVALID_CODE') {
          message.error('Mã code không hợp lệ. Vui lòng sử dụng mã code khác');
        }
        if (response?.data?.errorCode === 'EXISTS_DON_VI') {
          message.error('Con của bạn đã ở trong lớp. Vui lòng chọn lại!');
        }
        return false;
      }
    }

    // Nhập mã code nâng cấp giáo viên
    if (!newVal.conId && checkVaiTro === 'GiaoVien' && checkSubmit) {
      try {
        const result = await axios.put(`${ip3}/user/nang-cap-user/active-code/${newVal.maCode}`);
        if (result?.data?.statusCode === 200) {
          message.success(
            'Chúc mừng bạn đã nâng cấp tài khoản lên giáo viên thành công. Vui lòng đăng nhập lại để sử dụng chức năng.',
          );
          loginOut();
          return true;
        }
      } catch (error) {
        const { response }: any = error;
        if (response?.data?.errorCode === 'INVALID_CODE') {
          message.error('Mã code không hợp lệ. Vui lòng sử dụng mã code khác');
        }
        if (response?.data?.errorCode === 'LIMITED_GV') {
          message.error('Số lượng giáo viên trong lớp đã đủ. Vui lòng chọn lớp khác');
        }
        return false;
      }
    }
    return false;
  };

  const onUpgrade = async (values: { maLop: string; conId: string }) => {
    if (checkVaiTro === 'PhuHuynh') {
      const check: any = danhSachNangCap?.find(
        (item: { conId: string }) => item?.conId === record?._id,
      );

      if (check && check?.trangThai === 'Chưa xử lý') {
        message.error('Bạn đã gửi yêu cầu nâng cấp tài khoản. Vui lòng chờ xét duyệt');
        return false;
      }
      // Nâng cấp từ khách lên phụ huynh thanh toán onl
      try {
        const res = await axios.post(`${ip3}/user/nang-cap-user/thanh-toan-onl/dang-ky`, {
          vaiTro: checkVaiTro,
          donViId: values?.maLop,
          conId: values?.conId,
          nangCapTaiKhoanId: identityCode,
        });
        if (res?.data?.statusCode === 201) {
          message.success(
            'Đã gửi yêu cầu nâng cấp tài khoản thành công. Vui lòng đợi Hiệu Trưởng xét duyệt yêu cầu.',
          );
          history.push('');
          return true;
        }
      } catch (error) {
        const { response }: any = error;
        if (response?.data?.errorCode === 'PAYMENT_NOT_COMPLETED') {
          message.error('Bạn chưa hoàn thành thanh toán. Vui lòng thực hiện thanh toán!');
          setStep(1);
          return false;
        }
        if (response?.data?.errorCode === 'EXISTED_MA_TRUONG') {
          message.error('Thông tin con đang ở trong lớp, không thể thực hiện nâng cấp!');
          return false;
        }
        message.error('Thực hiện nâng cấp không thành công. Vui lòng thử lại sau');
        return false;
      }
    }
    // Nâng cấp từ khách lên giáo viên thanh toán onl
    const res = await axios.post(`${ip3}/user/nang-cap-user/thanh-toan-onl/dang-ky`, {
      vaiTro: checkVaiTro,
      donViId: values?.maLop,
    });
    if (res?.data?.statusCode === 201) {
      message.success(
        'Đã gửi yêu cầu nâng cấp tài khoản thành công. Vui lòng đợi Hiệu Trưởng xét duyệt yêu cầu.',
      );
      history.push('');
      return true;
    }
    message.error('Đã xảy ra lỗi');
    return false;
  };

  const vaiTro = [
    {
      value: 'PhuHuynh',
      label: 'Phụ huynh',
    },
    {
      value: 'GiaoVien',
      label: 'Giáo viên',
    },
  ];
  const changeVaiTro = (val: string) => {
    setCheckVaiTro(val);
    if (val === 'GiaoVien') {
      setCheckSubmit(true);
      setRecord(danhSachCon?.find((item: any) => item?._id === val));
    }
  };
  const changeHinhThuc = (val: string) => {
    setHinhThuc(val);
  };
  const changeTruong = (val: string) => {
    const dsLop: any = [];
    form.setFieldsValue({
      maLop: undefined,
    });
    danhSachDonVi?.map((item: { parent: string }) => item?.parent === val && dsLop.push(item));
    setDanhSachLop(dsLop);
  };
  const changeCon = (val: string) => {
    if (!val) {
      setCheckSubmit(false);
    } else {
      setRecord(danhSachCon?.find((item: any) => item?._id === val));
      const newRecord: any = danhSachCon?.find((item: any) => item?._id === val);
      form.setFieldsValue({
        ...newRecord,
        ngaySinh: newRecord?.ngaySinh
          ? moment(new Date(newRecord?.namSinh, newRecord?.thangSinh - 1, newRecord?.ngaySinh))
          : moment(),
      });
      setCheckSubmit(true);
    }
  };
  return (
    <Card
      title={
        <Breadcrumb style={{ cursor: 'pointer' }}>
          <Breadcrumb.Item
            onClick={() => {
              setStep(1);
            }}
          >
            Bước 1: Chọn hình thức
          </Breadcrumb.Item>
          {step === 2 && <Breadcrumb.Item>Bước 2: Nâng cấp tài khoản</Breadcrumb.Item>}
        </Breadcrumb>
      }
    >
      {step === 1 ? (
        <Row justify="center">
          <Col span={16}>
            <Form form={form} onFinish={onFinish} {...formItemLayout}>
              <Form.Item label="Vai trò" name="vaiTro" rules={[...rules.required]}>
                <Select onChange={changeVaiTro} placeholder="Chọn vai trò">
                  {vaiTro?.map((item) => (
                    <Select.Option value={item?.value}>{item?.label}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <b>Để thực hiện nâng cấp tài khoản hãy chọn hình thức thanh toán dưới đây</b>
              <Col>
                <Form.Item name="hinhThuc" label="Hình thức thanh toán" rules={[...rules.required]}>
                  <Select
                    placeholder="Chọn hình thức thanh toán"
                    onChange={changeHinhThuc}
                    defaultValue={checkVaiTro === 'Giáo viên' ? 'Nhập code' : undefined}
                  >
                    <Select.Option value="Nhập code">Nhập code</Select.Option>
                    <Select.Option value="Thanh toán trực tuyến">
                      Thanh toán trực tuyến
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Form.Item>
                <Row justify="center" gutter={[16, 0]}>
                  {hinhThuc === 'Thanh toán trực tuyến' && checkVaiTro === 'PhuHuynh' && (
                    <Col span={6}>
                      <Button
                        type="primary"
                        onClick={showThanhToan}
                        // disabled={
                        //   !!(
                        //     initialState?.currentUser?.soLanThanhToan &&
                        //     initialState?.currentUser?.soLanThanhToan > 0
                        //   )
                        // }
                      >
                        Thanh toán
                      </Button>
                    </Col>
                  )}
                  <Col span={6}>
                    <Button
                      disabled={!checkVaiTro || !hinhThuc}
                      type="primary"
                      onClick={() => {
                        setStep(2);
                      }}
                    >
                      Bước tiếp theo
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
          </Col>
          <Modal
            title="Danh sách gói thanh toán"
            visible={visibleGoiThanhToan}
            onCancel={() => {
              setVisibleGoiThanhToan(false);
            }}
            width={600}
            footer={[]}
          >
            <Table
              bordered
              dataSource={danhSachGoiThanhToan.map((item, index) => ({
                ...item,
                index: index + 1,
              }))}
              columns={[
                {
                  title: 'STT',
                  dataIndex: 'index',
                  align: 'center',
                  width: 80,
                },
                {
                  title: 'Tên gói',
                  dataIndex: 'tenGoi',
                  align: 'center',
                  width: 200,
                },
                {
                  title: 'Thời gian',
                  dataIndex: 'thoiGianGoi',
                  align: 'center',
                  width: 100,
                  render: (val) => `${val} tháng`,
                },
                {
                  title: 'Giá tiền',
                  dataIndex: 'prices',
                  align: 'center',
                  width: 100,
                  render: (val) => (val ? currencyFormat(val) : ''),
                },
                {
                  title: ' ',
                  dataIndex: '',
                  align: 'center',
                  width: 100,
                  render: (val, record) => (
                    <Button
                      onClick={async () => {
                        const res = await axios.post(`${ip3}/nang-cap-tai-khoan/thanh-toan`, {
                          goiThanhToan: record?._id,
                        });

                        setStep(2);
                        setVisibleGoiThanhToan(false);
                        setVisibleCheckThanhToan(false);
                        setIdentityCode(res?.data?.data?.identityCode);
                      }}
                    >
                      Lựa chọn
                    </Button>
                  ),
                },
              ]}
            />
          </Modal>
          <Modal
            title="Thực hiện thanh toán"
            visible={visibleCheckThanhToan}
            onCancel={() => {
              setVisibleCheckThanhToan(false);
            }}
            onOk={checkThanhToan}
            destroyOnClose
            okText="Xác nhận"
          >
            <div style={{ textAlign: 'center' }}>
              <Avatar
                shape="square"
                size={{ xs: 40, sm: 60, md: 80, lg: 100, xl: 150, xxl: 200 }}
                src="/logo.png"
              />
            </div>
          </Modal>
        </Row>
      ) : (
        <Row justify="center">
          <Col span={16}>
            <Form
              {...formItemLayout}
              onFinish={hinhThuc === 'Thanh toán trực tuyến' ? onUpgrade : onFinish}
            >
              {hinhThuc === 'Nhập code' && (
                <Col>
                  <Form.Item name="maCode" label="Mã code" rules={[...rules.required]}>
                    <Input placeholder="Nhập mã code" />
                  </Form.Item>
                </Col>
              )}
              {checkVaiTro === 'PhuHuynh' && (
                <>
                  <Col span={24}>
                    <Form.Item
                      name="conId"
                      style={{ marginBottom: 5 }}
                      label="Chọn con"
                      rules={[...rules.required]}
                    >
                      <Select placeholder="Chọn con" onChange={changeCon} allowClear>
                        {danhSachCon?.map((item: any) => (
                          // eslint-disable-next-line no-underscore-dangle
                          <Select.Option value={item?._id}>{item?.hoTen}</Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <br />
                </>
              )}
              {hinhThuc === 'Thanh toán trực tuyến' && (
                <>
                  <Form.Item
                    name="maTruong"
                    rules={[...rules.required]}
                    style={{ marginBottom: 5 }}
                    label="Trường"
                  >
                    <Select
                      placeholder="Chọn trường"
                      onChange={changeTruong}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option: any) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {danhSachTruong?.map((item: any) => (
                        <Select.Option value={item?._id}>{item?.tenDonVi}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item name="maLop" rules={[...rules.required]} label="Lớp">
                    <Select
                      placeholder="Chọn lớp"
                      showSearch
                      notFoundContent="Trường hiện tại chưa có lớp nào"
                      optionFilterProp="children"
                      filterOption={(input, option: any) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {danhSachLop?.map((item: any) => (
                        <Select.Option value={item?._id}>{item?.tenDonVi}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item>
                    <Row justify="center">
                      <Col span={5}>
                        <Button type="primary" htmlType="submit">
                          Xác nhận nâng cấp
                        </Button>
                      </Col>
                    </Row>
                  </Form.Item>
                </>
              )}
              {hinhThuc === 'Nhập code' && (
                <Row justify="center">
                  <Col span={5}>
                    <Button type="primary" htmlType="submit">
                      Xác nhận nâng cấp
                    </Button>
                  </Col>
                </Row>
              )}
            </Form>
          </Col>
        </Row>
      )}
    </Card>
  );
};
export default NangCapTaiKhoan;
