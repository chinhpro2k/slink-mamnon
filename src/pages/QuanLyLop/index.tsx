/* eslint-disable no-underscore-dangle */
import { checkAllow } from '@/components/CheckAuthority';
import TableBase from '@/components/Table';
import type { QuanLyLop as IQuanLyLop } from '@/services/QuanLyLop';
import { addQuanLyLop, delQuanLyLop, updQuanLyLop } from '@/services/QuanLyLop/quanlylop';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import rules from '@/utils/rules';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleFilled } from '@ant-design/icons';
import { DrawerForm, ProFormDigit, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { Button, Divider, Input, message, Popconfirm, Select, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { history, useModel } from 'umi';

const QuanLyLop = () => {
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [danhSachCT, setDanhSachCT] = useState([]);
  const [danhSachCTNew, setDanhSachCTNew] = useState([]);
  const [danhSachTruong, setDanhSachTruong] = useState([]);
  const [arrDonVi, setArrDonVi] = useState<any[]>([]);
  const [newRecord, setNewRecord] = useState<IQuanLyLop.Record>();
  const {
    loading: loadingQuanLyLop,
    getQuanLyLopModel,
    total,
    page,
    limit,
    cond,
    setCondition,
    setPage,
  } = useModel('quanlylop');
  const { record: dataRecord, setRecord: setRecordQuanLyLop } = useModel('quanlylop');
  const vaiTro = localStorage.getItem('vaiTro');
  const { initialState } = useModel('@@initialState');
  const parent = initialState?.currentUser?.role?.organizationId;
  const [donViId, setDonViId] = useState<string | undefined>(parent);
  const [recordTruong, setRecordTruong] = useState<IQuanLyLop.Record>();
  const [idPPGD, setIdPPGD] = useState<string>();
  const [totalLop, setTotalLop] = useState<number>();
  const [idTruong, setIdTruong] = useState<string>('Tất cả');

  const getDSCT = async () => {
    // if ((vaiTro === 'GiaoVien' || vaiTro === 'HieuTruong') && !edit) {
    //   const result = await axios.get(`${ip3}/chuong-trinh-dao-tao/pageable?page=1&limit=100`, {
    //     params: {
    //       cond: {
    //         donViId: parent,
    //       },
    //     },
    //   });
    //   setDanhSachCTNew(result?.data?.data?.result);
    // } else {
    //   const result = await axios.get(`${ip3}/chuong-trinh-dao-tao/pageable?page=1&limit=100`);
    //   setDanhSachCT(result?.data?.data?.result);
    // }
    const result = await axios.get(`${ip3}/chuong-trinh-dao-tao/pageable?page=1&limit=100000`);
    setDanhSachCT(result?.data?.data?.result);
    setDanhSachCTNew(result?.data?.data?.result);
  };

  const getDSTruong = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=1000000`);
    const arrTruong: any = [];
    result?.data?.data?.result?.map(
      (item: { loaiDonVi: string }) => item?.loaiDonVi === 'Truong' && arrTruong?.push(item),
    );
    setDanhSachTruong(arrTruong);
    const arrDV = [];
    arrDV.push({ tenDonVi: 'Tất cả các trường', _id: 'Tất cả' });
    arrDV.push(...arrTruong);
    setArrDonVi(arrDV);
    setRecordTruong(
      result?.data?.data?.result?.find(
        (item: { _id: string }) => item?._id === parent || item?._id === donViId,
      ),
    );
    const arrLop = [];
    result?.data?.data?.result?.map(
      (item: { parent: string }) => item?.parent === parent && arrLop?.push(item),
    );

    setTotalLop(arrLop?.length);
    if (dataRecord?.idTruong) setIdTruong(dataRecord?.idTruong);
  };

  const onChange = (value: string) => {
    setCondition({ _id: value });
    setDonViId(value);
    setPage(1);
    setIdTruong(value);
  };

  const handleEdit = async (record: IQuanLyLop.Record) => {
    setVisibleDrawer(true);
    setEdit(true);
    setNewRecord(record);
    const newArr: any = [];
    let a = danhSachCT;

    danhSachCT?.map(
      (item: { donViId: string }) =>
        (item?.donViId === record?.parent || !item?.donViId) && newArr.push(item),
    );
    setDanhSachCTNew(newArr);
  };

  React.useEffect(() => {
    getDSTruong();
    getDSCT();
  }, []);

  const onCell = (record: IQuanLyLop.Record) => ({
    onClick:
      // !checkAllow('CHI_TIET_LOP')
      //   ? undefined
      //   :
      () => {
        setRecordQuanLyLop({ ...record, idTruong });
        // eslint-disable-next-line no-underscore-dangle
        history.push(`/quanlylop/${record._id}`);
      },
    style: { cursor: 'pointer' },
  });

  const handleDel = async (record: IQuanLyLop.Record) => {
    // eslint-disable-next-line no-underscore-dangle
    const res = await delQuanLyLop({ id: record?._id });
    if (res?.status === 200) {
      message.success('Xóa thành công');
      setCondition({ donViId });
      const arrLop = [];
      const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=100`, {
        params: {
          cond: {
            loaiDonVi: 'Lop',
          },
        },
      });
      result?.data?.data?.result?.map(
        (item: { parent: string }) => item?.parent === parent && arrLop?.push(item),
      );
      setTotalLop(arrLop?.length);
      return true;
    }
    message.error('Đã xảy ra lỗi');
    return false;
  };

  const renderLast = (record: IQuanLyLop.Record) => {
    return (
      <React.Fragment>
        <Button
          type="default"
          shape="circle"
          onClick={() => {
            setRecordQuanLyLop({ ...record, idTruong });
            history.push(`/quanlylop/${record._id}`);
          }}
          // disabled={!checkAllow('CHI_TIET_LOP')}
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
          title="Chỉnh sửa"
          // disabled={!checkAllow('EDIT_LOP')}
        >
          <EditOutlined />
        </Button>

        <Divider type="vertical" />

        <Popconfirm
          // disabled={vaiTro === 'GiaoVien' || !checkAllow('DEL_LOP')}
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDel(record)}
          okText="Đồng ý"
        >
          <Button
            type="default"
            shape="circle"
            title="Xóa"
            // disabled={vaiTro === 'GiaoVien' || !checkAllow('DEL_LOP')}
          >
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      </React.Fragment>
    );
  };

  const columns: IColumn<IQuanLyLop.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'Tên lớp',
      dataIndex: 'tenDonVi',
      align: 'center',
      width: 200,
      onCell,
      search: 'search',
    },
    {
      title: 'Mã lớp',
      dataIndex: '_id',
      align: 'center',
      width: 250,
    },
    {
      title: 'Trường',
      dataIndex: 'parent',
      align: 'center',
      width: 200,
      onCell,
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
      onCell,
    },
    {
      title: 'Số học sinh/Số học sinh tối đa',
      dataIndex: 'sySo',
      align: 'center',
      width: 150,
      onCell,
      render: (val, record) => (
        <div>
          {record?.soHocSinhThucTe}/{val}
        </div>
      ),
    },
    {
      title: 'Số quản lý/Số quản lý tối đa',
      dataIndex: 'soQuanLyToiDa',
      align: 'center',
      width: 130,
      onCell,
      render: (val, record) => (
        <div>
          {record?.soGiaoVienQuanLyTT}/{val}
        </div>
      ),
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: IQuanLyLop.Record) => renderLast(record),
      fixed: 'right',
      width: 170,
    },
  ];

  useEffect(() => {}, []);

  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={getQuanLyLopModel}
        loading={loadingQuanLyLop}
        dependencies={[page, limit, cond]}
        modelName="quanlylop"
        title="Quản lý lớp"
        scroll={{ x: 1000 }}
      >
        {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin' || vaiTro === 'HieuTruong') &&
          checkAllow('ADD_LOP') && (
            <Button
              style={{ marginBottom: '10px', marginRight: '10px' }}
              onClick={() => {
                setEdit(false);
                setVisibleDrawer(true);
              }}
              type="primary"
            >
              <PlusCircleFilled />
              Thêm mới
            </Button>
          )}
        {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
          <Select
            value={idTruong}
            showSearch
            style={{ width: '15%' }}
            placeholder="Chọn đơn vị"
            optionFilterProp="children"
            onChange={onChange}
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {arrDonVi?.map((item) => (
              <Select.Option value={item?._id}>{item?.tenDonVi}</Select.Option>
            ))}
          </Select>
        )}
        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          Tổng số:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={total}
          />
        </h3>
      </TableBase>
      <DrawerForm<IQuanLyLop.Record>
        visible={visibleDrawer}
        onVisibleChange={setVisibleDrawer}
        title={edit ? 'Chỉnh sửa' : 'Thêm mới'}
        drawerProps={{
          forceRender: false,
          destroyOnClose: true,
          onClose: () => {
            setIdPPGD(undefined);
            if (vaiTro === 'SuperAdmin' || vaiTro === 'Admin') {
              setDanhSachCTNew([]);
            }
          },
        }}
        onValuesChange={async (val) => {
          if (val?.parent) {
            setIdPPGD('');
            const newArr: any = [];
            danhSachCT?.map(
              (item: { donViId: string }) => item?.donViId === val?.parent && newArr.push(item),
            );
            setDanhSachCTNew(newArr);
          }
          if (val?.chuongTrinhDaoTaoId) {
            setIdPPGD(val?.chuongTrinhDaoTaoId);
          }
        }}
        onFinish={async (values: any) => {
          const newVal = values;
          newVal.loaiDonVi = 'Lop';
          if (vaiTro === 'HieuTruong') {
            newVal.parent = initialState?.currentUser?.role?.organizationId;
          }
          if (recordTruong?.doTuoiNhanTre > values?.doTuoi) {
            message.error('Độ tuổi của lớp không được nhỏ hơn độ tuổi tối thiếu nhận vào trường');
            return false;
          }
          if (edit) {
            const id = newRecord?._id;
            const res = await updQuanLyLop({ ...newVal, id });
            if (res?.data?.statusCode === 200) {
              message.success('Cập nhật thành công');
              setCondition({ donViId });
              return true;
            }
            message.error('Đã xảy ra lỗi');
            return false;
          }
          if (!edit && totalLop === recordTruong?.quyMoTruong) {
            message.error('Tổng số lớp trong trường đã đạt tối đa. Vui lòng không tạo thêm lớp.');
            return false;
          }
          const res = await addQuanLyLop({ ...newVal });
          if (res?.data?.statusCode === 201) {
            message.success('Thêm mới thành công');
            // Add lớp mới thêm vào tài khoản hiệu trưởng nào thực hiện thêm lớp
            // const valUser = initialState?.currentUser;
            // valUser?.roles?.[0].listOrgIdAccess?.push(res?.data?.data?.id);
            // await updTaiKhoanHieuTruong({ ...valUser, id: valUser?._id });
            const arrLop = [];
            const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=100`, {
              params: {
                cond: {
                  loaiDonVi: 'Lop',
                },
              },
            });
            result?.data?.data?.result?.map(
              (item: { parent: string }) => item?.parent === parent && arrLop?.push(item),
            );
            setTotalLop(arrLop?.length);
            setCondition({ donViId });
            return true;
          }
          message.error('Đã xảy ra lỗi');
          return false;
        }}
        submitter={{
          render: (newProps) => {
            // DefaultDom có thể dùng hoặc không

            return [
              // ...defaultDoms,
              <Button
                key="submit"
                onClick={() => {
                  newProps.submit();
                }}
                type="primary"
              >
                Lưu
              </Button>,
              <Button
                key="cancel"
                onClick={() => {
                  setVisibleDrawer(false);
                  setIdPPGD(undefined);
                  if (vaiTro === 'SuperAdmin' || vaiTro === 'Admin') {
                    setDanhSachCTNew([]);
                  }
                }}
              >
                Quay lại
              </Button>,
            ];
          },
        }}
        initialValues={{
          ...(edit && newRecord),
        }}
      >
        <ProFormText
          name="tenDonVi"
          label="Tên lớp"
          placeholder="Nhập tên lớp"
          rules={[...rules.required]}
        />
        {(vaiTro === 'Admin' || vaiTro === 'SuperAdmin') && (
          <Form.Item
            name="parent"
            label="Trường"
            rules={[...rules.required]}
            style={{ marginBottom: 5 }}
          >
            <Select
              showSearch
              allowClear
              style={{ width: '100%' }}
              placeholder="Chọn trường"
              optionFilterProp="children"
              filterOption={(input, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {danhSachTruong?.map((item: ITruong.Record) => (
                <Select.Option key={item?._id} value={item?._id}>
                  {item?.tenDonVi}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        <ProFormSelect
          fieldProps={{
            value: idPPGD,
          }}
          name="chuongTrinhDaoTaoId"
          label="Phương pháp giáo dục"
          placeholder="Chọn phương pháp giáo dục"
          options={danhSachCTNew?.map((item: any) => ({
            value: `${item?._id}`,
            label: `${item?.ten} ${item?.donVi?.tenDonVi ? `- ${item?.donVi?.tenDonVi}` : ''}`,
          }))}
        />
        <ProFormDigit
          name="doTuoi"
          label="Độ tuổi của lớp (tháng)"
          placeholder="Nhập độ tuổi của lớp"
          min={6}
          rules={[...rules.required, ...rules.number(undefined, 6)]}
        />
        <ProFormDigit
          name="sySo"
          label="Số học sinh tối đa của lớp"
          placeholder="Nhập số học sinh tối đa"
          min={6}
          rules={[...rules.required, ...rules.number(undefined, 0)]}
        />
        <ProFormDigit
          name="soQuanLyToiDa"
          label="Số quản lý (giáo viên) của lớp tối đa"
          placeholder="Nhập số quản lý (giáo viên) của lớp tối đa"
          min={1}
          rules={[...rules.required, ...rules.number(undefined, 1)]}
        />
        <Form.Item
          name="loaiHinh"
          label="Loại hình lớp"
          rules={[...rules.required]}
          style={{ marginBottom: 5 }}
        >
          <Select placeholder="Loại hình lớp">
            <Select.Option value="Mầm non">Mẫu giáo</Select.Option>
            <Select.Option value="Nhà trẻ">Nhà trẻ</Select.Option>
          </Select>
        </Form.Item>
        {edit && <div style={{ width: '100%' }} />}
      </DrawerForm>
    </>
  );
};

export default QuanLyLop;
