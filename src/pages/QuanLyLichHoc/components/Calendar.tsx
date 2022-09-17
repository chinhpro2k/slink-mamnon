/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
import { checkAllow } from '@/components/CheckAuthority';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import { DeleteOutlined, ExportOutlined, PlusCircleFilled } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Drawer,
  Modal,
  notification,
  Popconfirm,
  Row,
  Select,
  Spin,
  Tag,
  Upload,
} from 'antd';
import moment from 'moment';
import mm from 'moment-timezone';
import 'moment/locale/vi';
import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useModel } from 'umi';
import FormCalendar from './FormCalendar';
import FormTaoTemplateTuLich from './FormTaoTemplateTuLich';

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

const LichHocCalendar = (props: any) => {
  const {
    selectedLop,
    handleAdd,
    handleEdit,
    visibleDrawer,
    edit,
    closeForm,
    onFinish,
    formItemLayout,
    newRecord,
    record,
    danhSachLop,
    noiDung,
    noiDungHoatDong,
    changeNoiDung,
    form,
    // setBaiHoc,
    danhSachBaiHoc,
    checkXacNhan,
    daHoanThanh,
    getLichHocModel,
    setVisibleDrawer,
    setNewRecord,
    handleDel,
  } = props;
  const localizer = momentLocalizer(moment);
  const [visibleShowMore, setVisibleShowMore] = useState(false);
  const [showMoreProps, setShowMoreProps] = useState([]);
  const [templateSelected, setTemplateSelected] = useState(undefined);
  const {
    danhSach,
    getTemplateModel,
    danhSachTemplate,
    addLichFromTemplateModel,
    deleteAllLichModel,
  } = useModel('lichhoc');
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<any>('month');
  const [visibleTaoTemplate, setVisibleTaoTemplate] = useState(false);
  const [timeStart, setTimeStart] = useState();
  const [timeEnd, setTimeEnd] = useState();
  useEffect(() => {
    getLichHocModel({ donViId: selectedLop?._id ?? '' });
  }, []);
  const onSelectEvent = (dataSelect: any) => {
    setTimeEnd(undefined);
    setTimeStart(undefined);
    handleEdit(dataSelect);
  };
  const handleSelect = ({ start, end }: any) => {
    if (view === 'month') {
      setTimeStart(start);
      setTimeEnd(start);
    } else {
      setTimeStart(start);
      setTimeEnd(end);
    }
    handleAdd();
  };
  const dataEvent = danhSach.map((item) => ({
    ...item,
    title: `${item?.noiDungHoatDong ?? ''}`,
    start: moment(item.thoiGianBatDau).toDate(),
    end: moment(item.thoiGianKetThuc).toDate(),
  }));
  return (
    <Card bordered>
      <Row gutter={24}>
        <Col xs={24}>
          <Spin spinning={false}>
            <div>
              <Button
                style={{ marginBottom: '10px', marginRight: 15 }}
                onClick={() => {
                  handleAdd();
                  setTimeEnd(undefined);
                  setTimeStart(undefined);
                }}
                disabled={!checkAllow('ADD_LICH_HOC')}
                type="primary"
              >
                <PlusCircleFilled />
                Thêm mới
              </Button>
              <Button
                style={{ marginBottom: '10px', marginRight: 15 }}
                onClick={async () => {
                  const response = await axios.get(
                    `${ip3}/lich-hoc/export-excel/lich-hoc/${selectedLop?._id}`,
                  );
                  window.open(response?.data?.data?.url);
                }}
                type="primary"
                disabled={!checkAllow('EXPORT_LICH_HOC')}
              >
                <ExportOutlined />
                Export
              </Button>
              <Upload
                showUploadList={false}
                onChange={async (val) => {
                  if (val.file.status === 'done') {
                    const formData = new FormData();
                    formData.append('file', val?.file?.originFileObj ?? '');
                    try {
                      await axios.post(`${ip3}/lich-hoc/import/excel/`, formData);
                      await getLichHocModel({ donViId: selectedLop?._id ?? '' });
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
                <Button
                  style={{ marginBottom: '10px', marginRight: 15 }}
                  type="primary"
                  disabled={!checkAllow('IMPORT_LICH_HOC')}
                >
                  <PlusCircleFilled />
                  Import
                </Button>
              </Upload>
              <Popconfirm
                title="Bạn có muốn xóa tất cả lịch"
                okText="Có"
                cancelText="Không"
                onConfirm={() => {
                  deleteAllLichModel({ donViId: selectedLop?._id });
                }}
                disabled={!checkAllow('DEL_LICH_HOC')}
              >
                <Button
                  icon={<DeleteOutlined />}
                  style={{ marginRight: 15 }}
                  disabled={!checkAllow('DEL_LICH_HOC')}
                >
                  Xóa tất cả lịch
                </Button>
              </Popconfirm>
              {view === 'week' && (
                <Button
                  style={{ marginRight: 15 }}
                  onClick={() => {
                    setVisibleTaoTemplate(true);
                  }}
                >
                  Thêm mới template tuần từ lịch
                </Button>
              )}
              {view === 'day' && (
                <Button
                  style={{ marginRight: 15 }}
                  onClick={() => {
                    setVisibleTaoTemplate(true);
                  }}
                >
                  Thêm mới template ngày từ lịch
                </Button>
              )}
              {(view === 'week' || view === 'day') && (
                <>
                  <Select
                    placeholder="Thêm mới lịch từ template"
                    style={{ width: 300, marginRight: 15 }}
                    value={templateSelected}
                    onChange={(value) => {
                      setTemplateSelected(value);
                    }}
                  >
                    {danhSachTemplate?.map((item: { _id: string; ten: string }) => (
                      <Select.Option value={item?._id}>{item?.ten}</Select.Option>
                    ))}
                  </Select>
                  {templateSelected !== undefined && (
                    <>
                      <Button
                        type="primary"
                        danger
                        style={{ marginRight: 15 }}
                        onClick={async () => {
                          let payload: any = {
                            templateId: templateSelected,
                            loai: view === 'week' ? 'Tuần' : 'Ngày',
                            donViId: selectedLop?._id,
                          };
                          const nam = moment(date).year();
                          if (view === 'week') {
                            const tuan = moment(date).isoWeek();
                            payload = {
                              ...payload,
                              nam,
                              tuan,
                            };
                          }
                          if (view === 'day') {
                            const thang = moment(date).month();
                            const ngay = moment(date).date();
                            payload = {
                              ...payload,
                              nam,
                              thang,
                              ngay,
                            };
                          }

                          await addLichFromTemplateModel(payload);
                          await getLichHocModel({ donViId: selectedLop?._id ?? '' });
                          setTemplateSelected(undefined);
                        }}
                      >
                        Thêm lịch
                      </Button>
                      <Button
                        type="primary"
                        ghost
                        style={{ marginRight: 15 }}
                        onClick={() => {
                          setTemplateSelected(undefined);
                        }}
                      >
                        Hủy
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
            <Calendar
              localizer={localizer}
              events={dataEvent}
              view={view}
              onView={async (viewVal) => {
                await getTemplateModel({
                  page: 1,
                  limit: 100000,
                  cond: {
                    loai: viewVal === 'week' ? 'Tuần' : 'Ngày',
                  },
                });
                setTemplateSelected(undefined);
                setView(viewVal);
              }}
              scrollToTime={new Date(1970, 1, 1)}
              date={date}
              onNavigate={(value): any => {
                //
                setDate(value);
              }}
              formats={{
                dayFormat: (valDate) => {
                  return moment(valDate).format('dd DD/MM');
                },
                weekdayFormat: (valWeek) => {
                  return moment(valWeek).format('dd');
                },
              }}
              messages={messages}
              views={['month', 'week', 'day']}
              style={{ height: 700 }}
              min={moment('0600', 'HHmm').toDate()}
              max={moment('2059', 'HHmm').toDate()}
              // eventPropGetter={this.eventPropGetter}
              onSelectEvent={checkAllow('EDIT_LICH_HOC') ? (val) => onSelectEvent(val) : undefined}
              onShowMore={(item: any) => {
                setShowMoreProps(item);
                setVisibleShowMore(true);
              }}
              // showAllEvents={true}
              // components={{ event: (event, date) => this.eventCustom(event) }}
              popup
              onSelectSlot={checkAllow('ADD_LICH_HOC') ? handleSelect : undefined}
              selectable
            />
            <Drawer
              visible={visibleDrawer}
              title={edit ? 'Chỉnh sửa' : 'Thêm mới'}
              onClose={() => closeForm()}
              destroyOnClose
              width="50%"
            >
              <FormCalendar
                onFinish={onFinish}
                formItemLayout={formItemLayout}
                newRecord={newRecord}
                record={record}
                danhSachLop={danhSachLop}
                noiDung={noiDung}
                noiDungHoatDong={noiDungHoatDong}
                changeNoiDung={changeNoiDung}
                form={form}
                // setBaiHoc={setBaiHoc}
                danhSachBaiHoc={danhSachBaiHoc}
                edit={edit}
                checkXacNhan={checkXacNhan}
                daHoanThanh={daHoanThanh}
                closeForm={closeForm}
                getLichHocModel={getLichHocModel}
                setVisibleDrawer={setVisibleDrawer}
                setNewRecord={setNewRecord}
                handleDel={handleDel}
                timeStart={timeStart}
                timeEnd={timeEnd}
              />
              {edit && <div style={{ width: '100%' }} />}
            </Drawer>
            <Modal
              visible={visibleTaoTemplate}
              destroyOnClose
              title="Tạo template từ lịch"
              width="40%"
              footer={[]}
              onCancel={() => {
                setVisibleTaoTemplate(false);
              }}
            >
              <FormTaoTemplateTuLich
                setVisibleTaoTemplate={setVisibleTaoTemplate}
                date={date}
                selectedLop={selectedLop}
                view={view}
              />
            </Modal>
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
          </Spin>
        </Col>
      </Row>
    </Card>
  );
};

export default LichHocCalendar;
