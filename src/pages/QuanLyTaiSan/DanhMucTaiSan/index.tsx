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
        message.success('X??a th??nh c??ng');
        getDanhMucTaiSanModel();
        return true;
      }
    } catch (error) {
      message.error('???? x???y ra l???i');
      return false;
    }
    return false;
  };

  const onChange = (value: string) => {
    setPage(1);
    if (value === 'T???t c???') {
      setCondition({ lopId: undefined });
    } else setCondition({ lopId: value });
  };

  const renderLast = (record: IQuanLyTaiSan.DanhMucTaiSan) => {
    return (
      <React.Fragment>
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
          disabled={!checkAllow('EDIT_DANH_MUC_TAI_SAN')}
        >
          <EditOutlined />
        </Button>
        <Divider type="vertical" />
        <Popconfirm
          disabled={!checkAllow('DEL_DANH_MUC_TAI_SAN')}
          title="B???n??c????ch???c??mu???n??x??a?"
          onConfirm={() => handleDel(record)}
          okText="?????ng ??"
        >
          <Button
            type="primary"
            shape="circle"
            title="X??a"
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
      title: 'T??n t??i s???n',
      dataIndex: 'tenDayDu',
      align: 'center',
      width: 130,
      search: 'search',
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
      title: 'S??? l?????ng',
      dataIndex: 'soLuong',
      align: 'center',
      width: 100,
    },
    {
      title: 'S??? l?????ng t???t',
      dataIndex: 'soLuongTot',
      align: 'center',
      width: 100,
    },
    {
      title: 'S??? l?????ng h???ng',
      dataIndex: 'soLuongHong',
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
      title: 'Thao t??c',
      align: 'center',
      render: (record: IQuanLyTaiSan.DanhMucTaiSan) => renderLast(record),
      fixed: 'right',
      width: 170,
    },
  ];

  return (
    <>
      <TableBase
        title="Danh m???c t??i s???n"
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
            defaultValue="T???t c???"
            style={{ width: '15%', marginRight: '10px' }}
            placeholder="Ch???n l???p"
            optionFilterProp="children"
            onChange={onChange}
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
      <Modal
        title="Chi ti???t t??i s???n"
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
          <Descriptions.Item label="S??? l?????ng">{newRecord?.soLuong}</Descriptions.Item>
          <Descriptions.Item label="S??? l?????ng t???t">{newRecord?.soLuongTot}</Descriptions.Item>
          <Descriptions.Item label="S??? l?????ng h???ng">{newRecord?.soLuongHong}</Descriptions.Item>
          <Descriptions.Item label="Gi?? tr??? t??i s???n">
            {formatter.format(newRecord?.giaTri ?? 0)}
          </Descriptions.Item>
          <Descriptions.Item label="Ghi ch??">{newRecord?.ghiChu ?? 'Kh??ng c??'}</Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};
export default DanhMucTaiSan;
