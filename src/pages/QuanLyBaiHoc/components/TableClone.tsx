/* eslint-disable no-underscore-dangle */
import { checkAllow } from '@/components/CheckAuthority';
import TableBase from '@/components/Table';
import UploadMulti from '@/components/Upload/UploadMultiFile';
import type { BaiHoc as IBaiHoc } from '@/services/BaiHoc';
import { addBaiHoc, delBaiHoc, updBaiHoc } from '@/services/BaiHoc/baihoc';
import { uploadMulti } from '@/services/UploadMulti/uploadMulti';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import rules from '@/utils/rules';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleFilled } from '@ant-design/icons';
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
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const BaiHoc = () => {
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [newRecord, setNewRecord] = useState<IBaiHoc.Record>();
  const [danhSachCTNew, setDanhSachCTNew] = useState([]);
  const [danhSachLVNew, setDanhSachLVNew] = useState<any>([]);
  const [phuongPhapId, setPhuongPhapId] = useState<string>();
  const [linhVucId, setLinhVucId] = useState<string>();
  const [donViId, setDonViId] = useState<string>();
  const [dsLop, setDsLop] = useState<any[]>([]);
  const [danhSachCT, setDanhSachCT] = useState([]);
  const {
    loading: loadingBaiHoc,
    getBaiHocCloneModel,
    total,
    page,
    limit,
    cond,
    setCondition,
    setPage,
  } = useModel('baihocclone');
  const { getBaiHocModel } = useModel('baihoc');
  const [danhSachMon, setDanhSachMon] = useState([]);
  const [tenPhuongPhap, setTenPhuongPhap] = useState<string>();
  const [idLV, setIdLinhVuc] = useState<string>();
  const [valueTuoi, setValueTuoi] = useState<string>();
  const vaiTro = localStorage.getItem('vaiTro');
  const { initialState } = useModel('@@initialState');

  const getMonHoc = async () => {
    const result = await axios.get(`${ip3}/mon-hoc/pageable?page=1&limit=20`);
    setDanhSachMon(result?.data?.data?.result);
    // const arrMonHoc: any = [];
    // arrMonHoc.push(...result?.data?.data?.result);
    // setDanhSachLVNew(arrMonHoc);
  };

  const getChuongTrinhDaoTao = async () => {
    const result = await axios.get(`${ip3}/chuong-trinh-dao-tao/pageable?page=1&limit=100`);
    setDanhSachCT(result?.data?.data?.result);
    if (vaiTro !== 'SuperAdmin' && vaiTro !== 'Admin') {
      const arrCT: any = [];
      arrCT.push({ ten: 'T???t c??? ph????ng ph??p', _id: 'T???t c???' });
      arrCT.push(...result?.data?.data?.result);
      setDanhSachCTNew(arrCT);
    }
  };

  const donVi = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable/my/child?page=1&limit=100`, {
      params: { cond: { loaiDonVi: 'Lop' } },
    });
    const arrLop: any = [];
    if (vaiTro !== 'SuperAdmin' && vaiTro !== 'Admin') {
      arrLop.push({ tenDonVi: 'T???t c??? c??c l???p', _id: 'T???t c???' });
    }
    result?.data?.data?.result?.map(
      (item: { parent: string }) =>
        item?.parent === initialState?.currentUser?.role?.organizationId && arrLop.push(item),
    );
    setDsLop(arrLop);
  };

  React.useEffect(() => {
    getMonHoc();
    getChuongTrinhDaoTao();
    donVi();
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
    setCondition({ chuongTrinhDaoTaoId: value, donViId, doTuoi: valueTuoi });
    setPhuongPhapId(value);
    setLinhVucId(undefined);
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
      ...(value !== undefined && { monHocId: value }),
      donViId,
      doTuoi: valueTuoi,
    });
    setLinhVucId(value);
    setPage(1);
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

  const handleDel = async (record: IBaiHoc.Record) => {
    const res = await delBaiHoc({ id: record?._id });
    if (res?.status === 200) {
      message.success('X??a th??nh c??ng');
      setCondition({
        chuongTrinhDaoTaoId: phuongPhapId,
        monHocId: linhVucId,
        donViId,
        doTuoi: valueTuoi,
      });
      getBaiHocModel();
      return true;
    }
    message.error('???? x???y ra l???i');
    return false;
  };

  const onFinish = async (values: any) => {
    const newVal = values;
    const tenMonHoc: any = danhSachMon?.find(
      (item: { _id: string }) => item?._id === newVal.monHocId,
    );
    newVal.tenMonHoc = tenMonHoc?.ten;
    newVal.chuongTrinhDaoTaoId = tenMonHoc?.chuongTrinhDaoTaoId;
    newVal.donViId = tenMonHoc?.donViId;
    // x??? l?? t??i file document l??n
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
    if (edit) {
      try {
        const id = newRecord?._id;
        const res = await updBaiHoc({ ...newVal, id });
        if (res?.data?.statusCode === 200) {
          message.success('C???p nh???t th??nh c??ng');
          setCondition({
            chuongTrinhDaoTaoId: phuongPhapId,
            monHocId: linhVucId,
            donViId,
            doTuoi: valueTuoi,
          });
          setVisibleDrawer(false);
          getBaiHocModel();
          return true;
        }
      } catch (error) {
        const { response }: any = error;
        if (response?.data?.errorCode === 'NOT_ALLOW') {
          message.error('B???n kh??ng ???????c ph??p ch???nh s???a b??i h???c ??? l??nh v???c n??y');
          return false;
        }
        message.error('???? x???y ra l???i');
        return false;
      }
    }
    // Th??m
    try {
      const res = await addBaiHoc({ ...newVal });
      if (res?.data?.statusCode === 201) {
        message.success('Th??m m???i th??nh c??ng');
        setCondition({
          chuongTrinhDaoTaoId: phuongPhapId,
          monHocId: linhVucId,
          donViId,
          doTuoi: valueTuoi,
        });
        setVisibleDrawer(false);
        getBaiHocModel();
        return true;
      }
    } catch (error) {
      const { response }: any = error;
      if (response?.data?.errorCode === 'NOT_ALLOW') {
        message.error('B???n kh??ng ???????c ph??p th??m ph????ng ph??p gi??o d???c ??? ????n v??? n??y!');
        return false;
      }
      if (response?.data?.errorCode === 'INVALID_DON_VI') {
        message.error('B???n kh??ng ???????c th??m l??nh v???c c???a ????n v??? n??y!');
        return false;
      }
    }
    return true;
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
          disabled={!checkAllow('EDIT_BAI_HOC_RIENG')}
          title="Ch???nh??s???a"
        >
          <EditOutlined />
        </Button>

        <Divider type="vertical" />

        <Popconfirm
          title="B???n??c????ch???c??mu???n??x??a?"
          onConfirm={() => handleDel(record)}
          okText="?????ng ??"
          disabled={!checkAllow('DEL_BAI_HOC_RIENG')}
        >
          <Button
            type="default"
            shape="circle"
            title="X??a"
            disabled={!checkAllow('DEL_BAI_HOC_RIENG')}
          >
            <DeleteOutlined />
          </Button>
        </Popconfirm>
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
    {
      title: 'Thao t??c',
      align: 'center',
      render: (record: IBaiHoc.Record) => renderLast(record),
      fixed: 'right',
      width: 170,
    },
  ];

  useEffect(() => {}, []);

  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={getBaiHocCloneModel}
        loading={loadingBaiHoc}
        dependencies={[page, limit, cond]}
        modelName="baihocclone"
        title="Qu???n l?? b??i h???c ri??ng"
        scroll={{ x: 1000, y: 500 }}
      >
        {checkAllow('ADD_BAI_HOC_RIENG') && (
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
        {vaiTro !== 'GiaoVien' && (
          <Select
            showSearch
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
              <Select.Option value={item?._id}>{item?.tenDonVi}</Select.Option>
            ))}
          </Select>
        )}

        <Select
          showSearch
          value={phuongPhapId}
          style={{ width: '15%', marginRight: '10px' }}
          placeholder="Ch???n ph????ng ph??p"
          optionFilterProp="children"
          onChange={onChangePhuongPhap}
          filterOption={(input, option: any) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {danhSachCTNew?.map((item: { _id: string; ten: string }) => (
            <Select.Option value={item?._id}>{item?.ten}</Select.Option>
          ))}
        </Select>
        <Select
          showSearch
          allowClear
          value={linhVucId}
          style={{ width: '15%' }}
          placeholder="Ch???n l??nh v???c"
          optionFilterProp="children"
          onChange={onChangeLinhVuc}
          filterOption={(input, option: any) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {danhSachMon?.map((item: { _id: string; ten: string }) => (
            <Select.Option value={item?._id}>{item?.ten}</Select.Option>
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
                  placeholder="Ch???n l??nh v???c ph??t tri???n"
                  onChange={changeIdLinhVuc}
                  value={linhVucId}
                >
                  {danhSachMon?.map(
                    (item: { _id: string; ten: string; donVi: { tenDonVi: string } }) => (
                      <Select.Option value={item?._id}>
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
            <Spin spinning={!!loadingBaiHoc}>
              <Button htmlType="submit" type="primary" style={{ marginRight: '10px' }}>
                {edit ? 'C???p nh???t' : 'Th??m m???i'}
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
          </Form.Item>
        </Form>

        {edit && <div style={{ width: '100%' }} />}
      </Drawer>
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
                <div>
                  {index + 1}.{' '}
                  <a href={item} target="_blank">
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
