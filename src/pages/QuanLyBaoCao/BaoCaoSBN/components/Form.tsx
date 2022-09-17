/* eslint-disable no-return-assign */
/* eslint-disable no-underscore-dangle */
import UploadMultiFile from '@/components/Upload/UploadMultiFile';
import { addBaoCaoSBN, updBaoCaoSBN } from '@/services/BaoCaoSBN/baocaosbn';
import type { Truong as ITruong } from '@/services/Truong';
import { uploadMulti } from '@/services/UploadMulti/uploadMulti';
import rules from '@/utils/rules';
import { Button, Card, Col, Divider, Form, Input, message, Row, Select, Spin } from 'antd';
import React from 'react';
import { useModel } from 'umi';

const FormBaoCaoSBN = () => {
  const [form] = Form.useForm();
  const { edit, loading, setVisibleForm, getBaoCaoSBNModel, setLoading, danhSachTruong, record } =
    useModel('baocaosbn');
  const vaiTro = localStorage.getItem('vaiTro');
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;

  const arrHoSo: {
    fileList: { name: string; url: string; status: string; size: number; mimetype: string }[];
  } = {
    fileList:
      record?.fileDinhKem?.map((item: any) => {
        return {
          name: item?.filename,
          url: item?.url,
          status: 'done',
          size: 123,
          mimetype: item?.mimetype,
        };
      }) ?? [],
  };

  const onFinish = async (values: any) => {
    const newVal = values;
    if (vaiTro === 'HieuTruong') {
      newVal.donViId = organizationId;
    }

    // Xử lý file đính kèm gửi lên
    let arrFile = [];
    if (newVal?.fileDinhKem && !newVal?.fileDinhKem?.fileList) {
      newVal.fileDinhKem = Object.values(newVal?.fileDinhKem);
      arrFile = Object.values(newVal?.fileDinhKem);
      if (arrFile?.length > 0) {
        let size = 0;
        arrFile?.map((item: { size: number }) => (size += item?.size));
        if (size / 1024 / 1024 > 8) {
          message.error('Tổng Dung lượng file tải lên không được lớn hơn 8MB');
          return false;
        }
      }
      setLoading(true);
    }
    const file: any[] = [];
    const fileUrl: any[] = [];
    if (newVal?.fileDinhKem?.length > 0) {
      newVal?.fileDinhKem?.forEach(
        (item: { originFileObj?: any; url: string; mimetype: string; name: string }) => {
          if (item?.originFileObj) file.push(item?.originFileObj);
          else
            fileUrl.push(
              {
                url: item?.url,
                mimetype: item?.mimetype,
              } ?? {},
            );
        },
      );
      const result = await uploadMulti(file);
      newVal.fileDinhKem = [
        ...fileUrl,
        ...(result.data?.data?.map((item: { url: string; file: { mimetype: string } }) => {
          return {
            url: item?.url,
            mimetype: item?.file?.mimetype,
          };
        }) ?? []),
      ];
      arrFile?.forEach(
        (val: any, index: number) => (newVal.fileDinhKem[index].filename = val?.name),
      );
    } else if (newVal?.fileDinhKem?.fileList?.length > 0) {
      const tailieu: any[] = [];
      newVal?.fileDinhKem?.fileList?.map((item: { url: string; mimetype: string; name: string }) =>
        tailieu.push({
          url: item?.url,
          mimetype: item?.mimetype,
          filename: item?.name,
        }),
      );
      newVal.fileDinhKem = tailieu;
    } else {
      newVal.fileDinhKem = [];
    }

    if (edit) {
      try {
        const res = await updBaoCaoSBN({ ...newVal, id: record?._id });
        if (res?.data?.statusCode === 200) {
          getBaoCaoSBNModel(organizationId);
          message.success('Cập nhật báo cáo thành công');
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
      const res = await addBaoCaoSBN({ ...newVal });
      if (res?.data?.statusCode === 201) {
        getBaoCaoSBNModel(organizationId);
        message.success('Thêm mới báo cáo thành công');
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

  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Spin spinning={loading}>
        <Form onFinish={onFinish} labelCol={{ span: 24 }} form={form}>
          <Row gutter={[16, 0]}>
            {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
              <Col xs={24} lg={24}>
                <Form.Item
                  label="Trường"
                  name="donViId"
                  rules={[...rules.required]}
                  style={{ marginBottom: 5 }}
                  initialValue={record?.donViId}
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
                  >
                    {danhSachTruong?.map((item: ITruong.Record) => (
                      <Select.Option key={item?._id} value={item?._id}>
                        {item?.tenDonVi}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            )}
          </Row>
          <Form.Item
            label="Sổ quản lý"
            name="ten"
            rules={[...rules.required, ...rules.text]}
            style={{ marginBottom: 5 }}
            initialValue={record?.ten}
          >
            <Input placeholder="Nhập sổ quản lý" />
          </Form.Item>
          <Form.Item
            label="Mẫu sổ"
            name="fileDinhKem"
            style={{ marginBottom: 5 }}
            initialValue={
              // eslint-disable-next-line no-nested-ternary
              edit
                ? record?.fileDinhKem?.[0] !== '' || record?.fileDinhKem?.[0]
                  ? arrHoSo
                  : undefined
                : undefined
            }
          >
            <UploadMultiFile
              otherProps={{
                multiple: true,
                accept: '.pdf, .doc,.docx',
              }}
            />
          </Form.Item>
          <Form.Item
            label="Ghi chú"
            name="ghiChu"
            style={{ marginBottom: 5 }}
            initialValue={record?.ghiChu}
            rules={[...rules.text]}
          >
            <Input.TextArea placeholder="Nhập ghi chú" rows={3} />
          </Form.Item>

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
export default FormBaoCaoSBN;
