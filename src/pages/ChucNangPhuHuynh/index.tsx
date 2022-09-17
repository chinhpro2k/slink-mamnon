/* eslint-disable no-underscore-dangle */
import type { ChuongTrinhDaoTao as IChuongTrinhDaoTao } from '@/services/chuongtrinhdaotao';
import type { Truong as ITruong } from '@/services/Truong';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import { Avatar, Card, Descriptions, Image } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { useModel } from 'umi';

const ChucNangGiaoVien = () => {
  const { initialState } = useModel('@@initialState');
  const [newRecord, setNewRecord] = useState<ITruong.Record>();
  const [recordLop, setRecordLop] = useState<ITruong.Record>();
  const [recordChuongTrinh, setChuongTrinh] = useState<IChuongTrinhDaoTao.Record>();
  const [dsDonVi, setDSDonVi] = useState<any[]>();
  const getLop = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=100`);
    setDSDonVi(result?.data?.data?.result);
    setRecordLop(
      result?.data?.data?.result?.find(
        (item: { _id: string; loaiDonVi: string }) =>
          item?._id === initialState?.currentUser?.role?.organizationId &&
          item?.loaiDonVi === 'Lop',
      ),
    );
  };

  const getTruong = () => {
    setNewRecord(
      dsDonVi?.find(
        (item: { _id: string; loaiDonVi: string }) =>
          item?._id === recordLop?.parent && item?.loaiDonVi === 'Truong',
      ),
    );
  };

  const getChuongTrinhDaoTao = async () => {
    const result = await axios.get(`${ip3}/chuong-trinh-dao-tao/pageable?page=1&limit=100`);
    let a = recordLop;
    setChuongTrinh(
      result?.data?.data?.result?.find(
        (item: { _id: string }) => item?._id === recordLop?.chuongTrinhDaoTaoId,
      ),
    );
  };

  React.useEffect(() => {
    getLop();
  }, []);

  React.useEffect(() => {
    if (newRecord?.chuongTrinhDaoTaoId) getChuongTrinhDaoTao();
    if (recordLop?.parent) getTruong();
  }, [recordLop, newRecord]);

  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  });
  return (
    <Card>
      <div style={{ marginBottom: '10px', fontSize: '16px' }}>
        <b>1.Thông tin trường</b>
      </div>
      {newRecord ? (
        <Descriptions bordered>
          <Descriptions.Item label="Tên trường" span={2}>
            {newRecord?.tenDonVi ?? 'Không có'}
          </Descriptions.Item>
          <Descriptions.Item label="Phương pháp giáo dục" span={2}>
            {recordChuongTrinh?.ten ?? 'Không có'}
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
            <Avatar
              shape="square"
              size={100}
              src={<Image src={newRecord?.hinhAnhDaiDienTruong} />}
            />
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
          <Descriptions.Item label="Camera giám sát">{newRecord?.camera ?? ''}</Descriptions.Item>
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
      ) : (
        <div>Tài khoản hiện chưa vào trường nào</div>
      )}
      <br />
      <div style={{ marginBottom: '10px', fontSize: '16px' }}>
        <b>2. Thông tin lớp</b>
      </div>
      {recordLop ? (
        <Descriptions bordered>
          <Descriptions.Item label="Tên lớp">
            {recordLop?.tenDonVi ?? 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label="Độ tuổi (tháng)">
            {recordLop?.doTuoi ?? 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label="Số học sinh tối đa">
            {recordLop?.sySo ?? 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label="Số quản lý">
            {recordLop?.soQuanLyToiDa ?? 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label="Phương pháp giáo dục">
            {recordChuongTrinh?.ten}{' '}
            {recordChuongTrinh?.donVi?.tenDonVi ? `- ${recordChuongTrinh?.donVi?.tenDonVi}` : ''}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <div>Tài khoản hiện chưa vào lớp nào</div>
      )}
    </Card>
  );
};
export default ChucNangGiaoVien;
