/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import { checkAllow } from '@/components/CheckAuthority';
import TableBase from '@/components/Table';
import type { FormDanhGia as IFormDanhGia } from '@/services/FormDanhGia';
import { delFormDanhGia, kichHoatDanhGiaHocSinh } from '@/services/FormDanhGia/formdanhgia';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Button, Divider, Input, message, Modal, Popconfirm, Switch, Table } from 'antd';
import React, { useState } from 'react';
import { history, useModel } from 'umi';
import Form from '../components/FormHocSinh';
import type { QuanLyLop as IQuanLyLop } from '@/services/QuanLyLop';
import moment from 'moment';
import FormViewDanhGia from '@/pages/QuanLyDanhGia/components/FormViewDanhGia';

const FormDanhGia = () => {
  const {
    loading: loadingFormDanhGia,
    getFormDanhGiaModel,
    total,
    page,
    limit,
    cond,
    setVisibleForm,
    setEdit,
    setRecord,
    record: recordDanhGia,
  } = useModel('formdanhgia');
  const vaiTro = localStorage.getItem('vaiTro');
  const [dsLop, setDsLop] = useState([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [visibleView, setVisibleView] = useState<boolean>(false);
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const handleEdit = (val: any) => {
    setEdit(true);
    setRecord(val);
    setVisibleForm(true);
  };
  const handleDel = async (val: string) => {
    try {
      const res = await delFormDanhGia({ id: val });
      if (res?.status === 200) {
        message.success('Xóa thành công');
        getFormDanhGiaModel();
        return true;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return false;
  };

  const viewListLop = async (record: IFormDanhGia.Record) => {
    const result = await axios.get(`${ip3}/don-vi/pageable/my/child?page=1&limit=1000`, {
      params: {
        cond: {
          loaiDonVi: 'Lop',
        },
      },
    });
    const result2 = await axios.get(
      `${ip3}/danh-gia-hoc-sinh/stat/truong/${organizationId}/form-danh-gia/${record._id}`,
    );
    const dataObj = result2?.data?.data ?? [];
    const arrLop: any = [];
    result?.data?.data?.result?.forEach((item: { _id: string }) => {
      record?.donViId?.map((val: string, index: number) => {
        if (item?._id === val) {
          dataObj.forEach((val2: { _id: string; total: any; }) => {
            if (val2._id === val) {
              arrLop.push({ ...item, index: index + 1, soHocSinhDanhGia: val2?.total ?? 0 });
            }else {
              arrLop.push({ ...item, index: index + 1, soHocSinhDanhGia:  0 });
            }
          });
        }
      });
    });
    setDsLop(arrLop);
    setVisible(true);
    setRecord(record);
  };

  const handleChangeStatus = async (val: any) => {
    const newVal = val;
    newVal.trangThai = !newVal.trangThai;
    try {
      const res = await kichHoatDanhGiaHocSinh({ ...newVal });
      if (res?.status === 200) {
        message.success('Kích hoạt thành công');
        getFormDanhGiaModel();
        return true;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return false;
  };

  const onCell = (record: IFormDanhGia.Record) => ({
    onClick: !checkAllow('VIEW_DANH_GIA_HOC_SINH')
      ? undefined
      : vaiTro === 'HieuTruong'
      ? () => viewListLop(record)
      : () => {
          setRecord({ ...record });
          history.push(`/danhgiadinhkyhocsinh/${record._id}`);
        },
    style: { cursor: 'pointer' },
  });

  const renderLast1 = (record: IFormDanhGia.Record) => {
    return (
      <React.Fragment>
        <Button
          type="primary"
          shape="circle"
          onClick={() => {
            setVisibleView(true);
            setRecord(record);
          }}
          title="Xem chi tiết"
          disabled={!checkAllow('VIEW_DANH_GIA_HOC_SINH')}
        >
          <EyeOutlined />
        </Button>
        <Divider type="vertical" />
        <Button
          type="default"
          shape="circle"
          onClick={
            vaiTro === 'HieuTruong'
              ? () => viewListLop(record)
              : () => {
                  setRecord({ ...record });
                  history.push(`/danhgiadinhkyhocsinh/${record._id}`);
                }
          }
          title="Xem danh sách lớp tham gia đánh giá"
          disabled={!checkAllow('VIEW_DANH_GIA_HOC_SINH')}
        >
          <UnorderedListOutlined />
        </Button>
        <Divider type="vertical" />

        <Button
          type="default"
          shape="circle"
          onClick={() => handleEdit(record)}
          title="Chỉnh sửa"
          disabled={
            !checkAllow('EDIT_DANH_GIA_HOC_SINH') ||
            (checkAllow('EDIT_DANH_GIA_HOC_SINH') && record?.trangThai) ||
            !record.isUpdate
          }
        >
          <EditOutlined />
        </Button>

        <Divider type="vertical" />

        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDel(record._id)}
          disabled={!checkAllow('DEL_DANH_GIA_HOC_SINH')}
        >
          <Button
            type="primary"
            shape="circle"
            title="Xóa"
            disabled={!checkAllow('DEL_DANH_GIA_HOC_SINH')}
          >
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      </React.Fragment>
    );
  };

  const columns: IColumn<IFormDanhGia.Record>[] = [
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
      width: 200,
      onCell,
      render: (val) => val ?? 'Không có',
    },
    {
      title: 'Đợt đánh giá',
      dataIndex: 'dotDanhGia',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => val ?? 'Không có',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      align: 'center',
      width: '100px',
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
      title: 'Đơn vị tạo đánh giá',
      dataIndex: ['donViTaoDanhGia', 'tenDonVi'],
      align: 'center',
      width: 150,
      onCell,
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'thoiGianBatDauDanhGia',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => moment(val).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'thoiGianKetThucDanhGia',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => moment(val).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: IFormDanhGia.Record) => renderLast1(record),
      fixed: 'right',
      width: 220,
    },
  ];

  const columnsLop: IColumn<IQuanLyLop.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 70,
    },
    {
      title: 'Tên lớp',
      dataIndex: 'tenDonVi',
      align: 'center',
      width: 150,
    },
    {
      title: 'Độ tuổi',
      dataIndex: 'doTuoi',
      align: 'center',
      width: 100,
    },
    {
      title: 'Số học sinh đã đánh giá/Tổng số học sinh',
      dataIndex: 'soHocSinhThucTe',
      align: 'center',
      width: 150,
      render: (val, record) => (
        <div>
          {record?.soHocSinhDanhGia}/{val}
        </div>
      ),
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: IFormDanhGia.Record) => (
        <Button
          type="primary"
          shape="circle"
          onClick={() => {
            setRecord(recordDanhGia);
            history.push(`/danhgiadinhkyhocsinh/${recordDanhGia._id}`);
            setVisible(false);
            localStorage.setItem('idLop', record?._id);
            localStorage.setItem('tenDonVi', record?.tenDonVi);
          }}
          title="Xem chi tiết"
        >
          <EyeOutlined />
        </Button>
      ),
      fixed: 'right',
      width: 70,
    },
  ];

  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={getFormDanhGiaModel}
        dependencies={[page, limit, cond]}
        loading={loadingFormDanhGia}
        modelName="formdanhgia"
        title="Danh sách đánh giá định kỳ học sinh"
        Form={Form}
        formType="Drawer"
        widthDrawer="60%"
        hascreate={checkAllow('ADD_DANH_GIA_HOC_SINH')}
        scroll={{ x: 1200 }}
      >
        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          Tổng số:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={total}
          />
        </h3>
      </TableBase>
      <Modal
        title="Danh sách lớp tham gia đánh giá"
        visible={visible}
        width="60%"
        footer={
          <Button onClick={() => setVisible(false)} type="primary">
            Ok
          </Button>
        }
        onCancel={() => setVisible(false)}
      >
        <Table
          dataSource={dsLop}
          columns={columnsLop}
          bordered
          pagination={false}
          scroll={{ y: 500 }}
        />
      </Modal>{' '}
      <Modal
        title="Xem nội dung đánh giá"
        visible={visibleView}
        width="60%"
        footer={
          <Button onClick={() => setVisibleView(false)} type="primary">
            Ok
          </Button>
        }
        onCancel={() => setVisibleView(false)}
      >
        <FormViewDanhGia />
      </Modal>
    </>
  );
};

export default FormDanhGia;
