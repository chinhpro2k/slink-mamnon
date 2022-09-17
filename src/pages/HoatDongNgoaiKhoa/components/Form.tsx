/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import DiaChi from '@/components/DiaChi';
import UploadMultiAnh from '@/components/Upload/UploadMultiAnh';
import {
  addHoatDongNgoaiKhoa,
  updHoatDongNgoaiKhoa,
} from '@/services/HoatDongNgoaiKhoa/hoatdongngoaikhoa';
import { uploadMultiPic } from '@/services/UploadMulti/uploadMulti';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import rules from '@/utils/rules';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Spin,
  TimePicker,
} from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { useModel } from 'umi';

// Xử lý upload nhiều ảnh
const UploadFile = async (values: any) => {
  if (values && !values?.fileList) {
    values = Object.values(values);
  }
  const file: any[] = [];
  const fileUrl: any[] = [];
  if (values?.length > 0) {
    values?.forEach((item: { originFileObj: any; url: string; type: string; name: string }) => {
      if (item.originFileObj) file.push(item?.originFileObj);
      else
        fileUrl.push({
          url: item?.url,
          mimetype: item?.type,
          filename: item?.name,
        });
    });
    const result = await uploadMultiPic(file);
    values = [
      ...fileUrl,
      ...(result.data?.data?.map(
        (item: { url: string; file: { mimetype: string; filename: string } }) => {
          return {
            url: item?.url,
            mimetype: item?.file?.mimetype,
            filename: item?.file?.filename,
          };
        },
      ) ?? []),
    ];
  } else {
    values = [];
  }
  return values;
};

// Check thời gian trước và sau
const rulesTime = (valStart: any, valEnd: any, textStart: string, textEnd: string) => {
  const hourBatDau = parseInt(moment(valStart).format('HH'), 10);
  const minBatDau = parseInt(moment(valStart).format('mm'), 10);
  const hourDongCua = parseInt(moment(valEnd).format('HH'), 10);
  const minDongCua = parseInt(moment(valEnd).format('mm'), 10);

  const checkTime = hourBatDau * 60 + minBatDau - hourDongCua * 60 - minDongCua;
  if (checkTime >= 0) {
    message.error(`${textStart} không được sau ${textEnd}`);
    return false;
  }
  return true;
};

const FormHoatDongNgoaiKhoa = () => {
  const [form] = Form.useForm();
  const { edit, loading, record, setVisibleForm, getHoatDongNgoaiKhoaModel, setLoading } =
    useModel('hoatdongngoaikhoa');
  const [dsLop, setDSLop] = useState([]);
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [idDonViToChuc, setIdDonViToChuc] = useState<string>();
  const [disableSelectLop, setDisableSelectLop] = useState<string>(
    edit && record?.donViId?.[0] === '*'
      ? 'DisableSelectMulti'
      : edit && record?.donViId?.[0] !== '*'
      ? 'DisableSelectAll'
      : '',
  );
  const { tenTinh, tenPhuongXa, tenQuanHuyen } = useModel('donvihanhchinh');
  const { danhSach: danhSachTruong, getTruongModel } = useModel('truong');
  const vaiTro = localStorage.getItem('vaiTro');

  const getLop = async (idDonVi?: string) => {
    const result = await axios.get(`${ip3}/don-vi/pageable/my/child?page=1&limit=100`, {
      params: { cond: { parent: idDonVi, loaiDonVi: 'Lop' } },
    });
    const arrLop: any = [];
    arrLop.push(...result?.data?.data?.result);
    setDSLop(arrLop);
  };

  React.useEffect(() => {
    if (idDonViToChuc || organizationId) getLop(idDonViToChuc ?? organizationId);
  }, [idDonViToChuc]);
  React.useEffect(() => {
    if (edit && record?.donViToChucId) getLop(record?.donViToChucId);
  }, [record?.donViToChucId]);

  React.useEffect(() => {
    if (vaiTro === 'Admin' || vaiTro === 'SuperAdmin') getTruongModel();
  }, []);

  const changDonViToChuc = (val: string) => {
    setIdDonViToChuc(val);
    form.setFieldsValue({
      donViId: undefined,
    });
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

  const arrFiles: {
    fileList: { name: string; url: string; status: string; size: number; type: string }[];
  } = {
    fileList:
      record?.files?.map((item: any) => {
        return {
          name: item?.filename,
          url: item?.url,
          status: 'done',
          size: 123,
          type: item?.mimetype,
        };
      }) ?? [],
  };

  const onFinish = async (values: any) => {
    const newVal = values;
    // Check thời gian bắt đầu không lớn hơn thời gian kết thúc
    if (values?.diemDanhDauGio) {
      if (
        !rulesTime(
          values?.diemDanhDauGio?.gioBatDau,
          values?.diemDanhDauGio?.gioKetThuc,
          'Thời gian bắt đầu điểm danh đầu giờ',
          'Thời gian kết thúc',
        )
      )
        return false;
      values.diemDanhDauGio.gioBatDau = moment(values?.diemDanhDauGio?.gioBatDau).format('HH:mm');
      values.diemDanhDauGio.gioKetThuc = moment(values?.diemDanhDauGio?.gioKetThuc).format('HH:mm');
    }

    if (values?.diemDanhCuoiGio) {
      if (
        !rulesTime(
          values?.diemDanhCuoiGio?.gioBatDau,
          values?.diemDanhCuoiGio?.gioKetThuc,
          'Thời gian bắt đầu điểm danh cuối giờ',
          'Thời gian kết thúc',
        )
      )
        return false;
      values.diemDanhCuoiGio.gioBatDau = moment(values?.diemDanhCuoiGio?.gioBatDau).format('HH:mm');
      values.diemDanhCuoiGio.gioKetThuc = moment(values?.diemDanhCuoiGio?.gioKetThuc).format(
        'HH:mm',
      );
    }

    if (values?.diemDanhDauGio && values?.diemDanhCuoiGio) {
      if (
        !rulesTime(
          moment(values?.diemDanhDauGio?.gioKetThuc, 'HH:mm'),
          moment(values?.diemDanhCuoiGio?.gioBatDau, 'HH:mm'),
          'Thời gian bắt đầu điểm danh cuối giờ',
          'Thời gian kết thúc điểm danh đầu giờ',
        )
      )
        return false;
    }
    if (values?.thoiGianDuKien?.[0] && values?.thoiGianDangKy?.[1]) {
      if (moment(values?.thoiGianDangKy?.[1]).isAfter(moment(values?.thoiGianDuKien?.[0])))
        return message.error(
          'Thời gian kết thúc đăng ký không được sau thời gian dự kiến bắt đầu ngoại khóa',
        );
    }

    if (vaiTro === 'HieuTruong') {
      newVal.donViToChucId = organizationId;
      if (newVal.donViId[0] === '*') {
        const arrDonViId: string[] = [];
        dsLop?.map((item: { _id: string }) => arrDonViId.push(item?._id));
        newVal.donViId = arrDonViId;
      }
    }
    newVal.thoiGianDuKien = {
      thoiGianBatDau: newVal?.thoiGianDuKien?.[0] ?? newVal?.thoiGianDuKien?.thoiGianBatDau,
      thoiGianKetThuc: newVal?.thoiGianDuKien?.[1] ?? newVal?.thoiGianDuKien?.thoiGianKetThuc,
    };
    newVal.thoiGianDangKy = {
      thoiGianBatDau: newVal?.thoiGianDangKy?.[0] ?? newVal?.thoiGianDangKy?.thoiGianBatDau,
      thoiGianKetThuc: newVal?.thoiGianDangKy?.[1] ?? newVal?.thoiGianDangKy?.thoiGianKetThuc,
    };
    // Xử lý tải img lên
    if (newVal?.files?.fileList) {
      const dataImages = await UploadFile(newVal?.files?.fileList);
      newVal.files = dataImages;
    } else if (newVal?.files && !newVal?.files?.fileList) {
      const dataImages = await UploadFile(newVal?.files);
      newVal.files = dataImages;
    }
    newVal.diaDiem.tenTinh = tenTinh ?? record?.diaDiem?.tenTinh;
    newVal.diaDiem.tenQuanHuyen = tenQuanHuyen ?? record?.diaDiem?.tenQuanHuyen;
    newVal.diaDiem.tenPhuongXa = tenPhuongXa ?? record?.diaDiem?.tenPhuongXa;
    if (edit) {
      try {
        const res = await updHoatDongNgoaiKhoa({
          ...values,
          id: record?._id,
        });
        setLoading(true);
        if (res?.data?.statusCode === 200) {
          message.success('Cập nhật thành công');
          getHoatDongNgoaiKhoaModel();
          setVisibleForm(false);
          setLoading(false);
          return true;
        }
      } catch (error) {
        message.error('Đã xảy ra lỗi');
        setLoading(false);
        return false;
      }
    }
    try {
      const res = await addHoatDongNgoaiKhoa({ ...values });
      setLoading(true);
      if (res?.data?.statusCode === 201) {
        message.success('Thêm mới thành công');
        getHoatDongNgoaiKhoaModel();
        setVisibleForm(false);
        setLoading(false);
        return true;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      setLoading(false);
      return false;
    }
    return true;
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Spin spinning={loading}>
        <Form
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          labelCol={{ span: 24 }}
          form={form}
        >
          <Row gutter={[16, 0]}>
            <Col xl={24} xs={24}>
              <Form.Item
                name="tenHoatDong"
                label="Tên hoạt động"
                rules={[...rules.required, ...rules.length(100)]}
                initialValue={record?.tenHoatDong}
                style={{ marginBottom: 5 }}
              >
                <Input placeholder="Nhập tên hoạt động" />
              </Form.Item>
            </Col>
          </Row>
          {!edit && (
            <Row gutter={[16, 0]}>
              <Col xl={12} xs={12}>
                <Form.Item
                  name="loaiLap"
                  label="Lặp lại"
                  initialValue={record?.loaiLap}
                  style={{ marginBottom: 5 }}
                >
                  <Select placeholder="Chọn thời gian lặp lại">
                    <Select.Option value="day">Ngày</Select.Option>
                    <Select.Option value="week">Tuần</Select.Option>
                    <Select.Option value="month">Tháng</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={12} xs={12}>
                <Form.Item
                  name="soLanLap"
                  label="Số lần lặp"
                  initialValue={record?.soLanLap}
                  style={{ marginBottom: 5 }}
                >
                  <InputNumber placeholder="Nhập số lần lặp" min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          )}
          <Form.Item label="Địa điểm" required>
            <DiaChi
              initialValue={edit ? record?.diaDiem : undefined}
              form={form}
              fields={{
                tinh: ['diaDiem', 'maTinh'],
                quanHuyen: ['diaDiem', 'maQuanHuyen'],
                xaPhuong: ['diaDiem', 'maPhuongXa'],
                diaChiCuThe: ['diaDiem', 'soNhaTenDuong'],
              }}
            />
          </Form.Item>
          <Row gutter={[16, 0]}>
            <Col xl={16} xs={24}>
              <Form.Item
                name="thoiGianDangKy"
                label="Thời gian đăng ký"
                rules={[
                  {
                    validator: (ece, value, callback) => {
                      if (!value || !value.length || !value[0]) {
                        callback('');
                      }
                      callback();
                    },
                    message: 'Hãy chọn thời gian đăng ký',
                  },
                  ...rules.required,
                ]}
                initialValue={[
                  record?.thoiGianDangKy?.thoiGianBatDau
                    ? moment(record?.thoiGianDangKy?.thoiGianBatDau)
                    : undefined,
                  record?.thoiGianDangKy?.thoiGianKetThuc
                    ? moment(record?.thoiGianDangKy?.thoiGianKetThuc)
                    : undefined,
                ]}
                style={{ marginBottom: 5 }}
              >
                <DatePicker.RangePicker
                  showTime={{
                    hideDisabledOptions: true,
                    defaultValue: [moment('06:00', 'HH:mm'), moment('20:00', 'HH:mm')],
                  }}
                  placeholder={['Thời gian bắt đầu', 'Thời gian kết thúc']}
                  format="HH:mm DD-MM-YYYY"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col xl={8} xs={24}>
              <Form.Item
                name="chiPhiDuKien"
                label="Chi phí dự kiến"
                rules={[...rules.required, ...rules.float(undefined, 0, 0)]}
                initialValue={record?.chiPhiDuKien}
                style={{ marginBottom: 5 }}
              >
                <InputNumber
                  placeholder="Chi phí dự kiến"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  style={{ width: '100%' }}
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="files"
            label="Ảnh"
            initialValue={edit ? (record?.files?.[0] ? arrFiles : undefined) : undefined}
          >
            <UploadMultiAnh
              otherProps={{
                multiple: true,
                accept: 'image/*',
              }}
            />
          </Form.Item>
          <Form.Item
            name="thoiGianDuKien"
            label="Thời gian dự kiến"
            rules={[
              {
                validator: (ece, value, callback) => {
                  if (!value || !value.length || !value[0]) {
                    callback('');
                  }
                  callback();
                },
                message: 'Hãy chọn thời gian dự kiến',
              },
              ...rules.required,
            ]}
            initialValue={[
              record?.thoiGianDuKien?.thoiGianBatDau
                ? moment(record?.thoiGianDuKien?.thoiGianBatDau)
                : undefined,
              record?.thoiGianDuKien?.thoiGianKetThuc
                ? moment(record?.thoiGianDuKien?.thoiGianKetThuc)
                : undefined,
            ]}
            style={{ marginBottom: 5 }}
          >
            <DatePicker.RangePicker
              showTime={{
                hideDisabledOptions: true,
                defaultValue: [moment('06:00', 'HH:mm'), moment('20:00', 'HH:mm')],
              }}
              placeholder={['Thời gian bắt đầu', 'Thời gian kết thúc']}
              format="HH:mm DD-MM-YYYY"
              style={{ width: '100%' }}
            />
          </Form.Item>
          {(vaiTro === 'Admin' || vaiTro === 'SuperAdmin') && (
            <Col span={24}>
              <Form.Item
                name="donViToChucId"
                label="Đơn vị tổ chức"
                rules={[...rules.required]}
                style={{ marginBottom: 5 }}
                initialValue={record?.donViToChucId}
              >
                <Select
                  placeholder="Chọn đơn vị tổ chức"
                  onChange={changDonViToChuc}
                  filterOption={(input, option: any) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
                  optionFilterProp="children"
                >
                  {danhSachTruong?.map((item: any) => (
                    <Select.Option key={item?._id} value={item?._id}>
                      {item?.tenDonVi}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}

          <Row gutter={[16, 0]}>
            <Col span={24}>
              <Form.Item
                name="donViId"
                label="Lớp"
                rules={[...rules.required]}
                initialValue={record?.donViId}
              >
                <Select
                  onChange={changeDisable}
                  mode="multiple"
                  placeholder="Chọn lớp"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option: any) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {dsLop?.length > 0 && (
                    <Select.Option
                      key="1"
                      value="*"
                      disabled={disableSelectLop === 'DisableSelectAll'}
                    >
                      Tất cả các lớp
                    </Select.Option>
                  )}

                  {dsLop?.map((item: { _id: string; tenDonVi: string }) => (
                    <Select.Option
                      key={item?._id}
                      value={item?._id}
                      disabled={disableSelectLop === 'DisableSelectMulti'}
                    >
                      {item?.tenDonVi}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 0]}>
            <Col xl={12} sm={24}>
              <div style={{ marginBottom: 5 }}>Điểm danh đầu giờ</div>
              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <Form.Item
                    name={['diemDanhDauGio', 'gioBatDau']}
                    label="Bắt đầu"
                    rules={[...rules.required]}
                    initialValue={
                      edit ? moment(record?.diemDanhDauGio?.gioBatDau, 'HH:mm') : undefined
                    }
                  >
                    <TimePicker
                      placeholder="Thời gian bắt đầu"
                      format="HH:mm"
                      disabledHours={() => [0, 1, 2, 3, 4, 5, 21, 22, 23]}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={['diemDanhDauGio', 'gioKetThuc']}
                    label="Kết thúc"
                    rules={[...rules.required]}
                    initialValue={
                      edit ? moment(record?.diemDanhDauGio?.gioKetThuc, 'HH:mm') : undefined
                    }
                  >
                    <TimePicker
                      placeholder="Thời gian kết thúc"
                      format="HH:mm"
                      disabledHours={() => [0, 1, 2, 3, 4, 5, 21, 22, 23]}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col xl={12} sm={24}>
              <div style={{ marginBottom: 5 }}>Điểm danh cuối giờ</div>
              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <Form.Item
                    name={['diemDanhCuoiGio', 'gioBatDau']}
                    label="Bắt đầu"
                    rules={[...rules.required]}
                    initialValue={
                      edit ? moment(record?.diemDanhCuoiGio?.gioBatDau, 'HH:mm') : undefined
                    }
                    style={{ marginBottom: 5 }}
                  >
                    <TimePicker
                      placeholder="Thời gian bắt đầu"
                      format="HH:mm"
                      disabledHours={() => [0, 1, 2, 3, 4, 5, 21, 22, 23]}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={['diemDanhCuoiGio', 'gioKetThuc']}
                    label="Kết thúc"
                    rules={[...rules.required]}
                    initialValue={
                      edit ? moment(record?.diemDanhCuoiGio?.gioKetThuc, 'HH:mm') : undefined
                    }
                    style={{ marginBottom: 5 }}
                  >
                    <TimePicker
                      placeholder="Thời gian kết thúc"
                      format="HH:mm"
                      disabledHours={() => [0, 1, 2, 3, 4, 5, 21, 22, 23]}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
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
};
export default FormHoatDongNgoaiKhoa;
