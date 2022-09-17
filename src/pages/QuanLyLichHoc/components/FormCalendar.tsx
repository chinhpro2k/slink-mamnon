/* eslint-disable no-underscore-dangle */
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import rules from '@/utils/rules';
import { DeleteOutlined } from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  notification,
  Popconfirm,
  Row,
  Select,
  Tooltip,
  Upload,
} from 'antd';
import moment from 'moment';
import { useState, useEffect } from 'react';

const FormCalendar = ({
  onFinish,
  formItemLayout,
  newRecord,
  record,
  danhSachLop,
  noiDungHoatDong,
  changeNoiDung,
  noiDung,
  form,
  // setBaiHoc,
  danhSachBaiHoc,
  edit,
  checkXacNhan,
  daHoanThanh,
  closeForm,
  getLichHocModel,
  setVisibleDrawer,
  setNewRecord,
  handleDel,
  timeStart,
  timeEnd,
}: any) => {
  const [hasTaiLieu, setHasTaiLieu] = useState(false);
  useEffect(() => {
    if (newRecord?.taiLieu?.length > 0) {
      setHasTaiLieu(true);
    }
  }, []);
  return (
    <Form
      onFinish={onFinish}
      {...formItemLayout}
      form={form}
      initialValues={{
        ...newRecord,
        thoiGianBatDau:
          !timeStart && newRecord?.thoiGianBatDau ? moment(newRecord?.thoiGianBatDau) : undefined,
        thoiGianKetThuc:
          !timeEnd && newRecord?.thoiGianKetThuc ? moment(newRecord?.thoiGianKetThuc) : undefined,
        donViId: record?._id,
      }}
    >
      <Row>
        <Col span={24}>
          <Form.Item
            name="donViId"
            label="Tên lớp"
            rules={[...rules.required]}
            style={{ marginBottom: 0 }}
          >
            <Select placeholder="Chọn lớp" disabled>
              {danhSachLop?.map((item: any) => (
                <Select.Option value={item?._id ?? ''}>{item?.tenDonVi}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      {!timeStart && !timeEnd ? (
        <Row gutter={[16, 0]}>
          <Col span={12}>
            <Form.Item
              name="thoiGianBatDau"
              label="Thời gian bắt đầu học"
              rules={[...rules.required]}
              style={{ marginBottom: 0 }}
              initialValue={
                newRecord?.thoiGianBatDau ? moment(newRecord?.thoiGianBatDau) : undefined
              }
            >
              <DatePicker
                onChange={(val) =>
                  form.setFieldsValue({
                    thoiGianKetThuc: moment(val),
                  })
                }
                format="DD/MM/YYYY HH:mm"
                placeholder="Chọn thời gian bắt đầu học"
                style={{ width: '100%' }}
                showTime
                disabledHours={() => [0, 1, 2, 3, 4, 5, 21, 22, 23]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="thoiGianKetThuc"
              label="Thời gian kết thúc"
              rules={[...rules.required]}
              style={{ marginBottom: 0 }}
              initialValue={
                newRecord?.thoiGianKetThuc ? moment(newRecord?.thoiGianKetThuc) : undefined
              }
            >
              <DatePicker
                format="DD/MM/YYYY HH:mm"
                placeholder="Chọn thời gian kết thúc"
                style={{ width: '100%' }}
                disabledHours={() => [0, 1, 2, 3, 4, 5, 21, 22, 23]}
                disabledDate={(current) => {
                  if (form.getFieldValue('thoiGianBatDau')) {
                    return !(
                      moment(current)
                        .set('hour', 0)
                        .set('minute', 0)
                        .set('second', 0)
                        .format('DD/MM/YYYY') ===
                      moment(form.getFieldValue('thoiGianBatDau'))
                        .set('hour', 0)
                        .set('minute', 0)
                        .set('second', 0)
                        .format('DD/MM/YYYY')
                    );
                  }
                  return false;
                }}
                showTime
              />
            </Form.Item>
          </Col>
        </Row>
      ) : (
        <Row gutter={[16, 0]}>
          <Col span={12}>
            <Form.Item
              name="thoiGianBatDau"
              label="Thời gian bắt đầu học"
              rules={[...rules.required]}
              style={{ marginBottom: 0 }}
              initialValue={
                newRecord?.thoiGianBatDau ? moment(newRecord?.thoiGianBatDau) : moment(timeStart)
              }
            >
              <DatePicker
                format="DD/MM/YYYY HH:mm"
                placeholder="Chọn thời gian bắt đầu học"
                style={{ width: '100%' }}
                showTime
                disabledHours={() => [0, 1, 2, 3, 4, 5, 21, 22, 23]}
                disabledDate={(current) => {
                  if (timeEnd && !edit) {
                    return !(
                      moment(current)
                        .set('hour', 0)
                        .set('minute', 0)
                        .set('second', 0)
                        .format('DD/MM/YYYY') ===
                      moment(timeEnd)
                        .set('hour', 0)
                        .set('minute', 0)
                        .set('second', 0)
                        .format('DD/MM/YYYY')
                    );
                  }
                  // return false;
                  return moment(current).isBefore(moment().subtract(1, 'day'));
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="thoiGianKetThuc"
              label="Thời gian kết thúc"
              rules={[...rules.required]}
              style={{ marginBottom: 0 }}
              initialValue={
                newRecord?.thoiGianKetThuc ? moment(newRecord?.thoiGianKetThuc) : moment(timeEnd)
              }
            >
              <DatePicker
                format="DD/MM/YYYY HH:mm"
                placeholder="Chọn thời gian kết thúc"
                style={{ width: '100%' }}
                disabledHours={() => [0, 1, 2, 3, 4, 5, 21, 22, 23]}
                showTime
                disabledDate={(current) => {
                  if (timeStart && !edit) {
                    return !(
                      moment(current)
                        .set('hour', 0)
                        .set('minute', 0)
                        .set('second', 0)
                        .format('DD/MM/YYYY') ===
                      moment(timeStart)
                        .set('hour', 0)
                        .set('minute', 0)
                        .set('second', 0)
                        .format('DD/MM/YYYY')
                    );
                  }
                  // return false;
                  return moment(current).isBefore(moment().subtract(1, 'day'));
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      )}

      <Row gutter={[16, 0]}>
        <Col span={24}>
          <Form.Item
            name="noiDungHoatDong"
            label="Nội dung hoạt động"
            rules={[...rules.required]}
            style={{ marginBottom: 0 }}
          >
            <Select placeholder="Chọn nội dung hoạt động" onChange={changeNoiDung}>
              {noiDungHoatDong?.map((item: any) => (
                <Select.Option value={item?.value}>{item?.lable}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        {(noiDung === 'Học ngoài trời' || noiDung === 'Học trên lớp') && (
          <Col span={12}>
            <Form.Item
              name="baiHocId"
              label="Bài học"
              rules={[...rules.required]}
              style={{ marginBottom: 0 }}
            >
              <Select
                placeholder="Chọn bài học"
                showSearch
                optionFilterProp="children"
                // onSearch={onSearch}
                filterOption={(input, option) => {
                  return option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                onSelect={(value, option) => {
                  // setBaiHoc(option?.obj);
                  const arrTaiLieu = option?.obj?.taiLieu?.map((item: string) => ({
                    name: item,
                    url: item,
                    status: 'done',
                    size: 123,
                    type: 'img/png',
                  }));
                  if (arrTaiLieu && arrTaiLieu.length > 0) {
                    setHasTaiLieu(true);
                  }
                  form.setFieldsValue({
                    monHocId: option?.obj?.monHocId ?? '',
                    chuongTrinhDaoTaoId: option?.obj?.chuongTrinhDaoTaoId ?? '',
                    taiLieu: arrTaiLieu,
                    moTaBaiHoc: option?.obj?.moTa ?? undefined,
                  });
                }}
              >
                {danhSachBaiHoc?.map((item: any) => (
                  <Select.Option value={item?._id} obj={item}>
                    {item?.tenBaiHoc}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        )}
      </Row>
      {noiDung === 'Học trên lớp' || noiDung === 'Học ngoài trời' ? (
        <>
          <Form.Item
            name="taiLieu"
            label="Tài liệu"
            style={{ marginBottom: 5 }}
            valuePropName="fileList"
            shouldUpdate
          >
            <Upload disabled>{!hasTaiLieu && <i>Không có tài liệu</i>}</Upload>
          </Form.Item>
        </>
      ) : (
        <></>
      )}
      <Form.Item
        name="moTaHoatDong"
        label="Mô tả hoạt động"
        style={{ marginBottom: 0 }}
        rules={[...rules.required]}
      >
        <Input.TextArea rows={3} placeholder="Nhập mô tả hoạt động" />
      </Form.Item>
      <Divider />
      {edit && (
        <Tooltip title="Chỉ xác nhận sau khi kết thúc lịch" placement="leftTop">
          <Form.Item name="daHoanThanh" valuePropName="checked">
            <Checkbox disabled={checkXacNhan()}>Xác nhận giảng dạy</Checkbox>
          </Form.Item>
        </Tooltip>
      )}
      <Divider />
      <Form.Item>
        <div>
          <Button
            htmlType="submit"
            type="primary"
            style={{ marginRight: '10px' }}
            disabled={daHoanThanh}
          >
            {edit ? 'Cập nhật' : 'Thêm mới'}
          </Button>
          <Button
            onClick={() => {
              closeForm();
            }}
            style={{ marginRight: 15 }}
          >
            Quay lại
          </Button>
          {edit && (
            <Button
              type="primary"
              onClick={async () => {
                if (form.getFieldValue('daHoanThanh')) {
                  // if ()
                  if (moment(new Date()).isBefore(form.getFieldValue('thoiGianKetThuc'))) {
                    notification.error({
                      message: 'Chưa đến thời gian xác nhận lịch học',
                      placement: 'bottomRight',
                    });
                    return;
                  }
                  try {
                    await axios.put(`${ip3}/lich-hoc/giao-vien/xac-nhan/${newRecord?._id}`);
                    getLichHocModel({ donViId: record?._id ?? '' });
                    setVisibleDrawer(false);
                    setNewRecord(undefined);
                    form.resetFields();
                    notification.success({
                      message: 'Xác nhận thành công',
                      placement: 'bottomRight',
                    });
                  } catch (e) {
                    notification.error({
                      message: 'Xác nhận không thành công',
                      placement: 'bottomRight',
                    });
                  }
                } else {
                  notification.error({
                    message: 'Yêu cầu xác nhận giảng dạy',
                    placement: 'bottomRight',
                  });
                }
              }}
              disabled={checkXacNhan()}
              style={{ marginRight: 15 }}
            >
              Xác nhận giảng dạy
            </Button>
          )}
          {edit && (
            <Popconfirm
              title="Bạn có muốn xóa?"
              okText="Có"
              cancelText="Không"
              onConfirm={() => {
                handleDel(newRecord);
              }}
              disabled={daHoanThanh}
            >
              <Button icon={<DeleteOutlined />} disabled={daHoanThanh}>
                Xóa lịch
              </Button>
            </Popconfirm>
          )}
        </div>
      </Form.Item>
    </Form>
  );
};

export default FormCalendar;
