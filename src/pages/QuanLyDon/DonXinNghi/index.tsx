/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import TableBase from '@/components/Table';
import type { DonXinNghi as IDonXinNghi } from '@/services/DonXinNghi';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, Modal, Row, Select } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const DonXinNghi = () => {
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [newRecord, setNewRecord] = useState<IDonXinNghi.Record>();
  const {
    loading: loadingDonXinNghi,
    getDonXinNghiModel,
    total,
    setPage,
    cond,
    page,
    limit,
  } = useModel('donxinnghi');
  const [dsTruong, setDsTruong] = useState<any[]>([]);
  const [dsLop, setDsLop] = useState<any[]>([]);
  const vaiTro = localStorage.getItem('vaiTro');
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [idLop, setIdLop] = useState<string>();
  const [dsDonVi, setDsDonVi] = useState<any[]>([]);
  const [donViId, setDonViId] = useState<string | undefined>(organizationId);
  const [ngay, setNgay] = useState<number>(new Date().getDate());
  const [thang, setThang] = useState<number>(new Date().getMonth());
  const [nam, setNam] = useState<number>(new Date().getFullYear());

  const handleView = (record: IDonXinNghi.Record) => {
    setNewRecord(record);
    setVisibleDrawer(true);
  };

  const onCell = (record: IDonXinNghi.Record) => ({
    onClick: () => {
      handleView(record);
    },
    style: { cursor: 'pointer' },
  });
  const donVi = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=100`);
    const arrTruong = [];
    arrTruong.push({ tenDonVi: 'T???t c??? c??c tr?????ng', _id: 'T???t c???' });
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
    setDsDonVi(result?.data?.data?.result);
    setDsTruong(arrTruong);
    setDsLop(arrLop);
  };
  React.useEffect(() => {
    donVi();
  }, []);

  const onChange = (value: string) => {
    setDonViId(value);
    getDonXinNghiModel(value, ngay, thang, nam);
    setIdLop(undefined);
    setPage(1);
    const arrLop: any[] = [];
    if (value === 'T???t c???') {
      dsDonVi?.map((item) => item?.loaiDonVi === 'Lop' && arrLop.push(item));
    }
    dsDonVi?.map((item) => item?.parent === value && arrLop.push(item));
    setDsLop(arrLop);
  };

  const onChangeLop = (value: string) => {
    setDonViId(value);
    setIdLop(value);
    setPage(1);
    getDonXinNghiModel(value, ngay, thang, nam);
  };

  const changeDate = (val: any) => {
    setNgay(new Date(val).getDate());
    setThang(new Date(val).getMonth());
    setNam(new Date(val).getFullYear());
    getDonXinNghiModel(
      donViId,
      new Date(val).getDate(),
      new Date(val).getMonth(),
      new Date(val).getFullYear(),
    );
    setPage(1);
  };

  const renderLast = (record: IDonXinNghi.Record) => {
    return (
      <React.Fragment>
        <Button type="default" shape="circle" title="Xem th??m" onClick={() => handleView(record)}>
          <EyeOutlined />
        </Button>
      </React.Fragment>
    );
  };

  const columns: IColumn<IDonXinNghi.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'H??? t??n con',
      dataIndex: 'con',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => val?.hoTen ?? 'Kh??ng c??',
      search: 'search',
    },
    {
      title: 'H??? t??n ph??? huynh',
      dataIndex: 'phuHuynh',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => val?.profile?.fullname ?? 'Kh??ng c??',
    },
    {
      title: 'S??? ??i???n tho???i',
      dataIndex: 'phuHuynh',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => val?.profile?.phoneNumber ?? 'Kh??ng c??',
    },
    {
      title: '????n v???',
      dataIndex: 'donVi',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => val?.tenDonVi ?? 'Kh??ng c??',
    },
    {
      title: 'Ng??y xin ngh???',
      dataIndex: 'thoiGianXinNghi',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => moment(val).format('DD-MM-YYYY') ?? 'Kh??ng c??',
    },
    {
      title: 'L?? do',
      dataIndex: 'lyDo',
      align: 'center',
      width: 200,
      render: (val) => val ?? 'Kh??ng c??',
      onCell,
    },
    {
      title: 'Thao t??c',
      align: 'center',
      render: (record: IDonXinNghi.Record) => renderLast(record),
      fixed: 'right',
      width: 100,
    },
  ];

  useEffect(() => {}, []);

  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={() => getDonXinNghiModel(donViId, ngay, thang, nam)}
        loading={loadingDonXinNghi}
        dependencies={[cond, page, limit]}
        modelName="donxinnghi"
        title="????n xin ngh??? h???c"
        scroll={{ x: 1000 }}
      >
        <DatePicker
          onChange={changeDate}
          defaultValue={moment()}
          format="DD-MM-YYYY"
          placeholder="Ch???n ng??y"
          style={{ marginRight: '10px' }}
        />
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
        {vaiTro !== 'GiaoVien' && (
          <Select
            showSearch
            value={idLop}
            style={{ width: '15%' }}
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

        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          T???ng s???:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={total}
          />
        </h3>
      </TableBase>

      <Modal
        title="Chi ti???t ????n xin ngh??? h???c"
        visible={visibleDrawer}
        onCancel={() => {
          setVisibleDrawer(false);
        }}
        footer={
          <Button type="primary" onClick={() => setVisibleDrawer(false)}>
            Ok
          </Button>
        }
      >
        <Form {...formItemLayout}>
          <Row gutter={[16, 0]}>
            <Col xl={12} xs={24}>
              <Form.Item label="H??? t??n con" style={{ marginBottom: 5 }}>
                <Input value={newRecord?.con?.hoTen ?? 'Kh??ng c??'} disabled />
              </Form.Item>
            </Col>
            <Col xl={12} xs={24}>
              <Form.Item label="H??? t??n ph??? huynh" style={{ marginBottom: 5 }}>
                <Input value={newRecord?.phuHuynh?.profile?.fullname ?? 'Kh??ng c??'} disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 0]}>
            <Col xl={12} xs={24}>
              <Form.Item label="S??? ??i???n tho???i" style={{ marginBottom: 5 }}>
                <Input value={newRecord?.phuHuynh?.profile?.phoneNumber ?? 'Kh??ng c??'} disabled />
              </Form.Item>
            </Col>
            <Col xl={12} xs={24}>
              <Form.Item label="Ng??y xin ngh???" style={{ marginBottom: 5 }}>
                <DatePicker
                  value={moment(newRecord?.thoiGianXinNghi) ?? moment()}
                  format="DD-MM-YYYY"
                  disabled
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Col span={24}>
            <Form.Item label="L???p" style={{ marginBottom: 5 }}>
              <Input value={newRecord?.donVi?.tenDonVi ?? 'Kh??ng c??'} disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="L?? do xin ngh???" style={{ marginBottom: 5 }}>
              <Input.TextArea value={newRecord?.lyDo ?? 'Kh??ng c??'} disabled rows={3} />
            </Form.Item>
          </Col>
        </Form>
      </Modal>
    </>
  );
};

export default DonXinNghi;
