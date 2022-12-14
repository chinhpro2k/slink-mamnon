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
        message.success('Th??m m???i th??nh c??ng');
        getKhaiBaoThongTinModel(props?.taiKhoanPH ? props?.childId : undefined);
        setVisibleDrawer(false);
        return true;
      }
      message.error('???? x???y ra l???i');
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
      message.success('C???p nh???t th??nh c??ng');
      getKhaiBaoThongTinModel(props?.taiKhoanPH ? props?.childId : undefined);
      setVisibleDrawer(false);
      return true;
    }
    message.error('???? x???y ra l???i');
    return false;
  };

  const handleDel = async (_id: string) => {
    try {
      const res = await delConKhach({ id: _id });
      if (res?.status === 200) {
        message.success('X??a th??nh c??ng');
        getKhaiBaoThongTinModel(props?.taiKhoanPH ? props?.childId : undefined);
        return true;
      }
    } catch (error) {
      const { response }: any = error;
      if (response?.data?.errorCode === 'NOT_ALLOW')
        message.error('B???n kh??ng ???????c ph??p x??a con ???? v??o l???p');
      return false;
    }
    return true;
  };

  const renderLast = (record: IKhaiBaoThongTin.Record) => {
    return (
      <React.Fragment>
        <Button type="default" shape="circle" title="Xem th??m" onClick={() => handleView(record)}>
          <EyeOutlined />
        </Button>
        <Divider type="vertical" />
        <Button
          type="primary"
          shape="circle"
          onClick={() => {
            handleEdit(record);
          }}
          title="Ch???nh??s???a"
        >
          <EditOutlined />
        </Button>
        <Divider type="vertical" />
        <Popconfirm
          title="B???n??c????ch???c??mu???n??x??a?"
          // eslint-disable-next-line no-underscore-dangle
          onConfirm={() => handleDel(record?._id)}
          okText="?????ng ??"
          // disabled={!!record?.donViId}
        >
          <Button type="default" shape="circle" title="X??a"
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
      title: 'H??? v?? t??n',
      dataIndex: 'hoTen',
      align: 'center',
      width: 200,
      onCell,
    },
    {
      title: 'Bi???t danh',
      dataIndex: 'bietDanh',
      align: 'center',
      // width: 200,
      onCell,
      render: (val) => val || 'Kh??ng c??',
    },
    {
      title: 'M?? h???c sinh',
      dataIndex: 'maHocSinh',
      align: 'center',
      // width: 200,
      onCell,
      render: (val) => val || 'Kh??ng c??',
    },
    {
      title: 'Ng??y sinh',
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
      title: 'Chi???u cao (cm)',
      dataIndex: 'chieuCao',
      align: 'center',
      width: 100,
      render: (val) => val || 'Kh??ng c??',
      onCell,
    },
    {
      title: 'C??n n???ng (kg)',
      dataIndex: 'canNang',
      align: 'center',
      width: 100,
      render: (val) => val || 'Kh??ng c??',
      onCell,
    },
    {
      title: 'Thao t??c',
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
        title="Th??ng tin con"
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
            Th??m m???i
          </Button>
        )}
        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          T???ng s???:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={total}
          />
        </h3>
      </TableBase>
      <Drawer
        visible={visibleDrawer}
        title={edit ? 'Ch???nh s???a' : 'Th??m m???i'}
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
                {edit ? 'C???p nh???t' : 'Th??m m???i'}
              </Button>
              <Button
                onClick={() => {
                  setVisibleDrawer(false);
                }}
              >
                Quay l???i
              </Button>
            </Row>
          </Form.Item>
        </Form>
      </Drawer>
      <Modal
        title="Th??ng tin con"
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
          <Descriptions.Item label="H??? v?? t??n">{newRecord?.hoTen}</Descriptions.Item>
          <Descriptions.Item label="M?? h???c sinh">
            {newRecord?.maHocSinh || 'Kh??ng c??'}
          </Descriptions.Item>
          <Descriptions.Item label="Bi???t danh">
            {newRecord?.bietDanh || 'Kh??ng c??'}
          </Descriptions.Item>
          <Descriptions.Item label="Ng??y sinh">
            {newRecord?.ngaySinh}-{newRecord?.thangSinh}-{newRecord?.namSinh}
          </Descriptions.Item>
          <Descriptions.Item label="Chi???u cao (cm)">
            {newRecord?.chieuCao ?? 'Kh??ng c??'}
          </Descriptions.Item>
          <Descriptions.Item label="C??n n???ng (kg)">
            {newRecord?.canNang ?? 'Kh??ng c??'}
          </Descriptions.Item>
          <Descriptions.Item label="Nh??m m??u">{newRecord?.nhomMau ?? 'Kh??ng c??'}</Descriptions.Item>
          <Descriptions.Item label="B???nh v??? m???t">
            {newRecord?.benhVeMat === true ? 'C??' : 'Kh??ng'}
          </Descriptions.Item>
          {newRecord?.ghiChuBenhVeMat && (
            <Descriptions.Item label="Ghi ch?? b???nh v??? m???t">
              {newRecord?.ghiChuBenhVeMat}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="B???nh v??? m??i">
            {newRecord?.benhVeMui === true ? 'C??' : 'Kh??ng'}
          </Descriptions.Item>
          {newRecord?.ghiChuBenhVeMui && (
            <Descriptions.Item label="Ghi ch?? b???nh v??? m??i">
              {newRecord?.ghiChuBenhVeMui}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="B???nh v??? tai">
            {newRecord?.benhVeTai === true ? 'C??' : 'Kh??ng'}
          </Descriptions.Item>
          {newRecord?.ghiChuBenhVeTai && (
            <Descriptions.Item label="Ghi ch?? b???nh tai">
              {newRecord?.ghiChuBenhVeTai}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="B???nh ngo??i da">
            {newRecord?.benhNgoaiDa === true ? 'C??' : 'Kh??ng'}
          </Descriptions.Item>
          {newRecord?.ghiChuBenhNgoaiDa && (
            <Descriptions.Item label="Ghi ch?? b???nh ngo??i da">
              {newRecord?.ghiChuBenhNgoaiDa}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Ch??? ????? ??n ?????c bi???t">
            {newRecord?.cheDoAnDacBiet === true ? 'C??' : 'Kh??ng'}
          </Descriptions.Item>
          {newRecord?.ghiChuCheDoAn && (
            <Descriptions.Item label="Ghi ch?? ch??? ????? ??n">
              {newRecord?.ghiChuCheDoAn}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="C?? th???">{newRecord?.coThe ?? 'Kh??ng c??'}</Descriptions.Item>
          <Descriptions.Item label="Ghi ch??">{newRecord?.ghiChu ?? 'Kh??ng c??'}</Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};

export default KhaiBaoThongTin;
