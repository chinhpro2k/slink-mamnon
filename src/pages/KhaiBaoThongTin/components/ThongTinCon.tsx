/* eslint-disable no-param-reassign */
import TableBase from '@/components/Table';
import FormCon from '@/pages/QuanLyTaiKhoan/components/FormCon';
import type { KhaiBaoThongTin as IKhaiBaoThongTin } from '@/services/KhaiBaoThongTin';
import { addConKhach, delConKhach, updConKhach } from '@/services/KhaiBaoThongTin/khaibaothongtin';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleFilled } from '@ant-design/icons';
import {
  Button,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
} from 'antd';
import type { ColumnProps } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { checkAllow } from '@/components/CheckAuthority';

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const KhaiBaoThongTin = (props: { childId?: string; taiKhoanPH?: boolean }) => {
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [newRecord, setNewRecord] = useState<IKhaiBaoThongTin.Record>();
  const {
    loading: loadingKhaiBaoThongTin,
    getKhaiBaoThongTinModel,
    total,
    page,
    limit,
    cond,
  } = useModel('khaibaothongtin');
  const handleView = (record: IKhaiBaoThongTin.Record) => {
    setNewRecord(record);
    setVisible(true);
  };

  const handleEdit = (record: IKhaiBaoThongTin.Record) => {
    setVisibleDrawer(true);
    setEdit(true);
    setNewRecord(record);
  };

  const onCell = (record: IKhaiBaoThongTin.Record) => ({
    onClick: () => {
      handleView(record);
    },
    style: { cursor: 'pointer' },
  });

  const onFinish = async (values: IKhaiBaoThongTin.Record) => {
    if (!edit) {
      const { ngaySinh } = values;
      values.ngaySinh = new Date(ngaySinh).getDate();
      values.thangSinh = new Date(ngaySinh).getMonth() + 1;
      values.namSinh = new Date(ngaySinh).getFullYear();
      const res = await addConKhach({ ...values });
      if (res?.data?.statusCode === 201) {
        message.success('Thêm mới thành công');
        getKhaiBaoThongTinModel(props?.taiKhoanPH ? props?.childId : undefined);
        setVisibleDrawer(false);
        return true;
      }
      message.error('Đã xảy ra lỗi');
      return false;
    }
    const { ngaySinh } = values;
    values.ngaySinh = new Date(ngaySinh).getDate();
    values.thangSinh = new Date(ngaySinh).getMonth() + 1;
    values.namSinh = new Date(ngaySinh).getFullYear();
    // eslint-disable-next-line no-underscore-dangle
    const id = newRecord?._id;
    const res = await updConKhach({ ...values, id });
    if (res?.data?.statusCode === 200) {
      message.success('Cập nhật thành công');
      getKhaiBaoThongTinModel(props?.taiKhoanPH ? props?.childId : undefined);
      setVisibleDrawer(false);
      return true;
    }
    message.error('Đã xảy ra lỗi');
    return false;
  };

  const handleDel = async (_id: string) => {
    try {
      const res = await delConKhach({ id: _id });
      if (res?.status === 200) {
        message.success('Xóa thành công');
        getKhaiBaoThongTinModel(props?.taiKhoanPH ? props?.childId : undefined);
        return true;
      }
    } catch (error) {
      const { response }: any = error;
      if (response?.data?.errorCode === 'NOT_ALLOW')
        message.error('Bạn không được phép xóa con đã vào lớp');
      return false;
    }
    return true;
  };

  const renderLast = (record: IKhaiBaoThongTin.Record) => {
    return (
      <React.Fragment>
        <Button type="default" shape="circle" title="Xem thêm" onClick={() => handleView(record)}>
          <EyeOutlined />
        </Button>
        <Divider type="vertical" />
        <Button
          type="primary"
          shape="circle"
          onClick={() => {
            handleEdit(record);
          }}
          title="Chỉnh sửa"
        >
          <EditOutlined />
        </Button>
        <Divider type="vertical" />
        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          // eslint-disable-next-line no-underscore-dangle
          onConfirm={() => handleDel(record?._id)}
          okText="Đồng ý"
          // disabled={!!record?.donViId}
        >
          <Button type="default" shape="circle" title="Xóa"
                  // disabled={!!record?.donViId}
          >
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      </React.Fragment>
    );
  };

  const columns: ColumnProps<IKhaiBaoThongTin.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'hoTen',
      align: 'center',
      width: 200,
      onCell,
    },
    {
      title: 'Biệt danh',
      dataIndex: 'bietDanh',
      align: 'center',
      // width: 200,
      onCell,
      render: (val) => val || 'Không có',
    },
    {
      title: 'Mã học sinh',
      dataIndex: 'maHocSinh',
      align: 'center',
      // width: 200,
      onCell,
      render: (val) => val || 'Không có',
    },
    {
      title: 'Ngày sinh',
      align: 'center',
      width: 100,
      onCell,
      render: (val, record) => (
        <div>
          {record.ngaySinh}-{record.thangSinh}-{record.namSinh}
        </div>
      ),
    },
    {
      title: 'Chiều cao (cm)',
      dataIndex: 'chieuCao',
      align: 'center',
      width: 100,
      render: (val) => val || 'Không có',
      onCell,
    },
    {
      title: 'Cân nặng (kg)',
      dataIndex: 'canNang',
      align: 'center',
      width: 100,
      render: (val) => val || 'Không có',
      onCell,
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: IKhaiBaoThongTin.Record) => renderLast(record),
      fixed: 'right',
      width: 180,
    },
  ];

  useEffect(() => {}, []);
  const [form] = Form.useForm();
  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={() => getKhaiBaoThongTinModel(props?.taiKhoanPH ? props?.childId : undefined)}
        loading={loadingKhaiBaoThongTin}
        dependencies={[cond, page, limit]}
        modelName="khaibaothongtin"
        title="Thông tin con"
        scroll={{ x: 1000 }}
      >
        {!props?.childId && (
          <Button
            style={{ marginBottom: '10px', marginRight: '10px' }}
            onClick={() => {
              form.resetFields();
              setEdit(false);
              setVisibleDrawer(true);
            }}
            type="primary"
          >
            <PlusCircleFilled />
            Thêm mới
          </Button>
        )}
        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          Tổng số:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={total}
          />
        </h3>
      </TableBase>
      <Drawer
        visible={visibleDrawer}
        title={edit ? 'Chỉnh sửa' : 'Thêm mới'}
        width="45%"
        onClose={() => setVisibleDrawer(false)}
        destroyOnClose
        forceRender={false}
      >
        <Form  onFinish={onFinish} {...formItemLayout}>
          <FormCon
            form={form}
            edit={edit}
            record={newRecord}
            disable={!checkAllow('EDIT_TAI_KHOAN_CON')}
          />
          <Divider />
          <Form.Item>
            <Row align="bottom">
              <Button htmlType="submit" type="primary" style={{ marginRight: '10px' }}>
                {edit ? 'Cập nhật' : 'Thêm mới'}
              </Button>
              <Button
                onClick={() => {
                  setVisibleDrawer(false);
                }}
              >
                Quay lại
              </Button>
            </Row>
          </Form.Item>
        </Form>
      </Drawer>
      <Modal
        title="Thông tin con"
        visible={visible}
        width="60%"
        footer={
          <Button
            type="primary"
            onClick={() => {
              setVisible(false);
            }}
          >
            Ok
          </Button>
        }
        onCancel={() => {
          setVisible(false);
        }}
      >
        <Descriptions bordered>
          <Descriptions.Item label="Họ và tên">{newRecord?.hoTen}</Descriptions.Item>
          <Descriptions.Item label="Mã học sinh">
            {newRecord?.maHocSinh || 'Không có'}
          </Descriptions.Item>
          <Descriptions.Item label="Biệt danh">
            {newRecord?.bietDanh || 'Không có'}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {newRecord?.ngaySinh}-{newRecord?.thangSinh}-{newRecord?.namSinh}
          </Descriptions.Item>
          <Descriptions.Item label="Chiều cao (cm)">
            {newRecord?.chieuCao ?? 'Không có'}
          </Descriptions.Item>
          <Descriptions.Item label="Cân nặng (kg)">
            {newRecord?.canNang ?? 'Không có'}
          </Descriptions.Item>
          <Descriptions.Item label="Nhóm máu">{newRecord?.nhomMau ?? 'Không có'}</Descriptions.Item>
          <Descriptions.Item label="Bệnh về mắt">
            {newRecord?.benhVeMat === true ? 'Có' : 'Không'}
          </Descriptions.Item>
          {newRecord?.ghiChuBenhVeMat && (
            <Descriptions.Item label="Ghi chú bệnh về mắt">
              {newRecord?.ghiChuBenhVeMat}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Bệnh về mũi">
            {newRecord?.benhVeMui === true ? 'Có' : 'Không'}
          </Descriptions.Item>
          {newRecord?.ghiChuBenhVeMui && (
            <Descriptions.Item label="Ghi chú bệnh về mũi">
              {newRecord?.ghiChuBenhVeMui}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Bệnh về tai">
            {newRecord?.benhVeTai === true ? 'Có' : 'Không'}
          </Descriptions.Item>
          {newRecord?.ghiChuBenhVeTai && (
            <Descriptions.Item label="Ghi chú bệnh tai">
              {newRecord?.ghiChuBenhVeTai}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Bệnh ngoài da">
            {newRecord?.benhNgoaiDa === true ? 'Có' : 'Không'}
          </Descriptions.Item>
          {newRecord?.ghiChuBenhNgoaiDa && (
            <Descriptions.Item label="Ghi chú bệnh ngoài da">
              {newRecord?.ghiChuBenhNgoaiDa}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Chế độ ăn đặc biệt">
            {newRecord?.cheDoAnDacBiet === true ? 'Có' : 'Không'}
          </Descriptions.Item>
          {newRecord?.ghiChuCheDoAn && (
            <Descriptions.Item label="Ghi chú chế độ ăn">
              {newRecord?.ghiChuCheDoAn}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Cơ thể">{newRecord?.coThe ?? 'Không có'}</Descriptions.Item>
          <Descriptions.Item label="Ghi chú">{newRecord?.ghiChu ?? 'Không có'}</Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};

export default KhaiBaoThongTin;
