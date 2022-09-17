/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
import { checkAllow } from '@/components/CheckAuthority';
import { PlusCircleFilled } from '@ant-design/icons';
import { Button, Card, Col, Drawer, Modal, notification, Row, Spin, Tag } from 'antd';
import moment from 'moment';
import mm from 'moment-timezone';
import 'moment/locale/vi';
import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useModel } from 'umi';
import FormTemplateCalendar from './FormTemplateCalendar';
import { noiDungHoatDong } from '../../QuanLyLichHoc/index';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const messages = {
  allDay: 'Cả ngày',
  previous: 'Trước',
  next: 'Sau',
  today: 'Hôm nay',
  month: 'Tháng',
  week: 'Tuần',
  day: 'Ngày',
  agenda: 'Chung',
  date: 'Ngày',
  time: 'Thời gian',
  event: 'Sự kiện',
  showMore: (total: any) => `+ Xem thêm (${total})`,
};

const weekDay = [
  {
    title: 'Thứ hai',
    value: 1,
  },
  {
    title: 'Thứ ba',
    value: 2,
  },
  {
    title: 'Thứ tư',
    value: 3,
  },
  {
    title: 'Thứ năm',
    value: 4,
  },
  {
    title: 'Thứ sáu',
    value: 5,
  },
  {
    title: 'Thứ bảy',
    value: 6,
  },
  {
    title: 'Chủ nhật',
    value: 7,
  },
];

const TemplateCalendar = ({ template }: any) => {
  const localizer = momentLocalizer(moment);
  const [visibleShowMore, setVisibleShowMore] = useState(false);
  const [showMoreProps, setShowMoreProps] = useState([]);

  const templateLichHoc = useModel('templatelich');
  const { danhSach: danhSachBaiHoc, getBaiHocModel } = useModel('baihoc');
  const { danhSach: danhSachLinhVucPhatTrien, getMonHocModel } = useModel('monhoc');
  // const [noiDung, setNoiDung] = useState<string>();
  const [edit, setEdit] = useState<boolean>(false);
  const [record, setRecord] = useState<any>(undefined);
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);

  useEffect(() => {
    getMonHocModel({ page: 1, limit: 10000, cond: {} });
    getBaiHocModel({ page: 1, limit: 10000, cond: {}, donViId: template?._id ?? '' });
    templateLichHoc.getTemplateChiTietModel(template?._id);
  }, []);

  const onSelectEvent = (recordEvent: any) => {
    setRecord(recordEvent);
    setEdit(true);
    setVisibleDrawer(true);
  };

  const handleAdd = () => {
    setRecord(undefined);
    setEdit(false);
    setVisibleDrawer(true);
  };

  const handleEdit = (recordEvent: any) => {
    onSelectEvent(recordEvent);
  };

  const closeForm = () => {
    setVisibleDrawer(false);
  };

  const onFinish = async (values: any) => {
    let newVal;
    if (moment(values.gioBatDau).isAfter(moment(values.gioKetThuc))) {
      notification.warning({
        message: 'Thời gian kết thúc phải sau thời gian bắt đầu',
      });
      return;
    }
    if (!edit) {
      try {
        newVal = {
          ...values,
          gioBatDau: moment(values.gioBatDau).format('HH:mm'),
          gioKetThuc: moment(values.gioKetThuc).format('HH:mm'),
          templateId: template?._id,
        };
        await templateLichHoc.addTemplateChiTietModel(newVal);
        closeForm();
      } catch (e) {
        notification.error({
          message: 'Cập nhật không thành công',
        });
      }
    } else {
      newVal = {
        ...values,
        gioBatDau: moment(values.gioBatDau).format('HH:mm'),
        gioKetThuc: moment(values.gioKetThuc).format('HH:mm'),
      };
      await templateLichHoc.updTemplateChiTietModel({ ...record, ...newVal });
      closeForm();
    }
  };

  let dataEvent = [];

  if (template?.loai === 'Ngày') {
    dataEvent = templateLichHoc.danhSachEvent?.map((item: any) => {
      const arrGioBatDau = item?.gioBatDau?.split(':');
      const arrGioKetThuc = item?.gioKetThuc?.split(':');
      return {
        ...item,
        title: item?.noiDungHoatDong ?? '',
        gioBatDau: moment()
          .set('hour', parseInt(arrGioBatDau[0]))
          .set('minute', parseInt(arrGioBatDau[1])),
        gioKetThuc: moment()
          .set('hour', parseInt(arrGioKetThuc[0]))
          .set('minute', parseInt(arrGioKetThuc[1])),
        start: moment()
          .set('hour', parseInt(arrGioBatDau[0]))
          .set('minute', parseInt(arrGioBatDau[1]))
          .toDate(),
        end: moment()
          .set('hour', parseInt(arrGioKetThuc[0]))
          .set('minute', parseInt(arrGioKetThuc[1]))
          .toDate(),
      };
    });
  } else {
    dataEvent = templateLichHoc.danhSachEvent?.map((item: any) => {
      const arrGioBatDau = item?.gioBatDau?.split(':');
      const arrGioKetThuc = item?.gioKetThuc?.split(':');
      const res = {
        ...item,
        gioBatDau: moment()
          .set('hour', parseInt(arrGioBatDau[0]))
          .set('minute', parseInt(arrGioBatDau[1])),
        gioKetThuc: moment()
          .set('hour', parseInt(arrGioKetThuc[0]))
          .set('minute', parseInt(arrGioKetThuc[1])),
        title: item?.noiDungHoatDong ?? '',
        start: moment()
          .startOf('week')
          .add(item.thu - 1, 'days')
          .set('hour', parseInt(arrGioBatDau[0]))
          .set('minute', parseInt(arrGioBatDau[1]))
          .toDate(),
        end: moment()
          .startOf('week')
          .add(item.thu - 1, 'days')
          .set('hour', parseInt(arrGioKetThuc[0]))
          .set('minute', parseInt(arrGioKetThuc[1]))
          .toDate(),
      };
      return res;
    });
  }

  // let formats = {
  //   // dateFormat: 'dd',

  //   dayFormat: (date, culture, localizerFormat) => {
  //     return date.
  //   }

  //   // dayRangeHeaderFormat: ({ start, end }, culture, localizerFormat) =>
  //   //   `${localizerFormat.format(start, { date: 'short' }, culture)} — ${localizerFormat.format(end, { date: 'short' }, culture)}`
  // }

  return (
    <Card bordered>
      <Row gutter={24}>
        <Col xs={24}>
          <Spin spinning={false}>
            <div>
              {checkAllow('ADD_LICH_HOC_TEMPLATE') && (
                <Button
                  style={{ marginBottom: '10px', marginRight: 15 }}
                  onClick={() => handleAdd()}
                  type="primary"
                >
                  <PlusCircleFilled />
                  Thêm mới
                </Button>
              )}
              {/* <Button
                style={{ marginBottom: '10px', marginRight: 15 }}
                onClick={async () => {
                  // const response = await axios.get(
                  //   `${ip3}/lich-hoc/export-excel/lich-hoc/${selectedLop?._id}`,
                  // );
                  // window.open(response?.data?.data?.url);
                }}
                type="primary"
              >
                <ExportOutlined />
                Export
              </Button>
              <Upload
                showUploadList={false}
                onChange={async (props) => {
                  if (props.file.status === 'done') {
                    let formData = new FormData();
                    formData.append('file', props?.file?.originFileObj ?? '');
                    try {
                      const response = await axios.post(`${ip3}/lich-hoc/import/excel/`, formData);
                      notification.success({
                        message: ' Import thành công',
                        placement: 'bottomRight',
                      });
                    } catch (e) {
                      notification.error({
                        message: ' Import không thành công',
                        placement: 'bottomRight',
                      });
                    }
                  }
                }}
                customRequest={({ file, onSuccess }) => {
                  setTimeout(() => {
                    if (onSuccess) onSuccess(file, new XMLHttpRequest());
                  }, 0);
                }}
              >
                <Button style={{ marginBottom: '10px', marginRight: 15 }} type="primary">
                  <PlusCircleFilled />
                  Import
                </Button>
              </Upload> */}
            </div>
            <Calendar
              localizer={localizer}
              events={dataEvent}
              view={template?.loai === 'Ngày' ? Views.DAY : Views.WEEK}
              scrollToTime={new Date(1970, 1, 1)}
              defaultDate={new Date()}
              messages={messages}
              views={['week', 'day']}
              style={{ height: 700 }}
              min={moment('0000', 'HHmm').toDate()}
              max={moment('2359', 'HHmm').toDate()}
              formats={{
                dayFormat: (date) => {
                  return `${weekDay[moment(date).isoWeekday() - 1].title}`;
                },
              }}
              // eventPropGetter={this.eventPropGetter}
              onSelectEvent={
                checkAllow('EDIT_LICH_HOC_TEMPLATE') ? (val) => onSelectEvent(val) : undefined
              }
              onShowMore={(props: any) => {
                setShowMoreProps(props);
                setVisibleShowMore(true);
              }}
              // showAllEvents={true}
              // components={{ event: (event, date) => this.eventCustom(event) }}
              popup
              toolbar={false}
            />
            <Modal
              visible={visibleShowMore}
              title="Xem thêm"
              onCancel={() => {
                setShowMoreProps([]);
                setVisibleShowMore(false);
              }}
              footer={[
                <Button
                  onClick={() => {
                    setShowMoreProps([]);
                    setVisibleShowMore(false);
                  }}
                >
                  Thoát
                </Button>,
              ]}
            >
              <Row gutter={[20, 20]}>
                {showMoreProps.map(
                  (item: { noiDungHoatDong: string; moTaHoatDong: string }, index) => (
                    <Col span={24} style={{ cursor: 'pointer' }}>
                      <Tag
                        color="#0076AD"
                        onClick={() => {
                          handleEdit(item);
                          setShowMoreProps([]);
                          setVisibleShowMore(false);
                        }}
                      >
                        {index + 1}.{' '}
                        {`${item?.noiDungHoatDong ?? ''} - ${item?.moTaHoatDong ?? ''}`}
                      </Tag>
                    </Col>
                  ),
                )}
              </Row>
            </Modal>
            <Drawer
              visible={visibleDrawer}
              title={edit ? 'Chỉnh sửa' : 'Thêm mới'}
              onClose={() => closeForm()}
              destroyOnClose
              width="50%"
            >
              <FormTemplateCalendar
                view={template?.loai}
                edit={edit}
                record={record}
                closeForm={closeForm}
                danhSachLinhVucPhatTrien={danhSachLinhVucPhatTrien}
                weekDay={weekDay}
                onFinish={onFinish}
                noiDungHoatDong={noiDungHoatDong}
                danhSachBaiHoc={danhSachBaiHoc}
              />
              {edit && <div style={{ width: '100%' }} />}
            </Drawer>
          </Spin>
        </Col>
      </Row>
    </Card>
  );
};

export default TemplateCalendar;
