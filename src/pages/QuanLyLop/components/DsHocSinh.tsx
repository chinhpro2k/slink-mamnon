/* eslint-disable no-underscore-dangle */
import { checkAllow } from '@/components/CheckAuthority';
import TableBase from '@/components/Table';
import { delHocSinhLop } from '@/services/HocSinh/hocsinh';
import type { KhaiBaoThongTin as IKhaiBaoThongTin } from '@/services/KhaiBaoThongTin';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import rules from '@/utils/rules';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleFilled } from '@ant-design/icons';
import {
  Button,
  Col,
  DatePicker,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
} from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { useModel } from 'umi';

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const HocSinh = (props: { id?: string; loai?: string; idParent: string; sySo: number }) => {
  const {
    loading: loadingHocSinh,
    getDSHocSinhModel,
    total,
    page,
    limit,
    cond,
  } = useModel('xemdshocsinh');
  const [visible, setVisible] = useState<boolean>(false);
  const [newRecord, setNewRecord] = useState<IKhaiBaoThongTin.Record>();
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [recordHocSinh, setRecordHocSinh] = useState<IKhaiBaoThongTin.Record>();
  const [recordLop, setRecordLop] = useState<IKhaiBaoThongTin.Record>();
  const [visibleEdit, setVisibleEdit] = useState<boolean>(false);
  const [dsHocSinh, setDSHocSinh] = useState([]);
  const [form] = Form.useForm();
  const { initialState } = useModel('@@initialState');
  const idLop = initialState?.currentUser?.role?.organizationId;
  const vaiTro = localStorage.getItem('vaiTro');
  const [danhSachLop, setDanhSachLop] = useState([]);

  const handleView = (record: IKhaiBaoThongTin.Record) => {
    setNewRecord(record);
    setVisible(true);
  };

  const getDSHocSinh = async () => {
    const arrDSHS: any = [];
    if (vaiTro === 'GiaoVien') {
      const result = await axios.get(`${ip3}/con/pageable/truong/${recordLop?.parent}`, {
        params: {
          page: 1,
          limit: 100,
        },
      });
      result?.data?.data?.result?.map((item: { donViId: string }) =>
        item?.donViId !== props?.id ? arrDSHS?.push(item) : undefined,
      );
    } else {
      const result = await axios.get(`${ip3}/con/pageable/truong/${props?.idParent}`, {
        params: {
          page: 1,
          limit: 100,
        },
      });
      result?.data?.data?.result?.map((item: { donViId: string }) =>
        item?.donViId !== props?.id ? arrDSHS?.push(item) : undefined,
      );
    }
    setDSHocSinh(arrDSHS);
  };

  const getDsLop = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable/my/child?page=1&limit=100`, {
      params: {
        cond: {
          loaiDonVi: 'Lop',
          parent: props?.idParent,
        },
      },
    });
    const dataLop = result?.data?.data?.result?.find(
      (item: { _id: string }) => item?._id === idLop,
    );
    setRecordLop(dataLop);
    setDanhSachLop(result?.data?.data?.result);
  };

  const onCell = (record: IKhaiBaoThongTin.Record) => ({
    onClick: () => {
      handleView(record);
    },
    style: { cursor: 'pointer' },
  });

  const onChange = (val: string) => {
    setRecordHocSinh(dsHocSinh?.find((item: { _id: string }) => item?._id === val));
    const dataHocSinh: any = dsHocSinh?.find((item: { _id: string }) => item?._id === val);
    form.setFieldsValue({
      ...dataHocSinh,
      ngaySinh: dataHocSinh?.ngaySinh
        ? moment(new Date(dataHocSinh?.namSinh, dataHocSinh?.thangSinh - 1, dataHocSinh?.ngaySinh))
        : moment(),
    });
  };

  const onFinish = async (value: { conId?: string }) => {
    if (total === props?.sySo) {
      message.error('Chuyển lớp không thành công do số lượng học sinh trong lớp đã đủ');
      return false;
    }
    try {
      const result = await axios.put(`${ip3}/con/${value?.conId}/chuyen-lop/${props?.id}`);
      if (result?.status === 200) {
        message.success('Chuyển lớp thành công');
        getDSHocSinhModel(props?.id);
        setVisibleDrawer(false);
        return true;
      }
    } catch (error) {
      const { response }: any = error;
      if (response?.data?.errorCode === 'CLASS_SIZE_LIMITED') {
        message.error('Chuyển lớp không thành công do số lượng học sinh trong lớp đã đủ');
      }
      message.error('Chuyển lớp không thành công');
      return false;
    }
    return true;
  };

  React.useEffect(() => {
    getDSHocSinh();
    getDsLop();
  }, [props]);

  const handleEdit = (record: IKhaiBaoThongTin.Record) => {
    setNewRecord(record);
    setVisibleEdit(true);
    form.setFieldsValue({
      ...record,
      ngaySinh: record?.ngaySinh
        ? moment(new Date(record?.namSinh, record?.thangSinh - 1, record?.ngaySinh))
        : moment(),
    });
  };

  const onFinishEdit = async (value: { organizationId: string }) => {
    if (total === props?.sySo) {
      message.error('Cập nhật lớp không thành công do số lượng học sinh trong lớp đã đủ');
      return false;
    }
    try {
      const result = await axios.put(
        `${ip3}/con/${newRecord?._id}/chuyen-lop/${value?.organizationId}`,
      );
      if (result?.status === 200) {
        message.success('Cập nhật thành công');
        getDSHocSinhModel(props?.id);
        setVisibleEdit(false);
        return true;
      }
    } catch (error) {
      const { response }: any = error;
      if (response?.data?.errorCode === 'CLASS_SIZE_LIMITED') {
        message.error('Cập nhật lớp không thành công do số lượng học sinh trong lớp đã đủ');
      }
      message.error('Cập nhật không thành công');
      return false;
    }
    return true;
  };

  const handleDel = async (record: IKhaiBaoThongTin.Record) => {
    const res = await delHocSinhLop({ id: record?._id });
    if (res?.status === 200) {
      message.success('Xóa thành công');
      getDSHocSinhModel(props?.id);
      return true;
    }
    message.error('Đã xảy ra lỗi');
    return false;
  };

  const renderLast = (record: IKhaiBaoThongTin.Record) => {
    return (
      <React.Fragment>
        <Button type="default" shape="circle" title="Xem thêm" onClick={() => handleView(record)}>
          <EyeOutlined />
        </Button>
        <Divider type="vertical" />
        <Button
          type="primary"
          shape="circle"
          disabled={!checkAllow('EDIT_HOC_SINH')}
          onClick={() => {
            handleEdit(record);
          }}
          title="Chỉnh sửa"
        >
          <EditOutlined />
        </Button>

        <Divider type="vertical" />

        <Popconfirm
          disabled={!checkAllow('DEL_HOC_SINH')}
          title="Thao tác này sẽ xóa học sinh ra khỏi lớp. Bạn sẽ không thực hiện được thao tác chuyển lớp nữa"
          onConfirm={() => handleDel(record)}
          okText="Đồng ý"
        >
          <Button type="default" shape="circle" title="Xóa" disabled={!checkAllow('DEL_HOC_SINH')}>
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      </React.Fragment>
    );
  };

  const columns: IColumn<IKhaiBaoThongTin.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'Họ và tên con',
      dataIndex: 'hoTen',
      align: 'center',
      width: 200,
      onCell,
      search: 'search',
    },
    {
      title: 'Họ và tên phụ huynh',
      dataIndex: 'user',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => (val ? <div>{val?.profile?.fullname}</div> : 'Chưa cập nhật'),
    },

    {
      title: 'Số điện thoại phụ huynh',
      dataIndex: 'user',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => (val ? <div>{val?.profile?.phoneNumber}</div> : 'Chưa cập nhật'),
    },
    {
      title: 'Ngày sinh',
      align: 'center',
      dataIndex: 'ngaySinh',
      width: 150,
      render: (val, record) =>
        val ? `${record?.ngaySinh}-${record?.thangSinh}-${record?.namSinh}` : 'Chưa cập nhật',
      onCell,
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: IKhaiBaoThongTin.Record) => renderLast(record),
      fixed: 'right',
      width: 170,
    },
  ];

  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={() => getDSHocSinhModel(props?.id)}
        loading={loadingHocSinh}
        dependencies={[page, limit, cond]}
        modelName="xemdshocsinh"
        scroll={{ x: 1000 }}
      >
        {checkAllow('ADD_HOC_SINH') && (
          <Button
            style={{ marginBottom: '10px' }}
            onClick={() => {
              setVisibleDrawer(true);
            }}
            type="primary"
          >
            <PlusCircleFilled />
            Thêm mới
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
      <Drawer
        width="50%"
        title="Chỉnh sửa"
        onClose={() => setVisibleEdit(false)}
        visible={visibleEdit}
      >
        <Form onFinish={onFinishEdit} {...formItemLayout} form={form}>
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item
                name="hoTen"
                label="Họ và tên con"
                rules={[...rules.required]}
                style={{ marginBottom: '5px' }}
              >
                <Input placeholder="Nhập họ và tên" value={newRecord?.hoTen} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Họ và tên phụ huynh" style={{ marginBottom: '5px' }}>
                <Input
                  placeholder="Nhập họ và tên phụ huynh"
                  value={newRecord?.user?.profile?.fullname}
                  disabled
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item label="Số điện thoại phụ huynh" style={{ marginBottom: '5px' }}>
                <Input
                  placeholder="Nhập số điện thoại phụ huynh"
                  value={newRecord?.user?.profile?.phoneNumber}
                  disabled
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="organizationId"
                label="Lớp"
                initialValue={newRecord?.donViId}
                style={{ marginBottom: '5px' }}
              >
                <Select placeholder="Chọn lớp">
                  {danhSachLop?.map((item: any) => (
                    <Select.Option value={item?._id}>{item?.tenDonVi}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Col span={24}>
            <Form.Item
              label="Ngày sinh"
              rules={[...rules.truocHomNay]}
              style={{ marginBottom: '5px' }}
            >
              <DatePicker
                disabled
                placeholder="Chọn ngày sinh"
                format="DD-MM-YYYY"
                value={
                  newRecord?.ngaySinh
                    ? moment(
                        new Date(newRecord?.namSinh, newRecord?.thangSinh - 1, newRecord?.ngaySinh),
                      )
                    : moment()
                }
              />
            </Form.Item>
          </Col>

          <Divider />
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
              Lưu
            </Button>
            <Button type="default" onClick={() => setVisibleEdit(false)}>
              Quay lại
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
      <Modal
        title="Thêm mới học sinh"
        visible={visibleDrawer}
        destroyOnClose
        width="40%"
        footer={[]}
        onCancel={() => {
          setVisibleDrawer(false);
          setRecordHocSinh(undefined);
        }}
      >
        <Form onFinish={onFinish} {...formItemLayout} form={form}>
          <Form.Item
            name="conId"
            label="Học sinh"
            style={{ marginBottom: '5px' }}
            rules={[...rules.required]}
          >
            <Select
              showSearch
              allowClear
              style={{ width: '100%' }}
              placeholder="Tìm học sinh theo tên"
              optionFilterProp="children"
              notFoundContent="Không có học sinh nào"
              onChange={onChange}
              filterOption={(input, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {dsHocSinh?.map(
                (item: { _id: string; hoTen: string; donVi: { tenDonVi: string } }) => (
                  <Select.Option
                    value={item?._id}
                  >{`${item?.hoTen} - ${item?.donVi?.tenDonVi}`}</Select.Option>
                ),
              )}
            </Select>
          </Form.Item>
          {recordHocSinh && (
            <>
              <Divider />
              <div style={{ fontWeight: 600, marginBottom: '5px', fontSize: '16px' }}>
                Thông tin học sinh
              </div>
              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <Form.Item
                    name="hoTen"
                    label="Họ và tên con"
                    rules={[...rules.required]}
                    style={{ marginBottom: '5px' }}
                  >
                    <Input placeholder="Nhập họ và tên" value={recordHocSinh?.hoTen} disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Họ và tên phụ huynh" style={{ marginBottom: '5px' }}>
                    <Input
                      placeholder="Nhập họ và tên phụ huynh"
                      value={recordHocSinh?.user?.profile?.fullname}
                      disabled
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <Form.Item label="Số điện thoại phụ huynh" style={{ marginBottom: '5px' }}>
                    <Input
                      placeholder="Nhập số điện thoại phụ huynh"
                      value={recordHocSinh?.user?.profile?.phoneNumber}
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Lớp" style={{ marginBottom: '5px' }}>
                    <Input
                      placeholder="Nhập tên đơn vị"
                      value={recordHocSinh?.donVi?.tenDonVi}
                      disabled
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Col span={24}>
                <Form.Item
                  label="Ngày sinh"
                  rules={[...rules.truocHomNay]}
                  style={{ marginBottom: '5px' }}
                >
                  <DatePicker
                    disabled
                    placeholder="Chọn ngày sinh"
                    format="DD-MM-YYYY"
                    value={
                      recordHocSinh?.ngaySinh
                        ? moment(
                            new Date(
                              recordHocSinh?.namSinh,
                              recordHocSinh?.thangSinh - 1,
                              recordHocSinh?.ngaySinh,
                            ),
                          )
                        : moment()
                    }
                  />
                </Form.Item>
              </Col>
              <Divider />
              <Row justify="center">
                <Button
                  type="default"
                  onClick={() => setVisibleDrawer(false)}
                  style={{ marginRight: '10px' }}
                >
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit">
                  Xác nhận
                </Button>
              </Row>
            </>
          )}
        </Form>
      </Modal>
      <Modal
        title="Thông tin con"
        visible={visible}
        width="60%"
        footer={
          <Button
            type="primary"
            onClick={() => {
              setVisible(false);
            }}
          >
            Ok
          </Button>
        }
        onCancel={() => {
          setVisible(false);
        }}
      >
        <Descriptions bordered>
          <Descriptions.Item label="Họ và tên">{newRecord?.hoTen}</Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {newRecord?.ngaySinh
              ? `${newRecord?.ngaySinh}-${newRecord?.thangSinh}-${newRecord?.namSinh}`
              : 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label="Chiều cao (cm)">
            {newRecord?.chieuCao ?? 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label="Cân nặng (kg)">
            {newRecord?.canNang ?? 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label="Nhóm máu">
            {newRecord?.nhomMau ?? 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label="Bệnh về mắt">
            {newRecord?.benhVeMat === true ? 'Có' : 'Không'}
          </Descriptions.Item>
          <Descriptions.Item label="Bệnh về mũi">
            {newRecord?.benhVeMui === true ? 'Có' : 'Không'}
          </Descriptions.Item>
          <Descriptions.Item label="Bệnh về tai">
            {newRecord?.benhVeTai === true ? 'Có' : 'Không'}
          </Descriptions.Item>
          <Descriptions.Item label="Bệnh ngoài da">
            {newRecord?.benhNgoaiDa === true ? 'Có' : 'Không'}
          </Descriptions.Item>
          <Descriptions.Item label="Chế độ ăn đặc biệt">
            {newRecord?.cheDoAnDacBiet === true ? 'Có' : 'Không'}
          </Descriptions.Item>
          <Descriptions.Item label="Cơ thể">
            {newRecord?.coThe ?? 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú">{newRecord?.nhanXet ?? 'Không có'}</Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};

export default HocSinh;
