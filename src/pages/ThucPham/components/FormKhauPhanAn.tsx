/* eslint-disable no-underscore-dangle */
import Notification from '@/components/Notification';
import type { DanhMucMonAn as IDanhMucMonAn } from '@/services/DanhMucMonAn';
import { addKhauPhanAn, dieuChinhKhauPhanAn } from '@/services/KhauPhanAn/khauphanan';
import type { Truong as ITruong } from '@/services/Truong';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import rules from '@/utils/rules';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Spin,
  DatePicker as DatePickerAntd,
} from 'antd';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-multi-date-picker';
import DatePanel from 'react-multi-date-picker/plugins/date_panel';
import { history, useModel } from 'umi';
import MenuTinhToan from './MenuTinhToan';
import moment from 'moment';
import { message } from 'antd';
import { Format, getTongDonGia } from '../../../utils/utils';

const width100 = {
  width: '100%',
};

export const kiemTraThucPhamThieu = (arrSubmit, dsThucPhamTrongKho, recordDieuChinh, soHocSinh) => {
  let danhSachThieu = {};
  dsThucPhamTrongKho?.map((item) => {
    let checkTonTaiTrongKho = false;
    let khoiLuongTrongKho = item?.khoiLuong;
    arrSubmit?.map((ngayAn) => {
      ngayAn?.buaAn?.map((buaAn) => {
        buaAn?.monAn?.map((monAn) => {
          monAn?.thanhPhanMonAn?.map((thanhPhan) => {
            if (thanhPhan?.name === item?.ten) {
              if (khoiLuongTrongKho < thanhPhan?.dinhLuongDieuChinh * soHocSinh) {
                danhSachThieu = {
                  ...danhSachThieu,
                  [`${thanhPhan?.name}`]:
                    (danhSachThieu?.[`${thanhPhan?.name}`] ?? 0) +
                    thanhPhan?.dinhLuongDieuChinh * soHocSinh -
                    khoiLuongTrongKho,
                };
                khoiLuongTrongKho = 0;
              } else {
                khoiLuongTrongKho -= thanhPhan?.dinhLuongDieuChinh * soHocSinh;
              }
            }
          });
        });
      });
    });
  });
  return danhSachThieu;
};

const FormKhauPhanAn = (props: {
  thucDonMauType: boolean;
  taoThucDonMau: Function;
  donViThucDonMau: string;
  cancelTaoThucDonMau: Function;
}) => {
  const { taoThucDonMau, thucDonMauType, donViThucDonMau, cancelTaoThucDonMau } = props;
  const {
    loading,
    setVisibleForm,
    getKhauPhanAnModel,
    record,
    danhSachMonAn,
    setVisibleTinhToan,
    setRecordDieuChinh,
    visibleTinhToan,
    recordDieuChinh,
    danhSachTruong,
    loaiHinh,
    getKhauPhanAnNhaTreModel,
    setDanhSachTruong,
    setRecordReport,
    recordReport,
    dataEdit,
    edit,
  } = useModel('khauphanan');
  const [form] = Form.useForm();
  const [loadSubmit, setLoadSubmit] = useState<boolean>(false);
  const [dataSang, setDataSang] = useState<IDanhMucMonAn.Record>();
  const [dataPhuSang, setDataPhuSang] = useState<IDanhMucMonAn.Record>();
  const [dataTrua, setDataTrua] = useState<IDanhMucMonAn.Record[]>();
  const [dataChieu, setDataChieu] = useState<IDanhMucMonAn.Record>();
  const [dataPhuChieu, setDataPhuChieu] = useState<IDanhMucMonAn.Record>();
  const [checkSang, setCheckSang] = useState<boolean>(false);
  const [checkPhuSang, setCheckPhuSang] = useState<boolean>(false);
  const [checkTrua, setCheckTrua] = useState<boolean>(false);
  const [checkChieu, setCheckChieu] = useState<boolean>(false);
  const [checkPhuChieu, setCheckPhuChieu] = useState<boolean>(false);
  const [checkDisable, setCheckDisable] = useState<boolean>(true);
  const [soBua, setSoBua] = useState<number>();
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const vaiTro = localStorage.getItem('vaiTro');
  const [donViId, setDonViId] = useState<any>(organizationId);
  const [danhSachTPKho, setDanhSachTPKho] = useState([]);
  const [visibleDanhSachThieu, setVisibleDanhSachThieu] = useState(false);
  const [checkAddThucPham, setCheckAddThucPham] = useState(false);
  const [danhSachThucPhamThieu, setDanhSachThucPhamThieu] = useState([]);
  const [thu, setThu] = useState(1);
  const [soHocSinh, setSoHocSinh] = useState(1);
  const [xongDieuChinh, setXongDieuChinh] = useState(false);
  const gettruong = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=1000`, {
      params: {
        cond: {
          loaiDonVi: 'Truong',
        },
      },
    });

    setDanhSachTruong(result?.data?.data?.result);
  };

  const getDanhSachTPKho = async () => {
    const response = await axios.get(`${ip3}/kho-thuc-pham/search`);
    const arr = response?.data?.data?.filter((item) => item?.donViId === donViId);
    setDanhSachTPKho(arr);
    return arr;
  };

  const getThongTinKhauPhan = async () => {
    const result = await axios.get(`${ip3}/thong-tin-khau-phan-an/pageable?page=1&limit=20`, {
      params: {
        cond: {
          donViId,
          loaiHinh,
        },
      },
    });

    const data = result?.data?.data.result?.[0];
    setSoBua(data?.soBua);
    form.setFieldsValue({
      trietKhauTienAn: data?.trietKhauTienAn,
      soTienAn: data?.tienAn1Ngay,
      soBua: data?.soBua,
    });
  };

  const getThongTinThucDonTheoDonVi = () => {
    if (donViId) {
      getThongTinKhauPhan();
      getDanhSachTPKho();
    }
  };

  const getSoHocSinhBanDau = async () => {
    let a = record?.ngayAn;
    if (record.ngayAn && record?.ngayAn?.length && record?.ngayAn.length > 0) {
      const nam = moment(record?.ngayAn[0]?.toDate()).year();
      const thang = moment(record?.ngayAn[0]?.toDate()).month();
      const ngay = moment(record?.ngayAn[0]?.toDate()).date();
      const response = await axios.get(
        `${ip3}/xin-nghi-hoc/don-vi/${donViId}/nam/${nam}/thang/${thang}/ngay/${ngay}`,
      );
      let soHocSinh = 0;
      if (loaiHinh === 'M???m non') {
        soHocSinh = response?.data?.data?.soHocSinhMauGiao;
      } else {
        soHocSinh = response?.data?.data?.soHocSinhNhaTre;
      }
      setSoHocSinh(soHocSinh);
    }
  };

  React.useEffect(() => {
    gettruong();
    getSoHocSinhBanDau();
    if (taoThucDonMau) {
      if (donViThucDonMau) {
        setDonViId(donViThucDonMau);
        form.setFieldsValue({
          donViId: donViThucDonMau,
        });
      }
    }
  }, []);

  React.useEffect(() => {
    getThongTinThucDonTheoDonVi();
  }, [donViId]);

  const changeTruong = async (val: string) => {
    setDonViId(val);
  };

  const handleData = (val: IDanhMucMonAn.Record, id: any, bua: string) => {
    if (bua === 'tr??a') {
      const arrBuaTrua: IDanhMucMonAn.Record[] = [];
      id?.map((item: string) =>
        danhSachMonAn?.find(
          (data: IDanhMucMonAn.Record) => data?._id === item && arrBuaTrua.push(data),
        ),
      );
      const arrMonAn: any = {
        monAn: [],
        name: bua,
      };
      const checkMonAn = arrBuaTrua.find((item) => item?.ten.includes('C??m'));
      arrBuaTrua?.map((item, index1) => {
        const arrThanhPhanMonAn: any[] = [];
        item?.thanhPhanMonAn?.forEach((data) => {
          return arrThanhPhanMonAn?.push({
            name: data?.ten,
            idThucPham: data?._id,
            loaiThucPham: data?.loaiThucPham,
          });
        });
        if (checkMonAn) {
          return arrMonAn.monAn.push({
            thanhPhanMonAn: arrThanhPhanMonAn,
            name: item?.ten,
            idMonAn: id?.[index1],
            ...(item?.datatype === 'Kh??c' ? { donViId } : {}),
            weight: item?.ten.includes('C??m') ? 0.6 : 0.4 / (arrBuaTrua?.length - 1),
          });
        }
        return arrMonAn.monAn.push({
          thanhPhanMonAn: arrThanhPhanMonAn,
          name: item?.ten,
          idMonAn: id?.[index1],
          ...(item?.datatype === 'Kh??c' ? { donViId } : {}),
          weight: 1 / arrBuaTrua?.length,
        });
      });
      return arrMonAn;
    }
    const recordMonAn = danhSachMonAn?.find((item: { _id: string }) => item?._id === id);
    const arrThanhPhanMonAn: any[] = [];
    recordMonAn?.thanhPhanMonAn?.map((item: { ten: string; _id: string; loaiThucPham: string }) =>
      arrThanhPhanMonAn.push({
        name: item?.ten,
        idThucPham: item?._id,
        loaiThucPham: item?.loaiThucPham,
      }),
    );
    const arrMonAn = {
      monAn: [
        {
          ...(recordMonAn?.datatype === 'Kh??c' ? { donViId } : {}),
          thanhPhanMonAn: arrThanhPhanMonAn,
          name: recordMonAn?.ten,
          idMonAn: id,
          weight: 1,
        },
      ],
      name: bua,
    };

    return arrMonAn;
  };

  const changeBuaSang = (val: string) => {
    if (xongDieuChinh) {
      setCheckDisable(true);
      setXongDieuChinh(false);
    }
    setCheckSang(true);
    const recordBuaSang = danhSachMonAn?.find((item: { _id: string }) => item?._id === val);
    setDataSang(recordBuaSang);
  };
  const changeBuaPhuSang = (val: string) => {
    setCheckPhuSang(true);
    if (xongDieuChinh) {
      setCheckDisable(true);
      setXongDieuChinh(false);
    }
    const recordBuaPhuSang = danhSachMonAn?.find((item: { _id: string }) => item?._id === val);
    setDataPhuSang(recordBuaPhuSang);
  };
  const changeBuaTrua = (val: string[]) => {
    setCheckTrua(true);
    if (xongDieuChinh) {
      setCheckDisable(true);
      setXongDieuChinh(false);
    }
    const arrBuaTrua: IDanhMucMonAn.Record[] = [];
    val?.map((item) =>
      danhSachMonAn?.find(
        (data: IDanhMucMonAn.Record) => data?._id === item && arrBuaTrua.push(data),
      ),
    );
    console.log('arr trua', arrBuaTrua);
    setDataTrua(arrBuaTrua);
  };

  const changeBuaChieu = (val: string) => {
    setCheckChieu(true);
    if (xongDieuChinh) {
      setCheckDisable(true);
      setXongDieuChinh(false);
    }
    const recordBuaChieu = danhSachMonAn?.find((item: { _id: string }) => item?._id === val);
    setDataChieu(recordBuaChieu);
  };
  const changeBuaPhuChieu = (val: string) => {
    setCheckPhuChieu(true);
    if (xongDieuChinh) {
      setCheckDisable(true);
      setXongDieuChinh(false);
    }
    const recordBuaPhuChieu = danhSachMonAn?.find((item: { _id: string }) => item?._id === val);
    setDataPhuChieu(recordBuaPhuChieu);
  };

  const onFinish = async (values: any) => {
    const newVal = { ...values };
    console.log('new val', newVal);
    // X??? l?? data l??c ch???n m??n ??n
    let dataBuaSang;
    let dataBuaPhuSang;
    let dataBuaTr??a;
    let dataBuaChieu;
    let dataBuaPhuChieu;
    const arrBuaAn = [];
    if (newVal?.idBuaSang) {
      dataBuaSang = await handleData(newVal?.buaAn?.[0], newVal?.idBuaSang, 's??ng');
      arrBuaAn.push(dataBuaSang);
    }

    if (newVal?.idBuaPhuSang) {
      dataBuaPhuSang = await handleData(newVal?.buaAn?.[1], newVal?.idBuaPhuSang, 'ph??? s??ng');
      arrBuaAn.push(dataBuaPhuSang);
    }

    if (newVal?.idBuaTrua) {
      dataBuaTr??a = await handleData(newVal?.buaAn?.[2], newVal?.idBuaTrua, 'tr??a');
      arrBuaAn.push(dataBuaTr??a);
    }

    if (newVal?.idBuaChieu) {
      dataBuaChieu = await handleData(newVal?.buaAn?.[3], newVal?.idBuaChieu, 'chi???u');
      arrBuaAn.push(dataBuaChieu);
    }

    if (newVal?.idBuaPhuChieu) {
      dataBuaPhuChieu = await handleData(newVal?.buaAn?.[4], newVal?.idBuaPhuChieu, 'ph??? chi???u');
      arrBuaAn.push(dataBuaPhuChieu);
    }
    let danhSachTenMonAn = [];
    let flag = true;
    arrBuaAn.map((buaAn) => {
      buaAn?.monAn?.map((monAn) => {
        danhSachTenMonAn?.map((item) => {
          if (Format(monAn?.name) === Format(item)) {
            message.error('M??n ??n c??c b???a kh??ng ???????c tr??ng nhau');
            flag = false;
          }
        });
        if (flag) danhSachTenMonAn.push(monAn?.name);
      });
    });

    if (!flag) return;
    setLoadSubmit(true);
    newVal.buaAn = arrBuaAn;
    delete newVal.soBuaAn;
    delete newVal.idBuaSang;
    delete newVal.idBuaPhuSang;
    delete newVal.idBuaTrua;
    delete newVal.idBuaChieu;
    delete newVal.idBuaPhuChieu;

    if (vaiTro === 'HieuTruong') {
      newVal.donViId = organizationId;
    }

    if (checkDisable) {
      newVal.type = loaiHinh;
      newVal.giaTien = [
        newVal.soTienAn - (newVal.soTienAn * newVal.trietKhauTienAn) / 100,
        newVal.soTienAn,
      ];
      form.scrollToField('soTienAn');
      try {
        delete newVal.ngayAn;
        const res = await dieuChinhKhauPhanAn({ ...newVal });
        // ;
        if (res?.data?.data?.result?.length === 1 && res?.data?.data?.result?.[0].includes('OK')) {
          setCheckDisable(false);
          // ;
          setRecordDieuChinh(res?.data?.data);
          setRecordReport(res?.data?.data.report);
          setVisibleTinhToan(true);
          // Notification('success', 'Th???c ????n b???n ch???n kh??ng ch??nh x??c, vui l??ng ch???n l???i!');
        } else {
          // Notification('error', 'Th???c ????n b???n ch???n kh??ng ch??nh x??c, vui l??ng ch???n l???i!');
          Modal.confirm({
            title: 'C???nh b??o',
            content: (
              <div>
                <p>Th???c ????n b???n ch???n kh??ng ch??nh x??c. B???n c?? ch???c mu???n l??n th???c ????n?</p>
                {res?.data?.data?.result
                  ?.filter((item) => !item.includes('OK'))
                  ?.map((item) => (
                    <p>- {item}</p>
                  ))}
              </div>
            ),
            okText: '?????ng ??',
            onOk: () => {
              setCheckDisable(false);
              setVisibleTinhToan(true);
              setRecordDieuChinh(res?.data?.data);
              setRecordReport(res?.data?.data.report);
            },
            cancelText: 'H???y',
            onCancel: () => {
              setRecordDieuChinh(res?.data?.data);
              setVisibleTinhToan(true);
            },
          });
        }
        setXongDieuChinh(true);
        setLoadSubmit(false);
      } catch (error) {
        const { response }: any = error;
        if (response?.data?.errorCode === 'INVALID_FORMAT') {
          Notification('error', 'Th??nh ph???n m??n ??n l???i');
          setLoadSubmit(false);
          return false;
        }
        Notification('error', 'H??? th???ng ch??a ph???n h???i, vui l??ng th???c hi???n t??nh l???i!');
        setLoadSubmit(false);
        return false;
      }
    } else {
      const arrSubmit: any = [];
      let a = newVal.ngayAn;
      if (!taoThucDonMau) {
        // if (edit){
        //   arrSubmit.push({
        //     ngayAn: newVal?.ngayAn?.toDate?.().toISOString(),
        //     buaAn: recordDieuChinh?.buaAn,
        //     soTienAn: getTongDonGia(recordDieuChinh),
        //     donViId: newVal.donViId,
        //     loaiHinh,
        //     report: recordReport,
        //   });
        // }else {
        //   newVal?.ngayAn?.map((item: any) => {
        //     arrSubmit.push({
        //       ngayAn: item?.toDate?.().toISOString(),
        //       buaAn: recordDieuChinh?.buaAn,
        //       soTienAn: getTongDonGia(recordDieuChinh),
        //       donViId: newVal.donViId,
        //       loaiHinh,
        //       report: recordReport,
        //     });
        //   });
        // }
        newVal?.ngayAn?.map((item: any) => {
          arrSubmit.push({
            ngayAn: item?.toDate?.().toISOString(),
            buaAn: recordDieuChinh?.buaAn,
            soTienAn: getTongDonGia(recordDieuChinh),
            donViId: newVal.donViId,
            loaiHinh,
            report: recordReport,
          });
        });
      } else {
        arrSubmit.push({
          buaAn: recordDieuChinh?.buaAn,
          soTienAn: getTongDonGia(recordDieuChinh),
          donViId: newVal.donViId,
          loaiHinh,
          report: recordReport,
        });
      }
      // let danhSachThieu: string[] = [];
      // const dsThucPhamTrongKho = await getDanhSachTPKho();
      //
      // danhSachThieu = kiemTraThucPhamThieu(
      //   arrSubmit,
      //   dsThucPhamTrongKho,
      //   recordDieuChinh,
      //   soHocSinh,
      // );
      // if (!taoThucDonMau) {
      //   if (danhSachThieu.length > 0) {
      //     setDanhSachThucPhamThieu(danhSachThieu);
      //     setCheckAddThucPham(false);
      //     setVisibleDanhSachThieu(true);
      //     setLoadSubmit(false);
      //     return;
      //   }
      // }
      try {
        if (taoThucDonMau) {
          let a = thu;
          taoThucDonMau(arrSubmit[0], thu);
          return;
        }
        const res = await addKhauPhanAn([...arrSubmit]);
        if (res?.status === 201) {
          Notification('success', 'Th??m m???i kh???u ph???n ??n th??nh c??ng');
          setVisibleForm(false);
          if (loaiHinh === 'M???m non') getKhauPhanAnModel();
          if (loaiHinh === 'Nh?? tr???') getKhauPhanAnNhaTreModel();
          setLoadSubmit(false);
          return true;
        }
      } catch (error) {
        Notification('error', '???? x???y ra l???i');
        setLoadSubmit(false);
        return false;
      }
    }

    return false;
  };
  const handleConvertDataEditSingleSelect = (type: string): any => {
    const obj = {
      ...dataEdit?.buaAn?.filter((item) => {
        return item.name === type;
      })?.[0]?.monAn?.[0],
      thanhPhanMonAn: dataEdit?.buaAn
        ?.filter((item) => {
          return item.name === type;
        })?.[0]
        ?.monAn?.[0]?.thanhPhanMonAn?.map((val) => {
          return { ...val, ten: val?.name };
        }),
    };
    return obj;
  };
  const handleConvertDataEditMultiSelect = (type: string): any => {
    const arr = [
      ...dataEdit?.buaAn
        ?.filter((item) => {
          return item.name === type;
        })?.[0]
        ?.monAn?.map((val) => {
          return {
            ...val,
            ten: val.name,
            thanhPhanMonAn: val.thanhPhanMonAn?.map((val2) => {
              return { ...val2, ten: val2.name };
            }),
          };
        }),
    ];
    return arr;
  };
  useEffect(() => {
    if (edit) {
      setCheckSang(true);
      // @ts-ignore
      setDataSang(handleConvertDataEditSingleSelect('s??ng'));

      setCheckPhuSang(true);
      // @ts-ignore
      setDataPhuSang(handleConvertDataEditSingleSelect('ph??? s??ng'));

      setCheckTrua(true);
      // @ts-ignore
      setDataTrua(handleConvertDataEditMultiSelect('tr??a'));
      setCheckChieu(true);
      // @ts-ignore
      setDataChieu(handleConvertDataEditSingleSelect('chi???u'));
      setCheckPhuChieu(true);
      // @ts-ignore
      setDataPhuChieu(handleConvertDataEditSingleSelect('ph??? chi???u'));
    }
  }, [dataEdit]);
  return (
    <>
      <Modal
        width={500}
        visible={visibleDanhSachThieu}
        onCancel={() => {
          setVisibleDanhSachThieu(false);
          setCheckAddThucPham(false);
          // getThongTinThucDonTheoDonVi();
        }}
        title="Danh s??ch th???c ph???m thi???u"
        footer={
          <>
            <Button
              onClick={() => {
                setVisibleDanhSachThieu(false);
                setCheckAddThucPham(false);
                // if (checkAddThucPham) {
                //   getThongTinThucDonTheoDonVi();
                // }
              }}
            >
              H???y
            </Button>
            <Button
              type="primary"
              onClick={() => {
                if (!checkAddThucPham) {
                  setCheckAddThucPham(true);
                  window.open('/quanlythucpham/thucphamkho');
                }
                if (checkAddThucPham) {
                  setVisibleDanhSachThieu(false);
                  setCheckAddThucPham(false);
                  // getThongTinThucDonTheoDonVi();
                }
              }}
            >
              {checkAddThucPham ? '???? th??m th???c ph???m v??o kho' : 'Th??m th???c ph???m v??o kho'}
            </Button>
          </>
        }
      >
        <Row>
          {danhSachThucPhamThieu.map((item, index) => (
            <Col key={index} span={24}>
              - {item}
            </Col>
          ))}
        </Row>
      </Modal>
      <Card title="T??nh to??n th???c ????n">
        <Spin spinning={loadSubmit} tip="??ang th???c hi???n t??nh to??n..." size="large">
          {taoThucDonMau && thucDonMauType && (
            <Form.Item label="Th???">
              <Select
                placeholder="Th??? ..."
                style={{ width: 100 }}
                defaultValue={thu}
                onChange={(value) => {
                  setThu(value);
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                  <Select.Option value={item}>
                    {
                      ['Th??? hai', 'Th??? ba', 'Th??? t??', 'Th??? n??m', 'Th??? s??u', 'Th??? b???y', 'Ch??? nh???t'][
                        item - 1
                      ]
                    }
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form
            labelCol={{ span: 24 }}
            onFinish={onFinish}
            form={form}
            initialValues={record}
            scrollToFirstError
          >
            {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
              <Form.Item
                name="donViId"
                label="Tr?????ng"
                rules={[...rules.required]}
                style={{ marginBottom: 5 }}
              >
                <Select
                  showSearch
                  allowClear
                  style={{ width: '100%' }}
                  placeholder="Ch???n tr?????ng"
                  optionFilterProp="children"
                  filterOption={(input, option: any) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={changeTruong}
                  disabled={taoThucDonMau !== undefined}
                >
                  {danhSachTruong?.map((item: ITruong.Record) => (
                    <Select.Option key={item?._id} value={item?._id}>
                      {item?.tenDonVi}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
            {!taoThucDonMau  && (
              <Form.Item
                name="ngayAn"
                label="Ng??y ??n"
                rules={[...rules.required]}
                style={{ marginBottom: 5 }}
              >
                <DatePicker
                  style={{
                    height: '30px',
                    borderRadius: '2px',
                    padding: '2px 10px',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                  containerStyle={{
                    width: '100%',
                  }}
                  multiple
                  plugins={[<DatePanel />]}
                  format="DD/MM/YYYY"
                  sort
                  placeholder="Ch???n ng??y ??n"
                  onChange={async (arr) => {
                    if (arr && arr?.length && arr?.length > 0) {
                      // let arrAsync = arr?.map(async (item) => {
                      //   const nam = moment(item?.toDate()).year();
                      //   const thang = moment(item?.toDate()).month();
                      //   const ngay = moment(item?.toDate()).date();
                      //   const response = await axios.get(
                      //     `${ip3}/xin-nghi-hoc/don-vi/${donViId}/nam/${nam}/thang/${thang}/ngay/${ngay}`,
                      //   );
                      //   return response?.data?.data?.soHocSinhDiHoc;
                      // });
                      // Promise.all(arrAsync).then((data) => {
                      //   let count = 0;
                      //   data?.map((item) => {
                      //     count += item;
                      //   });
                      //   setSoHocSinh(count);
                      // });
                      const nam = moment(arr[0]?.toDate()).year();
                      const thang = moment(arr[0]?.toDate()).month();
                      const ngay = moment(arr[0]?.toDate()).date();
                      const response = await axios.get(
                        `${ip3}/xin-nghi-hoc/don-vi/${donViId}/nam/${nam}/thang/${thang}/ngay/${ngay}`,
                      );
                      let soHocSinh = 0;
                      if (loaiHinh === 'M???m non') {
                        soHocSinh = response?.data?.data?.soHocSinhMauGiao;
                      } else {
                        soHocSinh = response?.data?.data?.soHocSinhNhaTre;
                      }
                      setSoHocSinh(soHocSinh);
                    } else {
                      setSoHocSinh(1);
                    }
                  }}
                />
              </Form.Item>
            )}
            {/*{edit && (*/}
            {/*  <Form.Item*/}
            {/*    name="ngayAn"*/}
            {/*    label="Ng??y ??n"*/}
            {/*    rules={[...rules.required]}*/}
            {/*    style={{ marginBottom: 5 }}*/}
            {/*    initialValue={moment(dataEdit?.ngayAn)}*/}
            {/*  >*/}
            {/*    <DatePickerAntd value={moment(dataEdit?.ngayAn)} disabled />*/}
            {/*  </Form.Item>*/}
            {/*)}*/}
            <Row gutter={[16, 0]}>
              <Col xs={24} lg={8}>
                <Form.Item
                  name="soTienAn"
                  label="S??? ti???n ??n/ng??y"
                  rules={[...rules.required]}
                  style={{ marginBottom: 5 }}
                >
                  <InputNumber
                    placeholder="Nh???p s??? ti???n ??n/ng??y"
                    style={width100}
                    min={10000}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={8}>
                <Form.Item
                  name="soBua"
                  label="S??? b???a ??n"
                  rules={[...rules.required]}
                  style={{ marginBottom: 5 }}
                >
                  <Select placeholder="Ch???n s??? b???a ??n" disabled />
                </Form.Item>
              </Col>
              <Col xs={24} lg={8}>
                <Form.Item
                  name="trietKhauTienAn"
                  label="Tri???t kh???u ti???n ??n/ng??y"
                  rules={[...rules.required]}
                  style={{ marginBottom: 5 }}
                >
                  <InputNumber
                    placeholder="Nh???p tri???t kh???u ti???n ??n/ngay"
                    min={0}
                    style={width100}
                    formatter={(value) => `${value}%`}
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider plain>
              <b>Th???c ????n</b>
            </Divider>
            {soBua === 5 && (
              <>
                <Row gutter={[16, 0]}>
                  <Col xs={24} lg={24}>
                    <Form.Item
                      name="idBuaSang"
                      label="B???a s??ng"
                      style={{ marginBottom: 5 }}
                      rules={[...rules.required]}
                      initialValue={
                        edit
                          ? dataEdit?.buaAn?.filter((item) => {
                              return item.name === 's??ng';
                            })?.[0].monAn?.[0].idMonAn
                          : undefined
                      }
                    >
                      <Select
                        onChange={changeBuaSang}
                        placeholder="Ch???n b???a s??ng"
                        showSearch
                        filterOption={(input, option: any) =>
                          option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        optionFilterProp="children"
                        allowClear
                      >
                        {danhSachMonAn?.map((item: IDanhMucMonAn.Record) => (
                          <Select.Option key={item?._id} value={item?._id}>
                            {item?.ten}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                {checkSang && (
                  <Card bordered>
                    <Row gutter={[16, 0]}>
                      {dataSang &&
                        dataSang?.thanhPhanMonAn?.map((item) => (
                          <Col lg={8} xs={12}>
                            <Form.Item label="Th??nh ph???n m??n ??n" style={{ marginBottom: 5 }}>
                              <Input value={item?.ten} disabled />
                            </Form.Item>
                          </Col>
                        ))}
                    </Row>
                  </Card>
                )}
              </>
            )}
            {(soBua === 5 || soBua === 4) && (
              <>
                <Row gutter={[16, 0]}>
                  <Col xs={24} lg={24}>
                    <Form.Item
                      name="idBuaPhuSang"
                      label="B???a ph??? s??ng"
                      style={{ marginBottom: 5 }}
                      rules={[...rules.required]}
                      initialValue={
                        edit
                          ? dataEdit?.buaAn?.filter((item) => {
                              return item.name === 'ph??? s??ng';
                            })?.[0].monAn?.[0].idMonAn
                          : undefined
                      }
                    >
                      <Select
                        placeholder="Ch???n b???a ph??? s??ng"
                        showSearch
                        filterOption={(input, option: any) =>
                          option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        optionFilterProp="children"
                        onChange={changeBuaPhuSang}
                        allowClear
                      >
                        {danhSachMonAn?.map((item: IDanhMucMonAn.Record) => (
                          <Select.Option key={item?._id} value={item?._id}>
                            {item?.ten}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                {checkPhuSang && (
                  <Card bordered>
                    <Row gutter={[16, 0]}>
                      <>
                        {dataPhuSang &&
                          dataPhuSang?.thanhPhanMonAn?.map((item) => (
                            <Col lg={8} xs={12}>
                              <Form.Item label="Th??nh ph???n m??n ??n" style={{ marginBottom: 5 }}>
                                <Input value={item?.ten} disabled />
                              </Form.Item>
                            </Col>
                          ))}
                      </>
                    </Row>
                  </Card>
                )}
              </>
            )}
            <Row gutter={[16, 0]}>
              <Col xs={24} lg={24}>
                <Form.Item
                  name="idBuaTrua"
                  label="B???a tr??a"
                  style={{ marginBottom: 5 }}
                  rules={[...rules.required]}
                  initialValue={
                    edit
                      ? dataEdit?.buaAn
                          ?.filter((item) => {
                            return item.name === 'tr??a';
                          })?.[0]
                          ?.monAn?.map((value) => {
                            return value.idMonAn;
                          })
                      : undefined
                  }
                >
                  <Select
                    placeholder="Ch???n b???a tr??a"
                    showSearch
                    filterOption={(input, option: any) =>
                      option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    optionFilterProp="children"
                    onChange={changeBuaTrua}
                    mode="multiple"
                    allowClear
                  >
                    {danhSachMonAn?.map((item: IDanhMucMonAn.Record) => (
                      <Select.Option key={item?._id} value={item?._id}>
                        {item?.ten}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            {checkTrua && (
              <Card bordered>
                <Row gutter={[16, 0]}>
                  {dataTrua &&
                    dataTrua?.map((val) => {
                      return (
                        <Card
                          style={{ marginBottom: 10, width: '100%' }}
                          title={<div>{val?.ten}</div>}
                        >
                          <Row gutter={[16, 0]}>
                            {val?.thanhPhanMonAn?.map((item) => (
                              <Col lg={8} xs={12}>
                                <Form.Item label="Th??nh ph???n m??n ??n" style={{ marginBottom: 5 }}>
                                  <Input value={item?.ten} disabled />
                                </Form.Item>
                              </Col>
                            ))}
                          </Row>
                        </Card>
                      );
                    })}
                </Row>
              </Card>
            )}
            <Row gutter={[16, 0]}>
              <Col xs={24} lg={24}>
                <Form.Item
                  name="idBuaChieu"
                  label="B???a chi???u"
                  style={{ marginBottom: 5 }}
                  rules={[...rules.required]}
                  initialValue={
                    edit
                      ? dataEdit?.buaAn?.filter((item) => {
                          return item.name === 'chi???u';
                        })?.[0].monAn?.[0].idMonAn
                      : undefined
                  }
                >
                  <Select
                    placeholder="Ch???n b???a chi???u"
                    showSearch
                    filterOption={(input, option: any) =>
                      option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    optionFilterProp="children"
                    onChange={changeBuaChieu}
                    allowClear
                  >
                    {danhSachMonAn?.map((item: IDanhMucMonAn.Record) => (
                      <Select.Option key={item?._id} value={item?._id}>
                        {item?.ten}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            {checkChieu && (
              <Card bordered>
                <Row gutter={[16, 0]}>
                  {dataChieu &&
                    dataChieu?.thanhPhanMonAn?.map((item) => (
                      <Col xs={12} lg={8}>
                        <Form.Item label="Th??nh ph???n m??n ??n" style={{ marginBottom: 5 }}>
                          <Input value={item?.ten} disabled />
                        </Form.Item>
                      </Col>
                    ))}
                </Row>
              </Card>
            )}
            {soBua !== 2 && (
              <>
                <Row gutter={[16, 0]}>
                  <Col xs={24} lg={24}>
                    <Form.Item
                      name="idBuaPhuChieu"
                      label="B???a ph??? chi???u"
                      style={{ marginBottom: 5 }}
                      rules={[...rules.required]}
                      initialValue={
                        edit
                          ? dataEdit?.buaAn?.filter((item) => {
                              return item.name === 'ph??? chi???u';
                            })?.[0].monAn?.[0].idMonAn
                          : undefined
                      }
                    >
                      <Select
                        placeholder="Ch???n b???a ph??? chi???u"
                        showSearch
                        filterOption={(input, option: any) =>
                          option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        optionFilterProp="children"
                        onChange={changeBuaPhuChieu}
                        allowClear
                      >
                        {danhSachMonAn?.map((item: IDanhMucMonAn.Record) => (
                          <Select.Option key={item?._id} value={item?._id}>
                            {item?.ten}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                {checkPhuChieu && (
                  <Card bordered>
                    <Row gutter={[16, 0]}>
                      {dataPhuChieu &&
                        dataPhuChieu?.thanhPhanMonAn?.map((item) => (
                          <Col xs={12} lg={8}>
                            <Form.Item label="Th??nh ph???n m??n ??n" style={{ marginBottom: 5 }}>
                              <Input value={item?.ten} disabled />
                            </Form.Item>
                          </Col>
                        ))}
                    </Row>
                  </Card>
                )}
              </>
            )}

            <Divider />
            <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
              <Button
                loading={loading}
                style={{ marginRight: 15 }}
                htmlType="submit"
                type="default"
                disabled={!checkDisable}
              >
                T??nh to??n
              </Button>
              <Button
                loading={loading}
                style={{ marginRight: 15 }}
                htmlType="submit"
                type="primary"
                disabled={checkDisable}
              >
                Th??m m???i
              </Button>
              <Button
                onClick={() => {
                  if (taoThucDonMau) {
                    cancelTaoThucDonMau(false);
                  } else {
                    setVisibleForm(false);
                  }
                }}
              >
                ????ng
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
      <Modal
        title="T??nh to??n kh???u ph???n ??n"
        visible={visibleTinhToan}
        footer={<Button onClick={() => setVisibleTinhToan(false)}>Ok</Button>}
        onCancel={() => setVisibleTinhToan(false)}
        width="70%"
      >
        <MenuTinhToan soHocSinh={soHocSinh} soNgayAn={form.getFieldValue('ngayAn')} />
      </Modal>
    </>
  );
};
export default FormKhauPhanAn;
