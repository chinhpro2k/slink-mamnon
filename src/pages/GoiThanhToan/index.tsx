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

const GoiThanhToan = () => {
  const goiThanhToan = useModel('goithanhtoan');

  const handleEdit = (val: any) => {
    goiThanhToan.setVisibleForm(true);
    goiThanhToan.setEdit(true);
    goiThanhToan.setRecord(val);
  };
  const handleDel = async (val: any) => {
    try {
      const res = await axios.delete(`${ip3}/goi-thanh-toan/${val}`);
      if (res?.status === 200) {
        message.success('Xóa thành công');
        goiThanhToan.getGoiThanhToanModel();
        return true;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return false;
  };
  const renderLast = (record: IQuangCao.Record) => {
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
          disabled={!checkAllow('SUA_GOI_THANH_TOAN')}
        >
          <EditOutlined />
        </Button>

        <Divider type="vertical" />

        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDel(record._id)}
          disabled={!checkAllow('XOA_GOI_THANH_TOAN')}
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
  return (
    <TableBase
      border
      columns={[
        {
          title: 'STT',
          width: 80,
          dataIndex: 'index',
          align: 'center',
        },
        {
          title: 'Tên gói',
          width: 200,
          dataIndex: 'tenGoi',
          align: 'center',
        },
        {
          title: 'Thời gian sử dụng',
          width: 100,
          dataIndex: 'thoiGianGoi',
          align: 'center',
          render: (val) => `${val} tháng`,
        },
        {
          title: 'Số tiền',
          width: 200,
          dataIndex: 'prices',
          align: 'center',
        },
        {
          title: 'Trạng thái',
          width: 150,
          dataIndex: 'isActive',
          align: 'center',
          render: (val, record) => (
            <Switch
              checkedChildren="Đã kích hoạt"
              unCheckedChildren="Chưa kích hoạt"
              defaultChecked={val}
              onChange={async (value) => {
                const res = await axios.put(
                  `${ip3}/goi-thanh-toan/${record?._id}/${value ? 'archive' : 'unarchive'}`,
                  {
                    id: record?._id,
                  },
                );
              }}
            />
          ),
        },
        {
          title: 'Mô tả',
          dataIndex: 'moTa',
          align: 'center',
        },
        {
          title: 'Thao tác',
          align: 'center',
          render: (record) => renderLast(record),
          fixed: 'right',
          width: 150,
        },
      ]}
      getData={goiThanhToan.getGoiThanhToanModel}
      dependencies={[goiThanhToan.page, goiThanhToan.limit, goiThanhToan.cond]}
      loading={goiThanhToan.loading}
      modelName="goithanhtoan"
      title="Danh sách gói thanh toán"
      scroll={{ x: 1300 }}
      Form={FormGoiThanhToan}
      formType="Drawer"
      widthDrawer="60%"
      hascreate={checkAllow('THEM_GOI_THANH_TOAN')}
    />
  );
};

export default GoiThanhToan;
