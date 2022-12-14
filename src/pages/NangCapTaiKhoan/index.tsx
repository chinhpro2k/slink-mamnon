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
        message.success('Thanh to??n th??nh c??ng!');
        setVisibleCheckThanhToan(false);
      } else {
        message.error('Thanh to??n th???t b???i xin vui l??ng th??? l???i.');
      }
    }
  };

  const onFinish = async (values: ITaiKhoanPhuHuynh.Record) => {
    const newVal = values;
    // Nh???p m?? code n??ng c???p ph??? huynh
    if (newVal.conId && checkVaiTro === 'PhuHuynh' && checkSubmit) {
      try {
        const result = await axios.put(
          `${ip3}/user/nang-cap-user/active-code/${newVal.maCode}?conId=${newVal.conId}`,
        );
        if (result?.data?.statusCode === 200) {
          message.success(
            'Ch??c m???ng b???n ???? n??ng c???p t??i kho???n l??n ph??? huynh th??nh c??ng. Vui l??ng ????ng nh???p l???i ????? s??? d???ng ch???c n??ng.',
          );
          loginOut();
          return true;
        }
      } catch (error) {
        const { response }: any = error;
        if (response?.data?.errorCode === 'INVALID_CODE') {
          message.error('M?? code kh??ng h???p l???. Vui l??ng s??? d???ng m?? code kh??c');
        }
        if (response?.data?.errorCode === 'EXISTS_DON_VI') {
          message.error('Con c???a b???n ???? ??? trong l???p. Vui l??ng ch???n l???i!');
        }
        return false;
      }
    }

    // Nh???p m?? code n??ng c???p gi??o vi??n
    if (!newVal.conId && checkVaiTro === 'GiaoVien' && checkSubmit) {
      try {
        const result = await axios.put(`${ip3}/user/nang-cap-user/active-code/${newVal.maCode}`);
        if (result?.data?.statusCode === 200) {
          message.success(
            'Ch??c m???ng b???n ???? n??ng c???p t??i kho???n l??n gi??o vi??n th??nh c??ng. Vui l??ng ????ng nh???p l???i ????? s??? d???ng ch???c n??ng.',
          );
          loginOut();
          return true;
        }
      } catch (error) {
        const { response }: any = error;
        if (response?.data?.errorCode === 'INVALID_CODE') {
          message.error('M?? code kh??ng h???p l???. Vui l??ng s??? d???ng m?? code kh??c');
        }
        if (response?.data?.errorCode === 'LIMITED_GV') {
          message.error('S??? l?????ng gi??o vi??n trong l???p ???? ?????. Vui l??ng ch???n l???p kh??c');
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

      if (check && check?.trangThai === 'Ch??a x??? l??') {
        message.error('B???n ???? g???i y??u c???u n??ng c???p t??i kho???n. Vui l??ng ch??? x??t duy???t');
        return false;
      }
      // N??ng c???p t??? kh??ch l??n ph??? huynh thanh to??n onl
      try {
        const res = await axios.post(`${ip3}/user/nang-cap-user/thanh-toan-onl/dang-ky`, {
          vaiTro: checkVaiTro,
          donViId: values?.maLop,
          conId: values?.conId,
          nangCapTaiKhoanId: identityCode,
        });
        if (res?.data?.statusCode === 201) {
          message.success(
            '???? g???i y??u c???u n??ng c???p t??i kho???n th??nh c??ng. Vui l??ng ?????i Hi???u Tr?????ng x??t duy???t y??u c???u.',
          );
          history.push('');
          return true;
        }
      } catch (error) {
        const { response }: any = error;
        if (response?.data?.errorCode === 'PAYMENT_NOT_COMPLETED') {
          message.error('B???n ch??a ho??n th??nh thanh to??n. Vui l??ng th???c hi???n thanh to??n!');
          setStep(1);
          return false;
        }
        if (response?.data?.errorCode === 'EXISTED_MA_TRUONG') {
          message.error('Th??ng tin con ??ang ??? trong l???p, kh??ng th??? th???c hi???n n??ng c???p!');
          return false;
        }
        message.error('Th???c hi???n n??ng c???p kh??ng th??nh c??ng. Vui l??ng th??? l???i sau');
        return false;
      }
    }
    // N??ng c???p t??? kh??ch l??n gi??o vi??n thanh to??n onl
    const res = await axios.post(`${ip3}/user/nang-cap-user/thanh-toan-onl/dang-ky`, {
      vaiTro: checkVaiTro,
      donViId: values?.maLop,
    });
    if (res?.data?.statusCode === 201) {
      message.success(
        '???? g???i y??u c???u n??ng c???p t??i kho???n th??nh c??ng. Vui l??ng ?????i Hi???u Tr?????ng x??t duy???t y??u c???u.',
      );
      history.push('');
      return true;
    }
    message.error('???? x???y ra l???i');
    return false;
  };

  const vaiTro = [
    {
      value: 'PhuHuynh',
      label: 'Ph??? huynh',
    },
    {
      value: 'GiaoVien',
      label: 'Gi??o vi??n',
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
            B?????c 1: Ch???n h??nh th???c
          </Breadcrumb.Item>
          {step === 2 && <Breadcrumb.Item>B?????c 2: N??ng c???p t??i kho???n</Breadcrumb.Item>}
        </Breadcrumb>
      }
    >
      {step === 1 ? (
        <Row justify="center">
          <Col span={16}>
            <Form form={form} onFinish={onFinish} {...formItemLayout}>
              <Form.Item label="Vai tr??" name="vaiTro" rules={[...rules.required]}>
                <Select onChange={changeVaiTro} placeholder="Ch???n vai tr??">
                  {vaiTro?.map((item) => (
                    <Select.Option value={item?.value}>{item?.label}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <b>????? th???c hi???n n??ng c???p t??i kho???n h??y ch???n h??nh th???c thanh to??n d?????i ????y</b>
              <Col>
                <Form.Item name="hinhThuc" label="H??nh th???c thanh to??n" rules={[...rules.required]}>
                  <Select
                    placeholder="Ch???n h??nh th???c thanh to??n"
                    onChange={changeHinhThuc}
                    defaultValue={checkVaiTro === 'Gi??o vi??n' ? 'Nh???p code' : undefined}
                  >
                    <Select.Option value="Nh???p code">Nh???p code</Select.Option>
                    <Select.Option value="Thanh to??n tr???c tuy???n">
                      Thanh to??n tr???c tuy???n
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Form.Item>
                <Row justify="center" gutter={[16, 0]}>
                  {hinhThuc === 'Thanh to??n tr???c tuy???n' && checkVaiTro === 'PhuHuynh' && (
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
                        Thanh to??n
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
                      B?????c ti???p theo
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
          </Col>
          <Modal
            title="Danh s??ch g??i thanh to??n"
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
                  title: 'T??n g??i',
                  dataIndex: 'tenGoi',
                  align: 'center',
                  width: 200,
                },
                {
                  title: 'Th???i gian',
                  dataIndex: 'thoiGianGoi',
                  align: 'center',
                  width: 100,
                  render: (val) => `${val} th??ng`,
                },
                {
                  title: 'Gi?? ti???n',
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
                      L???a ch???n
                    </Button>
                  ),
                },
              ]}
            />
          </Modal>
          <Modal
            title="Th???c hi???n thanh to??n"
            visible={visibleCheckThanhToan}
            onCancel={() => {
              setVisibleCheckThanhToan(false);
            }}
            onOk={checkThanhToan}
            destroyOnClose
            okText="X??c nh???n"
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
              onFinish={hinhThuc === 'Thanh to??n tr???c tuy???n' ? onUpgrade : onFinish}
            >
              {hinhThuc === 'Nh???p code' && (
                <Col>
                  <Form.Item name="maCode" label="M?? code" rules={[...rules.required]}>
                    <Input placeholder="Nh???p m?? code" />
                  </Form.Item>
                </Col>
              )}
              {checkVaiTro === 'PhuHuynh' && (
                <>
                  <Col span={24}>
                    <Form.Item
                      name="conId"
                      style={{ marginBottom: 5 }}
                      label="Ch???n con"
                      rules={[...rules.required]}
                    >
                      <Select placeholder="Ch???n con" onChange={changeCon} allowClear>
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
              {hinhThuc === 'Thanh to??n tr???c tuy???n' && (
                <>
                  <Form.Item
                    name="maTruong"
                    rules={[...rules.required]}
                    style={{ marginBottom: 5 }}
                    label="Tr?????ng"
                  >
                    <Select
                      placeholder="Ch???n tr?????ng"
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
                  <Form.Item name="maLop" rules={[...rules.required]} label="L???p">
                    <Select
                      placeholder="Ch???n l???p"
                      showSearch
                      notFoundContent="Tr?????ng hi???n t???i ch??a c?? l???p n??o"
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
                          X??c nh???n n??ng c???p
                        </Button>
                      </Col>
                    </Row>
                  </Form.Item>
                </>
              )}
              {hinhThuc === 'Nh???p code' && (
                <Row justify="center">
                  <Col span={5}>
                    <Button type="primary" htmlType="submit">
                      X??c nh???n n??ng c???p
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
