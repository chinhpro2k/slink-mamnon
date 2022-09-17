import { Form, Input, InputNumber, Card, Row, Col, Button } from 'antd';
import { useModel } from 'umi';
import rules from '@/utils/rules';
import { postGoiThanhToan } from '../service';
const FormGoiThanhToan = () => {
  const goiThanhToan = useModel('goithanhtoan');
  return (
    <Card bordered title={goiThanhToan.edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form
        initialValues={{
          ...goiThanhToan.record,
          // price: goiThanhToan?.record?.price?.[0] ?? 0
        }}
        layout="vertical"
        onFinish={async (values) => {
          const newValue = {
            ...values,
            isActive: true,
            // prices: [values?.prices],
          };
          const response = await postGoiThanhToan(newValue);
          goiThanhToan.getGoiThanhToanModel();
        }}
      >
        <Form.Item name="tenGoi" label="Tên gói" rules={[...rules.required]}>
          <Input placeholder="Tên gói" />
        </Form.Item>
        <Form.Item name="code" label="Mã code" rules={[...rules.required]}>
          <Input placeholder="Mã code" />
        </Form.Item>
        <Row>
          <Col xs={12}>
            <Form.Item name="thoiGianGoi" label="Thời gian gói" rules={[...rules.required]}>
              <InputNumber
                placeholder="Tên gói"
                min={0}
                disabled={goiThanhToan.edit}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col xs={12}>
            <Form.Item name="prices" label="Giá tiền" rules={[...rules.required]}>
              <InputNumber
                placeholder="Giá tiền"
                min={0}
                disabled={goiThanhToan.edit}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="moTa" label="Mô tả">
          <Input.TextArea placeholder="Mô tả" />
        </Form.Item>
        <Form.Item>
          <center>
            <Button type="primary" htmlType="submit">
              {goiThanhToan.edit ? 'Chỉnh sửa' : 'Thêm mới'}
            </Button>
          </center>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormGoiThanhToan;
