/* eslint-disable no-param-reassign */
import TableBase from '@/components/Table';
import type { ChucNangQuanTri as IChucNangQuanTri } from '@/services/ChucNangQuanTri';
import {
  addChucNangQuanTri,
  delChucNangQuanTri,
  updChucNangQuanTri,
} from '@/services/ChucNangQuanTri/chucnangquantri';
import type { IColumn } from '@/utils/interfaces';
import rules from '@/utils/rules';
import { DeleteOutlined, EditOutlined, PlusCircleFilled } from '@ant-design/icons';
import { DrawerForm, ProFormText } from '@ant-design/pro-form';
import { Button, Divider, Input, message, Popconfirm } from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
// import TableNguoiDung from './components/TableNguoiDung';

const ChucNangQuanTri = () => {
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [state, setstate] = useState<number>(0);
  const [newRecord, setNewRecord] = useState<IChucNangQuanTri.Record>();
  const { initialState } = useModel('@@initialState');
  const {
    loading: loadingChucNangQuanTri,
    getChucNangQuanTriModel,
    total,
    page,
    limit,
    cond,
  } = useModel('chucnangquantri');

  const handleEdit = (record: IChucNangQuanTri.Record) => {
    setVisibleDrawer(true);
    setEdit(true);
    setNewRecord(record);
  };

  const handleDel = async (record: IChucNangQuanTri.Record) => {
    // eslint-disable-next-line no-underscore-dangle
    const res = await delChucNangQuanTri({ id: record?._id });
    if (res?.status === 200) {
      message.success('Xóa thành công');
      getChucNangQuanTriModel();
      return true;
    }
    message.error('Đã xảy ra lỗi');
    return false;
  };

  const renderLast = (record: IChucNangQuanTri.Record) => {
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

  const columns: IColumn<IChucNangQuanTri.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      align: 'center',
      width: 150,
      search: 'search',
    },
    {
      title: 'Mã',
      dataIndex: 'key',
      align: 'center',
      width: 150,
      search: 'search',
    },
    {
      title: 'Mã chức năng cha',
      dataIndex: 'parent',
      align: 'center',
      width: 150,
    },
  ];

  if (
    initialState?.currentUser?.role?.systemRole === 'Admin' ||
    initialState?.currentUser?.role?.systemRole === 'SuperAdmin'
  )
    columns.push({
      title: 'Thao tác',
      align: 'center',
      render: (record: IChucNangQuanTri.Record) => renderLast(record),
      fixed: 'right',
      width: 100,
    });

  useEffect(() => {}, []);

  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={getChucNangQuanTriModel}
        loading={loadingChucNangQuanTri}
        dependencies={[page, limit, cond]}
        modelName="chucnangquantri"
        title="Quản trị các chức năng quản trị viên"
      >
        <Button
          style={{ marginBottom: '10px', marginRight: '10px' }}
          onClick={() => {
            setEdit(false);
            setVisibleDrawer(true);
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
      {/* <TableNguoiDung /> */}
      <DrawerForm<IChucNangQuanTri.Record>
        visible={visibleDrawer}
        onVisibleChange={setVisibleDrawer}
        title={edit ? 'Chỉnh sửa' : 'Thêm mới'}
        drawerProps={{
          forceRender: false,
          destroyOnClose: true,
        }}
        onFinish={async (values: any) => {
          if (values.parent && values.key === values.parent) {
            message.error('Mã chức năng vai trò phải khác với mã chức năng cha');
            return false;
          }
          if (edit) {
            try {
              const key = newRecord?.key;
              const res = await updChucNangQuanTri({ ...values, key });
              if (res?.data?.statusCode === 200) {
                message.success('Cập nhật thành công');
                getChucNangQuanTriModel();
                return true;
              }
            } catch (error) {
              const { response }: any = error;
              if (response?.data?.errorCode === 'NOT_FOUND_PARENT') {
                message.error('Không có mã chức năng cha tương ứng');
                return false;
              }
              message.error('Đã xảy ra lỗi');
              return false;
            }
          }
          try {
            const res = await addChucNangQuanTri({ ...values });
            if (res?.data?.statusCode === 201) {
              message.success('Thêm mới thành công');
              setstate(state + 1);
              getChucNangQuanTriModel();
              return true;
            }
          } catch (error) {
            const { response }: any = error;
            if (response?.data?.errorCode === 'NOT_FOUND_PARENT') {
              message.error('Không có mã chức năng cha tương ứng');
              return false;
            }
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
          ...(edit && newRecord),
        }}
      >
        <>
          <ProFormText name="name" label="Tên" placeholder="Nhập tên" rules={[...rules.required]} />
          {!edit && (
            <ProFormText name="key" label="Mã" placeholder="Nhập mã" rules={[...rules.required]} />
          )}
          <ProFormText name="parent" label="Mã chức năng cha" placeholder="Nhập mã chức năng cha" />
        </>

        {edit && <div style={{ width: '100%' }} />}
      </DrawerForm>
    </>
  );
};

export default ChucNangQuanTri;
