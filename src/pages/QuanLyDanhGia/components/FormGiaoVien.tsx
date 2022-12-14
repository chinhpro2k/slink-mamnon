/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import styles from '@/pages/QuanLyKhaoSat/components/block.css';
import { addDanhGiaGiaoVien, updDanhGiaGiaoVien } from '@/services/QuanLyDanhGia/quanlydanhgia';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import rules from '@/utils/rules';
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Form, Input, message, Row, Select, Spin } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { useModel } from 'umi';
import BlockQuestion from './BlockQuestion';

const DanhGiaGiaoVien = () => {
  const [form] = Form.useForm();
  const { edit, loading, record, setVisibleForm, getQuanLyDanhGiaModel } =
    useModel('quanlydanhgia');
  const vaiTro = localStorage.getItem('vaiTro');
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [dsTruong, setDsTruong] = useState([]);
  const [dsLop, setDsLop] = useState([]);
  const [dsDonVi, setDsDonVi] = useState([]);
  const [idTruong, setIdTruong] = useState<string>();
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [disableSelectLop, setDisableSelectLop] = useState<string>(
    edit && record?.donViId?.[0] === '*'
      ? 'DisableSelectMulti'
      : edit && record?.donViId?.[0] !== '*'
      ? 'DisableSelectAll'
      : '',
  );

  const getTruong = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=100`);
    setDsDonVi(result?.data?.data?.result);
    const arrTruong: any = [];
    result?.data?.data?.result?.map((item: { loaiDonVi: string }) =>
      item?.loaiDonVi === 'Truong' ? arrTruong.push(item) : undefined,
    );
    setDsTruong(arrTruong);
  };

  const getLop = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable/my/child?page=1&limit=1000`, {
      params: {
        cond: {
          loaiDonVi: 'Lop',
          parent: record?.donViTaoDanhGiaId,
        },
      },
    });
    setDsLop(result?.data?.data?.result);
  };

  React.useEffect(() => {
    getTruong();
    if (vaiTro === 'HieuTruong' || edit) getLop();
  }, []);

  const changeIdTruong = (val: string) => {
    setIdTruong(val);
    form.setFieldsValue({
      donViId: undefined,
      loaiLop: undefined,
    });
    const arrLop: any = [];
    dsDonVi?.map((item: { parent: string }) =>
      item?.parent === val ? arrLop.push(item) : undefined,
    );
    setDsLop(arrLop);
    setDisableSelectLop('');
  };

  const changeDisable = (val: string[]) => {
    if (val?.length === 0) {
      setDisableSelectLop('');
    } else {
      val?.map((item) =>
        item === '*'
          ? setDisableSelectLop('DisableSelectMulti')
          : setDisableSelectLop('DisableSelectAll'),
      );
    }
  };

  const onFinish = async (values: any) => {
    const newVal = values;

    if (vaiTro === 'HieuTruong') {
      if (newVal?.donViId?.[0] === '*') {
        const arrDonViId: string[] = [];
        dsLop?.map((item: { _id: string }) => arrDonViId.push(item?._id));
        newVal.donViId = arrDonViId;
        newVal.donViTaoDanhGiaId = organizationId;
      }
    }

    // x??? l?? ph???n isKhac
    for (let i = 0; i <= newVal?.noiDungKhaoSat?.length; i += 1) {
      if (newVal?.noiDungKhaoSat?.[i]?.isKhac && !edit) {
        newVal.noiDungKhaoSat[i]?.cauTraLoi.push({ isKhac: true });
      } else if (
        edit &&
        newVal.noiDungKhaoSat[i]?.isKhac &&
        !newVal.noiDungKhaoSat[i]?.cauTraLoi?.find((item: { isKhac: boolean }) => item?.isKhac)
      ) {
        newVal.noiDungKhaoSat[i]?.cauTraLoi.push({ isKhac: true });
      } else if (edit && !newVal.noiDungKhaoSat[i]?.isKhac) {
        newVal.noiDungKhaoSat[i]?.cauTraLoi?.find(
          (item: { isKhac: boolean }, index: number) =>
            item?.isKhac && newVal.noiDungKhaoSat[i]?.cauTraLoi.splice(index, 1),
        );
      }
    }

    newVal.ngayBatDau = newVal?.thoiGianDanhGia?.[0] ?? newVal?.ngayBatDau;
    newVal.ngayKetThuc = newVal?.thoiGianDanhGia?.[1] ?? newVal?.ngayKetThuc;

    if (edit) {
      try {
        setLoadingSubmit(true);
        const res = await updDanhGiaGiaoVien({ ...newVal, id: record?._id });
        if (res?.status === 200) {
          message.success('C???p nh???t ????nh gi?? th??nh c??ng');
          setVisibleForm(false);
          getQuanLyDanhGiaModel();
          setLoadingSubmit(false);
          return true;
        }
      } catch (error) {
        message.error('C???p nh???t ????nh gi?? kh??ng th??nh c??ng');
        setLoadingSubmit(false);
        return false;
      }
    }
    try {
      setLoadingSubmit(true);
      const res = await addDanhGiaGiaoVien({ ...newVal });
      if (res?.status === 201) {
        message.success('T???o ????nh gi?? th??nh c??ng');
        setVisibleForm(false);
        getQuanLyDanhGiaModel();
        setLoadingSubmit(false);
        return true;
      }
    } catch (error) {
      message.error('T???o ????nh gi?? kh??ng th??nh c??ng');
      setLoadingSubmit(false);
    }
    return true;
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Card title={edit ? 'Ch???nh s???a' : 'Th??m m???i'}>
      <Spin spinning={loadingSubmit}>
        <Form
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          labelCol={{ span: 24 }}
          form={form}
        >
          <Form.Item
            name="tieuDe"
            label="Ti??u ????? form ????nh gi??"
            rules={[...rules.required, ...rules.text, ...rules.length(100)]}
            initialValue={record?.tieuDe}
            style={{ marginBottom: 5 }}
          >
            <Input placeholder="Ti??u ?????" />
          </Form.Item>
          <Form.Item
            name="moTa"
            label="M?? t???"
            rules={[...rules.length(255)]}
            initialValue={record?.moTa}
            style={{ marginBottom: 5 }}
          >
            <Input.TextArea rows={3} placeholder="M?? t???" />
          </Form.Item>
          <Form.Item
            name="thoiGianDanhGia"
            label="Th???i gian ????nh gi??"
            rules={[
              {
                validator: (ece, value, callback) => {
                  if (!value || !value.length || !value[0]) {
                    callback('');
                  }
                  callback();
                },
                message: 'H??y ch???n th???i gian ????nh gi??',
              },
              ...rules.required,
            ]}
            initialValue={[
              record?.ngayBatDau ? moment(record?.ngayBatDau) : undefined,
              record?.ngayKetThuc ? moment(record?.ngayKetThuc) : undefined,
            ]}
            style={{ marginBottom: 5 }}
          >
            <DatePicker.RangePicker
              placeholder={['Th???i gian b???t ?????u', 'Th???i gian k???t th??c']}
              format="DD-MM-YYYY"
              style={{ width: '100%' }}
              ranges={{
                'H??m nay': [moment(), moment()],
                'Th??ng n??y': [moment().startOf('month'), moment().endOf('month')],
              }}
            />
          </Form.Item>
          <Form.Item
            name="noiDungCamKet"
            label="N???i dung cam k???t"
            rules={[...rules.required]}
            style={{ marginBottom: 5 }}
            initialValue={record?.noiDungCamKet}
          >
            <Input placeholder="N???i dung cam k???t" />
          </Form.Item>
          <Row gutter={[20, 0]}>
            {vaiTro !== 'HieuTruong' && vaiTro !== 'GiaoVien' && (
              <Col span={24}>
                <Form.Item
                  rules={[...rules.required]}
                  name="donViTaoDanhGiaId"
                  label="Tr?????ng"
                  initialValue={record?.donViTaoDanhGiaId}
                  style={{ marginBottom: 5 }}
                >
                  <Select
                    placeholder="Ch???n tr?????ng"
                    optionFilterProp="children"
                    showSearch
                    allowClear
                    onChange={changeIdTruong}
                    filterOption={(input, option: any) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {dsTruong?.map((item: { tenDonVi: string; _id: string }) => (
                      <Select.Option value={item?._id}>{item?.tenDonVi}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            )}
          </Row>

          {(idTruong || vaiTro === 'HieuTruong' || record?.donViId) && (
            <Form.Item
              label="Danh s??ch l???p l??m ????nh gi??"
              name="donViId"
              rules={[...rules.required]}
              style={{ marginBottom: 5 }}
              initialValue={record?.donViId}
            >
              <Select
                showSearch
                allowClear
                onChange={changeDisable}
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Ch???n l???p l??m ????nh gi??"
                optionFilterProp="children"
                filterOption={(input, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {dsLop?.length > 0 && (
                  <Select.Option value="*" disabled={disableSelectLop === 'DisableSelectAll'}>
                    T???t c??? c??c l???p
                  </Select.Option>
                )}
                {dsLop?.map((item: { tenDonVi: string; _id: string }) => (
                  <Select.Option
                    key={item?._id}
                    disabled={disableSelectLop === 'DisableSelectMulti'}
                    value={item?._id}
                  >
                    {item?.tenDonVi}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name={['chamDiem', 'cauHoi']}
            label="N???i dung c??u h???i"
            rules={[...rules.required]}
            style={{ marginBottom: 5 }}
            initialValue={record?.chamDiem?.cauHoi}
          >
            <Input placeholder="N???i dung c??u h???i" />
          </Form.Item>
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                name={['chamDiem', 'diemToiThieu']}
                style={{ marginBottom: 0 }}
                label="T???"
                initialValue={record?.chamDiem?.diemToiThieu}
              >
                <Select placeholder="Ch???n gi?? tr??? nh??? nh???t" defaultValue={1} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="?????n"
                name={['chamDiem', 'diemToiDa']}
                style={{ marginBottom: 0 }}
                initialValue={record?.chamDiem?.diemToiDa}
              >
                <Select placeholder="Ch???n gi?? tr??? l???n nh???t" defaultValue={5} disabled />
              </Form.Item>
            </Col>
          </Row>

          <br />
          <Form.List name="noiDungKhaoSat" initialValue={record?.noiDungKhaoSat ?? []}>
            {(fields, { add, remove }, { errors }) => {
              return (
                <>
                  {fields.map((field, index) => (
                    <div key={field.key}>
                      <Card
                        className={styles.block}
                        title={
                          <>
                            <div style={{ float: 'left' }}>C??u h???i {index + 1}</div>
                            <CloseCircleOutlined
                              style={{ float: 'right' }}
                              onClick={() => remove(field.name)}
                            />
                          </>
                        }
                      >
                        <BlockQuestion index={index} block={field.name} form="GiaoVien" />
                      </Card>
                      <br />
                    </div>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      style={{ width: '100%' }}
                      icon={<PlusOutlined />}
                    >
                      Th??m c??u h???i
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              );
            }}
          </Form.List>
          <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
            <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
              {!edit ? 'Th??m m???i' : 'L??u'}
            </Button>
            <Button onClick={() => setVisibleForm(false)}>????ng</Button>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
};
export default DanhGiaGiaoVien;
