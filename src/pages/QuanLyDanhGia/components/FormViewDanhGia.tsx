/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import { Avatar, Button, Card, Col, Form, Image, Row } from 'antd';
import { useModel } from 'umi';
import type { KhaoSat as IKhaoSat } from '@/services/QuanLyKhaoSat';
import GridChoice from '@/pages/QuanLyKhaoSat/components/Question/GridChoice';
import NumericChoice from '@/pages/QuanLyKhaoSat/components/Question/NumericChoice';
import MultipleChoice from '@/pages/QuanLyKhaoSat/components/Question/MultipleChoice';
import SingleChoice from '@/pages/QuanLyKhaoSat/components/Question/SingleChoice';
import Text from '@/pages/QuanLyKhaoSat/components/Question/Text';
import React, {useEffect} from 'react';
import moment from "moment";

const FormViewDanhGia = () => {
  const [form] = Form.useForm();
  const { loading, setVisibleForm, record } = useModel('formdanhgia');
  const renderQuestion = (question: IKhaoSat.CauHoi, index: number) => {
    let questionEleMent = <div />;
    // const recordDapAn = record?.danhSachTraLoi?.find((item) => item.idCauHoi === question._id);
    if (question.loai === 0)
      questionEleMent = (
        <SingleChoice cauTraLoi={question.cauTraLoi} cauHoi={question?.cauHoi} stt={index + 1} />
      );
    else if (question.loai === 1)
      questionEleMent = (
        <MultipleChoice cauTraLoi={question.cauTraLoi} cauHoi={question?.cauHoi} stt={index + 1} />
      );
    else if (question.loai === 3)
      questionEleMent = <Text cauHoi={question?.cauHoi} stt={index + 1} />;
    else if (question.loai === 4)
      questionEleMent = (
        <GridChoice
          cauHoi={question?.cauHoi}
          hang={question.hang}
          cot={question.cot}
          stt={index + 1}
        />
      );
    else if (question.loai === 2)
      questionEleMent = (
        <NumericChoice
          luaChon={{ start: question.gioiHanDuoiTuyenTinh, end: question.gioiHanTrenTuyenTinh }}
        />
      );
    return (
      <div key={question._id}>
        <div>
          <b>{question.noiDungKhaoSat}</b>
        </div>
        <div>{questionEleMent}</div>
        <br />
      </div>
    );
  };
  return (
    <Card loading={loading} bordered={false}>
      <Form labelCol={{ span: 24 }} form={form}>
        <h3 style={{fontSize:'24px'}}>Tiêu đề: {record?.tieuDe}</h3>

        <p ><span style={{fontWeight:'600'}}>Mô tả:</span> {record?.moTa}</p>
        <p ><span style={{fontWeight:'600'}}>Thời gian bắt đầu đánh giá:</span> {moment(record?.thoiGianBatDauDanhGia).format("DD/MM/YYYY HH:mm")}</p>

        <div>
          <div>
            {record.noiDungKhaoSat?.map((cauHoi: IKhaoSat.CauHoi, index: number) =>
              renderQuestion(cauHoi, index),
            )}
          </div>
        </div>
        {/*<br />*/}
        {/*<Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>*/}
        {/*  <Button type="primary" onClick={() => setVisibleForm(false)}>*/}
        {/*    Đóng*/}
        {/*  </Button>*/}
        {/*</Form.Item>*/}
        <Row gutter={[20, 0]}>
          <Col xs={12} sm={6} md={6}>
            <Form.Item
              name="chuKy"
              label="Chữ ký"
              // rules={[...rules.fileRequired]}
              style={{ marginBottom: 5 }}
            >
              <Avatar shape="square" size={100} src={<Image src={record?.chuKy} />} />
            </Form.Item>
          </Col>
          <Col xs={12} sm={6} md={6}>
            <Form.Item
              name="anhDaiDien"
              label="Ảnh mô tả"
              // rules={[...rules.fileRequired]}
              style={{ marginBottom: 5 }}
            >
              <Avatar shape="square" size={100} src={<Image src={record?.anhDaiDien} />} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default FormViewDanhGia;
