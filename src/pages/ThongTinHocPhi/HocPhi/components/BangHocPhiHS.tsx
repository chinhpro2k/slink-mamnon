/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { QuanLyLop as IQuanLyLop } from '@/services/QuanLyLop';
import { updTrangThaiThanhToan } from '@/services/ThongTinHocPhi/thongtinhocphi';
import type { IColumn } from '@/utils/interfaces';
import { formatterMoney } from '@/utils/utils';
import { CheckOutlined, EyeOutlined, MessageOutlined } from '@ant-design/icons';
import { Button, Divider, message, Modal, Tag, Form, Input } from 'antd';
import React, { useState, useEffect } from 'react';
import { useModel } from 'umi';
import ViewHocPhi from './ViewHocPhi';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

const QuanLyLop = (props: {
  donViId?: string;
  thang?: number;
  nam?: number;
  render?: boolean;
  disableSuaThongTin: boolean;
}) => {
  const {
    loading: loadingQuanLyLop,
    getBangHocPhiHSModel,
    page,
    limit,
    cond,
    recordBangHocPhi,
    setRecordBangHocPhi,
  } = useModel('banghocphilop');
  const { message: noiDungThongBao, setMessage } = useModel('thongtinhocphi');
  const [visible, setVisible] = useState<boolean>(false);
  const [visibleGuiThongBao, setVisibleGuiThongBao] = useState<boolean>(false);
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;

  const getMessage = async () => {
    const res = await axios.get(`${ip3}​/thong-bao-hoc-phi-truong`, {
      params: { donViId: organizationId },
    });
    setMessage(res?.data?.data);
  };

  useEffect(() => {
    getMessage();
  }, []);

  const handleAccept = async (val: IQuanLyLop.ViewHocPhi) => {
    const newVal = val;
    // if (
    //   newVal.trangThaiThanhToan === 'Chưa thanh toán' ||
    //   newVal.trangThaiThanhToan === 'Chưa thanh toán'
    // ) {
    //   newVal.trangThaiThanhToan = 'Đã thanh toán';
    // }
    newVal.trangThaiThanhToan = 'Đã thanh toán';
    try {
      const res = await updTrangThaiThanhToan({
        ...newVal,
        id: newVal?._id,
      });
      if (res?.status === 200) {
        message.success('Cập nhật trạng thái thanh toán thành công');
        getBangHocPhiHSModel(props?.donViId, props?.thang, props?.nam);
        return true;
      }
    } catch (error) {
      message.error('Cập nhật trạng thái thanh toán không thành công');
      return false;
    }
    return true;
  };

  const renderLast = (record: IQuanLyLop.ViewHocPhi) => {
    return (
      <React.Fragment>
        <Button
          type="default"
          shape="circle"
          onClick={() => {
            setVisible(true);
            ;
            setRecordBangHocPhi(record);
          }}
          title="Xem chi tiết"
        >
          <EyeOutlined />
        </Button>
        <Divider type="vertical" />
        {props?.disableSuaThongTin !== true && (
          <Button
            type="primary"
            shape="circle"
            title="Cập nhật thanh toán"
            onClick={() => {
              handleAccept(record);
            }}
            disabled={record?.trangThaiThanhToan === 'Đã thanh toán'}
          >
            <CheckOutlined />
          </Button>
        )}
        {props?.disableSuaThongTin !== true && (
          <>
            <Divider type="vertical" />
            <Button
              type="default"
              shape="circle"
              onClick={() => {
                setVisibleGuiThongBao(true);
                setRecordBangHocPhi(record);
              }}
              title="Gửi thông báo học phí"
            >
              <MessageOutlined />
            </Button>
          </>
        )}
      </React.Fragment>
    );
  };

  const columns: IColumn<IQuanLyLop.Record>[] = [
    {
      title: 'Họ và tên con',
      dataIndex: ['con', 'hoTen'],
      align: 'center',
      width: 200,
      fixed: 'left',
    },
    {
      title: 'Họ và tên phụ huynh',
      dataIndex: ['phuHuynh', 'profile', 'fullname'],
      align: 'center',
      width: 200,
    },
    {
      title: 'Số điện thoại phụ huynh',
      dataIndex: ['phuHuynh', 'profile', 'phoneNumber'],
      align: 'center',
      width: 150,
    },
    {
      title: 'Học phí thực tế',
      dataIndex: 'hocPhiThucTeThangTruoc',
      align: 'center',
      width: 150,
      render: (val) => formatterMoney(val),
    },
    {
      title: 'Học phí phải đóng',
      dataIndex: 'hocPhiPhaiDong',
      align: 'center',
      width: 150,
      render: (val) => formatterMoney(val),
    },
    {
      title: 'Học phí dự kiến tháng sau',
      dataIndex: 'hocPhiDuKienThangSau',
      align: 'center',
      width: 150,
      render: (val) => formatterMoney(val),
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'trangThaiThanhToan',
      align: 'center',
      width: 150,
      render: (val) =>
        val === 'Đã thanh toán' ? (
          <Tag color="blue">Đã thanh toán</Tag>
        ) : (
          <Tag color="red">{val}</Tag>
        ),
      fixed: 'right',
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: IQuanLyLop.ViewHocPhi) => renderLast(record),
      fixed: 'right',
      width: 200,
    },
  ];

  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={() => {
          getBangHocPhiHSModel(props?.donViId, props?.thang, props?.nam);
        }}
        loading={loadingQuanLyLop}
        dependencies={[page, limit, cond, props?.donViId, props?.thang, props?.nam, props?.render]}
        modelName="banghocphilop"
        scroll={{ x: 1000 }}
      />
      <Modal
        title="Gửi thông báo học phí"
        destroyOnClose
        onCancel={() => setVisibleGuiThongBao(false)}
        footer={[]}
        visible={visibleGuiThongBao}
      >
        <Form
          onFinish={async (value) => {
            try {
              const response = await axios.post(
                `${ip3}/hoc-phi/${recordBangHocPhi?._id}/send-notification`,
                {
                  content: value?.noiDung ?? '',
                },
              );
              message.success('Gửi thông báo thành công');
              setVisibleGuiThongBao(false);
            } catch (e) {
              message.error('Gửi thông báo không thành công');
            }
          }}
        >
          <Form.Item label="Nội dung" name="noiDung" initialValue={noiDungThongBao?.noiDung}>
            <Input.TextArea placeholder="Gửi thông báo học phí" disabled />
          </Form.Item>
          <center>
            <Button htmlType="submit" type="primary">
              Gửi thông báo
            </Button>
          </center>
        </Form>
      </Modal>

      <Modal
        title="Chi tiết học phí"
        visible={visible}
        destroyOnClose
        footer={[]}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <ViewHocPhi />
      </Modal>
    </>
  );
};

export default QuanLyLop;
