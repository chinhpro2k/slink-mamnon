/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import {Card, Form, Row, Col, Button, Input, InputNumber, Select, Spin, message} from 'antd';
import { useModel } from 'umi';
import { PlusOutlined, RestFilled, DeleteOutlined, ConsoleSqlOutlined } from '@ant-design/icons';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import { Format, formatterMoney } from '@/utils/utils';
import rules from '@/utils/rules';
import { getDanhMucMonAn } from '@/services/DanhMucMonAn/danhmucmonan';

const FormMonAn = (props) => {
  const {
    setRecord,
    setEdit,
    edit,
    record,
    setVisibleForm,
    postDanhMucMonAnModel,
    updDanhMucMonAnModel,
    getDanhMucMonAnModel,
  } = useModel('danhmucmonan');
  const danhMucMonAnChung = useModel('danhmucmonanchung');
  const {
    initialState: {
      currentUser: {
        role: { organizationId },
      },
    },
  } = useModel('@@initialState');
  const a = useModel('@@initialState');
  const [danhSachTruong, setDanhSachTruong] = useState([]);
  const [donViId, setDonViId] = useState<any>(organizationId);
  const [danhMucThucPham, setDanhMucThucPham] = useState([]);
  const [searchTenThucPham, setSearchTenThucPham] = useState('');
  const [danhSachMonAn, setDanhSachMonAn] = useState([]);
  const [loading, setLoading] = useState(false);
  const vaiTro = a?.initialState?.currentUser?.role?.systemRole;

  const getDanhSachMonAn = async () => {
    const res = await getDanhMucMonAn({
      page: 1,
      limit: 100000,
      cond: {
        // datatype: vaiTro === 'SuperAdmin' || vaiTro === 'Admin' ? 'Hệ thống' : 'Khác',
        ...(vaiTro === 'SuperAdmin' || vaiTro === 'Admin' ? {} : { datatype: 'Khác' }),
      },
      ...(vaiTro !== 'SuperAdmin' && vaiTro !== 'Admin' && { donViId }),
    });

    setDanhSachMonAn(res?.data?.data?.result ?? []);
  };

  const gettruong = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=1000`, {
      params: {
        cond: {
          loaiDonVi: 'Truong',
        },
      },
    });

    setDanhSachTruong(result?.data?.data?.result);
  };
  const getDataThucPham = async (cond = {}) => {
    const response = await axios.get(`${ip3}/danh-muc-thuc-pham/search`, {
      params: {
        ...(vaiTro === 'SuperAdmin' || vaiTro === 'Admin' ? {} : { donViId: organizationId }),
        // ...(cond && { cond }),
        page: 1,
        limit: 1000000,
      },
    });

    setDanhMucThucPham(response?.data?.data ?? []);
  };
  useEffect(() => {
    getDataThucPham();
    gettruong();
    getDanhSachMonAn();
    // return () => {
    //   danhMucMonAnChung.setVisibleForm(false);
    //   danhMucMonAnChung.setEdit(false);
    //   danhMucMonAnChung.setRecord({});
    //   danhMucMonAnChung.setIsClone(false);
    //   setVisibleForm(false);
    //   setRecord({});
    //   setEdit(false);
    // };
  }, []);
  const [form] = Form.useForm();
  const onFinish = async (val) => {
    if (!val.thanhPhanMonAn || (Array.isArray(val?.thanhPhanMonAn)&&val?.thanhPhanMonAn.length === 0)) {
      message.warn('Vui lòng thêm thành phần món ăn')
      return false;
    }
    setLoading(true);
    if (danhMucMonAnChung.isClone) {
      const newValue = {
        ...danhMucMonAnChung?.record,
        ...val,
        datatype: 'Khác',
      };
      const response = await axios.post(`${ip3}/danh-muc-mon-an`, newValue);
      setLoading(false);

      danhMucMonAnChung.getDanhMucMonAnModel();
      getDanhMucMonAnModel(
        vaiTro === 'SuperAdmin' || vaiTro === 'Admin' ? 'Tất cả' : organizationId,
      );
      danhMucMonAnChung.setVisibleForm(false);
      danhMucMonAnChung.setRecord({});
      danhMucMonAnChung.setIsClone(false);
      return;
    }
    let body = {
      ...val,
      // donViId,
      ...(edit && { id: record?.id }),
      datatype: vaiTro === 'SuperAdmin' || vaiTro === 'Admin' ? 'Hệ thống' : 'Khác',
    };
    body.thanhPhanMonAn = body.thanhPhanMonAn?.map((item) => {
      delete item._id;
      return item;
    });

    if (edit) {
      await updDanhMucMonAnModel(body);
    } else {
      await postDanhMucMonAnModel(body);
    }
    setLoading(false);
    await getDanhMucMonAnModel(
      vaiTro === 'SuperAdmin' || vaiTro === 'Admin' ? 'Tất cả' : organizationId,
    );
    await danhMucMonAnChung.getDanhMucMonAnModel();
    setVisibleForm(false);
    setRecord({});
    setEdit(false);
  };
  const onSearchThucPham = (val) => {
    setSearchTenThucPham(val);
  };
  return (
    <Spin spinning={loading}>
      <Card title={danhMucMonAnChung.isClone ? 'Sao chép' : edit ? 'Chỉnh sửa' : 'Thêm mới'}>
        <Form
          labelCol={{ span: 24 }}
          onFinish={onFinish}
          form={form}
          initialValues={danhMucMonAnChung.isClone ? danhMucMonAnChung.record : record}
        >
          <Form.Item
            label="Tên danh mục"
            name="ten"
            rules={[
              ...rules.required,
              // {
              //   validator: (_, value, callback) => {
              //     danhSachMonAn.map((item) => {
              //       if (Format(value) === Format(item?.ten)) {
              //         callback('');
              //         return;
              //       }
              //       callback();
              //     });
              //   },
              //   message: 'Tên món ăn này đã tồn tại',
              // },
            ]}
          >
            <Input placeholder="Tên danh mục món ăn" />
          </Form.Item>
          {/* <p>Loại món ăn</p> */}
          {/* <Form.List name="loaiMonAn">
          {(fields, { add, remove }) => (
            <>
              {fields.length === 0 && <i>Chưa có loại món ăn</i>}
              {fields.map((field, index) => (
                <Row>
                  <Col span={23}>
                    <Form.Item {...field} key={field.key}>
                      <Input placeholder={`Loại món ăn ${index + 1}`} />
                    </Form.Item>
                  </Col>
                  <Col span={1}>
                    <Button type="primary" onClick={() => remove(field.name)}>
                      <DeleteOutlined />
                    </Button>
                  </Col>
                </Row>
              ))}
              <center>
                <Button type="primary" onClick={() => add()}>
                  Thêm loại món ăn
                </Button>
              </center>
            </>
          )}
        </Form.List> */}
          {/* {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
            <Form.Item
              name="donViId"
              label="Trường"
              rules={[...rules.required]}
              style={{ marginBottom: 5 }}
            >
              <Select
                showSearch
                allowClear
                style={{ width: '100%' }}
                placeholder="Chọn trường"
                optionFilterProp="children"
                filterOption={(input, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onChange={(value) => setDonViId(value)}
              >
                {danhSachTruong?.map((item: ITruong.Record) => (
                  <Select.Option key={item?._id} value={item?._id}>
                    {item?.tenDonVi}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )} */}
          <p>Danh mục món ăn</p>
          <Form.List name="thanhPhanMonAn">
            {(fields, { add, remove }) => (
              <>
                {fields.length === 0 && <i>Chưa có thành phần món ăn</i>}
                {fields.map(({ key, name, ...restField }, indexThucPham) => (
                  <Card
                    title={`Thành phần ${indexThucPham + 1}`}
                    bordered
                    extra={
                      <Button type="primary" onClick={() => remove(name)}>
                        Xóa
                      </Button>
                    }
                  >
                    <Row gutter={[10, 10]}>
                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          label="Tên thành phần"
                          rules={[...rules.required]}
                          name={[name, 'ten']}
                        >
                          <Select
                            showSearch
                            allowClear
                            placeholder="Tên thành phần"
                            optionFilterProp="children"
                            onSearch={onSearchThucPham}
                            onChange={(val, option) => {
                              let thanhPhanMonAn = form.getFieldValue('thanhPhanMonAn');
                              thanhPhanMonAn = thanhPhanMonAn.map((item, index) => {
                                if (index === indexThucPham) {
                                  return {
                                    ...item,
                                    loaiThucPham: option?.obj?.loaiThucPham ?? '',
                                    tyLeThai: option?.obj?.heSoThaiBo ?? 0,
                                    protid: option?.obj?.dam ?? 0,
                                    glucid: option?.obj?.duong ?? 0,
                                    lipid: option?.obj?.beo ?? 0,
                                    calo: option?.obj?.calo ?? 0,
                                    donGia: option?.obj?.giaTien ?? 0,
                                  };
                                }
                                return item;
                              });
                              form.setFieldsValue({
                                thanhPhanMonAn,
                              });
                              //
                            }}
                            // filterOption={(input, option) =>
                            //   option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            // }
                          >
                            {danhMucThucPham
                              .filter(
                                (item) =>
                                  Format(item?.tenDayDu)?.indexOf(Format(searchTenThucPham)) >= 0,
                              )
                              .filter((item, index) => index < 101)
                              .map((item, index) => (
                                <Select.Option value={item?.tenDayDu} obj={item}>
                                  {item?.tenDayDu}
                                </Select.Option>
                              ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          label="Loại thực phậm"
                          name={[name, 'loaiThucPham']}
                        >
                          <Select disabled>
                            {['Tươi', 'Khô'].map((item) => (
                              // eslint-disable-next-line react/jsx-key
                              <Select.Option value={item}>{item}</Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          label="Định lượng nhà trẻ"
                          rules={[...rules.required]}
                          name={[name, 'dinhLuongNhaTre']}
                        >
                          <InputNumber style={{ width: '100%' }} min={0} />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          label="Định lượng mẫu giáo"
                          rules={[...rules.required]}
                          name={[name, 'dinhLuongMauGiao']}
                        >
                          <InputNumber style={{ width: '100%' }} min={0} />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item {...restField} label="Tỉ lệ thải bỏ" name={[name, 'tyLeThai']}>
                          <InputNumber style={{ width: '100%' }} min={0} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item {...restField} label="Protid" name={[name, 'protid']}>
                          <InputNumber style={{ width: '100%' }} min={0} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item {...restField} label="Lipid" name={[name, 'lipid']}>
                          <InputNumber style={{ width: '100%' }} min={0} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item {...restField} label="Glucid" name={[name, 'glucid']}>
                          <InputNumber style={{ width: '100%' }} min={0} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item {...restField} label="Calo" name={[name, 'calo']}>
                          <InputNumber style={{ width: '100%' }} min={0} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item {...restField} label="Đơn giá" name={[name, 'donGia']}>
                          <InputNumber style={{ width: '100%' }} min={0} disabled />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}
                <center>
                  <Button
                    type="primary"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    style={{ width: 300 }}
                  >
                    Thêm thành phần
                  </Button>
                </center>
              </>
            )}
          </Form.List>
          <Form.Item style={{ textAlign: 'center', marginBottom: 0, marginTop: 10 }}>
            <Button
              loading={loading}
              style={{ marginRight: 8 }}
              htmlType="submit"
              type="primary"
              // onClick={() => {
              //
              //   form.submit();
              // }}
            >
              {edit ? 'Chỉnh sửa' : 'Thêm mới'}
            </Button>
            <Button
              onClick={() => {
                setVisibleForm(false);
                danhMucMonAnChung.setVisibleForm(false);
              }}
            >
              Đóng
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default FormMonAn;
