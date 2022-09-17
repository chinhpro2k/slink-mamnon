import { useModel } from '@@/plugin-model/useModel';
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import TableBase from '@/components/Table';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { KhoanThu as IKhoanThu } from '@/services/KhoanThu';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { KhoanChiTieu as IKhoanChiTieu } from '@/services/KhoanChiTieu';
import { GiamTru as IGiamTru } from '@/services/GiamTru';
import { DataStatistic } from '@/pages/NoiBo/components/thongKeTheoNgay';
import { DoanhThu as IDoanhThu } from '@/services/DoanhThu';
import DetailDoanhThu from '@/pages/DoanhThu/components/popup/detailDoanhThu';
import DetailChiPhi from '@/pages/DoanhThu/components/popup/detailChiPhi';
import DetailGiamTru from '@/pages/DoanhThu/components/popup/detailGiamTru';
import { delKhoanThu, updKhoanThu } from '@/services/KhoanThu/khoanthu';
import { delKhoanChiTieu, updKhoanChiTieu } from '@/services/KhoanChiTieu/khoanchitieu';
import rules from '@/utils/rules';
import { Truong as ITruong } from '@/services/Truong';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
});
const FormViewDoanhThu = () => {
  const [form] = Form.useForm();
  const { record, loaiDoanhThu, edit, month, year } = useModel('doanhthu');
  const modelGiamTru = useModel('giamtru');
  const modelDoanhThuThuc = useModel('doanhthuthuc');
  const modelChiPhi = useModel('khoanchitieu');
  const modelKhoanThu = useModel('khoanthu');
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [statistics, setStatistics] = useState<DataStatistic[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>();
  const [dataRecordEdit, setDataRecordEdit] = useState<any>();
  const [donViId, setDonViId] = useState(record?.donViId);
  const vaiTro = localStorage.getItem('vaiTro');
  const [dsTruong, setDanhSachTruong] = useState([]);
  const [visibleTable, setVisibleTable] = useState<boolean>(false);
  const [typeBaoCao, setTypeBaoCao] = useState<'khoanThu' | 'chiPhi' | 'giamTru'>('khoanThu');
  const [currentRecordData, setCurrentRecordData] = useState<any>();
  useEffect(() => {
    if (loaiDoanhThu === 'Hệ thống') {
      setCurrentRecordData(record);
    } else {
      setCurrentRecordData(modelDoanhThuThuc.record);
    }
  }, [loaiDoanhThu]);
  const handleViewKhoanThu = (recordData: IKhoanThu.Record) => {
    if (recordData.module) {
      if (recordData.ten === 'Học phí') {
        modelKhoanThu.setIsNhapTay(false);
        modelKhoanThu.getDetailKhoanThuModel(
          currentRecordData.thang,
          currentRecordData.nam,
          recordData.donViId,
        );
        modelKhoanThu.setVisibleForm(true);
      }
    } else {
      modelKhoanThu.setIsNhapTay(true);
      modelKhoanThu.getDetail(recordData.id);
      modelKhoanThu.setVisibleForm(true);
    }
  };
  const handleViewKhoanChi = (recordData: IKhoanChiTieu.Record) => {
    if (recordData.module) {
      if (recordData.ten === 'Hóa đơn mua hàng') {
        modelChiPhi.setType('hoaDonMuaHang');
        modelChiPhi.getHoaDonModel(
          currentRecordData.thang,
          currentRecordData.nam,
          recordData.donViId,
        );
        modelChiPhi.setVisibleForm(true);
      }
      if (recordData.ten === 'Lương tháng') {
        modelChiPhi.setType('luongThang');
        modelChiPhi.getLuongThangModel(
          currentRecordData.thang,
          currentRecordData.nam,
          recordData.donViId,
        );
        modelChiPhi.setVisibleForm(true);
      }
    }
  };
  const handleViewGiamTru = (recordData: IGiamTru.Record) => {
    if (recordData.module) {
      modelGiamTru.setVisibleForm(true);
      modelGiamTru.getDetailGiamTruModel(
        currentRecordData.thang,
        currentRecordData.nam,
        recordData.donViId,
      );
    }
  };
  const handleEdit = (val: any, type: 'khoanThu' | 'chiPhi' | 'giamTru') => {
    setTypeBaoCao(type);
    setVisibleTable(true);
    // setEdit(true);
    // setRecord(val);
    setDataRecordEdit(val);
    form.setFieldsValue({
      ten: val.ten,
      soTien: val.soTien,
    });
  };

  const handleDel = async (val: string, type: 'khoanThu' | 'chiPhi' | 'giamTru') => {
    if (type === 'khoanThu') {
      try {
        const res = await delKhoanThu({ id: val });
        if (res?.status === 200) {
          message.success('Xóa thành công');
          modelKhoanThu.getKhoanThuModel(currentRecordData?.donViId, {
            thang: month,
            nam: year,
            loaiDoanhThu: loaiDoanhThu,
          });
          return true;
        }
      } catch (error) {
        message.error('Đã xảy ra lỗi');
        return false;
      }
    }
    if (type === 'chiPhi') {
      try {
        const res = await delKhoanChiTieu({ id: val });
        if (res?.status === 200) {
          message.success('Xóa thành công');
          modelChiPhi.getKhoanChiTieuModel(currentRecordData?.donViId, {
            thang: month,
            nam: year,
            loaiDoanhThu: loaiDoanhThu,
          });
          return true;
        }
      } catch (error) {
        message.error('Đã xảy ra lỗi');
        return false;
      }
    }

    return false;
  };
  const renderLast = (recordVal: any, type: 'khoanThu' | 'chiPhi' | 'giamTru') => {
    if (!edit) {
      switch (type) {
        case 'chiPhi':
          return (
            <Button
              disabled={!recordVal.module}
              type={'primary'}
              icon={<EyeOutlined />}
              onClick={() => handleViewKhoanChi(recordVal)}
            />
          );
          break;
        case 'giamTru':
          return (
            <Button
              disabled={!recordVal.module}
              type={'primary'}
              icon={<EyeOutlined />}
              onClick={() => handleViewGiamTru(recordVal)}
            />
          );
          break;
        case 'khoanThu':
          return (
            <Button
              disabled={!recordVal.module}
              type={'primary'}
              icon={<EyeOutlined />}
              onClick={() => handleViewKhoanThu(recordVal)}
            />
          );
          break;
      }
    } else {
      return (
        <React.Fragment>
          <Button
            disabled={recordVal.module}
            type="default"
            shape="circle"
            onClick={() => handleEdit(recordVal, type)}
            title="Chỉnh sửa"
          >
            <EditOutlined />
          </Button>
          <Divider type="vertical" />
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDel(recordVal._id, type)}
            cancelText="Hủy"
          >
            <Button type="primary" shape="circle" title="Xóa" disabled={recordVal.module}>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </React.Fragment>
      );
    }
  };
  const getDonVi = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=1000`, {
      params: {
        cond: {
          loaiDonVi: 'Truong',
        },
      },
    });
    setDanhSachTruong(result?.data?.data?.result);
  };
  const changeTruong = async (val: string) => {
    setDonViId(val);
  };
  useEffect(() => {
    if (vaiTro === 'SuperAdmin' || vaiTro === 'Admin') {
      getDonVi();
    }
    changeTruong(donViId);
  }, []);
  const columnsKhoanThu: ColumnsType<IKhoanThu.Record> = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'name',
    },
    {
      title: 'Khoản thu',
      dataIndex: 'ten',
      key: 'age',
    },
    {
      title: 'Doanh thu dự kiến',
      dataIndex: 'soTienDuKien',
      key: 'address',
      render: (value) => formatter.format(value ?? 0),
    },
    {
      title: 'Doanh thu thực tế',
      dataIndex: 'soTien',
      key: 'soTien',
      render: (value) => formatter.format(value ?? 0),
    },
    {
      title: 'Ngày nhập',
      key: 'createdAt',
      render: (value) => moment(value).format('DD/MM/YYYY'),
    },

    {
      title: 'Xem chi tiết',
      key: 'action',
      align: 'center',
      render: (_, recordVal: IKhoanThu.Record) => renderLast(recordVal, 'khoanThu'),
    },
  ];

  const columnsChiPhi: ColumnsType<IKhoanChiTieu.Record> = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'name',
    },
    {
      title: 'Khoản chi',
      dataIndex: 'ten',
      key: 'age',
    },
    {
      title: 'Số tiền',
      dataIndex: 'soTien',
      render: (value) => formatter.format(value ?? 0),
    },
    {
      title: 'Ngày nhập',
      key: 'createdAt',
      render: (value) => moment(value).format('DD/MM/YYYY'),
    },
    {
      title: 'Xem chi tiết',
      key: 'action',
      align: 'center',
      render: (_, recordVal: IKhoanThu.Record) => renderLast(recordVal, 'chiPhi'),
    },
  ];
  const columnsGiamTru: ColumnsType<IGiamTru.Record> = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'name',
    },
    {
      title: 'Khoản giảm trừ',
      dataIndex: 'ten',
      key: 'age',
    },
    {
      title: 'Số tiền',
      dataIndex: 'soTien',
      render: (value) => formatter.format(value ?? 0),
    },
    {
      title: 'Ngày nhập',
      key: 'createdAt',
      render: (value) => moment(value).format('DD/MM/YYYY'),
    },
    {
      title: 'Xem chi tiết',
      key: 'action',
      align: 'center',
      render: (_, recordVal: IKhoanThu.Record) => renderLast(recordVal, 'giamTru'),
    },
  ];
  const setDataStatistic = (recordData: IDoanhThu.Record) => {
    const obj1: DataStatistic = {
      name: 'Doanh thu thực tế',
      count: recordData.doanhThuThucTe,
    };
    const obj2: DataStatistic = {
      name: 'Doanh thu dự kiến',
      count: recordData.doanhThuDuKien,
    };
    const obj3: DataStatistic = {
      name: 'Chi phí ',
      count: recordData.soTienChi,
    };
    const obj4: DataStatistic = {
      name: 'Lợi nhuận dự kiến',
      count: recordData.soTienThuDuKien,
    };
    const obj5: DataStatistic = {
      name: 'Lợi nhuận thực tế',
      count: recordData.soTienThuThucTe,
    };
    const obj6: DataStatistic = {
      name: 'Giảm trừ học phí ',
      count: recordData.soTienGiamTru,
    };
    const arr: DataStatistic[] = [];
    arr.push(obj1);
    arr.push(obj2);
    arr.push(obj3);
    arr.push(obj4);
    arr.push(obj5);
    arr.push(obj6);
    setStatistics(arr);
  };
  const getData = (dataRecord: IDoanhThu.Record) => {
    // modelKhoanThu.setCondition({
    //   thang: dataRecord.thang,
    //   nam: dataRecord.nam,
    //   loaiDoanhThu: loaiDoanhThu,
    // });
    // modelChiPhi.setCondition({
    //   thang: dataRecord.thang,
    //   nam: dataRecord.nam,
    //   loaiDoanhThu: loaiDoanhThu,
    // });
    // modelGiamTru.setCondition({
    //   thang: dataRecord.thang,
    //   nam: dataRecord.nam,
    //   loaiDoanhThu: loaiDoanhThu,
    // });
    setDataStatistic(dataRecord);
  };
  useEffect(() => {
    if (loaiDoanhThu === 'Hệ thống') {
      getData(record);
    } else {
      getData(modelDoanhThuThuc.record);
    }
  }, [record, modelDoanhThuThuc.record]);
  const onFinishEdit = async (values: any) => {
    setIsLoading(true);
    if (typeBaoCao === 'khoanThu') {
      const newVal = values;
      try {
        const res = await updKhoanThu({
          ...newVal,
          id: dataRecordEdit?._id,
          soTienDuKien: newVal.soTien,
        });
        if (res?.data?.statusCode === 200) {
          message.success('Cập nhật thành công');
          modelKhoanThu.getKhoanThuModel(currentRecordData?.donViId, {
            thang: month,
            nam: year,
            loaiDoanhThu: loaiDoanhThu,
          });
          setIsLoading(false);
          setVisibleTable(false);
          return true;
        }
      } catch (error) {
        message.error('Đã xảy ra lỗi');
        return false;
      }
    } else {
      const newVal = values;
      try {
        const res = await updKhoanChiTieu({
          ...newVal,
          id: dataRecordEdit?._id,
          soTienDuKien: newVal.soTien,
        });
        if (res?.data?.statusCode === 200) {
          message.success('Cập nhật thành công');
          modelChiPhi.getKhoanChiTieuModel(currentRecordData?.donViId, {
            thang: month,
            nam: year,
            loaiDoanhThu: loaiDoanhThu,
          });
          setIsLoading(false);
          setVisibleTable(false);
          return true;
        }
      } catch (error) {
        message.error('Đã xảy ra lỗi');
        return false;
      }
    }

    return true;
  };
  if (currentRecordData) {
    return (
      <>
        <div style={{ padding: '20px' }}>
          <Form>
            {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
              <Form.Item
                label="Trường"
                name="donViId"
                rules={[...rules.required]}
                style={{ marginBottom: 5 }}
                initialValue={currentRecordData?.donViId}
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
                  onChange={changeTruong}
                  disabled={edit}
                >
                  {dsTruong?.map((item: ITruong.Record) => (
                    <Select.Option key={item?._id} value={item?._id}>
                      {item?.tenDonVi}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </Form>
        </div>
        <TableBase
          columns={columnsKhoanThu}
          border={false}
          getData={() =>
            modelKhoanThu.getKhoanThuModel(currentRecordData?.donViId, {
              thang: month,
              nam: year,
              loaiDoanhThu: loaiDoanhThu,
            })
          }
          dependencies={[
            modelKhoanThu.page,
            modelKhoanThu.limit,
            modelKhoanThu.cond,
            organizationId,
          ]}
          loading={modelKhoanThu.loading}
          modelName="khoanthu"
          title="Doanh thu"
          Form={DetailDoanhThu}
          widthDrawer="60%"
          hascreate={edit}
        />

        <TableBase
          columns={columnsChiPhi}
          border={false}
          getData={() =>
            modelChiPhi.getKhoanChiTieuModel(currentRecordData?.donViId, {
              thang: month,
              nam: year,
              loaiDoanhThu: loaiDoanhThu,
            })
          }
          dependencies={[modelChiPhi.page, modelChiPhi.limit, modelChiPhi.cond, organizationId]}
          loading={modelChiPhi.loading}
          modelName="khoanchitieu"
          title="Chi phí"
          Form={DetailChiPhi}
          widthDrawer="60%"
          hascreate={edit}
        />

        <TableBase
          columns={columnsGiamTru}
          border={false}
          getData={() =>
            modelGiamTru.getGiamTruModel(currentRecordData?.donViId, {
              thang: month,
              nam: year,
              loaiDoanhThu: loaiDoanhThu,
            })
          }
          dependencies={[modelGiamTru.page, modelGiamTru.limit, modelGiamTru.cond, organizationId]}
          loading={modelGiamTru.loading}
          modelName="giamtru"
          title="Giảm trừ"
          Form={DetailGiamTru}
          widthDrawer="60%"
        />
        <Modal
          onCancel={() => {
            setVisibleTable(false);
            setDataRecordEdit({});
          }}
          width={400}
          destroyOnClose
          footer={false}
          bodyStyle={{ padding: 20 }}
          visible={visibleTable}
        >
          <Form onFinish={onFinishEdit} labelCol={{ span: 24 }} form={form}>
            <Row gutter={[20, 0]}>
              <Col span={24}>
                <Form.Item
                  label="Hạng mục"
                  name="ten"
                  rules={[...rules.required]}
                  style={{ marginBottom: 5 }}
                  initialValue={dataRecordEdit?.ten ?? ''}
                >
                  <Input placeholder="Nhập tên khoản chi" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Số tiền"
                  name="soTien"
                  rules={[...rules.required]}
                  style={{ marginBottom: 5 }}
                  initialValue={dataRecordEdit?.soTien ?? ''}
                >
                  <InputNumber
                    placeholder="Nhập số tiền chi"
                    min={0}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider />
            <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
              <Button
                loading={isLoading}
                style={{ marginRight: 8 }}
                htmlType="submit"
                type="primary"
              >
                {!edit ? 'Thêm mới' : 'Lưu'}
              </Button>
              <Button onClick={() => setVisibleTable(false)}>Đóng</Button>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  } else return null;
};
export default FormViewDoanhThu;
