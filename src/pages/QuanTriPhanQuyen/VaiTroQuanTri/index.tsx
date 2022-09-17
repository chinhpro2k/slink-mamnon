/* eslint-disable no-param-reassign */
import TableBase from '@/components/Table';
import type { VaiTroQuanTri as IVaiTroQuanTri } from '@/services/VaiTroQuanTri';
import {
  addVaiTroQuanTri,
  delVaiTroQuanTri,
  updVaiTroQuanTri,
} from '@/services/VaiTroQuanTri/vaitroquantri';
import rules from '@/utils/rules';
import { DeleteOutlined, EditOutlined, PlusCircleFilled } from '@ant-design/icons';
import { DrawerForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Button, Divider, Input, message, Popconfirm, Form, Drawer } from 'antd';
import type { ColumnProps } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import CayChucNang from './CayChuNang';

const VaiTroQuanTri = () => {
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [state, setstate] = useState<number>(0);
  const [newRecord, setNewRecord] = useState<IVaiTroQuanTri.Record>();
  const {
    loading: loadingVaiTroQuanTri,
    getVaiTroQuanTriModel,
    total,
    page,
    limit,
  } = useModel('vaitroquantri');
  const [dsChucNang, setDSChucNang] = useState([]);
  const [danhSachTruongLop, setDanhSachTruongLop] = useState([]);
  const vaiTro = localStorage.getItem('vaiTro');
  const getDSChucNang = async () => {
    const result = await axios.get(`${ip3}/modules-fe/pageable?page=1&limit=1000&createdAt=1`);
    setDSChucNang(result?.data?.data?.result);
  };
  const getDSTruongLop = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=1000`);
    setDanhSachTruongLop(result?.data?.data?.result);
  };

  React.useEffect(() => {
    getDSChucNang();
    getDSTruongLop();
  }, []);

  const handleEdit = (record: IVaiTroQuanTri.Record) => {
    setVisibleDrawer(true);
    setEdit(true);
    setNewRecord(record);
  };

  const handleDel = async (record: IVaiTroQuanTri.Record) => {
    // eslint-disable-next-line no-underscore-dangle
    const res = await delVaiTroQuanTri({ id: record?._id });
    if (res?.status === 200) {
      message.success('Xóa thành công');
      getVaiTroQuanTriModel();
      return true;
    }
    message.error('Đã xảy ra lỗi');
    return false;
  };

  const renderLast = (record: IVaiTroQuanTri.Record) => {
    return (
      <React.Fragment>
        <Button
          type="primary"
          shape="circle"
          onClick={() => {
            handleEdit(record);
          }}
          title="Chỉnh sửa"
        >
          <EditOutlined />
        </Button>

        <Divider type="vertical" />

        <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDel(record)}>
          <Button type="default" shape="circle" title="Xóa">
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      </React.Fragment>
    );
  };

  const columns: ColumnProps<IVaiTroQuanTri.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Tên vai trò',
      dataIndex: 'name',
      align: 'center',
      width: 150,
    },
    {
      title: 'Mô tả',
      dataIndex: 'desc',
      align: 'center',
      width: 200,
    },
    // {
    //   title: 'Chức năng',
    //   dataIndex: 'modules',
    //   align: 'center',
    //   width: 200,
    //   render: (val) =>
    //     dsChucNang?.map((item: { id: string; name: string }) => {
    //       return val?.map((x: string) => item?.key === x && <div>{item?.name}</div>);
    //     }),
    // },
  ];

  if (vaiTro === 'Admin' || vaiTro === 'SuperAdmin')
    columns.push({
      title: 'Thao tác',
      align: 'center',
      render: (record: IVaiTroQuanTri.Record) => renderLast(record),
      fixed: 'right',
      width: 70,
    });

  useEffect(() => {}, []);

  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={getVaiTroQuanTriModel}
        loading={loadingVaiTroQuanTri}
        dependencies={[page, limit]}
        modelName="vaitroquantri"
        title="Danh sách vai trò quản trị viên"
      >
        <Button
          style={{ marginBottom: '10px', marginRight: '10px' }}
          onClick={() => {
            setEdit(false);
            setVisibleDrawer(true);
            setNewRecord(undefined)
          }}
          type="primary"
        >
          <PlusCircleFilled />
          Thêm mới
        </Button>
        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          Tổng số:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={total}
          />
        </h3>
      </TableBase>
      {/*<Drawer*/}
      {/*  visible={visibleDrawer}*/}
      {/*  width="60%"*/}
      {/*  onClose={() => setVisibleDrawer(false)}*/}
      {/*  title={edit ? 'Chỉnh sửa' : 'Thêm mới'}*/}
      {/*  // drawerProps={{*/}
      {/*  //   forceRender: true,*/}
      {/*  //   destroyOnClose: true,*/}
      {/*  // }}*/}
      {/*  footer={() => {*/}
      {/*    return (*/}
      {/*      <div>*/}
      {/*        <Button*/}
      {/*          htmlType="submit"*/}
      {/*          onClick={() => {*/}
      {/*            // newProps.submit();*/}
      {/*          }}*/}
      {/*          type="primary"*/}
      {/*        >*/}
      {/*          Lưu*/}
      {/*        </Button>*/}

      {/*        <Button*/}
      {/*          key="cancel"*/}
      {/*          onClick={() => {*/}
      {/*            setVisibleDrawer(false);*/}
      {/*          }}*/}
      {/*        >*/}
      {/*          Quay lại*/}
      {/*        </Button>*/}
      {/*      </div>*/}
      {/*    );*/}
      {/*  }}*/}
      {/*  // initialValues={{*/}
      {/*  //   ...newRecord,*/}
      {/*  //   modules: newRecord?.modules ?? [],*/}
      {/*  // }}*/}
      {/*>*/}
      {/*  <Form*/}
      {/*    layout="vertical"*/}
      {/*    onFinish={async (values: any) => {*/}
      {/*      values.default = true;*/}
      {/*      //*/}
      {/*      // return;*/}
      {/*      if (edit) {*/}
      {/*        // eslint-disable-next-line no-underscore-dangle*/}
      {/*        const id = newRecord?._id;*/}
      {/*        const res = await updVaiTroQuanTri({ ...values, id });*/}
      {/*        if (res?.data?.statusCode === 200) {*/}
      {/*          message.success('Cập nhật thành công');*/}
      {/*          getVaiTroQuanTriModel();*/}
      {/*          return true;*/}
      {/*        }*/}
      {/*        message.error('Đã xảy ra lỗi');*/}
      {/*        return false;*/}
      {/*      }*/}
      {/*      try {*/}
      {/*        const res = await addVaiTroQuanTri({ ...values });*/}
      {/*        if (res?.data?.statusCode === 201) {*/}
      {/*          message.success('Thêm mới thành công');*/}
      {/*          setstate(state + 1);*/}
      {/*          getVaiTroQuanTriModel();*/}
      {/*          return true;*/}
      {/*        }*/}
      {/*      } catch (error) {*/}
      {/*        message.error('Đã xảy ra lỗi. Vui lòng thử lại!');*/}
      {/*        return false;*/}
      {/*      }*/}
      {/*      return false;*/}
      {/*      //*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <Form.Item name={'name'} initialValue={newRecord?.name}>*/}
      {/*      <ProFormText*/}
      {/*        name="name"*/}
      {/*        label="Tên vai trò"*/}
      {/*        placeholder="Nhập tên vai trò"*/}
      {/*        rules={[...rules.required]}*/}
      {/*      />*/}
      {/*    </Form.Item>*/}
      {/*    <Form.Item name={'name'} initialValue={newRecord?.desc}>*/}
      {/*      <ProFormTextArea name="desc" label="Mô tả" placeholder="Nhập mô tả" />*/}
      {/*    </Form.Item>*/}
      {/*    <Form.Item name={'name'} initialValue={newRecord?.systemRole}>*/}
      {/*      <ProFormSelect*/}
      {/*        name="systemRole"*/}
      {/*        label="Vai trò"*/}
      {/*        placeholder="Chọn vai trò quản trị"*/}
      {/*        rules={[...rules.required]}*/}
      {/*        options={[*/}
      {/*          {*/}
      {/*            value: 'Admin',*/}
      {/*            label: 'Admin',*/}
      {/*          },*/}
      {/*          {*/}
      {/*            value: 'HieuTruong',*/}
      {/*            label: 'Hiệu trưởng',*/}
      {/*          },*/}
      {/*          {*/}
      {/*            value: 'GiaoVien',*/}
      {/*            label: 'Giáo viên',*/}
      {/*          },*/}
      {/*          {*/}
      {/*            value: 'PhuHuynh',*/}
      {/*            label: 'Phụ huynh',*/}
      {/*          },*/}
      {/*          {*/}
      {/*            value: 'Guest',*/}
      {/*            label: 'Khách',*/}
      {/*          },*/}
      {/*        ]}*/}
      {/*      />*/}
      {/*    </Form.Item>*/}
      {/*    /!* <ProFormSelect*/}
      {/*    name="modules"*/}
      {/*    label="Chức năng"*/}
      {/*    mode="multiple"*/}
      {/*    placeholder="Chọn chức năng quản trị"*/}
      {/*    options={dsChucNang?.map((item: { name: string; id: string }) => ({*/}
      {/*      value: `${item?.id}`,*/}
      {/*      label: `${item?.name}`,*/}
      {/*    }))}*/}
      {/*  /> *!/*/}
      {/*    <Form.Item name="modules" label="Chức năng">*/}
      {/*      <CayChucNang dsChucNang={dsChucNang} />*/}
      {/*    </Form.Item>*/}
      {/*    <ProFormSelect*/}
      {/*      name="organizationId"*/}
      {/*      label="Thuộc đơn vị"*/}
      {/*      placeholder="Chọn đơn vị"*/}
      {/*      options={danhSachTruongLop?.map((item: { tenDonVi: string; _id: string }) => ({*/}
      {/*        // eslint-disable-next-line no-underscore-dangle*/}
      {/*        value: `${item?._id}`,*/}
      {/*        label: `${item?.tenDonVi}`,*/}
      {/*      }))}*/}
      {/*    />*/}

      {/*    {edit && <div style={{ width: '100%' }} />}*/}
      {/*  </Form>*/}
      {/*</Drawer>*/}
      <DrawerForm<IVaiTroQuanTri.Record>
        visible={visibleDrawer}
        width="60%"
        onVisibleChange={setVisibleDrawer}
        title={edit ? 'Chỉnh sửa' : 'Thêm mới'}
        drawerProps={{
          forceRender: false,
          destroyOnClose: true,
        }}
        onFinish={async (values: any) => {
          values.default = true;
          //
          // return;
          if (edit) {
            // eslint-disable-next-line no-underscore-dangle
            const id = newRecord?._id;
            const res = await updVaiTroQuanTri({ ...values, id });
            if (res?.data?.statusCode === 200) {
              message.success('Cập nhật thành công');
              getVaiTroQuanTriModel();
              return true;
            }
            message.error('Đã xảy ra lỗi');
            return false;
          }
          try {
            const res = await addVaiTroQuanTri({ ...values });
            if (res?.data?.statusCode === 201) {
              message.success('Thêm mới thành công');
              setstate(state + 1);
              getVaiTroQuanTriModel();
              return true;
            }
          } catch (error) {
            message.error('Đã xảy ra lỗi. Vui lòng thử lại!');
            return false;
          }
          return false;
          //
        }}
        submitter={{
          render: (newProps) => {
            // DefaultDom có thể dùng hoặc không

            return [
              // ...defaultDoms,
              <Button
                key="submit"
                onClick={() => {
                  newProps.submit();
                }}
                type="primary"
              >
                Lưu
              </Button>,
              <Button
                key="cancel"
                onClick={() => {
                  setVisibleDrawer(false);
                }}
              >
                Quay lại
              </Button>,
            ];
          },
        }}
        initialValues={{
          ...newRecord,
          modules: newRecord?.modules ?? [],
        }}
      >
        <ProFormText
          name="name"
          label="Tên vai trò"
          placeholder="Nhập tên vai trò"
          rules={[...rules.required]}
        />
        <ProFormTextArea name="desc" label="Mô tả" placeholder="Nhập mô tả" />
        <ProFormSelect
          name="systemRole"
          label="Vai trò"
          placeholder="Chọn vai trò quản trị"
          rules={[...rules.required]}
          options={[
            {
              value: 'Admin',
              label: 'Admin',
            },
            {
              value: 'HieuTruong',
              label: 'Hiệu trưởng',
            },
            {
              value: 'ChuTruong',
              label: 'Chủ trường',
            },
            {
              value: 'GiaoVien',
              label: 'Giáo viên',
            },
            {
              value: 'PhuHuynh',
              label: 'Phụ huynh',
            },
            {
              value: 'Guest',
              label: 'Khách',
            },
          ]}
        />
        {/* <ProFormSelect
          name="modules"
          label="Chức năng"
          mode="multiple"
          placeholder="Chọn chức năng quản trị"
          options={dsChucNang?.map((item: { name: string; id: string }) => ({
            value: `${item?.id}`,
            label: `${item?.name}`,
          }))}
        /> */}
        <Form.Item name="modules" label="Chức năng">
          <CayChucNang dsChucNang={dsChucNang} />
        </Form.Item>
        {/*<ProFormSelect*/}
        {/*  name="organizationId"*/}
        {/*  label="Thuộc đơn vị"*/}
        {/*  placeholder="Chọn đơn vị"*/}
        {/*  options={danhSachTruongLop?.map((item: { tenDonVi: string; _id: string }) => ({*/}
        {/*    // eslint-disable-next-line no-underscore-dangle*/}
        {/*    value: `${item?._id}`,*/}
        {/*    label: `${item?.tenDonVi}`,*/}
        {/*  }))}*/}
        {/*/>*/}

        {edit && <div style={{ width: '100%' }} />}
      </DrawerForm>
    </>
  );
};

export default VaiTroQuanTri;
