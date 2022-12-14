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
      // g???i t???t c??? t??i kho???n
      if (receiver === 'send-all') {
        const res = await notiSendAll({ ...newVal });
        if (res?.status === 201) {
          message.success('G???i th??ng b??o th??nh c??ng');
          setVisibleForm(false);
          getThongBaoModel(undefined, initialState?.currentUser?._id);
          return true;
        }
      }

      // G???i m???t s??? tr?????ng
      if (receiver === 'send-school') {
        const res = await notiSendDonVi({ ...newVal });
        if (res?.status === 201) {
          message.success('G???i th??ng b??o th??nh c??ng');
          setVisibleForm(false);
          getThongBaoModel(undefined, initialState?.currentUser?._id);
          return true;
        }
      }

      // G???i t???t c??? c??c l???p
      if (receiver === 'send-class' && loaiLop === 'all-class') {
        newVal.danhSachDonViId = [organizationId ?? newVal.schoolId];
        const res = await notiSendDonVi({ ...newVal });
        if (res?.status === 201) {
          message.success('G???i th??ng b??o th??nh c??ng');
          setVisibleForm(false);
          getThongBaoModel(undefined, initialState?.currentUser?._id);
          return true;
        }
      }

      // G???i m???t s??? l???p
      if (receiver === 'send-class' && loaiLop === 'many-class') {
        const res = await notiSendDonVi({ ...newVal });
        if (res?.status === 201) {
          message.success('G???i th??ng b??o th??nh c??ng');
          setVisibleForm(false);
          getThongBaoModel(undefined, initialState?.currentUser?._id);
          return true;
        }
      }

      // G???i m???t s??? t??i kho???n
      if (receiver === 'send-many') {
        if (vaiTro === 'HieuTruong') {
          newVal.systemRole = [newVal.systemRole];
        }
        const res = await notiSendMany({ ...newVal });
        if (res?.status === 201) {
          message.success('G???i th??ng b??o th??nh c??ng');
          setVisibleForm(false);
          getThongBaoModel(undefined, initialState?.currentUser?._id);
          return true;
        }
      }

      // G???i m???t t??i kho???n
      if (receiver === 'send-one') {
        if (vaiTro === 'HieuTruong') {
          newVal.systemRole = [newVal.systemRole];
        }
        const res = await notiSendOne({ ...newVal });
        if (res?.status === 201) {
          message.success('G???i th??ng b??o th??nh c??ng');
          setVisibleForm(false);
          getThongBaoModel(undefined, initialState?.currentUser?._id);
          return true;
        }
      }
    } catch (error) {
      message.error('G???i th??ng b??o th???t b???i');
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
    <Card title="Th??m m???i th??ng b??o">
      <Form labelCol={{ span: 24 }} onFinish={onFinish} form={form}>
        <Form.Item
          name="title"
          label="Ti??u ?????"
          rules={[...rules.required, ...rules.length(255)]}
          style={{ marginBottom: 5 }}
        >
          <Input placeholder="Nh???p ti??u ?????" />
        </Form.Item>
        {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
          <Form.Item
            name="donViId"
            label="Ch???n tr?????ng"
            rules={[...rules.required]}
            style={{ marginBottom: 5 }}
            key={donViId}
            initialValue={donViId}
          >
            <Select
              showSearch
              defaultValue={donViId}
              style={{ width: '20%' }}
              placeholder="Ch???n ????n v???"
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
          label="M?? t???"
          rules={[...rules.required, ...rules.length(400)]}
          style={{ marginBottom: 5 }}
        >
          <Input.TextArea placeholder="Nh???p m?? t???" rows={3} />
        </Form.Item>
        <Form.Item
          label="Ng?????i nh???n"
          name="receiver"
          rules={[...rules.required]}
          style={{ marginBottom: 5 }}
        >
          <Select placeholder="Ch???n ng?????i nh???n" onChange={changeReceiver}>
            <Select.Option value="send-all">T???t c??? t??i kho???n</Select.Option>
            {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
              <Select.Option value="send-school">G???i theo tr?????ng</Select.Option>
            )}
            <Select.Option value="send-class">G???i theo l???p</Select.Option>
            <Select.Option value="send-many">G???i t???i danh s??ch ng?????i nh???n c??? th???</Select.Option>
            <Select.Option value="send-one">G???i t???i m???t ng?????i nh???n c??? th???</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Vai tr??"
          name="systemRole"
          rules={[...rules.required]}
          style={{ marginBottom: 5 }}
        >
          <Select
            placeholder="Ch???n vai tr??"
            mode={
              (receiver === 'send-many' || receiver === 'send-one') && vaiTro === 'HieuTruong'
                ? undefined
                : 'multiple'
            }
            onChange={changeVaiTro}
          >
            {(vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && receiver !== 'send-class' && (
              <Select.Option value="HieuTruong">Hi???u tr?????ng</Select.Option>
            )}
            {vaiTro !== 'GiaoVien' && <Select.Option value="GiaoVien">Gi??o vi??n</Select.Option>}

            <Select.Option value="PhuHuynh">Ph??? huynh</Select.Option>
          </Select>
        </Form.Item>

        {/* Ch???n tr?????ng khi ch???n g???i theo tr?????ng */}
        {receiver === 'send-school' && (
          <Form.Item
            name="danhSachDonViId"
            label="Danh s??ch tr?????ng nh???n th??ng b??o"
            rules={[...rules.required]}
            style={{ marginBottom: 5 }}
          >
            <Select
              showSearch
              allowClear
              style={{ width: '100%' }}
              placeholder="Ch???n tr?????ng nh???n th??ng b??o"
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

        {/* Ch???n tr?????ng khi g???i theo l???p */}
        {receiver === 'send-class' && (vaiTro === 'Admin' || vaiTro === 'SuperAdmin') && (
          <Form.Item
            name="schoolId"
            label="Tr?????ng"
            rules={[...rules.required]}
            style={{ marginBottom: 5 }}
          >
            <Select
              onChange={changeIdTruong}
              showSearch
              allowClear
              style={{ width: '100%' }}
              placeholder="Ch???n tr?????ng nh???n th??ng b??o"
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

        {/* Ch???n lo???i l???p nh???n th??ng b??o */}
        {(idTruong || vaiTro === 'HieuTruong') && receiver === 'send-class' && (
          <Form.Item
            label="L???p"
            name="loaiLop"
            rules={[...rules.required]}
            style={{ marginBottom: 5 }}
          >
            <Select placeholder="Ch???n l???p" onChange={changeloaiLop}>
              <Select.Option value="all-class">T???t c??? c??c l???p</Select.Option>
              <Select.Option value="many-class">Ch???n trong danh s??ch l???p</Select.Option>
            </Select>
          </Form.Item>
        )}

        {/* Ch???n danh s??ch l???p nh???n th??ng b??o */}
        {(idTruong || vaiTro === 'HieuTruong') &&
          receiver === 'send-class' &&
          loaiLop === 'many-class' && (
            <Form.Item
              label="Danh s??ch l???p nh???n th??ng b??o"
              name="danhSachDonViId"
              rules={[...rules.required]}
              style={{ marginBottom: 5 }}
            >
              <Select
                showSearch
                allowClear
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Ch???n l???p nh???n th??ng b??o"
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

        {/* G???i cho danh s??ch t??i kho???n */}
        {receiver === 'send-many' && (
          <Form.Item
            name="listUser"
            label="Danh s??ch ng?????i nh???n"
            rules={[...rules.required]}
            style={{ marginBottom: 5 }}
          >
            <Select
              showSearch
              allowClear
              style={{ width: '100%' }}
              placeholder="Ch???n ng?????i nh???n"
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

        {/* G???i cho 1 t??i kho???n c??? th??? */}
        {receiver === 'send-one' && (
          <Form.Item
            name="user"
            label="Ng?????i nh???n"
            rules={[...rules.required]}
            style={{ marginBottom: 5 }}
          >
            <Select
              showSearch
              allowClear
              style={{ width: '100%' }}
              placeholder="Ch???n ng?????i nh???n"
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
          label="Ki???u th??ng b??o"
          name="type"
          rules={[...rules.required]}
          style={{ marginBottom: 5 }}
        >
          <Select placeholder="Ch???n ki???u th??ng b??o">
            <Select.Option value="KHAC">Kh??c</Select.Option>
            <Select.Option value="TIN_TUC">Tin t???c</Select.Option>
            <Select.Option value="LICH_HOC">L???ch h???c</Select.Option>
            <Select.Option value="THUC_DON">Th???c ????n</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="repeat"
          // label="L???p l???i"
          // rules={[...rules.required]}
          style={{ marginBottom: 5 }}
        >
          <Checkbox onChange={onChangeCheckBox}>L???p l???i</Checkbox>
        </Form.Item>
        {isRepeat && (
          <Form.Item
            name="repeat"
            // label="L???p l???i"
            // rules={[...rules.required]}
            style={{ marginBottom: 5 }}
          >
            <Select
              defaultValue="KHONG_LAP"
              style={{ width: 200 }}
              onChange={handleChangeSelectRepeat}
            >
              <Select.Option value="KHONG_LAP">Nh???c 1 l???n</Select.Option>
              <Select.Option value="HANG_TUAN">Nh???c h??ng tu???n</Select.Option>
              <Select.Option value="HANG_THANG">Nh???c h??ng th??ng</Select.Option>
            </Select>
            {selected && <DaySelect type={selected} handleChoseData={handleChoseRepeat} />}
          </Form.Item>
        )}
        <Form.Item name="htmlContent" label="N???i dung HTML">
          <TinyEditor height={650} />
        </Form.Item>

        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            G???i
          </Button>
          <Button onClick={() => setVisibleForm(false)}>????ng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
export default FormThongBao;
