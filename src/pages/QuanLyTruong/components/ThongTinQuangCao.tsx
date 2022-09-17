import { Row, Col, Form, Tabs } from 'antd';
import TinyEditor from '@/components/TinyEditor/Tiny';

const ThongTinQuangCao = (props) => {
  const { newRecord, edit, disable } = props;
  return (
    <Tabs type="card">
      <Tabs.TabPane forceRender tab="Điểm nổi bật" key="diemNoiBatHtml">
        <span>Nội dung điểm nổi bật</span>
        <Row gutter={[16, 0]}>
          <Col span={24}>
            <Form.Item
              name="diemNoiBatHtml"
              label=""
              initialValue={edit ? { text: newRecord?.diemNoiBatHtml } : { text: '' }}
            >
              <TinyEditor disable={disable} />
            </Form.Item>
          </Col>
        </Row>
      </Tabs.TabPane>
      <Tabs.TabPane forceRender tab="Cơ sở vật chất" key="coSoVatChatHtml">
        <span>Nội dung cơ sở vật chật</span>
        <Row gutter={[16, 0]}>
          <Col span={24}>
            <Form.Item
              name="coSoVatChatHtml"
              label=""
              initialValue={edit ? { text: newRecord?.coSoVatChatHtml } : { text: '' }}
            >
              <TinyEditor disable={disable} />
            </Form.Item>
          </Col>
        </Row>
      </Tabs.TabPane>
      <Tabs.TabPane forceRender tab="Tiện ích" key="tienIchHtml">
        <span>Nội dung tiện ích</span>
        <Row gutter={[16, 0]}>
          <Col span={24}>
            <Form.Item
              name="tienIchHtml"
              label=""
              initialValue={edit ? { text: newRecord?.tienIchHtml } : { text: '' }}
            >
              <TinyEditor disable={disable} />
            </Form.Item>
          </Col>
        </Row>
      </Tabs.TabPane>
      <Tabs.TabPane forceRender tab="Giới thiệu chung" key="gioiThieuChungHtml">
        <span>Nội dung giới thiệu chung</span>
        <Row gutter={[16, 0]}>
          <Col span={24}>
            <Form.Item
              name="gioiThieuChungHtml"
              label=""
              initialValue={edit ? { text: newRecord?.gioiThieuChungHtml } : { text: '' }}
            >
              <TinyEditor disable={disable} />
            </Form.Item>
          </Col>
        </Row>
      </Tabs.TabPane>
      <Tabs.TabPane forceRender tab="Chương trình học" key="chuongTrinhHocHtml">
        <span>Nội dung chương trình học</span>
        <Row gutter={[16, 0]}>
          <Col span={24}>
            <Form.Item
              name="chuongTrinhHocHtml"
              label=""
              initialValue={edit ? { text: newRecord?.chuongTrinhHocHtml } : { text: '' }}
            >
              <TinyEditor disable={disable} />
            </Form.Item>
          </Col>
        </Row>
      </Tabs.TabPane>
      <Tabs.TabPane forceRender tab="Đội ngũ giảng viên" key="doiNguGiaoVienHtml">
        <span>Nội dung đội ngũ giảng viên</span>
        <Row gutter={[16, 0]}>
          <Col span={24}>
            <Form.Item
              name="doiNguGiaoVienHtml"
              label=""
              initialValue={edit ? { text: newRecord?.doiNguGiaoVienHtml } : { text: '' }}
            >
              <TinyEditor disable={disable} />
            </Form.Item>
          </Col>
        </Row>
      </Tabs.TabPane>
      <Tabs.TabPane forceRender tab="Chế độ dinh dưỡng" key="cheDoDinhDuongHtml">
        <span>Nội dung chế độ dinh dưỡng</span>
        <Row gutter={[16, 0]}>
          <Col span={24}>
            <Form.Item
              name="cheDoDinhDuongHtml"
              label=""
              initialValue={edit ? { text: newRecord?.cheDoDinhDuongHtml } : { text: '' }}
            >
              <TinyEditor disable={disable} />
            </Form.Item>
          </Col>
        </Row>
      </Tabs.TabPane>
      <Tabs.TabPane forceRender tab="Chi phí khác" key="chiPhiKhacHtml">
        <span>Nội dung chi phí khác</span>
        <Row gutter={[16, 0]}>
          <Col span={24}>
            <Form.Item
              name="chiPhiKhacHtml"
              label=""
              initialValue={edit ? { text: newRecord?.chiPhiKhacHtml } : { text: '' }}
            >
              <TinyEditor disable={disable} />
            </Form.Item>
          </Col>
        </Row>
      </Tabs.TabPane>
    </Tabs>
  );
};

export default ThongTinQuangCao;
