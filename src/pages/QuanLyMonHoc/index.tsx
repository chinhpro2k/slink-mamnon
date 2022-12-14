/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { ChuongTrinhDaoTao as IChuongTrinhDaoTao } from '@/services/chuongtrinhdaotao';
import type { MonHoc as IMonHoc } from '@/services/MonHoc';
import { addMonHoc, cloneMonHoc, delMonHoc, updMonHoc } from '@/services/MonHoc/monhoc';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import rules from '@/utils/rules';
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleFilled,
} from '@ant-design/icons';
import { DrawerForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Button, Divider, Form, Input, message, Modal, Popconfirm, Select } from 'antd';
import type { IColumn } from '@/utils/interfaces';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import TableClone from './components/TableClone';
import { checkAllow } from '@/components/CheckAuthority';

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const MonHoc = () => {
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [state, setstate] = useState<number>(0);
  const [newRecord, setNewRecord] = useState<IMonHoc.Record>();
  const {
    loading: loadingMonHoc,
    getMonHocModel,
    total,
    page,
    limit,
    cond,
    setCondition,
    setPage,
  } = useModel('monhoc');
  const { getMonHocCloneModel } = useModel('monhocclone');
  const [danhSachCT, setDanhSachCT] = useState([]);
  const [danhSachCTNew, setDanhSachCTNew] = useState<any>([]);
  const { initialState } = useModel('@@initialState');
  const vaiTro = localStorage.getItem('vaiTro');
  const [saoChep, setSaoChep] = useState<boolean>(false);
  const [dsDonVi, setDsDonVi] = useState<any[]>([]);
  const [donViId, setDonViId] = useState<string>();
  const [phuongPhapId, setPhuongPhapId] = useState<string>();
  const [idLop, setIdLop] = useState<string>();
  const [dsLop, setDsLop] = useState<any[]>([]);
  const [dsTruong, setDsTruong] = useState<any[]>([]);
  const organizationId = initialState?.currentUser?.role?.organizationId;

  const getChuongTrinhDaoTao = async () => {
    const result = await axios.get(`${ip3}/chuong-trinh-dao-tao/pageable?page=1&limit=20`);
    setDanhSachCT(result?.data?.data?.result);
    const arrCT: any = [];
    arrCT.push({ ten: 'T???t c??? ph????ng ph??p', _id: 'T???t c???' });
    arrCT.push(...result?.data?.data?.result);
    setDanhSachCTNew(arrCT);
  };

  const donVi = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=100`);
    const arrTruong = [];
    arrTruong.push({ tenDonVi: 'T???t c??? c??c tr?????ng', _id: 'T???t c???' });
    arrTruong.push({ tenDonVi: 'Tr?????ng chung', _id: null });
    result?.data?.data?.result?.map(
      (item: { loaiDonVi: string }) => item?.loaiDonVi === 'Truong' && arrTruong.push(item),
    );
    const arrLop: any = [];
    arrLop.push({ tenDonVi: 'T???t c??? c??c l???p', _id: 'T???t c???' });
    if (organizationId) {
      result?.data?.data?.result?.map(
        (item: { parent: string }) => item?.parent === organizationId && arrLop.push(item),
      );
    } else {
      result?.data?.data?.result?.map(
        (item: { loaiDonVi: string }) => item?.loaiDonVi === 'Lop' && arrLop.push(item),
      );
    }
    setDsTruong(arrTruong);
    setDsDonVi(result?.data?.data?.result);
    setDsLop(arrLop);
  };

  React.useEffect(() => {
    getChuongTrinhDaoTao();
    donVi();
  }, []);

  const handleView = (record: IMonHoc.Record) => {
    setVisibleModal(true);
    setNewRecord(record);
  };

  const onChange = (value: string) => {
    setCondition({ donViId: value });
    setIdLop(undefined);
    setPhuongPhapId(undefined);
    setPage(1);
    const arrLop: any[] = [];
    if (value === 'T???t c???') {
      dsDonVi?.map((item) => item?.loaiDonVi === 'Lop' && arrLop.push(item));
    }
    dsDonVi?.map((item) => item?.parent === value && arrLop.push(item));
    setDsLop(arrLop);

    const arrPhuongPhap: any = [];
    if (value === 'T???t c???') {
      arrPhuongPhap.push(...danhSachCT);
    }
    if (!value) {
      danhSachCT?.map(
        (item: { donVi: string }) => item?.donVi === null && arrPhuongPhap.push(item),
      );
    } else
      danhSachCT?.map(
        (item: { donViId: string }) => item?.donViId === value && arrPhuongPhap.push(item),
      );
    setDanhSachCTNew(arrPhuongPhap);
  };

  const onChangeLop = (value: string) => {
    setCondition({ donViId: value });
    setDonViId(value);
    setIdLop(value);
    setPage(1);
    setPhuongPhapId(undefined);
    const arrPhuongPhap: any = [];
    if (value === 'T???t c???') {
      arrPhuongPhap.push(...danhSachCT);
    }
    if (!value) {
      danhSachCT?.map(
        (item: { donVi: string }) => item?.donVi === null && arrPhuongPhap.push(item),
      );
    } else
      danhSachCT?.map(
        (item: { donViId: string }) => item?.donViId === value && arrPhuongPhap.push(item),
      );
    setDanhSachCTNew(arrPhuongPhap);
  };

  const onChangePhuongPhap = (value: string) => {
    setCondition({ chuongTrinhDaoTaoId: value, donViId });
    setPhuongPhapId(value);
    setPage(1);
  };

  const handleEdit = (record: IMonHoc.Record) => {
    setVisibleDrawer(true);
    setEdit(true);
    setNewRecord(record);
  };

  const onCell = (record: IMonHoc.Record) => ({
    onClick: () => {
      handleView(record);
    },
    style: { cursor: 'pointer' },
  });

  const handleOk = () => {
    setVisibleModal(false);
  };

  const handleDel = async (record: IMonHoc.Record) => {
    // eslint-disable-next-line no-underscore-dangle
    const res = await delMonHoc({ id: record?._id });
    if (res?.status === 200) {
      message.success('X??a th??nh c??ng');
      setCondition({ donViId, chuongTrinhDaoTaoId: phuongPhapId });
      return true;
    }
    message.error('???? x???y ra l???i');
    return false;
  };

  const handleSaoChep = async (record: IMonHoc.Record) => {
    setVisibleDrawer(true);
    setEdit(true);
    setNewRecord(record);
    setSaoChep(true);
  };

  const renderLast = (record: IMonHoc.Record) => {
    return (
      <React.Fragment>
        <Button
          type="default"
          shape="circle"
          onClick={() => {
            handleView(record);
          }}
          title="Xem chi ti???t"
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
          disabled={!checkAllow('EDIT_MON_HOC')}
          title="Ch???nh??s???a"
        >
          <EditOutlined />
        </Button>

        <Divider type="vertical" />

        <Popconfirm
          title="B???n??c????ch???c??mu???n??x??a?"
          onConfirm={() => handleDel(record)}
          okText="?????ng ??"
          disabled={!checkAllow('DEL_MON_HOC')}
        >
          <Button type="default" shape="circle" title="X??a" disabled={!checkAllow('DEL_MON_HOC')}>
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      </React.Fragment>
    );
  };

  const renderLast1 = (record: IMonHoc.Record) => {
    return (
      <React.Fragment>
        <Button
          type="default"
          shape="circle"
          onClick={() => {
            handleView(record);
          }}
          title="Xem chi ti???t"
        >
          <EyeOutlined />
        </Button>

        <Divider type="vertical" />
        <Button
          type="primary"
          shape="circle"
          onClick={() => {
            handleSaoChep(record);
          }}
          title="Sao ch??p"
          disabled={!checkAllow('CLONE_MON_HOC')}
        >
          <CopyOutlined />
        </Button>
      </React.Fragment>
    );
  };

  const columns: IColumn<IMonHoc.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'L??nh v???c ph??t tri???n',
      dataIndex: 'ten',
      align: 'center',
      width: 200,
      onCell,
      search: 'search',
      render: (val) => val ?? 'Kh??ng c??',
    },
    {
      title: 'Ph????ng ph??p gi??o d???c',
      dataIndex: 'chuongTrinhDaoTao',
      align: 'center',
      width: 250,
      render: (val) => val?.ten ?? 'Kh??ng c??',
      onCell,
    },
    {
      title: '????n v???',
      dataIndex: 'donVi',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => val?.tenDonVi ?? 'Tr?????ng chung',
    },
    {
      title: 'M?? t???',
      dataIndex: 'moTa',
      align: 'center',
      width: 250,
      onCell,
      render: (val) => (val === '' || !val ? 'Kh??ng c??' : val),
    },
  ];

  if (vaiTro !== 'GiaoVien' && vaiTro !== 'HieuTruong') {
    columns.push({
      title: 'Thao t??c',
      align: 'center',
      render: (record: IMonHoc.Record) => renderLast(record),
      fixed: 'right',
      width: 170,
    });
  } else {
    columns.push({
      title: 'Thao t??c',
      align: 'center',
      render: (record: IMonHoc.Record) => renderLast1(record),
      fixed: 'right',
      width: 120,
    });
  }

  useEffect(() => {}, []);

  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={getMonHocModel}
        loading={loadingMonHoc}
        dependencies={[page, limit, cond]}
        modelName="monhoc"
        title="Qu???n l?? l??nh v???c ph??t tri???n chung"
        scroll={{ x: 1000, y: 400 }}
      >
        {checkAllow('ADD_MON_HOC') && (
          <Button
            style={{ marginBottom: '10px', marginRight: '10px' }}
            onClick={() => {
              setEdit(false);
              setVisibleDrawer(true);
            }}
            type="primary"
          >
            <PlusCircleFilled />
            Th??m m???i
          </Button>
        )}
        {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
          <>
            <Select
              showSearch
              defaultValue="T???t c???"
              style={{ width: '15%', marginRight: '10px' }}
              placeholder="Ch???n tr?????ng"
              optionFilterProp="children"
              onChange={onChange}
              filterOption={(input, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {dsTruong?.map((item) => (
                <Select.Option key={item?._id} value={item?._id}>
                  {item?.tenDonVi}
                </Select.Option>
              ))}
            </Select>
          </>
        )}
        <Select
          showSearch
          value={idLop}
          style={{ width: '15%', marginRight: '10px' }}
          defaultValue={vaiTro !== 'SuperAdmin' && vaiTro !== 'Admin' ? 'T???t c???' : undefined}
          placeholder="Ch???n l???p"
          optionFilterProp="children"
          notFoundContent="Kh??ng c?? l???p"
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
        <Select
          showSearch
          value={phuongPhapId}
          style={{ width: '15%' }}
          placeholder="Ch???n ph????ng ph??p"
          optionFilterProp="children"
          onChange={onChangePhuongPhap}
          filterOption={(input, option: any) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {danhSachCTNew?.map((item: { _id: string; ten: string }) => (
            <Select.Option key={item?._id} value={item?._id}>
              {item?.ten}
            </Select.Option>
          ))}
        </Select>
        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          T???ng s???:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={total}
          />
        </h3>
      </TableBase>
      <br />
      {(vaiTro === 'GiaoVien' || vaiTro === 'HieuTruong') && <TableClone />}
      <DrawerForm<IMonHoc.Record>
        visible={visibleDrawer}
        onVisibleChange={setVisibleDrawer}
        title={edit ? 'Ch???nh s???a' : 'Th??m m???i'}
        drawerProps={{
          forceRender: true,
          destroyOnClose: true,
          width: '40%',
        }}
        onFinish={async (values: any) => {
          const newVal = values;
          const dataChuongTrinh: any = danhSachCT?.find(
            // eslint-disable-next-line no-underscore-dangle
            (item: { _id: string }) =>
              item?._id === (newVal?.chuongTrinhDaoTaoId || newRecord?.chuongTrinhDaoTaoId),
          );
          try {
            if (edit && saoChep) {
              newVal.donViId = initialState?.currentUser?.role?.organizationId;
              newVal.idGoc = newRecord?._id;
              const res = await cloneMonHoc({ ...newVal });
              if (res?.data?.statusCode === 201) {
                message.success('Sao ch??p l??nh v???c ph??t tri???n th??nh c??ng');
                getMonHocCloneModel();
                setCondition({ donViId, chuongTrinhDaoTaoId: phuongPhapId });
                return true;
              }
            }
          } catch (error) {
            const { response }: any = error;
            if (response?.data?.errorCode === 'NOT_ALLOW') {
              message.error('B???n kh??ng ???????c ph??p sao ch??p l??nh v???c ph??t tri???n ??? ????n v??? n??y!');
              return false;
            }
          }
          try {
            newVal.donViId = dataChuongTrinh?.donViId;
            if (edit && !saoChep) {
              const id = newRecord?._id;
              const res = await updMonHoc({ ...newVal, id });
              if (res?.data?.statusCode === 200) {
                message.success('C???p nh???t th??nh c??ng');
                setCondition({ donViId, chuongTrinhDaoTaoId: phuongPhapId });
                return true;
              }
              message.error('???? x???y ra l???i');
              return false;
            }
          } catch (error) {
            const { response }: any = error;
            if (response?.data?.errorCode === 'NOT_ALLOW') {
              message.error('B???n kh??ng ???????c ph??p c???p nh???t l??nh v???c ph??t tri???n ??? ????n v??? n??y!');
              return false;
            }
          }
          try {
            newVal.donViId = dataChuongTrinh?.donViId;
            const res = await addMonHoc({ ...newVal });
            if (res?.data?.statusCode === 201) {
              message.success('Th??m m???i th??nh c??ng');
              setstate(state + 1);
              setCondition({ donViId, chuongTrinhDaoTaoId: phuongPhapId });
              return true;
            }
          } catch (error) {
            const { response }: any = error;
            if (response?.data?.errorCode === 'NOT_ALLOW') {
              message.error('B???n kh??ng ???????c ph??p th??m l??nh v???c ph??t tri???n ??? ????n v??? n??y!');
              return false;
            }
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
                {saoChep ? 'Sao ch??p' : 'L??u'}
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
          ...(edit && newRecord),
        }}
      >
        <ProFormText
          name="ten"
          width="lg"
          label="T??n l??nh v???c"
          placeholder="Nh???p t??n l??nh v???c"
          rules={[...rules.required]}
        />
        <ProFormSelect
          name="chuongTrinhDaoTaoId"
          width="lg"
          label="Ph????ng ph??p gi??o d???c"
          placeholder="Ch???n ph????ng ph??p gi??o d???c"
          rules={[...rules.required]}
          options={danhSachCT?.map((item: IChuongTrinhDaoTao.Record) => ({
            // eslint-disable-next-line no-underscore-dangle
            value: `${item?._id}`,
            label: `${item?.ten} ${
              item?.donVi?.tenDonVi ? `- Thu???c ${item?.donVi?.tenDonVi}` : '- Thu???c tr?????ng chung'
            }`,
          }))}
        />
        <ProFormTextArea name="moTa" width="lg" label="M?? t???" placeholder="Nh???p m?? t???" />

        {edit && <div style={{ width: '100%' }} />}
      </DrawerForm>
      <Modal
        title="Chi ti???t l??nh v???c"
        visible={visibleModal}
        onCancel={handleOk}
        footer={<Button onClick={handleOk}>OK</Button>}
      >
        <Form labelAlign="left" {...formItemLayout}>
          <Form.Item label="L??nh v???c ph??t tri???n" style={{ marginBottom: 0 }} required>
            <Input value={newRecord?.ten} disabled />
          </Form.Item>
          <Form.Item label="M?? l??nh v???c" style={{ marginBottom: 0 }} required>
            <Input value={newRecord?._id} disabled />
          </Form.Item>
          <Form.Item label="Ph????ng ph??p gi??o d???c" style={{ marginBottom: 0 }} required>
            <Select
              disabled
              value={
                `${newRecord?.chuongTrinhDaoTao?.ten ?? 'Kh??ng c??'} ${
                  newRecord?.donVi?.tenDonVi
                    ? `- Thu???c ${newRecord?.donVi?.tenDonVi}`
                    : `- Thu???c tr?????ng chung`
                }` ?? 'Kh??ng c??'
              }
            />
          </Form.Item>
          <Form.Item label="M?? t???" style={{ marginBottom: 0 }}>
            <Input.TextArea
              value={newRecord?.moTa === '' || !newRecord?.moTa ? 'Kh??ng c??' : newRecord?.moTa}
              disabled
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default MonHoc;
