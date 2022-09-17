import TableBase from '@/components/Table';
import { useModel } from 'umi';
import FormThucDonMau from './components/FormThucDonMau';
import { Button, Divider, Drawer, Modal, Popconfirm, Tabs } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import TableChiTietTDMau from './components/TableChiTietTDMau';
import { useEffect } from 'react';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

const LenThucDonMau = () => {
  const thucDonMau = useModel('thucdonmau');
  const initialStateModel = useModel('@@initialState');
  const donViId = initialStateModel?.initialState?.currentUser?.role?.organizationId;
  const columns = [];
  const { setDanhSachMonAn } = useModel('khauphanan');
  const getDanhSachMonAn = async () => {
    const result = await axios.get(`${ip3}/danh-muc-mon-an/pageable?page=1&limit=10000`);
    setDanhSachMonAn(result?.data?.data?.result);
  };
  const getTruong = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=1000`, {
      params: {
        cond: {
          loaiDonVi: 'Truong',
        },
      },
    });

    thucDonMau.setDanhSachTruong(result?.data?.data?.result);
  };

  useEffect(() => {
    getDanhSachMonAn();
    getTruong();
  }, []);
  const renderLast = (record: any) => (
    <>
      <Button
        type="primary"
        shape="circle"
        icon={<EyeOutlined />}
        onClick={() => {
          thucDonMau.setVisibleChiTietTDMau(true);
          thucDonMau.setRecord(record);
        }}
      />
      <Divider type="vertical" />
      <Button
        type="primary"
        shape="circle"
        onClick={() => {
          thucDonMau.setVisibleForm(true);
          thucDonMau.setEdit(true);
          thucDonMau.setRecord(record);
        }}
        icon={<EditOutlined />}
      />
      <Divider type="vertical" />
      <Popconfirm
        title="Bạn có muốn xóa?"
        okText="Có"
        cancelText="Không"
        onConfirm={async () => {
          const response = await axios.delete(`${ip3}/template-thuc-don/${record?._id}`);
          thucDonMau?.getThucDonMauModel(
            initialStateModel?.initialState?.currentUser?.role?.systemRole === 'HieuTruong'
              ? { donViId, loaiHinhLop: thucDonMau?.loaiHinh }
              : { loaiHinhLop: thucDonMau?.loaiHinh },
          );
        }}
      >
        <Button shape="circle" icon={<DeleteOutlined />} />
      </Popconfirm>
    </>
  );
  return (
    <>
      <Tabs activeKey={thucDonMau?.loaiHinh} onChange={(active) => thucDonMau?.setLoaiHinh(active)}>
        <Tabs.TabPane tab="Mẫu giáo" key="Mầm non"></Tabs.TabPane>
        <Tabs.TabPane tab="Nhà trẻ" key="Nhà trẻ"></Tabs.TabPane>
      </Tabs>
      <TableBase
        border
        columns={[
          {
            title: 'STT',
            dataIndex: 'index',
            width: 80,
            align: 'center',
          },
          {
            title: 'Tên thực đơn mẫu',
            dataIndex: 'ten',
            width: 300,
            align: 'center',
          },
          {
            title: 'Trường',
            dataIndex: 'donViId',
            width: 200,
            align: 'center',
            render: (val) =>
              thucDonMau?.danhSachTruong?.filter((item) => item?._id === val)?.[0]?.tenDonVi,
          },
          {
            title: 'Loại thực đơn mẫu',
            dataIndex: 'loai',
            align: 'center',
          },
          {
            title: 'Thao tác',
            fixed: 'right',
            width: 200,
            render: (_, record) => renderLast(record),
            align: 'center',
          },
        ]}
        getData={() =>
          thucDonMau?.getThucDonMauModel(
            initialStateModel?.initialState?.currentUser?.role?.systemRole === 'HieuTruong'
              ? { donViId, loaiHinhLop: thucDonMau?.loaiHinh }
              : { loaiHinhLop: thucDonMau?.loaiHinh },
          )
        }
        dependencies={[thucDonMau?.page, thucDonMau?.limit, thucDonMau?.cond, thucDonMau?.loaiHinh]}
        loading={thucDonMau?.loading}
        modelName="thucdonmau"
        title="Danh mục thực đơn mẫu"
        // scroll={{ x: 1300 }}
        Form={FormThucDonMau}
        formType="Drawer"
        widthDrawer="60%"
        hascreate
      />
      <Drawer
        width="85%"
        destroyOnClose
        visible={thucDonMau?.visibleChiTietTDMau}
        onClose={() => {
          thucDonMau.setRecord({});
          thucDonMau.setVisibleChiTietTDMau(false);
        }}
        // title="Chi tiết thực đơn mẫu"
      >
        <TableChiTietTDMau type={thucDonMau?.record?.loai === 'Tuần'} />
      </Drawer>
    </>
  );
};

export default LenThucDonMau;
