/* eslint-disable no-underscore-dangle */
import { checkAllow } from '@/components/CheckAuthority';
import TableBase from '@/components/Table';
import type { QuangCao as IQuangCao } from '@/services/QuangCao';
import { delQuangCao } from '@/services/QuangCao/quangcao';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { formatterMoney } from '@/utils/utils';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Divider, Input, message, Modal, Popconfirm, Select } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';

const QuangCao = () => {
  const {
    loading: loadingQuangCao,
    getQuangCaoModel,
    total,
    page,
    limit,
    cond,
    setVisibleForm,
    setRecord,
    setEdit,
    setDanhSachTruong,
    danhSachTruong,
    setDonViId,
    donViId,
  } = useModel('quangcao');
  const [visibleView, setVisibleView] = useState<boolean>(false);
  const [recordQuangCao, setRecordQuangCao] = useState<IQuangCao.Record>();
  const vaiTro = localStorage.getItem('vaiTro');
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;

  const getTruong = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=100`, {
      params: {
        cond: {
          loaiDonVi: 'Truong',
        },
      },
    });
    setDanhSachTruong(result?.data?.data?.result);
  };

  React.useEffect(() => {
    getTruong();
  }, []);

  const handleView = (val: any) => {
    setVisibleView(true);
    setRecordQuangCao(val);
  };

  const handleEdit = (val: any) => {
    setVisibleForm(true);
    setEdit(true);
    setRecord(val);
  };
  const handleDel = async (val: any) => {
    try {
      const res = await delQuangCao({ id: val });
      if (res?.status === 200) {
        message.success('Xóa thành công');
        getQuangCaoModel();
        return true;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return false;
  };

  const onChange = (val: string) => {
    setDonViId(val);
  };

  const onCell = (record: IQuangCao.Record) => ({
    onClick: () => {
      handleView(record);
    },
    style: { cursor: 'pointer' },
  });

  const renderLast1 = (record: IQuangCao.Record) => {
    return (
      <React.Fragment>
        <Button
          type="primary"
          shape="circle"
          onClick={() => handleView(record)}
          title="Xem chi tiết"
        >
          <EyeOutlined />
        </Button>
        <Divider type="vertical" />

        <Button
          type="default"
          shape="circle"
          onClick={() => handleEdit(record)}
          title="Chỉnh sửa"
          disabled={!checkAllow('SUA_QUANG_CAO')}
        >
          <EditOutlined />
        </Button>

        <Divider type="vertical" />

        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDel(record._id)}
          disabled={!checkAllow('XOA_QUANG_CAO')}
        >
          <Button
            type="primary"
            shape="circle"
            title="Xóa"
            // disabled={!checkAllow('XOA_QUANG_CAO')}
          >
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      </React.Fragment>
    );
  };
  const columns: IColumn<IQuangCao.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'Mức ưu tiên',
      dataIndex: 'mucUuTien',
      align: 'center',
      width: 100,
      onCell,
      search: 'sort',
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'tieuDe',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => val ?? 'Không có',
    },
    {
      title: 'Loại tin',
      dataIndex: 'loaiTin',
      align: 'center',
      width: 150,
      search: 'filterString',
      onCell,
      render: (val) => val ?? 'Không có',
    },
    {
      title: 'Ngày đăng',
      dataIndex: 'ngayDang',
      align: 'center',
      width: 150,
      onCell,
      search: 'sort',
      render: (val) => moment(val).format('DD/MM/YYYY') ?? 'Không có',
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: IQuangCao.Record) => renderLast1(record),
      fixed: 'right',
      width: 150,
    },
  ];

  if (vaiTro === 'SuperAdmin' || vaiTro === 'Admin') {
    columns.splice(4, 0, {
      title: 'Trường',
      dataIndex: ['donVi', 'tenDonVi'],
      align: 'center',
      width: 150,
      onCell,
    });
  }

  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={getQuangCaoModel}
        dependencies={[page, limit, cond, donViId]}
        loading={loadingQuangCao}
        modelName="quangcao"
        title="Quảng cáo"
        scroll={{ x: 1000 }}
        Form={Form}
        formType="Drawer"
        widthDrawer="60%"
        hascreate={checkAllow('THEM_QUANG_CAO')}
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
            {danhSachTruong?.map((item) => (
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
        title="Chi tiết"
        width="60%"
        visible={visibleView}
        onCancel={() => setVisibleView(false)}
        footer={<Button onClick={() => setVisibleView(false)}>Ok</Button>}
        destroyOnClose
      >
        <div>
          <div style={{ fontWeight: 600, fontSize: '18px', marginBottom: '5px' }}>
            {recordQuangCao?.tieuDe}
          </div>
          <div style={{ fontSize: '14px', marginBottom: '5px' }}>
            Ngày đăng: {moment(recordQuangCao?.ngayDang).format('DD/MM/YYYY')}
          </div>
          {recordQuangCao?.loaiTin === 'Tuyển dụng' && (
            <>
              <div style={{ fontSize: '14px', marginBottom: '5px' }}>
                Mức lương: {formatterMoney(recordQuangCao?.mucLuong)}
              </div>
              <div style={{ fontSize: '14px', marginBottom: '5px' }}>
                Vị trí: {recordQuangCao?.viTri}
              </div>
              <div style={{ fontSize: '14px', marginBottom: '5px' }}>
                Ngày hết hạn: {moment(recordQuangCao?.hanCuoi).format('DD/MM/YYYY')}
              </div>
            </>
          )}

          <div
            dangerouslySetInnerHTML={{ __html: recordQuangCao?.moTa || '' }}
            style={{ width: '100%', overflowX: 'auto', fontSize: '15px' }}
          />
        </div>
      </Modal>
    </>
  );
};

export default QuangCao;
