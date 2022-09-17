/* eslint-disable no-underscore-dangle */
import { addKhaoSat, updKhaoSat } from '@/services/QuanLyKhaoSat/khaosat';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import rules from '@/utils/rules';
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Form, Input, message, Radio, Row, Select } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { useModel } from 'umi';
import styles from './block.css';
import BlockQuestion from './BlockQuestion';

const FormKhaoSat = () => {
  const [form] = Form.useForm();
  const { edit, loading, record, setVisibleForm, getKhaoSatModel } = useModel('khaosat');
  const [doiTuong, setDoiTuong] = useState<string>('Tất cả');
  const vaiTro = localStorage.getItem('vaiTro');
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [dsTruong, setDsTruong] = useState([]);
  const [dsLop, setDsLop] = useState([]);
  const [dsDonVi, setDsDonVi] = useState([]);
  const [idTruong, setIdTruong] = useState<string>();
  const [loaiLop, setLoaiLop] = useState<string>();
  const [loaiTruong, setLoaiTruong] = useState<string>();

  const getTruong = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=10000`);
    setDsDonVi(result?.data?.data?.result);
    const arrTruong: any = [];
    result?.data?.data?.result?.map((item: { loaiDonVi: string }) =>
      item?.loaiDonVi === 'Truong' ? arrTruong.push(item) : undefined,
    );
    setDsTruong(arrTruong);
  };

  const getLop = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=10000`, {
      params: {
        cond: {
          parent: organizationId,
        },
      },
    });
    setDsLop(result?.data?.data?.result);
  };

  React.useEffect(() => {
    getTruong();
    if (vaiTro === 'HieuTruong') getLop();
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
  };

  const changeloaiLop = (val: string) => {
    setLoaiLop(val);
    form.setFieldsValue({
      donViId: undefined,
    });
  };

  const changeloaiTruong = (val: string) => {
    setLoaiTruong(val);
    form.setFieldsValue({
      donViId: undefined,
      loaiLop: undefined,
    });
  };

  const onFinish = async (values: any) => {
    const newVal = values;
    const ngayBatDau = newVal?.thoiGian?.[0] ?? newVal.ngayBatDau;
    const ngayKetThuc = newVal?.thoiGian?.[1] ?? newVal.ngayKetThuc;
    delete newVal.thoiGian;
    if (newVal.loaiLop === 'all-class') {
      newVal.donViId = [newVal?.school];
      delete newVal.school;
    }
    if (newVal.loaiTruong === 'all-school' || doiTuong === 'Tất cả') {
      newVal.donViId = ['*'];
    }

    // xử lý phần isKhac
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
    if (edit) {
      try {
        const res = await updKhaoSat({ ...newVal, ngayBatDau, ngayKetThuc, id: record?._id });
        if (res?.status === 200) {
          message.success('Cập nhật khảo sát thành công');
          setVisibleForm(false);
          getKhaoSatModel();
          return true;
        }
      } catch (error) {
        message.error('Cập nhật khảo sát không thành công');
        return false;
      }
    }
    try {
      const res = await addKhaoSat({ ...newVal, ngayBatDau, ngayKetThuc });
      if (res?.status === 201) {
        message.success('Tạo khảo sát thành công');
        setVisibleForm(false);
        getKhaoSatModel();
        return true;
      }
    } catch (error) {
      message.error('Tạo khảo sát không thành công');
    }
    return true;
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form onFinish={onFinish} onFinishFailed={onFinishFailed} labelCol={{ span: 24 }} form={form}>
        <Form.Item
          name="tieuDe"
          label="Tiêu đề"
          rules={[...rules.required, ...rules.text, ...rules.length(100)]}
          initialValue={record?.tieuDe}
          style={{ marginBottom: 5 }}
        >
          <Input placeholder="Tiêu đề" />
        </Form.Item>
        <Form.Item
          name="moTa"
          label="Mô tả"
          rules={[...rules.length(255)]}
          initialValue={record?.moTa}
          style={{ marginBottom: 5 }}
        >
          <Input.TextArea rows={3} placeholder="Mô tả" />
        </Form.Item>
        <Form.Item
          name="thoiGian"
          label="Thời gian khảo sát"
          // rules={[...rules.required]}
          initialValue={[
            record?.ngayBatDau ? moment(record?.ngayBatDau) : undefined,
            record?.ngayKetThuc ? moment(record?.ngayKetThuc) : undefined,
          ]}
          style={{ marginBottom: 5 }}
        >
          <DatePicker.RangePicker
            format="HH:mm DD-MM-YYYY"
            style={{ width: '100%' }}
            placeholder={['Thời gian bắt đầu', 'Thời gian kết thúc']}
            showTime
          />
        </Form.Item>
        <Row gutter={[20, 0]}>
          {!edit && (
            <Col xs={24} sm={12} md={12}>
              <Form.Item
                rules={[...rules.required]}
                name="doiTuongKhaoSat"
                label="Đối tượng khảo sát"
                initialValue={doiTuong}
                style={{ marginBottom: 5 }}
              >
                <Select
                  onChange={(val: string) => {
                    setDoiTuong(val);
                    setLoaiLop(undefined);
                    form.setFieldsValue({
                      donViId: undefined,
                      loaiLop: undefined,
                    });
                  }}
                  placeholder="Chọn đối tượng"
                >
                  <Select.Option value="Tất cả">Tất cả</Select.Option>
                  {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
                    <Select.Option value="Trường">Trường</Select.Option>
                  )}
                  {vaiTro !== 'GiaoVien' && <Select.Option value="Lớp">Lớp</Select.Option>}
                </Select>
              </Form.Item>
            </Col>
          )}
          <Col xs={24} sm={12} md={12}>
            <Form.Item
              name="trangThai"
              label="Kích hoạt"
              initialValue={record?.trangThai ?? true}
              style={{ marginBottom: 5 }}
            >
              <Radio.Group>
                <Radio value={true}>Có</Radio>
                <Radio value={false}>Không</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        {doiTuong === 'Trường' && (
          <Form.Item
            label="Trường"
            name="loaiTruong"
            rules={[...rules.required]}
            style={{ marginBottom: 5 }}
            initialValue={loaiTruong}
          >
            <Select placeholder="Chọn trường" onChange={changeloaiTruong}>
              <Select.Option value="all-school">Tất cả các trường</Select.Option>
              <Select.Option value="many-school">Chọn trong danh sách trường</Select.Option>
            </Select>
          </Form.Item>
        )}
        {doiTuong === 'Trường' && loaiTruong === 'many-school' && (
          <Form.Item
            rules={[...rules.required]}
            name="donViId"
            label="Danh sách trường tham gia khảo sát"
            initialValue={record?.doiTuong}
            style={{ marginBottom: 5 }}
          >
            <Select
              placeholder="Chọn trường"
              optionFilterProp="children"
              mode="multiple"
              showSearch
              allowClear
              filterOption={(input, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {dsTruong?.map((item: { tenDonVi: string; _id: string }) => (
                <Select.Option value={item?._id}>{item?.tenDonVi}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {doiTuong === 'Lớp' && vaiTro !== 'HieuTruong' && (
          <Form.Item
            rules={[...rules.required]}
            name="school"
            label="Trường"
            initialValue={record?.doiTuong}
            style={{ marginBottom: 5 }}
          >
            <Select
              placeholder="Chọn trường"
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
        )}
        {(idTruong || vaiTro === 'HieuTruong') && doiTuong === 'Lớp' && (
          <Form.Item
            label="Lớp"
            name="loaiLop"
            rules={[...rules.required]}
            style={{ marginBottom: 5 }}
            initialValue={loaiLop}
          >
            <Select placeholder="Chọn lớp" onChange={changeloaiLop}>
              <Select.Option value="all-class">Tất cả các lớp</Select.Option>
              <Select.Option value="many-class">Chọn trong danh sách lớp</Select.Option>
            </Select>
          </Form.Item>
        )}

        {(idTruong || vaiTro === 'HieuTruong') && loaiLop === 'many-class' && (
          <Form.Item
            label="Danh sách lớp làm khảo sát"
            name="donViId"
            rules={[...rules.required]}
            style={{ marginBottom: 5 }}
            initialValue={record?.donViId}
          >
            <Select
              showSearch
              allowClear
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Chọn lớp làm khảo sát"
              optionFilterProp="children"
              filterOption={(input, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {dsLop?.map((item: { tenDonVi: string; _id: string }) => (
                <Select.Option value={item?._id}>{item?.tenDonVi}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        <Form.Item
          label="Vai trò"
          name="doiTuong"
          rules={[...rules.required]}
          style={{ marginBottom: 5 }}
          initialValue={record?.doiTuong}
        >
          <Select mode="multiple" style={{ width: '100%' }} placeholder="Chọn vai trò">
            {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
              <Select.Option value="HieuTruong">Hiệu trưởng</Select.Option>
            )}
            {vaiTro !== 'GiaoVien' && <Select.Option value="GiaoVien">Giáo viên</Select.Option>}

            <Select.Option value="PhuHuynh">Phụ huynh</Select.Option>
          </Select>
        </Form.Item>
        <br />
        <Form.List
          name="noiDungKhaoSat"
          initialValue={record?.noiDungKhaoSat ?? []}
          rules={[
            {
              validator: async (_, names) => {
                if (!names || names.length < 1) {
                  return Promise.reject(new Error('Ít nhất 1 câu hỏi'));
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
                          <div style={{ float: 'left' }}>Câu hỏi {index + 1}</div>
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
                    Thêm câu hỏi
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            );
          }}
        </Form.List>
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            {!edit ? 'Thêm mới' : 'Lưu'}
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
export default FormKhaoSat;
