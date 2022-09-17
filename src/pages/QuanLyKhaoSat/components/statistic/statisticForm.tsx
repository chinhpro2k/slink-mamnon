import TableBase from '@/components/Table';
import { Button, Card, Input, Modal, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { useModel } from '@@/plugin-model/useModel';
import React, { useEffect, useState } from 'react';
import DemoPie from '@/components/Chart/Pie';
import { DataStatistic } from '@/pages/NoiBo/components/thongKeTheoNgay';
import StackedColumnPlotChart from '@/components/Chart/StackedColumn';
import { EyeOutlined } from '@ant-design/icons';
import GridChoice from '@/pages/QuanLyKhaoSat/components/Question/GridChoice';
import Text from '@/pages/QuanLyKhaoSat/components/Question/Text';

const StatisticForm = () => {
  const { recordCauHoi, getStatisticKhaoSatModel, khaoSatId, dataStatistic } = useModel('khaosat');
  const { loading, getCauTraLoiModel, page, limit, total, cauTraLoi } = useModel('cautraloi');
  const [statistic, setStatistic] = useState<
    DataStatistic[] | { name: any; count: any; type: any }[]
  >([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [dataTableQuestion, setDataTableQuestion] = useState<any>();
  useEffect(() => {
    if (recordCauHoi) {
      // getStatisticKhaoSatModel(khaoSatId, recordCauHoi?._id);
    }
  }, [recordCauHoi]);
  const renderAnswerTable = (val: Record<string, any>[]) => {
    const sctl = val.map((el) => el.split('$$'));
    const dicCtl: { [field: string]: [string] } = {};
    sctl.forEach((el) => {
      const hang = el[0];
      const cot = el[1];
      if (dicCtl[hang]) {
        dicCtl[hang].push(cot);
      } else {
        dicCtl[hang] = [cot];
      }
    });
    const result = Object.keys(dicCtl).map((val) => {
      return {
        cauHoi: val,
        cauTraLoi: dicCtl[val],
      };
    });
    console.log('result', result);
    return (
      <>
        {result.map((val) => {
          return (
            <>
              <Typography.Title type="danger" level={5}>
                Câu hỏi: {val.cauHoi}
              </Typography.Title>
              {/*<p>Câu hỏi: {val.cauHoi}</p>*/}
              {val.cauTraLoi.map((val2, i) => {
                return (
                  <p style={{ marginBottom: '4px' }}>
                    - Câu trả lời {i + 1}: {val2}
                  </p>
                );
              })}
            </>
          );
        })}
      </>
    );
  };
  const columns: ColumnsType<any> = [
    {
      title: 'STT',
      dataIndex: 'index',
    },
    {
      title: 'Người trả lời',
      dataIndex: 'nguoiTL',
      key: 'age',
      render: (val) => <span>{val?.profile?.fullname}</span>,
    },
    {
      title: 'Câu trả lời',
      dataIndex: 'cauTraLoi',
      key: 'address',
      render: (val, recordVal) => {
        if (recordCauHoi?.loai === 4) {
          return <>{renderAnswerTable(val)}</>;
        } else {
          if (recordVal?.isKhac) {
            return (
              <a>
                {Array.isArray(val) &&
                  val.map((value) => {
                    return (
                      <p>
                        <span style={{ color: 'red' }}>- Câu trả lời khác:</span> {value}
                      </p>
                    );
                  })}
              </a>
            );
          } else {
            return (
              <a>
                {Array.isArray(val) &&
                  val.map((value) => {
                    return <p>- {value}</p>;
                  })}
              </a>
            );
          }
        }
      },
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'age',
      render: (val) => <span>{moment(val).format('HH:MM DD/MM/YYYY')}</span>,
    },
  ];
  // if (recordCauHoi?.loai === 4) {
  //   columns.push({
  //     title: 'Thao tác',
  //     align: 'center',
  //     render: (record) => {
  //       return (
  //         <Button
  //           type="default"
  //           shape="circle"
  //           onClick={() => {
  //             console.log('data',recordCauHoi)
  //             console.log('record',record)
  //             setDataTableQuestion(record)
  //             setIsModalVisible(true)
  //           }}
  //           title="Xem chi tiết"
  //         >
  //           <EyeOutlined />
  //         </Button>
  //       );
  //     },
  //     fixed: 'right',
  //     width: 150,
  //   });
  // }

  const setDataStatistic = () => {
    const arr: ((prevState: DataStatistic[]) => DataStatistic[]) | { name: any; count: any }[] = [];
    const arrTable:
      | ((prevState: DataStatistic[]) => DataStatistic[])
      | { name: any; count: any; type: any }[] = [];
    if (dataStatistic && Array.isArray(dataStatistic)) {
      if (recordCauHoi.loai !== 4) {
        dataStatistic?.map((val: { cauTraLoi: any; soNguoiChon: any }) => {
          arr.push({
            name: val.cauTraLoi,
            count: val.soNguoiChon ?? 0,
          });
        });
        setStatistic(arr);
      } else {
        dataStatistic?.map((val: any) => {
          Object.keys(val).forEach((key) => {
            if (key !== 'name') {
              arrTable.push({
                name: val.name,
                count: val[key] ?? 0,
                type: key,
              });
            }
          });
        });
        setStatistic(arrTable);
      }
    }
  };
  useEffect(() => {
    setDataStatistic();
  }, [dataStatistic]);
  return (
    <>
      {/*{recordCauHoi?.loai !== 3 && (*/}
      {/*  <div>*/}
      {/*    {dataStatistic && recordCauHoi.loai !== 4 ? (*/}
      {/*      <Card title={'Thống kê những câu trả lời có sẵn'} bordered={false}>*/}
      {/*        <DemoPie*/}
      {/*          height={350}*/}
      {/*          hideLegend*/}
      {/*          labelTotal={'Câu trả lời'}*/}
      {/*          data={statistic?.map((item: any) => ({*/}
      {/*            x: item?.name || 'Đang cập nhật',*/}
      {/*            y: item.count,*/}
      {/*          }))}*/}
      {/*        />*/}
      {/*      </Card>*/}
      {/*    ) : (*/}
      {/*      <Card title={'Thống kê những câu trả lời có sẵn'} bordered={false}>*/}
      {/*        <StackedColumnPlotChart*/}
      {/*          data={statistic?.map((item: any) => ({*/}
      {/*            name: item?.name || 'Đang cập nhật',*/}
      {/*            value: item.count,*/}
      {/*            type: item.type,*/}
      {/*          }))}*/}
      {/*        />*/}
      {/*      </Card>*/}
      {/*    )}*/}
      {/*  </div>*/}
      {/*)}*/}

      <TableBase
        border
        columns={columns}
        getData={() => getCauTraLoiModel(recordCauHoi?._id, recordCauHoi?.loai)}
        loading={loading}
        dependencies={[page, limit]}
        dataState={'cauTraLoi'}
        title={'Danh sách những câu trả lời'}
        modelName="cautraloi"
      >
        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          Tổng số:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={total}
          />
        </h3>
      </TableBase>
      {/*<Modal*/}
      {/*  title="Xem câu hỏi"*/}
      {/*  visible={isModalVisible}*/}
      {/*  footer={null}*/}
      {/*  onCancel={() => setIsModalVisible(false)}*/}
      {/*  width={'60%'}*/}
      {/*>*/}
      {/*  <GridChoice*/}
      {/*    cauHoi={recordCauHoi?.cauHoi ?? ''}*/}
      {/*    hang={recordCauHoi?.hang ?? []}*/}
      {/*    cot={recordCauHoi?.cot ?? []}*/}
      {/*  />*/}
      {/*</Modal>*/}
    </>
  );
};
export default StatisticForm;
