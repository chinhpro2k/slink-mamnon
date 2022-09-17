/* eslint-disable no-underscore-dangle */
import rules from '@/utils/rules';
import { DeleteOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Popconfirm,
  Row,
  Select,
  TimePicker,
  Upload,
} from 'antd';
import moment from 'moment';
import type { Key } from 'rc-select/lib/interface/generator';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FormTemplateCalendar = ({
  view,
  edit,
  record,
  closeForm,
  onFinish,
  weekDay,
  noiDungHoatDong,
  danhSachBaiHoc,
}: any) => {
  const [form] = Form.useForm();
  const templateLichHoc = useModel('templatelich');
  const [noiDung, setNoiDung] = useState<string>();
  const [hasTaiLieu, setHasTaiLieu] = useState(false);
  // const [baiHoc, setBaiHoc] = useState(undefined);

  useEffect(() => {
    if (
      record?.noiDungHoatDong === 'Học trên lớp' ||
      record?.noiDungHoatDong === 'Học ngoài trời'
    ) {
      setNoiDung(record?.noiDungHoatDong);
      const tmpBaiHoc = danhSachBaiHoc?.filter(
        (item: { _id: string }) => item?._id === record?.baiHocId,
      )?.[0];
      // setBaiHoc(tmpBaiHoc);
      if (tmpBaiHoc?.taiLieu?.length > 0) {
        setHasTaiLieu(true);
      }
      form.setFieldsValue({
        taiLieu: tmpBaiHoc?.taiLieu?.map((item: string) => ({
          name: item,
          url: item,
          status: 'done',
          size: 123,
          type: 'img/png',
        })),
        moTaBaiHoc: tmpBaiHoc?.moTa,
      });
    }
  }, []);

  const changeNoiDung = (val: string) => {
    setNoiDung(val);
  };
  return (
    <Form
      onFinish={onFinish}
      {...{
        labelCol: { span: 24 },
        wrapperCol: { span: 24 },
      }}
      form={form}
      initialValues={{
        ...record,
        gioBatDau: record?.gioBatDau ? moment(record.gioBatDau) : undefined,
        gioKetThuc: record?.gioKetThuc ? moment(record.gioKetThuc) : undefined,
      }}
    >
      {view === 'Tuần' && (
        <Row gutter={[16, 0]}>
          <Col span={12}>
            <Form.Item
              name="thu"
              label="Thứ"
              rules={[...rules.required]}
              style={{ marginBottom: 0 }}
            >
              <Select placeholder="Chọn ngày thứ">
                {weekDay?.map((item: { value: Key; title: string }) => (
                  <Select.Option value={item?.value}>{item?.title}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      )}
      <Row gutter={[16, 0]}>
        <Col span={12}>
          <Form.Item
            name="gioBatDau"
            label="Thời gian bắt đầu học"
            rules={[...rules.required]}
            style={{ marginBottom: 0 }}
          >
            <TimePicker
              format="HH:mm"
              placeholder="Chọn thời gian bắt đầu học"
              style={{ width: '100%' }}
              // disabledDate={(current) => {
              //   if (form.getFieldValue('thoiGianKetThuc')) {
              //     return !(
              //       moment(current)
              //         .set('hour', 0)
              //         .set('minute', 0)
              //         .set('second', 0)
              //         .format('DD/MM/YYYY') ===
              //       moment(form.getFieldValue('thoiGianKetThuc'))
              //         .set('hour', 0)
              //         .set('minute', 0)
              //         .set('second', 0)
              //         .format('DD/MM/YYYY')
              //     );
              //   }
              //   return moment(current).isBefore(moment().subtract(1, 'day'));
              // }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="gioKetThuc"
            label="Thời gian kết thúc"
            rules={[...rules.required]}
            style={{ marginBottom: 0 }}
          >
            <TimePicker
              format="HH:mm"
              placeholder="Chọn thời gian kết thúc"
              style={{ width: '100%' }}
              // disabledDate={(current) => {
              //   if (form.getFieldValue('thoiGianBatDau')) {
              //     return !(
              //       moment(current)
              //         .set('hour', 0)
              //         .set('minute', 0)
              //         .set('second', 0)
              //         .format('DD/MM/YYYY') ===
              //       moment(form.getFieldValue('thoiGianKetThuc'))
              //         .set('hour', 0)
              //         .set('minute', 0)
              //         .set('second', 0)
              //         .format('DD/MM/YYYY')
              //     );
              //   }
              //   return moment(current).isBefore(moment().subtract(1, 'day'));
              // }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 0]}>
        <Col span={24}>
          <Form.Item
            name="noiDungHoatDong"
            label="Nội dung hoạt động"
            rules={[...rules.required]}
            style={{ marginBottom: 0 }}
          >
            <Select placeholder="Chọn nội dung hoạt động" onChange={changeNoiDung}>
              {noiDungHoatDong?.map((item: { value: Key; lable: string }) => (
                <Select.Option value={item?.value}>{item?.lable}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        {(noiDung === 'Học ngoài trời' || noiDung === 'Học trên lớp') && (
          <Col span={24}>
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
                filterOption={(input, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onSelect={(value, option) => {
                  // setBaiHoc(option?.obj);
                  if (option?.obj?.taiLieu?.length > 0) {
                    setHasTaiLieu(true);
                  }
                  form.setFieldsValue({
                    monHocId: option?.obj?.monHocId ?? '',
                    chuongTrinhDaoTaoId: option?.obj?.chuongTrinhDaoTaoId ?? '',
                    taiLieu: option?.obj?.taiLieu?.map((item: string) => ({
                      name: item,
                      url: item,
                      status: 'done',
                      size: 123,
                      type: 'img/png',
                    })),
                    moTaBaiHoc: option?.obj?.moTa ?? undefined,
                  });
                }}
              >
                {danhSachBaiHoc?.map((item: { _id: Key; tenBaiHoc: string }) => (
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
            name="moTaBaiHoc"
            label="Mô tả bài học"
            // rules={[...rules.required]}
            style={{ marginBottom: 0 }}
          >
            <Input.TextArea disabled placeholder="Không có" />
          </Form.Item>
          <Form.Item
            name="taiLieu"
            label="Tài liệu"
            style={{ marginBottom: 5 }}
            valuePropName="fileList"
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
      <Form.Item>
        <div>
          <Button htmlType="submit" type="primary" style={{ marginRight: '10px' }}>
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
            <Popconfirm
              title="Bạn có muốn xóa?"
              okText="Có"
              cancelText="Không"
              onConfirm={() => {
                // handleDel(newRecord);
                templateLichHoc.delTemplateChiTietModel(record);
                closeForm();
              }}
            >
              <Button icon={<DeleteOutlined />}>Xóa lịch</Button>
            </Popconfirm>
          )}
        </div>
      </Form.Item>
    </Form>
  );
};

export default FormTemplateCalendar;
