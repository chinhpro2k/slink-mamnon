/* eslint-disable no-underscore-dangle */
import { checkAllow } from '@/components/CheckAuthority';
import TableBase from '@/components/Table';
import type { QuanLyDanhGia as IQuanLyDanhGia } from '@/services/QuanLyDanhGia';
import {
  delDanhGiaGiaoVien,
  kichHoatDanhGiaGiaoVien,
} from '@/services/QuanLyDanhGia/quanlydanhgia';
import type { IColumn } from '@/utils/interfaces';
import {
  DeleteOutlined,
  EditOutlined,
  EyeFilled,
  EyeOutlined,
  OrderedListOutlined,
} from '@ant-design/icons';
import { Button, Divider, Input, message, Modal, Popconfirm, Switch } from 'antd';
import moment from 'moment';
import React, { useEffect } from 'react';
import { history, useModel } from 'umi';
import DiemTBAllDot from '../components/DiemTBAllDot';
import Form from '../components/FormGiaoVien';
import TableDiemTB from '../components/TableDiemTrungBinh';

const QuanLyDanhGia = () => {
  const {
    loading: loadingQuanLyDanhGia,
    getQuanLyDanhGiaModel,
    total,
    page,
    limit,
    cond,
    setEdit,
    setRecord,
    setVisibleForm,
    setVisibleDiemTB,
    visibleDiemTB,
    setVisibleDiemTBAllDot,
    visibleDiemTBAllDot,
    setDiemThongKeAllDot,
    record: recordGiaoVien,
  } = useModel('quanlydanhgia');

  const handleEdit = (val: any) => {
    setEdit(true);
    setRecord(val);
    setVisibleForm(true);
  };

  const handleChangeStatus = async (val: any) => {
    const newVal = val;
    newVal.trangThai = !newVal.trangThai;
    try {
      const res = await kichHoatDanhGiaGiaoVien({ ...newVal });
      if (res?.status === 200) {
        message.success('Đổi trạng thái thành công');
        getQuanLyDanhGiaModel();
        return true;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return false;
  };

  const handleDel = async (val: string) => {
    try {
      const res = await delDanhGiaGiaoVien({ id: val });
      if (res?.status === 200) {
        message.success('Xóa thành công');
        getQuanLyDanhGiaModel();
        return true;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return false;
  };

  const onCell = (record: IQuanLyDanhGia.Record) => ({
    onClick: !checkAllow('VIEW_DANH_GIA_GIAO_VIEN')
      ? undefined
      : () => {
          setRecord({ ...record });
          history.push(`/danhgiagiaovien/${record._id}`);
        },
    style: { cursor: 'pointer' },
  });

  const renderLast1 = (record: IQuanLyDanhGia.Record) => {
    return (
      <React.Fragment>
        <Button
          type="default"
          shape="circle"
          onClick={() => {
            setRecord({ ...record });
            history.push(`/danhgiagiaovien/${record._id}`);
          }}
          title="Xem chi tiết"
          disabled={!checkAllow('VIEW_DANH_GIA_GIAO_VIEN')}
        >
          <EyeOutlined />
        </Button>
        <Divider type="vertical" />
        <Button
          type="primary"
          shape="circle"
          onClick={() => {
            setRecord({ ...record });
            setVisibleDiemTB(true);
          }}
          title="Điểm trung bình đánh giá"
          disabled={!checkAllow('STATISTIC_DANH_GIA_GIAO_VIEN')}
        >
          <OrderedListOutlined />
        </Button>
        <Divider type="vertical" />

        <Button
          type="default"
          shape="circle"
          onClick={() => handleEdit(record)}
          title="Chỉnh sửa"
          disabled={
            !checkAllow('EDIT_DANH_GIA_GIAO_VIEN') ||
            (checkAllow('EDIT_DANH_GIA_GIAO_VIEN') && record?.trangThai)
          }
        >
          <EditOutlined />
        </Button>
        <Divider type="vertical" />
        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDel(record._id)}
          disabled={!checkAllow('DEL_DANH_GIA_GIAO_VIEN')}
        >
          <Button
            type="primary"
            shape="circle"
            title="Xóa"
            disabled={!checkAllow('DEL_DANH_GIA_GIAO_VIEN')}
          >
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      </React.Fragment>
    );
  };

  const columns: IColumn<IQuanLyDanhGia.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'Tiêu đề đánh giá',
      dataIndex: 'tieuDe',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => val ?? 'Không có',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'ngayBatDau',
      align: 'center',
      width: 100,
      onCell,
      render: (val) => moment(val).format('DD/MM/YYYY') ?? 'Không có',
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'ngayKetThuc',
      align: 'center',
      width: 100,
      onCell,
      render: (val) => moment(val).format('DD/MM/YYYY') ?? 'Không có',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      align: 'center',
      width: 100,
      render: (val: boolean, record) => (
        <Switch
          checkedChildren="Mở"
          unCheckedChildren="Đóng"
          checked={val}
          onChange={() => {
            handleChangeStatus(record);
          }}
        />
      ),
    },
    {
      title: 'Nội dung cam kết',
      dataIndex: 'noiDungCamKet',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => val ?? 'Không có',
    },

    {
      title: 'Thao tác',
      align: 'center',
      render: (record: IQuanLyDanhGia.Record) => renderLast1(record),
      fixed: 'right',
      width: 150,
    },
  ];

  useEffect(() => {}, []);

  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={getQuanLyDanhGiaModel}
        dependencies={[page, limit, cond]}
        loading={loadingQuanLyDanhGia}
        modelName="quanlydanhgia"
        title="Quản lý đánh giá giáo viên"
        formType="Drawer"
        widthDrawer="60%"
        Form={Form}
        hascreate={checkAllow('ADD_DANH_GIA_GIAO_VIEN')}
        scroll={{ x: 1200 }}
      >
        <Button
          type="primary"
          onClick={() => setVisibleDiemTBAllDot(true)}
          style={{ marginRight: '10px' }}
        >
          <EyeFilled />
          Điểm trung bình
        </Button>
        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          Tổng số:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={total}
          />
        </h3>
      </TableBase>
      <Modal
        title="Điểm trung bình đánh giá"
        width="60%"
        visible={visibleDiemTB}
        onCancel={() => setVisibleDiemTB(false)}
        footer={<Button onClick={() => setVisibleDiemTB(false)}>Ok</Button>}
        destroyOnClose
      >
        <TableDiemTB idForm={recordGiaoVien?._id} />
      </Modal>
      <Modal
        title="Điểm trung bình tất cả các đợt"
        width="60%"
        visible={visibleDiemTBAllDot}
        onCancel={() => {
          setVisibleDiemTBAllDot(false);
          setDiemThongKeAllDot([]);
        }}
        footer={
          <Button
            onClick={() => {
              setVisibleDiemTBAllDot(false);
              setDiemThongKeAllDot([]);
            }}
          >
            Ok
          </Button>
        }
        destroyOnClose
      >
        <DiemTBAllDot />
      </Modal>
    </>
  );
};

export default QuanLyDanhGia;
