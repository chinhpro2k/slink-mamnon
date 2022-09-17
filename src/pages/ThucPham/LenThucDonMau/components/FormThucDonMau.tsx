import { Form, Input, Select, Button, Row, Card } from 'antd';
import { useModel } from 'umi';
import rules from '@/utils/rules';
import notificationAlert from '@/components/Notification';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import { useState, useEffect } from 'react';

const FormThucDonMau = () => {
  const thucDonMau = useModel('thucdonmau');
  const initialStateModel = useModel('@@initialState');
  const [donViId, setDonViId] = useState(
    initialStateModel?.initialState?.currentUser?.role?.organizationId,
  );
  const vaiTro = initialStateModel?.initialState?.currentUser?.role?.systemRole;

  return (
    <Card>
      <Form
        labelCol={{ span: 24 }}
        initialValues={{ ...thucDonMau?.record }}
        onFinish={async (values) => {
          if (thucDonMau.edit) {
            const response = await axios.put(
              `${ip3}/template-thuc-don/${thucDonMau?.record?._id}`,
              {
                ...thucDonMau?.record,
                ...values,
              },
            );
            notificationAlert('success', 'Chỉnh sửa thành công');
          } else {
            values.loaiHinhLop = thucDonMau?.loaiHinh;
            const response = await axios.post(`${ip3}/template-thuc-don`, { ...values, donViId });
            notificationAlert('success', 'Thêm mới thành công');
          }
          thucDonMau.getThucDonMauModel(
            initialStateModel?.initialState?.currentUser?.role?.systemRole === 'HieuTruong'
              ? { donViId, loaiHinhLop: thucDonMau?.loaiHinh }
              : { loaiHinhLop: thucDonMau?.loaiHinh },
          );
          thucDonMau.setRecord({});
          thucDonMau.setVisibleForm(false);
        }}
      >
        {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
          <Form.Item
            name="donViId"
            label="Trường"
            rules={[...rules.required]}
            style={{ marginBottom: 5 }}
          >
            <Select
              showSearch
              allowClear
              disabled={thucDonMau.edit}
              style={{ width: '100%' }}
              placeholder="Chọn trường"
              optionFilterProp="children"
              filterOption={(input, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={(value) => setDonViId(value)}
            >
              {thucDonMau.danhSachTruong?.map((item: ITruong.Record) => (
                <Select.Option key={item?._id} value={item?._id}>
                  {item?.tenDonVi}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        <Form.Item name="ten" label="Tên thực đơn mẫu" rules={[...rules.required]}>
          <Input />
        </Form.Item>
        <Form.Item name="loai" label="Loại thực đơn mẫu" rules={[...rules.required]}>
          <Select disabled={thucDonMau.edit}>
            {['Tuần', 'Ngày'].map((item) => (
              <Select.Option value={item}>{item}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <center>
          <Button type="primary" htmlType="submit">
            {thucDonMau?.edit ? 'Chỉnh sửa' : 'Thêm mới'}
          </Button>
        </center>
      </Form>
    </Card>
  );
};

export default FormThucDonMau;
