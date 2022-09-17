/* eslint-disable no-underscore-dangle */
import TinyEditor from '@/components/TinyEditor/Tiny';
import {
  notiSendAll,
  notiSendDonVi,
  notiSendMany,
  notiSendOne,
} from '@/services/ThongBao/thongbao';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import rules from '@/utils/rules';
import { Button, Card, Checkbox, Form, Input, message, Modal, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import DaySelect from '@/pages/ThongBao/components/daySelect';
import moment from 'moment';
export interface IResData {
  repeat?: 'KHONG_LAP' | 'HANG_TUAN' | 'HANG_THANG';
  dayRepeat?: any;
  thoiGianGuiTB?: string;
}
const FormThongBao = () => {
  const { loading, setVisibleForm, getThongBaoModel } = useModel('thongbao');
  const [receiver, setReceiver] = useState<string>();
  const [loaiLop, setLoaiLop] = useState<string>();
  const [idTruong, setIdTruong] = useState<string>();
  const [DsUser, setDSUser] = useState([]);
  const vaiTro = localStorage.getItem('vaiTro');
  const [dsTruong, setDsTruong] = useState([]);
  const [dsLop, setDsLop] = useState([]);
  const [dsDonVi, setDsDonVi] = useState([]);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [dataRepeat, setDataRepeat] = useState<IResData>({
    thoiGianGuiTB: moment().format('HH:mm'),
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { initialState } = useModel('@@initialState');
  const [donViId, setDonViId] = useState<string>('');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [form] = Form.useForm();
  const getTruong = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=100`);
    setDsDonVi(result?.data?.data?.result);
    const arrTruong: any = [];
    result?.data?.data?.result?.map((item: { loaiDonVi: string }) =>
      item?.loaiDonVi === 'Truong' ? arrTruong.push(item) : undefined,
    );
    setDsTruong(arrTruong);
  };
  useEffect(() => {
    if (dsTruong.length > 0) {
      setDonViId(dsTruong?.[0]?._id);
    }
  }, [dsTruong]);
  const getLop = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=100`, {
      params: {
        cond: {
          parent: organizationId,
        },
      },
    });
    setDsLop(result?.data?.data?.result);
  };

  React.useEffect(() => {
    getTruong();
    if (vaiTro === 'HieuTruong') getLop();
  }, []);

  const changeReceiver = (val: string) => {
    setReceiver(val);
    setDSUser([]);
    form.setFieldsValue({
      systemRole: undefined,
      listUser: undefined,
      user: undefined,
      loaiLop: undefined,
      danhSachDonViId: undefined,
    });
  };
  const changeloaiLop = (val: string) => {
    setLoaiLop(val);
    form.setFieldsValue({
      listUser: undefined,
      user: undefined,
      danhSachDonViId: undefined,
    });
  };

  const changeVaiTro = async (val: string[]) => {
    if (
      (receiver === 'send-many' || receiver === 'send-one') &&
      vaiTro !== 'SuperAdmin' &&
      vaiTro !== 'Admin'
    ) {
      const result = await axios.get(
        `${ip3}/user/pageable/organization/${organizationId}?page=1&limit=10000`,
        {
          params: {
            systemRole: vaiTro === 'HieuTruong' ? val : val?.[0],
          },
        },
      );
      setDSUser(result?.data?.data?.result);
    } else {
      const result = await axios.get(`${ip3}/user/pageable?page=1&limit=10000`, {
        params: {
          cond: {
            'roles.systemRole': { $in: val },
          },
        },
      });
      setDSUser(result?.data?.data?.result);
    }
    form.setFieldsValue({
      listUser: undefined,
      user: undefined,
      loaiLop: undefined,
      loaiTruong: undefined,
      danhSachDonViId: undefined,
    });
  };

  const changeIdTruong = (val: string) => {
    setIdTruong(val);
    form.setFieldsValue({
      listUser: undefined,
      user: undefined,
      loaiLop: undefined,
      danhSachDonViId: undefined,
    });
    const arrLop: any = [];
    dsDonVi?.map((item: { parent: string }) =>
      item?.parent === val ? arrLop.push(item) : undefined,
    );
    setDsLop(arrLop);
  };

  const onFinish = async (values: any) => {
    const newVal = values;
    newVal.sentType = 0;
    newVal.htmlContent = newVal?.htmlContent?.text;
    newVal.sentAt = moment(dataRepeat?.thoiGianGuiTB, 'HH:mm').toDate();
    newVal.repeat = dataRepeat?.repeat;
    newVal.dayRepeat = dataRepeat?.dayRepeat;
    newVal.thoiGianGuiTB = dataRepeat?.thoiGianGuiTB;
    if (vaiTro === 'SuperAdmin' || vaiTro === 'Admin') {
      newVal.donViId = donViId;
    }
    try {
      // gửi tất cả tài khoản
      if (receiver === 'send-all') {
        const res = await notiSendAll({ ...newVal });
        if (res?.status === 201) {
          message.success('Gửi thông báo thành công');
          setVisibleForm(false);
          getThongBaoModel(undefined, initialState?.currentUser?._id);
          return true;
        }
      }

      // Gửi một số trường
      if (receiver === 'send-school') {
        const res = await notiSendDonVi({ ...newVal });
        if (res?.status === 201) {
          message.success('Gửi thông báo thành công');
          setVisibleForm(false);
          getThongBaoModel(undefined, initialState?.currentUser?._id);
          return true;
        }
      }

      // Gửi tất cả các lớp
      if (receiver === 'send-class' && loaiLop === 'all-class') {
        newVal.danhSachDonViId = [organizationId ?? newVal.schoolId];
        const res = await notiSendDonVi({ ...newVal });
        if (res?.status === 201) {
          message.success('Gửi thông báo thành công');
          setVisibleForm(false);
          getThongBaoModel(undefined, initialState?.currentUser?._id);
          return true;
        }
      }

      // Gửi một số lớp
      if (receiver === 'send-class' && loaiLop === 'many-class') {
        const res = await notiSendDonVi({ ...newVal });
        if (res?.status === 201) {
          message.success('Gửi thông báo thành công');
          setVisibleForm(false);
          getThongBaoModel(undefined, initialState?.currentUser?._id);
          return true;
        }
      }

      // Gửi một số tài khoản
      if (receiver === 'send-many') {
        if (vaiTro === 'HieuTruong') {
          newVal.systemRole = [newVal.systemRole];
        }
        const res = await notiSendMany({ ...newVal });
        if (res?.status === 201) {
          message.success('Gửi thông báo thành công');
          setVisibleForm(false);
          getThongBaoModel(undefined, initialState?.currentUser?._id);
          return true;
        }
      }

      // Gửi một tài khoản
      if (receiver === 'send-one') {
        if (vaiTro === 'HieuTruong') {
          newVal.systemRole = [newVal.systemRole];
        }
        const res = await notiSendOne({ ...newVal });
        if (res?.status === 201) {
          message.success('Gửi thông báo thành công');
          setVisibleForm(false);
          getThongBaoModel(undefined, initialState?.currentUser?._id);
          return true;
        }
      }
    } catch (error) {
      message.error('Gửi thông báo thất bại');
      return false;
    }
    return false;
  };
  const onChangeCheckBox = (e: any) => {
    setIsRepeat(e.target.checked);
  };
  const [selected, setSelected] = useState<'KHONG_LAP' | 'HANG_TUAN' | 'HANG_THANG'>('KHONG_LAP');
  const handleChangeSelectRepeat = (value: string) => {
    setSelected(value);
  };
  const handleChoseRepeat = (value: any) => {
    const obj: IResData = {
      repeat: selected,
      dayRepeat: value.dayRepeat,
      thoiGianGuiTB: value.thoiGianGuiTB,
    };
    setDataRepeat(obj);
  };
  const onChangeTruong = (value: string) => {
    setDonViId(value);
  };
  return (
    <Card title="Thêm mới thông báo">
      <Form labelCol={{ span: 24 }} onFinish={onFinish} form={form}>
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[...rules.required, ...rules.length(255)]}
          style={{ marginBottom: 5 }}
        >
          <Input placeholder="Nhập tiêu đề" />
        </Form.Item>
        {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
          <Form.Item
            name="donViId"
            label="Chọn trường"
            rules={[...rules.required]}
            style={{ marginBottom: 5 }}
            key={donViId}
            initialValue={donViId}
          >
            <Select
              showSearch
              defaultValue={donViId}
              style={{ width: '20%' }}
              placeholder="Chọn đơn vị"
              optionFilterProp="children"
              onChange={onChangeTruong}
              filterOption={(input, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {dsTruong?.map((item: { _id: string; tenDonVi: string }) => (
                <Select.Option key={item?._id} value={item?._id}>
                  {item?.tenDonVi}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item
          name="content"
          label="Mô tả"
          rules={[...rules.required, ...rules.length(400)]}
          style={{ marginBottom: 5 }}
        >
          <Input.TextArea placeholder="Nhập mô tả" rows={3} />
        </Form.Item>
        <Form.Item
          label="Người nhận"
          name="receiver"
          rules={[...rules.required]}
          style={{ marginBottom: 5 }}
        >
          <Select placeholder="Chọn người nhận" onChange={changeReceiver}>
            <Select.Option value="send-all">Tất cả tài khoản</Select.Option>
            {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
              <Select.Option value="send-school">Gửi theo trường</Select.Option>
            )}
            <Select.Option value="send-class">Gửi theo lớp</Select.Option>
            <Select.Option value="send-many">Gửi tới danh sách người nhận cụ thể</Select.Option>
            <Select.Option value="send-one">Gửi tới một người nhận cụ thể</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Vai trò"
          name="systemRole"
          rules={[...rules.required]}
          style={{ marginBottom: 5 }}
        >
          <Select
            placeholder="Chọn vai trò"
            mode={
              (receiver === 'send-many' || receiver === 'send-one') && vaiTro === 'HieuTruong'
                ? undefined
                : 'multiple'
            }
            onChange={changeVaiTro}
          >
            {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && receiver !== 'send-class' && (
              <Select.Option value="HieuTruong">Hiệu trưởng</Select.Option>
            )}
            {vaiTro !== 'GiaoVien' && <Select.Option value="GiaoVien">Giáo viên</Select.Option>}

            <Select.Option value="PhuHuynh">Phụ huynh</Select.Option>
          </Select>
        </Form.Item>

        {/* Chọn trường khi chọn gửi theo trường */}
        {receiver === 'send-school' && (
          <Form.Item
            name="danhSachDonViId"
            label="Danh sách trường nhận thông báo"
            rules={[...rules.required]}
            style={{ marginBottom: 5 }}
          >
            <Select
              showSearch
              allowClear
              style={{ width: '100%' }}
              placeholder="Chọn trường nhận thông báo"
              optionFilterProp="children"
              mode="multiple"
              filterOption={(input, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {dsTruong?.map((item: { tenDonVi: string; _id: string }) => (
                <Select.Option value={item?._id}>{item?.tenDonVi}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {/* Chọn trường khi gửi theo lớp */}
        {receiver === 'send-class' && (vaiTro === 'Admin' || vaiTro === 'SuperAdmin') && (
          <Form.Item
            name="schoolId"
            label="Trường"
            rules={[...rules.required]}
            style={{ marginBottom: 5 }}
          >
            <Select
              onChange={changeIdTruong}
              showSearch
              allowClear
              style={{ width: '100%' }}
              placeholder="Chọn trường nhận thông báo"
              optionFilterProp="children"
              filterOption={(input, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {dsTruong?.map((item: { tenDonVi: string; _id: string }) => (
                <Select.Option value={item?._id}>{item?.tenDonVi}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {/* Chọn loại lớp nhận thông báo */}
        {(idTruong || vaiTro === 'HieuTruong') && receiver === 'send-class' && (
          <Form.Item
            label="Lớp"
            name="loaiLop"
            rules={[...rules.required]}
            style={{ marginBottom: 5 }}
          >
            <Select placeholder="Chọn lớp" onChange={changeloaiLop}>
              <Select.Option value="all-class">Tất cả các lớp</Select.Option>
              <Select.Option value="many-class">Chọn trong danh sách lớp</Select.Option>
            </Select>
          </Form.Item>
        )}

        {/* Chọn danh sách lớp nhận thông báo */}
        {(idTruong || vaiTro === 'HieuTruong') &&
          receiver === 'send-class' &&
          loaiLop === 'many-class' && (
            <Form.Item
              label="Danh sách lớp nhận thông báo"
              name="danhSachDonViId"
              rules={[...rules.required]}
              style={{ marginBottom: 5 }}
            >
              <Select
                showSearch
                allowClear
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Chọn lớp nhận thông báo"
                optionFilterProp="children"
                filterOption={(input, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {dsLop?.map((item: { tenDonVi: string; _id: string }) => (
                  <Select.Option value={item?._id}>{item?.tenDonVi}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}

        {/* Gửi cho danh sách tài khoản */}
        {receiver === 'send-many' && (
          <Form.Item
            name="listUser"
            label="Danh sách người nhận"
            rules={[...rules.required]}
            style={{ marginBottom: 5 }}
          >
            <Select
              showSearch
              allowClear
              style={{ width: '100%' }}
              placeholder="Chọn người nhận"
              optionFilterProp="children"
              mode="multiple"
              filterOption={(input, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {DsUser?.map(
                (item: { _id: string; profile: { fullname: string; phoneNumber: string } }) => (
                  <Select.Option
                    value={item?._id}
                  >{`${item?.profile?.fullname} - ${item?.profile?.phoneNumber}`}</Select.Option>
                ),
              )}
            </Select>
          </Form.Item>
        )}

        {/* Gửi cho 1 tài khoản cụ thể */}
        {receiver === 'send-one' && (
          <Form.Item
            name="user"
            label="Người nhận"
            rules={[...rules.required]}
            style={{ marginBottom: 5 }}
          >
            <Select
              showSearch
              allowClear
              style={{ width: '100%' }}
              placeholder="Chọn người nhận"
              optionFilterProp="children"
              filterOption={(input, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {DsUser?.map(
                (item: { _id: string; profile: { fullname: string; phoneNumber: string } }) => (
                  <Select.Option
                    value={item?._id}
                  >{`${item?.profile?.fullname} - ${item?.profile?.phoneNumber}`}</Select.Option>
                ),
              )}
            </Select>
          </Form.Item>
        )}
        <Form.Item
          label="Kiểu thông báo"
          name="type"
          rules={[...rules.required]}
          style={{ marginBottom: 5 }}
        >
          <Select placeholder="Chọn kiểu thông báo">
            <Select.Option value="KHAC">Khác</Select.Option>
            <Select.Option value="TIN_TUC">Tin tức</Select.Option>
            <Select.Option value="LICH_HOC">Lịch học</Select.Option>
            <Select.Option value="THUC_DON">Thực đơn</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="repeat"
          // label="Lặp lại"
          // rules={[...rules.required]}
          style={{ marginBottom: 5 }}
        >
          <Checkbox onChange={onChangeCheckBox}>Lặp lại</Checkbox>
        </Form.Item>
        {isRepeat && (
          <Form.Item
            name="repeat"
            // label="Lặp lại"
            // rules={[...rules.required]}
            style={{ marginBottom: 5 }}
          >
            <Select
              defaultValue="KHONG_LAP"
              style={{ width: 200 }}
              onChange={handleChangeSelectRepeat}
            >
              <Select.Option value="KHONG_LAP">Nhắc 1 lần</Select.Option>
              <Select.Option value="HANG_TUAN">Nhắc hàng tuần</Select.Option>
              <Select.Option value="HANG_THANG">Nhắc hàng tháng</Select.Option>
            </Select>
            {selected && <DaySelect type={selected} handleChoseData={handleChoseRepeat} />}
          </Form.Item>
        )}
        <Form.Item name="htmlContent" label="Nội dung HTML">
          <TinyEditor height={650} />
        </Form.Item>

        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            Gửi
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
export default FormThongBao;
