/* eslint-disable no-underscore-dangle */
import { checkAllow } from '@/components/CheckAuthority';
import TableBase from '@/components/Table';
import { daThanhLyBaoHong } from '@/services/QuanLyTaiSan/BaoHong';
import type { QuanLyTaiSan as IQuanLyTaiSan } from '@/services/QuanLyTaiSan/typings';
import type { IColumn } from '@/utils/interfaces';
import { CheckOutlined } from '@ant-design/icons';
import { Button, Input, message, Select, Tag } from 'antd';
import React from 'react';
import { useModel } from 'umi';

const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
});

const ThanhLyBaoHong = () => {
  const { getBaoHongModel, dsLop } = useModel('baohong');
  const { getThanhLyModel, total, loadingThanhLy, page, limit, setCondition, cond } =
    useModel('thanhlytaisan');
  const vaiTro = localStorage.getItem('vaiTro');

  const handleStatus = async (record: IQuanLyTaiSan.BaoHong) => {
    try {
      const res = await daThanhLyBaoHong({ id: record?._id });
      if (res?.status === 200) {
        message.success('Xác nhận đã thanh lý thành công');
        getThanhLyModel();
        getBaoHongModel();
        return true;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return false;
  };

  const onChangeThanhLy = (value: string) => {
    if (value === 'Tất cả') {
      setCondition({});
    } else {
      setCondition({ lopId: value });
    }
  };

  const renderLast1 = (record: IQuanLyTaiSan.BaoHong) => {
    return (
      <React.Fragment>
        <Button
          type="primary"
          shape="circle"
          onClick={() => handleStatus(record)}
          title="Xác nhận thanh lý"
          disabled={!checkAllow('ACCEPT_THANH_LY') || record?.trangThai === 'Đã thanh lý'}
        >
          <CheckOutlined />
        </Button>
      </React.Fragment>
    );
  };

  const columns1: IColumn<IQuanLyTaiSan.BaoHong>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 60,
    },
    {
      title: 'Tên tài sản',
      dataIndex: 'tenDayDu',
      align: 'center',
      width: 130,
    },
    {
      title: 'Loại tài sản',
      dataIndex: 'loaiTaiSan',
      align: 'center',
      width: 100,
    },
    {
      title: 'Đơn vị',
      dataIndex: 'loaiTaiSan',
      align: 'center',
      width: 150,
      render: (val, record) =>
        val === 'Trường' ? record?.truong?.tenDonVi : record?.lop?.tenDonVi,
    },
    {
      title: 'Số lượng',
      dataIndex: 'soLuong',
      align: 'center',
      width: 100,
    },
    {
      title: 'Giá trị tài sản',
      dataIndex: 'giaTri',
      align: 'center',
      width: 130,
      render: (val) => formatter.format(val ?? 0),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      align: 'center',
      width: 150,
      render: (val) =>
        val === 'Đã thanh lý' ? (
          <Tag color="purple">Đã thanh lý</Tag>
        ) : (
          <Tag color="green">Chờ thanh lý</Tag>
        ),
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: IQuanLyTaiSan.BaoHong) => renderLast1(record),
      fixed: 'right',
      width: 100,
    },
  ];

  return (
    <>
      <TableBase
        title="Danh mục tài sản thanh lý"
        border
        columns={columns1}
        getData={() => getThanhLyModel()}
        loading={loadingThanhLy}
        dependencies={[page, limit, cond]}
        modelName="thanhlytaisan"
        widthDrawer="50%"
      >
        {vaiTro === 'HieuTruong' && (
          <Select
            showSearch
            defaultValue="Tất cả"
            style={{ width: '15%', marginRight: '10px' }}
            placeholder="Chọn lớp"
            optionFilterProp="children"
            onChange={onChangeThanhLy}
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Select.Option value="Tất cả">Tất cả các lớp</Select.Option>
            {dsLop?.map((item: { _id: string; tenDonVi: string }) => (
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
    </>
  );
};
export default ThanhLyBaoHong;
