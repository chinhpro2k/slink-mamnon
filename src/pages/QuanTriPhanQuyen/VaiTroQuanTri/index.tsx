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
      message.success('X??a th??nh c??ng');
      getVaiTroQuanTriModel();
      return true;
    }
    message.error('???? x???y ra l???i');
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
          title="Ch???nh??s???a"
        >
          <EditOutlined />
        </Button>

        <Divider type="vertical" />

        <Popconfirm title="B???n??c????ch???c??mu???n??x??a?" onConfirm={() => handleDel(record)}>
          <Button type="default" shape="circle" title="X??a">
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
      title: 'T??n vai tr??',
      dataIndex: 'name',
      align: 'center',
      width: 150,
    },
    {
      title: 'M?? t???',
      dataIndex: 'desc',
      align: 'center',
      width: 200,
    },
    // {
    //   title: 'Ch???c n??ng',
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
      title: 'Thao t??c',
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
        title="Danh s??ch vai tr?? qu???n tr??? vi??n"
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
          Th??m m???i
        </Button>
        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          T???ng s???:
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
      {/*  title={edit ? 'Ch???nh s???a' : 'Th??m m???i'}*/}
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
      {/*          L??u*/}
      {/*        </Button>*/}

      {/*        <Button*/}
      {/*          key="cancel"*/}
      {/*          onClick={() => {*/}
      {/*            setVisibleDrawer(false);*/}
      {/*          }}*/}
      {/*        >*/}
      {/*          Quay l???i*/}
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
      {/*          message.success('C???p nh???t th??nh c??ng');*/}
      {/*          getVaiTroQuanTriModel();*/}
      {/*          return true;*/}
      {/*        }*/}
      {/*        message.error('???? x???y ra l???i');*/}
      {/*        return false;*/}
      {/*      }*/}
      {/*      try {*/}
      {/*        const res = await addVaiTroQuanTri({ ...values });*/}
      {/*        if (res?.data?.statusCode === 201) {*/}
      {/*          message.success('Th??m m???i th??nh c??ng');*/}
      {/*          setstate(state + 1);*/}
      {/*          getVaiTroQuanTriModel();*/}
      {/*          return true;*/}
      {/*        }*/}
      {/*      } catch (error) {*/}
      {/*        message.error('???? x???y ra l???i. Vui l??ng th??? l???i!');*/}
      {/*        return false;*/}
      {/*      }*/}
      {/*      return false;*/}
      {/*      //*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <Form.Item name={'name'} initialValue={newRecord?.name}>*/}
      {/*      <ProFormText*/}
      {/*        name="name"*/}
      {/*        label="T??n vai tr??"*/}
      {/*        placeholder="Nh???p t??n vai tr??"*/}
      {/*        rules={[...rules.required]}*/}
      {/*      />*/}
      {/*    </Form.Item>*/}
      {/*    <Form.Item name={'name'} initialValue={newRecord?.desc}>*/}
      {/*      <ProFormTextArea name="desc" label="M?? t???" placeholder="Nh???p m?? t???" />*/}
      {/*    </Form.Item>*/}
      {/*    <Form.Item name={'name'} initialValue={newRecord?.systemRole}>*/}
      {/*      <ProFormSelect*/}
      {/*        name="systemRole"*/}
      {/*        label="Vai tr??"*/}
      {/*        placeholder="Ch???n vai tr?? qu???n tr???"*/}
      {/*        rules={[...rules.required]}*/}
      {/*        options={[*/}
      {/*          {*/}
      {/*            value: 'Admin',*/}
      {/*            label: 'Admin',*/}
      {/*          },*/}
      {/*          {*/}
      {/*            value: 'HieuTruong',*/}
      {/*            label: 'Hi???u tr?????ng',*/}
      {/*          },*/}
      {/*          {*/}
      {/*            value: 'GiaoVien',*/}
      {/*            label: 'Gi??o vi??n',*/}
      {/*          },*/}
      {/*          {*/}
      {/*            value: 'PhuHuynh',*/}
      {/*            label: 'Ph??? huynh',*/}
      {/*          },*/}
      {/*          {*/}
      {/*            value: 'Guest',*/}
      {/*            label: 'Kh??ch',*/}
      {/*          },*/}
      {/*        ]}*/}
      {/*      />*/}
      {/*    </Form.Item>*/}
      {/*    /!* <ProFormSelect*/}
      {/*    name="modules"*/}
      {/*    label="Ch???c n??ng"*/}
      {/*    mode="multiple"*/}
      {/*    placeholder="Ch???n ch???c n??ng qu???n tr???"*/}
      {/*    options={dsChucNang?.map((item: { name: string; id: string }) => ({*/}
      {/*      value: `${item?.id}`,*/}
      {/*      label: `${item?.name}`,*/}
      {/*    }))}*/}
      {/*  /> *!/*/}
      {/*    <Form.Item name="modules" label="Ch???c n??ng">*/}
      {/*      <CayChucNang dsChucNang={dsChucNang} />*/}
      {/*    </Form.Item>*/}
      {/*    <ProFormSelect*/}
      {/*      name="organizationId"*/}
      {/*      label="Thu???c ????n v???"*/}
      {/*      placeholder="Ch???n ????n v???"*/}
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
        title={edit ? 'Ch???nh s???a' : 'Th??m m???i'}
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
              message.success('C???p nh???t th??nh c??ng');
              getVaiTroQuanTriModel();
              return true;
            }
            message.error('???? x???y ra l???i');
            return false;
          }
          try {
            const res = await addVaiTroQuanTri({ ...values });
            if (res?.data?.statusCode === 201) {
              message.success('Th??m m???i th??nh c??ng');
              setstate(state + 1);
              getVaiTroQuanTriModel();
              return true;
            }
          } catch (error) {
            message.error('???? x???y ra l???i. Vui l??ng th??? l???i!');
            return false;
          }
          return false;
          //
        }}
        submitter={{
          render: (newProps) => {
            // DefaultDom c?? th??? d??ng ho???c kh??ng

            return [
              // ...defaultDoms,
              <Button
                key="submit"
                onClick={() => {
                  newProps.submit();
                }}
                type="primary"
              >
                L??u
              </Button>,
              <Button
                key="cancel"
                onClick={() => {
                  setVisibleDrawer(false);
                }}
              >
                Quay l???i
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
          label="T??n vai tr??"
          placeholder="Nh???p t??n vai tr??"
          rules={[...rules.required]}
        />
        <ProFormTextArea name="desc" label="M?? t???" placeholder="Nh???p m?? t???" />
        <ProFormSelect
          name="systemRole"
          label="Vai tr??"
          placeholder="Ch???n vai tr?? qu???n tr???"
          rules={[...rules.required]}
          options={[
            {
              value: 'Admin',
              label: 'Admin',
            },
            {
              value: 'HieuTruong',
              label: 'Hi???u tr?????ng',
            },
            {
              value: 'ChuTruong',
              label: 'Ch??? tr?????ng',
            },
            {
              value: 'GiaoVien',
              label: 'Gi??o vi??n',
            },
            {
              value: 'PhuHuynh',
              label: 'Ph??? huynh',
            },
            {
              value: 'Guest',
              label: 'Kh??ch',
            },
          ]}
        />
        {/* <ProFormSelect
          name="modules"
          label="Ch???c n??ng"
          mode="multiple"
          placeholder="Ch???n ch???c n??ng qu???n tr???"
          options={dsChucNang?.map((item: { name: string; id: string }) => ({
            value: `${item?.id}`,
            label: `${item?.name}`,
          }))}
        /> */}
        <Form.Item name="modules" label="Ch???c n??ng">
          <CayChucNang dsChucNang={dsChucNang} />
        </Form.Item>
        {/*<ProFormSelect*/}
        {/*  name="organizationId"*/}
        {/*  label="Thu???c ????n v???"*/}
        {/*  placeholder="Ch???n ????n v???"*/}
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
