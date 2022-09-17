import rules from '@/utils/rules';
import { Col, Form, Input, InputNumber, Row } from 'antd';

const width100 = {
  width: '100%',
};
const marginBT = {
  marginBottom: '5px',
};

const BlockDanhMucMonAn = (props: { index: number; block: number }) => {
  return (
    <>
      <Row gutter={[20, 0]}>
        <Col md={12} lg={12}>
          <Form.Item
            name={[props.index, 'tenThanhPhan']}
            label="Tên thành phần"
            rules={[...rules.required]}
            style={marginBT}
          >
            <Input placeholder="Tên thành phần" />
          </Form.Item>
        </Col>
        <Col md={12} lg={12}>
          <Form.Item
            name={[props.index, 'dinhLuongGoc']}
            label="Định lượng mẫu giáo gốc"
            rules={[...rules.required, ...rules.float(undefined, 0, 2)]}
            style={marginBT}
          >
            <InputNumber placeholder="Định lượng mẫu giáo gốc" style={width100} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[20, 0]}>
        <Col sm={24} lg={8}>
          <Form.Item
            name={[props.index, 'tyLeThaiBo']}
            label="Tỷ lệ thải bỏ"
            rules={[...rules.required, ...rules.float(undefined, 0, 2)]}
            style={marginBT}
          >
            <InputNumber placeholder="Tỷ lệ thải bỏ" style={width100} />
          </Form.Item>
        </Col>
        <Col md={24} lg={8}>
          <Form.Item
            name={[props.index, 'donGia']}
            label="Đơn giá"
            rules={[...rules.required]}
            style={marginBT}
          >
            <InputNumber
              placeholder="Đơn giá"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              style={width100}
            />
          </Form.Item>
        </Col>
        <Col md={24} lg={8}>
          <Form.Item
            name={[props.index, 'protitNhaTre']}
            label="Protit nhà trẻ"
            rules={[...rules.required, ...rules.float(undefined, 0, 2)]}
            style={marginBT}
          >
            <InputNumber placeholder="Protit nhà trẻ" style={width100} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[20, 0]}>
        <Col md={24} lg={8}>
          <Form.Item
            name={[props.index, 'lipitNhaTre']}
            label="Lipit nhà trẻ"
            rules={[...rules.required, ...rules.float(undefined, 0, 2)]}
            style={marginBT}
          >
            <InputNumber placeholder="Protit nhà trẻ" style={width100} />
          </Form.Item>
        </Col>
        <Col md={24} lg={8}>
          <Form.Item
            name={[props.index, 'gluxitNhaTre']}
            label="Gluxit nhà trẻ"
            rules={[...rules.required, ...rules.float(undefined, 0, 2)]}
            style={marginBT}
          >
            <InputNumber placeholder="Gluxit nhà trẻ" style={width100} />
          </Form.Item>
        </Col>
        <Col md={24} lg={8}>
          <Form.Item
            name={[props.index, 'calo']}
            label="Calo/100g"
            rules={[...rules.required, ...rules.float(undefined, 0, 2)]}
            style={marginBT}
          >
            <InputNumber placeholder="Calo/100g" style={width100} />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default BlockDanhMucMonAn;
