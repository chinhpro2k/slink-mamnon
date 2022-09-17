/* eslint-disable no-underscore-dangle */
import { checkAllow } from '@/components/CheckAuthority';
import TableBase from '@/components/Table';
import {
  choThanhLyBaoHong,
  daSuaBaoHong,
  daThanhLyBaoHong,
  delBaoHong,
} from '@/services/QuanLyTaiSan/BaoHong';
import type { QuanLyTaiSan as IQuanLyTaiSan } from '@/services/QuanLyTaiSan/typings';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import {
  Button,
  Descriptions,
  Divider,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Tag,
} from 'antd';
import React, { useState } from 'react';
import { useModel } from 'umi';
import FormBaoHong from '../components/FormBaoHong';
import TableThanhLy from '../components/TableThanhLy';

const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
});

const BaoHong = () => {
  const {
    loading: loadingBaoHong,
    getBaoHongModel,
    total,
    page,
    limit,
    cond,
    setVisibleForm,
    setEdit,
    setRecord,
    setDsLop,
    dsLop,
    setCondition,
    getTaiSan,
  } = useModel('baohong');
  const { getThanhLyModel } = useModel('thanhlytaisan');
  const [visible, setVisible] = useState<boolean>(false);
  const [newRecord, setNewRecord] = useState<IQuanLyTaiSan.BaoHong>();
  const vaiTro = localStorage.getItem('vaiTro');
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;

  const getLop = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable/my/child?page=1&limit=1000`, {
      params: {
        cond: {
          loaiDonVi: 'Lop',
          parent: vaiTro === 'HieuTruong' ? organizationId : undefined,
        },
      },
    });
    setDsLop(result?.data?.data?.result);
  };
  // const getTaiSan = async () => {
  //   const result = await axios.get(`${ip3}/danh-muc-tai-san/pageable?page=1&limit=1000`);
  //   setDsTaiSan(result?.data?.data?.result);
  // };

  React.useEffect(() => {
    getLop();
    getTaiSan();
  }, []);

  const handleEdit = (val: any) => {
    setVisibleForm(true);
    setEdit(true);
    setRecord(val);
  };

  const handleDel = async (record: IQuanLyTaiSan.BaoHong) => {
    try {
      const res = await delBaoHong({ id: record?._id });
      if (res?.status === 200) {
        message.success('Xóa thành công');
        getBaoHongModel();
        return true;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return false;
  };

  const handleStatus = async (record: IQuanLyTaiSan.BaoHong, trangThai: string) => {
    if (trangThai === 'Chờ thanh lý') {
      try {
        const res = await choThanhLyBaoHong({ id: record?._id });
        if (res?.status === 200) {
          message.success('Xác nhận không sửa được, chờ thanh lý thành công');
          getThanhLyModel();
          getBaoHongModel();
          getTaiSan();
          return true;
        }
      } catch (error) {
        message.error('Đã xảy ra lỗi');
        return false;
      }
    }
    if (trangThai === 'Đã thanh lý') {
      try {
        const res = await daThanhLyBaoHong({ id: record?._id });
        if (res?.status === 200) {
          message.success('Xác nhận đã thanh lý thành công');
          getThanhLyModel();
          getBaoHongModel();
          getTaiSan();
          return true;
        }
      } catch (error) {
        message.error('Đã xảy ra lỗi');
        return false;
      }
    }
    try {
      const res = await daSuaBaoHong({ id: record?._id });
      if (res?.status === 200) {
        message.success('Xác nhận đã sửa thành công');
        getThanhLyModel();
        getBaoHongModel();
        getTaiSan();
        return true;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return false;
  };

  const onChangeBaoHong = (value: string) => {
    if (value === 'Tất cả') {
      setCondition({});
    } else {
      setCondition({ lopId: value });
    }
  };

  const renderLast = (record: IQuanLyTaiSan.BaoHong) => {
    return (
      <React.Fragment>
        <Button
          type="primary"
          shape="circle"
          onClick={() => handleStatus(record, 'Chờ thanh lý')}
          title="Xác nhận không sửa được"
          disabled={!checkAllow('REJECT_BAO_HONG') || record?.trangThai !== 'Chờ sửa chữa'}
        >
          <CloseOutlined />
        </Button>

        <Divider type="vertical" />
        <Button
          type="default"
          shape="circle"
          onClick={() => handleStatus(record, 'Đã xử lý')}
          title="Xác nhận đã sửa"
          disabled={!checkAllow('ACCEPT_BAO_HONG') || record?.trangThai !== 'Chờ sửa chữa'}
        >
          <CheckOutlined />
        </Button>

        <Divider type="vertical" />
        <Button
          type="primary"
          shape="circle"
          title="Chi tiết"
          onClick={() => {
            setNewRecord(record);
            setVisible(true);
          }}
        >
          <EyeOutlined />
        </Button>

        <Divider type="vertical" />
        <Button
          type="default"
          shape="circle"
          onClick={() => handleEdit(record)}
          title="Chỉnh sửa"
          disabled={!checkAllow('EDIT_BAO_HONG') || record?.trangThai !== 'Chờ sửa chữa'}
        >
          <EditOutlined />
        </Button>
        <Divider type="vertical" />
        <Popconfirm
          disabled={!checkAllow('DEL_BAO_HONG') || record?.trangThai !== 'Chờ sửa chữa'}
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDel(record)}
          okText="Đồng ý"
        >
          <Button
            type="primary"
            shape="circle"
            title="Xóa"
            disabled={!checkAllow('DEL_BAO_HONG') || record?.trangThai !== 'Chờ sửa chữa'}
          >
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      </React.Fragment>
    );
  };

  const columns: IColumn<IQuanLyTaiSan.BaoHong>[] = [
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
      title: 'Số lượng hỏng',
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
      title: 'Ghi chú',
      dataIndex: 'ghiChu',
      align: 'center',
      width: 200,
      render: (val) => val ?? 'Không có',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      align: 'center',
      width: 150,
      render: (val) =>
        val === 'Đã xử lý' ? (
          <Tag color="blue">Đã sửa chữa</Tag>
        ) : (
          <Tag color="red">Chờ sửa chữa</Tag>
        ),
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: IQuanLyTaiSan.BaoHong) => renderLast(record),
      fixed: 'right',
      width: 240,
    },
  ];

  return (
    <>
      <TableBase
        title="Danh mục báo hỏng, sửa chữa"
        border
        columns={columns}
        getData={() => getBaoHongModel()}
        loading={loadingBaoHong}
        dependencies={[page, limit, cond]}
        modelName="baohong"
        scroll={{ x: 1400 }}
        hascreate={checkAllow('ADD_BAO_HONG')}
        Form={FormBaoHong}
        formType="Drawer"
        widthDrawer="50%"
      >
        {vaiTro === 'HieuTruong' && (
          <Select
            showSearch
            defaultValue="Tất cả"
            style={{ width: '15%', marginRight: '10px' }}
            placeholder="Chọn lớp"
            optionFilterProp="children"
            onChange={onChangeBaoHong}
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
      <br />
      <TableThanhLy />
      <Modal
        title="Chi tiết tài sản báo hỏng"
        visible={visible}
        footer={
          <Button type="primary" onClick={() => setVisible(false)}>
            Ok
          </Button>
        }
        onCancel={() => {
          setVisible(false);
        }}
        width="50%"
      >
        <Descriptions>
          <Descriptions.Item label="Tên tài sản">{newRecord?.tenDayDu}</Descriptions.Item>
          <Descriptions.Item label="Loại tài sản">{newRecord?.loaiTaiSan}</Descriptions.Item>
          {newRecord?.loaiTaiSan === 'Trường' ? (
            <Descriptions.Item label="Tên đơn vị">{newRecord?.truong?.tenDonVi}</Descriptions.Item>
          ) : (
            <Descriptions.Item label="Tên đơn vị">{newRecord?.lop?.tenDonVi}</Descriptions.Item>
          )}
          <Descriptions.Item label="Số lượng hỏng">{newRecord?.soLuong}</Descriptions.Item>
          <Descriptions.Item label="Giá trị tài sản">
            {formatter.format(newRecord?.giaTri ?? 0)}
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú">{newRecord?.ghiChu ?? 'Không có'}</Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};
export default BaoHong;
