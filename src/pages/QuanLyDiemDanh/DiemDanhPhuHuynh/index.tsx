/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { DiemDanhPhuHuynh as IDiemDanhPhuHuynh } from '@/services/DiemDanhPhuHuynh';
import type { IColumn } from '@/utils/interfaces';
import { Button, Checkbox, DatePicker, Input, Tag } from 'antd';
import type { Moment } from 'moment';
import moment from 'moment';
import React, { useState } from 'react';
import { useModel } from 'umi';

const { RangePicker } = DatePicker;

const DiemDanhPhuHuynh = (props: { checkCuoiGio?: boolean; checkMuon?: boolean }) => {
  const [checkDiemDanh, setCheckDiemDanh] = useState(false);
  const [daXacNhan, setDaXacNhan] = useState(false);
  const initialState = useModel('@@initialState');
  const childId = initialState?.initialState?.currentUser?.role?.childId;
  const organizationId = initialState?.initialState?.currentUser?.role?.organizationId;
  const phuHuynhId = initialState?.initialState?.currentUser?._id;
  const {
    loading: loadingDiemDanhPhuHuynh,
    getDiemDanhPhuHuynhModel,
    total,
    page,
    setPage,
    limit,
    setLimit,
    cond,
    date,
    setCondition,
    postDiemDanhModel,
    getDiemDanhTheoNgayModel,
  } = useModel('diemdanhphuhuynh');

  const getDiemDanhTheoNgay = async (dateSelect: Moment) => {
    const ttDiemDanh = await getDiemDanhTheoNgayModel({
      ngay: moment(dateSelect).date(),
      thang: moment(dateSelect).month(),
      nam: moment(dateSelect).year(),
    });
    if (ttDiemDanh?.nguoiDiemDanhId) {
      setCheckDiemDanh(true);
      setDaXacNhan(true);
    } else {
      setCheckDiemDanh(false);
      setDaXacNhan(false);
    }
  };

  React.useEffect(() => {
    getDiemDanhTheoNgay(date);
    setCondition({
      conId: childId,
    });
  }, []);

  const columns: IColumn<IDiemDanhPhuHuynh.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Họ và tên',
      dataIndex: ['con', 'hoTen'],
      align: 'center',
      width: 200,
      render: (val) => val ?? 'Không có',
    },
    {
      title: 'Ngày điểm danh',
      dataIndex: 'thoiGianDiemDanh',
      align: 'center',
      width: 150,
      render: (val) => (val ? moment(val).format('DD/MM/YYYY') : 'Không có'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      align: 'center',
      width: 150,
      render: (val) => val ?? 'Không có',
    },
    {
      title: 'Thời gian',
      dataIndex: 'thoiGianDiemDanh',
      align: 'center',
      width: 150,
      render: (val) => (val ? moment(val).format('HH:mm') : 'Không có'),
    },
  ];

  const diemDanh = async () => {
    await postDiemDanhModel({
      conId: childId,
      phuHuynhId,
      donViId: organizationId,
      trangThai: 'Đã đi học',
    });
    setPage(1);
    setLimit(10);
    setCondition({});
    setCheckDiemDanh(true);
  };

  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={getDiemDanhPhuHuynhModel}
        dependencies={[page, limit, cond]}
        loading={loadingDiemDanhPhuHuynh}
        modelName="diemdanhphuhuynh"
        title={
          // eslint-disable-next-line no-nested-ternary
          props?.checkCuoiGio ? (
            <div>
              Điểm danh cuối giờ ({date.format('HH:mm DD/MM/YYYY')})
              {checkDiemDanh ? (
                <Tag color="blue" style={{ marginLeft: '5px' }}>
                  Đã đón con
                </Tag>
              ) : (
                <Tag color="red" style={{ marginLeft: '5px' }}>
                  Chưa đón con
                </Tag>
              )}
            </div>
          ) : props?.checkMuon ? (
            <div>
              Điểm danh muộn ({date.format('HH:mm DD/MM/YYYY')})
              {checkDiemDanh ? (
                <Tag color="blue" style={{ marginLeft: '5px' }}>
                  Đã điểm danh
                </Tag>
              ) : (
                <Tag color="red" style={{ marginLeft: '5px' }}>
                  Chưa điểm danh
                </Tag>
              )}
            </div>
          ) : (
            <div>
              Điểm danh đầu giờ ({date.format('HH:mm DD/MM/YYYY')})
              {checkDiemDanh ? (
                <Tag color="blue" style={{ marginLeft: '5px' }}>
                  Đã điểm danh
                </Tag>
              ) : (
                <Tag color="red" style={{ marginLeft: '5px' }}>
                  Chưa điểm danh
                </Tag>
              )}
            </div>
          )
        }
        scroll={{ x: 1000, y: 500 }}
      >
        <Checkbox
          checked={daXacNhan}
          onChange={(value) => {
            setDaXacNhan(value.target.checked);
          }}
          disabled={checkDiemDanh}
        >
          Xác nhận đã đi học
        </Checkbox>
        <Button
          type="primary"
          onClick={() => {
            diemDanh();
          }}
          disabled={checkDiemDanh || (!checkDiemDanh && !daXacNhan)}
          style={{ marginRight: '10px' }}
        >
          Điểm danh
        </Button>
        {/* <DatePicker format="DD-MM-YYYY" placeholder="Chọn ngày" disabledDate={value => value.isAfter(moment())} value={date} onChange={async (value) => {
          await getDiemDanhTheoNgay(value);
          setDate(value);
        }} />  */}
        <br />
        <RangePicker
          style={{ margin: '15px 0px' }}
          onChange={(range) => {
            if (!range) {
              setCondition({
                conId: childId,
              });
            } else
              setCondition({
                ...cond,
                thoiGianDiemDanh: {
                  $lte: range?.[1]?.toISOString(),
                  $gte: range?.[0]?.toISOString(),
                },
              });
          }}
          disabledDate={(datePicker) => datePicker.isAfter(moment())}
        />
        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          Tổng số:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={total}
          />
        </h3>
      </TableBase>
    </>
  );
};

export default DiemDanhPhuHuynh;
