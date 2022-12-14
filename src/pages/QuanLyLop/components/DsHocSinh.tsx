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
      message.error('Chuy???n l???p kh??ng th??nh c??ng do s??? l?????ng h???c sinh trong l???p ???? ?????');
      return false;
    }
    try {
      const result = await axios.put(`${ip3}/con/${value?.conId}/chuyen-lop/${props?.id}`);
      if (result?.status === 200) {
        message.success('Chuy???n l???p th??nh c??ng');
        getDSHocSinhModel(props?.id);
        setVisibleDrawer(false);
        return true;
      }
    } catch (error) {
      const { response }: any = error;
      if (response?.data?.errorCode === 'CLASS_SIZE_LIMITED') {
        message.error('Chuy???n l???p kh??ng th??nh c??ng do s??? l?????ng h???c sinh trong l???p ???? ?????');
      }
      message.error('Chuy???n l???p kh??ng th??nh c??ng');
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
      message.error('C???p nh???t l???p kh??ng th??nh c??ng do s??? l?????ng h???c sinh trong l???p ???? ?????');
      return false;
    }
    try {
      const result = await axios.put(
        `${ip3}/con/${newRecord?._id}/chuyen-lop/${value?.organizationId}`,
      );
      if (result?.status === 200) {
        message.success('C???p nh???t th??nh c??ng');
        getDSHocSinhModel(props?.id);
        setVisibleEdit(false);
        return true;
      }
    } catch (error) {
      const { response }: any = error;
      if (response?.data?.errorCode === 'CLASS_SIZE_LIMITED') {
        message.error('C???p nh???t l???p kh??ng th??nh c??ng do s??? l?????ng h???c sinh trong l???p ???? ?????');
      }
      message.error('C???p nh???t kh??ng th??nh c??ng');
      return false;
    }
    return true;
  };

  const handleDel = async (record: IKhaiBaoThongTin.Record) => {
    const res = await delHocSinhLop({ id: record?._id });
    if (res?.status === 200) {
      message.success('X??a th??nh c??ng');
      getDSHocSinhModel(props?.id);
      return true;
    }
    message.error('???? x???y ra l???i');
    return false;
  };

  const renderLast = (record: IKhaiBaoThongTin.Record) => {
    return (
      <React.Fragment>
        <Button type="default" shape="circle" title="Xem th??m" onClick={() => handleView(record)}>
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
          title="Ch???nh??s???a"
        >
          <EditOutlined />
        </Button>

        <Divider type="vertical" />

        <Popconfirm
          disabled={!checkAllow('DEL_HOC_SINH')}
          title="Thao t??c n??y s??? x??a h???c sinh ra kh???i l???p. B???n s??? kh??ng th???c hi???n ???????c thao t??c chuy???n l???p n???a"
          onConfirm={() => handleDel(record)}
          okText="?????ng ??"
        >
          <Button type="default" shape="circle" title="X??a" disabled={!checkAllow('DEL_HOC_SINH')}>
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
      title: 'H??? v?? t??n con',
      dataIndex: 'hoTen',
      align: 'center',
      width: 200,
      onCell,
      search: 'search',
    },
    {
      title: 'H??? v?? t??n ph??? huynh',
      dataIndex: 'user',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => (val ? <div>{val?.profile?.fullname}</div> : 'Ch??a c???p nh???t'),
    },

    {
      title: 'S??? ??i???n tho???i ph??? huynh',
      dataIndex: 'user',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => (val ? <div>{val?.profile?.phoneNumber}</div> : 'Ch??a c???p nh???t'),
    },
    {
      title: 'Ng??y sinh',
      align: 'center',
      dataIndex: 'ngaySinh',
      width: 150,
      render: (val, record) =>
        val ? `${record?.ngaySinh}-${record?.thangSinh}-${record?.namSinh}` : 'Ch??a c???p nh???t',
      onCell,
    },
    {
      title: 'Thao t??c',
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
            Th??m m???i
          </Button>
        )}
        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          T???ng s???:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={total}
          />
        </h3>
      </TableBase>
      <Drawer
        width="50%"
        title="Ch???nh s???a"
        onClose={() => setVisibleEdit(false)}
        visible={visibleEdit}
      >
        <Form onFinish={onFinishEdit} {...formItemLayout} form={form}>
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item
                name="hoTen"
                label="H??? v?? t??n con"
                rules={[...rules.required]}
                style={{ marginBottom: '5px' }}
              >
                <Input placeholder="Nh???p h??? v?? t??n" value={newRecord?.hoTen} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="H??? v?? t??n ph??? huynh" style={{ marginBottom: '5px' }}>
                <Input
                  placeholder="Nh???p h??? v?? t??n ph??? huynh"
                  value={newRecord?.user?.profile?.fullname}
                  disabled
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item label="S??? ??i???n tho???i ph??? huynh" style={{ marginBottom: '5px' }}>
                <Input
                  placeholder="Nh???p s??? ??i???n tho???i ph??? huynh"
                  value={newRecord?.user?.profile?.phoneNumber}
                  disabled
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="organizationId"
                label="L???p"
                initialValue={newRecord?.donViId}
                style={{ marginBottom: '5px' }}
              >
                <Select placeholder="Ch???n l???p">
                  {danhSachLop?.map((item: any) => (
                    <Select.Option value={item?._id}>{item?.tenDonVi}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Col span={24}>
            <Form.Item
              label="Ng??y sinh"
              rules={[...rules.truocHomNay]}
              style={{ marginBottom: '5px' }}
            >
              <DatePicker
                disabled
                placeholder="Ch???n ng??y sinh"
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
              L??u
            </Button>
            <Button type="default" onClick={() => setVisibleEdit(false)}>
              Quay l???i
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
      <Modal
        title="Th??m m???i h???c sinh"
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
            label="H???c sinh"
            style={{ marginBottom: '5px' }}
            rules={[...rules.required]}
          >
            <Select
              showSearch
              allowClear
              style={{ width: '100%' }}
              placeholder="T??m h???c sinh theo t??n"
              optionFilterProp="children"
              notFoundContent="Kh??ng c?? h???c sinh n??o"
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
                Th??ng tin h???c sinh
              </div>
              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <Form.Item
                    name="hoTen"
                    label="H??? v?? t??n con"
                    rules={[...rules.required]}
                    style={{ marginBottom: '5px' }}
                  >
                    <Input placeholder="Nh???p h??? v?? t??n" value={recordHocSinh?.hoTen} disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="H??? v?? t??n ph??? huynh" style={{ marginBottom: '5px' }}>
                    <Input
                      placeholder="Nh???p h??? v?? t??n ph??? huynh"
                      value={recordHocSinh?.user?.profile?.fullname}
                      disabled
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <Form.Item label="S??? ??i???n tho???i ph??? huynh" style={{ marginBottom: '5px' }}>
                    <Input
                      placeholder="Nh???p s??? ??i???n tho???i ph??? huynh"
                      value={recordHocSinh?.user?.profile?.phoneNumber}
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="L???p" style={{ marginBottom: '5px' }}>
                    <Input
                      placeholder="Nh???p t??n ????n v???"
                      value={recordHocSinh?.donVi?.tenDonVi}
                      disabled
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Col span={24}>
                <Form.Item
                  label="Ng??y sinh"
                  rules={[...rules.truocHomNay]}
                  style={{ marginBottom: '5px' }}
                >
                  <DatePicker
                    disabled
                    placeholder="Ch???n ng??y sinh"
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
                  H???y
                </Button>
                <Button type="primary" htmlType="submit">
                  X??c nh???n
                </Button>
              </Row>
            </>
          )}
        </Form>
      </Modal>
      <Modal
        title="Th??ng tin con"
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
          <Descriptions.Item label="H??? v?? t??n">{newRecord?.hoTen}</Descriptions.Item>
          <Descriptions.Item label="Ng??y sinh">
            {newRecord?.ngaySinh
              ? `${newRecord?.ngaySinh}-${newRecord?.thangSinh}-${newRecord?.namSinh}`
              : 'Ch??a c???p nh???t'}
          </Descriptions.Item>
          <Descriptions.Item label="Chi???u cao (cm)">
            {newRecord?.chieuCao ?? 'Ch??a c???p nh???t'}
          </Descriptions.Item>
          <Descriptions.Item label="C??n n???ng (kg)">
            {newRecord?.canNang ?? 'Ch??a c???p nh???t'}
          </Descriptions.Item>
          <Descriptions.Item label="Nh??m m??u">
            {newRecord?.nhomMau ?? 'Ch??a c???p nh???t'}
          </Descriptions.Item>
          <Descriptions.Item label="B???nh v??? m???t">
            {newRecord?.benhVeMat === true ? 'C??' : 'Kh??ng'}
          </Descriptions.Item>
          <Descriptions.Item label="B???nh v??? m??i">
            {newRecord?.benhVeMui === true ? 'C??' : 'Kh??ng'}
          </Descriptions.Item>
          <Descriptions.Item label="B???nh v??? tai">
            {newRecord?.benhVeTai === true ? 'C??' : 'Kh??ng'}
          </Descriptions.Item>
          <Descriptions.Item label="B???nh ngo??i da">
            {newRecord?.benhNgoaiDa === true ? 'C??' : 'Kh??ng'}
          </Descriptions.Item>
          <Descriptions.Item label="Ch??? ????? ??n ?????c bi???t">
            {newRecord?.cheDoAnDacBiet === true ? 'C??' : 'Kh??ng'}
          </Descriptions.Item>
          <Descriptions.Item label="C?? th???">
            {newRecord?.coThe ?? 'Ch??a c???p nh???t'}
          </Descriptions.Item>
          <Descriptions.Item label="Ghi ch??">{newRecord?.nhanXet ?? 'Kh??ng c??'}</Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};

export default HocSinh;
