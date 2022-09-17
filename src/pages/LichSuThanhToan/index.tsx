import TableBase from '@/components/Table';
import { checkAllow } from '@/components/CheckAuthority';
import { useModel } from 'umi';
import React from 'react';
import { Button, Divider, message, Popconfirm, Switch } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatterMoney } from '@/utils/utils';
import FormGoiThanhToan from './components/Form';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import moment from 'moment';

const LichSuThanhToan = () => {
  const lichSuThanhToan = useModel('lichsuthanhtoan');

  const handleEdit = (val: any) => {
    lichSuThanhToan.setVisibleForm(true);
    lichSuThanhToan.setEdit(true);
    lichSuThanhToan.setRecord(val);
  };
  const handleDel = async (val: any) => {
    try {
      const res = await delQuangCao({ id: val });
      if (res?.status === 200) {
        message.success('Xóa thành công');
        lichSuThanhToan.getLichSuThanhToanModel();
        return true;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return false;
  };
  const renderLast = (record) => {
    return (
      <React.Fragment>
        {/* <Button
          type="primary"
          shape="circle"
          onClick={() => handleView(record)}
          title="Xem chi tiết"
        >
          <EyeOutlined />
        </Button>
        <Divider type="vertical" /> */}

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
  let columns = [
    {
      title: 'STT',
      width: 80,
      dataIndex: 'index',
      align: 'center',
    },
  ];

  if (document.location.pathname !== '/quanlythanhtoan/lichsucanhan') {
    columns = columns.concat([
      {
        title: 'Họ tên',
        width: 200,
        dataIndex: 'hoTen',
        align: 'center',
      },
    ]);
  }
  columns = columns.concat([
    {
      title: 'Tên gói',
      width: 200,
      dataIndex: 'tenGoi',
      align: 'center',
    },
    {
      title: 'Thời hạn sử dụng',
      width: 150,
      dataIndex: 'thoiHanGoi',
      align: 'center',
    },
    {
      title: 'Số tiền',
      width: 100,
      dataIndex: 'prices',
      align: 'center',
      // render: (val) => (val?.length > 0 ? `${formatterMoney(val?.[0])}` : ''),
    },
    {
      title: 'Trạng thái thanh toán',
      width: 200,
      dataIndex: 'trangThaiThanhToan',
      align: 'center',
    },
    {
      title: 'ID hóa đơn',
      width: 150,
      dataIndex: 'identityCode',
      align: 'center',
    },
    {
      title: 'Thời gian thanh toán',
      width: 150,
      dataIndex: 'ngayThanhToan',
      align: 'center',
      render: (val) => (val ? moment(val).format('DD/MM/YYYY') : ''),
    },
    {
      title: 'Ngày hết hạn',
      width: 150,
      dataIndex: 'expiredDay',
      align: 'center',
    },
    // {
    //   title: 'Thao tác',
    //   align: 'center',
    //   render: (record) => renderLast(record),
    //   fixed: 'right',
    //   width: 150,
    // },
  ]);
  return (
    <TableBase
      border
      columns={columns}
      getData={lichSuThanhToan.getLichSuThanhToanModel}
      dependencies={[lichSuThanhToan.page, lichSuThanhToan.limit, lichSuThanhToan.cond]}
      loading={lichSuThanhToan.loading}
      modelName="lichsuthanhtoan"
      title="Lịch sử thanh toán"
      scroll={{ x: 2000 }}
      // Form={FormGoiThanhToan}
      formType="Drawer"
      widthDrawer="60%"
      // hascreate
    />
  );
};

export default LichSuThanhToan;
