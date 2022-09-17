/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { DiemDanhMuon as IDiemDanhMuon } from '@/services/DiemDanhMuon';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, DatePicker, Input, Select, Tag, TimePicker } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';

const DiemDanhMuon = () => {
  const {
    loading: loadingDiemDanhMuon,
    getDiemDanhMuonModel,
    total,
    page,
    limit,
    cond,
    setCondition,
    setPage,
    updateDiemDanhMuonModel,
  } = useModel('diemdanhmuon');
  const [ngay, setNgay] = useState<number>(new Date().getDate());
  const [thang, setThang] = useState<number>(new Date().getMonth());
  const [nam, setNam] = useState<number>(new Date().getFullYear());
  const { initialState } = useModel('@@initialState');
  const vaiTro = localStorage.getItem('vaiTro');
  const [timeDonMuon, setTimeDonMuon] = useState<any>();
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [donViId, setDonViId] = useState<string | undefined>(organizationId);

  const getDSTruong = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=20`);
    if (vaiTro === 'HieuTruong') {
      const dataTruongHT = result?.data?.data?.result?.find(
        (item: { _id: string | undefined }) => item?._id === donViId,
      );
      const arrDonMuon = dataTruongHT?.diemDanhMuon?.gioBatDau.split(':');
      const minDonMuon = parseInt(arrDonMuon?.[0], 10) * 60 + parseInt(arrDonMuon?.[1], 10);
      setTimeDonMuon(minDonMuon);
    } else {
      const dataLop = result?.data?.data?.result?.find(
        (item: { _id: string | undefined }) => item?._id === donViId,
      );
      const dataTruongGV = result?.data?.data?.result?.find(
        (item: { _id: string }) => item?._id === dataLop?.parent,
      );
      setDonViId(dataLop?.parent);
      const arrDonMuon = dataTruongGV?.diemDanhMuon?.gioBatDau.split(':');
      const minDonMuon = parseInt(arrDonMuon?.[0], 10) * 60 + parseInt(arrDonMuon?.[1], 10);
      setTimeDonMuon(minDonMuon);
    }
  };

  React.useEffect(() => {
    setCondition(undefined);
    getDSTruong();
  }, []);

  const changeDate = (val: any) => {
    setNgay(new Date(val).getDate());
    setThang(new Date(val).getMonth());
    setNam(new Date(val).getFullYear());
    getDiemDanhMuonModel(
      donViId,
      new Date(val).getDate(),
      new Date(val).getMonth(),
      new Date(val).getFullYear(),
    );
    setPage(1);
  };

  const changeTrangThai = (val: string) => {
    setCondition({ trangThai: val });
    setPage(1);
  };

  const columns: IColumn<IDiemDanhMuon.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      fixed: 'left',
      width: 80,
    },
    {
      title: 'Họ và tên con',
      dataIndex: 'con',
      align: 'center',
      fixed: 'left',
      width: 200,
      render: (val) => val?.hoTen,
    },
    {
      title: 'Họ và tên phụ huynh',
      dataIndex: 'user',
      align: 'center',
      width: 200,
      render: (val) => val?.profile?.fullname,
    },

    {
      title: 'Số điện thoại phụ huynh',
      dataIndex: 'user',
      align: 'center',
      width: 190,
      render: (val) => val?.profile?.phoneNumber,
    },
    {
      title: 'Lớp',
      dataIndex: 'donVi',
      align: 'center',
      width: 150,
      render: (val) => val?.tenDonVi,
    },
    {
      title: 'Giờ bắt đầu điểm danh',
      dataIndex: 'gioBatDauTrongMuon',
      align: 'center',
      width: 190,
      render: (val) => {
        return moment(val).format('HH:mm');
      },
    },
    {
      title: 'Giờ kết thúc điểm danh',
      dataIndex: 'gioKetThucTrongMuon',
      align: 'center',
      width: 190,
      render: (val, record) =>
        // record?.trangThai !== 'Đã đi học' && (val ? moment(val).format('HH:mm') : 'Chưa điểm danh'),
        val ? (
          <TimePicker
            value={moment(val)}
            format="HH:mm"
            onChange={async (value) => {
              updateDiemDanhMuonModel(record?._id ?? '', {
                gioKetThucTrongMuon: moment(value).toDate(),
              });
              // await axios.put(`${ip3}/diem-danh/diem-danh-muon/${record?._id}`, {
              //   gioKetThucTrongMuon: moment(value).toDate(),
              // });
              getDiemDanhMuonModel(donViId, ngay, thang, nam);
            }}
          />
        ) : (
          <TimePicker
            format="HH:mm"
            onChange={async (value) => {
              updateDiemDanhMuonModel(record?._id ?? '', {
                gioKetThucTrongMuon: moment(value).toDate(),
              });
              // await axios.put(`${ip3}/diem-danh/diem-danh-muon/${record?._id}`, {
              //   gioKetThucTrongMuon: moment(value).toDate(),
              // });
              getDiemDanhMuonModel(donViId, ngay, thang, nam);
            }}
          />
        ),
    },
    {
      title: 'Số giờ trông muộn',
      dataIndex: 'soGioTrongMuon',
      align: 'center',
      width: 190,
      render: (val, record) => {
        return record?.soGioTrongMuon?.toFixed(2) || 0;
      },
    },
    {
      title: 'Giáo viên điểm danh muộn',
      dataIndex: ['nguoiDiemDanh','profile','fullname'],
      align: 'center',
      width: 200,
      render: (val) => val ?? 'Không có',
    },
    // {
    //   title: 'Thời gian điểm danh muộn',
    //   dataIndex: 'thoiGianDiemDanhMuon',
    //   align: 'center',
    //   width: 190,
    //   render: (val, record) =>
    //     // record?.trangThai !== 'Đã đi học' && (val ? moment(val).format('HH:mm') : 'Chưa điểm danh'),
    //     val ? (
    //       <TimePicker
    //         value={moment(val)}
    //         format="HH:mm"
    //         onChange={async (value) => {
    //           updateDiemDanhMuonModel(record?._id ?? '', {
    //             thoiGianDiemDanhMuon: moment(value).toDate(),
    //           });
    //           getDiemDanhMuonModel(donViId, ngay, thang, nam);
    //         }}
    //       />
    //     ) : (
    //       <TimePicker
    //         format="HH:mm"
    //         onChange={async (value) => {
    //           updateDiemDanhMuonModel(record?._id ?? '', {
    //             thoiGianDiemDanhMuon: moment(value).toDate(),
    //           });
    //           getDiemDanhMuonModel(donViId, ngay, thang, nam);
    //         }}
    //       />
    //     ),
    // },
    {
      title: 'Phụ huynh đón con',
      dataIndex: 'phuHuynhDonCon',
      align: 'center',
      width: 190,
      render: (val) => val?.profile?.fullname ?? 'Không có',
    },
    // {
    //   title: 'Thời gian phụ huynh đón con',
    //   dataIndex: 'thoiGianDonCon',
    //   align: 'center',
    //   width: 190,
    //   render: (val, record) =>
    //     // record?.trangThai !== 'Đã đi học' && (val ? moment(val).format('HH:mm') : 'Chưa điểm danh'),
    //     val ? (
    //       <TimePicker
    //         value={moment(val)}
    //         format="HH:mm"
    //         onChange={async (value) => {
    //           updateDiemDanhMuonModel(record?._id ?? '', {
    //             thoiGianDonCon: moment(value).toDate(),
    //           });
    //           getDiemDanhMuonModel(donViId, ngay, thang, nam);
    //         }}
    //       />
    //     ) : (
    //       <TimePicker
    //         format="HH:mm"
    //         onChange={async (value) => {
    //           updateDiemDanhMuonModel(record?._id ?? '', {
    //             thoiGianDonCon: moment(value).toDate(),
    //           });
    //           getDiemDanhMuonModel(donViId, ngay, thang, nam);
    //         }}
    //       />
    //     ),
    // },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      align: 'center',
      width: 200,
      render: (val, record) =>
        // val === 'Đã đón con' ? <Tag color="purple">Đã đón con</Tag> : <Tag>Chưa đón con</Tag>,
        {
          return (
            <Select
              style={{ width: '100%' }}
              value={val}
              disabled
              onChange={async (value) => {
                await axios.put(
                  `${ip3}/diem-danh/${record?._id}/update-diem-danh/one`,
                  {
                    trangThai: value,
                  },
                  {
                    params: {
                      id: record?._id,
                      loaiDiemDanh: 'Điểm danh muộn',
                    },
                  },
                );
                getDiemDanhMuonModel(donViId, ngay, thang, nam);
              }}
            >
              <Select.Option value="Đã đi học">
                {' '}
                <Tag color="orange">Chưa đón con</Tag>
              </Select.Option>
              <Select.Option value="Đã đón con">
                {' '}
                <Tag color="blue">Đã đón con</Tag>
              </Select.Option>
            </Select>
          );
        },
    },
    {
      title: 'Thao tác',
      fixed: 'right',
      align: 'center',
      width: 150,
      render: (val, record) => (
        <>
          <Button
            icon={<DeleteOutlined />}
            type="primary"
            danger
            onClick={async () => {
              await axios.delete(`${ip3}/diem-danh/diem-danh-muon/${record?._id}`);
              getDiemDanhMuonModel(donViId, ngay, thang, nam);
            }}
          />
        </>
      ),
    },
  ];

  useEffect(() => {}, []);

  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={() => getDiemDanhMuonModel(donViId, ngay, thang, nam)}
        dependencies={[page, limit, cond]}
        loading={loadingDiemDanhMuon}
        modelName="diemdanhmuon"
        scroll={{ x: 1300 }}
        title="Điểm danh muộn"
      >
        <DatePicker
          onChange={changeDate}
          defaultValue={moment()}
          format="DD-MM-YYYY"
          placeholder="Chọn ngày"
          style={{ marginRight: '10px' }}
          disabledDate={(current) => {
            return current && current > moment().endOf('day');
          }}
        />
        <Select
          placeholder="Chọn trạng thái"
          allowClear
          onChange={changeTrangThai}
          style={{ width: '15%' }}
        >
          <Select.Option value="Đã đón con">Đã đón con</Select.Option>
          <Select.Option value="Đã đi học">Chưa đón con</Select.Option>
        </Select>
        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          Tổng số:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={total}
          />
        </h3>
      </TableBase>
      {/* {timeDonMuon < timeHienTai && timeHienTai < 1439 ? (
        <TableBase
          border
          columns={columns}
          getData={() => getDiemDanhMuonModel(donViId, ngay, thang, nam)}
          dependencies={[page, limit, cond]}
          loading={loadingDiemDanhMuon}
          modelName="diemdanhmuon"
          scroll={{ x: 1000 }}
          title="Điểm danh muộn"
        >
          <DatePicker
            onChange={changeDate}
            defaultValue={moment()}
            format="DD-MM-YYYY"
            placeholder="Chọn ngày"
            style={{ marginRight: '10px' }}
            disabledDate={(current) => {
              return current && current > moment().endOf('day');
            }}
          />
          <Select
            placeholder="Chọn trạng thái"
            allowClear
            onChange={changeTrangThai}
            style={{ width: '15%' }}
          >
            <Select.Option value="Đã đón con">Đã đón con</Select.Option>
            <Select.Option value="Đã đi học">Chưa đón con</Select.Option>
          </Select>
          <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
            Tổng số:
            <Input
              style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
              value={total}
            />
          </h3>
        </TableBase>
      ) : (
        <Empty description="Chưa đến thời gian đón muộn" />
      )} */}
    </>
  );
};

export default DiemDanhMuon;
