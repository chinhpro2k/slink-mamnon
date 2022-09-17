/* eslint-disable no-underscore-dangle */
import type { KhaoSat as IKhaoSat } from '@/services/QuanLyKhaoSat';
import { Button, Card, Divider, Form } from 'antd';
import { useModel } from 'umi';
import ReadPDF from "@/components/ReadPDF";
import {useEffect} from "react";

const ThongKe = () => {
  const { loading, thongKe, setVisibleForm, record } = useModel('formdanhgia');
  const tenDonVi = localStorage.getItem('tenDonVi');
  const { initialState } = useModel('@@initialState');
  const donVi = initialState?.currentUser?.role?.organization?.tenDonVi;
  const vaiTro = localStorage.getItem('vaiTro');
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
  useEffect(()=>{
    console.log("thong ke",thongKe)
  },[thongKe])
  return (
    <Card loading={loading} title="Thống kê kết quả đánh giá" bordered={false}>
      {/*<h3>*/}
      {/*  Họ và tên con: <b>{record?.hoTen}</b>*/}
      {/*</h3>*/}
      {/*<h3>*/}
      {/*  Lớp: <b>{vaiTro === 'HieuTruong' ? tenDonVi : donVi}</b>*/}
      {/*</h3>*/}
      {/*<div>*/}
      {/*  {thongKe?.map((item: IKhaoSat.ThongKeKhoi, index: number) => renderThongKe(item, index))}*/}
      {/*</div>*/}
      {/*<Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>*/}
      {/*  <Button type="primary" onClick={() => setVisibleForm(false)}>*/}
      {/*    Đóng*/}
      {/*  </Button>*/}
      {/*</Form.Item>*/}
      <ReadPDF fileUrl={thongKe?.[0]?.urlFileExport}/>
    </Card>
  );
};

export default ThongKe;
