import { Button, Card, Form, Input, InputNumber, message, Select } from 'antd';
import rules from '@/utils/rules';
import { IQuiDoi } from '@/services/QuyDoi';
import { useModel } from '@@/plugin-model/useModel';
import { useEffect } from 'react';

const FormCreate = () => {
  const { createQuyDoiModel, setVisibleForm, getQuyDoiModel } = useModel('quydoi');
  const { getDanhMucThucPhamModel, danhSach: danhSachTp } = useModel('danhmucthucpham');
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  useEffect(() => {
    getDanhMucThucPhamModel(organizationId, 1000);
  }, []);
  const onFinish = (values: any) => {
    const data: IQuiDoi.DataCreate = {
      donViDuocQuyDoi: values.donViDuocQuyDoi,
      donViQuyDoi: values.donViQuyDoi,
      giaTriDonViDuocQuyDoi: +values.giaTriDonViDuocQuyDoi,
      giaTriDonViQuyDoi: +values.giaTriDonViQuyDoi,
      thucPhamId: values.thucPhamId,
    };
    createQuyDoiModel(data).then(() => {
      message.success('Thêm thành công');
      setVisibleForm(false);
      getQuyDoiModel();
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  return (
    <Card title="Thêm mới" bordered={false}>
      <Form
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        // labelCol={{ span: 4 }}
        // wrapperCol={{ span: 14 }}
        layout="vertical"
      >
        <Form.Item label="Thực phẩm" name="thucPhamId" rules={[...rules.required]}>
          <Select
            showSearch
            onChange={handleChange}
            allowClear
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option!.children as unknown as string).includes(input)
            }
            filterSort={(optionA, optionB) =>
              (optionA!.children as unknown as string)
                .toLowerCase()
                .localeCompare((optionB!.children as unknown as string).toLowerCase())
            }
          >
            {danhSachTp?.map((val) => {
              return (
                <Select.Option value={val._id} key={val._id}>
                  {val.tenDayDu}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="Đơn vị quy đổi" name="donViQuyDoi" rules={[...rules.required]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Giá trị đơn vị quy đổi"
          name="giaTriDonViQuyDoi"
          rules={[...rules.required]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="Đơn vị được quy đổi"
          name="donViDuocQuyDoi"
          rules={[...rules.required]}
          initialValue={'gam'}
        >
          <Input value={'gam'} disabled defaultValue={'gam'} />
        </Form.Item>
        <Form.Item
          label="Giá trị đơn vị được quy đổi"
          name="giaTriDonViDuocQuyDoi"
          rules={[...rules.required]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType={'submit'}>
            Thêm mới
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
export default FormCreate;
