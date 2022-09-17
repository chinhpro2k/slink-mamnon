/* eslint-disable no-nested-ternary */
import rules from '@/utils/rules';
import { MinusCircleOutlined } from '@ant-design/icons';
import { Col, Form, Input, Row } from 'antd';
import styles from '../block.css';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const SingleChoice = (props: {
  index: number;
  type?: string;
  remove: (index: number | number[]) => void;
  fieldName: number;
  isKhac?: boolean;
}) => {
  return (
    <Form.Item style={{ marginBottom: 0 }}>
      <Row>
        <Col sm={22}>
          <Form.Item
            labelAlign="left"
            {...layout}
            name={[props.index, 'luaChon']}
            rules={props?.isKhac ? [] : [...rules.required]}
            label={
              props.type !== 'grid' && !props?.isKhac
                ? `Lựa chọn ${props.index + 1}`
                : props?.isKhac
                ? 'Lựa chọn khác'
                : false
            }
          >
            <Input
              placeholder={
                props.type !== 'grid' && !props?.isKhac
                  ? `Nội dung câu trả lời ${props.index + 1}`
                  : props?.isKhac
                  ? 'Nội dung câu trả lời khác'
                  : 'Nhập nội dung'
              }
              disabled={props?.isKhac}
            />
          </Form.Item>
        </Col>
        <Col sm={2}>
          <MinusCircleOutlined
            className={styles.deleteAnswer}
            onClick={() => props.remove(props.fieldName)}
          />
        </Col>
      </Row>
    </Form.Item>
  );
};

export default SingleChoice;
