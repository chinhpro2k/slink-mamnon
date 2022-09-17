import rules from '@/utils/rules';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row } from 'antd';
import styles from '../block.css';

const GridChoice = (props: { name: number }) => {
  return (
    <Row gutter={[40, 0]}>
      <Col span={12}>
        <Form.List
          name={[props.name, 'hang']}
          rules={[
            {
              validator: async (_, names) => {
                if (!names || names.length < 1) {
                  return Promise.reject(new Error('Ít nhất 1 hàng'));
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
                  <Row>
                    <Col sm={22}>
                      <Form.Item name={[index]} rules={[...rules.required]}>
                        <Input placeholder="Nhập nội dung" />
                      </Form.Item>
                    </Col>
                    <Col sm={2}>
                      <MinusCircleOutlined
                        className={styles.deleteAnswer}
                        onClick={() => remove(field.name)}
                      />
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Form.ErrorList errors={errors} />
                  <Button type="primary" onClick={() => add()} icon={<PlusOutlined />}>
                    Thêm hàng
                  </Button>
                </Form.Item>
              </>
            );
          }}
        </Form.List>
      </Col>
      <Col span={12}>
        <Form.List
          name={[props.name, 'cot']}
          rules={[
            {
              validator: async (_, names) => {
                if (!names || names.length < 1) {
                  return Promise.reject(new Error('Ít nhất 1 cột'));
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
                  <Row>
                    <Col sm={22}>
                      <Form.Item name={[index]} rules={[...rules.required]}>
                        <Input placeholder="Nhập nội dung" />
                      </Form.Item>
                    </Col>
                    <Col sm={2}>
                      <MinusCircleOutlined
                        className={styles.deleteAnswer}
                        onClick={() => remove(field.name)}
                      />
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Form.ErrorList errors={errors} />
                  <Button type="primary" onClick={() => add()} icon={<PlusOutlined />}>
                    Thêm cột
                  </Button>
                </Form.Item>
              </>
            );
          }}
        </Form.List>
      </Col>
    </Row>
  );
};

export default GridChoice;
