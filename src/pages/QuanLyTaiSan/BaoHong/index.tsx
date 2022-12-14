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
        message.success('X??a th??nh c??ng');
        getBaoHongModel();
        return true;
      }
    } catch (error) {
      message.error('???? x???y ra l???i');
      return false;
    }
    return false;
  };

  const handleStatus = async (record: IQuanLyTaiSan.BaoHong, trangThai: string) => {
    if (trangThai === 'Ch??? thanh l??') {
      try {
        const res = await choThanhLyBaoHong({ id: record?._id });
        if (res?.status === 200) {
          message.success('X??c nh???n kh??ng s???a ???????c, ch??? thanh l?? th??nh c??ng');
          getThanhLyModel();
          getBaoHongModel();
          getTaiSan();
          return true;
        }
      } catch (error) {
        message.error('???? x???y ra l???i');
        return false;
      }
    }
    if (trangThai === '???? thanh l??') {
      try {
        const res = await daThanhLyBaoHong({ id: record?._id });
        if (res?.status === 200) {
          message.success('X??c nh???n ???? thanh l?? th??nh c??ng');
          getThanhLyModel();
          getBaoHongModel();
          getTaiSan();
          return true;
        }
      } catch (error) {
        message.error('???? x???y ra l???i');
        return false;
      }
    }
    try {
      const res = await daSuaBaoHong({ id: record?._id });
      if (res?.status === 200) {
        message.success('X??c nh???n ???? s???a th??nh c??ng');
        getThanhLyModel();
        getBaoHongModel();
        getTaiSan();
        return true;
      }
    } catch (error) {
      message.error('???? x???y ra l???i');
      return false;
    }
    return false;
  };

  const onChangeBaoHong = (value: string) => {
    if (value === 'T???t c???') {
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
          onClick={() => handleStatus(record, 'Ch??? thanh l??')}
          title="X??c nh???n kh??ng s???a ???????c"
          disabled={!checkAllow('REJECT_BAO_HONG') || record?.trangThai !== 'Ch??? s???a ch???a'}
        >
          <CloseOutlined />
        </Button>

        <Divider type="vertical" />
        <Button
          type="default"
          shape="circle"
          onClick={() => handleStatus(record, '???? x??? l??')}
          title="X??c nh???n ???? s???a"
          disabled={!checkAllow('ACCEPT_BAO_HONG') || record?.trangThai !== 'Ch??? s???a ch???a'}
        >
          <CheckOutlined />
        </Button>

        <Divider type="vertical" />
        <Button
          type="primary"
          shape="circle"
          title="Chi ti???t"
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
          title="Ch???nh??s???a"
          disabled={!checkAllow('EDIT_BAO_HONG') || record?.trangThai !== 'Ch??? s???a ch???a'}
        >
          <EditOutlined />
        </Button>
        <Divider type="vertical" />
        <Popconfirm
          disabled={!checkAllow('DEL_BAO_HONG') || record?.trangThai !== 'Ch??? s???a ch???a'}
          title="B???n??c????ch???c??mu???n??x??a?"
          onConfirm={() => handleDel(record)}
          okText="?????ng ??"
        >
          <Button
            type="primary"
            shape="circle"
            title="X??a"
            disabled={!checkAllow('DEL_BAO_HONG') || record?.trangThai !== 'Ch??? s???a ch???a'}
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
      title: 'T??n t??i s???n',
      dataIndex: 'tenDayDu',
      align: 'center',
      width: 130,
    },
    {
      title: 'Lo???i t??i s???n',
      dataIndex: 'loaiTaiSan',
      align: 'center',
      width: 100,
    },
    {
      title: '????n v???',
      dataIndex: 'loaiTaiSan',
      align: 'center',
      width: 150,
      render: (val, record) =>
        val === 'Tr?????ng' ? record?.truong?.tenDonVi : record?.lop?.tenDonVi,
    },
    {
      title: 'S??? l?????ng h???ng',
      dataIndex: 'soLuong',
      align: 'center',
      width: 100,
    },
    {
      title: 'Gi?? tr??? t??i s???n',
      dataIndex: 'giaTri',
      align: 'center',
      width: 130,
      render: (val) => formatter.format(val ?? 0),
    },
    {
      title: 'Ghi ch??',
      dataIndex: 'ghiChu',
      align: 'center',
      width: 200,
      render: (val) => val ?? 'Kh??ng c??',
    },
    {
      title: 'Tr???ng th??i',
      dataIndex: 'trangThai',
      align: 'center',
      width: 150,
      render: (val) =>
        val === '???? x??? l??' ? (
          <Tag color="blue">???? s???a ch???a</Tag>
        ) : (
          <Tag color="red">Ch??? s???a ch???a</Tag>
        ),
    },
    {
      title: 'Thao t??c',
      align: 'center',
      render: (record: IQuanLyTaiSan.BaoHong) => renderLast(record),
      fixed: 'right',
      width: 240,
    },
  ];

  return (
    <>
      <TableBase
        title="Danh m???c b??o h???ng, s???a ch???a"
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
            defaultValue="T???t c???"
            style={{ width: '15%', marginRight: '10px' }}
            placeholder="Ch???n l???p"
            optionFilterProp="children"
            onChange={onChangeBaoHong}
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Select.Option value="T???t c???">T???t c??? c??c l???p</Select.Option>
            {dsLop?.map((item: { _id: string; tenDonVi: string }) => (
              <Select.Option key={item?._id} value={item?._id}>
                {item?.tenDonVi}
              </Select.Option>
            ))}
          </Select>
        )}
        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          T???ng s???:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={total}
          />
        </h3>
      </TableBase>
      <br />
      <TableThanhLy />
      <Modal
        title="Chi ti???t t??i s???n b??o h???ng"
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
          <Descriptions.Item label="T??n t??i s???n">{newRecord?.tenDayDu}</Descriptions.Item>
          <Descriptions.Item label="Lo???i t??i s???n">{newRecord?.loaiTaiSan}</Descriptions.Item>
          {newRecord?.loaiTaiSan === 'Tr?????ng' ? (
            <Descriptions.Item label="T??n ????n v???">{newRecord?.truong?.tenDonVi}</Descriptions.Item>
          ) : (
            <Descriptions.Item label="T??n ????n v???">{newRecord?.lop?.tenDonVi}</Descriptions.Item>
          )}
          <Descriptions.Item label="S??? l?????ng h???ng">{newRecord?.soLuong}</Descriptions.Item>
          <Descriptions.Item label="Gi?? tr??? t??i s???n">
            {formatter.format(newRecord?.giaTri ?? 0)}
          </Descriptions.Item>
          <Descriptions.Item label="Ghi ch??">{newRecord?.ghiChu ?? 'Kh??ng c??'}</Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};
export default BaoHong;
