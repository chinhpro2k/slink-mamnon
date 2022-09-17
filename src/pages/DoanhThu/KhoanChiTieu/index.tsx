/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { KhoanChiTieu as IKhoanChiTieu } from '@/services/KhoanChiTieu';
import { delKhoanChiTieu } from '@/services/KhoanChiTieu/khoanchitieu';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Table, Button, Divider, message, Popconfirm, Typography } from 'antd';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useModel } from 'umi';
import Form from '../components/FormChiTieu';

const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
});

const KhoanChiTieu = (props: {
  donViId?: string;
  disable?: boolean;
  record: any;
  type?: string;
}) => {
  const {
    loading: loadingKhoanChiTieu,
    getKhoanChiTieuModel,
    page,
    limit,
    cond,
    setRecord,
    setVisibleForm,
    setEdit,
    getDataTienChiGiaoVien,
  } = useModel('khoanchitieu');
  const { getDataHoaDonMuaHang, loading } = useModel('doanhthu');
  const handleEdit = (val: any) => {
    setVisibleForm(true);
    setEdit(true);
    setRecord(val);
  };

  const handleDel = async (val: string) => {
    try {
      const res = await delKhoanChiTieu({ id: val });
      if (res?.status === 200) {
        message.success('Xóa thành công');
        getKhoanChiTieuModel(props?.donViId);
        return true;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return false;
  };

  const renderLast = (record: IKhoanChiTieu.Record) => {
    return (
      <React.Fragment>
        <Button
          type="default"
          shape="circle"
          onClick={() => handleEdit(record)}
          title="Chỉnh sửa"
          disabled={props?.disable}
        >
          <EditOutlined />
        </Button>
        <Divider type="vertical" />
        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDel(record._id)}
          disabled={props?.disable}
          cancelText="Hủy"
        >
          <Button type="primary" shape="circle" title="Xóa" disabled={props?.disable}>
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      </React.Fragment>
    );
  };

  const columns: IColumn<any>[] = [
    {
      title: 'Hạng mục',
      dataIndex: 'ten',
      align: 'left',
      width: 150,
    },
    {
      title: 'Ngày nhập',
      dataIndex: 'createdAt',
      align: 'center',
      width: 150,
      render: (val) => (val ? moment(val).format('DD-MM-YYYY') : moment().format('DD-MM-YYYY')),
    },
    {
      title: 'Số tiền',
      dataIndex: 'soTien',
      align: 'center',
      width: 130,
      render: (val) => formatter.format(val ?? 0),
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: IKhoanChiTieu.Record) => renderLast(record),
      fixed: 'right',
      width: 100,
    },
  ];
  const columnsTeacher: IColumn<any>[] = [
    {
      title: 'Họ tên',
      dataIndex: 'hoTen',
      align: 'left',
      width: 150,
    },
    {
      title: 'Số tiền',
      dataIndex: 'luongThucTe',
      align: 'center',
      width: 130,
      render: (val) => formatter.format(val ?? 0),
    },
  ];
  const columnsMuaHang: IColumn<any>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 50,
    },
    {
      title: 'Hạng mục',
      dataIndex: 'tenTP',
      align: 'left',
      width: 150,
      render:(val,record)=> <span>Hóa đơn mua hàng từ hệ thống</span>
    },
    {
      title: 'Thời gian',
      dataIndex: 'tenTP',
      align: 'center',
      width: 150,
      render:(val,record)=> <span>{record.ngay}/{record.thang}/{record.nam}</span>
    },
    // {
    //   title: 'Ngày nhập',
    //   dataIndex: 'createdAt',
    //   align: 'center',
    //   width: 150,
    //   render: (val) => (val ? moment(val).format('DD-MM-YYYY') : moment().format('DD-MM-YYYY')),
    // },
    {
      title: 'Số tiền',
      dataIndex: 'tongSoTien',
      align: 'center',
      width: 130,
      render: (val) => formatter.format(val ?? 0),
    },
  ];
  useEffect(() => {}, []);

  return (
    <>
      <TableBase
        border
        title={'Tổng hợp tiền chi cho lương cô giáo'}
        columns={columnsTeacher}
        getData={() =>
          getDataTienChiGiaoVien(props?.donViId as string, props.record.thang, props.record.nam)
        }
        dependencies={[page, limit, cond, props?.donViId]}
        loading={loadingKhoanChiTieu}
        dataState={'dataChiCoGiao'}
        modelName="khoanchitieu"
        summary={(pageData) => {
          let totalRepayment = 0;
          pageData.forEach((val) => {
            if (val.luongThucTe) {
              totalRepayment += +val.luongThucTe;
            }
          });

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>
                  <Typography.Text type={'danger'} strong>
                    Tổng
                  </Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell align={'center'} index={1}>
                  <Typography.Text type={'danger'} strong>
                    {formatter.format(totalRepayment ?? 0)}
                  </Typography.Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
      {/*bảnh thống kê linh hoạt không có mục này*/}
      {props.type !== 'linh-hoat' && (
        <TableBase
          border
          title={'Tổng hợp tiền chi cho các hóa đơn mua hàng'}
          columns={columnsMuaHang}
          getData={() =>
            getDataHoaDonMuaHang({
              truongId: props?.donViId as string,
              thang: props.record.thang,
              nam: props.record.nam,
            })
          }
          dependencies={[1, 10000]}
          isNotPagination={true}
          scroll={{ y: 500 }}
          loading={loading}
          dataState={'dataHoaDonMuaHang'}
          modelName="doanhthu"
          summary={(pageData) => {
            let totalBorrow = 0;
            let totalRepayment = 0;
            pageData.forEach((val) => {
              if (val.tongSoTien) {
                totalRepayment += +val.tongSoTien;
              }
            });

            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}>
                    <Typography.Text type={'danger'} strong>
                      Tổng
                    </Typography.Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    {/*<Typography.Text type="danger">{totalBorrow}</Typography.Text>*/}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>
                    {/*<Typography.Text type="danger">{totalBorrow}</Typography.Text>*/}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell align={'center'} index={3}>
                    <Typography.Text type={'danger'} strong>
                      {formatter.format(totalRepayment ?? 0)}
                    </Typography.Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
                {/*<Table.Summary.Row>*/}
                {/*  <Table.Summary.Cell index={0}>Balance</Table.Summary.Cell>*/}
                {/*  <Table.Summary.Cell index={1} colSpan={2}>*/}
                {/*    <Typography.Text type="danger">{totalBorrow - totalRepayment}</Typography.Text>*/}
                {/*  </Table.Summary.Cell>*/}
                {/*</Table.Summary.Row>*/}
              </>
            );
          }}
        />
      )}
      <TableBase
        border
        title={'Tổng hợp tiền chi từ nhập thủ công'}
        columns={columns}
        getData={() => getKhoanChiTieuModel(props?.donViId)}
        dependencies={[page, limit, cond, props?.donViId]}
        loading={loadingKhoanChiTieu}
        modelName="khoanchitieu"
        Form={Form}
      />
    </>
  );
};

export default KhoanChiTieu;
