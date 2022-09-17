/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import { checkAllow } from '@/components/CheckAuthority';
import DiaChi from '@/components/DiaChi';
import TableBase from '@/components/Table';
import type { ChuongTrinhDaoTao as IChuongTrinhDaoTao } from '@/services/chuongtrinhdaotao';
import type { Truong as ITruong } from '@/services/Truong';
import {
  addThongTinHocPhiTruong,
  addTruong,
  delTruong,
  updThongTinHocPhiTruong,
  updTruong,
} from '@/services/Truong/truong';
import { upload } from '@/services/UploadAnh/upload';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import rules from '@/utils/rules';
import { renderFileListUrl } from '@/utils/utils';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleFilled } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Select,
  Switch,
  Table,
  Tabs,
  TimePicker,
} from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { useModel } from 'umi';
import TaiKhoanHieuTruong from './components/TaiKhoanHieuTruong';
import ThongTinQuangCao from './components/ThongTinQuangCao';
import Upload from './components/Upload';
import TaiKhoanChuTruong from '@/pages/QuanLyTruong/components/TaiKhoanChuTruong';
import { formatPhoneNumber } from '@/functionCommon';

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const check = [
  {
    value: true,
    label: 'Có',
  },
  {
    value: false,
    label: 'Không',
  },
];
const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
});

const rulesTime = (valStart: any, valEnd: any, textStart: string, textEnd: string) => {
  const hourBatDau = parseInt(moment(valStart).format('HH'), 10);
  const minBatDau = parseInt(moment(valStart).format('mm'), 10);
  const hourDongCua = parseInt(moment(valEnd).format('HH'), 10);
  const minDongCua = parseInt(moment(valEnd).format('mm'), 10);

  const checkTime = hourBatDau * 60 + minBatDau - hourDongCua * 60 - minDongCua;
  if (checkTime > 0) {
    message.error(`${textStart} không được sau ${textEnd}`);
    return false;
  }
  return true;
};

const Truong = () => {
  const taikhoanhieutruong = useModel('taikhoanhieutruong');
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [disable, setDisable] = useState<boolean>(false);
  const [state, setstate] = useState<number>(0);
  const [newRecord, setNewRecord] = useState<ITruong.Record>();
  const [recordHocPhi, setRecordHocPhi] = useState<ITruong.Record>();
  const [disableLop, setDisableLop] = useState<boolean>(false);
  const [checkSwitch, setCheckSwitch] = useState<boolean>(
    newRecord?.thongTinDanhGiaSK?.lapLai ?? false,
  );
  const {
    loading: loadingTruong,
    getTruongModel,
    total,
    page,
    limit,
    cond,
    setCondition,
  } = useModel('truong');
  const { tenTinh, tenPhuongXa, tenQuanHuyen } = useModel('donvihanhchinh');
  const [danhSachCT, setDanhSachCT] = useState([]);
  const [danhSachCTAll, setDanhSachCTAll] = useState([]);
  // const [form] = Form.useForm();
  const [formChucNang] = Form.useForm();
  const { initialState } = useModel('@@initialState');
  const [idTruong, setIdTruong] = useState<string>();
  const [expireDate, setExpireDate] = useState<string>();
  const [keyTab, setKeyTab] = useState<string>('1');
  const [dsTruong, setDSTruong] = useState([]);
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const vaiTro = localStorage.getItem('vaiTro');
  const [dsDonVi, setDonVi] = useState([]);
  const thang = new Date().getMonth();
  const nam = new Date().getFullYear();
  const [thoiGianMoCua, setThoiGianMoCua] = useState(undefined);
  const [thoiGianDongCua, setThoiGianDongCua] = useState(undefined);
  const [soNgayHocThucTe, setSoNgayHocThucTe] = useState([]);

  const getChuongTrinhDaoTao = async () => {
    const result = await axios.get(`${ip3}/chuong-trinh-dao-tao/pageable?page=1&limit=100`, {
      params: {
        cond: { donViId: null },
      },
    });
    const arr: any = [];
    arr.push({ ten: 'Tất cả phương pháp', _id: '*' });
    arr.push(...result?.data?.data?.result);
    setDanhSachCTAll(arr);
    setDanhSachCT(result?.data?.data?.result);
  };

  const getDataTruong = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=10000`);
    const arrDonVi = result?.data?.data?.result;
    const recordLop = arrDonVi?.find((item: { _id: string }) => item?._id === organizationId);
    const arrTruong: any = [];
    arrDonVi?.map(
      (item: { _id: string }) =>
        item?._id === recordLop?.parent && arrTruong.push({ ...item, index: 1 }),
    );
    const arrSelectTruong: any = [];
    arrSelectTruong.push({ tenDonVi: 'Tất cả các trường', _id: 'Tất cả' });
    arrDonVi?.map(
      (item: { loaiDonVi: string }) =>
        item?.loaiDonVi === 'Truong' && arrSelectTruong.push({ ...item, index: 1 }),
    );
    setDonVi(arrSelectTruong);
    setDSTruong(arrTruong);
    setNewRecord(
      result?.data?.data?.result?.find((item: { _id: string }) => item?._id === organizationId),
    );
  };

  React.useEffect(() => {
    getChuongTrinhDaoTao();
    getDataTruong();
  }, []);

  const handleView = async (record: ITruong.Record) => {
    try {
      const result = await axios.get(
        `${ip3}/thong-tin-hoc-phi-truong/truong/${record?._id}/thang/${thang}/nam/${nam}`,
      );
      setNewRecord({
        ...record,
        thongTinHocPhi: result?.data?.data,
      });
      setRecordHocPhi(result?.data?.data);
    } catch (e) {
      setNewRecord(record);
    }
    setEdit(true);
    setDisable(true);
    setVisibleDrawer(true);
  };

  const handleEdit = async (record?: ITruong.Record) => {
    setThoiGianMoCua(record?.thoiGianMoCua);
    setThoiGianDongCua(record?.thoiGianDongCua);
    try {
      const result = await axios.get(
        `${ip3}/thong-tin-hoc-phi-truong/truong/${record?._id}/thang/${thang}/nam/${nam}`,
      );
      setNewRecord({
        ...record,
        thongTinHocPhi: result?.data?.data,
      });
      setRecordHocPhi(result?.data?.data);
    } catch (e) {
      setNewRecord(record);
    }
    setEdit(true);
    setVisibleDrawer(true);
    setDisable(false);
    // formChucNang.setFieldsValue({
    //   thongTinHocPhi: result?.data?.data,
    // });
  };

  const changeArrPP = (val: any) => {
    for (let i = 0; i < val?.length; i += 1) {
      if (val?.[i] === '*') {
        setDisableLop(true);
      } else {
        setDisableLop(false);
      }
    }
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

  const handleDel = async (_id: string) => {
    const res = await delTruong({ id: _id });
    if (res?.status === 200) {
      message.success('Xóa thành công');
      setstate(state - 1);
      getTruongModel();
      return true;
    }
    message.error('Đã xảy ra lỗi');
    return false;
  };

  const Description = (
    <Descriptions bordered>
      <Descriptions.Item label="Tên trường" span={2}>
        {newRecord?.tenDonVi ?? ''}
      </Descriptions.Item>
      <Descriptions.Item label="Phương pháp giáo dục" span={2}>
        {vaiTro === 'Guest'
          ? 'Không có'
          : newRecord?.chuongTrinhDaoTaoId
          ? danhSachCT?.map(
              (item: IChuongTrinhDaoTao.Record) =>
                newRecord?.chuongTrinhDaoTaoId === item?._id && (
                  <div key={item?._id}>{item?.ten}</div>
                ),
            )
          : 'Không có'}
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
          <a href={newRecord?.fanpageTruong} target="_blank" rel="noreferrer">
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
  const setNgayCongToiDa = async (value: any, init: any) => {
    const result = await axios.get(`${ip3}/setting/SO_NGAY_LAM_VIEC`);
    const tmp = (result?.data?.value ?? []).filter(
      (item) => item.thang === thang && item.nam === nam,
    )?.[0]?.soNgayToiDa;
    // ;
    setSoNgayHocThucTe(tmp);
    let thongTinHocPhi = formChucNang.getFieldValue('thongTinHocPhi') ?? recordHocPhi;

    if (init && thongTinHocPhi?.soNgayLamViecThangTruoc === undefined) {
      // ;
      thongTinHocPhi = {
        ...thongTinHocPhi,
        soNgayLamViecThangTruoc: tmp ?? 0,
      };
    }
    if (!init) {
      // ;
      thongTinHocPhi = {
        ...thongTinHocPhi,
        soNgayLamViecThangTruoc: tmp ?? 0,
      };
    }
    const tmp1 = (result?.data?.value ?? []).filter(
      (item) => item.thang === thang + 1 && item.nam === nam,
    )?.[0]?.soNgayToiDa;
    // ;
    if (init && thongTinHocPhi?.soNgayLamViec === undefined) {
      thongTinHocPhi = {
        ...thongTinHocPhi,
        soNgayLamViec: tmp1 ?? 0,
      };
    }
    if (!init) {
      thongTinHocPhi = {
        ...thongTinHocPhi,
        soNgayLamViec: tmp1 ?? 0,
      };
    }
    formChucNang.setFieldsValue({
      thongTinHocPhi,
    });
  };
  const changeSoNgayHocToiDa = async (value, init) => {
    const ngayHocTrongTuan = value;
    const keyNgayHocTrongTuan =
      ngayHocTrongTuan === '2-6' ? 'SO_NGAY_HOC_TOI_DA_2_6' : 'SO_NGAY_HOC_TOI_DA_2_7';
    const result = await axios.get(`${ip3}/setting/${keyNgayHocTrongTuan}`);
    const tmp = (result?.data?.value ?? []).filter(
      (item) => item.thang === thang && item.nam === nam,
    )?.[0]?.soNgayToiDa;
    // ;
    setSoNgayHocThucTe(tmp);
    let thongTinHocPhi = formChucNang.getFieldValue('thongTinHocPhi') ?? recordHocPhi;

    if (init && thongTinHocPhi?.soNgayHocThucTeThangTruoc === undefined) {
      // ;
      thongTinHocPhi = {
        ...thongTinHocPhi,
        soNgayHocThucTeThangTruoc: tmp ?? 0,
      };
    }
    if (!init) {
      // ;
      thongTinHocPhi = {
        ...thongTinHocPhi,
        soNgayHocThucTeThangTruoc: tmp ?? 0,
      };
    }
    const tmp1 = (result?.data?.value ?? []).filter(
      (item) => item.thang === thang + 1 && item.nam === nam,
    )?.[0]?.soNgayToiDa;
    // ;
    if (init && thongTinHocPhi?.soNgayHocDuKien === undefined) {
      thongTinHocPhi = {
        ...thongTinHocPhi,
        soNgayHocDuKien: tmp1 ?? 0,
      };
    }
    if (!init) {
      thongTinHocPhi = {
        ...thongTinHocPhi,
        soNgayHocDuKien: tmp1 ?? 0,
      };
    }
    formChucNang.setFieldsValue({
      thongTinHocPhi,
    });
    setNgayCongToiDa(value, init);
  };

  const changeTab = async (val: string) => {
    if (val === '2') {
      try {
        changeSoNgayHocToiDa(
          formChucNang.getFieldValue('ngayHocTrongTuan') ?? newRecord?.ngayHocTrongTuan,
          true,
        );
      } catch (e) {}
    }
    if (val === '3') {
      formChucNang.setFieldsValue([
        {
          duyetAlbumAnh: newRecord?.duyetAlbumAnh ?? false,
        },
      ]);
    }
    setKeyTab(val);
  };

  const onChange = (value: string) => {
    setCondition({ _id: value });
  };

  const onFinish = async (values: any) => {
    console.log('values', values);
    // kiểm tra thời gian bắt đầu không được sau thời gian kết thúc
    if (values?.thoiGianMoCua && values?.thoiGianDongCua) {
      if (
        !rulesTime(
          values?.thoiGianMoCua,
          values?.thoiGianDongCua,
          'Thời gian mở cửa',
          'Thời gian đóng cửa',
        )
      )
        return false;
      values.thoiGianMoCua = moment(values?.thoiGianMoCua).toISOString();
      values.thoiGianDongCua = moment(values?.thoiGianDongCua).toISOString();
    }
    if (
      thoiGianMoCua &&
      values?.diemDanhDauGio?.gioBatDau &&
      !rulesTime(
        thoiGianMoCua,
        values?.diemDanhDauGio?.gioBatDau,
        'Thời gian mở cửa',
        'Thời gian bắt đầu điểm danh đầu giờ',
      )
    ) {
      return false;
    }
    if (values?.diemDanhDauGio) {
      if (
        !rulesTime(
          values?.diemDanhDauGio?.gioBatDau,
          values?.diemDanhDauGio?.gioKetThuc,
          'Thời gian bắt đầu điểm danh đầu giờ',
          'Thời gian kết thúc',
        )
      )
        return false;
      values.diemDanhDauGio.gioBatDau = moment(values?.diemDanhDauGio?.gioBatDau).format('HH:mm');
      values.diemDanhDauGio.gioKetThuc = moment(values?.diemDanhDauGio?.gioKetThuc).format('HH:mm');
    }
    if (values?.diemDanhLai) {
      if (
        !rulesTime(
          values?.diemDanhLai?.gioBatDau,
          values?.diemDanhLai?.gioKetThuc,
          'Thời gian bắt đầu điểm danh lại',
          'Thời gian kết thúc',
        )
      )
        return false;
      values.diemDanhLai.gioBatDau = moment(values?.diemDanhLai?.gioBatDau).format('HH:mm');
      values.diemDanhLai.gioKetThuc = moment(values?.diemDanhLai?.gioKetThuc).format('HH:mm');
    }
    if (values?.diemDanhMuon) {
      if (
        !rulesTime(
          values?.diemDanhMuon?.gioBatDau,
          values?.diemDanhMuon?.gioKetThuc,
          'Thời gian bắt đầu điểm danh muộn',
          'Thời gian kết thúc',
        )
      )
        return false;
      values.diemDanhMuon.gioBatDau = moment(values?.diemDanhMuon?.gioBatDau).format('HH:mm');
      values.diemDanhMuon.gioKetThuc = moment(values?.diemDanhMuon?.gioKetThuc).format('HH:mm');
    }
    if (
      thoiGianDongCua &&
      values?.diemDanhCuoiGio?.gioBatDau &&
      !rulesTime(
        values?.diemDanhCuoiGio?.gioKetThuc,
        thoiGianDongCua,
        'Thời gian kết thúc điểm danh cuối giờ',
        'Thời gian đóng cửa',
      )
    ) {
      return false;
    }
    if (values?.diemDanhCuoiGio) {
      if (
        !rulesTime(
          values?.diemDanhCuoiGio?.gioBatDau,
          values?.diemDanhCuoiGio?.gioKetThuc,
          'Thời gian bắt đầu điểm danh cuối giờ',
          'Thời gian kết thúc',
        )
      )
        return false;
      values.diemDanhCuoiGio.gioBatDau = moment(values?.diemDanhCuoiGio?.gioBatDau).format('HH:mm');
      values.diemDanhCuoiGio.gioKetThuc = moment(values?.diemDanhCuoiGio?.gioKetThuc).format(
        'HH:mm',
      );
    }
    if (values?.diemDanhDauGio && values?.diemDanhLai) {
      if (
        !rulesTime(
          moment(values?.diemDanhDauGio?.gioKetThuc, 'HH:mm'),
          moment(values?.diemDanhLai?.gioBatDau, 'HH:mm'),
          'Thời gian bắt đầu điểm danh lại',
          'Thời gian kết thúc điểm danh đầu giờ',
        )
      )
        return false;
    }
    if (values?.diemDanhLai && values?.diemDanhCuoiGio) {
      if (
        !rulesTime(
          moment(values?.diemDanhLai?.gioKetThuc, 'HH:mm'),
          moment(values?.diemDanhCuoiGio?.gioBatDau, 'HH:mm'),
          'Thời gian bắt đầu điểm danh cuối giờ',
          'Thời gian kết thúc điểm danh lại',
        )
      )
        return false;
    }
    if (values?.diemDanhMuon && values?.diemDanhCuoiGio) {
      if (
        !rulesTime(
          moment(values?.diemDanhCuoiGio?.gioKetThuc, 'HH:mm'),
          moment(values?.diemDanhMuon?.gioBatDau, 'HH:mm'),
          'Thời gian bắt đầu điểm danh muộn',
          'Thời gian kết thúc điểm cuối giờ',
        )
      )
        return false;
    }

    if (keyTab !== '2') {
      values.diaChi = {
        ...newRecord?.diaChi,
        ...values.diaChi,
      };
      if (tenTinh) values.diaChi.tenTinh = tenTinh;
      if (tenQuanHuyen) values.diaChi.tenQuanHuyen = tenQuanHuyen;
      if (tenPhuongXa) values.diaChi.tenPhuongXa = tenPhuongXa;
    }

    if (
      values.hinhAnhDaiDienTruong?.fileList?.length > 0 &&
      !values.hinhAnhDaiDienTruong?.fileList[0]?.url
    ) {
      const result = await upload(values.hinhAnhDaiDienTruong);
      values.hinhAnhDaiDienTruong = result.data?.data?.url;
    } else {
      values.hinhAnhDaiDienTruong = values.hinhAnhDaiDienTruong?.fileList?.[0]?.url;
    }
    values.expireDate = moment(values?.expireDate).toISOString();
    setExpireDate(values.expireDate);
    values.diemNoiBatHtml = values?.diemNoiBatHtml?.text;
    values.coSoVatChatHtml = values?.coSoVatChatHtml?.text;
    values.tienIchHtml = values?.tienIchHtml?.text;
    values.gioiThieuChungHtml = values?.gioiThieuChungHtml?.text;
    values.chuongTrinhHocHtml = values?.chuongTrinhHocHtml?.text;
    values.doiNguGiaoVienHtml = values?.doiNguGiaoVienHtml?.text;
    values.cheDoDinhDuongHtml = values?.cheDoDinhDuongHtml?.text;
    values.chiPhiKhacHtml = values?.chiPhiKhacHtml?.text;
    if (keyTab === '4' && (vaiTro === 'Admin' || vaiTro === 'SuperAdmin')) {
      setKeyTab('5');
      return false;
    }
    if (edit || keyTab === '2' || keyTab === '3') {
      const id = edit ? newRecord?._id : idTruong;

      if (!recordHocPhi) {
        const valHocPhi = { ...values?.thongTinHocPhi };
        await addThongTinHocPhiTruong({ ...valHocPhi, thang, nam, truongId: id });
      }
      if (recordHocPhi) {
        const valHocPhi = { ...values?.thongTinHocPhi };
        await updThongTinHocPhiTruong({
          ...valHocPhi,
          thang,
          nam,
          truongId: id,
          id: recordHocPhi?._id,
        });
      }
      // let a = values;
      //
      // return;
      delete values.thongTinHocPhi;
      const res = await updTruong({ ...values, id });
      if (res?.data?.statusCode === 200) {
        if (edit) {
          message.success('Cập nhật thành công');
        } else {
          message.success('Thêm mới thành công');
        }
        if (keyTab === '1') {
          setKeyTab('2');
          return false;
        }
        if (keyTab === '2') {
          setKeyTab('3');
          getTruongModel(organizationId);
          return false;
        }
        if (keyTab === '3') {
          setKeyTab('4');
          return false;
        }
        getTruongModel(organizationId);
        return true;
      }
      message.error('Đã xảy ra lỗi');
      return false;
    }

    values.loaiDonVi = 'Truong';
    if (!edit) {
      try {
        const res = await addTruong({ ...values });
        if (res?.data?.statusCode === 201) {
          message.success('Thêm mới thành công');
          setIdTruong(res?.data?.data?._id);
          setNewRecord(res?.data?.data);
          getTruongModel();
          setKeyTab((+keyTab + 1).toString());
          return true;
        }
      } catch (error) {
        const { response }: any = error;
        if (response?.data?.errorCode === 'SO_DIEN_THOAI_EXISTED') {
          message.error('Số điện thoại đã được sử dụng, vui lòng điền số điện thoại mới!');
          return false;
        }
        message.error('Đã xảy ra lỗi');
        return false;
      }
    }

    return true;
  };

  const renderLast = (record: ITruong.Record) => {
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
          title="Chỉnh sửa"
          disabled={!checkAllow('EDIT_TRUONG')}
        >
          <EditOutlined />
        </Button>

        <Divider type="vertical" />
        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDel(record?._id)}
          okText="Đồng ý"
          disabled={!checkAllow('DEL_TRUONG')}
        >
          <Button type="default" shape="circle" title="Xóa" disabled={!checkAllow('DEL_TRUONG')}>
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      </React.Fragment>
    );
  };
  const renderLast1 = (record: ITruong.Record) => {
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
          disabled={!checkAllow('EDIT_TRUONG')}
          title="Chỉnh sửa"
        >
          <EditOutlined />
        </Button>
      </React.Fragment>
    );
  };

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
      search: 'search',
    },
    {
      title: 'Loại hình',
      dataIndex: 'loaiHinh',
      align: 'center',
      width: 200,
      onCell,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'soDienThoaiTruong',
      align: 'center',
      width: 150,
      onCell,
      search: 'search',
      render: (val) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              width={16}
              height={16}
              style={{ marginRight: '4px', color: 'green' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            {formatPhoneNumber(val)}
          </div>
        );
      },
    },
    {
      title: 'Mức đóng học phí',
      dataIndex: 'mucDongHocPhi',
      align: 'center',
      width: 130,
      onCell,
      render: (val) => <div>{formatter.format(val)}</div>,
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'expireDate',
      search: 'sort',
      align: 'center',
      width: 130,
      onCell,
      render: (val) => <div>{moment(val).format('DD/MM/YYYY')}</div>,
    },
  ];

  if (vaiTro === 'Admin' || vaiTro === 'SuperAdmin') {
    columns.push(
      {
        title: 'Phương pháp giáo dục',
        dataIndex: 'chuongTrinhDaoTao',
        align: 'center',
        width: 250,
        render: (val) => val?.ten ?? 'Không có',
        onCell,
      },
      {
        title: 'Giá/user',
        dataIndex: 'giaTien1User',
        align: 'center',
        width: 150,
        render: (val) => formatter.format(val ?? 0),
      },
      {
        title: 'Thao tác',
        align: 'center',
        render: (record: ITruong.Record) => renderLast(record),
        fixed: 'right',
        width: 170,
      },
    );
  }
  if (vaiTro === 'HieuTruong') {
    columns.push(
      {
        title: 'Giá/user',
        dataIndex: 'giaTien1User',
        align: 'center',
        width: 150,
        render: (val) => formatter.format(val ?? 0),
      },
      // {
      //   title: 'Số ngày làm việc',
      //   dataIndex: 'soNgayLamViec',
      //   align: 'center',
      //   width: 150,
      //   render: (val) => val,
      // },
      {
        title: 'Thao tác',
        align: 'center',
        render: (record: ITruong.Record) => renderLast1(record),
        fixed: 'right',
        width: 130,
      },
    );
  }
  return (
    <>
      {vaiTro === 'PhuHuynh' || vaiTro === 'GiaoVien' ? (
        <Card title="Quản lý trường">
          <Table bordered columns={columns} dataSource={dsTruong} />
        </Card>
      ) : (
        <TableBase
          border
          columns={columns}
          getData={() => getTruongModel(organizationId)}
          loading={loadingTruong}
          dependencies={[page, limit, cond]}
          modelName="truong"
          title="Quản lý trường"
          scroll={{ x: 1000 }}
        >
          {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
            <>
              {checkAllow('ADD_TRUONG') && (
                <Button
                  style={{ marginBottom: '10px' }}
                  onClick={() => {
                    setEdit(false);
                    setVisibleDrawer(true);
                    setDisable(false);
                    setNewRecord(undefined);

                    // form.resetFields();
                    setNewRecord({} as ITruong.Record)
                  }}
                  type="primary"
                >
                  <PlusCircleFilled />
                  Thêm mới
                </Button>
              )}
              <Select
                showSearch
                defaultValue="Tất cả"
                style={{ width: '15%', marginLeft: '10px' }}
                placeholder="Chọn đơn vị"
                optionFilterProp="children"
                onChange={onChange}
                filterOption={(input, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {dsDonVi?.map((item: { _id: string; tenDonVi: string }) => (
                  <Select.Option value={item?._id} key={item?._id}>
                    {item?.tenDonVi}
                  </Select.Option>
                ))}
              </Select>
            </>
          )}
          <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
            Tổng số:
            <Input
              style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
              value={total}
            />
          </h3>
        </TableBase>
      )}

      <Drawer
        visible={visibleDrawer}
        width="85%"
        onClose={() => {
          setVisibleDrawer(false);
          setKeyTab('1');
          setDisableLop(false);
          getTruongModel(organizationId);
        }}
        destroyOnClose
      >
        <Tabs defaultActiveKey="1" onChange={changeTab} activeKey={keyTab} destroyInactiveTabPane>
          <Tabs.TabPane
            tab={
              edit && disable ? 'Thông tin trường' : edit ? 'Chỉnh sửa trường' : 'Thêm mới trường'
            }
            key="1"
            forceRender
            disabled={keyTab !== '1' && !edit}
          >
            <Form onFinish={onFinish}  {...formItemLayout}>
              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <Form.Item
                    name="loaiHinh"
                    label="Loại hình trường"
                    initialValue={edit ? newRecord?.loaiHinh : ''}
                    rules={[...rules.required]}
                  >
                    <Select disabled={disable}>
                      <Select.Option value="Mầm non">Mẫu giáo</Select.Option>\
                      <Select.Option value="Nhà trẻ">Nhà trẻ</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="tenDonVi"
                    label="Tên trường"
                    initialValue={edit ? newRecord?.tenDonVi : ''}
                    rules={[...rules.required]}
                  >
                    <Input placeholder="Nhập tên trường" disabled={disable} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="chuongTrinhDaoTaoId"
                    label="Phương pháp giáo dục"
                    rules={[...rules.required]}
                    initialValue={edit ? newRecord?.chuongTrinhDaoTaoId : undefined}
                  >
                    <Select
                      showSearch
                      placeholder="Chọn phương pháp giáo dục"
                      disabled={disable}
                      optionFilterProp="children"
                      filterOption={(input, option: any) =>
                        option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {danhSachCT?.map((item: IChuongTrinhDaoTao.Record) => (
                        <Select.Option value={item?._id} key={item?._id}>
                          {item?.ten}{' '}
                          {item?.donVi?.tenDonVi
                            ? `- Thuộc trường ${item?.donVi?.tenDonVi}`
                            : '- Thuộc trường chung'}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="Địa chỉ trường" required>
                  <DiaChi
                    disabled={disable}
                    initialValue={edit ? newRecord?.diaChi : undefined}
                    form={undefined}
                    fields={{
                      tinh: ['diaChi', 'maTinh'],
                      quanHuyen: ['diaChi', 'maQuanHuyen'],
                      xaPhuong: ['diaChi', 'maPhuongXa'],
                      diaChiCuThe: ['diaChi', 'soNhaTenDuong'],
                      lat: ['diaChi', 'lat'],
                      long: ['diaChi', 'long'],
                    }}
                  />
              </Form.Item>

              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <Form.Item
                    name="mucDongHocPhi"
                    label="Mức học phí (Khoảng)"
                    initialValue={edit ? newRecord?.mucDongHocPhi : undefined}
                    rules={[...rules.required]}
                  >
                    <InputNumber
                      disabled={disable}
                      style={{ width: '100%' }}
                      placeholder="Nhập mức học phí"
                      min={10000}
                      step={5000}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="soDienThoaiTruong"
                    label="Số điện thoại"
                    initialValue={edit ? newRecord?.soDienThoaiTruong : undefined}
                    rules={[...rules.required, ...rules.soDienThoai]}
                  >
                    <Input placeholder="Nhập số điện thoại" disabled={disable} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <Form.Item
                    name="email"
                    label="Email của trường"
                    initialValue={edit ? newRecord?.email : undefined}
                  >
                    <Input placeholder="Nhập email" disabled={disable} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="fanpageTruong"
                    label="Fanpage trường (link fanpage)"
                    initialValue={edit ? newRecord?.fanpageTruong : undefined}
                  >
                    <Input placeholder="Nhập link fanpage" disabled={disable} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="hinhAnhDaiDienTruong"
                label="Ảnh"
                rules={[...rules.fileRequired]}
                initialValue={edit ? renderFileListUrl(newRecord?.hinhAnhDaiDienTruong) : undefined}
              >
                {edit && disable ? (
                  <Avatar
                    shape="square"
                    size={100}
                    src={<Image src={newRecord?.hinhAnhDaiDienTruong} />}
                  />
                ) : (
                  <Upload />
                )}
              </Form.Item>
              <Row gutter={[16, 0]}>
                <Col span={8}>
                  <Form.Item
                    name="thoiGianMoCua"
                    label="Thời gian mở cửa"
                    rules={[...rules.required]}
                    initialValue={edit ? moment(newRecord?.thoiGianMoCua) : undefined}
                  >
                    <TimePicker
                      placeholder="Chọn thời gian mở cửa"
                      format="HH:mm"
                      style={{ width: '100%' }}
                      disabled={disable}
                      onChange={(value) => {
                        setThoiGianMoCua(value?.toISOString());
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="thoiGianDongCua"
                    label="Thời gian đóng cửa"
                    rules={[...rules.required]}
                    initialValue={edit ? moment(newRecord?.thoiGianDongCua) : undefined}
                  >
                    <TimePicker
                      placeholder="Chọn thời gian đóng cửa"
                      format="HH:mm"
                      style={{ width: '100%' }}
                      disabled={disable}
                      onChange={(value) => {
                        setThoiGianDongCua(value?.toISOString());
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="doTuoiNhanTre"
                    label="Độ tuổi nhận trẻ tối thiểu (tháng tuổi)"
                    initialValue={edit ? newRecord?.doTuoiNhanTre : undefined}
                    rules={[...rules.required]}
                  >
                    <InputNumber
                      placeholder="Nhập độ tuổi nhận trẻ tối thiểu (tháng tuổi)"
                      min={6}
                      style={{ width: '100%' }}
                      disabled={disable}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 0]}>
                <Col span={8}>
                  <Form.Item
                    name="camera"
                    label="Camera giám sát"
                    initialValue={edit ? newRecord?.camera : undefined}
                  >
                    <Select placeholder="Chọn camera giám sát" disabled={disable}>
                      <Select.Option value={0}>Không</Select.Option>
                      <Select.Option value={1}>1 lớp - 1 cái</Select.Option>
                      <Select.Option value={2}>1 lớp - 2 cái</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="sanTrongNha"
                    label="Sân chơi ngoài trời"
                    initialValue={edit ? newRecord?.sanTrongNha : undefined}
                  >
                    <Select placeholder="Sân chơi ngoài trời" disabled={disable}>
                      <Select.Option value="Có">Có khoảng diện tích</Select.Option>
                      <Select.Option value="Không">Không</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="sanNgoaiTroi"
                    label="Sân chơi trong nhà"
                    initialValue={edit ? newRecord?.sanNgoaiTroi : undefined}
                  >
                    <Select placeholder="Sân chơi trong nhà" disabled={disable}>
                      <Select.Option value="Có">Có khoảng diện tích</Select.Option>
                      <Select.Option value="Không">Không</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 0]}>
                <Col span={8}>
                  <Form.Item
                    name="mayChieu"
                    label="Máy chiếu"
                    initialValue={edit ? newRecord?.mayChieu : undefined}
                  >
                    <Radio.Group options={check} disabled={disable} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="anSang"
                    initialValue={edit ? newRecord?.anSang : undefined}
                    label="Ăn sáng"
                  >
                    <Radio.Group options={check} disabled={disable} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="donMuon"
                    initialValue={edit ? newRecord?.donMuon : undefined}
                    label="Đón muộn"
                  >
                    <Radio.Group options={check} disabled={disable} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 0]}>
                <Col span={8}>
                  {' '}
                  <Form.Item
                    name="xeDuaDon"
                    label="Xe đưa đón"
                    initialValue={edit ? newRecord?.xeDuaDon : undefined}
                  >
                    <Radio.Group options={check} disabled={disable} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="phongDaNang"
                    label="Phòng đa năng"
                    initialValue={edit ? newRecord?.phongDaNang : undefined}
                  >
                    <Radio.Group options={check} disabled={disable} />
                  </Form.Item>
                </Col>
              </Row>

              <ThongTinQuangCao edit={edit} newRecord={newRecord} disable={disable} />
              <Form.Item>
                <div style={{ textAlign: 'center' }}>
                  <Button
                    style={{ marginRight: '10px' }}
                    onClick={() => {
                      setVisibleDrawer(false);
                    }}
                  >
                    Quay lại
                  </Button>
                  {edit && disable ? (
                    <Button
                      type="primary"
                      onClick={() => {
                        setKeyTab('2');
                        taikhoanhieutruong.setDanhSach([]);
                      }}
                    >
                      Bước tiếp theo
                    </Button>
                  ) : (
                    <Button type="primary" htmlType="submit">
                      Bước tiếp theo
                    </Button>
                  )}
                </div>
              </Form.Item>
            </Form>
          </Tabs.TabPane>
          {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin' || vaiTro === 'HieuTruong') && (
            <Tabs.TabPane
              tab={
                edit && disable
                  ? 'Thông tin chức năng'
                  : edit
                  ? 'Chỉnh sửa chức năng'
                  : 'Thêm mới chức năng'
              }
              forceRender
              key="2"
              disabled={keyTab !== '2' && !edit}
            >
              <Form form={formChucNang} onFinish={onFinish} {...formItemLayout}>
                <Row gutter={[16, 0]}>
                  <Col span={24}>
                    <Form.Item
                      name="danhSachCTDTId"
                      label="Phương pháp giáo dục"
                      rules={[...rules.required]}
                      initialValue={edit ? newRecord?.danhSachCTDTId : undefined}
                    >
                      <Select
                        placeholder="Chọn phương pháp giáo dục"
                        disabled={
                          disable || (!disable && vaiTro !== 'SuperAdmin' && vaiTro !== 'Admin')
                        }
                        mode={!disableLop ? 'multiple' : undefined}
                        onChange={changeArrPP}
                      >
                        {danhSachCTAll?.map((item: IChuongTrinhDaoTao.Record) => (
                          <Select.Option value={item?._id} key={item?._id}>
                            {item?.ten}{' '}
                            {item?.donVi?.tenDonVi
                              ? `- Thuộc trường ${item?.donVi?.tenDonVi}`
                              : '- Thuộc trường chung'}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[16, 0]}>
                  <Col span={12}>
                    <Form.Item
                      name="ngayHocTrongTuan"
                      label="Ngày học trong tuần của trường"
                      rules={[...rules.required]}
                      initialValue={edit ? newRecord?.ngayHocTrongTuan : undefined}
                    >
                      <Select
                        placeholder="Chọn ngày học trong tuần"
                        disabled={disable}
                        onChange={(value) => {
                          changeSoNgayHocToiDa(value, false);
                        }}
                      >
                        <Select.Option value="2-7">Từ thứ 2 đến thứ 7</Select.Option>
                        <Select.Option value="2-6">Từ thứ 2 đến thứ 6</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="quyMoTruong"
                      label="Quy mô trường (số lớp học)"
                      rules={[...rules.required, ...rules.number(undefined, 1)]}
                      initialValue={edit ? newRecord?.quyMoTruong : undefined}
                    >
                      <InputNumber
                        placeholder="Nhập số lớp học"
                        style={{ width: '100%' }}
                        disabled={
                          disable || (!disable && vaiTro !== 'SuperAdmin' && vaiTro !== 'Admin')
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[16, 0]}>
                  <Col span={12}>
                    <Form.Item
                      name="hinhThucThanhToan"
                      label="Hình thức thanh toán"
                      rules={[...rules.required]}
                      initialValue={edit ? newRecord?.hinhThucThanhToan : undefined}
                    >
                      <Select
                        placeholder="Chọn hình thức thanh toán"
                        disabled={
                          disable || (!disable && vaiTro !== 'SuperAdmin' && vaiTro !== 'Admin')
                        }
                      >
                        <Select.Option value="TrucTiep">Thanh toán tại trường</Select.Option>
                        <Select.Option value="Online">Thanh toán qua hệ thống</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="expireDate"
                      label="Ngày hết hạn"
                      // rules={[...rules.required, ...rules.sauHomNay]}
                      initialValue={
                        edit
                          ? newRecord?.expireDate
                            ? moment(new Date(newRecord?.expireDate))
                            : undefined
                          : undefined
                      }
                    >
                      <DatePicker
                        placeholder="Chọn ngày hết hạn"
                        format="DD-MM-YYYY"
                        style={{ width: '100%' }}
                        disabled={
                          disable || (!disable && vaiTro !== 'SuperAdmin' && vaiTro !== 'Admin')
                        }
                        disabledDate={(current) => moment().isAfter(current)}
                        showToday={false}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Divider>
                  <b>Thời gian điểm danh</b>
                </Divider>
                <Row gutter={[16, 0]}>
                  <Col span={12}>
                    <div style={{ marginBottom: 5 }}>Điểm danh đầu giờ</div>
                    <Row>
                      <Col span={12}>
                        <Form.Item
                          name={['diemDanhDauGio', 'gioBatDau']}
                          label="Bắt đầu"
                          rules={[...rules.required]}
                          initialValue={
                            edit && newRecord?.diemDanhDauGio?.gioBatDau
                              ? moment(newRecord?.diemDanhDauGio?.gioBatDau, 'HH:mm')
                              : undefined
                          }
                        >
                          <TimePicker
                            placeholder="Chọn thời gian bắt đầu"
                            format="HH:mm"
                            disabled={disable}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name={['diemDanhDauGio', 'gioKetThuc']}
                          label="Kết thúc"
                          rules={[...rules.required]}
                          initialValue={
                            edit && newRecord?.diemDanhDauGio?.gioKetThuc
                              ? moment(newRecord?.diemDanhDauGio?.gioKetThuc, 'HH:mm')
                              : undefined
                          }
                        >
                          <TimePicker
                            placeholder="Chọn thời gian kết thúc"
                            format="HH:mm"
                            disabled={disable}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>

                  <Col span={12}>
                    <div style={{ marginBottom: 5 }}>Điểm danh lại</div>
                    <Row>
                      <Col span={12}>
                        <Form.Item
                          name={['diemDanhLai', 'gioBatDau']}
                          label="Bắt đầu"
                          rules={[...rules.required]}
                          initialValue={
                            edit && newRecord?.diemDanhLai?.gioBatDau
                              ? moment(newRecord?.diemDanhLai?.gioBatDau, 'HH:mm')
                              : undefined
                          }
                        >
                          <TimePicker
                            placeholder="Chọn thời gian bắt đầu"
                            format="HH:mm"
                            disabled={disable}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name={['diemDanhLai', 'gioKetThuc']}
                          label="Kết thúc"
                          rules={[...rules.required]}
                          initialValue={
                            edit && newRecord?.diemDanhLai?.gioKetThuc
                              ? moment(newRecord?.diemDanhLai?.gioKetThuc, 'HH:mm')
                              : undefined
                          }
                        >
                          <TimePicker
                            placeholder="Chọn thời gian kết thúc"
                            format="HH:mm"
                            disabled={disable}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row gutter={[16, 0]}>
                  <Col span={12}>
                    <div style={{ marginBottom: 5 }}>Điểm danh cuối giờ</div>
                    <Row>
                      <Col span={12}>
                        <Form.Item
                          name={['diemDanhCuoiGio', 'gioBatDau']}
                          label="Bắt đầu"
                          rules={[...rules.required]}
                          initialValue={
                            edit && newRecord?.diemDanhCuoiGio?.gioBatDau
                              ? moment(newRecord?.diemDanhCuoiGio?.gioBatDau, 'HH:mm')
                              : undefined
                          }
                          style={{ marginBottom: 5 }}
                        >
                          <TimePicker
                            placeholder="Chọn thời gian bắt đầu"
                            format="HH:mm"
                            disabled={disable}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name={['diemDanhCuoiGio', 'gioKetThuc']}
                          label="Kết thúc"
                          rules={[...rules.required]}
                          initialValue={
                            edit && newRecord?.diemDanhCuoiGio?.gioKetThuc
                              ? moment(newRecord?.diemDanhCuoiGio?.gioKetThuc, 'HH:mm')
                              : undefined
                          }
                          style={{ marginBottom: 5 }}
                        >
                          <TimePicker
                            placeholder="Chọn thời gian kết thúc"
                            format="HH:mm"
                            disabled={disable}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={12}>
                    <div style={{ marginBottom: 5 }}>Điểm danh muộn</div>
                    <Row>
                      <Col span={12}>
                        <Form.Item
                          name={['diemDanhMuon', 'gioBatDau']}
                          label="Bắt đầu"
                          rules={[...rules.required]}
                          initialValue={
                            edit && newRecord?.diemDanhMuon?.gioBatDau
                              ? moment(newRecord?.diemDanhMuon?.gioBatDau, 'HH:mm')
                              : undefined
                          }
                          style={{ marginBottom: 5 }}
                        >
                          <TimePicker
                            placeholder="Chọn thời gian bắt đầu"
                            format="HH:mm"
                            disabled={disable}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name={['diemDanhMuon', 'gioKetThuc']}
                          label="Kết thúc"
                          rules={[...rules.required]}
                          initialValue={
                            edit && newRecord?.diemDanhMuon?.gioKetThuc
                              ? moment(newRecord?.diemDanhMuon?.gioKetThuc, 'HH:mm')
                              : undefined
                          }
                          style={{ marginBottom: 5 }}
                        >
                          <TimePicker
                            placeholder="Chọn thời gian kết thúc"
                            format="HH:mm"
                            disabled={disable}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <Divider>
                  <b>Thông tin tính toán học phí</b>
                </Divider>
                <Row gutter={[16, 0]}>
                  <Col xs={24} lg={8}>
                    <Form.Item
                      name={['thongTinHocPhi', 'soNgayHocThucTeThangTruoc']}
                      label={`Số ngày học tối đa tháng ${thang}`}
                      rules={[...rules.required, ...rules.float(undefined, 0, 0)]}
                      initialValue={
                        edit ? newRecord?.thongTinHocPhi?.soNgayHocThucTeThangTruoc : undefined
                      }
                      style={{ marginBottom: 5 }}
                    >
                      <InputNumber
                        placeholder="Nhập số ngày học thực tế"
                        style={{ width: '100%' }}
                        min={0}
                        max={31}
                        disabled={disable}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={8}>
                    <Form.Item
                      name={['thongTinHocPhi', 'soNgayHocDuKien']}
                      label={`Số ngày học tối đa tháng ${thang + 1}`}
                      rules={[...rules.required, ...rules.float(undefined, 0, 0)]}
                      initialValue={edit ? newRecord?.thongTinHocPhi?.soNgayHocDuKien : undefined}
                      style={{ marginBottom: 5 }}
                    >
                      <InputNumber
                        placeholder="Nhập số ngày học dự kiến"
                        style={{ width: '100%' }}
                        min={0}
                        max={31}
                        disabled={disable}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={8}>
                    <Form.Item
                      name={['thongTinHocPhi', 'ngayGuiThongBao']}
                      label="Ngày quyết toán học phí"
                      rules={[...rules.required]}
                      initialValue={edit ? newRecord?.thongTinHocPhi?.ngayGuiThongBao : undefined}
                      style={{ marginBottom: 5 }}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        min={1}
                        max={28}
                        disabled={disable}
                        placeholder="Ngày quyết toán học phí"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[16, 0]}>
                  <Col xs={24} lg={8}>
                    <Form.Item
                      name={['thongTinHocPhi', 'soNgayLamViecThangTruoc']}
                      label={`Số ngày công tối đa tháng ${thang}`}
                      initialValue={
                        edit ? newRecord?.thongTinHocPhi?.soNgayLamViecThangTruoc : undefined
                      }
                      rules={[...rules.required]}
                    >
                      <InputNumber
                        placeholder="Nhập số ngày công"
                        style={{ width: '100%' }}
                        min={0}
                        max={31}
                        disabled={disable}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={8}>
                    <Form.Item
                      name={['thongTinHocPhi', 'soNgayLamViec']}
                      label={`Số ngày công tối đa tháng ${thang + 1}`}
                      initialValue={edit ? newRecord?.thongTinHocPhi?.soNgayLamViec : undefined}
                      rules={[...rules.required]}
                    >
                      <InputNumber
                        placeholder="Nhập số ngày công"
                        style={{ width: '100%' }}
                        min={0}
                        max={31}
                        disabled={disable}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={8}>
                    <Form.Item
                      name="giaTien1User"
                      label="Giá tiền 1 user"
                      initialValue={edit ? newRecord?.giaTien1User : undefined}
                      rules={[...rules.required]}
                    >
                      <InputNumber
                        disabled={disable}
                        style={{ width: '100%' }}
                        placeholder="Nhập giá tiền 1 user"
                        min={10000}
                        step={5000}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[16, 0]}>
                  <Col xs={24} lg={12}>
                    <Form.Item
                      name={['thongTinHocPhi', 'tyLeGiam1', 'gte']}
                      label="Số ngày học thực tế nhỏ hơn"
                      rules={[...rules.required]}
                      initialValue={edit ? newRecord?.thongTinHocPhi?.tyLeGiam1?.gte : undefined}
                      style={{ marginBottom: 5 }}
                    >
                      <InputNumber style={{ width: '100%' }} min={0} max={31} disabled={disable} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Form.Item
                      name={['thongTinHocPhi', 'tyLeGiam1', 'tyLeGiam']}
                      label="Sẽ giảm (%)"
                      rules={[...rules.required]}
                      initialValue={
                        edit ? newRecord?.thongTinHocPhi?.tyLeGiam1?.tyLeGiam : undefined
                      }
                      style={{ marginBottom: 5 }}
                    >
                      <InputNumber style={{ width: '100%' }} min={0} max={100} disabled={disable} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[16, 0]}>
                  <Col xs={24} lg={12}>
                    <Form.Item
                      name={['thongTinHocPhi', 'tyLeGiam2', 'gte']}
                      label="Số ngày học thực tế nhỏ hơn"
                      rules={[...rules.required]}
                      initialValue={edit ? newRecord?.thongTinHocPhi?.tyLeGiam2?.gte : undefined}
                      style={{ marginBottom: 5 }}
                    >
                      <InputNumber style={{ width: '100%' }} min={0} max={31} disabled={disable} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Form.Item
                      name={['thongTinHocPhi', 'tyLeGiam2', 'tyLeGiam']}
                      label="Sẽ giảm (%)"
                      rules={[...rules.required]}
                      initialValue={
                        edit ? newRecord?.thongTinHocPhi?.tyLeGiam2?.tyLeGiam : undefined
                      }
                      style={{ marginBottom: 5 }}
                    >
                      <InputNumber style={{ width: '100%' }} min={0} max={100} disabled={disable} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[16, 0]}>
                  <Col xs={24} lg={12}>
                    <Form.Item
                      name={['thongTinHocPhi', 'tyLeGiam3', 'gte']}
                      label="Số ngày học thực tế nhỏ hơn"
                      rules={[...rules.required]}
                      initialValue={edit ? newRecord?.thongTinHocPhi?.tyLeGiam3?.gte : undefined}
                      style={{ marginBottom: 5 }}
                    >
                      <InputNumber style={{ width: '100%' }} min={0} max={31} disabled={disable} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Form.Item
                      name={['thongTinHocPhi', 'tyLeGiam3', 'tyLeGiam']}
                      label="Sẽ giảm (%)"
                      rules={[...rules.required]}
                      initialValue={
                        edit ? newRecord?.thongTinHocPhi?.tyLeGiam3?.tyLeGiam : undefined
                      }
                      style={{ marginBottom: 5 }}
                    >
                      <InputNumber style={{ width: '100%' }} min={0} max={100} disabled={disable} />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  name={['thongTinHocPhi', 'quyTacTinhHocPhi']}
                  label="Quy tắc tính học phí"
                  rules={[...rules.required]}
                  initialValue={edit ? newRecord?.thongTinHocPhi?.quyTacTinhHocPhi : undefined}
                  style={{ marginBottom: 5 }}
                >
                  {/* <Radio.Group options={['Có phép', 'Không phép']} disabled={disable} /> */}
                  <Checkbox.Group options={['Có phép', 'Không phép']} disabled={disable} />
                </Form.Item>
                <Form.Item
                  name={['thongTinHocPhi', 'quyTacTinhTienAn']}
                  label="Quy tắc tính tiền ăn"
                  rules={[...rules.required]}
                  initialValue={edit ? newRecord?.thongTinHocPhi?.quyTacTinhTienAn : undefined}
                  style={{ marginBottom: 5 }}
                >
                  {/* <Radio.Group options={['Có phép', 'Không phép']} disabled={disable} /> */}
                  <Checkbox.Group disabled={disable}>
                    <Checkbox value="Có phép">Có phép</Checkbox>
                    <Checkbox value="Không phép">Không phép</Checkbox>
                  </Checkbox.Group>
                </Form.Item>

                <Divider>Đợt đánh giá sức khỏe</Divider>
                <Row gutter={[16, 0]}>
                  <Col xs={24} lg={12}>
                    <Form.Item
                      name={['thongTinDanhGiaSK', 'ngayGuiThongBao']}
                      label="Ngày gửi thông báo"
                      rules={[...rules.required]}
                      initialValue={
                        edit ? moment(newRecord?.thongTinDanhGiaSK?.ngayGuiThongBao) : undefined
                      }
                      style={{ marginBottom: 5 }}
                    >
                      <DatePicker
                        placeholder="Chọn ngày gửi thông báo"
                        format="DD/MM/YYYY"
                        disabled={disable}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Form.Item
                      name={['thongTinDanhGiaSK', 'lapLai']}
                      label="Lặp lại"
                      initialValue={edit ? newRecord?.thongTinDanhGiaSK?.lapLai : false}
                      style={{ marginBottom: 5 }}
                    >
                      <Switch
                        disabled={disable}
                        checked={checkSwitch}
                        checkedChildren="Có"
                        unCheckedChildren="Không"
                        onChange={() => setCheckSwitch(!checkSwitch)}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Divider />
                <Form.Item>
                  <div style={{ textAlign: 'center' }}>
                    <Button
                      style={{ marginRight: '10px' }}
                      onClick={() => {
                        setKeyTab('1');
                        setEdit(true);
                      }}
                    >
                      Quay lại
                    </Button>
                    {edit && disable ? (
                      <Button type="primary" onClick={() => setKeyTab('3')}>
                        Bước tiếp theo
                      </Button>
                    ) : (
                      <Button type="primary" htmlType="submit">
                        Bước tiếp theo
                      </Button>
                    )}
                  </div>
                </Form.Item>
              </Form>
            </Tabs.TabPane>
          )}
          {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin' || vaiTro === 'HieuTruong') && (
            <Tabs.TabPane
              tab={
                edit && disable
                  ? 'Thông tin kiểm duyệt'
                  : edit
                  ? 'Chỉnh sửa kiểm duyệt'
                  : 'Thêm mới kiểm duyệt'
              }
              forceRender
              key="3"
              disabled={keyTab !== '3' && !edit}
            >
              <Form form={formChucNang} onFinish={onFinish}>
                <Row gutter={[16, 0]}>
                  <Col span={24}>
                    <Form.Item
                      name="duyetAlbumAnh"
                      label="Duyệt album ảnh"
                      // rules={[...rules.required]}
                      valuePropName="checked"
                      initialValue={edit ? newRecord?.duyetAlbumAnh : undefined}
                    >
                      <Switch defaultChecked disabled={disable} />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name="nhapSoLuongHocSinh"
                      label="Nhập số lượng học sinh khi lên thực đơn"
                      // rules={[...rules.required]}
                      valuePropName="checked"
                      initialValue={edit ? newRecord?.nhapSoLuongHocSinh : undefined}
                    >
                      <Switch defaultChecked disabled={disable} />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item>
                  <div style={{ textAlign: 'center' }}>
                    <Button
                      style={{ marginRight: '10px' }}
                      onClick={() => {
                        setKeyTab('2');
                        setEdit(true);
                      }}
                    >
                      Quay lại
                    </Button>
                    {edit && disable ? (
                      <Button type="primary" onClick={() => setKeyTab('4')}>
                        Bước tiếp theo
                      </Button>
                    ) : (
                      <Button type="primary" htmlType="submit">
                        Bước tiếp theo
                      </Button>
                    )}
                  </div>
                </Form.Item>
              </Form>
            </Tabs.TabPane>
          )}
          <Tabs.TabPane
            tab={
              edit && disable
                ? 'Thông tin hiệu trưởng'
                : edit
                ? 'Chỉnh sửa hiệu trưởng'
                : 'Thêm mới hiệu trưởng'
            }
            key="4"
            disabled={keyTab !== '4' && !edit}
          >
            <TaiKhoanHieuTruong
              edit={edit}
              idTruong={edit ? newRecord?._id : idTruong}
              disable={disable}
              expireDate={edit ? newRecord?.expireDate : expireDate}
              newRecord={newRecord}
            />
            <br />
            <Form.Item>
              <div style={{ textAlign: 'center' }}>
                {edit && !disable ? (
                  <>
                    <Button
                      style={{ marginRight: '10px' }}
                      onClick={() => {
                        setKeyTab('3');
                        handleEdit(newRecord);
                      }}
                    >
                      Quay lại
                    </Button>
                    {vaiTro === 'Admin' || vaiTro === 'SuperAdmin' ? (
                      <Button type="primary" htmlType="submit" onClick={onFinish}>
                        Bước tiếp theo
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        onClick={() => {
                          setVisibleDrawer(false);
                          setDisableLop(false);
                          setKeyTab('1');
                          message.success('Cập nhật thành công');
                        }}
                      >
                        Lưu
                      </Button>
                    )}
                  </>
                ) : !edit ? (
                  <>
                    <Button
                      style={{ marginRight: '10px' }}
                      onClick={() => {
                        setKeyTab('3');
                      }}
                    >
                      Quay lại
                    </Button>
                    {vaiTro === 'Admin' || vaiTro === 'SuperAdmin' ? (
                      <Button type="primary" htmlType="submit" onClick={onFinish}>
                        Bước tiếp theo
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        onClick={() => {
                          setVisibleDrawer(false);
                          setDisableLop(false);
                          setKeyTab('1');
                          message.success('Thêm mới thành công');
                        }}
                      >
                        Lưu
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button
                      style={{ marginRight: '10px' }}
                      onClick={() => {
                        setKeyTab('3');
                      }}
                    >
                      Quay lại
                    </Button>
                    {vaiTro === 'Admin' || vaiTro === 'SuperAdmin' ? (
                      <Button type="primary" htmlType="submit" onClick={onFinish}>
                        Bước tiếp theo
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        onClick={() => {
                          setVisibleDrawer(false);
                          setKeyTab('1');
                          setDisableLop(false);
                        }}
                      >
                        Đóng
                      </Button>
                    )}
                  </>
                )}
              </div>
            </Form.Item>
          </Tabs.TabPane>
          {(vaiTro === 'Admin' || vaiTro === 'SuperAdmin') && (
            <Tabs.TabPane
              tab={
                edit && disable
                  ? 'Thông tin chủ trường'
                  : edit
                  ? 'Chỉnh sửa chủ trường'
                  : 'Thêm mới chủ trường'
              }
              key="5"
              disabled={keyTab !== '5' && !edit}
            >
              <TaiKhoanChuTruong
                idTruong={edit ? newRecord?._id : idTruong}
                disable={disable}
                expireDate={edit ? newRecord?.expireDate : expireDate}
                newRecord={newRecord}
              />
              <br />
              <Form.Item>
                <div style={{ textAlign: 'center' }}>
                  {edit && !disable ? (
                    <>
                      <Button
                        style={{ marginRight: '10px' }}
                        onClick={() => {
                          setKeyTab('4');
                          handleEdit(newRecord);
                        }}
                      >
                        Quay lại
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => {
                          setVisibleDrawer(false);
                          setDisableLop(false);
                          setKeyTab('1');
                          message.success('Cập nhật thành công');
                        }}
                      >
                        Lưu
                      </Button>
                    </>
                  ) : !edit ? (
                    <>
                      <Button
                        style={{ marginRight: '10px' }}
                        onClick={() => {
                          setKeyTab('4');
                        }}
                      >
                        Quay lại
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => {
                          setVisibleDrawer(false);
                          setDisableLop(false);
                          setKeyTab('1');
                          message.success('Thêm mới thành công');
                        }}
                      >
                        Lưu
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        style={{ marginRight: '10px' }}
                        onClick={() => {
                          setKeyTab('4');
                        }}
                      >
                        Quay lại
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => {
                          setVisibleDrawer(false);
                          setKeyTab('1');
                          setDisableLop(false);
                        }}
                      >
                        Đóng
                      </Button>
                    </>
                  )}
                </div>
              </Form.Item>
            </Tabs.TabPane>
          )}
        </Tabs>
      </Drawer>
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
