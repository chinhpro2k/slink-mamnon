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
      arrCT.push({ ten: 'Tất cả phương pháp', _id: 'Tất cả' });
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
      arrLop.push({ tenDonVi: 'Tất cả các lớp', _id: 'Tất cả' });
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
    if (value === 'Tất cả') {
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
    if (value === 'Tất cả') {
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
          name: `Tài liệu ${index + 1}`,
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
      message.success('Xóa thành công');
      setCondition({
        chuongTrinhDaoTaoId: phuongPhapId,
        monHocId: linhVucId,
        donViId,
        doTuoi: valueTuoi,
      });
      getBaiHocModel();
      return true;
    }
    message.error('Đã xảy ra lỗi');
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
    // xử lý tài file document lên
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

    // Sửa
    if (edit) {
      try {
        const id = newRecord?._id;
        const res = await updBaiHoc({ ...newVal, id });
        if (res?.data?.statusCode === 200) {
          message.success('Cập nhật thành công');
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
          message.error('Bạn không được phép chỉnh sửa bài học ở lĩnh vực này');
          return false;
        }
        message.error('Đã xảy ra lỗi');
        return false;
      }
    }
    // Thêm
    try {
      const res = await addBaiHoc({ ...newVal });
      if (res?.data?.statusCode === 201) {
        message.success('Thêm mới thành công');
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
        message.error('Bạn không được phép thêm phương pháp giáo dục ở đơn vị này!');
        return false;
      }
      if (response?.data?.errorCode === 'INVALID_DON_VI') {
        message.error('Bạn không được thêm lĩnh vực của đơn vị này!');
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
          disabled={!checkAllow('EDIT_BAI_HOC_RIENG')}
          title="Chỉnh sửa"
        >
          <EditOutlined />
        </Button>

        <Divider type="vertical" />

        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDel(record)}
          okText="Đồng ý"
          disabled={!checkAllow('DEL_BAI_HOC_RIENG')}
        >
          <Button
            type="default"
            shape="circle"
            title="Xóa"
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
      title: 'Tên bài học',
      dataIndex: 'tenBaiHoc',
      align: 'center',
      width: 200,
      onCell,
      search: 'search',
    },
    {
      title: 'Độ tuổi',
      dataIndex: 'doTuoi',
      align: 'center',
      width: 150,
      onCell,
    },
    {
      title: 'Lĩnh vực phát triển',
      dataIndex: 'monHoc',
      align: 'center',
      width: 250,
      onCell,
      render: (val) => val?.ten ?? 'Không có',
    },
    {
      title: 'Phương pháp giáo dục',
      dataIndex: 'chuongTrinhDaoTao',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => val?.ten ?? 'Không có',
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
        title="Quản lý bài học riêng"
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
            Thêm mới
          </Button>
        )}
        {vaiTro !== 'GiaoVien' && (
          <Select
            showSearch
            style={{ width: '15%', marginRight: '10px' }}
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
              <Select.Option value={item?._id}>{item?.tenDonVi}</Select.Option>
            ))}
          </Select>
        )}

        <Select
          showSearch
          value={phuongPhapId}
          style={{ width: '15%', marginRight: '10px' }}
          placeholder="Chọn phương pháp"
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
          placeholder="Chọn lĩnh vực"
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
          defaultValue="Tất cả"
          showSearch
          style={{ width: '15%', marginLeft: '10px' }}
          placeholder="Chọn độ tuổi"
          optionFilterProp="children"
          onChange={onChangeDoTuoi}
          filterOption={(input, option: any) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          <Select.Option value="Tất cả">Tất cả độ tuổi</Select.Option>
          <Select.Option value="18-24 tháng">18-24 tháng</Select.Option>
          <Select.Option value="24-36 tháng">24-36 tháng</Select.Option>
          <Select.Option value="36-48 tháng">36-48 tháng</Select.Option>
          <Select.Option value="48-60 tháng">48-60 tháng</Select.Option>
          <Select.Option value="60-72 tháng">60-72 tháng</Select.Option>
        </Select>
        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          Tổng số:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={total}
          />
        </h3>
      </TableBase>
      <Drawer
        visible={visibleDrawer}
        title={edit ? 'Chỉnh sửa' : 'Thêm mới'}
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
                label="Tên bài học"
                rules={[...rules.required]}
                style={{ marginBottom: 0 }}
                initialValue={edit ? newRecord?.tenBaiHoc : undefined}
              >
                <Input placeholder="Nhập tên bài học" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="doTuoi"
                label="Độ tuổi"
                rules={[...rules.required]}
                style={{ marginBottom: 0 }}
                initialValue={edit ? newRecord?.doTuoi : undefined}
              >
                <Select placeholder="Chọn độ tuổi">
                  <Select.Option value="24-36 tháng">24-36 tháng</Select.Option>
                  <Select.Option value="36-48 tháng">36-48 tháng</Select.Option>
                  <Select.Option value="48-60 tháng">48-60 tháng</Select.Option>
                  <Select.Option value="60-72 tháng">60-72 tháng</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item
                name="monHocId"
                label="Lĩnh vực phát triển"
                rules={[...rules.required]}
                style={{ marginBottom: 0 }}
                initialValue={edit ? newRecord?.monHocId : undefined}
              >
                <Select
                  placeholder="Chọn lĩnh vực phát triển"
                  onChange={changeIdLinhVuc}
                  value={linhVucId}
                >
                  {danhSachMon?.map(
                    (item: { _id: string; ten: string; donVi: { tenDonVi: string } }) => (
                      <Select.Option value={item?._id}>
                        {item?.ten}{' '}
                        {item?.donVi?.tenDonVi
                          ? `- Thuộc ${item?.donVi?.tenDonVi}`
                          : '- Thuộc trường chung'}
                      </Select.Option>
                    ),
                  )}
                </Select>
              </Form.Item>
            </Col>
            {(idLV || (edit && newRecord?.monHocId)) && (
              <Col span={12}>
                <Form.Item
                  label="Phương pháp giáo dục"
                  rules={[...rules.required]}
                  style={{ marginBottom: 0 }}
                >
                  <Select
                    placeholder="Chọn phương pháp giáo dục"
                    value={tenPhuongPhap ?? 'Không có'}
                    disabled
                  />
                </Form.Item>
              </Col>
            )}
          </Row>

          <Form.Item
            name="taiLieu"
            label="Tài liệu"
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
            label="Mô tả"
            style={{ marginBottom: 0 }}
            initialValue={edit ? newRecord?.moTa : undefined}
          >
            <Input.TextArea rows={3} placeholder="Nhập mô tả" />
          </Form.Item>
          <Form.Item
            name="chiTiet"
            label="Chi tiết bài học"
            style={{ marginBottom: 0 }}
            initialValue={edit ? newRecord?.chiTiet : undefined}
          >
            <Input.TextArea rows={3} placeholder="Nhập chi tiết bài học" />
          </Form.Item>
          <Divider />
          <Form.Item>
            <Spin spinning={!!loadingBaiHoc}>
              <Button htmlType="submit" type="primary" style={{ marginRight: '10px' }}>
                {edit ? 'Cập nhật' : 'Thêm mới'}
              </Button>
              <Button
                onClick={() => {
                  setVisibleDrawer(false);
                  setIdLinhVuc(undefined);
                }}
              >
                Quay lại
              </Button>
            </Spin>
          </Form.Item>
        </Form>

        {edit && <div style={{ width: '100%' }} />}
      </Drawer>
      <Modal
        title="Chi tiết bài học"
        visible={visibleModal}
        onCancel={handleOk}
        footer={<Button onClick={handleOk}>OK</Button>}
      >
        <Form labelAlign="left" {...formItemLayout}>
          <Row gutter={[16, 0]}>
            <Col lg={12} xs={24}>
              <Form.Item label="Tên bài học" style={{ marginBottom: 0 }} required>
                <Input value={newRecord?.tenBaiHoc} disabled />
              </Form.Item>
            </Col>
            <Col lg={12} xs={24}>
              <Form.Item label="Độ tuổi" style={{ marginBottom: 0 }} required>
                <Input value={newRecord?.doTuoi} disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 0]}>
            <Col lg={12} xs={24}>
              <Form.Item label="Phương pháp giáo dục" style={{ marginBottom: 0 }} required>
                <Select disabled value={newRecord?.chuongTrinhDaoTao?.ten ?? 'Không có'} />
              </Form.Item>
            </Col>
            <Col lg={12} xs={24}>
              <Form.Item label="Lĩnh vực phát triển" style={{ marginBottom: 0 }} required>
                <Select disabled value={newRecord?.monHoc?.ten ?? 'Không có'} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Mô tả" style={{ marginBottom: 0 }}>
            <Input.TextArea value={newRecord?.moTa ?? 'Không có'} disabled />
          </Form.Item>
          <Form.Item label="Chi tiết bài học" style={{ marginBottom: 5 }}>
            <Input.TextArea value={newRecord?.chiTiet ?? 'Không có'} disabled />
          </Form.Item>
          {newRecord?.taiLieu?.[0] !== '' && newRecord?.taiLieu?.[0] && (
            <Form.Item label="Tài liệu">
              {newRecord?.taiLieu?.map((item, index) => (
                <div>
                  {index + 1}.{' '}
                  <a href={item} target="_blank">
                    Tài liệu {index + 1}
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
