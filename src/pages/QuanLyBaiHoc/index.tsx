/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { BaiHoc as IBaiHoc } from '@/services/BaiHoc';
import { addBaiHoc, delBaiHoc, importBaiHoc, updBaiHoc } from '@/services/BaiHoc/baihoc';
import { uploadMulti } from '@/services/UploadMulti/uploadMulti';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import rules from '@/utils/rules';
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  EyeOutlined,
  PlusCircleFilled,
} from '@ant-design/icons';
import {
  Button,
  Col,
  Divider,
  Drawer,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Spin,
} from 'antd';
import type { IColumn } from '@/utils/interfaces';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import UploadMulti from '../../components/Upload/UploadMultiFile';
import TableClone from './components/TableClone';
import UploadFile from '@/components/Upload/UploadFile';
import { checkAllow } from '@/components/CheckAuthority';

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const BaiHoc = () => {
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [visibleModalAdd, setVisibleModalAdd] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [newRecord, setNewRecord] = useState<IBaiHoc.Record>();
  const {
    loading: loadingBaiHoc,
    getBaiHocModel,
    total,
    page,
    limit,
    cond,
    setCondition,
    setPage,
  } = useModel('baihoc');
  const { getBaiHocCloneModel } = useModel('baihocclone');
  const [danhSachMon, setDanhSachMon] = useState([]);
  const { initialState } = useModel('@@initialState');
  const vaiTro = localStorage.getItem('vaiTro');
  const [saoChep, setSaoChep] = useState<boolean>(false);
  const [dsDonVi, setDsDonVi] = useState<any[]>([]);
  const [donViId, setDonViId] = useState<string>();
  const [phuongPhapId, setPhuongPhapId] = useState<string>();
  const [linhVucId, setLinhVucId] = useState<string>();
  const [idLV, setIdLinhVuc] = useState<string>();
  const [danhSachCTNew, setDanhSachCTNew] = useState<any>([]);
  const [danhSachLVNew, setDanhSachLVNew] = useState<any>([]);
  const [tenPhuongPhap, setTenPhuongPhap] = useState<string>();
  const [danhSachCT, setDanhSachCT] = useState([]);
  const [idLop, setIdLop] = useState<string>();
  const [dsLop, setDsLop] = useState<any[]>([]);
  const [dsTruong, setDsTruong] = useState<any[]>([]);
  const [dsTruongImport, setDsTruongImport] = useState<any[]>([]);
  const [valueTuoi, setValueTuoi] = useState<string>();
  const organizationId = initialState?.currentUser?.role?.organizationId;

  const getMonHoc = async () => {
    const result = await axios.get(`${ip3}/mon-hoc/pageable?page=1&limit=100`);
    setDanhSachMon(result?.data?.data?.result);
  };

  const getChuongTrinhDaoTao = async () => {
    const result = await axios.get(`${ip3}/chuong-trinh-dao-tao/pageable?page=1&limit=100`);
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
    const arrTruongImport: any = [];
    arrTruongImport.push({ tenDonVi: 'Tr?????ng chung', _id: 'Tr?????ng chung' });
    result?.data?.data?.result?.map(
      (item: { loaiDonVi: string }) => item?.loaiDonVi === 'Truong' && arrTruongImport.push(item),
    );
    setDsTruongImport(arrTruongImport);
    setDsTruong(arrTruong);
    setDsDonVi(result?.data?.data?.result);
    setDsLop(arrLop);
  };

  React.useEffect(() => {
    getMonHoc();
    donVi();
    getChuongTrinhDaoTao();
    console.log(vaiTro);
  }, []);

  const handleView = (record: IBaiHoc.Record) => {
    setVisibleModal(true);
    setNewRecord(record);
  };

  const handleEdit = (record: IBaiHoc.Record) => {
    setVisibleDrawer(true);
    setEdit(true);
    setNewRecord(record);
    setTenPhuongPhap(record?.chuongTrinhDaoTao?.ten);
  };

  const onChange = (value: string) => {
    setCondition({ donViId: value, doTuoi: valueTuoi });
    setDonViId(value);
    setIdLop(undefined);
    setPhuongPhapId(undefined);
    setLinhVucId(undefined);
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
    setDanhSachLVNew(undefined);
  };

  const onCell = (record: IBaiHoc.Record) => ({
    onClick: () => {
      handleView(record);
    },
    style: { cursor: 'pointer' },
  });

  const handleOk = () => {
    setVisibleModal(false);
  };

  const onChangeLop = (value: string) => {
    setCondition({ donViId: value, doTuoi: valueTuoi });
    setDonViId(value);
    setIdLop(value);
    setPhuongPhapId(undefined);
    setLinhVucId(undefined);
    setPage(1);
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
    setDanhSachLVNew(undefined);
  };

  const onChangePhuongPhap = (value: string) => {
    setPhuongPhapId(value);
    setLinhVucId(undefined);
    setCondition({ chuongTrinhDaoTaoId: value, donViId, monHocId: linhVucId, doTuoi: valueTuoi });
    setPage(1);
    const arrLinhVuc: any = [];
    if (value === 'T???t c???') {
      arrLinhVuc?.push(...danhSachMon);
    }
    if (!value) {
      danhSachMon?.map((item: { donVi: string }) => item?.donVi === null && arrLinhVuc.push(item));
    } else
      danhSachMon?.map(
        (item: { chuongTrinhDaoTaoId: string }) =>
          item?.chuongTrinhDaoTaoId === value && arrLinhVuc.push(item),
      );
    setDanhSachLVNew(arrLinhVuc);
  };

  const onChangeLinhVuc = (value: string) => {
    setCondition({
      chuongTrinhDaoTaoId: phuongPhapId,
      donViId,
      ...(value !== undefined && { monHocId: value }),
      doTuoi: valueTuoi,
    });
    setPage(1);
    setLinhVucId(value);
  };

  const onChangeDoTuoi = (val: string) => {
    setValueTuoi(val);
    setCondition({ chuongTrinhDaoTaoId: phuongPhapId, donViId, monHocId: linhVucId, doTuoi: val });
    setPage(1);
  };

  const changeIdLinhVuc = (value: string) => {
    setIdLinhVuc(value);
    const tenMonHoc: any = danhSachMon?.find((item: { _id: string }) => item?._id === value);
    setTenPhuongPhap(tenMonHoc?.chuongTrinhDaoTao?.ten);
  };

  const handleDel = async (record: IBaiHoc.Record) => {
    const res = await delBaiHoc({ id: record?._id });
    if (res?.status === 200) {
      message.success('X??a th??nh c??ng');
      setCondition({
        donViId,
        chuongTrinhDaoTaoId: phuongPhapId,
        monHocId: linhVucId,
        doTuoi: valueTuoi,
      });
      return true;
    }
    message.error('???? x???y ra l???i');
    return false;
  };

  const arrHoSo: {
    fileList: { name: string; url: string; status: string; size: number; type: string }[];
  } = {
    fileList:
      newRecord?.taiLieu?.map((item, index) => {
        return {
          name: `T??i li???u ${index + 1}`,
          url: item,
          status: 'done',
          size: 123,
          type: 'img/png',
        };
      }) ?? [],
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    const newVal = values;
    const tenMonHoc: any = danhSachMon?.find(
      (item: { _id: string }) => item?._id === newVal.monHocId,
    );
    newVal.tenMonHoc = tenMonHoc?.ten;
    newVal.chuongTrinhDaoTaoId = tenMonHoc?.chuongTrinhDaoTaoId;
    newVal.donViId = tenMonHoc?.donViId;
    // X??? l?? t???i document l??n
    if (newVal.taiLieu && !newVal.taiLieu?.fileList) {
      newVal.taiLieu = Object.values(newVal.taiLieu);
    }
    const file: any[] = [];
    const fileUrl: string[] = [];
    if (newVal.taiLieu?.length > 0) {
      newVal.taiLieu?.forEach((item: { originFileObj?: any; url?: string }) => {
        if (item.originFileObj) file.push(item?.originFileObj);
        else fileUrl.push(item?.url ?? '');
      });
      const result = await uploadMulti(file);
      newVal.taiLieu = [
        ...fileUrl,
        ...(result.data?.data?.map((item: { url: string }) => {
          return item?.url;
        }) ?? []),
      ];
    } else if (newVal.taiLieu?.fileList?.length > 0) {
      const tailieu: string[] = [];
      newVal.taiLieu?.fileList?.map((item: { url: string }) => tailieu.push(item?.url));
      newVal.taiLieu = tailieu;
    } else {
      newVal.taiLieu = [];
    }

    // S???a
    if (edit && !saoChep) {
      try {
        const id = newRecord?._id;
        const res = await updBaiHoc({ ...newVal, id });
        if (res?.data?.statusCode === 200) {
          message.success('C???p nh???t th??nh c??ng');
          setCondition({
            donViId,
            chuongTrinhDaoTaoId: phuongPhapId,
            monHocId: linhVucId,
            doTuoi: valueTuoi,
          });
          setLoading(false);
          setVisibleDrawer(false);
          setIdLinhVuc(undefined);
          return true;
        }
      } catch (error) {
        const { response }: any = error;
        if (response?.data?.errorCode === 'NOT_ALLOW') {
          message.error('B???n kh??ng ???????c ph??p c???p nh???t b??i h???c ??? ????n v??? n??y!');
          return false;
        }
      }
    }

    // Sao ch??p
    if (edit && saoChep) {
      try {
        newVal.donViId = initialState?.currentUser?.role?.organizationId;
        newVal.idGoc = newRecord?._id;
        const res = await addBaiHoc({ ...newVal });
        if (res?.data?.statusCode === 201) {
          message.success('Sao ch??p b??i h???c th??nh c??ng');
          getBaiHocCloneModel();
          setCondition({
            donViId,
            chuongTrinhDaoTaoId: phuongPhapId,
            monHocId: linhVucId,
            doTuoi: valueTuoi,
          });
          setVisibleDrawer(false);
          setIdLinhVuc(undefined);
          return true;
        }
      } catch (error) {
        const { response }: any = error;
        if (response?.data?.errorCode === 'NOT_ALLOW') {
          message.error('B???n kh??ng ???????c ph??p th??m b??i h???c ??? ????n v??? n??y!');
          return false;
        }
      }
    }

    // Th??m m???i
    const res = await addBaiHoc({ ...newVal });
    if (res?.data?.statusCode === 201) {
      message.success('Th??m m???i th??nh c??ng');
      setCondition({
        donViId,
        chuongTrinhDaoTaoId: phuongPhapId,
        monHocId: linhVucId,
        doTuoi: valueTuoi,
      });
      setVisibleDrawer(false);
      setLoading(false);
      setIdLinhVuc(undefined);
      return true;
    }
    message.error('???? x???y ra l???i');
    setLoading(false);
    return false;
  };

  const onSubmitImport = async (values: any) => {
    setLoading(true);
    try {
      const result = await importBaiHoc({ ...values });
      if (result?.data?.statusCode === 201) {
        message.success('Import b??i h???c th??nh c??ng');
        setCondition({
          donViId,
          chuongTrinhDaoTaoId: phuongPhapId,
          monHocId: linhVucId,
          doTuoi: valueTuoi,
        });
        setVisibleModalAdd(false);
        setLoading(false);
        return true;
      }
    } catch (error) {
      const { response }: any = error;
      if (response?.data?.errorCode === 'INVALID_FORMAT') {
        message.error('Data import kh??ng ????ng ?????nh d???ng. Vui l??ng th??? l???i sau');
        setLoading(false);
        return false;
      }
    }
    return true;
  };

  const handleSaoChep = async (record: IBaiHoc.Record) => {
    setVisibleDrawer(true);
    setEdit(true);
    setNewRecord(record);
    setSaoChep(true);
    setTenPhuongPhap(record?.chuongTrinhDaoTao?.ten);
  };

  const renderLast = (record: IBaiHoc.Record) => {
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
          title="Ch???nh??s???a"
          disabled={!checkAllow('EDIT_BAI_HOC')}
        >
          <EditOutlined />
        </Button>

        <Divider type="vertical" />

        <Popconfirm
          title="B???n??c????ch???c??mu???n??x??a?"
          onConfirm={() => handleDel(record)}
          okText="?????ng ??"
          disabled={!checkAllow('DEL_BAI_HOC')}
        >
          <Button type="default" shape="circle" title="X??a" disabled={!checkAllow('DEL_BAI_HOC')}>
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      </React.Fragment>
    );
  };

  const renderLast1 = (record: IBaiHoc.Record) => {
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
          // disabled={!checkAllow('CLONE_BAI_HOC')}
        >
          <CopyOutlined />
        </Button>
      </React.Fragment>
    );
  };

  const columns: IColumn<IBaiHoc.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'T??n b??i h???c',
      dataIndex: 'tenBaiHoc',
      align: 'center',
      width: 200,
      onCell,
      search: 'search',
    },
    {
      title: '????? tu???i',
      dataIndex: 'doTuoi',
      align: 'center',
      width: 150,
      onCell,
    },
    {
      title: 'L??nh v???c ph??t tri???n',
      dataIndex: 'monHoc',
      align: 'center',
      width: 250,
      onCell,
      render: (val) => val?.ten ?? 'Kh??ng c??',
    },
    {
      title: 'Ph????ng ph??p gi??o d???c',
      dataIndex: 'chuongTrinhDaoTao',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => val?.ten ?? 'Kh??ng c??',
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
      render: (record: IBaiHoc.Record) => renderLast(record),
      fixed: 'right',
      width: 170,
    });
  } else {
    columns.push({
      title: 'Thao t??c',
      align: 'center',
      render: (record: IBaiHoc.Record) => renderLast1(record),
      fixed: 'right',
      width: 130,
    });
  }

  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={getBaiHocModel}
        loading={loadingBaiHoc}
        dependencies={[page, limit, cond]}
        modelName="baihoc"
        title="Qu???n l?? b??i h???c chung"
        scroll={{ x: 1000, y: 500 }}
      >
        <Row>
          {checkAllow('ADD_BAI_HOC') && (
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
          {checkAllow('IMPORT_BAI_HOC') && (
            <Button
              style={{ marginBottom: '10px' }}
              onClick={() => {
                setVisibleModalAdd(true);
              }}
              type="primary"
            >
              <ExportOutlined />
              Import b??i h???c
            </Button>
          )}
        </Row>
        {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
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
        <Select
          showSearch
          allowClear
          value={linhVucId}
          style={{ width: '15%', marginLeft: '10px' }}
          placeholder="Ch???n l??nh v???c"
          optionFilterProp="children"
          onChange={onChangeLinhVuc}
          filterOption={(input, option: any) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {danhSachMon?.map((item: { _id: string; ten: string }) => (
            <Select.Option key={item?._id} value={item?._id}>
              {item?.ten}
            </Select.Option>
          ))}
        </Select>
        <Select
          defaultValue="T???t c???"
          showSearch
          style={{ width: '15%', marginLeft: '10px' }}
          placeholder="Ch???n ????? tu???i"
          optionFilterProp="children"
          onChange={onChangeDoTuoi}
          filterOption={(input, option: any) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          <Select.Option value="T???t c???">T???t c??? ????? tu???i</Select.Option>
          <Select.Option value="18-24 th??ng">18-24 th??ng</Select.Option>
          <Select.Option value="24-36 th??ng">24-36 th??ng</Select.Option>
          <Select.Option value="36-48 th??ng">36-48 th??ng</Select.Option>
          <Select.Option value="48-60 th??ng">48-60 th??ng</Select.Option>
          <Select.Option value="60-72 th??ng">60-72 th??ng</Select.Option>
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
      <Drawer
        visible={visibleDrawer}
        title={edit ? 'Ch???nh s???a' : 'Th??m m???i'}
        onClose={() => {
          setVisibleDrawer(false);
          setIdLinhVuc(undefined);
        }}
        destroyOnClose
        width="50%"
      >
        <Form onFinish={onFinish} {...formItemLayout}>
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item
                name="tenBaiHoc"
                label="T??n b??i h???c"
                rules={[...rules.required]}
                style={{ marginBottom: 0 }}
                initialValue={edit ? newRecord?.tenBaiHoc : undefined}
              >
                <Input placeholder="Nh???p t??n b??i h???c" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="doTuoi"
                label="????? tu???i"
                rules={[...rules.required]}
                style={{ marginBottom: 0 }}
                initialValue={edit ? newRecord?.doTuoi : undefined}
              >
                <Select placeholder="Ch???n ????? tu???i">
                  <Select.Option value="18-24 th??ng">18-24 th??ng</Select.Option>
                  <Select.Option value="24-36 th??ng">24-36 th??ng</Select.Option>
                  <Select.Option value="36-48 th??ng">36-48 th??ng</Select.Option>
                  <Select.Option value="48-60 th??ng">48-60 th??ng</Select.Option>
                  <Select.Option value="60-72 th??ng">60-72 th??ng</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item
                name="monHocId"
                label="L??nh v???c ph??t tri???n"
                rules={[...rules.required]}
                style={{ marginBottom: 0 }}
                initialValue={edit ? newRecord?.monHocId : undefined}
              >
                <Select
                  value={idLV}
                  placeholder="Ch???n l??nh v???c ph??t tri???n"
                  onChange={changeIdLinhVuc}
                  showSearch
                  filterOption={(input, option: any) =>
                    option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  optionFilterProp="children"
                >
                  {danhSachMon?.map(
                    (item: { _id: string; ten: string; donVi: { tenDonVi: string } }) => (
                      <Select.Option key={item?._id} value={item?._id}>
                        {item?.ten}{' '}
                        {item?.donVi?.tenDonVi
                          ? `- Thu???c ${item?.donVi?.tenDonVi}`
                          : '- Thu???c tr?????ng chung'}
                      </Select.Option>
                    ),
                  )}
                </Select>
              </Form.Item>
            </Col>
            {(idLV || (edit && newRecord?.monHocId)) && (
              <Col span={12}>
                <Form.Item
                  label="Ph????ng ph??p gi??o d???c"
                  rules={[...rules.required]}
                  style={{ marginBottom: 0 }}
                >
                  <Select
                    placeholder="Ch???n ph????ng ph??p gi??o d???c"
                    value={tenPhuongPhap ?? 'Kh??ng c??'}
                    disabled
                  />
                </Form.Item>
              </Col>
            )}
          </Row>

          <Form.Item
            name="taiLieu"
            label="T??i li???u"
            style={{ marginBottom: 5 }}
            initialValue={
              // eslint-disable-next-line no-nested-ternary
              edit
                ? newRecord?.taiLieu?.[0] !== '' || newRecord?.taiLieu?.[0]
                  ? arrHoSo
                  : undefined
                : undefined
            }
          >
            <UploadMulti
              otherProps={{
                multiple: true,
                accept: '.pdf, .doc,.docx',
              }}
            />
          </Form.Item>
          <Form.Item
            name="moTa"
            label="M?? t???"
            style={{ marginBottom: 0 }}
            initialValue={edit ? newRecord?.moTa : undefined}
          >
            <Input.TextArea rows={3} placeholder="Nh???p m?? t???" />
          </Form.Item>
          <Form.Item
            name="chiTiet"
            label="Chi ti???t b??i h???c"
            style={{ marginBottom: 0 }}
            initialValue={edit ? newRecord?.chiTiet : undefined}
          >
            <Input.TextArea rows={3} placeholder="Nh???p chi ti???t b??i h???c" />
          </Form.Item>
          <Divider />
          <Form.Item>
            <div>
              <Spin spinning={loading}>
                <Button htmlType="submit" type="primary" style={{ marginRight: '10px' }}>
                  {saoChep ? 'Sao ch??p' : 'L??u'}
                </Button>
                <Button
                  onClick={() => {
                    setVisibleDrawer(false);
                    setIdLinhVuc(undefined);
                  }}
                >
                  Quay l???i
                </Button>
              </Spin>
            </div>
          </Form.Item>
        </Form>

        {edit && <div style={{ width: '100%' }} />}
      </Drawer>
      <Modal
        title="Import file b??i h???c"
        visible={visibleModalAdd}
        onCancel={() => {
          setVisibleModalAdd(false);
        }}
        footer={[]}
        destroyOnClose
      >
        <Spin spinning={loading} tip="??ang t???i l??n...">
          <Form onFinish={onSubmitImport} {...formItemLayout}>
            {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
              <Row>
                <Col span={24}>
                  <Form.Item name="donViId" label="Tr?????ng" rules={[...rules.required]}>
                    <Select
                      placeholder="Ch???n tr?????ng"
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option: any) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {dsTruongImport?.map(
                        (item: { _id: string; tenDonVi: string }, index: number) => (
                          <Select.Option key={index} value={item?._id}>
                            {item?.tenDonVi}
                          </Select.Option>
                        ),
                      )}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            )}
            <Form.Item name="file">
              <UploadFile />
            </Form.Item>
            <Row justify="center">
              <Form.Item style={{ marginBottom: 0 }}>
                <Button type="primary" htmlType="submit">
                  T???i l??n
                </Button>
              </Form.Item>
            </Row>
          </Form>
        </Spin>
      </Modal>
      <Modal
        title="Chi ti???t b??i h???c"
        visible={visibleModal}
        onCancel={handleOk}
        footer={<Button onClick={handleOk}>OK</Button>}
      >
        <Form labelAlign="left" {...formItemLayout}>
          <Row gutter={[16, 0]}>
            <Col lg={12} xs={24}>
              <Form.Item label="T??n b??i h???c" style={{ marginBottom: 0 }} required>
                <Input value={newRecord?.tenBaiHoc} disabled />
              </Form.Item>
            </Col>
            <Col lg={12} xs={24}>
              <Form.Item label="????? tu???i" style={{ marginBottom: 0 }} required>
                <Input value={newRecord?.doTuoi} disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 0]}>
            <Col lg={12} xs={24}>
              <Form.Item label="Ph????ng ph??p gi??o d???c" style={{ marginBottom: 0 }} required>
                <Select disabled value={newRecord?.chuongTrinhDaoTao?.ten ?? 'Kh??ng c??'} />
              </Form.Item>
            </Col>
            <Col lg={12} xs={24}>
              <Form.Item label="L??nh v???c ph??t tri???n" style={{ marginBottom: 0 }} required>
                <Select disabled value={newRecord?.monHoc?.ten ?? 'Kh??ng c??'} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="M?? t???" style={{ marginBottom: 0 }}>
            <Input.TextArea value={newRecord?.moTa ?? 'Kh??ng c??'} disabled />
          </Form.Item>
          <Form.Item label="Chi ti???t b??i h???c" style={{ marginBottom: 5 }}>
            <Input.TextArea value={newRecord?.chiTiet ?? 'Kh??ng c??'} disabled />
          </Form.Item>
          {newRecord?.taiLieu?.[0] !== '' && newRecord?.taiLieu?.[0] && (
            <Form.Item label="T??i li???u">
              {newRecord?.taiLieu?.map((item, index) => (
                <div key={index}>
                  {index + 1}.{' '}
                  <a href={item} target="_blank" rel="noreferrer">
                    T??i li???u {index + 1}
                  </a>
                </div>
              ))}
            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default BaiHoc;
