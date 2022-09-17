import { useModel } from 'umi';
import TableBase from '@/components/Table';
import {
  Button,
  Modal,
  Drawer,
  Popover,
  Typography,
  Divider,
  Popconfirm,
  Descriptions,
  Table,
  message,
} from 'antd';
import { useState, useEffect } from 'react';
import FormKhauPhanAn from '../../components/FormKhauPhanAn';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import mm from 'moment-timezone';
import {
  EyeOutlined,
  ShoppingCartOutlined,
  DeleteOutlined,
  FileDoneOutlined,
} from '@ant-design/icons';
import { formatterMoney } from '../../../../utils/utils';
import { exportKhauPhanAn } from '@/services/KhauPhanAn/khauphanan';
import styled from 'styled-components';
import TableThucDonHocMay from './TableThucDonHocMay';

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
  margin-top: 15px;
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

const TableChiTietTDMau = (props) => {
  const localizer = momentLocalizer(moment);
  const thucDonMau = useModel('thucdonmau');
  const thucDonMauChiTiet = useModel('thucdonmauchitiet');
  const [visibileAddNew, setVisibleAddNew] = useState(false);
  const [visibleNewManual, setVisibleNewManual] = useState(false);
  const [visibleNewAutoGen, setVisibleNewAutoGen] = useState(false);
  const [recordKhauPhanAn, setRecordKhauPhanAn] = useState({});
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    thucDonMauChiTiet.getThucDonMauChiTietModel(thucDonMau?.record?._id);
  }, []);

  const handleThucPhamKho = async (record) => {
    const newVal = record;
    newVal?.buaAn?.forEach((item) =>
      item?.monAn?.forEach((x) =>
        x?.thanhPhanMonAn?.forEach((y) => {
          y.soHocSinh = newVal?.soHocSinh ?? 0;
        }),
      ),
    );

    Modal.info({
      title: 'Danh sách thực phẩm',
      width: '50%',
      content: (
        <>
          {newVal?.buaAn?.map(
            (item, index: number) =>
              item?.name && (
                <div key={index}>
                  {item?.monAn?.map((val, index2: number) => (
                    <div key={index2}>
                      <div>
                        <b>
                          Bữa {item?.name}: {val?.name}
                        </b>
                      </div>
                      <Table
                        size="small"
                        dataSource={val?.thanhPhanMonAn}
                        columns={[
                          {
                            title: 'Tên thành phần',
                            dataIndex: 'name',
                            key: 'name',
                            width: '200px',
                          },
                          {
                            title: 'Loại thực phẩm',
                            dataIndex: 'loaiThucPham',
                            key: 'loaiThucPham',
                            align: 'center',
                          },
                          {
                            title: 'Khối lượng',
                            dataIndex: 'dinhLuongDieuChinh',
                            key: 'dinhLuongDieuChinh',
                            align: 'center',
                            render: (val: number, record) => Number((val ?? 0) * 1).toFixed(2),
                          },
                        ]}
                        pagination={false}
                        bordered
                      />
                    </div>
                  ))}
                </div>
              ),
          )}
        </>
      ),
      onOk() {},
    });
  };

  const handleView = (val?: any) => {
    setRecordKhauPhanAn(val);
    setVisible(true);
  };

  const content = (record, id) => {
    return (
      <>
        <Button
          type="default"
          shape="circle"
          onClick={() => {
            handleThucPhamKho(record);
          }}
          title="Thực phẩm"
        >
          <ShoppingCartOutlined />
        </Button>
        <Divider type="vertical" />
        <Button
          type="default"
          shape="circle"
          onClick={() => handleView(record)}
          title="Xem chi tiết"
        >
          <EyeOutlined />
        </Button>
        <Divider type="vertical" />
        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={async () => {
            const response = await axios.delete(`${ip3}/template-thuc-don-chi-tiet/${id}`, {
              params: { id },
            });
            thucDonMauChiTiet.getThucDonMauChiTietModel(thucDonMau?.record?._id);
          }}
          cancelText="Hủy"
        >
          <Button type="primary" shape="circle" title="Xóa">
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      </>
    );
  };

  const DayColumnWrapper = (props) => {
    const { children, className, style, date } = props;

    let tmp = thucDonMauChiTiet?.danhSach?.filter(
      (item) => moment(item.start).format('DD/MM/YYYY') === moment(date).format('DD/MM/YYYY'),
    )?.[0];
    if (tmp) {
      return (
        <Popover content={() => content(tmp?.resource, tmp?._id)} title="Thao tác" placement="top">
          <div className={className} style={style}>
            {children}
          </div>
        </Popover>
      );
    }
    return (
      <div className={className} style={style} onClick={() => {}}>
        {children}
      </div>
    );
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

  function Event(props) {
    const { resource } = props.event;
    return (
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
    );
  }
  return (
    <>
      <Modal
        visible={visible}
        centered
        width="50%"
        closable
        title="Chi tiết thông tin khẩu phần ăn"
        onCancel={() => setVisible(false)}
        footer={[
          <Button type="primary" key="back" onClick={() => setVisible(false)}>
            OK
          </Button>,
        ]}
      >
        <Descriptions bordered>
          {/* <Descriptions.Item label="Số học sinh">
            {recordKhauPhanAn?.soHocSinh ?? 0}
          </Descriptions.Item> */}
          {/* <Descriptions.Item label="Số tiền ăn/ngày">
            {formatterMoney(recordKhauPhanAn?.soTienAn ?? 0)}
          </Descriptions.Item> */}
          {/* <Descriptions.Item label="Đơn vị" span={3}>
            {
              thucDonMau?.danhSachTruong?.filter(
                (item) => item?._id === recordKhauPhanAn?.donViId,
              )?.[0]?.tenDonVi
            }
          </Descriptions.Item> */}
          {recordKhauPhanAn?.buaAn?.map(
            (item) =>
              item?.name && (
                <Descriptions.Item label={`Bữa ${item?.name}`} span={3}>
                  {item?.monAn?.map((val) => (
                    <div>{val?.name}, </div>
                  ))}
                </Descriptions.Item>
              ),
          )}
        </Descriptions>
      </Modal>
      <Button
        type="primary"
        onClick={() => {
          setVisibleAddNew(true);
        }}
        style={{ marginBottom: 15 }}
      >
        Thêm mới
      </Button>
      <CalendarWrapper>
        <Calendar
          style={{
            height: 600,
          }}
          // views={['day', 'week']}
          views={['day', 'week']}
          localizer={localizer}
          defaultView={props.type ? 'week' : 'day'}
          // defaultView="day"
          defaultDate={
            props.type ? moment(new Date()).toDate() : moment(new Date()).weekday(0).toDate()
          }
          // events={[
          //   {
          //     title: 'Iu Sun',
          //     start: moment(new Date()).set('hour', 17).set('minute', 0).toDate(),
          //     end: moment(new Date()).set('hour', 18).set('minute', 0).toDate(),
          //   },
          // ]}
          events={thucDonMauChiTiet?.danhSach}
          // events={[]}
          min={moment('0600', 'HHmm').toDate()}
          max={moment('2200', 'HHmm').toDate()}
          formats={{
            dayFormat: (date) => {
              return `${weekDay[moment(date).isoWeekday() - 1]?.title}`;
            },
          }}
          components={{
            event: Event,
            dayColumnWrapper: DayColumnWrapper,
          }}
          messages={messages}
          toolbar={false}
        />
      </CalendarWrapper>
      <Modal
        visible={visibileAddNew}
        destroyOnClose
        onCancel={() => {
          setVisibleAddNew(false);
        }}
        title="Bạn muốn thêm mới thực đơn từ đâu?"
        footer={[]}
      >
        <center>
          <Button
            type="primary"
            style={{ marginRight: 10 }}
            onClick={() => {
              setVisibleNewManual(true);
              setVisibleAddNew(false);
            }}
          >
            Thêm mới thủ công
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setVisibleNewAutoGen(true);
              setVisibleAddNew(false);
            }}
          >
            Thêm mới từ thực đơn mẫu
          </Button>
        </center>
      </Modal>
      <Drawer
        title="Thêm mới từ thực đơn mẫu "
        visible={visibleNewAutoGen}
        width="70%"
        destroyOnClose
        onClose={() => {
          setVisibleNewAutoGen(false);
        }}
      >
        <TableThucDonHocMay
          thucDonMauType={props.type}
          taoThucDonMau={async (id, thu) => {
            const response = await axios.post(`${ip3}/template-thuc-don-chi-tiet`, {
              thu,
              templateId: thucDonMau?.record?._id,
              thucDonMauId: id,
            });
            await thucDonMauChiTiet.getThucDonMauChiTietModel(thucDonMau?.record?._id);
            setVisibleNewAutoGen(false);
            setVisibleAddNew(false);
          }}
        />
      </Drawer>
      <Drawer
        title="Thêm thực đơn mẫu thủ công"
        visible={visibleNewManual}
        width="70%"
        destroyOnClose
        onClose={() => {
          setVisibleNewManual(false);
        }}
      >
        <FormKhauPhanAn
          donViThucDonMau={thucDonMau?.record?.donViId}
          thucDonMauType={props.type}
          taoThucDonMau={async (data, thu) => {
            const response = await axios.post(`${ip3}/template-thuc-don-chi-tiet/thuc-don-mau`, {
              thu,
              // templateThucDonId: thucDonMau?.record?._id,
              soTienAn: data?.soTienAn,
              buaAn: data?.buaAn,
            });
            const res = await axios.post(`${ip3}/template-thuc-don-chi-tiet`, {
              templateId: thucDonMau?.record?._id,
              thu,
              thucDonMauId: response?.data?.data?._id,
            });
            //
            // return;
            await thucDonMauChiTiet.getThucDonMauChiTietModel(thucDonMau?.record?._id);
            setVisibleNewManual(false);
          }}
          cancelTaoThucDonMau={setVisibleNewManual}
        />
      </Drawer>
    </>
  );
};

export default TableChiTietTDMau;
