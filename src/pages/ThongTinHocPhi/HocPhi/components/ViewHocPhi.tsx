import { useEffect, useState } from 'react';
import { Descriptions, Collapse } from 'antd';
import { useModel } from 'umi';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import moment from 'moment';

const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
});

const ViewHocPhi = () => {
  const { recordBangHocPhi } = useModel('banghocphilop');
  const oldMonth = recordBangHocPhi?.thang === 0 ? 12 : recordBangHocPhi?.thang;
  const {
    tiLeGiamHocPhi,
    hocPhiThangTruoc,
    hocPhiThucTeThangTruoc,
    tienAn1NgayThangTruoc,
    soNgayHocThucTe,
    soNgayAnThucTe,
    soNgayNghiKhongPhep,
    soNgayNghiCoPhep,
    phuPhiThangTruoc,
    phuPhiCaNhanThangTruoc,
    soTienTrongMuon1Gio,
    soGioTrongMuon,
    tienDaDong,
    hocPhiDuKienThangSau,
    soDu,
    hocPhiThangSau,
    tienAn1Ngay,
    phuPhiDuKien,
    phuPhiCaNhanDuKien,
    soTienQuyetToan,
    tiLeGiamHocPhiThangSau,
  } = recordBangHocPhi;
  const [recordHocPhi, setRecordHocPhi] = useState();
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const getRecordHocPhi = async () => {
    const res = await axios.get(
      `${ip3}/thong-tin-hoc-phi-truong/truong/${organizationId}/thang/${moment().month()}/nam/${moment().year()}`,
    );
    setRecordHocPhi(res?.data?.data);
  };
  useEffect(() => {
    getRecordHocPhi();
  }, []);
  const soNgayHocTrongThangDeTinh = soNgayHocThucTe;
  const tienQuyetToanThangTruoc = hocPhiThucTeThangTruoc;
  const hocPhiDuKienThangNay = hocPhiDuKienThangSau;
  const hocPhiPhaiDongThangNay = soTienQuyetToan;
  return (
    <>
      <Descriptions bordered size="small">
        <Descriptions.Item label="Họ tên con" span={3}>
          {recordBangHocPhi?.con?.hoTen}
        </Descriptions.Item>
        <Descriptions.Item label="Họ tên phụ huynh" span={3}>
          {recordBangHocPhi?.phuHuynh?.profile?.fullname}
        </Descriptions.Item>
        <Descriptions.Item label="Số điện thoại" span={3}>
          {recordBangHocPhi?.phuHuynh?.profile?.phoneNumber}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái thanh toán" span={3}>
          <b>{recordBangHocPhi?.trangThaiThanhToan}</b>
        </Descriptions.Item>
      </Descriptions>
      <Collapse>
        <Collapse.Panel
          header={
            <b>
              Tiền học đã đóng tháng {oldMonth}: {formatter.format(tienDaDong ?? 0)}
            </b>
          }
          key="tienDaDong"
        />
        <Collapse.Panel
          header={
            <b>
              Tiền học quyết toán tháng {oldMonth}: {formatter.format(tienQuyetToanThangTruoc ?? 0)}
            </b>
          }
          key="tienQuyetToan"
        >
          <Descriptions bordered size="small">
            <Descriptions.Item
              label={`Số ngày học trong tháng ${oldMonth} để tính tiền ăn`}
              span={3}
            >
              {soNgayAnThucTe}
            </Descriptions.Item>
            <Descriptions.Item
              label={`Số ngày học trong tháng ${oldMonth} để tính học phí`}
              span={3}
            >
              {soNgayHocThucTe}
            </Descriptions.Item>
            <Descriptions.Item label={`Tỉ lệ giảm tháng ${oldMonth}`} span={3}>
              {tiLeGiamHocPhi}
            </Descriptions.Item>
            <Descriptions.Item label={`Học phí tháng ${oldMonth}`} span={3}>
              {formatter.format(hocPhiThangTruoc)}
            </Descriptions.Item>
            <Descriptions.Item label={`Tiền ăn tháng ${oldMonth}/ngày`} span={3}>
              {formatter.format(tienAn1NgayThangTruoc)}
            </Descriptions.Item>
            <Descriptions.Item label={`Tiền trông muộn ${oldMonth}/giờ/tháng`} span={3}>
              {formatter.format(soTienTrongMuon1Gio)}
            </Descriptions.Item>
            <Descriptions.Item label={`Số giờ trông muộn tháng ${oldMonth}`} span={3}>
              {soGioTrongMuon}
            </Descriptions.Item>
            <Descriptions.Item label={`Phụ phí chung tháng ${oldMonth}`} span={3}>
              {formatter.format(phuPhiThangTruoc)}
            </Descriptions.Item>
            <Descriptions.Item label={`Phụ phí cá nhân tháng ${oldMonth}`} span={3}>
              {formatter.format(phuPhiCaNhanThangTruoc)}
            </Descriptions.Item>
          </Descriptions>
        </Collapse.Panel>
        <Collapse.Panel
          header={
            <b>
              Học phí dự kiến tháng {recordBangHocPhi?.thang + 1}:{' '}
              {formatter.format(hocPhiDuKienThangNay ?? 0)}
            </b>
          }
          key="hocPhiDuKienThangNay"
        >
          <Descriptions bordered size="small">
            <Descriptions.Item label={`Học phí tháng ${recordBangHocPhi?.thang + 1}`} span={3}>
              {formatter.format(hocPhiThangSau)}
            </Descriptions.Item>
            <Descriptions.Item label={`Tiền ăn tháng ${recordBangHocPhi?.thang + 1}/ngày`} span={3}>
              {formatter.format(tienAn1Ngay)}
            </Descriptions.Item>
            <Descriptions.Item
              label={`Tổng số ngày học tháng ${recordBangHocPhi?.thang + 1}`}
              span={3}
            >
              {recordHocPhi?.soNgayHocDuKien ?? 0}
            </Descriptions.Item>
            <Descriptions.Item
              label={`Tỉ lệ giảm học phí tháng ${recordBangHocPhi?.thang + 1}`}
              span={3}
            >
              {tiLeGiamHocPhiThangSau ?? 0}
            </Descriptions.Item>
            <Descriptions.Item label={`Phụ phí tháng ${recordBangHocPhi?.thang + 1}`} span={3}>
              {formatter.format(phuPhiDuKien)}
            </Descriptions.Item>
            <Descriptions.Item
              label={`Phụ phí cá nhân tháng ${recordBangHocPhi?.thang + 1}`}
              span={3}
            >
              {formatter.format(phuPhiCaNhanDuKien)}
            </Descriptions.Item>
          </Descriptions>
        </Collapse.Panel>

        <Collapse.Panel
          header={
            <b>
              Học phí phải đóng tháng {recordBangHocPhi?.thang + 1}:{' '}
              {formatter.format(hocPhiPhaiDongThangNay ?? 0)}
            </b>
          }
          key="hocPhiDuKienPhaiDonThangNay"
        >
          {/* <Descriptions bordered size="small">
            <Descriptions.Item
              label={`Học phí dự kiến tháng ${recordBangHocPhi?.thang + 1}`}
              span={3}
            >
              {formatter.format(hocPhiDuKienThangNay)}
            </Descriptions.Item>
            <Descriptions.Item
              label={`Số tiền tháng ${oldMonth} chuyển sang tháng ${recordBangHocPhi?.thang + 1}`}
              span={3}
            >
              {formatter.format(Math.abs(soDu))}
            </Descriptions.Item>
          </Descriptions> */}
        </Collapse.Panel>
      </Collapse>
    </>
  );
};

export default ViewHocPhi;
