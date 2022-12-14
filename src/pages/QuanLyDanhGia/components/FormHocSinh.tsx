/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import UploadAnh from '@/components/Upload/UploadAnh';
import styles from '@/pages/QuanLyKhaoSat/components/block.css';
import BlockQuestion from './BlockQuestion';
import { addFormDanhGia, updFormDanhGia } from '@/services/FormDanhGia/formdanhgia';
import { upload } from '@/services/UploadAnh/upload';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import rules from '@/utils/rules';
import { renderFileListUrl } from '@/utils/utils';
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Radio,
  Row,
  Select,
  Image,
  Spin,
  Checkbox,
  DatePicker,
  TimePicker,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import DaySelect from '@/pages/ThongBao/components/daySelect';
import { IResData } from '@/pages/ThongBao/components/Form';
import moment from 'moment';

const FormFormDanhGia = () => {
  const [form] = Form.useForm();
  const { edit, loading, record, setVisibleForm, getFormDanhGiaModel } = useModel('formdanhgia');
  const vaiTro = localStorage.getItem('vaiTro');
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [dsTruong, setDsTruong] = useState([]);
  const [dsLop, setDsLop] = useState([]);
  const [dsDonVi, setDsDonVi] = useState([]);
  const [idTruong, setIdTruong] = useState<string>();
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [disableSelectLop, setDisableSelectLop] = useState<string>(
    edit && record?.donViId?.[0] === '*'
      ? 'DisableSelectMulti'
      : edit && record?.donViId?.[0] !== '*'
      ? 'DisableSelectAll'
      : '',
  );
  const [dataRepeat, setDataRepeat] = useState<IResData>();
  const [selected, setSelected] = useState<'KHONG_LAP' | 'HANG_TUAN' | 'HANG_THANG'>('KHONG_LAP');
  const handleChangeSelectRepeat = (value: string) => {
    setSelected(value);
  };
  const onChangeCheckBox = (e: any) => {
    setIsRepeat(e.target.checked);
  };
  const handleChoseRepeat = (value: any, date: string) => {
    const obj: IResData = {
      repeat: selected,
      dayRepeat: date,
      thoiGianGuiTB: value.thoiGianGuiTB,
    };
    setDataRepeat(obj);
  };
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
  const handleCheckValidate = (data: any): boolean => {
    let check: boolean = false;
    if (Array.isArray(data)) {
      data.forEach((val: any, index) => {
        if (val?.cauTraLoi) {
          for (let i = 0; i < val?.cauTraLoi?.length - 1; ++i) {
            for (let j = i + 1; j < val?.cauTraLoi?.length; ++j) {
              if (val.cauTraLoi?.[i]?.luaChon == val.cauTraLoi?.[j]?.luaChon) {
                message.warn(`C??u tr??? l???i kh??ng th??? gi???ng nhau t???i c??u h???i ${index + 1}`);
                check = true;
              }
            }
          }
        }
        if (val?.hang && val?.cot) {
          for (let i = 0; i < val?.hang?.length - 1; ++i) {
            for (let j = i + 1; j < val?.hang?.length; ++j) {
              if (val?.hang?.[i] == val?.hang?.[j]) {
                message.warn(`B??? tr??ng h??ng t???i c??u h???i ${index + 1}`);
                check = true;
              }
            }
          }
          for (let i = 0; i < val?.cot?.length - 1; ++i) {
            for (let j = i + 1; j < val?.cot?.length; ++j) {
              if (val?.cot?.[i] == val?.cot?.[j]) {
                message.warn(`B??? tr??ng c???t t???i c??u h???i ${index + 1}`);
                check = true;
              }
            }
          }
        }
      });
    }
    return check;
  };
  const onFinish = async (values: any) => {
    let check: boolean = false;
    const newVal = values;
    if (values?.noiDungKhaoSat) {
      check = handleCheckValidate(values?.noiDungKhaoSat);
    }
    newVal.repeat = isRepeat ?? false;
    newVal.thoiGianBatDauDanhGia = moment(dataRepeat?.dayRepeat)
      .startOf('date')
      // .add(moment.duration(moment(dataRepeat?.thoiGianGuiTB).format('HH:mm')))
      .add(moment.duration(dataRepeat?.thoiGianGuiTB))
      .toDate();
    // console.log(
    //   'chose',
    //   moment(dataRepeat?.dayRepeat)
    //     .startOf('date')
    //     .add(moment.duration(dataRepeat?.thoiGianGuiTB))
    //     .format("HH:mm DD/MM/YYYY"),
    // );
    if (vaiTro === 'HieuTruong') {
      if (newVal?.donViId?.[0] === '*') {
        const arrDonViId: string[] = [];
        dsLop?.map((item: { _id: string }) => arrDonViId.push(item?._id));
        newVal.donViId = arrDonViId;
        newVal.donViTaoDanhGiaId = organizationId;
      }
    }
    if (vaiTro === 'GiaoVien') {
      newVal.donViId = [organizationId];
      newVal.donViTaoDanhGiaId = organizationId;
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
    if (!check) {
      // X??? l?? t???i img l??n
      if (newVal.anhDaiDien?.fileList?.length > 0 && !newVal.anhDaiDien?.fileList[0]?.url) {
        const result = await upload(newVal.anhDaiDien);
        newVal.anhDaiDien = result.data?.data?.url;
      } else {
        newVal.anhDaiDien = newVal.anhDaiDien?.fileList?.[0]?.url;
      }
      if (newVal.chuKy?.fileList?.length > 0 && !newVal.chuKy?.fileList[0]?.url) {
        const result = await upload(newVal.chuKy);
        newVal.chuKy = result.data?.data?.url;
      } else {
        newVal.chuKy = newVal.chuKy?.fileList?.[0]?.url;
      }
      if (edit) {
        try {
          setLoadingSubmit(true);
          const res = await updFormDanhGia({ ...newVal, id: record?._id });
          if (res?.status === 200) {
            message.success('C???p nh???t ????nh gi?? th??nh c??ng');
            setVisibleForm(false);
            getFormDanhGiaModel();
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
        const res = await addFormDanhGia({ ...newVal });
        if (res?.status === 201) {
          message.success('T???o ????nh gi?? th??nh c??ng');
          setVisibleForm(false);
          getFormDanhGiaModel();
          setLoadingSubmit(false);
          return true;
        }
      } catch (error) {
        message.error('T???o ????nh gi?? kh??ng th??nh c??ng');
        setLoadingSubmit(false);
      }
      return true;
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const [typeDate, setTypeDate] = useState<string>();
  const [isDate, setIsDate] = useState<boolean>(false);
  const onChangeRating = (value: 'Ng??y' | 'Tu???n' | 'Th??ng') => {
    switch (value) {
      case 'Ng??y':
        setIsDate(true);
        setSelected('KHONG_LAP');
        setTypeDate('date');
        break;
      case 'Th??ng':
        setIsDate(true);
        setSelected('HANG_THANG');
        setTypeDate('month');
        break;
      case 'Tu???n':
        setIsDate(false);
        setSelected('HANG_TUAN');
        setTypeDate('date');
        break;
    }
  };
  const onChangeDate = (date: any, dateString: string) => {
    console.log('date', date);
    console.log('date string', dateString);
  };
  const onChangeTime = (time: any) => {
    console.log('time', time);
  };
  useEffect(() => {
    if (record?.dotDanhGia) {
      onChangeRating(record?.dotDanhGia);
    }
  }, [record]);
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
            <Input placeholder="Ti??u ?????" disabled={record?.repeat} />
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
          <Row gutter={[20, 0]}>
            <Col xs={24} sm={12} md={12}>
              <Form.Item
                name="dotDanhGia"
                label="?????t ????nh gi??"
                rules={[...rules.required]}
                initialValue={record?.dotDanhGia}
                style={{ marginBottom: 5 }}
              >
                <Select
                  placeholder="Ch???n ?????t ????nh gi??"
                  onChange={onChangeRating}
                  disabled={record?.repeat}
                >
                  {['Ng??y', 'Tu???n', 'Th??ng']?.map((item, index) => (
                    <Select.Option key={index} value={item}>
                      {item}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="repeat"
                // label="L???p l???i"
                // rules={[...rules.required]}
                valuePropName="checked"
                initialValue={record?.repeat}
                style={{ marginBottom: 5 }}
              >
                <Checkbox onChange={onChangeCheckBox} disabled={record?.repeat}>
                  L???p l???i
                </Checkbox>
              </Form.Item>
              {selected && (
                <DaySelect
                  type={selected}
                  handleChoseData={handleChoseRepeat}
                  notMultiple={true}
                  isRequire={true}
                  initTimeStartValue={record?.thoiGianBatDauDanhGia}
                  disable={record?.repeat}
                  titleWeek={'Ch???n ng??y b???t ?????u ????nh gi?? trong tu???n:'}
                  titleMonth={'Ch???n ng??y b???t ?????u ????nh gi?? trong th??ng:'}
                  titleTime={'Th???i gian b???t ?????u ????nh gi??:'}
                />
              )}
              {/*<div style={{ marginRight: '16px' }}>*/}
              {/*  {((!isDate && typeDate) || (isDate && typeDate === 'month')) && (*/}
              {/*    <Form.Item name="day" rules={[...rules.required]}>*/}
              {/*      {typeDate==='month'? <DatePicker*/}
              {/*        format="YYYY-MM"*/}
              {/*        onChange={onChangeDate}*/}
              {/*        disabledDate={(current) => {*/}
              {/*          return current && current <= moment().startOf('week');*/}
              {/*        }}*/}
              {/*        picker={'month'}*/}
              {/*      />:  <DatePicker*/}
              {/*        showTime*/}
              {/*        format="YYYY-MM-DD HH:mm"*/}
              {/*        onChange={onChangeDate}*/}
              {/*        disabledDate={(current) => {*/}
              {/*          return current && current <= moment().startOf('week');*/}
              {/*        }}*/}
              {/*        picker={typeDate}*/}
              {/*      />*/}
              {/*      }*/}

              {/*    </Form.Item>*/}
              {/*  )}*/}
              {/*</div>*/}

              {/*{isDate && (*/}
              {/*  <Form.Item name="time" rules={[...rules.required]}>*/}
              {/*    <TimePicker onChange={onChangeTime} format={'HH:mm'} />*/}
              {/*  </Form.Item>*/}
              {/*)}*/}
            </Col>
            <Col xs={24} sm={12} md={12}>
              <Form.Item
                name="trangThai"
                label="K??ch ho???t"
                initialValue={record?.trangThai ?? true}
                style={{ marginBottom: 5 }}
              >
                <Radio.Group>
                  <Radio value={true}>C??</Radio>
                  <Radio value={false}>Kh??ng</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[20, 0]}>
            {vaiTro !== 'HieuTruong' && vaiTro !== 'GiaoVien' && (
              <Col xs={24} sm={12} md={12}>
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
            <Col xs={12} sm={6} md={6}>
              <Form.Item
                name="chuKy"
                label="Ch??? k??"
                // rules={[...rules.fileRequired]}
                style={{ marginBottom: 5 }}
                initialValue={edit ? renderFileListUrl(record?.chuKy) : undefined}
              >
                {edit ? (
                  <Avatar shape="square" size={100} src={<Image src={record?.chuKy} />} />
                ) : (
                  <UploadAnh />
                )}
              </Form.Item>
            </Col>
            <Col xs={12} sm={6} md={6}>
              <Form.Item
                name="anhDaiDien"
                label="???nh m?? t???"
                // rules={[...rules.fileRequired]}
                style={{ marginBottom: 5 }}
                initialValue={edit ? renderFileListUrl(record?.anhDaiDien) : undefined}
              >
                {edit ? (
                  <Avatar shape="square" size={100} src={<Image src={record?.anhDaiDien} />} />
                ) : (
                  <UploadAnh />
                )}
              </Form.Item>
            </Col>
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

          <br />
          <Form.List
            name="noiDungKhaoSat"
            initialValue={record?.noiDungKhaoSat ?? []}
            rules={[
              {
                validator: async (_, names) => {
                  if (!names || names.length < 1) {
                    return Promise.reject(new Error('??t nh???t 1 c??u h???i'));
                  }
                  return '';
                },
              },
            ]}
          >
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
                        <BlockQuestion index={index} block={field.name} />
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
export default FormFormDanhGia;
