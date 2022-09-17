import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { addKhauPhanAn } from '@/services/KhauPhanAn/khauphanan';
import moment from 'moment';
import mm from 'moment-timezone';
import styled from 'styled-components';
import { Children, useEffect, useState } from 'react';
import DateObject from 'react-date-object';
import { useModel } from 'umi';
import {
  Button,
  Divider,
  Popconfirm,
  Popover,
  Typography,
  Drawer,
  Select,
  message,
  Modal,
  Form,
  Input,
} from 'antd';
import React from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FileDoneOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { checkAllow } from '@/components/CheckAuthority';
// import EventCustom from './EventCustom';
import { PlusOutlined } from '@ant-design/icons';
import Formm from '../../components/FormKhauPhanAn';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import { response } from 'express';
import { getTongDonGia } from '@/utils/utils';

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

const EventCustom = styled.div`
  border-radius: 12px;
  padding: 10px 5px;
`;

const CalendarWrapper = styled.div`
  & .rbc-time-gutter {
    opacity: 0;
  }
  & .rbc-event {
    border-radius: 8px;
  }

  & .rbc-event-label {
    opacity: 0;
  }
`;

const LichThucDon = ({
  get,
  thucPham,
  xem,
  xuat,
  xoa,
  danhSach,
  edit,
}: {
  get: () => void;
  xem: (record: any) => void;
  thucPham: (record: any) => void;
  xoa: (id: string) => void;
  xuat: (val: object) => void;
  edit?: (val: object) => void;
  danhSach: any[];
}) => {
  const [formThemMoiTDMau] = Form.useForm();
  const localizer = momentLocalizer(moment);
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [donViId, setDonViId] = useState<any>(organizationId);
  const khauphanan = useModel('khauphanan');
  const [dateCalendar, setDateCalendar] = useState(new Date());
  const [viewCalendar, setViewCalendar] = useState('week');
  const [danhSachThucDonMau, setDanhSachThucDonMau] = useState([]);
  const [templateId, setTemplateId] = useState(undefined);
  const [visibleThemTemplate, setVisibleThemTemplate] = useState(false);
  const [visibleToolEvent, setVisibleToolEvent] = useState({});
  const getDanhSachThucDonMau = async (view) => {
    const response = await axios.get(`${ip3}/template-thuc-don/pageable`, {
      params: {
        page: 1,
        limit: 100000,
        cond: {
          loai: view === 'week' ? 'Tuần' : 'Ngày',
          loaiHinhLop: khauphanan?.loaiHinh,
          donViId,
        },
      },
    });
    setDanhSachThucDonMau(response?.data?.data?.result);
  };

  useEffect(() => {
    getDanhSachThucDonMau('week');
  }, [viewCalendar, khauphanan?.loaiHinh]);

  const compareDate = (a, b) => {
    let dateA = a.split('/');
    let dateB = b.split('/');
    dateA = dateA.map((item) => parseInt(item));
    dateB = dateB.map((item) => parseInt(item));
    if (dateA[2] < dateB[2]) return true;
    if (dateA[2] === dateB[2] && dateA[1] < dateB[1]) return true;
    if (dateA[2] === dateB[2] && dateA[1] === dateB[1] && dateA[0] < dateB[0]) return true;
    return false;
  };

  const content = (record) => {
    return (
      <>
        <Button
          type="default"
          shape="circle"
          onClick={() => {
            thucPham(record);
          }}
          title="Thực phẩm"
        >
          <ShoppingCartOutlined />
        </Button>
        <Divider type="vertical" />
        <Button
          type="default"
          shape="circle"
          onClick={() => edit && edit(record)}
          title="Sửa thực đơn"
          disabled={record?.xuatKho}
        >
          <EditOutlined />
        </Button>
        <Divider type="vertical" />
        <Button
          type="primary"
          shape="circle"
          onClick={() => xuat(record)}
          title="Xuất kho 1"
          // disabled={true}
          disabled={
            compareDate(
              moment().format('DD/MM/YYYY'),
              moment(new Date(record?.ngayAn)).format('DD/MM/YYYY'),
            )
              ? true
              : record?.xuatKho
          }
        >
          <FileDoneOutlined />
        </Button>
        <Divider type="vertical" />
        <Button type="default" shape="circle" onClick={() => xem(record)} title="Xem chi tiết">
          <EyeOutlined />
        </Button>
        <Divider type="vertical" />
        <Button type="default" shape="circle" onClick={() => xoa(record?._id)} title="Xóa thực đơn">
          <DeleteOutlined />
        </Button>
        {/* <Button
          type="primary"
          shape="circle"
          title="Xóa"
          onClick={() => {

            // xoa(record._id);
          }}
        >
          <DeleteOutlined />
        </Button> */}
        {/* <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => {

            // xoa(record._id);
          }}
          disabled={!checkAllow('DEL_KHAU_PHAN_AN')}
          cancelText="Hủy"
        >
            <Button type="primary" shape="circle" title="Xóa">
              <DeleteOutlined />
            </Button>
        </Popconfirm> */}
      </>
    );
  };

  function Event(props) {
    const { resource } = props.event;
    return (
      <Popover
        content={() => content(resource)}
        title="Thao tác"
        visible={visibleToolEvent?.[moment(props.event.start).format('DD/MM/YYYY')] ?? false}
        placement="top"
      >
        <EventCustom onClick={props.onClick} style={{ ...props.style }}>
          {/* {props.event.title} */}
          {resource?.buaAn?.map((motBuaAn) => (
            <div>
              <span>Bữa {motBuaAn?.name}</span>
              <br />
              <p style={{ marginTop: 10, marginBottom: 10 }}>Gồm: </p>
              {motBuaAn?.monAn?.map((item, index) => (
                <Typography.Paragraph
                  ellipsis={{ rows: 3, symbol: '...' }}
                  style={{ color: 'white' }}
                >
                  {index + 1}. {item?.name}
                </Typography.Paragraph>
              ))}
              <Divider style={{ backgroundColor: 'white' }} />
            </div>
          ))}
        </EventCustom>
      </Popover>
    );
  }

  useEffect(() => {
    get();
  }, [khauphanan.page, khauphanan.limit]);
  let data = [];
  danhSach.map((motNgayAn) => {
    let tmp = {};
    tmp.resource = motNgayAn;
    tmp.allDay = false;
    tmp.start = moment(new Date(motNgayAn.ngayAn)).set('hour', 0).set('minute', 0).toDate();
    tmp.end = moment(new Date(motNgayAn.ngayAn)).set('hour', 23).set('minute', 59).toDate();
    tmp.title = '';
    data = data.concat(tmp);
  });

  const DayColumnWrapper = (props) => {
    const { children, className, style } = props;
    let tmp = danhSach?.filter(
      (item) =>
        moment(item.ngayAn).format('DD/MM/YYYY') === moment(props.date).format('DD/MM/YYYY'),
    )?.[0];
    if (tmp) {
      return (
        <div className={className} style={style}>
          {children}
        </div>
      );
    }
    return (
      <div
        className={className}
        style={style}
        onClick={() => {
          khauphanan.setVisibleForm(true);
          khauphanan.setEdit(false);
          let a = moment(props.date);

          khauphanan.setRecord({
            ngayAn: [new DateObject(new Date(a.year(), a.month(), a.date()))],
          });
        }}
      >
        {children}
      </div>
    );
  };
  return (
    <CalendarWrapper>
      <div style={{ marginBottom: 20 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            khauphanan.setVisibleForm(true);
            khauphanan.setRecord({});
            khauphanan.setEdit(false);
          }}
          style={{ marginRight: 15 }}
        >
          Thêm mới
        </Button>
        <Select
          style={{ width: 200, marginRight: 10 }}
          placeholder="Thêm mới thực đơn từ thực đơn mẫu"
          value={templateId}
          allowClear
          onChange={(value) => setTemplateId(value)}
        >
          {danhSachThucDonMau?.map((item) => (
            <Select.Option value={item?._id}>{item?.ten}</Select.Option>
          ))}
        </Select>
        {templateId && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={async () => {
              const res = await axios.get(
                `${ip3}/template-thuc-don-chi-tiet/pagable/${templateId}`,
                {
                  params: {
                    page: 1,
                    limit: 10000,
                  },
                },
              );
              let dataConvert = [];
              const result = await axios.get(
                `${ip3}/thong-tin-khau-phan-an/pageable?page=1&limit=200000`,
                {
                  params: {
                    cond: {
                      donViId,
                      loaiHinh: khauphanan?.loaiHinh,
                    },
                  },
                },
              );

              const ttChiTiet = result?.data?.data.result?.[0];
              res?.data?.data?.result?.map((item) => {
                const buaAn = (item?.thucDonMauId?.buaAn ?? []).map((item) => {
                  let monAnMotBua = {
                    name: item?.name,
                    monAn: item?.monAn?.map((e) => {
                      let motMon = {
                        name: e?.name,
                        idMonAn: e?.idMonAn,
                        thanhPhanMonAn: e?.thanhPhanMonAn?.map((tp) => {
                          let thanhPhan = {
                            ...tp,
                            name: tp?.name,
                            idThucPham: tp?._id,
                            loaiThucPham: tp?.loaiThucPham,
                          };
                          return thanhPhan;
                        }),
                      };
                      return motMon;
                    }),
                  };
                  return monAnMotBua;
                });
                let tmp = {
                  ngayAn:
                    viewCalendar === 'week'
                      ? moment(dateCalendar)
                          .weekday(item?.thu - 1)
                          .toISOString()
                      : moment(dateCalendar).toISOString(),
                  soBua: item?.thucDonMauId?.buaAn?.length ?? 0,
                  buaAn,
                  donViId,
                  report: item?.thucDonMauId?.report,
                  loaiHinh: khauphanan?.loaiHinh,
                  soTienAn: getTongDonGia({ buaAn }),
                };
                dataConvert.push(tmp);
              });
              const response = await addKhauPhanAn([...dataConvert]);
              setTemplateId(undefined);
              message.success('Thêm mới thực dơn thành công');
              get();
            }}
            style={{ marginRight: 15 }}
          >
            Thêm mới
          </Button>
        )}
        <Button
          onClick={() => {
            // Modal.confirm({
            //   title: 'Tên thực đơn mẫu',
            //   onOk: () => {
            //     formThemMoiTDMau.submit();
            //   },
            //   onCancel: () => {
            //     formThemMoiTDMau.resetFields();
            //   },
            //   okText: 'Thêm mới',
            //   content: (
            //   ),
            // });
            setVisibleThemTemplate(true);
          }}
          style={{ marginRight: 15 }}
        >
          Thêm mới template từ thực đơn
        </Button>
        {viewCalendar === 'week' && (
          <Button
            onClick={async () => {
              const startDate = moment(dateCalendar)
                .weekday(0)
                .set({ hours: 0, minutes: 0, milliseconds: 0 })
                .toISOString();
              const endDate = moment(dateCalendar)
                .weekday(6)
                .set({ hours: 0, minutes: 0, milliseconds: 0 })
                .toISOString();
              const res = await axios.delete(
                `${ip3}/khau-phan-an/ngay-bat-dau/${startDate}/ngay-ket-thuc/${endDate}`,
                {
                  params: {
                    ngayBatDau: startDate,
                    ngayKetThuc: endDate,
                    loaiHinhLop: khauphanan?.loaiHinh,
                  },
                },
              );
              get();
            }}
          >
            Xóa thực đơn trong tuần
          </Button>
        )}
      </div>
      <Modal
        visible={visibleThemTemplate}
        title="Tên thực đơn mẫu"
        destroyOnClose
        onOk={() => {
          formThemMoiTDMau.submit();
        }}
        onCancel={() => {
          setVisibleThemTemplate(false);
          formThemMoiTDMau.resetFields();
        }}
      >
        <Form
          form={formThemMoiTDMau}
          onFinish={async (values) => {
            let tmp = {
              ten: values?.ten,
              donViId,
              loai: viewCalendar === 'week' ? 'Tuần' : 'Ngày',
              loaiHinhLop: khauphanan?.loaiHinh,
            };
            const response = await axios.post(`${ip3}/template-thuc-don`, tmp);

            formThemMoiTDMau.resetFields();
            let payload = [];
            for (let i = 0; i <= (viewCalendar === 'week' ? 6 : 0); i++) {
              let day =
                viewCalendar === 'week'
                  ? moment(dateCalendar).weekday(i).format('DD/MM/YYYY')
                  : moment(dateCalendar).format('DD/MM/YYYY');
              let arr = data?.filter(
                (item) => moment(item?.start).format('DD/MM/YYYY') === day,
              )?.[0];
              if (arr) {
                let a = {
                  thu: i + 1,
                  // templateThucDonId: thucDonMau?.record?._id,
                  soTienAn: arr?.resource?.soTienAn,
                  buaAn: arr?.resource?.buaAn,
                };

                const thucDonMauRes = await axios.post(
                  `${ip3}/template-thuc-don-chi-tiet/thuc-don-mau`,
                  {
                    thu: i + 1,
                    // templateThucDonId: thucDonMau?.record?._id,
                    soTienAn: arr?.resource?.soTienAn,
                    buaAn: arr?.resource?.buaAn,
                    report: arr?.resource?.report,
                  },
                );
                payload.push({
                  templateId: response?.data?.data?._id,
                  thu: i + 1,
                  thucDonMauId: thucDonMauRes?.data?.data?._id,
                  // donViId,
                });
              }
            }
            try {
              const res = await axios.post(`${ip3}/template-thuc-don-chi-tiet/many`, payload);
              message.success('Thêm mới thành công');
              setVisibleThemTemplate(false);
            } catch (e) {
              message.error('Tạo thực đơn mẫu bị lỗi dữ liệu');
            }
          }}
        >
          <Form.Item name="ten">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Drawer
        onClose={() => {
          khauphanan.setVisibleForm(false);
        }}
        destroyOnClose
        footer={false}
        bodyStyle={{ padding: 0 }}
        visible={khauphanan.visibleForm}
        width="70%"
      >
        <Formm />
      </Drawer>
      <Calendar
        style={{
          height: 600,
        }}
        views={['day', 'week']}
        view={viewCalendar}
        localizer={localizer}
        // events={[
        //   {
        //     title: 'Iu Sun',
        //     start: moment(new Date()).set('hour', 17).set('minute', 0).toDate(),
        //     end: moment(new Date()).set('hour', 18).set('minute', 0).toDate(),
        //   },
        // ]}
        events={data}
        date={dateCalendar}
        min={moment('0600', 'HHmm').toDate()}
        max={moment('2200', 'HHmm').toDate()}
        components={{
          event: Event,
          dayColumnWrapper: DayColumnWrapper,
        }}
        onNavigate={(newDate, view, action) => {
          setDateCalendar(newDate);
          setViewCalendar(view);
        }}
        onView={(view) => {
          setViewCalendar(view);
          setTemplateId(undefined);
          getDanhSachThucDonMau(view);
        }}
        messages={messages}
        onSelectEvent={(event) => {
          const resource = event?.resource;
          setDateCalendar(moment(resource?.ngayAn).toDate());
          setVisibleToolEvent({
            ...visibleToolEvent,
            [`${moment(resource?.ngayAn).format('DD/MM/YYYY')}`]: !(
              visibleToolEvent?.[`${moment(resource?.ngayAn).format('DD/MM/YYYY')}`] ?? false
            ),
          });
        }}
      />
    </CalendarWrapper>
  );
};

export default LichThucDon;
