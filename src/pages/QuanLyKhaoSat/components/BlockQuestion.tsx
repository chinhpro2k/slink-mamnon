import rules from '@/utils/rules';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, Checkbox, Row, Col } from 'antd';
import { useState } from 'react';
import MultipleChoice from './QuestionType/MultipleChoice';
import SingleChoice from './QuestionType/SingleChoice';
import GridChoice from './QuestionType/GridChoice';
import NumericRange from './QuestionType/NumericChoice';
import { useModel } from 'umi';

const loaiCauHoi = [
  {
    value: 0,
    name: 'Chọn 1 đáp án',
  },
  { value: 1, name: 'Chọn nhiều đáp án' },
  // { value: 2, name: 'Đánh giá (dạng số)' },
  { value: 3, name: 'Câu trả lời Text' },
  { value: 4, name: 'Dạng bảng' },
  // { value: 'GridMultipleChoice', name: 'Dạng bảng (chọn nhiều)' },
];

const BlockQuestion = (props: { index: number; block: number }) => {
  const { record } = useModel('khaosat');
  const [questionType, setQuestionType] = useState<any>(
    record?.noiDungKhaoSat?.[props.index]?.loai ?? 0,
  );
  return (
    <>
      <Row gutter={[20, 0]}>
        <Col md={12} lg={16}>
          <Form.Item
            name={[props.index, 'cauHoi']}
            label="Nội dung câu hỏi"
            rules={[...rules.required]}
          >
            <Input placeholder="Nội dung câu hỏi" />
          </Form.Item>
        </Col>
        <Col md={12} lg={8}>
          <Form.Item
            name={[props.index, 'loai']}
            label="Loại"
            rules={[...rules.required]}
            initialValue={questionType}
          >
            <Select
              onChange={(val: string) => setQuestionType(val)}
              placeholder="Chọn loại câu hỏi"
            >
              {loaiCauHoi.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {[0, 1].includes(questionType) && (
        <Form.List
          name={[props.index, 'cauTraLoi']}
          rules={[
            {
              validator: async (_, names) => {
                if (!names || names.length < 1) {
                  return Promise.reject(new Error('Ít nhất 1 đáp án'));
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
                    {questionType === 0 && (
                      <SingleChoice
                        index={index}
                        remove={remove}
                        fieldName={field.name}
                        isKhac={record?.noiDungKhaoSat?.[props.index]?.cauTraLoi?.[index]?.isKhac}
                      />
                    )}
                    {questionType === 1 && (
                      <MultipleChoice index={index} remove={remove} fieldName={field.name} />
                    )}
                  </div>
                ))}
                <Form.Item>
                  <Form.ErrorList errors={errors} />
                  <Button type="primary" onClick={() => add()} icon={<PlusOutlined />}>
                    Thêm đáp án
                  </Button>
                </Form.Item>
              </>
            );
          }}
        </Form.List>
      )}

      {questionType === 0 && (
        <Form.Item
          valuePropName="checked"
          name={[props.index, 'isKhac']}
          initialValue={
            record?.noiDungKhaoSat?.[props.index]?.cauTraLoi?.find(
              (item: { isKhac: boolean }) => item?.isKhac,
            )?.isKhac ?? false
          }
        >
          <Checkbox>Câu trả lời khác</Checkbox>
        </Form.Item>
      )}
      <Form.Item valuePropName="checked" name={[props.index, 'isRequired']}>
        <Checkbox>Bắt buộc</Checkbox>
      </Form.Item>

      {[4, 'GridMultipleChoice'].includes(questionType) && <GridChoice name={props.index} />}
      {questionType === 2 && <NumericRange index={props.index} />}
    </>
  );
};

export default BlockQuestion;
