/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import { checkAllow } from '@/components/CheckAuthority';
import TableBase from '@/components/Table';
import type { DonDanThuoc as IDonDanThuoc } from '@/services/DonDanThuoc';
import { acceptDonDanThuoc } from '@/services/DonDanThuoc/dondanthuoc';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { CheckOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  DatePicker,
  Descriptions,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Image,
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';

const DonDanThuoc = () => {
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [newRecord, setNewRecord] = useState<IDonDanThuoc.Record>();
  const {
    loading: loadingDonDanThuoc,
    getDonDanThuocModel,
    total,
    setPage,
    cond,
    page,
    limit,
  } = useModel('dondanthuoc');
  const [dsTruong, setDsTruong] = useState<any[]>([]);
  const [dsLop, setDsLop] = useState<any[]>([]);
  const vaiTro = localStorage.getItem('vaiTro');
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [idLop, setIdLop] = useState<string>();
  const [dsDonVi, setDsDonVi] = useState<any[]>([]);
  const [donViId, setDonViId] = useState<string | undefined>(organizationId);
  const [timeStart, setTimeStart] = useState(moment().endOf('date').toDate());
  const [timeEnd, setTimeEnd] = useState(moment().startOf('date').toDate());
  const [ngay, setNgay] = useState<number>(new Date().getDate());
  const [thang, setThang] = useState<number>(new Date().getMonth());
  const [nam, setNam] = useState<number>(new Date().getFullYear());

  const handleView = (record: IDonDanThuoc.Record) => {
    setNewRecord(record);
    setVisibleDrawer(true);
  };

  const onCell = (record: IDonDanThuoc.Record) => ({
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
  };

  const changeDate = (val: any) => {
    const start = moment(val).endOf('date').toDate();
    const end = moment(val).startOf('date').toDate();
    setNgay(new Date(val).getDate());
    setThang(new Date(val).getMonth());
    setNam(new Date(val).getFullYear());
    setTimeStart(start);
    setTimeEnd(end);
    setPage(1);
  };

  const handleAccept = async (record: IDonDanThuoc.Record) => {
    try {
      const result = await acceptDonDanThuoc({ id: record?._id, ngay, thang, nam });
      if (result?.data?.statusCode === 200) {
        message.success('Ch???p nh???n ????n th??nh c??ng');
        getDonDanThuocModel(donViId, timeStart, timeEnd);
        return true;
      }
    } catch (error) {
      message.error('Ch???p nh???n ????n kh??ng th??nh c??ng');
      return false;
    }
    return false;
  };

  const renderLast = (record: IDonDanThuoc.Record) => {
    return (
      <React.Fragment>
        <Popconfirm
          title="B???n??c????ch???c??mu???n??x??c nh???n?"
          onConfirm={() => handleAccept(record)}
          okText="?????ng ??"
          disabled={
            record?.xacNhan?.find((item) => item?.ngay === ngay && item?.thang === thang)?.status ||
            !checkAllow('ACCEPT_DON_DAN_THUOC')
          }
        >
          <Button
            type="primary"
            shape="circle"
            title="X??c nh???n"
            disabled={
              record?.xacNhan?.find((item) => item?.ngay === ngay && item?.thang === thang)
                ?.status || !checkAllow('ACCEPT_DON_DAN_THUOC')
            }
          >
            <CheckOutlined />
          </Button>
        </Popconfirm>
      </React.Fragment>
    );
  };

  const columns: IColumn<IDonDanThuoc.Record>[] = [
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
      width: 170,
      onCell,
      render: (val) => val?.hoTen ?? 'Kh??ng c??',
    },
    {
      title: 'H??? t??n ph??? huynh',
      dataIndex: 'phuHuynh',
      align: 'center',
      width: 170,
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
      title: 'T??? ng??y',
      dataIndex: 'tuNgay',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => moment(val).format('DD-MM-YYYY') ?? 'Kh??ng c??',
    },
    {
      title: '?????n ng??y',
      dataIndex: 'denNgay',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => moment(val).format('DD-MM-YYYY') ?? 'Kh??ng c??',
    },
    {
      title: 'Li???u thu???c',
      dataIndex: 'lieuThuoc',
      align: 'center',
      width: 250,
      render: (val) =>
        val?.map((item: { tenThuoc: string; cachDung: string }, index: number) => (
          <div key={index}>
            {item?.tenThuoc} - C??ch d??ng: {item?.cachDung}
          </div>
        )),
      onCell,
    },
    {
      title: 'Ghi ch??',
      dataIndex: 'ghiChu',
      align: 'center',
      width: 200,
      render: (val) => val ?? 'Kh??ng c??',
      onCell,
    },
    {
      title: 'Thao t??c',
      align: 'center',
      render: (record: IDonDanThuoc.Record) => renderLast(record),
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
        getData={() => getDonDanThuocModel(donViId, timeStart, timeEnd)}
        loading={loadingDonDanThuoc}
        dependencies={[cond, page, limit, donViId, timeStart, timeEnd]}
        modelName="dondanthuoc"
        title="????n d???n thu???c"
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
        title="Chi ti???t ????n d???n thu???c"
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
        <Descriptions>
          <Descriptions.Item label="H??? t??n con" span={3}>
            {newRecord?.con?.hoTen ?? 'Kh??ng c??'}
          </Descriptions.Item>
          <Descriptions.Item label="Ph??? huynh" span={3}>
            {newRecord?.phuHuynh?.profile?.fullname ?? 'Kh??ng c??'} -{' '}
            {newRecord?.phuHuynh?.profile?.phoneNumber ?? 'Kh??ng c??'}
          </Descriptions.Item>
          <Descriptions.Item label="L???p" span={3}>
            {newRecord?.donVi?.tenDonVi ?? 'Kh??ng c??'}
          </Descriptions.Item>
          <Descriptions.Item label="Th???i gian" span={3}>
            {moment(newRecord?.tuNgay).format('DD/MM/YYYY') ?? 'Kh??ng c??'} -{' '}
            {moment(newRecord?.denNgay).format('DD/MM/YYYY') ?? 'Kh??ng c??'}
          </Descriptions.Item>
          <Descriptions.Item label="Ghi ch??" span={3}>
            {newRecord?.ghiChu ?? 'Kh??ng c??'}
          </Descriptions.Item>
          {newRecord?.file?.url && (
            <Descriptions.Item label="???nh thu???c" span={3}>
              <Avatar shape="square" size={100} src={<Image src={newRecord?.file?.url} />} />
            </Descriptions.Item>
          )}
        </Descriptions>
        <b>Li???u thu???c</b>
        <Descriptions>
          {newRecord?.lieuThuoc?.map(
            (item: { tenThuoc: string; cachDung: string }, index: number) => (
              <Descriptions.Item span={3} key={index}>
                {`- ${item?.tenThuoc ?? 'Kh??ng c??'} - C??ch d??ng: ${item?.cachDung ?? 'Kh??ng c??'}`}{' '}
              </Descriptions.Item>
            ),
          )}
        </Descriptions>
      </Modal>
    </>
  );
};

export default DonDanThuoc;
