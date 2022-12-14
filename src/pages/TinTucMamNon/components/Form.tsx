/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import TinyEditor from '@/components/TinyEditor/Tiny';
import UploadAnh from '@/components/Upload/UploadAnh';
import rules from '@/utils/rules';
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Tooltip,
} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import React from 'react';
import { upload } from '@/services/UploadAnh/upload';
import { addTinTuc, editTinTuc } from '@/services/TinTucMamNon/tintucmamnon';
import { renderFileListUrl } from '@/utils/utils';
import { getBase64 } from '@/utils/utils';

const FormTinTuc = () => {
  const [form] = Form.useForm();
  const { edit, loading, record, setVisibleForm, getTinTucMamNonModel } = useModel('tintucmamnon');
  const [loaiTinTuc, setLoaiTinTuc] = useState<string>(record?.loaiTinTuc ?? '');
  const vaiTro = localStorage.getItem('vaiTro');
  const [dsTruong, setDsTruong] = useState([]);
  const [idTruong, setIdTruong] = useState<string>();
  const [dsLop, setDsLop] = useState([]);
  const [dsDonVi, setDsDonVi] = useState([]);
  const [disableSelectTruong, setDisableSelectTruong] = useState<string>(
    record?.donViId?.[0] === '*'
      ? 'DisableSelectMulti'
      : record?.donViId && record?.donViId?.[0] !== '*'
      ? 'DisableSelectAll'
      : '',
  );
  const [disableSelectLop, setDisableSelectLop] = useState<string>(
    record?.donViId?.[0] === '*'
      ? 'DisableSelectMulti'
      : record?.loaiTinTuc && record?.donViId?.[0] !== '*'
      ? 'DisableSelectAll'
      : '',
  );
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;

  const getTruong = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=1000`);
    setDsDonVi(result?.data?.data?.result);
    const arrTruong: any = [];
    result?.data?.data?.result?.map((item: { loaiDonVi: string }) =>
      item?.loaiDonVi === 'Truong' ? arrTruong.push(item) : undefined,
    );
    setDsTruong(arrTruong);
  };

  const getLop = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=1000`, {
      params: {
        cond: {
          parent: edit ? record?.donViTaoTinId : organizationId,
        },
      },
    });
    setDsLop(result?.data?.data?.result);
  };

  React.useEffect(() => {
    getTruong();
    if (vaiTro === 'HieuTruong') getLop();
    if (record?.donViTaoTinId) getLop();
  }, []);

  const onFinish = async (values: any) => {
    const newVal = values;
    if (newVal.anhDaiDien?.fileList?.length > 0 && !newVal.anhDaiDien?.fileList[0]?.url) {
      const result = await upload(newVal.anhDaiDien);
      newVal.anhDaiDien = {
        url: result.data?.data?.url,
        filename: 'anhDaiDien',
        mimetype: result.data?.data?.file?.mimetype,
      };
    } else {
      newVal.anhDaiDien = {
        url: record.anhDaiDien?.url,
        filename: 'anhDaiDien',
        mimetype: record.anhDaiDien?.mimetype,
      };
    }
    if (vaiTro === 'HieuTruong') {
      newVal.donViTaoTinId = organizationId;
      if (newVal.loaiTinTuc === 'TRUONG') newVal.donViId = [organizationId];
      if (newVal.loaiTinTuc === 'LOP' && newVal.donViId[0] === '*') {
        const dsIdLop: string[] = [];
        dsLop?.map((item: { _id: string }) => dsIdLop.push(item?._id));
        newVal.donViId = dsIdLop;
      }
    }
    if (vaiTro === 'GiaoVien') {
      newVal.donViTaoTinId = organizationId;
      newVal.donViId = [organizationId];
    }
    if (newVal?.loaiTinTuc === 'CHUNG') {
      newVal.donViId = ['*'];
    }
    newVal.noiDung = newVal?.noiDung?.text;
    if (edit) {
      newVal.donViId = record?.donViId;
      try {
        const res = await editTinTuc({ ...newVal, id: record?._id });
        if (res?.data?.statusCode === 200) {
          message.success('Ch???nh s???a th??nh c??ng');
          setVisibleForm(false);
          getTinTucMamNonModel();
          return true;
        }
      } catch (error) {
        message.error('???? x???y ra l???i');
        return false;
      }
    }
    try {
      const res = await addTinTuc({ ...newVal });
      if (res?.data?.statusCode === 201) {
        message.success('Th??m m???i th??nh c??ng');
        setVisibleForm(false);
        getTinTucMamNonModel();
        return true;
      }
    } catch (error) {
      message.error('???? x???y ra l???i');
      return false;
    }
    return false;
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const changeLoaiTin = (val: string) => {
    setLoaiTinTuc(val);
    setIdTruong(undefined);
    form.setFieldsValue({
      donViId: undefined,
    });
  };

  const changeIdTruong = (val: string) => {
    setIdTruong(val);
    form.setFieldsValue({
      donViId: undefined,
    });
    const arrLop: any = [];
    dsDonVi?.map((item: { parent: string }) =>
      item?.parent === val ? arrLop.push(item) : undefined,
    );
    setDsLop(arrLop);
  };

  const changeArrTruongId = (val: string[]) => {
    if (val?.length === 0) {
      setDisableSelectTruong('');
    } else {
      val?.map((item) =>
        item === '*'
          ? setDisableSelectTruong('DisableSelectMulti')
          : setDisableSelectTruong('DisableSelectAll'),
      );
    }
  };

  const changeArrLopId = (val: string[]) => {
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

  const handleView = () => {
    form
      .validateFields()
      .then((values) => {
        let img =
          _.get(
            values,
            `anhDaiDien.fileList[0].${
              edit && !values.anhDaiDien.fileList[0].originFileObj ? 'url' : 'originFileObj'
            }`,
            undefined,
          ) || new File([''], 'filename.jpg', { type: 'image/jpeg', lastModified: 1 });
        const type = typeof img;
        if (typeof img === 'string') {
          img = new File([''], img, { type: 'image/jpeg', lastModified: 1 });
        }
        getBase64(img, (url: any) => {
          Modal.info({
            title: 'Xem tr?????c b??i vi???t',
            width: 1000,
            content: (
              <Card
                bordered={false}
                title={
                  <Tooltip placement="bottom" title={values.tieuDe}>
                    <span style={{ fontWeight: 'bold', fontSize: 20 }}>{values.tieuDe}</span>
                  </Tooltip>
                }
                className="ql-editor"
                actions={[<p>Ng??y ????ng: {moment(values.ngayDang).format('DD/MM/YYYY')}</p>]}
                bodyStyle={{ minHeight: 400 }}
              >
                <Card.Meta
                  avatar={
                    values.anhDaiDien !== undefined ? (
                      <Avatar src={edit && type === 'string' ? img.name : url} size="large" />
                    ) : (
                      <Avatar icon="user" size="large" />
                    )
                  }
                  description={values.moTa}
                />
                {values.noiDung !== undefined ? (
                  <p
                    style={{ marginTop: 20 }}
                    dangerouslySetInnerHTML={{ __html: _.get(values, 'noiDung.text', '') }}
                  />
                ) : null}
              </Card>
            ),
          });
        });
      })
      .catch((errorInfo) => {
        form.scrollToField(`${errorInfo?.errorFields?.[0]?.name?.[0]}`);
        return false;
      });
  };

  return (
    <Card title={edit ? 'Ch???nh s???a' : 'Th??m m???i'}>
      <Form onFinish={onFinish} onFinishFailed={onFinishFailed} labelCol={{ span: 24 }} form={form}>
        <Form.Item
          name="tieuDe"
          label="Ti??u ?????"
          rules={[...rules.required, ...rules.text, ...rules.length(100)]}
          initialValue={record?.tieuDe}
          style={{ marginBottom: 5 }}
        >
          <Input placeholder="Ti??u ?????" />
        </Form.Item>
        <Form.Item
          name="loaiTinTuc"
          label="Lo???i tin t???c"
          rules={[...rules.required]}
          initialValue={record?.loaiTinTuc}
          style={{ marginBottom: 5 }}
        >
          <Select placeholder="Ch???n lo???i tin t???c" onChange={changeLoaiTin} disabled={edit}>
            {vaiTro !== 'HieuTruong' && vaiTro !== 'GiaoVien' && (
              <Select.Option value="CHUNG">Tin chung</Select.Option>
            )}
            {vaiTro !== 'GiaoVien' && <Select.Option value="TRUONG">Tin tr?????ng</Select.Option>}
            <Select.Option value="LOP">Tin l???p</Select.Option>
          </Select>
        </Form.Item>
        {!edit && (
          <>
            {loaiTinTuc === 'TRUONG' && (vaiTro === 'SuperAdmin' || vaiTro === 'Admin') && (
              <Form.Item
                name="donViId"
                label="Danh s??ch tr?????ng nh???n tin t???c"
                rules={[...rules.required]}
                style={{ marginBottom: 5 }}
                initialValue={record?.donViId}
              >
                <Select
                  showSearch
                  allowClear
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="Ch???n tr?????ng nh???n tin t???c"
                  optionFilterProp="children"
                  filterOption={(input, option: any) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={changeArrTruongId}
                >
                  <Select.Option disabled={disableSelectTruong === 'DisableSelectAll'} value="*">
                    T???t c??? c??c tr?????ng
                  </Select.Option>
                  {dsTruong?.map((item: { tenDonVi: string; _id: string }) => (
                    <Select.Option
                      disabled={disableSelectTruong === 'DisableSelectMulti'}
                      value={item?._id}
                    >
                      {item?.tenDonVi}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
            {loaiTinTuc === 'LOP' && vaiTro !== 'HieuTruong' && vaiTro !== 'GiaoVien' && (
              <Form.Item
                name="school"
                label="Tr?????ng nh???n tin t???c"
                rules={[...rules.required]}
                style={{ marginBottom: 5 }}
              >
                <Select
                  onChange={changeIdTruong}
                  showSearch
                  allowClear
                  style={{ width: '100%' }}
                  placeholder="Ch???n tr?????ng nh???n tin t???c"
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
            {(idTruong || (vaiTro === 'HieuTruong' && loaiTinTuc === 'LOP')) && (
              <Form.Item
                label="Danh s??ch l???p nh???n tin t???c"
                name="donViId"
                rules={[...rules.required]}
                style={{ marginBottom: 5 }}
                initialValue={record?.donViId}
              >
                <Select
                  onChange={changeArrLopId}
                  showSearch
                  allowClear
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="Ch???n l???p nh???n tin t???c"
                  optionFilterProp="children"
                  filterOption={(input, option: any) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Select.Option disabled={disableSelectLop === 'DisableSelectAll'} value="*">
                    T???t c??? c??c l???p
                  </Select.Option>
                  {dsLop?.map((item: { tenDonVi: string; _id: string }) => (
                    <Select.Option
                      disabled={disableSelectLop === 'DisableSelectMulti'}
                      value={item?._id}
                    >
                      {item?.tenDonVi}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </>
        )}
        <Form.Item
          name="doiTuong"
          label="Vai tr?? nh???n tin t???c"
          rules={[...rules.required]}
          initialValue={record?.doiTuong}
          style={{ marginBottom: 5 }}
        >
          <Select placeholder="Ch???n vai tr?? nh???n tin t???c" mode="multiple">
            {vaiTro !== 'GiaoVien' && vaiTro !== 'HieuTruong' && loaiTinTuc !== 'LOP' && (
              <Select.Option value="HieuTruong">Hi???u tr?????ng</Select.Option>
            )}
            {vaiTro !== 'GiaoVien' && <Select.Option value="GiaoVien">Gi??o vi??n</Select.Option>}
            <Select.Option value="PhuHuynh">Ph??? huynh</Select.Option>
          </Select>
        </Form.Item>

        <Row gutter={[16, 0]}>
          <Col xl={12} xs={24}>
            <Form.Item
              name="ngayDang"
              label="Ng??y ????ng"
              initialValue={record?.ngayDang ? moment(record?.ngayDang) : undefined}
              style={{ marginBottom: 5 }}
            >
              <DatePicker
                placeholder="Ch???n ng??y ????ng"
                format="DD-MM-YYYY"
                style={{ width: '100%' }}
                defaultValue={moment()}
              />
            </Form.Item>
          </Col>
          <Col xl={12} xs={24}>
            <Form.Item
              name="binhLuan"
              label="T??nh n??ng b??i vi???t"
              rules={[...rules.required]}
              initialValue={record?.binhLuan}
              style={{ marginBottom: 5 }}
            >
              <Radio.Group>
                <Radio value={true}>B??nh lu???n</Radio>
                <Radio value={false}>Ch??? xem</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
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
          name="anhDaiDien"
          label="???nh ?????i di???n"
          initialValue={renderFileListUrl(record?.anhDaiDien?.url)}
          style={{ marginBottom: 5 }}
          rules={[...rules.fileRequired]}
        >
          <UploadAnh />
        </Form.Item>
        <Form.Item
          name="noiDung"
          label="N???i dung"
          initialValue={{ text: record?.noiDung || '' }}
          rules={[
            {
              validator: (ece, value, callback) => {
                const { text } = value;
                if (!text || !text.length || !text[0]) {
                  callback('');
                }
                callback();
              },
              message: 'H??y nh???p n???i dung',
            },
            ...rules.required,
          ]}
        >
          <TinyEditor />
        </Form.Item>
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button type="default" onClick={handleView} style={{ marginRight: 8 }}>
            Xem tr?????c
          </Button>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            {!edit ? 'Th??m m???i' : 'L??u'}
          </Button>
          <Button onClick={() => setVisibleForm(false)}>????ng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
export default FormTinTuc;
