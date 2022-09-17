/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import { checkAllow } from '@/components/CheckAuthority';
import TableBase from '@/components/Table';
import UploadFile from '@/components/Upload/UploadFile';
import type { DanhMucThucPham as IDanhMucThucPham } from '@/services/DanhMucThucPham';
import {
  delDanhMucThucPham,
  importDanhMucThucPham,
} from '@/services/DanhMucThucPham/danhmucthucpham';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import rules from '@/utils/rules';
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import {
  Button,
  Col,
  Descriptions,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Spin,
} from 'antd';
import React, { useState } from 'react';
import { useModel } from 'umi';
import Formm from '../components/FormDanhMucThucPham';

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
});

const DanhMucThucPham = () => {
  const {
    loading: loadingDanhMucThucPham,
    getDanhMucThucPhamModel,
    total,
    page,
    limit,
    cond,
    setRecord,
    setVisibleForm,
    setEdit,
    record: recordThucPham,
  } = useModel('danhmucthucpham');
  const danhMucThucPhamChung = useModel('danhmucthucphamchung');
  const [visible, setVisible] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [visibleModalAdd, setVisibleModalAdd] = useState<boolean>(false);
  const vaiTro = localStorage.getItem('vaiTro');
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [danhSachTruong, setDanhSachTruong] = useState([]);
  const [donViId, setDonViId] = useState(organizationId);

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

  const handleEdit = (val: any) => {
    setVisibleForm(true);
    setEdit(true);
    setRecord(val);
  };
  const handleDel = async (val: any) => {
    try {
      const res = await delDanhMucThucPham({ id: val });
      if (res?.status === 200) {
        message.success('Xóa thành công');
        getDanhMucThucPhamModel(donViId);
        return true;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return false;
  };
  const handleView = (val: any) => {
    setRecord(val);
    setVisible(true);
  };

  const onSubmit = async (values: any) => {
    setLoadingUpload(true);
    const newVal = values;
    if (organizationId) {
      newVal.donViId = organizationId;
    }
    try {
      const result = await importDanhMucThucPham({ ...newVal });
      if (result?.data?.statusCode === 201) {
        message.success('Import danh mục thực phẩm thành công');
        getDanhMucThucPhamModel(donViId);
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

  const onCell = (record: IDanhMucThucPham.Record) => ({
    onClick: () => {
      handleView(record);
    },
    style: { cursor: 'pointer' },
  });

  const handleCopy = async (record: IDanhMucThucPham.Record) => {
    // const newValue = {
    //   ...record,
    //   datatype: 'Khác',
    // };
    // const response = await axios.post(`${ip3}/danh-muc-thuc-pham/clone/${record?._id}`, newValue);
    //
    // return
    danhMucThucPhamChung.setIsClone(true);
    danhMucThucPhamChung.setVisibleForm(true);
    danhMucThucPhamChung.setRecord(record);
  };

  const renderLast = (record: IDanhMucThucPham.Record) => {
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

  const renderLast1 = (record: IDanhMucThucPham.Record) => {
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
          disabled={!checkAllow('EDIT_DANH_MUC_THUC_PHAM')}
        >
          <EditOutlined />
        </Button>

        <Divider type="vertical" />

        <Popconfirm
          title="Bạn có muốn xoá thực phẩm này không, nếu xoá thực phẩm sẽ xoá tất cả các món ăn liên quan"
          onConfirm={() => handleDel(record._id)}
          disabled={!checkAllow('DEL_DANH_MUC_THUC_PHAM')}
        >
          <Button
            type="primary"
            shape="circle"
            title="Xóa"
            disabled={!checkAllow('DEL_DANH_MUC_THUC_PHAM')}
          >
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      </React.Fragment>
    );
  };

  const columns: IColumn<IDanhMucThucPham.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'Tên tắt',
      dataIndex: 'tenVietTat',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => val ?? 'Không có',
      search: 'search',
    },
    {
      title: 'Tên đầy đủ',
      dataIndex: 'tenDayDu',
      align: 'center',
      width: 150,
      onCell,
    },
    {
      title: 'Nhóm loại thực phẩm',
      dataIndex: 'nhomLoaiThucPham',
      align: 'center',
      width: 150,
      onCell,
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'donViTinh',
      align: 'center',
      width: 150,
      onCell,
    },
    {
      title: 'Hệ số thải bỏ',
      dataIndex: 'heSoThaiBo',
      align: 'center',
      width: 130,
      onCell,
    },
    {
      title: 'Giá',
      dataIndex: 'giaTien',
      align: 'center',
      width: 130,
      onCell,
      render: (val) => formatter.format(val),
    },
  ];

  if (vaiTro === 'SuperAdmin' || vaiTro === 'Admin') {
    columns.splice(5, 0, {
      title: 'Trường',
      dataIndex: ['donVi', 'tenDonVi'],
      align: 'center',
      width: 200,
      onCell,
      render: (val: any, recordVal: any) => {
        return (
          <>
            {val
              ? val
              : recordVal?.listDonVi?.[0] === '*'
              ? 'Tất cả các trường'
              : 'Tất cả các trường'}
          </>
        );
      },
    });
  }

  const columnsChung = columns.concat({
    title: 'Thao tác',
    align: 'center',
    render: (record: IDanhMucThucPham.Record) => renderLast(record),
    fixed: 'right',
    width: 180,
  });

  const columnsRieng = columns.concat({
    title: 'Thao tác',
    align: 'center',
    render: (record: IDanhMucThucPham.Record) => renderLast1(record),
    fixed: 'right',
    width: 180,
  });

  return (
    <>
      {vaiTro !== 'SuperAdmin' && vaiTro !== 'Admin' && (
        <TableBase
          border
          columns={columnsChung}
          getData={() => danhMucThucPhamChung?.getDanhMucThucPhamChungModel()}
          dependencies={[
            danhMucThucPhamChung?.page,
            danhMucThucPhamChung?.limit,
            danhMucThucPhamChung?.cond,
            donViId,
          ]}
          loading={danhMucThucPhamChung?.loading}
          modelName="danhmucthucphamchung"
          title="Danh mục thực phẩm chung"
          scroll={{ x: 1300 }}
          Form={Formm}
          formType="Drawer"
          widthDrawer="60%"
          hascreate={false}
        />
      )}
      <TableBase
        border
        columns={columnsRieng}
        getData={() => getDanhMucThucPhamModel(donViId)}
        dependencies={[page, limit, cond, donViId]}
        loading={loadingDanhMucThucPham}
        modelName="danhmucthucpham"
        title={`Danh mục thực phẩm ${vaiTro === 'SuperAdmin' || vaiTro === 'Admin' ? '' : 'riêng'}`}
        scroll={{ x: 1300 }}
        Form={Formm}
        formType="Drawer"
        widthDrawer="60%"
        hascreate={checkAllow('ADD_DANH_MUC_THUC_PHAM')}
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
        {checkAllow('IMPORT_DANH_MUC_THUC_PHAM') && (
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
      {/* modal import danh mục thực phẩm */}
      <Modal
        title="Import file danh mục thực phẩm"
        visible={visibleModalAdd}
        onCancel={() => {
          setVisibleModalAdd(false);
        }}
        footer={[]}
        destroyOnClose
      >
        <Spin spinning={loadingUpload}>
          <Form onFinish={onSubmit} {...formItemLayout}>
            {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
              <Row>
                <Col span={24}>
                  <Form.Item name="donViId" label="Trường" rules={[...rules.required]}>
                    <Select
                      placeholder="Chọn trường"
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option: any) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {danhSachTruong?.map(
                        (item: { _id: string; tenDonVi: string }, index: number) => (
                          <Select.Option key={index} value={item?._id}>
                            {item?.tenDonVi}
                          </Select.Option>
                        ),
                      )}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            )}
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

      {/* Modal view thông tin danh mục thực phẩm */}
      <Modal
        visible={visible}
        centered
        closable
        onCancel={() => setVisible(false)}
        width="60%"
        footer={[
          <Button type="primary" key="back" onClick={() => setVisible(false)}>
            OK
          </Button>,
        ]}
      >
        <Descriptions title="Chi tiết danh mục thực phẩm" bordered>
          <Descriptions.Item label="Tên tắt">{recordThucPham?.tenVietTat}</Descriptions.Item>
          <Descriptions.Item label="Tên đầy đủ">{recordThucPham?.tenDayDu}</Descriptions.Item>
          <Descriptions.Item label="Hệ số thải bỏ">{recordThucPham?.heSoThaiBo}</Descriptions.Item>
          <Descriptions.Item label="Giá">
            {formatter.format(recordThucPham?.giaTien)}
          </Descriptions.Item>
          <Descriptions.Item label="Chất đạm">{recordThucPham?.dam}</Descriptions.Item>
          <Descriptions.Item label="Chất béo">{recordThucPham?.beo}</Descriptions.Item>
          <Descriptions.Item label="Đường">{recordThucPham?.duong}</Descriptions.Item>
          <Descriptions.Item label="Calo">{recordThucPham?.calo}</Descriptions.Item>
          <Descriptions.Item label="Canxi">{recordThucPham?.canxi}</Descriptions.Item>
          <Descriptions.Item label="Calo đạm">{recordThucPham?.caloDam}</Descriptions.Item>
          <Descriptions.Item label="Calo đường">{recordThucPham?.caloDuong}</Descriptions.Item>
          <Descriptions.Item label="Calo béo">{recordThucPham?.caloBeo}</Descriptions.Item>
          <Descriptions.Item label="Tỷ lệ đường">
            {Number(recordThucPham?.tyLeDuong ?? 0).toFixed(2)}%
          </Descriptions.Item>
          <Descriptions.Item label="Tỷ lệ đạm">
            {Number(recordThucPham?.tyLeDam ?? 0).toFixed(2)}%
          </Descriptions.Item>
          <Descriptions.Item label="Tỷ lệ béo">
            {Number(recordThucPham?.tyLeBeo ?? 0).toFixed(2)}%
          </Descriptions.Item>
          <Descriptions.Item label="Phân loại">{recordThucPham?.phanLoai}</Descriptions.Item>
          <Descriptions.Item label="Nguồn thực phẩm">
            {recordThucPham?.nguonThucPham}
          </Descriptions.Item>
          <Descriptions.Item label="Nhóm loại thực phẩm">
            {recordThucPham?.nhomLoaiThucPham}
          </Descriptions.Item>
          <Descriptions.Item label="Loại thực phẩm">
            {recordThucPham?.loaiThucPham}
          </Descriptions.Item>
          {(vaiTro === 'Admin' || vaiTro === 'SuperAdmin') && (
            <Descriptions.Item label="Trường">{recordThucPham?.donVi?.tenDonVi}</Descriptions.Item>
          )}
        </Descriptions>
      </Modal>
    </>
  );
};

export default DanhMucThucPham;
