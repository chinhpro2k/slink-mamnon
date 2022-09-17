/* eslint-disable no-underscore-dangle */
import { Form, Input, Button, Row } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import rules from '@/utils/rules';

const FormTaoTemplateTuLich = ({ date, selectedLop, view, setVisibleTaoTemplate }: any) => {
  const lichHoc = useModel('lichhoc');
  return (
    <Form
      onFinish={async (values) => {
        const nam = moment(date).year();
        let payload = {
          donViIdFrom: selectedLop?._id,
          donViIdTo: selectedLop?._id,
          chuongTrinhDaoTaoId: selectedLop?.chuongTrinhDaoTaoId,
          nam,
          ...values,
        };
        if (view === 'week') {
          const tuan = moment(date).isoWeek();
          payload = {
            ...payload,
            tuan,
          };
        }
        if (view === 'day') {
          const thang = moment(date).month();
          const ngay = moment(date).date();
          payload = {
            ...payload,
            thang,
            ngay,
          };
        }

        await lichHoc.addTemplateFromLichModel(payload);
        setVisibleTaoTemplate(false);
      }}
      initialValues={{
        loai: view === 'week' ? 'Tuần' : 'Ngày',
      }}
      labelCol={{ span: 24 }}
    >
      <Form.Item
        name="ten"
        label="Tên template"
        rules={[...rules.required]}
        style={{ marginBottom: 5 }}
      >
        <Input />
      </Form.Item>
      <Form.Item name="loai" label="Loại template">
        <Input disabled />
      </Form.Item>
      <Row justify="center">
        <Button htmlType="submit" type="primary">
          Thêm mới
        </Button>
      </Row>
    </Form>
  );
};

export default FormTaoTemplateTuLich;
