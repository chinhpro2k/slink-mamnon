import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Form } from 'antd';
import BlockQuestion from './BlockQuestion';

const Block = () => {
  return (
    <>
      <Form.List
        name="noiDungKhaoSat"
        rules={[
          {
            validator: async (_, names) => {
              if (!names || names.length < 1) {
                return Promise.reject(new Error('Ít nhất 1 câu hỏi'));
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
                <>
                  <Card
                    // className={styles.block}
                    key={field.key}
                    title={
                      <>
                        <div style={{ float: 'left' }}>Câu hỏi {index + 1}</div>
                        <CloseCircleOutlined
                          style={{ float: 'right' }}
                          onClick={() => remove(field.name)}
                        />
                      </>
                    }
                  >
                    <BlockQuestion index={index} block={field.name} />
                  </Card>
                  <br />
                </>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: '100%' }}
                  icon={<PlusOutlined />}
                >
                  Thêm câu hỏi
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          );
        }}
      </Form.List>
    </>
  );
};

export default Block;
