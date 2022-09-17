/* eslint-disable no-underscore-dangle */
import { Button, Card, Divider, Form } from 'antd';
import { useModel } from 'umi';

const ThongKe = () => {
  const { loading, danhSachThongKe, setVisibleForm, record } = useModel('quanlydanhgia');
  const renderThongKe = (question: any, index: number) => {
    return (
      <div key={question?._id}>
        <div>
          <b>
            Câu {index + 1}: {question.cauHoi}
          </b>
        </div>
        <div>
          {question?.cauTraLoi?.map((item: string, key: number) => (
            <span key={key}>
              {question?.loaiCauHoi === 4 && `${key + 1}. `}
              {question?.loaiCauHoi !== 4 ? (
                <span>Câu trả lời: {item}</span>
              ) : (
                item
                  ?.replace('$$', ',')
                  .split(',')
                  .map((val, indexCauHoi: number) => {
                    if (indexCauHoi === 0) {
                      return <span>Câu hỏi: {val}</span>;
                    }
                    return <div>Câu trả lời: {val}</div>;
                  })
              )}
              <br />
            </span>
          ))}
        </div>
        <br />
        <Divider type="horizontal" />
      </div>
    );
  };
  return (
    <Card loading={loading} title="Thống kê kết quả đánh giá">
      <h3>
        Họ và tên giáo viên: <b>{record?.giaoVien?.profile?.fullname}</b>
      </h3>
      <div>{danhSachThongKe?.map((item: any, index: number) => renderThongKe(item, index))}</div>
      <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
        <Button type="primary" onClick={() => setVisibleForm(false)}>
          Đóng
        </Button>
      </Form.Item>
    </Card>
  );
};

export default ThongKe;
