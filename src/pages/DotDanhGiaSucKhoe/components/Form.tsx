/* eslint-disable no-underscore-dangle */
import {
  addDotDanhGiaSucKhoe,
  updDotDanhGiaSucKhoe,
} from '@/services/DotDanhGiaSucKhoe/dotdanhgiasuckhoe';
import rules from '@/utils/rules';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Row,
  Select,
  Spin,
} from 'antd';
import moment from 'moment';
import React from 'react';
import { useModel } from 'umi';

const FormDotDanhGiaSucKhoe = () => {
  const [form] = Form.useForm();
  const { edit, loading, record, setVisibleForm, getDotDanhGiaSucKhoeModel, setLoading } =
    useModel('dotdanhgiasuckhoe');
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const { danhSach: danhSachTruong, getTruongModel } = useModel('truong');
  const vaiTro = localStorage.getItem('vaiTro');

  React.useEffect(() => {
    getTruongModel();
  }, []);

  const onFinish = async (values: any) => {
    const newVal = values;
    newVal.thoiGianDanhGia = {
      thoiGianBatDau: newVal?.thoiGianDanhGia?.[0] ?? newVal?.thoiGianDanhGia?.thoiGianBatDau,
      thoiGianKetThuc: newVal?.thoiGianDanhGia?.[1] ?? newVal?.thoiGianDanhGia?.thoiGianKetThuc,
    };
    if (vaiTro === 'HieuTruong') {
      newVal.donViId = organizationId;
    }

    if (edit) {
      try {
        const res = await updDotDanhGiaSucKhoe({
          ...newVal,
          id: record?._id,
        });
        setLoading(true);
        if (res?.data?.statusCode === 200) {
          message.success('Cập nhật thành công');
          getDotDanhGiaSucKhoeModel();
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
      const res = await addDotDanhGiaSucKhoe({ ...newVal });
      setLoading(true);
      if (res?.data?.statusCode === 201) {
        message.success('Thêm mới thành công');
        getDotDanhGiaSucKhoeModel();
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
                name="ten"
                label="Tên đợt"
                rules={[...rules.required, ...rules.length(100)]}
                initialValue={record?.ten}
                style={{ marginBottom: 5 }}
              >
                <Input placeholder="Nhập tên đợt" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="moTa"
            label="Mô tả"
            rules={[...rules.length(255)]}
            initialValue={record?.moTa}
            style={{ marginBottom: 5 }}
          >
            <Input.TextArea placeholder="Nhập mô tả" rows={3} />
          </Form.Item>
          <Form.Item
            name="thoiGianDanhGia"
            label="Thời gian đánh giá"
            rules={[
              {
                validator: (ece, value, callback) => {
                  if (!value || !value.length || !value[0]) {
                    callback('');
                  }
                  callback();
                },
                message: 'Hãy chọn thời gian đánh giá',
              },
              ...rules.required,
            ]}
            initialValue={[
              record?.thoiGianDanhGia?.thoiGianBatDau
                ? moment(record?.thoiGianDanhGia?.thoiGianBatDau)
                : undefined,
              record?.thoiGianDanhGia?.thoiGianKetThuc
                ? moment(record?.thoiGianDanhGia?.thoiGianKetThuc)
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
            <Form.Item
              name="donViId"
              label="Trường"
              rules={[...rules.required]}
              initialValue={record?.donViId}
            >
              <Select
                placeholder="Chọn trường"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {danhSachTruong?.map((item: any) => (
                  <Select.Option key={item?._id} value={item?._id}>
                    {item?.tenDonVi}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
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
};
export default FormDotDanhGiaSucKhoe;
