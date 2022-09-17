/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { ChuongTrinhDaoTao as IChuongTrinhDaoTao } from '@/services/chuongtrinhdaotao';
import {
  addChuongTrinhDaoTao,
  delChuongTrinhDaoTao,
  updChuongTrinhDaoTao,
} from '@/services/chuongtrinhdaotao/chuongtrinhdaotao';
import type { IColumn } from '@/utils/interfaces';
import rules from '@/utils/rules';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleFilled } from '@ant-design/icons';
import { DrawerForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Button, Divider, Form, Input, message, Modal, Popconfirm, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import { checkAllow } from '@/components/CheckAuthority';

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const ChuongTrinhDaoTao = () => {
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [state, setstate] = useState<number>(0);
  const [newRecord, setNewRecord] = useState<IChuongTrinhDaoTao.Record>();
  const {
    loading,
    getChuongTrinhDaoTaoCloneModel,
    total,
    page,
    limit,
    cond,
    setCondition,
    setPage,
  } = useModel('chuongtrinhdaotaoclone');
  const { getChuongTrinhDaoTaoModel } = useModel('chuongtrinhdaotao');
  const { initialState } = useModel('@@initialState');
  const [dsLop, setDsLop] = useState<any[]>([]);
  const [idLop, setIdLop] = useState<string>();
  const vaiTro = localStorage.getItem('vaiTro');

  const donVi = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable/my/child?page=1&limit=100`, {
      params: { cond: { loaiDonVi: 'Lop' } },
    });
    const arrLop: any = [];
    if (vaiTro !== 'SuperAdmin' && vaiTro !== 'Admin') {
      arrLop.push({ tenDonVi: 'Tất cả các lớp', _id: 'Tất cả' });
    }
    result?.data?.data?.result?.map(
      (item: { parent: string }) =>
        item?.parent === initialState?.currentUser?.role?.organizationId && arrLop.push(item),
    );
    setDsLop(arrLop);
  };

  React.useEffect(() => {
    donVi();
  }, []);

  const handleView = (record: IChuongTrinhDaoTao.Record) => {
    setNewRecord(record);
    setVisibleModal(true);
  };

  const handleEdit = (record: IChuongTrinhDaoTao.Record) => {
    setVisibleDrawer(true);
    setEdit(true);
    setNewRecord(record);
  };

  const onCell = (record: IChuongTrinhDaoTao.Record) => ({
    onClick: () => {
      handleView(record);
    },
    style: { cursor: 'pointer' },
  });

  const handleOk = () => {
    setVisibleModal(false);
  };

  const handleDel = async (_id: string) => {
    const res = await delChuongTrinhDaoTao({ id: _id });
    if (res?.status === 200) {
      message.success('Xóa thành công');
      setstate(state - 1);
      setCondition({ donViId: idLop });
      getChuongTrinhDaoTaoModel();
      return true;
    }
    message.error('Đã xảy ra lỗi');
    return false;
  };

  const onChangeLop = (value: string) => {
    setCondition({ donViId: value });
    setIdLop(value);
    setPage(1);
  };

  const renderLast = (record: IChuongTrinhDaoTao.Record) => {
    return (
      <React.Fragment>
        <Button
          type="default"
          shape="circle"
          onClick={() => {
            handleView(record);
          }}
          title="Xem chi tiết"
        >
          <EyeOutlined />
        </Button>

        <Divider type="vertical" />

        <Button
          type="primary"
          shape="circle"
          onClick={() => {
            handleEdit(record);
          }}
          title="Chỉnh sửa"
          disabled={!checkAllow('EDIT_PPGD_RIENG')}
        >
          <EditOutlined />
        </Button>

        <Divider type="vertical" />

        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDel(record?._id)}
          okText="Đồng ý"
          disabled={!checkAllow('DEL_PPGD_RIENG')}
        >
          <Button
            type="default"
            shape="circle"
            title="Xóa"
            disabled={!checkAllow('DEL_PPGD_RIENG')}
          >
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      </React.Fragment>
    );
  };

  const columns: IColumn<IChuongTrinhDaoTao.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'Phương pháp giáo dục',
      dataIndex: 'ten',
      align: 'center',
      width: 200,
      onCell,
      search: 'search',
    },
    {
      title: 'Đơn vị',
      dataIndex: 'donVi',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => val?.tenDonVi ?? 'Trường chung',
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      align: 'center',
      width: 250,
      onCell,
      render: (val) => (val === '' || !val ? 'Không có' : val),
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: IChuongTrinhDaoTao.Record) => renderLast(record),
      fixed: 'right',
      width: 150,
    },
  ];

  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={getChuongTrinhDaoTaoCloneModel}
        loading={loading}
        dependencies={[page, limit, cond]}
        modelName="chuongtrinhdaotaoclone"
        title="Quản lý phương pháp giáo dục riêng"
        scroll={{ x: 1000, y: 400 }}
      >
        {checkAllow('ADD_PPGD_RIENG') && (
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
        )}
        <Select
          showSearch
          value={idLop}
          style={{ width: '15%' }}
          defaultValue={vaiTro !== 'SuperAdmin' && vaiTro !== 'Admin' ? 'Tất cả' : undefined}
          placeholder="Chọn lớp"
          optionFilterProp="children"
          notFoundContent="Không có lớp"
          onChange={onChangeLop}
          filterOption={(input, option: any) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {dsLop?.map((item) => (
            <Select.Option key={item?._id} value={item?._id}>
              {item?.tenDonVi}
            </Select.Option>
          ))}
        </Select>
        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          Tổng số:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={total}
          />
        </h3>
      </TableBase>
      <DrawerForm<IChuongTrinhDaoTao.Record>
        visible={visibleDrawer}
        onVisibleChange={setVisibleDrawer}
        title={edit ? 'Chỉnh sửa' : 'Thêm mới'}
        drawerProps={{
          forceRender: false,
          destroyOnClose: true,
          width: '40%',
        }}
        onFinish={async (values: any) => {
          const newVal = values;
          newVal.donViId = initialState?.currentUser?.role?.organizationId;
          if (edit) {
            // eslint-disable-next-line no-underscore-dangle
            const id = newRecord?._id;
            const res = await updChuongTrinhDaoTao({ ...newVal, id });
            if (res?.data?.statusCode === 200) {
              message.success('Cập nhật thành công');
              setCondition({ donViId: idLop });
              getChuongTrinhDaoTaoModel();
              return true;
            }
            message.error('Đã xảy ra lỗi');
            return false;
          }
          try {
            const res = await addChuongTrinhDaoTao({ ...newVal });
            if (res?.data?.statusCode === 201) {
              message.success('Thêm mới thành công');
              setstate(state + 1);
              setCondition({ donViId: idLop });
              getChuongTrinhDaoTaoModel();
              return true;
            }
          } catch (error) {
            const { response }: any = error;
            if (response?.data?.errorCode === 'NOT_ALLOW') {
              message.error('Bạn không được phép thêm phương pháp giáo dục ở đơn vị này!');
              return false;
            }
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
        <ProFormText
          name="ten"
          width="lg"
          label="Tên phương pháp giáo dục"
          placeholder="Nhập tên phương pháp"
          rules={[...rules.required]}
        />
        <ProFormTextArea name="moTa" width="lg" label="Mô tả" placeholder="Nhập mô tả" />

        {edit && <div style={{ width: '100%' }} />}
      </DrawerForm>
      <Modal
        title="Chi tiết phương pháp giáo dục"
        visible={visibleModal}
        onCancel={handleOk}
        footer={<Button onClick={handleOk}>OK</Button>}
      >
        <Form labelAlign="left" {...formItemLayout}>
          <Form.Item label="Tên phương pháp giáo dục" style={{ marginBottom: 0 }} required>
            <Input value={newRecord?.ten} disabled />
          </Form.Item>
          <Form.Item label="Mã phương pháp giáo dục" style={{ marginBottom: 0 }} required>
            <Input value={newRecord?._id} disabled />
          </Form.Item>
          <Form.Item label="Mô tả" style={{ marginBottom: 0 }}>
            <Input.TextArea
              value={newRecord?.moTa === '' || !newRecord?.moTa ? 'Không có' : newRecord?.moTa}
              disabled
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ChuongTrinhDaoTao;
