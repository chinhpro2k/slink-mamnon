/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import { DiemDanh } from '@/services/DiemDanh';
import type { DiemDanhDauGio as IDiemDanhDauGio } from '@/services/DiemDanhDauGio';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { DatePicker, Input, Select, Tag, TimePicker } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { formatPhoneNumber } from '@/functionCommon';

const DiemDanhDauGio = (props: { donViId: string }) => {
  const {
    loading: loadingDiemDanhDauGio,
    getDiemDanhDauGioModel,
    total,
    page,
    limit,
    cond,
    setCondition,
    setPage,
    updateDiemDanhModel,
  } = useModel('diemdanhdaugio');
  const [ngay, setNgay] = useState<number>(new Date().getDate());
  const [thang, setThang] = useState<number>(new Date().getMonth());
  const [nam, setNam] = useState<number>(new Date().getFullYear());
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [idTruong, setIdTruong] = useState(organizationId);
  const [ttTruong, setTtTruong] = useState({});

  const getThongTinTruong = async () => {
    const response = await axios.get(`${ip3}/don-vi/pageable`, {
      params: {
        page: 1,
        limit: 100,
        cond: {
          loaiDonVi: 'Truong',
          _id: idTruong,
        },
      },
    });
    setTtTruong(response?.data?.data?.result?.[0] ?? {});
  };

  React.useEffect(() => {
    setCondition(undefined);
    getThongTinTruong();
  }, []);
  const changeDate = (val: any) => {
    setNgay(new Date(val).getDate());
    setThang(new Date(val).getMonth());
    setNam(new Date(val).getFullYear());
    getDiemDanhDauGioModel(
      props?.donViId,
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

  const checkTimeStatus = (record: IDiemDanhDauGio.Record) => {
    const ngayDD: number = record?.ngay;
    const thangDD: number = record?.thang;
    const namDD: number = record?.nam;
    const thoiGianDiemDanhDauGio = moment(ttTruong?.diemDanhDauGio?.gioBatDau, 'HH:mm');
    const thoiGianDiemDanhCuoiGio = moment(ttTruong?.diemDanhCuoiGio?.gioKetThuc, 'HH:mm');
    const curr = moment();
    if (
      curr.isAfter(thoiGianDiemDanhDauGio) &&
      curr.isBefore(thoiGianDiemDanhCuoiGio) &&
      ngayDD === moment().date() &&
      thangDD === moment().month() &&
      namDD === moment().year()
    ) {
      return true;
    }
    return false;
  };

  const columns: IColumn<IDiemDanhDauGio.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      fixed: 'left',
      width: 80,
    },
    {
      title: 'H??? v?? t??n con',
      dataIndex: 'con',
      align: 'center',
      fixed: 'left',
      width: 200,
      render: (val) => val?.hoTen,
    },
    {
      title: 'H??? v?? t??n ph??? huynh',
      dataIndex: 'phuHuynh',
      align: 'center',
      width: 200,
      render: (val) => val?.profile?.fullname,
    },

    {
      title: 'S??? ??i???n tho???i ph??? huynh',
      dataIndex: 'phuHuynh',
      align: 'center',
      width: 170,
      render: (val) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              width={16}
              height={16}
              style={{ marginRight: '4px', color: 'green' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            {formatPhoneNumber(val?.profile?.phoneNumber)}
          </div>
        );
      },
    },
    // {
    //   title: 'Th???i gian ??i???m danh',
    //   dataIndex: 'thoiGianDiemDanh',
    //   align: 'center',
    //   width: 170,
    //   render: (val, record) =>
    //     record?.trangThai !== 'Kh??ng ??i h???c' &&
    //     (val ? moment(val).format('HH:mm') : 'Ch??a ??i???m danh'),
    // },
    {
      title: 'Ph??? huynh ??i???m danh ????a con ?????n tr?????ng',
      dataIndex: 'phuHuynhDuaDenTruong',
      align: 'center',
      width: 170,
      render: (val, record) => (val ? val?.profile?.fullname : 'Kh??ng c??'),
    },
    {
      title: 'Th???i gian ??i???m danh ????a con ?????n tr?????ng',
      dataIndex: 'thoiGianDiemDanhDenTruong',
      align: 'center',
      width: 170,
      render: (val, record) =>
        // record?.trangThai !== '???? ??i h???c' && (val ? moment(val).format('HH:mm') : 'Ch??a ??i???m danh'),
        // moment(val).format("HH:mm")
        val ? (
          <TimePicker
            value={moment(val)}
            format="HH:mm"
            onChange={async (value) => {
              updateDiemDanhModel(record?._id ?? '', {
                thoiGianDiemDanhDenTruong: moment(value).toDate(),
              });
              // await axios.put(`${ip3}/diem-danh/${record?._id}/update-thoi-gian-diem-danh`, {
              //   thoiGianDiemDanhDenTruong: value?.format('HH:mm'),
              // });
              getDiemDanhDauGioModel(props?.donViId, ngay, thang, nam);
            }}
          />
        ) : (
          <TimePicker
            format="HH:mm"
            onChange={async (value) => {
              console.log('vale', moment(value).format('HH:mm'));
              updateDiemDanhModel(record?._id ?? '', {
                thoiGianDiemDanhDenTruong: moment(value).toDate(),
              });
              // await axios.put(`${ip3}/diem-danh/${record?._id}/update-thoi-gian-diem-danh`, {
              //   thoiGianDiemDanhDenTruong: value?.format('HH:mm'),
              // });
              getDiemDanhDauGioModel(props?.donViId, ngay, thang, nam);
            }}
          />
        ),
    },
    {
      title: 'Gi??o vi??n ??i???m danh ?????u gi???',
      dataIndex: 'giaoVienDiemDanhDauGio',
      align: 'center',
      width: 200,
      render: (val, record) => (val ? val?.profile?.fullname : 'Kh??ng c??'),
    },
    {
      title: 'Th???i gian ??i???m danh ?????u gi???',
      dataIndex: 'thoiGianDiemDanhDauGio',
      align: 'center',
      width: 200,
      render: (val, record) =>
        // record?.trangThai !== '???? ??i h???c' && (val ? moment(val).format('HH:mm') : 'Ch??a ??i???m danh'),
        val ? (
          <TimePicker
            value={moment(val)}
            format="HH:mm"
            onChange={async (value) => {
              updateDiemDanhModel(record?._id ?? '', {
                thoiGianDiemDanhDauGio: moment(value).toDate(),
              });
              // await axios.put(`${ip3}/diem-danh/${record?._id}/update-thoi-gian-diem-danh`, {
              //   thoiGianDiemDanhDauGio: value?.format('HH:mm'),
              // });
              getDiemDanhDauGioModel(props?.donViId, ngay, thang, nam);
            }}
          />
        ) : (
          <TimePicker
            format="HH:mm"
            onChange={async (value) => {
              updateDiemDanhModel(record?._id ?? '', {
                thoiGianDiemDanhDauGio: moment(value).toDate(),
              });
              // await axios.put(`${ip3}/diem-danh/${record?._id}/update-thoi-gian-diem-danh`, {
              //   thoiGianDiemDanhDauGio: value?.format('HH:mm'),
              // });
              getDiemDanhDauGioModel(props?.donViId, ngay, thang, nam);
            }}
          />
        ),
    },
    {
      title: 'Gi??o vi??n ??i???m danh cu???i gi???',
      dataIndex: 'giaoVienDiemDanhCuoiGio',
      align: 'center',
      width: 200,
      render: (val, record) => (val ? val?.profile?.fullname : 'Kh??ng c??'),
    },
    {
      title: 'Th???i gian ??i???m danh cu???i gi???',
      dataIndex: 'thoiGianDiemDanhCuoiGio',
      align: 'center',
      width: 200,
      render: (val, record) =>
        // record?.trangThai !== '???? ??i h???c' && (val ? moment(val).format('HH:mm') : 'Ch??a ??i???m danh'),
        val ? (
          <TimePicker
            value={moment(val)}
            format="HH:mm"
            onChange={async (value) => {
              updateDiemDanhModel(record?._id ?? '', {
                thoiGianDiemDanhCuoiGio: moment(value).toDate(),
              });
              // await axios.put(`${ip3}/diem-danh/${record?._id}/update-thoi-gian-diem-danh`, {
              //   thoiGianDiemDanhCuoiGio: value?.format('HH:mm'),
              // });
              getDiemDanhDauGioModel(props?.donViId, ngay, thang, nam);
            }}
          />
        ) : (
          <TimePicker
            format="HH:mm"
            onChange={async (value) => {
              updateDiemDanhModel(record?._id ?? '', {
                thoiGianDiemDanhCuoiGio: moment(value).toDate(),
              });
              // await axios.put(`${ip3}/diem-danh/${record?._id}/update-thoi-gian-diem-danh`, {
              //   thoiGianDiemDanhCuoiGio: value?.format('HH:mm'),
              // });
              getDiemDanhDauGioModel(props?.donViId, ngay, thang, nam);
            }}
          />
        ),
    },
    {
      title: 'Ph??? huynh ??i???m danh ????n con',
      dataIndex: 'phuHuynhDonCon',
      align: 'center',
      width: 200,
      render: (val) => val?.profile?.fullname ?? 'Kh??ng c??',
    },
    {
      title: 'Th???i gian ??i???m danh ????n con',
      dataIndex: 'thoiGianDonCon',
      align: 'center',
      width: 200,
      // render: (val) => val ?? 'Kh??ng c??',
      render: (val, record) =>
        // record?.trangThai !== '???? ??i h???c' && (val ? moment(val).format('HH:mm') : 'Ch??a ??i???m danh'),
        val ? (
          <TimePicker
            value={moment(val)}
            format="HH:mm"
            onChange={async (value) => {
              updateDiemDanhModel(record?._id ?? '', {
                thoiGianDonCon: moment(value).toDate(),
              });
              // await axios.put(`${ip3}/diem-danh/${record?._id}/update-thoi-gian-diem-danh`, {
              //   thoiGianDonCon: value?.format('HH:mm'),
              // });
              getDiemDanhDauGioModel(props?.donViId, ngay, thang, nam);
            }}
          />
        ) : (
          <TimePicker
            format="HH:mm"
            onChange={async (value) => {
              updateDiemDanhModel(record?._id ?? '', {
                thoiGianDonCon: moment(value).toDate(),
              });
              // await axios.put(`${ip3}/diem-danh/${record?._id}/update-thoi-gian-diem-danh`, {
              //   thoiGianDonCon: value?.format('HH:mm'),
              // });
              getDiemDanhDauGioModel(props?.donViId, ngay, thang, nam);
            }}
          />
        ),
    },
    {
      title: 'Tr???ng th??i',
      dataIndex: 'trangThai',
      align: 'center',
      fixed: 'right',
      width: 160,
      render: (val, record) => (
        <Select
          style={{ width: '100%' }}
          // defaultValue={val}
          value={val}
          // disabled={disableChangeStatus()}
          onChange={async (value) => {
            const response = await axios.put(
              `${ip3}/diem-danh/update-diem-danh/admin/${record?._id}/don-vi/${props.donViId}`,
              {
                trangThai: value,
              },
              {
                params: {
                  id: record?._id,
                  donViId: props.donViId,
                },
              },
            );
            getDiemDanhDauGioModel(props?.donViId, ngay, thang, nam);
          }}
        >
          <Select.Option value="Xin ngh??? h???c">
            {' '}
            <Tag color="orange">Xin ngh??? h???c</Tag>
          </Select.Option>
          <Select.Option value="???? ??i h???c">
            {' '}
            <Tag color="blue">{checkTimeStatus(record) ? '???? ??i h???c' : 'Ch??a ????n con'}</Tag>
          </Select.Option>
          <Select.Option value="???? ????n con">
            {' '}
            <Tag color="purple">???? ????n con</Tag>
          </Select.Option>
          <Select.Option value="Kh??ng ??i h???c">
            {' '}
            <Tag>Kh??ng ??i h???c</Tag>
          </Select.Option>
        </Select>
      ),
    },
  ];

  useEffect(() => {}, []);

  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={() => getDiemDanhDauGioModel(props?.donViId, ngay, thang, nam)}
        dependencies={[page, limit, cond]}
        loading={loadingDiemDanhDauGio}
        modelName="diemdanhdaugio"
        scroll={{ x: 1000 }}
      >
        <DatePicker
          onChange={changeDate}
          defaultValue={moment()}
          format="DD-MM-YYYY"
          placeholder="Ch???n ng??y"
          style={{ marginRight: '10px' }}
          disabledDate={(current) => {
            return current && current > moment().endOf('day');
          }}
        />
        <Select
          placeholder="Ch???n tr???ng th??i"
          allowClear
          onChange={changeTrangThai}
          style={{ width: '15%' }}
        >
          <Select.Option value="???? ??i h???c">
            {checkTimeStatus() ? '???? ??i h???c' : 'Ch??a ????n con'}
          </Select.Option>
          <Select.Option value="Kh??ng ??i h???c">Kh??ng ??i h???c</Select.Option>
          <Select.Option value="Xin ngh??? h???c">Xin ngh??? h???c</Select.Option>
          <Select.Option value="???? ????n con">???? ????n con</Select.Option>
        </Select>
        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          T???ng s???:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={total}
          />
        </h3>
      </TableBase>
    </>
  );
};

export default DiemDanhDauGio;
