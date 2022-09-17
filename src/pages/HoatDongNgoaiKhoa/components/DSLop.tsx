/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { HoatDongNgoaiKhoa as IHoatDongNgoaiKhoa } from '@/services/HoatDongNgoaiKhoa';
import type { IColumn } from '@/utils/interfaces';
import { PieChartOutlined } from '@ant-design/icons';
import { Avatar, Button, Descriptions, Modal, Image } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { useModel } from 'umi';
import TableThamGia from './TableThamGia';

const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
});

const DSLop = (props: { id?: string; tieuDe?: string }) => {
  const {
    loading: loadingGiaoVien,
    getDanhSachLopModel,
    record: recordHDNK,
  } = useModel('hoatdongngoaikhoa');
  const [idLop, setIdLop] = useState<string>();
  const [visible, setVisible] = useState(false);

  const renderLast = (record: IHoatDongNgoaiKhoa.Record) => {
    return (
      <React.Fragment>
        <Button
          type="default"
          shape="circle"
          onClick={() => {
            setIdLop(record?._id);
            setVisible(true);
          }}
          title="Xem kết quả"
        >
          <PieChartOutlined />
        </Button>
      </React.Fragment>
    );
  };

  const columns: IColumn<IHoatDongNgoaiKhoa.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Lớp tham gia',
      dataIndex: 'tenDonVi',
      align: 'center',
      width: 200,
    },
    {
      title: 'Sỹ số',
      dataIndex: 'sySo',
      align: 'center',
      width: 150,
    },
    {
      title: 'Số học sinh tham gia',
      dataIndex: 'soHocSinhThamGia',
      align: 'center',
      width: 150,
    },
    {
      title: 'Độ tuổi của lớp',
      dataIndex: 'doTuoi',
      align: 'center',
      width: 150,
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: IHoatDongNgoaiKhoa.Record) => renderLast(record),
      fixed: 'right',
      width: 100,
    },
  ];

  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={() => getDanhSachLopModel(props?.id)}
        loading={loadingGiaoVien}
        modelName="hoatdongngoaikhoa"
        dataState="danhSachLop"
      />
      <Modal
        visible={visible}
        centered
        title="Thông tin hoạt động ngoại khóa"
        width="80vw"
        closable
        onCancel={() => setVisible(false)}
        footer={[
          <Button type="primary" key="back" onClick={() => setVisible(false)}>
            OK
          </Button>,
        ]}
      >
        <Descriptions>
          <Descriptions.Item label="Tên hoạt động">{recordHDNK?.tenHoatDong}</Descriptions.Item>
          <Descriptions.Item label="Thời gian dự kiến" span={2}>
            {moment(recordHDNK?.thoiGianDuKien?.thoiGianBatDau).format('HH:mm DD-MM-YYYY')} -{' '}
            {moment(recordHDNK?.thoiGianDuKien?.thoiGianKetThuc).format('HH:mm DD-MM-YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label="Chi phí dự kiến">
            {formatter.format(recordHDNK?.chiPhiDuKien ?? 0)}
          </Descriptions.Item>
          <Descriptions.Item label="Địa điểm" span={2}>
            {recordHDNK?.diaDiem?.soNhaTenDuong} - {recordHDNK?.diaDiem?.tenPhuongXa} -{' '}
            {recordHDNK?.diaDiem?.tenQuanHuyen} - {recordHDNK?.diaDiem?.tenTinh}
          </Descriptions.Item>
          <Descriptions.Item label="Đơn vị tổ chức">
            {recordHDNK?.donViToChuc?.tenDonVi}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian đăng ký" span={2}>
            {moment(recordHDNK?.thoiGianDangKy?.thoiGianBatDau).format('HH:mm DD-MM-YYYY')} -{' '}
            {moment(recordHDNK?.thoiGianDangKy?.thoiGianKetThuc).format('HH:mm DD-MM-YYYY')}
          </Descriptions.Item>
          {recordHDNK?.files?.[0]?.url && (
            <Descriptions.Item label="Ảnh" span={3}>
              {recordHDNK?.files?.map((item: { url: string | undefined }, index: number) => (
                <div style={{ marginRight: '10px' }} key={index}>
                  <Avatar
                    style={{ width: '100px', height: '100px' }}
                    shape="square"
                    src={
                      <Image
                        width="100px"
                        height="100px"
                        style={{ objectFit: 'cover' }}
                        src={item?.url}
                      />
                    }
                  />
                </div>
              ))}
            </Descriptions.Item>
          )}
        </Descriptions>
        <TableThamGia idHoatDong={props?.id} donViId={idLop} />
      </Modal>
    </>
  );
};

export default DSLop;
