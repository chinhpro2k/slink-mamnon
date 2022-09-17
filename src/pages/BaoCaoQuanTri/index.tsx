import React, { useEffect, useState } from 'react';
import { useModel } from '@@/plugin-model/useModel';
import { Button, Card, Col, DatePicker, Row, Table, Tabs, Typography } from 'antd';
import moment from 'moment';
import TableBase from '@/components/Table';
import {CalculatorOutlined, ExportOutlined} from '@ant-design/icons';
const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
});
const BaoCaoQuanTri = () => {
  const [selectDate, setSelectDate] = useState<any>();
  const { getDataBaoCao, page, limit, cond, loading, exportBaoCao, tinhToanBaoCao } =
    useModel('baocaoquantri');
  const [ngay, setNgay] = useState<number>(new Date().getDate());
  const [thang, setThang] = useState<number>(new Date().getMonth()-1);
  const [nam, setNam] = useState<number>(new Date().getFullYear());
  const [debouneTinhLai, setDebouneTinhLai] = useState<boolean>(false);
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId ?? '';
  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
    },
    {
      title: 'Trường',
      dataIndex: 'truong',
      align: 'center',
      render: (value) => value?.tenDonVi ?? '',
    },
    {
      title: 'Số user',
      dataIndex: 'soUserActive',
      align: 'center',
      // render: (value) => value.khoiKienThuc,
    },
    {
      title: 'Giá',
      dataIndex: 'giaTienTren1User',
      align: 'center',
      render: (value) => formatter.format(value ?? 0),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'tong',
      align: 'center',
      render: (value, record) => (
        <span>{formatter.format(record.giaTienTren1User * record.soUserActive ?? 0)}</span>
      ),
    },
  ];

  useEffect(() => {
    tinhToanBaoCao().then(() => {
      getDataBaoCao({
        cond: { thang: thang, nam: nam },
      });
    });
  }, []);
  const onChange = (date: any) => {
    setSelectDate(date);
    setNgay(new Date(date).getDate());
    setThang(new Date(date).getMonth());
    setNam(new Date(date).getFullYear());
    getDataBaoCao({
      cond: { thang: new Date(date).getMonth(), nam: new Date(date).getFullYear() },
    });
  };
  const handleReCal = () => {
    if (!debouneTinhLai) {
      setDebouneTinhLai(true);
      tinhToanBaoCao().then(() => {
        getDataBaoCao({
          cond: { thang: thang, nam: nam },
        });
      });
    }
    setTimeout(() => {
      setDebouneTinhLai(false);
    }, 2000);
  };
  return (
    <div>
      <Row>
        <Col span={24} style={{ marginBottom: '8px' }}>
          <DatePicker
            onChange={onChange}
            defaultValue={moment().month(thang)}
            picker="month"
            format="MM-YYYY"
            placeholder="Chọn tháng"
            style={{ marginRight: '10px' }}
          />
          <Button
            style={{ width: '10%', marginRight: '10px' }}
            disabled={
              // record?.baiBaoKhoaHoc?.length === 0 &&
              // record?.nhiemVuKHCN?.length === 0 &&
              // record?.sachPhucVuDaoTao?.length === 0
              false
            }
            onClick={() =>
              exportBaoCao({ cond: { thang: thang, nam: nam }, nam: nam, thang: thang })
            }
            loading={loading}
            type="primary"
            icon={<ExportOutlined />}
          >
            Xuất Excel
          </Button>
          {/*<Button*/}
          {/*  style={{ width: '10%', marginRight: '10px' }}*/}
          {/*  disabled={*/}
          {/*    // record?.baiBaoKhoaHoc?.length === 0 &&*/}
          {/*    // record?.nhiemVuKHCN?.length === 0 &&*/}
          {/*    // record?.sachPhucVuDaoTao?.length === 0*/}
          {/*    false*/}
          {/*  }*/}
          {/*  icon={<CalculatorOutlined />}*/}
          {/*  onClick={() => handleReCal()}*/}
          {/*  loading={loading}*/}
          {/*  type="primary"*/}
          {/*>*/}
          {/*  Tính lại*/}
          {/*</Button>*/}
        </Col>
        <Col span={24}>
          <TableBase
            border
            columns={columns}
            getData={() =>
              getDataBaoCao({
                cond: { thang: thang, nam: nam },
              })
            }
            dependencies={[page, limit, cond]}
            loading={loading}
            modelName="baocaoquantri"
            dataState={'dataBaoCao'}
            title="Báo cáo quản trị"
            summary={(pageData) => {
              let totalPrice = 0;
              let totalRepayment = 0;
              let soUser = 0;
              pageData.forEach((val) => {
                if (val.soUserActive) {
                  soUser += val.soUserActive;
                }

                if (val.giaTienTren1User) {
                  totalPrice += val.giaTienTren1User;
                }
                if (val.giaTienTren1User && val.soUserActive) {
                  totalRepayment += val.soUserActive * val.giaTienTren1User;
                }
              });

              return (
                <>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} align={'center'}>
                      <Typography.Text type={'danger'} strong>
                        Tổng
                      </Typography.Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell align={'center'} index={1}>
                      {/*<Typography.Text type={'danger'} strong>*/}
                      {/*  {formatter.format(totalPrice ?? 0)}*/}
                      {/*</Typography.Text>*/}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell align={'center'} index={2}>
                      <Typography.Text type={'danger'} strong>
                        {soUser}
                      </Typography.Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell align={'center'} index={3}>
                      <Typography.Text type={'danger'} strong>
                        {formatter.format(totalPrice ?? 0)}
                      </Typography.Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell align={'center'} index={4}>
                      <Typography.Text type={'danger'} strong>
                        {formatter.format(totalRepayment ?? 0)}
                      </Typography.Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </>
              );
            }}
          ></TableBase>
        </Col>
      </Row>
    </div>
  );
};
export default BaoCaoQuanTri;
