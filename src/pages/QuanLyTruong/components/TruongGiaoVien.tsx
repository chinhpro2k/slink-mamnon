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
      <Descriptions.Item label="Tên trường" span={2}>
        {newRecord?.tenDonVi ?? 'Không có'}
      </Descriptions.Item>
      <Descriptions.Item label="Phương pháp giáo dục" span={2}>
        {danhSachCT?.ten ?? 'Không có'}
      </Descriptions.Item>
      <Descriptions.Item label="Địa chỉ trường" span={3}>
        {newRecord?.diaChi?.soNhaTenDuong}{' '}
        {newRecord?.diaChi?.tenPhuongXa ? ` - ${newRecord?.diaChi?.tenPhuongXa}` : ''}
        {newRecord?.diaChi?.tenQuanHuyen ? ` - ${newRecord?.diaChi?.tenQuanHuyen}` : ''}
        {newRecord?.diaChi?.tenTinh ? ` - ${newRecord?.diaChi?.tenTinh}` : ''}
      </Descriptions.Item>
      <Descriptions.Item label="Mức học phí (Khoảng)">
        {newRecord?.mucDongHocPhi ? formatter.format(Number(newRecord?.mucDongHocPhi)) : 0}
      </Descriptions.Item>
      <Descriptions.Item label="Số điện thoại">
        {newRecord?.soDienThoaiTruong ?? 'Không có'}
      </Descriptions.Item>
      <Descriptions.Item label="Email của trường">
        {newRecord?.email ?? 'Không có'}
      </Descriptions.Item>
      <Descriptions.Item label="Fanpage trường (link fanpage)" span={3}>
        <i>
          <a href={newRecord?.fanpageTruong} target="_blank">
            {newRecord?.fanpageTruong}
          </a>
        </i>
      </Descriptions.Item>
      <Descriptions.Item label="Quy mô trường (Số lớp học)">
        {newRecord?.quyMoTruong ?? 'Không có'}
      </Descriptions.Item>
      <Descriptions.Item label="Ngày học trong tuần của trường" span={2}>
        {newRecord?.ngayHocTrongTuan ?? 'Không có'}
      </Descriptions.Item>
      <Descriptions.Item label="Ảnh" span={3}>
        <Avatar shape="square" size={100} src={<Image src={newRecord?.hinhAnhDaiDienTruong} />} />
      </Descriptions.Item>
      <Descriptions.Item label="Thời gian mở cửa">
        {moment(newRecord?.thoiGianMoCua).format('HH:mm') ?? 'Không có'}
      </Descriptions.Item>
      <Descriptions.Item label="Thời gian đóng cửa">
        {moment(newRecord?.thoiGianDongCua).format('HH:mm') ?? 'Không có'}
      </Descriptions.Item>
      <Descriptions.Item label="Độ tuổi nhận trẻ tối thiểu (tháng tuổi)">
        {newRecord?.doTuoiNhanTre ?? 'Không có'}
      </Descriptions.Item>
      <Descriptions.Item label="Camera giám sát">
        {newRecord?.camera ?? 'Không có'}
      </Descriptions.Item>
      <Descriptions.Item label="Sân chơi ngoài trời">
        {newRecord?.sanNgoaiTroi ?? 'Không có'}
      </Descriptions.Item>
      <Descriptions.Item label="Sân chơi trong nhà">
        {newRecord?.sanTrongNha ?? 'Không có'}
      </Descriptions.Item>
      <Descriptions.Item label="Máy chiếu">
        {newRecord?.mayChieu === true ? 'Có' : 'Không có'}
      </Descriptions.Item>
      <Descriptions.Item label="Ăn sáng">
        {newRecord?.anSang === true ? 'Có' : 'Không có'}
      </Descriptions.Item>
      <Descriptions.Item label="Đón muộn">
        {newRecord?.donMuon === true ? 'Có' : 'Không có'}
      </Descriptions.Item>
      <Descriptions.Item label="Xe đưa đón">
        {newRecord?.xeDuaDon === true ? 'Có' : 'Không có'}
      </Descriptions.Item>
      <Descriptions.Item label="Phòng đa năng">
        {newRecord?.phongDaNang === true ? 'Có' : 'Không có'}
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
      title: 'Tên trường',
      dataIndex: 'tenDonVi',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => val ?? 'Không có',
      search: 'search',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'soDienThoaiTruong',
      align: 'center',
      width: 130,
      onCell,
      render: (val) => val ?? 'Không có',
      search: 'search',
    },
    {
      title: 'Mức đóng học phí',
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
        title="Thông tin trường"
      >
        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          Tổng số:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={total}
          />
        </h3>
      </TableBase>
      <Modal
        title="Chi tiết trường"
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
