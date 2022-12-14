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
    if (loaiDoanhThu === 'H??? th???ng') {
      setCurrentRecordData(record);
    } else {
      setCurrentRecordData(modelDoanhThuThuc.record);
    }
  }, [loaiDoanhThu]);
  const handleViewKhoanThu = (recordData: IKhoanThu.Record) => {
    if (recordData.module) {
      if (recordData.ten === 'H???c ph??') {
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
      if (recordData.ten === 'H??a ????n mua h??ng') {
        modelChiPhi.setType('hoaDonMuaHang');
        modelChiPhi.getHoaDonModel(
          currentRecordData.thang,
          currentRecordData.nam,
          recordData.donViId,
        );
        modelChiPhi.setVisibleForm(true);
      }
      if (recordData.ten === 'L????ng th??ng') {
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
          message.success('X??a th??nh c??ng');
          modelKhoanThu.getKhoanThuModel(currentRecordData?.donViId, {
            thang: month,
            nam: year,
            loaiDoanhThu: loaiDoanhThu,
          });
          return true;
        }
      } catch (error) {
        message.error('???? x???y ra l???i');
        return false;
      }
    }
    if (type === 'chiPhi') {
      try {
        const res = await delKhoanChiTieu({ id: val });
        if (res?.status === 200) {
          message.success('X??a th??nh c??ng');
          modelChiPhi.getKhoanChiTieuModel(currentRecordData?.donViId, {
            thang: month,
            nam: year,
            loaiDoanhThu: loaiDoanhThu,
          });
          return true;
        }
      } catch (error) {
        message.error('???? x???y ra l???i');
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
            title="Ch???nh s???a"
          >
            <EditOutlined />
          </Button>
          <Divider type="vertical" />
          <Popconfirm
            title="B???n c?? ch???c mu???n x??a?"
            onConfirm={() => handleDel(recordVal._id, type)}
            cancelText="H???y"
          >
            <Button type="primary" shape="circle" title="X??a" disabled={recordVal.module}>
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
      title: 'Kho???n thu',
      dataIndex: 'ten',
      key: 'age',
    },
    {
      title: 'Doanh thu d??? ki???n',
      dataIndex: 'soTienDuKien',
      key: 'address',
      render: (value) => formatter.format(value ?? 0),
    },
    {
      title: 'Doanh thu th???c t???',
      dataIndex: 'soTien',
      key: 'soTien',
      render: (value) => formatter.format(value ?? 0),
    },
    {
      title: 'Ng??y nh???p',
      key: 'createdAt',
      render: (value) => moment(value).format('DD/MM/YYYY'),
    },

    {
      title: 'Xem chi ti???t',
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
      title: 'Kho???n chi',
      dataIndex: 'ten',
      key: 'age',
    },
    {
      title: 'S??? ti???n',
      dataIndex: 'soTien',
      render: (value) => formatter.format(value ?? 0),
    },
    {
      title: 'Ng??y nh???p',
      key: 'createdAt',
      render: (value) => moment(value).format('DD/MM/YYYY'),
    },
    {
      title: 'Xem chi ti???t',
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
      title: 'Kho???n gi???m tr???',
      dataIndex: 'ten',
      key: 'age',
    },
    {
      title: 'S??? ti???n',
      dataIndex: 'soTien',
      render: (value) => formatter.format(value ?? 0),
    },
    {
      title: 'Ng??y nh???p',
      key: 'createdAt',
      render: (value) => moment(value).format('DD/MM/YYYY'),
    },
    {
      title: 'Xem chi ti???t',
      key: 'action',
      align: 'center',
      render: (_, recordVal: IKhoanThu.Record) => renderLast(recordVal, 'giamTru'),
    },
  ];
  const setDataStatistic = (recordData: IDoanhThu.Record) => {
    const obj1: DataStatistic = {
      name: 'Doanh thu th???c t???',
      count: recordData.doanhThuThucTe,
    };
    const obj2: DataStatistic = {
      name: 'Doanh thu d??? ki???n',
      count: recordData.doanhThuDuKien,
    };
    const obj3: DataStatistic = {
      name: 'Chi ph?? ',
      count: recordData.soTienChi,
    };
    const obj4: DataStatistic = {
      name: 'L???i nhu???n d??? ki???n',
      count: recordData.soTienThuDuKien,
    };
    const obj5: DataStatistic = {
      name: 'L???i nhu???n th???c t???',
      count: recordData.soTienThuThucTe,
    };
    const obj6: DataStatistic = {
      name: 'Gi???m tr??? h???c ph?? ',
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
    if (loaiDoanhThu === 'H??? th???ng') {
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
          message.success('C???p nh???t th??nh c??ng');
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
        message.error('???? x???y ra l???i');
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
          message.success('C???p nh???t th??nh c??ng');
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
        message.error('???? x???y ra l???i');
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
                label="Tr?????ng"
                name="donViId"
                rules={[...rules.required]}
                style={{ marginBottom: 5 }}
                initialValue={currentRecordData?.donViId}
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
          title="Chi ph??"
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
          title="Gi???m tr???"
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
                  label="H???ng m???c"
                  name="ten"
                  rules={[...rules.required]}
                  style={{ marginBottom: 5 }}
                  initialValue={dataRecordEdit?.ten ?? ''}
                >
                  <Input placeholder="Nh???p t??n kho???n chi" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="S??? ti???n"
                  name="soTien"
                  rules={[...rules.required]}
                  style={{ marginBottom: 5 }}
                  initialValue={dataRecordEdit?.soTien ?? ''}
                >
                  <InputNumber
                    placeholder="Nh???p s??? ti???n chi"
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
                {!edit ? 'Th??m m???i' : 'L??u'}
              </Button>
              <Button onClick={() => setVisibleTable(false)}>????ng</Button>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  } else return null;
};
export default FormViewDoanhThu;
