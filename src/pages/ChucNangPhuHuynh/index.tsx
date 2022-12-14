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
        <b>1.Th??ng tin tr?????ng</b>
      </div>
      {newRecord ? (
        <Descriptions bordered>
          <Descriptions.Item label="T??n tr?????ng" span={2}>
            {newRecord?.tenDonVi ?? 'Kh??ng c??'}
          </Descriptions.Item>
          <Descriptions.Item label="Ph????ng ph??p gi??o d???c" span={2}>
            {recordChuongTrinh?.ten ?? 'Kh??ng c??'}
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
            <Avatar
              shape="square"
              size={100}
              src={<Image src={newRecord?.hinhAnhDaiDienTruong} />}
            />
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
          <Descriptions.Item label="Camera gi??m s??t">{newRecord?.camera ?? ''}</Descriptions.Item>
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
      ) : (
        <div>T??i kho???n hi???n ch??a v??o tr?????ng n??o</div>
      )}
      <br />
      <div style={{ marginBottom: '10px', fontSize: '16px' }}>
        <b>2. Th??ng tin l???p</b>
      </div>
      {recordLop ? (
        <Descriptions bordered>
          <Descriptions.Item label="T??n l???p">
            {recordLop?.tenDonVi ?? 'Ch??a c???p nh???t'}
          </Descriptions.Item>
          <Descriptions.Item label="????? tu???i (th??ng)">
            {recordLop?.doTuoi ?? 'Ch??a c???p nh???t'}
          </Descriptions.Item>
          <Descriptions.Item label="S??? h???c sinh t???i ??a">
            {recordLop?.sySo ?? 'Ch??a c???p nh???t'}
          </Descriptions.Item>
          <Descriptions.Item label="S??? qu???n l??">
            {recordLop?.soQuanLyToiDa ?? 'Ch??a c???p nh???t'}
          </Descriptions.Item>
          <Descriptions.Item label="Ph????ng ph??p gi??o d???c">
            {recordChuongTrinh?.ten}{' '}
            {recordChuongTrinh?.donVi?.tenDonVi ? `- ${recordChuongTrinh?.donVi?.tenDonVi}` : ''}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <div>T??i kho???n hi???n ch??a v??o l???p n??o</div>
      )}
    </Card>
  );
};
export default ChucNangGiaoVien;
