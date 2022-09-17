/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import { checkAllow } from '@/components/CheckAuthority';
import TableBase from '@/components/Table';
import UploadFile from '@/components/Upload/UploadFile';
import type { DanhMucMonAn as IDanhMucMonAn } from '@/services/DanhMucMonAn';
import { delDanhMucMonAn, importDanhMucMonAn } from '@/services/DanhMucMonAn/danhmucmonan';
import type { IColumn } from '@/utils/interfaces';
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  EyeOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import {
  Button,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Spin,
  Table,
  Select,
} from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { useModel } from 'umi';
import FormMonAn from './components/Form';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
});

const DanhMucMonAn = () => {
  const {
    loading: loadingDanhMucMonAn,
    getDanhMucMonAnModel,
    total,
    page,
    limit,
    cond,
    setRecord,
    setVisibleForm,
    setEdit,
  } = useModel('danhmucmonan');
  const danhMucMonAnChung = useModel('danhmucmonanchung');
  const [visible, setVisible] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [visibleModalAdd, setVisibleModalAdd] = useState<boolean>(false);
  const { initialState } = useModel('@@initialState');
  const vaiTro = localStorage.getItem('vaiTro');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [danhSachThanhPhan, setDanhSachThanhPhan] = useState<IDanhMucMonAn.Record[]>([]);
  const [newRecord, setNewRecord] = useState<IDanhMucMonAn.Record>();
  const [danhSachTruong, setDanhSachTruong] = useState([]);
  const [donViId, setDonViId] = useState(
    vaiTro === 'SuperAdmin' || vaiTro === 'Admin' ? 'Tất cả' : organizationId,
  );

  const getDSTruong = async () => {
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
    getDSTruong();
  }, []);

  const onChange = (value: string) => {
    setDonViId(value);
  };

  const handleDel = async (val: any) => {
    try {
      const res = await delDanhMucMonAn({ id: val });
      if (res?.status === 200) {
        message.success('Xóa thành công');
        getDanhMucMonAnModel();
        return true;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return false;
  };
  const handleView = (val: IDanhMucMonAn.Record) => {
    const arrThanhPhan: any[] = [];
    val?.thanhPhanMonAn?.map((item, index) => arrThanhPhan.push({ ...item, index: index + 1 }));
    setDanhSachThanhPhan(arrThanhPhan);
    setNewRecord(val);
    setVisible(true);
  };

  const handleEdit = (val: IDanhMucMonAn.Record) => {
    // const arrThanhPhan: any[] = [];
    // val?.thanhPhanMonAn?.map((item, index) => arrThanhPhan.push({ ...item, index: index + 1 }));
    // setDanhSachThanhPhan(arrThanhPhan);
    // setNewRecord(val);
    // setVisible(true);
    setVisibleForm(true);
    setRecord(val);
    setEdit(true);
  };

  const onSubmit = async (values: any) => {
    setLoadingUpload(true);
    const newVal = values;
    if (!values?.file) {
      setLoadingUpload(false);
      message.error('Vui lòng tải file lên để import');
      return false;
    }
    if (organizationId) {
      newVal.organizationId = organizationId;
    }
    try {
      const result = await importDanhMucMonAn({ ...newVal });
      if (result?.data?.success) {
        message.success('Import danh mục món ăn thành công');
        getDanhMucMonAnModel(organizationId);
        setVisibleModalAdd(false);
        setLoadingUpload(false);
        return true;
      }
    } catch (error) {
      const { response }: any = error;
      if (response?.data?.errorCode === 'INVALID_FORMAT') {
        message.error('Data import không đúng định dạng. Vui lòng thử lại sau');
        setLoadingUpload(false);
        return false;
      }
    }
    return true;
  };

  const onCell = (record: IDanhMucMonAn.Record) => ({
    onClick: () => {
      handleView(record);
    },
    style: { cursor: 'pointer' },
  });

  const handleCopy = async (record: IDanhMucMonAn.Record) => {
    // const newValue = {
    //   ...record,
    //   datatype: 'Khác',
    // };
    // const response = await axios.post(`${ip3}/danh-muc-thuc-pham/clone/${record?._id}`, newValue);
    //
    // return
    danhMucMonAnChung.setIsClone(true);
    danhMucMonAnChung.setVisibleForm(true);
    danhMucMonAnChung.setRecord(record);
  };

  const renderLast = (record: IDanhMucMonAn.Record) => {
    return (
      <>
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
          type="primary"
          shape="circle"
          onClick={() => handleCopy(record)}
          title="Sao chép thực đơn"
        >
          <CopyOutlined />
        </Button>
      </>
    );
  };

  const renderLast1 = (record: IDanhMucMonAn.Record) => {
    return (
      <React.Fragment>
        <Button
          type="default"
          shape="circle"
          onClick={() => handleView(record)}
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
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDel(record._id)}
          disabled={!checkAllow('DEL_DANH_MUC_MON_AN')}
        >
          <Button
            type="primary"
            shape="circle"
            title="Xóa"
            disabled={!checkAllow('DEL_DANH_MUC_MON_AN')}
          >
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      </React.Fragment>
    );
  };

  const columns: IColumn<IDanhMucMonAn.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'Tên',
      dataIndex: 'ten',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => val ?? 'Không có',
      search: 'search',
    },
    {
      title: 'Ngày import',
      dataIndex: 'createdAt',
      align: 'center',
      width: 100,
      onCell,
      render: (val) => moment(val).format('DD/MM/YYYY') ?? 'Không có',
    },
  ];

  const columnsChung = columns.concat({
    title: 'Thao tác',
    align: 'center',
    render: (record: IDanhMucMonAn.Record) => renderLast(record),
    fixed: 'right',
    width: 100,
  });

  const columnsRieng = columns.concat({
    title: 'Thao tác',
    align: 'center',
    render: (record: IDanhMucMonAn.Record) => renderLast1(record),
    fixed: 'right',
    width: 100,
  });

  const columnsThanhPhan: IColumn<IDanhMucMonAn.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Tên',
      dataIndex: 'ten',
      align: 'center',
      width: 130,
    },
    {
      title: 'Định lượng mẫu giáo',
      dataIndex: 'dinhLuongMauGiao',
      align: 'center',
      width: 100,
    },
    {
      title: 'Định lượng nhà trẻ',
      dataIndex: 'dinhLuongNhaTre',
      align: 'center',
      width: 100,
    },
    {
      title: 'Đơn giá',
      dataIndex: 'donGia',
      align: 'center',
      width: 100,
      render: (val) => formatter.format(val),
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'donViTinh',
      align: 'center',
      width: 100,
      render: (val) => val ?? 'Không có',
    },
    {
      title: 'Tỷ lệ thải bỏ',
      dataIndex: 'tyLeThai',
      align: 'center',
      width: 100,
    },
    {
      title: 'Protid',
      dataIndex: 'protid',
      align: 'center',
      width: 100,
    },
    {
      title: 'Lipid',
      dataIndex: 'lipid',
      align: 'center',
      width: 100,
    },
    {
      title: 'Glucid',
      dataIndex: 'glucid',
      align: 'center',
      width: 100,
    },
    {
      title: 'Calo/100g',
      dataIndex: 'calo',
      align: 'center',
      width: 100,
    },
  ];

  return (
    <>
      {vaiTro !== 'SuperAdmin' && vaiTro !== 'Admin' && (
        <TableBase
          border
          columns={columnsChung}
          getData={() => danhMucMonAnChung?.getDanhMucMonAnModel()}
          dependencies={[
            danhMucMonAnChung?.page,
            danhMucMonAnChung?.limit,
            danhMucMonAnChung?.cond,
          ]}
          loading={danhMucMonAnChung?.loading}
          modelName="danhmucmonanchung"
          title="Danh mục món ăn chung"
          formType="Drawer"
          widthDrawer="60%"
          Form={FormMonAn}
        />
      )}
      <TableBase
        border
        columns={columnsRieng}
        getData={() => getDanhMucMonAnModel(donViId)}
        dependencies={[page, limit, cond, donViId]}
        loading={loadingDanhMucMonAn}
        modelName="danhmucmonan"
        title={`Danh mục món ăn ${vaiTro === 'SuperAdmin' || vaiTro === 'Admin' ? '' : 'riêng'}`}
        hascreate
        formType="Drawer"
        widthDrawer="60%"
        Form={FormMonAn}
      >
        {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
          <Select
            defaultValue="Tất cả"
            showSearch
            style={{ width: '20%', marginRight: '10px' }}
            placeholder="Chọn đơn vị"
            optionFilterProp="children"
            onChange={onChange}
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Select.Option key="Tất cả" value="Tất cả">
              Tất cả các trường
            </Select.Option>
            {danhSachTruong?.map((item: { _id: string; tenDonVi: string }) => (
              <Select.Option key={item?._id} value={item?._id}>
                {item?.tenDonVi}
              </Select.Option>
            ))}
          </Select>
        )}
        {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
          <Button
            style={{ marginBottom: '10px', marginRight: '10px' }}
            onClick={() => {
              setVisibleModalAdd(true);
            }}
            type="primary"
          >
            <ExportOutlined />
            Import file
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
      {/* modal import danh mục món ăn */}
      <Modal
        title="Import file danh mục món ăn"
        visible={visibleModalAdd}
        onCancel={() => {
          setVisibleModalAdd(false);
        }}
        footer={[]}
        destroyOnClose
      >
        <Spin spinning={loadingUpload}>
          <Form onFinish={onSubmit} {...formItemLayout}>
            <Form.Item name="file">
              <UploadFile />
            </Form.Item>
            <Row justify="center">
              <Form.Item style={{ marginBottom: 0 }}>
                <Button type="primary" htmlType="submit">
                  Tải lên
                </Button>
              </Form.Item>
            </Row>
          </Form>
        </Spin>
      </Modal>

      {/* Modal view thông tin danh mục món ăn */}
      <Modal
        visible={visible}
        centered
        width="60%"
        closable
        title={
          <div>
            Chi tiết thành phần món ăn: <b>{newRecord?.ten}</b>
          </div>
        }
        onCancel={() => setVisible(false)}
        footer={[
          <Button type="primary" key="back" onClick={() => setVisible(false)}>
            OK
          </Button>,
        ]}
      >
        <Table
          dataSource={danhSachThanhPhan}
          columns={columnsThanhPhan}
          pagination={false}
          bordered
          scroll={{ x: 1300 }}
        />
      </Modal>
    </>
  );
};

export default DanhMucMonAn;
