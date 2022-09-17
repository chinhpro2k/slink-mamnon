import type { KhaoSat as IKhaoSat } from '@/services/QuanLyKhaoSat';
import { Button, Card, Collapse, Divider, Form, Input, Modal, Table } from 'antd';
import { useModel } from 'umi';
import { ColumnsType } from 'antd/es/table';
import TableBase from '@/components/Table';
import moment from 'moment';
import { BaiHoc as IBaiHoc } from '@/services/BaiHoc';
import React, { useState } from 'react';
import { CopyOutlined, EyeOutlined, FullscreenOutlined } from '@ant-design/icons';
import StatisticForm from '@/pages/QuanLyKhaoSat/components/statistic/statisticForm';
import GridChoice from '@/pages/QuanLyKhaoSat/components/Question/GridChoice';
import Text from '@/pages/QuanLyKhaoSat/components/Question/Text';

const ThongKe = () => {
  const {
    loading,
    thongKe,
    setVisibleForm,
    getCauTraLoiModel,
    record,
    page,
    limit,
    setLoading,
    total,
    getResultKhaoSatModel,
    setFormStatistic,
    setRecordCauHoi,
    setKhaoSatId,
  } = useModel('khaosat');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [dataTableQuestion, setDataTableQuestion] = useState<any>();
  const renderThongKe = (question: any, index: number) => {
    switch (question?.loai) {
      case 0:
        return (
          <div key={question?._id}>
            <div>
              <b>
                Câu {index + 1}: {question?.cauHoi}
              </b>
            </div>
            {/*{question?.loai === 3 && (*/}
            {/*  <div>*/}
            {/*    <b>Số lượt trả lời: {question?.soNguoiTraLoi ?? 0}</b>*/}
            {/*  </div>*/}
            {/*)}*/}
            {/*<div><SingleChoice ketQua={question} /></div>*/}
            <br />
          </div>
        );
        break;
      case 1:
        return (
          <div key={question?._id}>
            <div>
              <b>
                Câu {index + 1}: {question?.cauHoi}
              </b>
            </div>
            {/*{question?.loai === 3 && (*/}
            {/*  <div>*/}
            {/*    <b>Số lượt trả lời: {question?.soNguoiTraLoi ?? 0}</b>*/}
            {/*  </div>*/}
            {/*)}*/}
            {/*<div><MultipleChoice ketQua={question} /></div>*/}
            <br />
          </div>
        );
        break;
      case 2:
        return (
          <div key={question?._id}>
            <div>
              <b>
                Câu {index + 1}: {question?.cauHoi}
              </b>
            </div>
            {/*{question?.loai === 3 && (*/}
            {/*  <div>*/}
            {/*    <b>Số lượt trả lời: {question?.soNguoiTraLoi ?? 0}</b>*/}
            {/*  </div>*/}
            {/*)}*/}
            {/*<div><NumericChoice ketQua={question?.tongHop} /></div>*/}
            <br />
          </div>
        );
        break;
      case 4:
        return (
          <div key={question?._id}>
            <div>
              <b>
                Câu {index + 1}: {question?.cauHoi}
              </b>
            </div>
            {/*{question?.loai === 3 && (*/}
            {/*  <div>*/}
            {/*    <b>Số lượt trả lời: {question?.soNguoiTraLoi ?? 0}</b>*/}
            {/*  </div>*/}
            {/*)}*/}
            {/*<div><GridChoice ketQua={question} /></div>*/}
            <br />
          </div>
        );
        break;
      default:
        return (
          <div key={question?._id}>
            <div>
              <b>
                Câu {index + 1}: {question?.cauHoi}
              </b>
            </div>
            {/*{question?.loai === 3 && (*/}
            {/*  <div>*/}
            {/*    <b>Số lượt trả lời: {question?.soNguoiTraLoi ?? 0}</b>*/}
            {/*  </div>*/}
            {/*)}*/}
            {/*<div><SingleChoice ketQua={question} /></div>*/}
            <br />
          </div>
        );
        break;
    }
  };
  const onChange = (key: string | string[]) => {
    if (key) {
      setLoading(true);
      const loaiCauHoi = thongKe.find(
        (item: { cauHoiId: string }) => item.cauHoiId === (key as string),
      );
      console.log('loai cau hoi', loaiCauHoi);
      getCauTraLoiModel(key as string, loaiCauHoi.loai);
    }
  };
  const renderLast1 = (record: any) => {
    return (
      <React.Fragment>
        <Button
          type="default"
          shape="circle"
          onClick={() => {
            setRecordCauHoi(record);
            setFormStatistic(true);
          }}
          title="Xem chi tiết"
        >
          <EyeOutlined />
        </Button>
      </React.Fragment>
    );
  };
  const columnsQuestion: ColumnsType<any> = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
    },
    {
      title: 'Câu hỏi',
      dataIndex: 'cauHoi',
      key: 'age',
      render: (val) => <span>{val}</span>,
    },
    {
      title: 'Câu trả lời',
      dataIndex: 'cauTraLoi',
      key: 'address',
      render: (val, recordVal) => {
        if (val) {
          return (
            <a>
              {Array.isArray(val) &&
                val.map((value, i) => {
                  {
                    if (value.isKhac) {
                      return <p>-Đáp án khác</p>;
                    } else {
                      return (
                        <p>
                          -Đáp án {i + 1}: {value?.luaChon}
                        </p>
                      );
                    }
                  }
                })}
            </a>
          );
        } else {
          return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <FullscreenOutlined
                title={'Xem chi tiết'}
                style={{ fontSize: '32px', cursor: 'pointer' }}
                onClick={() => {
                  setDataTableQuestion(recordVal);
                  setIsModalVisible(true);
                }}
              />
            </div>
          );
        }
      },
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      align: 'center',
      render: (val) => <span>{moment(val).format('HH:MM DD/MM/YYYY')}</span>,
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: any) => renderLast1(record),
    },
  ];

  return (
    <Card title="Thống kê kết quả">
      <TableBase
        border
        columns={columnsQuestion}
        getData={() => getResultKhaoSatModel(record?._id)}
        loading={loading}
        dependencies={[page, limit]}
        dataState={'thongKe'}
        modelName="khaosat"
        Form={StatisticForm}
        isNotPagination={true}
        visibleState={'formStatistic'}
        setVisibleState={'setFormStatistic'}
        widthDrawer={'60%'}
      ></TableBase>
      <Form.Item style={{ textAlign: 'center', marginBottom: 0, marginTop: '20px' }}>
        <Button type="primary" onClick={() => setVisibleForm(false)}>
          Đóng
        </Button>
      </Form.Item>
      <Modal
        title="Xem câu hỏi"
        visible={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
        width={'60%'}
      >
        {dataTableQuestion?.loai !== 3 ? (
          <GridChoice
            cauHoi={dataTableQuestion?.cauHoi ?? ''}
            hang={dataTableQuestion?.hang ?? []}
            cot={dataTableQuestion?.cot ?? []}
          />
        ) : (
          <Text cauHoi={dataTableQuestion?.cauHoi} />
        )}
      </Modal>
    </Card>
  );
};

export default ThongKe;
