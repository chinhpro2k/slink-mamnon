/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import { Button, Card, Form } from 'antd';
import { useModel } from 'umi';
import SingleChoice from '../components/Question/SingleChoice';
import MultipleChoice from '../components/Question/MultipleChoice';
import Text from '../components/Question/Text';
import GridChoice from '../components/Question/GridChoice';
import NumericChoice from '../components/Question/NumericChoice';
import type { KhaoSat as IKhaoSat } from '@/services/QuanLyKhaoSat';

const FormBaiHoc = () => {
  const [form] = Form.useForm();
  const { loading, record, setVisibleForm } = useModel('khaosat');
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
    <Card loading={loading} title="Chi tiết khảo sát">
      <Form labelCol={{ span: 24 }} form={form}>
        <h3>Tiêu đề: {record?.tieuDe}</h3>

        <p>Mô tả: {record?.moTa}</p>
        <div>
          <div>
            {record.noiDungKhaoSat?.map((cauHoi: IKhaoSat.CauHoi, index: number) =>
              renderQuestion(cauHoi, index),
            )}
          </div>
        </div>
        <br />
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button type="primary" onClick={() => setVisibleForm(false)}>
            Đóng
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormBaiHoc;
