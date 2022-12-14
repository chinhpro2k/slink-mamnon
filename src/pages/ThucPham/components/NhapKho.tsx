/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import { checkAllow } from '@/components/CheckAuthority';
import TableBase from '@/components/Table';
import type { ThucPhamKho as IThucPhamKho } from '@/services/ThucPhamKho';
import { delThucPhamKho } from '@/services/ThucPhamKho/thucphamkho';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Descriptions,
  Divider,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
} from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { useModel } from 'umi';
import Formm from './FormThucPhamKho';

const ThucPhamKho = () => {
  const {
    loading: loadingThucPhamKho,
    getNhapKhoModel,
    total,
    page,
    limit,
    cond,
    setRecord,
    setVisibleForm,
    setEdit,
    record: recordThucPham,
    setPage,
    timeStart,
    setTimeStart,
    timeEnd,
    setTimeEnd,
  } = useModel('nhapkho');
  const { danhSachTruong, getThucPhamKhoModel } = useModel('thucphamkho');
  const [visible, setVisible] = useState(false);
  const vaiTro = localStorage.getItem('vaiTro');
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;

  const [donViId, setDonViId] = useState(organizationId);

  const onChange = (value: string) => {
    setDonViId(value);
  };

  const changeDate = (val: any) => {
    if (val === null) {
      const start = moment().startOf('date').toDate();
      const end = moment().endOf('date').toDate();
      setTimeStart(start);
      setTimeEnd(end);
    } else {
      const start = moment(val).startOf('date').toDate();
      const end = moment(val).endOf('date').toDate();
      setTimeStart(start);
      setTimeEnd(end);
    }

    setPage(1);
  };

  const handleEdit = (val: any) => {
    setVisibleForm(true);
    setEdit(true);
    setRecord(val);
  };
  const handleDel = async (val: any) => {
    try {
      const res = await delThucPhamKho({ id: val });
      if (res?.status === 200) {
        message.success('X??a th??nh c??ng');
        getNhapKhoModel(donViId);
        getThucPhamKhoModel(donViId);
        return true;
      }
    } catch (error) {
      message.error('???? x???y ra l???i');
      return false;
    }
    return false;
  };
  const handleView = (val: any) => {
    setRecord(val);
    setVisible(true);
  };

  const onCell = (record: IThucPhamKho.Record) => ({
    onClick: () => {
      handleView(record);
    },
    style: { cursor: 'pointer' },
  });

  const renderLast1 = (record: IThucPhamKho.Record) => {
    return (
      <React.Fragment>
        <Button
          type="primary"
          shape="circle"
          onClick={() => handleView(record)}
          title="Xem chi ti???t"
        >
          <EyeOutlined />
        </Button>
        <Divider type="vertical" />

        <Button
          type="default"
          shape="circle"
          onClick={() => handleEdit(record)}
          title="Ch???nh??s???a"
          disabled={!checkAllow('EDIT_THUC_PHAM_KHO')}
        >
          <EditOutlined />
        </Button>

        <Divider type="vertical" />

        <Popconfirm
          title="B???n??c????ch???c??mu???n??x??a?"
          onConfirm={() => handleDel(record._id)}
          disabled={!checkAllow('DEL_THUC_PHAM_KHO')}
          cancelText="H???y"
        >
          <Button
            type="primary"
            shape="circle"
            title="X??a"
            disabled={!checkAllow('DEL_THUC_PHAM_KHO')}
          >
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      </React.Fragment>
    );
  };

  const columns: IColumn<IThucPhamKho.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'T??n ?????y ?????',
      dataIndex: 'ten',
      align: 'center',
      width: 200,
      onCell,
    },
    {
      title: 'Kh???i l?????ng',
      dataIndex: 'khoiLuong',
      align: 'center',
      width: 100,
      onCell,
      render: (val) => val && `${Number(val ?? 0).toFixed(2)}`,
    },
    {
      title: '????n v??? t??nh',
      dataIndex: 'donViTinh',
      align: 'center',
      width: 100,
    },
    // {
    //   title: 'T??n t???t',
    //   dataIndex: 'tenVietTat',
    //   align: 'center',
    //   width: 150,
    //   onCell,
    //   render: (val) => val ?? 'Kh??ng c??',
    //   search: 'search',
    // },
    {
      title: 'Ng??y nh???p',
      dataIndex: 'createdAt',
      align: 'center',
      width: 100,
      render: (val) => (val ? moment(val).format('DD/MM/YYYY') : 'Kh??ng c??'),
    },
    // {
    //   title: 'Thao t??c',
    //   align: 'center',
    //   render: (record: IThucPhamKho.Record) => renderLast1(record),
    //   fixed: 'right',
    //   width: 170,
    // },
  ];

  if (vaiTro === 'SuperAdmin' || vaiTro === 'Admin') {
    columns.splice(5, 0, {
      title: 'Tr?????ng',
      dataIndex: ['donVi', 'tenDonVi'],
      align: 'center',
      width: 200,
      onCell,
    });
  }

  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={() => getNhapKhoModel(donViId)}
        dependencies={[page, limit, cond, donViId, timeStart, timeEnd]}
        loading={loadingThucPhamKho}
        modelName="nhapkho"
        scroll={{ x: 1000 }}
        Form={Formm}
        formType="Drawer"
        widthDrawer="60%"
        hascreate={checkAllow('ADD_THUC_PHAM_KHO')}
      >
        {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
          <Select
            defaultValue="T???t c???"
            showSearch
            style={{ width: '15%', marginRight: '10px' }}
            placeholder="Ch???n ????n v???"
            optionFilterProp="children"
            onChange={onChange}
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Select.Option key="T???t c???" value="T???t c???">
              T???t c??? c??c tr?????ng
            </Select.Option>
            {danhSachTruong?.map((item: { _id: string; tenDonVi: string }) => (
              <Select.Option key={item?._id} value={item?._id}>
                {item?.tenDonVi}
              </Select.Option>
            ))}
          </Select>
        )}

        <DatePicker
          onChange={changeDate}
          defaultValue={moment()}
          disabledDate={(date) => moment().isBefore(date)}
          format="DD-MM-YYYY"
          placeholder="Ch???n ng??y"
          style={{ marginRight: '10px' }}
        />

        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          T???ng s???:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={total}
          />
        </h3>
      </TableBase>

      {/* Modal view th??ng tin th???c ph???m kho */}
      <Modal
        visible={visible}
        centered
        closable
        onCancel={() => setVisible(false)}
        width="50%"
        footer={[
          <Button type="primary" key="back" onClick={() => setVisible(false)}>
            OK
          </Button>,
        ]}
      >
        <Descriptions title="Chi ti???t th???c ph???m kho">
          {recordThucPham?.tenVietTat && (
            <Descriptions.Item label="T??n t???t">{recordThucPham?.tenVietTat}</Descriptions.Item>
          )}
          <Descriptions.Item label="T??n ?????y ?????">{recordThucPham?.ten}</Descriptions.Item>
          {recordThucPham?.khoiLuong && (
            <Descriptions.Item label="Kh???i l?????ng">
              {Number(recordThucPham?.khoiLuong).toFixed(2)}g
            </Descriptions.Item>
          )}
          {recordThucPham?.theTich && (
            <Descriptions.Item label="Kh???i l?????ng">{recordThucPham?.theTich}ml</Descriptions.Item>
          )}
          {(vaiTro === 'Admin' || vaiTro === 'SuperAdmin') && (
            <Descriptions.Item label="Tr?????ng">{recordThucPham?.donVi?.tenDonVi}</Descriptions.Item>
          )}
        </Descriptions>
      </Modal>
    </>
  );
};

export default ThucPhamKho;
