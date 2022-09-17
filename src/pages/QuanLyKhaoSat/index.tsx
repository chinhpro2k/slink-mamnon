/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import { checkAllow } from '@/components/CheckAuthority';
import TableBase from '@/components/Table';
import type { KhaoSat as IKhaoSat } from '@/services/QuanLyKhaoSat';
import { delKhaoSat, kichHoatBieuMau } from '@/services/QuanLyKhaoSat/khaosat';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined, EyeOutlined, PieChartOutlined } from '@ant-design/icons';
import { Button, Divider, Drawer, Input, message, Popconfirm, Switch } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';
import FormViewDetail from './components/FormViewDetail';
import ThongKe from './components/ThongKe';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

const KhaoSat = () => {
  const initialStateModel = useModel('@@initialState');
  const {
    loading: loadingKhaoSat,
    getKhaoSatModel,
    total,
    page,
    limit,
    cond,
    setVisibleForm,
    setEdit,
    setRecord,
    edit,
    getResultKhaoSatModel,
    setCondition,
    setKhaoSatId
  } = useModel('khaosat');
  const [danhSachDonVi, setDanhSachDonVi] = useState([]);
  const [form, setForm] = useState<string>('edit');
  const [visibleThongKe, setVisibleThongKe] = useState<boolean>(false);
  const getData = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=100000`);
    setDanhSachDonVi(result?.data?.data?.result);
    if (initialStateModel?.initialState?.currentUser?.role?.systemRole === 'HieuTruong') {
      const danhSachLop = result?.data?.data?.result?.filter(
        (item) =>
          item?.parent === initialStateModel?.initialState?.currentUser?.role?.organizationId,
      );
      setCondition({
        ...cond,
        [`$or`]: [
          { donViId: danhSachLop?.map((item) => item?._id) },
          { donViTaoKhaoSatId: initialStateModel?.initialState?.currentUser?.role?.organizationId },
        ],
        // donViTaoKhaoSatId: initialStateModel?.initialState?.currentUser?.role?.organizationId,
      });
    }
  };

  React.useEffect(() => {
    getData();
  }, [initialStateModel?.initialState]);

  const handleChangeStatus = async (val: any) => {
    const newVal = val;
    newVal.trangThai = !newVal.trangThai;
    try {
      const res = await kichHoatBieuMau({ ...newVal });
      if (res?.status === 200) {
        message.success('Kích hoạt thành công');
        getKhaoSatModel();
        return true;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return false;
  };
  const handleEdit = (val: any) => {
    setForm('edit');
    setEdit(true);
    setRecord(val);
    setVisibleForm(true);
  };
  const handleDel = async (val: string) => {
    try {
      const res = await delKhaoSat({ id: val });
      if (res?.status === 200) {
        message.success('Xóa thành công');
        getKhaoSatModel();
        return true;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi');
      return false;
    }
    return false;
  };
  const handleView = (val: any) => {
    setForm('view');
    setVisibleForm(true);
    setEdit(true);
    setRecord(val);
  };

  const onCell = (record: IKhaoSat.Record) => ({
    onClick: () => {
      handleView(record);
    },
    style: { cursor: 'pointer' },
  });

  const renderLast1 = (record: IKhaoSat.Record) => {
    return (
      <React.Fragment>
        <Button
          type="default"
          shape="circle"
          onClick={() => handleView(record)}
          title="Xem chi tiết"
          disabled={!checkAllow('VIEW_KHAO_SAT')}
        >
          <EyeOutlined />
        </Button>
        <Divider type="vertical" />

        <Button
          type="primary"
          onClick={() => {
            setForm('statistic');
            setVisibleForm(true);
            setEdit(true);
            setRecord(record);
            setKhaoSatId(record._id)
            // getResultKhaoSatModel(record?._id);
          }}
          disabled={!checkAllow('STATISTIC_KHAO_SAT')}
          shape="circle"
        >
          <PieChartOutlined />
        </Button>
        <Divider type="vertical" />

        <Button
          type="default"
          shape="circle"
          onClick={() => handleEdit(record)}
          title="Chỉnh sửa"
          disabled={
            !checkAllow('EDIT_KHAO_SAT') || (checkAllow('EDIT_KHAO_SAT') && record?.trangThai)
          }
        >
          <EditOutlined />
        </Button>

        <Divider type="vertical" />

        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDel(record._id)}
          disabled={!checkAllow('DEL_KHAO_SAT')}
        >
          <Button type="primary" shape="circle" title="Xóa" disabled={!checkAllow('DEL_KHAO_SAT')}>
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      </React.Fragment>
    );
  };

  const columns: IColumn<IKhaoSat.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'tieuDe',
      align: 'center',
      width: 200,
      onCell,
      search: 'search',
      render: (val) => val ?? 'Không có',
    },
    {
      title: 'Đối tượng',
      dataIndex: 'donViId',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => {
        if (val.length === 0) {
          return 'Không có';
        }
        if (val.length === 1 && val[0] === '*') return 'Tất cả';
        let arr = [];
        val.map((item) => {
          danhSachDonVi.map((donVi) => {
            if (donVi?._id === item) {
              arr = arr.concat(
                `- ${donVi?.loaiDonVi === 'Lop' ? 'Lớp' : 'Trường'} ${donVi?.tenDonVi}`,
              );
            }
          });
        });
        return (
          <>
            {arr.map((item) => (
              <p>{item}</p>
            ))}
          </>
        );
      },
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'ngayBatDau',
      align: 'center',
      width: 150,
      onCell,
      search: 'sort',
      render: (val) => (val ? moment(val).format('HH:mm DD-MM-YYYY') : 'Không có'),
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'ngayKetThuc',
      align: 'center',
      width: 150,
      onCell,
      search: 'sort',
      render: (val) => (val ? moment(val).format('HH:mm DD-MM-YYYY') : 'Không có'),
    },
    {
      title: 'Số lượng câu hỏi',
      dataIndex: 'noiDungKhaoSat',
      align: 'center',
      width: 100,
      onCell,
      render: (val) => val?.length ?? 0,
    },
    {
      title: 'Số người tham gia',
      dataIndex: 'soNguoiTraLoi',
      align: 'center',
      width: 100,
      onCell,
      render: (val) => val ?? 0,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      align: 'center',
      width: '100px',
      render: (val: boolean, record) => (
        <Switch
          checkedChildren="Mở"
          unCheckedChildren="Đóng"
          checked={val}
          onChange={() => {
            handleChangeStatus(record);
          }}
        />
      ),
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: IKhaoSat.Record) => renderLast1(record),
      fixed: 'right',
      width: 200,
    },
  ];

  useEffect(() => {}, []);

  let formTable = Form;
  if (form === 'view' && edit) formTable = FormViewDetail;
  else if (form === 'statistic' && edit) formTable = ThongKe;
  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={getKhaoSatModel}
        dependencies={[page, limit, cond]}
        loading={loadingKhaoSat}
        modelName="khaosat"
        title="Danh sách các cuộc khảo sát"
        scroll={{ x: 1500 }}
        Form={formTable}
        formType="Drawer"
        widthDrawer="60%"
        hascreate={checkAllow('ADD_KHAO_SAT')}
      >
        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          Tổng số:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={total}
          />
        </h3>
      </TableBase>
      {/*<Drawer*/}
      {/*  width={'60%'}*/}
      {/*  onClose={() => {*/}
      {/*    setVisibleThongKe(false);*/}
      {/*  }}*/}
      {/*  destroyOnClose*/}
      {/*  footer={false}*/}
      {/*  bodyStyle={{ padding: 0 }}*/}
      {/*  visible={visibleThongKe}*/}
      {/*>*/}
      {/*  <ThongKe />*/}
      {/*</Drawer>*/}
    </>
  );
};

export default KhaoSat;
