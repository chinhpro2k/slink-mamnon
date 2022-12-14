/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import UploadAnh from '@/components/Upload/UploadAnh';
import styles from '@/pages/QuanLyKhaoSat/components/block.css';
import { addFormDanhGia, updFormDanhGia } from '@/services/FormDanhGia/formdanhgia';
import { upload } from '@/services/UploadAnh/upload';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import rules from '@/utils/rules';
import { renderFileListUrl } from '@/utils/utils';
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Radio,
  Row,
  Select,
  Image,
  Spin,
  Checkbox,
  DatePicker,
  TimePicker,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import DaySelect from '@/pages/ThongBao/components/daySelect';
import { IResData } from '@/pages/ThongBao/components/Form';
import moment from 'moment';
import {createAlbumAnh, updateAlbumAnh} from "@/services/AlbumAnh/albumanh";

const FormCreate = () => {
  const [form] = Form.useForm();
  const { edit, loading, record, setVisibleForm, getAlbumAnhModel } = useModel('albumanh');
  const vaiTro = localStorage.getItem('vaiTro');
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [dsTruong, setDsTruong] = useState([]);
  const [dsLop, setDsLop] = useState([]);
  const [dsDonVi, setDsDonVi] = useState([]);
  const [idTruong, setIdTruong] = useState<string>();
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [disableSelectLop, setDisableSelectLop] = useState<string>(
    edit && record?.donViId?.[0] === '*'
      ? 'DisableSelectMulti'
      : edit && record?.donViId?.[0] !== '*'
      ? 'DisableSelectAll'
      : '',
  );
  const [dataRepeat, setDataRepeat] = useState<IResData>();
  const [selected, setSelected] = useState<'KHONG_LAP' | 'HANG_TUAN' | 'HANG_THANG'>('KHONG_LAP');
  const handleChangeSelectRepeat = (value: string) => {
    setSelected(value);
  };
  const onChangeCheckBox = (e: any) => {
    setIsRepeat(e.target.checked);
  };
  const handleChoseRepeat = (value: any, date: string) => {
    const obj: IResData = {
      repeat: selected,
      dayRepeat: date,
      thoiGianGuiTB: value.thoiGianGuiTB,
    };
    setDataRepeat(obj);
  };
  const getTruong = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=100`);
    setDsDonVi(result?.data?.data?.result);
    const arrTruong: any = [];
    result?.data?.data?.result?.map((item: { loaiDonVi: string }) =>
      item?.loaiDonVi === 'Truong' ? arrTruong.push(item) : undefined,
    );
    setDsTruong(arrTruong);
  };

  const getLop = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable/my/child?page=1&limit=1000`, {
      params: {
        cond: {
          loaiDonVi: 'Lop',
          parent: record?.donViTaoDanhGiaId,
        },
      },
    });
    setDsLop(result?.data?.data?.result);
  };

  React.useEffect(() => {
    getTruong();
    if (vaiTro === 'HieuTruong' || edit) getLop();
  }, []);

  const changeIdTruong = (val: string) => {
    setIdTruong(val);
    form.setFieldsValue({
      donViId: undefined,
      loaiLop: undefined,
    });
    const arrLop: any = [];
    dsDonVi?.map((item: { parent: string }) =>
      item?.parent === val ? arrLop.push(item) : undefined,
    );
    setDsLop(arrLop);
    setDisableSelectLop('');
  };

  const changeDisable = (val: string[]) => {
    if (val?.length === 0) {
      setDisableSelectLop('');
    } else {
      val?.map((item) =>
        item === '*'
          ? setDisableSelectLop('DisableSelectMulti')
          : setDisableSelectLop('DisableSelectAll'),
      );
    }
  };
  const handleCheckValidate = (data: any): boolean => {
    let check: boolean = false;
    if (Array.isArray(data)) {
      data.forEach((val: any, index) => {
        if (val?.cauTraLoi) {
          for (let i = 0; i < val?.cauTraLoi?.length - 1; ++i) {
            for (let j = i + 1; j < val?.cauTraLoi?.length; ++j) {
              if (val.cauTraLoi?.[i]?.luaChon == val.cauTraLoi?.[j]?.luaChon) {
                message.warn(`C??u tr??? l???i kh??ng th??? gi???ng nhau t???i c??u h???i ${index + 1}`);
                check = true;
              }
            }
          }
        }
        if (val?.hang && val?.cot) {
          for (let i = 0; i < val?.hang?.length - 1; ++i) {
            for (let j = i + 1; j < val?.hang?.length; ++j) {
              if (val?.hang?.[i] == val?.hang?.[j]) {
                message.warn(`B??? tr??ng h??ng t???i c??u h???i ${index + 1}`);
                check = true;
              }
            }
          }
          for (let i = 0; i < val?.cot?.length - 1; ++i) {
            for (let j = i + 1; j < val?.cot?.length; ++j) {
              if (val?.cot?.[i] == val?.cot?.[j]) {
                message.warn(`B??? tr??ng c???t t???i c??u h???i ${index + 1}`);
                check = true;
              }
            }
          }
        }
      });
    }
    return check;
  };
  const onFinish = async (values: any) => {
    const newVal = values;
    // X??? l?? t???i img l??n
    if (newVal.anhDaiDien?.fileList?.length > 0 && !newVal.anhDaiDien?.fileList[0]?.url) {
      const result = await upload(newVal.anhDaiDien);
      newVal.anhDaiDien = result.data?.data?.url;
    } else {
      newVal.anhDaiDien = newVal.anhDaiDien?.fileList?.[0]?.url;
    }
    if (newVal.chuKy?.fileList?.length > 0 && !newVal.chuKy?.fileList[0]?.url) {
      const result = await upload(newVal.chuKy);
      newVal.chuKy = result.data?.data?.url;
    } else {
      newVal.chuKy = newVal.chuKy?.fileList?.[0]?.url;
    }
    if (edit) {
      try {
        setLoadingSubmit(true);
        const res = await updateAlbumAnh(record?._id,{...newVal});
        if (res?.status === 200) {
          message.success('C???p nh???t ????nh gi?? th??nh c??ng');
          setVisibleForm(false);
          getAlbumAnhModel();
          setLoadingSubmit(false);
          return true;
        }
      } catch (error) {
        message.error('C???p nh???t ????nh gi?? kh??ng th??nh c??ng');
        setLoadingSubmit(false);
        return false;
      }
    }
    try {
      setLoadingSubmit(true);
      const res = await createAlbumAnh({ ...newVal });
      if (res?.status === 201) {
        message.success('T???o ????nh gi?? th??nh c??ng');
        setVisibleForm(false);
        getAlbumAnhModel();
        setLoadingSubmit(false);
        return true;
      }
    } catch (error) {
      message.error('T???o ????nh gi?? kh??ng th??nh c??ng');
      setLoadingSubmit(false);
    }
    return true;
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const [typeDate, setTypeDate] = useState<string>();
  const [isDate, setIsDate] = useState<boolean>(false);
  const onChangeRating = (value: 'Ng??y' | 'Tu???n' | 'Th??ng') => {
    switch (value) {
      case 'Ng??y':
        setIsDate(true);
        setSelected('KHONG_LAP');
        setTypeDate('date');
        break;
      case 'Th??ng':
        setIsDate(true);
        setSelected('HANG_THANG');
        setTypeDate('month');
        break;
      case 'Tu???n':
        setIsDate(false);
        setSelected('HANG_TUAN');
        setTypeDate('date');
        break;
    }
  };
  const onChangeDate = (date: any, dateString: string) => {
    console.log('date', date);
    console.log('date string', dateString);
  };
  const onChangeTime = (time: any) => {
    console.log('time', time);
  };
  useEffect(() => {
    if (record?.dotDanhGia) {
      onChangeRating(record?.dotDanhGia);
    }
  }, [record]);
  return (
    <Card title={edit ? 'Ch???nh s???a' : 'Th??m m???i'}>
      <Spin spinning={loadingSubmit}>
        <Form
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          labelCol={{ span: 24 }}
          form={form}
        >
          <Form.Item
            name="ten"
            label="T??n"
            rules={[...rules.required, ...rules.text, ...rules.length(100)]}
            initialValue={record?.name}
            style={{ marginBottom: 5 }}
          >
            <Input placeholder="T??n" disabled={record?.repeat} />
          </Form.Item>
          <Form.Item
            name="moTa"
            label="M?? t???"
            rules={[...rules.length(255)]}
            initialValue={record?.moTa}
            style={{ marginBottom: 5 }}
          >
            <Input.TextArea rows={3} placeholder="M?? t???" />
          </Form.Item>

          <Form.Item
            name="image"
            label="???nh"
            // rules={[...rules.fileRequired]}
            style={{ marginBottom: 5 }}
            initialValue={edit ? renderFileListUrl(record?.chuKy) : undefined}
          >
            {edit ? (
              <Avatar shape="square" size={100} src={<Image src={record?.chuKy} />} />
            ) : (
              <UploadAnh />
            )}
          </Form.Item>

          <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
            <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
              {!edit ? 'Th??m m???i' : 'L??u'}
            </Button>
            <Button onClick={() => setVisibleForm(false)}>????ng</Button>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
};
export default FormCreate;
