/* eslint-disable no-underscore-dangle */
import { Form, Select, Input, Button } from 'antd';
import { useModel } from 'umi';
import { useEffect, useState } from 'react';
import rules from '@/utils/rules';

const FormTemplate = ({ record, closeFormTemplate }: any) => {
  const templateLich = useModel('templatelich');
  const [form] = Form.useForm();
  const [lop, setLop] = useState<any>(undefined);

  useEffect(() => {
    if (record) {
      const tmp =
        templateLich?.danhSachLop?.filter(
          (item: { _id: string }) => item._id === record?.donViId,
        )?.[0] ?? undefined;
      setLop(tmp);
    }
  }, []);

  return (
    <Form
      {...{
        labelCol: { span: 24 },
        wrapperCol: { span: 24 },
      }}
      onFinish={async (values) => {
        if (!record) {
          const response = await templateLich.addTemplateModel(values);
          closeFormTemplate(1, response);
        } else {
          await templateLich.updTemplateModel({ ...record, ...values });
          closeFormTemplate();
        }
      }}
      initialValues={{
        ...record,
      }}
      form={form}
    >
      <Form.Item label="Tên template" name="ten" rules={[...rules.required]}>
        <Input />
      </Form.Item>
      <Form.Item label="Loại template" name="loai" rules={[...rules.required]}>
        <Select>
          <Select.Option value="Ngày">Ngày</Select.Option>
          <Select.Option value="Tuần">Tuần</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="Lớp" name="donViId" rules={[...rules.required]}>
        <Select
          onSelect={(value, option) => {
            setLop(option.obj);
            form.setFieldsValue({
              chuongTrinhDaoTaoId: option?.obj?.chuongTrinhDaoTao?._id,
            });
          }}
        >
          {templateLich.danhSachLop.map((item: { tenDonVi: string; _id: string }) => (
            <Select.Option value={item?._id} obj={item}>
              {item?.tenDonVi ?? ''}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Chương trình đào tạo" name="chuongTrinhDaoTaoId" hidden>
        <Select disabled>
          <Select.Option value={lop?.chuongTrinhDaoTao?._id}>
            {lop?.chuongTrinhDaoTao?.ten ?? ''}
          </Select.Option>
        </Select>
      </Form.Item>
      <Button type="primary" htmlType="submit">
        {record ? 'Chỉnh sửa' : 'Thêm mới'}
      </Button>
    </Form>
  );
};

export default FormTemplate;
