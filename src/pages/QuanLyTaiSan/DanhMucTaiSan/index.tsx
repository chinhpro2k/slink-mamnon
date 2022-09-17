/* eslint-disable no-underscore-dangle */
import { checkAllow } from '@/components/CheckAuthority';
import TableBase from '@/components/Table';
import type { QuanLyTaiSan as IQuanLyTaiSan } from '@/services/QuanLyTaiSan/typings';
import { delDanhMucTaiSan } from '@/services/QuanLyTaiSan/DanhMucTaiSan';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Descriptions, Divider, Input, message, Modal, Popconfirm, Select } from 'antd';
import React, { useState } from 'react';
import { useModel } from 'umi';
import FormDanhMuc from '../components/FormDanhMuc';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
});

const DanhMucTaiSan = () => {
  const {
    loading: loadingDanhMucTaiSan,
    getDanhMucTaiSanModel,
    total,
    page,
    limit,
    cond,
    setVisibleForm,
    setEdit,
    setRecord,
    setPage,
    setCondition,
  } = useModel('danhmuctaisan');
  const [visible, setVisible] = useState<boolean>(false);
  const [newRecord, setNewRecord] = useState<IQuanLyTaiSan.DanhMucTaiSan>();
  const [dsLop, setDsLop] = useState([]);
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

  React.useEffect(() => {
    getLop();
  }, []);

  const handleEdit = (val: any) => {
    setVisibleForm(true);
    setEdit(true);
    setRecord(val);
  };

  const handleDel = async (record: IQuanLyTaiSan.DanhMucTaiSan) => {
    try {
      const res = await delDanhMucTaiSan({ id: record?._id });
      if (res?.status === 200) {
        message.success('Xóa thành công');
        getDanhMucTaiSanModel();
        return true;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return false;
  };

  const onChange = (value: string) => {
    setPage(1);
    if (value === 'Tất cả') {
      setCondition({ lopId: undefined });
    } else setCondition({ lopId: value });
  };

  const renderLast = (record: IQuanLyTaiSan.DanhMucTaiSan) => {
    return (
      <React.Fragment>
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
          disabled={!checkAllow('EDIT_DANH_MUC_TAI_SAN')}
        >
          <EditOutlined />
        </Button>
        <Divider type="vertical" />
        <Popconfirm
          disabled={!checkAllow('DEL_DANH_MUC_TAI_SAN')}
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDel(record)}
          okText="Đồng ý"
        >
          <Button
            type="primary"
            shape="circle"
            title="Xóa"
            disabled={!checkAllow('DEL_DANH_MUC_TAI_SAN')}
          >
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      </React.Fragment>
    );
  };

  const columns: IColumn<IQuanLyTaiSan.DanhMucTaiSan>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Tên tài sản',
      dataIndex: 'tenDayDu',
      align: 'center',
      width: 130,
      search: 'search',
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
      title: 'Số lượng tốt',
      dataIndex: 'soLuongTot',
      align: 'center',
      width: 100,
    },
    {
      title: 'Số lượng hỏng',
      dataIndex: 'soLuongHong',
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
      title: 'Thao tác',
      align: 'center',
      render: (record: IQuanLyTaiSan.DanhMucTaiSan) => renderLast(record),
      fixed: 'right',
      width: 170,
    },
  ];

  return (
    <>
      <TableBase
        title="Danh mục tài sản"
        border
        columns={columns}
        getData={() => getDanhMucTaiSanModel()}
        loading={loadingDanhMucTaiSan}
        dependencies={[page, limit, cond]}
        modelName="danhmuctaisan"
        scroll={{ x: 1000 }}
        hascreate={checkAllow('ADD_DANH_MUC_TAI_SAN')}
        Form={FormDanhMuc}
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
            onChange={onChange}
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
      <Modal
        title="Chi tiết tài sản"
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
          <Descriptions.Item label="Số lượng">{newRecord?.soLuong}</Descriptions.Item>
          <Descriptions.Item label="Số lượng tốt">{newRecord?.soLuongTot}</Descriptions.Item>
          <Descriptions.Item label="Số lượng hỏng">{newRecord?.soLuongHong}</Descriptions.Item>
          <Descriptions.Item label="Giá trị tài sản">
            {formatter.format(newRecord?.giaTri ?? 0)}
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú">{newRecord?.ghiChu ?? 'Không có'}</Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};
export default DanhMucTaiSan;
