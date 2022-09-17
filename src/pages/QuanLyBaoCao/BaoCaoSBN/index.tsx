/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { BaoCaoSBN as IBaoCaoSBN } from '@/services/BaoCaoSBN';
import { delBaoCaoSBN } from '@/services/BaoCaoSBN/baocaosbn';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Descriptions, Divider, Input, message, Modal, Popconfirm, Select } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { useModel } from 'umi';
import Formm from './components/Form';

const BaoCaoSBN = () => {
  const {
    loading: loadingBaoCaoSBN,
    getBaoCaoSBNModel,
    total,
    page,
    limit,
    cond,
    setRecord,
    setVisibleForm,
    setEdit,
    setPage,
    getTruongModel,
    danhSachTruong,
  } = useModel('baocaosbn');

  const vaiTro = localStorage.getItem('vaiTro');
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [donViId, setDonViId] = useState<string | undefined>(organizationId);
  const [visible, setVisible] = useState<boolean>(false);
  const [recordBaoCao, setRecordBaoCao] = useState<IBaoCaoSBN.Record>({} as any);

  React.useEffect(() => {
    getTruongModel();
  }, []);

  const handleEdit = (val: any) => {
    setVisibleForm(true);
    setEdit(true);
    setRecord(val);
  };

  const onChange = (value: string) => {
    setPage(1);
    if (value === 'Tất cả') {
      setDonViId(undefined);
    } else {
      setDonViId(value);
    }
  };

  const handleDel = async (val: string) => {
    try {
      const res = await delBaoCaoSBN({ id: val });
      if (res?.status === 200) {
        message.success('Xóa thành công');
        getBaoCaoSBNModel(donViId);
        return true;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return false;
  };

  const renderLast = (record: IBaoCaoSBN.Record) => {
    return (
      <React.Fragment>
        <Button
          type="primary"
          shape="circle"
          onClick={() => {
            setRecordBaoCao(record);
            setVisible(true);
          }}
          title="Xem chi tiết"
        >
          <EyeOutlined />
        </Button>
        <Divider type="vertical" />

        <Button type="default" shape="circle" onClick={() => handleEdit(record)} title="Chỉnh sửa">
          <EditOutlined />
        </Button>
        <Divider type="vertical" />
        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDel(record._id)}
          cancelText="Hủy"
        >
          <Button type="primary" shape="circle" title="Xóa">
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      </React.Fragment>
    );
  };

  const columns: IColumn<IBaoCaoSBN.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 60,
    },
    {
      title: 'Sổ quản lý',
      dataIndex: 'ten',
      align: 'center',
      width: 150,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'ghiChu',
      align: 'center',
      width: 150,
    },

    {
      title: 'Ngày tạo báo cáo',
      dataIndex: 'createdAt',
      align: 'center',
      width: 120,
      render: (val) => moment(val).format('HH:mm DD/MM/YYYY'),
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: IBaoCaoSBN.Record) => renderLast(record),
      fixed: 'right',
      width: 120,
    },
  ];

  if (vaiTro === 'SuperAdmin' || vaiTro === 'Admin') {
    columns.splice(3, 0, {
      title: 'Đơn vị',
      dataIndex: ['donVi', 'tenDonVi'],
      align: 'center',
      width: 170,
    });
  }

  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={() => getBaoCaoSBNModel(donViId)}
        dependencies={[page, limit, cond, donViId]}
        loading={loadingBaoCaoSBN}
        modelName="baocaosbn"
        title="Báo cáo sở ban ngành"
        scroll={{ x: 1200 }}
        Form={Formm}
        hascreate
      >
        {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
          <Select
            showSearch
            defaultValue="Tất cả"
            style={{ width: '15%', marginRight: '10px' }}
            placeholder="Chọn trường"
            optionFilterProp="children"
            onChange={onChange}
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Select.Option value="Tất cả">Tất cả các trường</Select.Option>
            {danhSachTruong?.map((item: any) => (
              <Select.Option key={item?._id} value={item?._id}>
                {item?.tenDonVi}
              </Select.Option>
            ))}
          </Select>
        )}
        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          Tổng số:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={total}
          />
        </h3>
      </TableBase>
      <Modal
        title="Chi tiết báo cáo sở ban ngành"
        visible={visible}
        footer={
          <Button type="primary" onClick={() => setVisible(false)}>
            Ok
          </Button>
        }
        onCancel={() => setVisible(false)}
        width="50%"
      >
        <Descriptions bordered>
          <Descriptions.Item label="Sổ quản lý" span={3}>
            {recordBaoCao?.ten}
          </Descriptions.Item>
          <Descriptions.Item label="Đơn vị" span={3}>
            {recordBaoCao?.donVi?.tenDonVi}
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú" span={3}>
            {recordBaoCao?.ghiChu}
          </Descriptions.Item>
          <Descriptions.Item label="Mẫu sổ" span={3}>
            {recordBaoCao?.fileDinhKem?.map((val: any, index: number) => (
              <div key={val?._id}>
                {index + 1}.{' '}
                <a href={val?.url} target="_blank">
                  {val?.filename}
                </a>
                <br />
              </div>
            ))}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};

export default BaoCaoSBN;
