/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { ChuongTrinhDaoTao as IChuongTrinhDaoTao } from '@/services/chuongtrinhdaotao';
import type { Truong as ITruong } from '@/services/Truong';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { Avatar, Button, Descriptions, Image, Input, Modal } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';

const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
});

const Truong = () => {
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [newRecord, setNewRecord] = useState<ITruong.Record>();
  const [danhSachCT, setDanhSachCT] = useState<IChuongTrinhDaoTao.Record>();
  const { initialState } = useModel('@@initialState');
  const [recordLop, setRecordLop] = useState<ITruong.Record>();
  const { loading: loadingTruong, getTruongModel, total, page, limit, cond } = useModel('truong');

  const getLop = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=20`);
    setRecordLop(
      result?.data?.data?.result?.find(
        (item: { _id: string; loaiDonVi: string }) =>
          item?._id === initialState?.currentUser?.role?.organizationId &&
          item?.loaiDonVi === 'Lop',
      ),
    );
  };

  const getChuongTrinhDaoTao = async () => {
    const result = await axios.get(`${ip3}/chuong-trinh-dao-tao/pageable?page=1&limit=20`);
    setDanhSachCT(
      result?.data?.data?.result?.find(
        (item: { _id: string }) => item?._id === newRecord?.chuongTrinhDaoTaoId,
      ),
    );
  };

  React.useEffect(() => {
    getLop();
  }, []);

  React.useEffect(() => {
    if (newRecord?.chuongTrinhDaoTaoId) getChuongTrinhDaoTao();
  }, [recordLop, newRecord]);

  const handleView = (record: ITruong.Record) => {
    setNewRecord(record);
    setVisibleModal(true);
  };

  const onCell = (record: ITruong.Record) => ({
    onClick: () => {
      handleView(record);
    },
    style: { cursor: 'pointer' },
  });

  const handleOk = () => {
    setVisibleModal(false);
  };

  const Description = (
    <Descriptions bordered>
      <Descriptions.Item label="T??n tr?????ng" span={2}>
        {newRecord?.tenDonVi ?? 'Kh??ng c??'}
      </Descriptions.Item>
      <Descriptions.Item label="Ph????ng ph??p gi??o d???c" span={2}>
        {danhSachCT?.ten ?? 'Kh??ng c??'}
      </Descriptions.Item>
      <Descriptions.Item label="?????a ch??? tr?????ng" span={3}>
        {newRecord?.diaChi?.soNhaTenDuong}{' '}
        {newRecord?.diaChi?.tenPhuongXa ? ` - ${newRecord?.diaChi?.tenPhuongXa}` : ''}
        {newRecord?.diaChi?.tenQuanHuyen ? ` - ${newRecord?.diaChi?.tenQuanHuyen}` : ''}
        {newRecord?.diaChi?.tenTinh ? ` - ${newRecord?.diaChi?.tenTinh}` : ''}
      </Descriptions.Item>
      <Descriptions.Item label="M???c h???c ph?? (Kho???ng)">
        {newRecord?.mucDongHocPhi ? formatter.format(Number(newRecord?.mucDongHocPhi)) : 0}
      </Descriptions.Item>
      <Descriptions.Item label="S??? ??i???n tho???i">
        {newRecord?.soDienThoaiTruong ?? 'Kh??ng c??'}
      </Descriptions.Item>
      <Descriptions.Item label="Email c???a tr?????ng">
        {newRecord?.email ?? 'Kh??ng c??'}
      </Descriptions.Item>
      <Descriptions.Item label="Fanpage tr?????ng (link fanpage)" span={3}>
        <i>
          <a href={newRecord?.fanpageTruong} target="_blank">
            {newRecord?.fanpageTruong}
          </a>
        </i>
      </Descriptions.Item>
      <Descriptions.Item label="Quy m?? tr?????ng (S??? l???p h???c)">
        {newRecord?.quyMoTruong ?? 'Kh??ng c??'}
      </Descriptions.Item>
      <Descriptions.Item label="Ng??y h???c trong tu???n c???a tr?????ng" span={2}>
        {newRecord?.ngayHocTrongTuan ?? 'Kh??ng c??'}
      </Descriptions.Item>
      <Descriptions.Item label="???nh" span={3}>
        <Avatar shape="square" size={100} src={<Image src={newRecord?.hinhAnhDaiDienTruong} />} />
      </Descriptions.Item>
      <Descriptions.Item label="Th???i gian m??? c???a">
        {moment(newRecord?.thoiGianMoCua).format('HH:mm') ?? 'Kh??ng c??'}
      </Descriptions.Item>
      <Descriptions.Item label="Th???i gian ????ng c???a">
        {moment(newRecord?.thoiGianDongCua).format('HH:mm') ?? 'Kh??ng c??'}
      </Descriptions.Item>
      <Descriptions.Item label="????? tu???i nh???n tr??? t???i thi???u (th??ng tu???i)">
        {newRecord?.doTuoiNhanTre ?? 'Kh??ng c??'}
      </Descriptions.Item>
      <Descriptions.Item label="Camera gi??m s??t">
        {newRecord?.camera ?? 'Kh??ng c??'}
      </Descriptions.Item>
      <Descriptions.Item label="S??n ch??i ngo??i tr???i">
        {newRecord?.sanNgoaiTroi ?? 'Kh??ng c??'}
      </Descriptions.Item>
      <Descriptions.Item label="S??n ch??i trong nh??">
        {newRecord?.sanTrongNha ?? 'Kh??ng c??'}
      </Descriptions.Item>
      <Descriptions.Item label="M??y chi???u">
        {newRecord?.mayChieu === true ? 'C??' : 'Kh??ng c??'}
      </Descriptions.Item>
      <Descriptions.Item label="??n s??ng">
        {newRecord?.anSang === true ? 'C??' : 'Kh??ng c??'}
      </Descriptions.Item>
      <Descriptions.Item label="????n mu???n">
        {newRecord?.donMuon === true ? 'C??' : 'Kh??ng c??'}
      </Descriptions.Item>
      <Descriptions.Item label="Xe ????a ????n">
        {newRecord?.xeDuaDon === true ? 'C??' : 'Kh??ng c??'}
      </Descriptions.Item>
      <Descriptions.Item label="Ph??ng ??a n??ng">
        {newRecord?.phongDaNang === true ? 'C??' : 'Kh??ng c??'}
      </Descriptions.Item>
    </Descriptions>
  );

  const columns: IColumn<ITruong.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'T??n tr?????ng',
      dataIndex: 'tenDonVi',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => val ?? 'Kh??ng c??',
      search: 'search',
    },
    {
      title: 'S??? ??i???n tho???i',
      dataIndex: 'soDienThoaiTruong',
      align: 'center',
      width: 130,
      onCell,
      render: (val) => val ?? 'Kh??ng c??',
      search: 'search',
    },
    {
      title: 'M???c ????ng h???c ph??',
      dataIndex: 'mucDongHocPhi',
      align: 'center',
      width: 130,
      onCell,
      render: (val) => <div>{val ? formatter.format(val) : 0}</div>,
    },
  ];

  useEffect(() => {}, []);

  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={getTruongModel}
        dependencies={[page, limit, cond]}
        loading={loadingTruong}
        modelName="truong"
        title="Th??ng tin tr?????ng"
      >
        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          T???ng s???:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={total}
          />
        </h3>
      </TableBase>
      <Modal
        title="Chi ti???t tr?????ng"
        visible={visibleModal}
        onCancel={handleOk}
        footer={<Button onClick={handleOk}>OK</Button>}
        width="80%"
      >
        {Description}
      </Modal>
    </>
  );
};

export default Truong;
