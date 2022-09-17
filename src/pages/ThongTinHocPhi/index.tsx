/* eslint-disable no-underscore-dangle */
import { checkAllow } from '@/components/CheckAuthority';
import TableBase from '@/components/Table';
import type { QuanLyLop as IQuanLyLop } from '@/services/QuanLyLop';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Select, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import moment from 'moment';

const QuanLyLop = () => {
  const [danhSachTruong, setDanhSachTruong] = useState([]);
  const {
    loading: loadingQuanLyLop,
    getQuanLyLopModel,
    page,
    limit,
    cond,
    setCondition,
    setPage,
  } = useModel('quanlylop');
  const { setRecord: setRecordQuanLyLop } = useModel('quanlylop');
  const vaiTro = localStorage.getItem('vaiTro');
  const [idTruong, setIdTruong] = useState<string>('Tất cả');
  const [visibleGuiThongBao, setVisibleGuiThongBao] = useState(false);
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [recordHocPhi, setRecordHocPhi] = useState<any>();
  const thang = new Date().getMonth();
  const nam = new Date().getFullYear();
  const {
    message: noiDungThongBao,
    setMessage,
    saveMessage,
    setSaveMessage,
  } = useModel('thongtinhocphi');

  const getMessage = async () => {
    const res = await axios.get(`${ip3}​/thong-bao-hoc-phi-truong`, {
      params: { donViId: organizationId },
    });
    setMessage(res?.data?.data);
  };

  const getDSTruong = async () => {
    const res = await axios.get(
      `${ip3}/thong-tin-hoc-phi-truong/truong/${organizationId}/thang/${thang}/nam/${nam}`,
    );
    setRecordHocPhi(res?.data?.data);
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=100`);
    const arrTruong: any = [];

    arrTruong.push({ tenDonVi: 'Tất cả các trường', _id: 'Tất cả' });
    result?.data?.data?.result?.map(
      (item: { loaiDonVi: string }) => item?.loaiDonVi === 'Truong' && arrTruong?.push(item),
    );
    setDanhSachTruong(arrTruong);
  };

  const onChange = (value: string) => {
    setCondition({ _id: value });
    setPage(1);
    setIdTruong(value);
  };

  React.useEffect(() => {
    getDSTruong();
    getMessage();
  }, []);
  const onCell = (record: IQuanLyLop.Record) => ({
    onClick: !checkAllow('CHI_TIET_LOP')
      ? undefined
      : () => {
          setRecordQuanLyLop({ ...record, idTruong });
          // eslint-disable-next-line no-underscore-dangle
          history.push(`/quanlyhocsinh/thongtinhocphi/${record._id}`);
        },
    style: { cursor: 'pointer' },
  });

  const renderLast = (record: IQuanLyLop.Record) => {
    return (
      <React.Fragment>
        <Button
          type="primary"
          shape="circle"
          onClick={() => {
            setRecordQuanLyLop({ ...record, idTruong });
            history.push(`/quanlyhocsinh/thongtinhocphi/${record._id}`);
          }}
          disabled={!checkAllow('CHI_TIET_LOP')}
          title="Xem chi tiết"
        >
          <EyeOutlined />
        </Button>
      </React.Fragment>
    );
  };

  const columns: IColumn<IQuanLyLop.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'Tên lớp',
      dataIndex: 'tenDonVi',
      align: 'center',
      width: 200,
      onCell,
      search: 'search',
    },
    {
      title: 'Mã lớp',
      dataIndex: '_id',
      align: 'center',
      width: 250,
    },
    {
      title: 'Trường',
      dataIndex: 'parent',
      align: 'center',
      width: 200,
      onCell,
      render: (val) =>
        danhSachTruong?.map(
          (item: { _id: string; tenDonVi: string }) => item?._id === val && item?.tenDonVi,
        ),
    },
    {
      title: 'Độ tuổi của lớp (tháng)',
      dataIndex: 'doTuoi',
      align: 'center',
      width: 150,
      onCell,
    },
    {
      title: 'Số học sinh/Số học sinh tối đa',
      dataIndex: 'sySo',
      align: 'center',
      width: 150,
      onCell,
      render: (val, record) => (
        <div>
          {record?.soHocSinhThucTe}/{val}
        </div>
      ),
    },
    {
      title: 'Số quản lý',
      dataIndex: 'soQuanLyToiDa',
      align: 'center',
      width: 130,
      onCell,
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: IQuanLyLop.Record) => renderLast(record),
      fixed: 'right',
      width: 100,
    },
  ];

  useEffect(() => {}, []);

  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={getQuanLyLopModel}
        loading={loadingQuanLyLop}
        dependencies={[page, limit, cond]}
        modelName="quanlylop"
        title="Danh sách lớp"
        scroll={{ x: 1000 }}
      >
        {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
          <Select
            value={idTruong}
            showSearch
            style={{ width: '15%', marginBottom: '10px' }}
            placeholder="Chọn đơn vị"
            optionFilterProp="children"
            onChange={onChange}
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {danhSachTruong?.map((item: { _id: string; tenDonVi: string }) => (
              <Select.Option value={item?._id}>{item?.tenDonVi}</Select.Option>
            ))}
          </Select>
        )}
        <div style={{ display: 'flex', margin: '10px 0px' }}>
          <Input.TextArea
            value={noiDungThongBao?.noiDung ?? ''}
            style={{ width: 400, marginRight: 10 }}
            // readOnly={recordHocPhi?.ngayGuiThongBao < moment().date()}
            onChange={(e) => {
              setMessage({
                ...noiDungThongBao,
                noiDung: e.target.value,
              });
              setSaveMessage(true);
            }}
          />
          {saveMessage && (
            <Button
              type="primary"
              onClick={async () => {
                try {
                  const response = await axios.post(`${ip3}/thong-bao-hoc-phi-truong`, {
                    donViId: noiDungThongBao?.donViId ?? organizationId,
                    noiDung: noiDungThongBao?.noiDung ?? '',
                  });
                  setSaveMessage(false);
                  message.success('Lưu nôi dung thành công');
                } catch (e) {
                  message.error('Lưu nội dung bị lỗi');
                }
              }}
              style={{ marginRight: 10 }}
            >
              Lưu nội dung thông báo
            </Button>
          )}
          <Button
            type="primary"
            onClick={async () => {
              if (noiDungThongBao?.noiDung == '' || noiDungThongBao?.noiDung == undefined) {
                message.error('Nôi dung thông báo không để trống');
                return;
              }
              if (recordHocPhi?.ngayGuiThongBao < moment().date()){
                message.error('Ngày gửi thông báo phải lớn hơn hoặc bằng ngày hiện tại');
                return;
              }
              try {
                const response = await axios.post(
                  `${ip3}/hoc-phi/send-notification/truong/${organizationId}/thang/${thang}/nam/${nam}`,
                  { content: noiDungThongBao?.noiDung },
                );
                message.success('Gửi thông báo thành công');
              } catch (e) {
                message.error('Gửi thông báo gặp lỗi');
              }
            }}
            style={{ marginRight: 10 }}
          >
            Gửi thông báo
          </Button>
          <Button
            type="primary"
            style={{ marginRight: 10 }}
            onClick={async () => {
              try {
                const response = await axios.post(
                  `${ip3}/hoc-phi/tinh-hoc-phi-truong/truong/${organizationId}/thang/${moment().month()}/nam/${moment().year()}`,
                );
                message.success('Đã tính lại học phí của trường');
              } catch (e) {
                const errorCode = e?.response?.data?.errorCode;
                if (errorCode === 'THONG_TIN_HOC_PHI_LOP_NOT_FOUND') {
                  message.error('Chưa cập nhật thông tin học phí trường');
                } else {
                  message.error('Tính học bị lỗi');
                }
              }
            }}
          >
            Tính toán học phí
          </Button>
        </div>
      </TableBase>
      <Modal
        destroyOnClose
        title="Gửi thông báo học phí"
        onCancel={() => {
          setVisibleGuiThongBao(false);
        }}
        visible={visibleGuiThongBao}
        footer={[]}
      >
        <Form onFinish={(value) => {}}>
          <Form.Item label="Nội dung" name="noiDung">
            <Input.TextArea />
          </Form.Item>
          <center>
            <Button htmlType="submit" type="primary">
              Gửi thông báo
            </Button>
          </center>
        </Form>
      </Modal>
    </>
  );
};

export default QuanLyLop;
