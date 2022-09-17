/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable no-underscore-dangle */
import { checkAllow } from '@/components/CheckAuthority';
import TableBase from '@/components/Table';
import type { LichHoc as ILichHoc } from '@/services/LichHoc';
import { addLichHoc, delLichHoc, updLichHoc } from '@/services/LichHoc/lichhoc';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Drawer, Form, Input, message, notification } from 'antd';
import type { ColumnProps } from 'antd/lib/table';
import moment from 'moment';
import React, { useState } from 'react';
import { useModel } from 'umi';
import LichHocCalendar from './components/Calendar';

export const noiDungHoatDong = [
  {
    value: 'Đón trẻ',
    lable: 'Đón trẻ',
  },
  {
    value: 'Thể dục',
    lable: 'Thể dục',
  },
  {
    value: 'Ăn sáng',
    lable: 'Ăn sáng',
  },
  {
    value: 'Ăn phụ sáng',
    lable: 'Ăn phụ sáng',
  },
  {
    value: 'Chơi',
    lable: 'Chơi',
  },
  {
    value: 'Học trên lớp',
    lable: 'Học trên lớp',
  },
  {
    value: 'Học ngoài trời',
    lable: 'Học ngoài trời',
  },
  {
    value: 'Ăn trưa',
    lable: 'Ăn trưa',
  },
  {
    value: 'Vệ sinh',
    lable: 'Vệ sinh',
  },
  {
    value: 'Ngủ trưa',
    lable: 'Ngủ trưa',
  },
  {
    value: 'Ăn phụ chiều',
    lable: 'Ăn phụ chiều',
  },
  {
    value: 'Ăn chiều',
    lable: 'Ăn chiều',
  },
  {
    value: 'Hoạt động khác',
    lable: 'Hoạt động khác',
  },
  {
    value: 'Trả trẻ',
    lable: 'Trả trẻ',
  },
  {
    value: 'Học năng khiếu',
    label: 'Học năng khiếu',
  },
];

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const LichHoc = () => {
  const {
    loading: loadingQuanLyLop,
    getQuanLyLopModel,
    total: totalLop,
    page,
    limit,
    cond,
  } = useModel('quanlylop');
  const { danhSach: danhSachBaiHoc, getBaiHocModel } = useModel('baihoc');
  const { getMonHocModel } = useModel('monhoc');
  const [danhSachLop, setĐanhSachLop] = useState([]);
  const [visibleCalendar, setVisibleCalendar] = useState(false);
  const [danhSachTruong, setDanhSachTruong] = useState([]);
  const [record, setRecord] = useState<any>();

  const [form] = Form.useForm();
  const [newRecord, setNewRecord] = useState<any>(undefined);
  const [state, setstate] = useState<number>(0);
  const [noiDung, setNoiDung] = useState<string>();
  // const [baiHoc, setBaiHoc] = useState(undefined);
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const { getLichHocModel } = useModel('lichhoc');
  const closeForm = () => {
    setNewRecord(undefined);
    setVisibleDrawer(false);
    // setBaiHoc(undefined);
    setNoiDung(undefined);
    form.resetFields();
  };
  const changeNoiDung = (val: string) => {
    setNoiDung(val);
  };
  const handleEdit = (val: any) => {
    setNoiDung(val?.noiDungHoatDong ?? '');
    // setBaiHoc(val?.baiHoc);
    setEdit(true);
    setNewRecord(val);
    form.setFieldsValue({
      ...val,
      thoiGianKetThuc: moment(val?.thoiGianKetThuc),
      thoiGianBatDau: moment(val?.thoiGianBatDau),
      daHoanThanh: val?.daHoanThanh ?? false,
      chuongTrinhDaoTaoId: val?.baiHoc?.chuongTrinhDaoTao?._id ?? '',
    });
    setVisibleDrawer(true);
  };
  const handleAdd = () => {
    setNewRecord(undefined);
    form.resetFields();
    setEdit(false);
    setVisibleDrawer(true);
  };
  const onFinish = async (values: any) => {
    if (moment(values?.thoiGianBatDau).isAfter(moment(values?.thoiGianKetThuc))) {
      notification.error({
        message: 'Thời gian bắt đầu không sau thời gian kết thức',
        placement: 'bottomRight',
      });
      return;
    }
    values = {
      ...values,
      thoiGianBatDau: moment(values?.thoiGianBatDau).toISOString(),
      thoiGianKetThuc: moment(values?.thoiGianKetThuc).toISOString(),
    };
    if (edit) {
      // eslint-disable-next-line no-underscore-dangle
      const id = newRecord?._id;
      const res = await updLichHoc({ ...values, id });
      if (res?.data?.statusCode === 200) {
        message.success('Cập nhật thành công');
        getLichHocModel({ donViId: record?._id ?? '' });
        setVisibleDrawer(false);
        setNewRecord(undefined);
        return;
      }
      setVisibleDrawer(false);
      setNewRecord(undefined);
      message.error('Đã xảy ra lỗi');
      return;
    }
    let tenLop = '';
    danhSachLop.map((item: { _id: string; tenDonVi: string }) => {
      if (item?._id === values?.donViId) {
        tenLop = item?.tenDonVi ?? '';
      }
    });
    values = {
      ...values,
      tenLop,
    };
    const res = await addLichHoc({ ...values });
    if (res?.data?.statusCode === 201) {
      message.success('Thêm mới thành công');
      setstate(state + 1);
      getLichHocModel({ donViId: record?._id ?? '' });
      setVisibleDrawer(false);
      setNewRecord(undefined);
      return;
    }
    message.error('Đã xảy ra lỗi');
  };

  React.useEffect(() => {
    getMonHocModel({ page: 1, limit: 10000, cond: {} });
    const getDanhSachLop = async () => {
      const response = await axios.get(`${ip3}/don-vi/pageable/my/child`, {
        params: {
          page: 1,
          limit: 10000,
          cond: {
            loaiDonVi: 'Lop',
          },
        },
      });
      const tmpArr = response?.data?.data?.result ?? [];
      setĐanhSachLop(tmpArr);
    };
    const getDSTruong = async () => {
      const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=2000`, {
        params: {
          cond: {
            loaiDonVi: 'Truong',
          },
        },
      });
      setDanhSachTruong(result?.data?.data?.result);
    };
    getDanhSachLop();
    getDSTruong();
  }, []);
  const handleView = async (val: any) => {
    await getBaiHocModel({ page: 1, limit: 10000, donViId: val?._id ?? '' });
    setRecord(val);
    setVisibleCalendar(true);
  };

  const handleDel = async (val: ILichHoc.Record) => {
    // eslint-disable-next-line no-underscore-dangle
    const res = await delLichHoc({ id: val?._id });
    if (res?.status === 200) {
      message.success('Xóa thành công');
      getLichHocModel({ donViId: val?.donViId ?? '' });
      setVisibleDrawer(false);
      setNewRecord(undefined);
      return true;
    }
    message.error('Đã xảy ra lỗi');
    return false;
  };

  const renderLast = (value: ILichHoc.Record) => {
    return (
      <React.Fragment>
        <Button
          type="primary"
          shape="circle"
          onClick={() => {
            handleView(value);
          }}
          disabled={!checkAllow('VIEW_LICH_HOC')}
          title="Xem lịch"
        >
          <EyeOutlined />
        </Button>
      </React.Fragment>
    );
  };

  const columns: ColumnProps<ILichHoc.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Tên lớp',
      dataIndex: 'tenDonVi',
      align: 'center',
      width: 200,
    },
    {
      title: 'Đơn vị',
      dataIndex: 'parent',
      align: 'center',
      width: 200,
      render: (val) =>
        danhSachTruong?.map(
          (item: { _id: string; tenDonVi: string }) => item?._id === val && item?.tenDonVi,
        ),
    },
    {
      title: 'Độ tuổi của lớp (tháng)',
      dataIndex: 'doTuoi',
      align: 'center',
      width: 150,
    },
    {
      title: 'Số học sinh tối đa',
      dataIndex: 'sySo',
      align: 'center',
      width: 150,
    },
    {
      title: 'Số quản lý',
      dataIndex: 'soQuanLyToiDa',
      align: 'center',
      width: 130,
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (val: ILichHoc.Record) => renderLast(val),
      fixed: 'right',
      width: 100,
    },
  ];
  const daHoanThanh = form.getFieldValue('daHoanThanh');
  const checkXacNhan = () => {
    // const a = moment(form.getFieldValue('thoiGianKetThuc')).format('DD.MM/YYYY');
    if (moment().isAfter(moment(form.getFieldValue('thoiGianKetThuc'))) && daHoanThanh === false)
      return false;
    if (daHoanThanh === false) {
      return false;
    }
    return true;
  };
  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={getQuanLyLopModel}
        loading={loadingQuanLyLop}
        dependencies={[page, limit, cond]}
        modelName="quanlylop"
        title="Lịch học"
      >
        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          Tổng số:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={totalLop}
          />
        </h3>
      </TableBase>
      <Drawer
        title={`Lịch học lớp: ${record?.tenDonVi ?? ''}`}
        visible={visibleCalendar}
        destroyOnClose
        width="90%"
        onClose={() => {
          setVisibleCalendar(false);
          setRecord(undefined);
        }}
      >
        <LichHocCalendar
          handleEdit={handleEdit}
          handleAdd={handleAdd}
          selectedLop={record}
          danhSachLop={danhSachLop}
          visibleDrawer={visibleDrawer}
          edit={edit}
          closeForm={closeForm}
          onFinish={onFinish}
          formItemLayout={formItemLayout}
          newRecord={newRecord}
          record={record}
          noiDung={noiDung}
          noiDungHoatDong={noiDungHoatDong}
          changeNoiDung={changeNoiDung}
          form={form}
          // setBaiHoc={setBaiHoc}
          danhSachBaiHoc={danhSachBaiHoc}
          checkXacNhan={checkXacNhan}
          daHoanThanh={daHoanThanh}
          getLichHocModel={getLichHocModel}
          setVisibleDrawer={setVisibleDrawer}
          setNewRecord={setNewRecord}
          handleDel={handleDel}
        />
      </Drawer>

      {/* <Drawer
        visible={visibleDrawer}
        title={edit ? 'Chỉnh sửa' : 'Thêm mới'}
        onClose={() => closeForm()}
        destroyOnClose
        width="50%"
      >
        <FormCalendar
          onFinish={onFinish}
          formItemLayout={formItemLayout}
          newRecord={newRecord}
          record={record}
          danhSachLop={danhSachLop}
          noiDung={noiDung}
          noiDungHoatDong={noiDungHoatDong}
          changeNoiDung={changeNoiDung}
          form={form}
          setBaiHoc={setBaiHoc}
          danhSachBaiHoc={danhSachBaiHoc}
          edit={edit}
          checkXacNhan={checkXacNhan}
          daHoanThanh={daHoanThanh}
          closeForm={closeForm}
          getLichHocModel={getLichHocModel}
          setVisibleDrawer={setVisibleDrawer}
          setNewRecord={setNewRecord}
          handleDel={handleDel}
        />
        {edit && <div style={{ width: '100%' }} />}
      </Drawer> */}
    </>
  );
};

export default LichHoc;
