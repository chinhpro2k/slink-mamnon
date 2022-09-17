/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import UploadAnh from '@/components/Upload/UploadAnh';
import { addQuangCao, updQuangCao } from '@/services/QuangCao/quangcao';
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
} from 'antd';
import React, { useState } from 'react';
import { useModel } from 'umi';
import { renderFileListUrl } from '@/utils/utils';
import TinyEditor from '@/components/TinyEditor/Tiny';
import moment from 'moment';
import { upload } from '@/services/UploadAnh/upload';

const FormQuangCao = () => {
  const { loading, setVisibleForm, edit, getQuangCaoModel, record, danhSachTruong, donViId } =
    useModel('quangcao');
  const [form] = Form.useForm();
  const [loaiTin, setLoaiTin] = useState<string>(record?.loaiTin);
  const vaiTro = localStorage.getItem('vaiTro');

  const changeLoaiTin = (val: string) => {
    setLoaiTin(val);
  };

  const onFinish = async (values: any) => {
    const newVal = { ...values };
    if (vaiTro !== 'SuperAdmin' || vaiTro !== 'Admin') newVal.donViId = donViId;
    newVal.vaiTroNhanTinTuc = 'Tất cả';
    newVal.moTa = newVal?.moTa?.text;
    if (newVal.anhDaiDien?.fileList?.length > 0 && !newVal.anhDaiDien?.fileList[0]?.url) {
      const result = await upload(newVal.anhDaiDien);
      newVal.anhDaiDien = result.data?.data?.url;
    } else {
      newVal.anhDaiDien = record.anhDaiDien;
    }
    if (loaiTin === 'Tuyển dụng')
      newVal.hanCuoi = moment(newVal.hanCuoi).toISOString() ?? record?.hanCuoi;
    if (edit) {
      try {
        const res = await updQuangCao({ ...newVal, id: record?._id });
        if (res?.data?.statusCode === 200) {
          message.success('Chỉnh sửa thành công');
          setVisibleForm(false);
          getQuangCaoModel();
          return true;
        }
      } catch (error) {
        message.error('Đã xảy ra lỗi');
        return false;
      }
    }
    try {
      const res = await addQuangCao({ ...newVal });
      if (res?.data?.statusCode === 201) {
        message.success('Thêm mới thành công');
        setVisibleForm(false);
        getQuangCaoModel();
        return true;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return false;
  };

  const checkAllowNews = (value) => {
    if (vaiTro === 'HieuTruong' || vaiTro === 'SuperAdmin' || vaiTro === 'Admin') return true;
    if (value === 'Khác') return true;
    return false;
  };

  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form labelCol={{ span: 24 }} onFinish={onFinish} form={form}>
        {(vaiTro === 'Admin' || vaiTro === 'SuperAdmin') && (
          <Form.Item
            name="donViId"
            label="Trường"
            // rules={[...rules.required]}
            style={{ marginBottom: 5 }}
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
              {danhSachTruong?.map((item) => (
                <Select.Option value={item?._id} key={item?._id}>
                  {item?.tenDonVi}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        <Row gutter={[16, 0]}>
          <Col xs={24} lg={24}>
            <Form.Item
              name="mucUuTien"
              label="Mức ưu tiên"
              rules={[...rules.required]}
              style={{ marginBottom: 5 }}
              initialValue={record?.mucUuTien ?? 1}
            >
              <Select
                placeholder="Mức ưu tiên"
                disabled={vaiTro !== 'Admin' && vaiTro !== 'SuperAdmin'}
                onChange={changeLoaiTin}
              >
                {[1, 2, 3, 4, 5]?.map((item) => (
                  <Select.Option value={item}>{item}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="loaiTin"
              label="Loại tin"
              rules={[...rules.required]}
              style={{ marginBottom: 5 }}
              initialValue={
                vaiTro === 'HieuTruong' || vaiTro === 'SuperAdmin' ? record?.loaiTin : 'Khác'
              }
            >
              <Select
                disabled={vaiTro !== 'HieuTruong' && vaiTro !== 'SuperAdmin' && vaiTro !== 'Admin'}
                placeholder="Chọn loại tin"
                onChange={changeLoaiTin}
              >
                {['Tuyển sinh', 'Tuyển dụng', 'Khác']
                  ?.filter((item) => checkAllowNews(item))
                  ?.map((item) => (
                    <Select.Option value={item}>{item}</Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="tieuDe"
              label="Tiêu đề"
              rules={[...rules.required, ...rules.length(255)]}
              style={{ marginBottom: 5 }}
              initialValue={record?.tieuDe}
            >
              <Input placeholder="Nhập tiêu đề" />
            </Form.Item>
          </Col>
        </Row>
        {loaiTin === 'Tuyển dụng' && (
          <>
            <Row gutter={[16, 0]}>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="viTri"
                  label="Vị trí tuyển dụng"
                  rules={[...rules.required, ...rules.length(255)]}
                  style={{ marginBottom: 5 }}
                  initialValue={record?.viTri}
                >
                  <Input placeholder="Nhập vị trí tuyển dụng" />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="mucLuong"
                  label="Mức lương"
                  rules={[...rules.required]}
                  style={{ marginBottom: 5 }}
                  initialValue={record?.mucLuong}
                >
                  <InputNumber
                    placeholder="Nhập mức lương"
                    min={0}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
        <Row gutter={[16, 0]}>
          {loaiTin === 'Tuyển dụng' && (
            <>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="hanCuoi"
                  label="Hạn cuối"
                  rules={[...rules.required]}
                  style={{ marginBottom: 5 }}
                  initialValue={record?.hanCuoi ? moment(record?.hanCuoi) : undefined}
                >
                  <DatePicker
                    placeholder="Chọn ngày hết hạn"
                    format="DD/MM/YYYY"
                    style={{ width: '100%' }}
                    disabledDate={(current) => current && current < moment().endOf('day')}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="soDienThoai"
                  label="Số điện thoại"
                  rules={[...rules.soDienThoai]}
                  style={{ marginBottom: 5 }}
                  initialValue={record?.soDienThoai}
                >
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
              </Col>
            </>
          )}
        </Row>
        <Form.Item
          name="anhDaiDien"
          label="Ảnh đại diện"
          style={{ marginBottom: 5 }}
          rules={[...rules.fileRequired]}
          initialValue={renderFileListUrl(record?.anhDaiDien)}
        >
          <UploadAnh />
        </Form.Item>
        <Form.Item
          name="moTa"
          label="Nội dung"
          initialValue={{ text: record?.moTa }}
          rules={[
            {
              validator: (ece, value, callback) => {
                const { text } = value;
                if (!text || !text.length || !text[0]) {
                  callback('');
                }
                callback();
              },
              message: 'Hãy nhập nội dung',
            },
            ...rules.required,
          ]}
        >
          <TinyEditor />
        </Form.Item>
        <Divider />

        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            Gửi
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
export default FormQuangCao;
