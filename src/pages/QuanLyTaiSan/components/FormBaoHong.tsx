/* eslint-disable no-underscore-dangle */
import { addBaoHong, updBaoHong } from '@/services/QuanLyTaiSan/BaoHong';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, InputNumber, message, Row, Select } from 'antd';
import React, { useState } from 'react';
import { useModel } from 'umi';
import type { QuanLyTaiSan as IQuanLyTaiSan } from '@/services/QuanLyTaiSan/typings';

const FormBaoHong = () => {
  const [form] = Form.useForm();
  const { edit, loading, record, setVisibleForm, getBaoHongModel, dsLop, dsTaiSan, getTaiSan } =
    useModel('baohong');
  const [loaiTaiSan, setLoaiTaiSan] = useState<string>(record?.loaiTaiSan);
  const vaiTro = localStorage.getItem('vaiTro');
  const [dsTruong, setDsTruong] = useState([]);
  const [newDsLop, setNewDsLop] = useState(dsLop);
  const [dsDonVi, setDsDonVi] = useState([]);
  const [newDsTaiSan, setNewDsTaiSan] = useState(dsTaiSan);
  const [idTruong, setIdTruong] = useState<string>();
  const [chooseTaiSan, setChooseTaiSan] = useState<boolean>(false);
  const [soLuong, setSoLuong] = useState<number>(record?.soLuong);
  const [soLuongTot, setSoLuongTot] = useState<number>(record?.soLuongTot);
  const [giaTriTong, setGiaTriTong] = useState<number>(record?.giaTri);
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;

  const getTruong = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=100`);
    setDsDonVi(result?.data?.data?.result);
    const arrTruong: any = [];
    result?.data?.data?.result?.map((item: { loaiDonVi: string }) =>
      item?.loaiDonVi === 'Truong' ? arrTruong.push(item) : undefined,
    );
    setDsTruong(arrTruong);
  };

  React.useEffect(() => {
    getTruong();
    if (vaiTro === 'GiaoVien') {
      const arrNewTaiSan: any = dsTaiSan?.filter(
        (item: IQuanLyTaiSan.BaoHong) =>
          item?.loaiTaiSan === 'Lớp' && item?.lopId === organizationId,
      );
      setNewDsTaiSan(arrNewTaiSan);
    }
    if (edit && record?.loaiTaiSan === 'Lớp') {
      const arrNewTaiSan: any = dsTaiSan?.filter(
        (item: IQuanLyTaiSan.BaoHong) =>
          item?.loaiTaiSan === 'Lớp' && item?.lopId === record?.lopId,
      );
      setNewDsTaiSan(arrNewTaiSan);
    }
    if (edit && record?.loaiTaiSan === 'Trường') {
      const arrNewTaiSan: any = dsTaiSan?.filter(
        (item: IQuanLyTaiSan.BaoHong) =>
          item?.loaiTaiSan === 'Trường' && item?.truongId === record?.truongId,
      );
      setNewDsTaiSan(arrNewTaiSan);
    }
    if (edit) setChooseTaiSan(true);
  }, []);

  const changeLoaiTaiSan = (val: string) => {
    form.setFieldsValue({
      lopId: undefined,
      taiSanId: undefined,
    });
    setLoaiTaiSan(val);
    if (val === 'Trường' && vaiTro === 'HieuTruong') {
      const arrNewTaiSan: any = dsTaiSan?.filter(
        (item: IQuanLyTaiSan.BaoHong) =>
          item?.loaiTaiSan === val && item?.truongId === organizationId,
      );
      setNewDsTaiSan(arrNewTaiSan);
    } else {
      setNewDsTaiSan([]);
    }
    if (vaiTro === 'Admin' || vaiTro === 'SuperAdmin') {
      form.resetFields(['truongId']);
    }
  };

  const changeIdTruong = async (val: string) => {
    setIdTruong(val);
    form.setFieldsValue({
      lopId: undefined,
      taiSanId: undefined,
    });
    const arrLop: any = [];
    dsDonVi?.map((item: { parent: string }) =>
      item?.parent === val ? arrLop.push(item) : undefined,
    );
    setNewDsLop(arrLop);
    if (loaiTaiSan === 'Trường') {
      const arrNewTaiSan: any = dsTaiSan?.filter(
        (item: IQuanLyTaiSan.BaoHong) => item?.loaiTaiSan === loaiTaiSan && item?.truongId === val,
      );
      setNewDsTaiSan(arrNewTaiSan);
    }
  };
  const changeIdLop = async (val: string) => {
    form.setFieldsValue({
      taiSanId: undefined,
    });
    if (loaiTaiSan === 'Lớp') {
      const arrNewTaiSan: any = dsTaiSan?.filter(
        (item: IQuanLyTaiSan.BaoHong) => item?.loaiTaiSan === loaiTaiSan && item?.lopId === val,
      );
      setNewDsTaiSan(arrNewTaiSan);
    }
  };

  const changeTaiSan = (val: string) => {
    setChooseTaiSan(true);
    const dataTaiSan: any = newDsTaiSan?.find((item: { _id: string }) => item._id === val);
    form.setFieldsValue({
      tenDayDu: dataTaiSan?.tenDayDu,
      giaTri: undefined,
      soLuong: undefined,
    });
    setSoLuong(dataTaiSan?.soLuong);
    setSoLuongTot(dataTaiSan?.soLuongTot);
    if (dataTaiSan?.soLuongTot === 0) {
      message.warn('Bạn không thể nhập thêm tài sản hỏng cho tài sản này!');
    }
    setGiaTriTong(dataTaiSan?.giaTri ?? 0);
  };

  const onFinish = async (values: any) => {
    const newVal = values;
    if (vaiTro === 'HieuTruong') {
      newVal.truongId = organizationId;
    }
    if (vaiTro === 'GiaoVien') {
      newVal.lopId = organizationId;
      newVal.loaiTaiSan = 'Lớp';
    }

    if (edit) {
      try {
        const res = await updBaoHong({
          ...newVal,
          id: record?._id,
        });
        if (res?.status === 200) {
          message.success('Cập nhật thành công');
          setVisibleForm(false);
          getBaoHongModel();
          getTaiSan();
          return true;
        }
      } catch (error) {
        message.error('Cập nhật không thành công');
        return false;
      }
    }
    try {
      newVal.trangThai = 'Chưa xác nhận';
      const res = await addBaoHong({ ...newVal });
      if (res?.status === 201) {
        message.success('Tạo thành công');
        setVisibleForm(false);
        getBaoHongModel();
        getTaiSan();
        return true;
      }
    } catch (error) {
      message.error('Tạo không thành công');
    }
    return true;
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form onFinish={onFinish} onFinishFailed={onFinishFailed} labelCol={{ span: 24 }} form={form}>
        <Row gutter={[16, 0]}>
          <Col
            xs={24}
            lg={
              (vaiTro === 'HieuTruong' && loaiTaiSan === 'Trường') || vaiTro === 'GiaoVien'
                ? 24
                : 12
            }
          >
            <Form.Item
              name="loaiTaiSan"
              label="Loại tài sản"
              rules={vaiTro === 'GiaoVien' ? [] : [...rules.required]}
              initialValue={record?.loaiTaiSan}
              style={{ marginBottom: 5 }}
            >
              <Select
                defaultValue={vaiTro === 'GiaoVien' ? 'Lớp' : undefined}
                placeholder="Chọn loại tài sản"
                onChange={changeLoaiTaiSan}
                disabled={vaiTro === 'GiaoVien'}
              >
                <Select.Option value="Trường">Trường</Select.Option>
                <Select.Option value="Lớp">Lớp</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          {(vaiTro === 'Admin' || vaiTro === 'SuperAdmin') && (
            <Col xs={24} lg={12}>
              <Form.Item
                name="truongId"
                label="Trường"
                rules={[...rules.required]}
                initialValue={record?.truongId}
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
                    <Select.Option key={item?._id} value={item?._id}>
                      {item?.tenDonVi}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}
          {(idTruong || vaiTro === 'HieuTruong' || record?.lopId) && loaiTaiSan === 'Lớp' && (
            <Col xs={24} lg={vaiTro === 'HieuTruong' ? 12 : 24}>
              <Form.Item
                label="Lớp"
                name="lopId"
                rules={[...rules.required]}
                style={{ marginBottom: 5 }}
                initialValue={record?.lopId}
              >
                <Select
                  showSearch
                  allowClear
                  style={{ width: '100%' }}
                  placeholder="Chọn lớp"
                  optionFilterProp="children"
                  onChange={changeIdLop}
                  filterOption={(input, option: any) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {newDsLop?.map((item: { tenDonVi: string; _id: string }) => (
                    <Select.Option key={item?._id} value={item?._id}>
                      {item?.tenDonVi}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}
        </Row>
        <Row gutter={[16, 0]}>
          <Col xs={24} lg={12}>
            <Form.Item
              name="taiSanId"
              label="Tài sản báo hỏng"
              rules={[...rules.required]}
              style={{ marginBottom: 5 }}
              initialValue={record?.taiSanId}
            >
              <Select placeholder="Chọn tài sản báo hỏng" onChange={changeTaiSan}>
                {newDsTaiSan?.map((item: IQuanLyTaiSan.BaoHong) => (
                  <Select.Option key={item?._id} value={item?._id}>
                    {item?.tenDayDu}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          {chooseTaiSan && (
            <Col xs={24} lg={12}>
              <Form.Item
                name="tenDayDu"
                label="Tên tài sản báo hỏng"
                initialValue={record?.tenDayDu}
                style={{ marginBottom: 5 }}
              >
                <Input placeholder="Nhập tên tài sản" disabled />
              </Form.Item>
            </Col>
          )}
        </Row>
        {chooseTaiSan && (
          <Row gutter={[16, 0]}>
            <Col xs={24} lg={12}>
              <Form.Item
                name="soLuong"
                label="Số lượng hỏng"
                rules={[...rules.required, ...rules.float(soLuongTot, 1, 0)]}
                initialValue={record?.soLuong}
                style={{ marginBottom: 5 }}
              >
                <InputNumber
                  placeholder="Nhập số lượng hỏng"
                  style={{ width: '100%' }}
                  disabled={soLuongTot === 0}
                  min={1}
                  step={1}
                  onChange={(val: number) => {
                    form.setFieldsValue({
                      giaTri:
                        giaTriTong === 0 ? 0 : Number((val * giaTriTong) / soLuong).toFixed(0),
                    });
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name="giaTri"
                label="Giá trị tài sản hỏng"
                initialValue={record?.giaTri}
                style={{ marginBottom: 5 }}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Nhập giá trị tài sản"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  disabled
                />
              </Form.Item>
            </Col>
          </Row>
        )}

        <Form.Item name="ghiChu" label="Ghi chú báo hỏng" initialValue={record?.ghiChu}>
          <Input.TextArea placeholder="Nhập ghi chú" rows={3} />
        </Form.Item>

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
export default FormBaoHong;
