import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { Form, message, TimePicker } from 'antd';
import type { Moment } from 'moment';
import moment from 'moment';
import rules from '@/utils/rules';
interface IDaySelect {
  id: number;
  title: string;
  value: number;
  content: string;
  date: any;
}
export interface IMonthSelect {
  title: string;
  value: number;
}
interface IValue {
  // repeat: 'KHONG_LAP' | 'HANG_TUAN' | 'HANG_THANG';
  dayRepeat: any;
  thoiGianGuiTB: string;
}
interface IProps {
  type: 'KHONG_LAP' | 'HANG_TUAN' | 'HANG_THANG';
  handleChoseData: (value: IValue, dateString?: string) => any;
  notMultiple?: boolean;
  isRequire?: boolean;
  initTimeStartValue?: any;
  disable?: boolean;
  titleMonth?: string;
  titleWeek?: string;
  titleTime?: string;
}
const DayWrapper = styled.div`
  margin-top: 20px;
  .list-day {
    display: flex;
    //max-width: 220px;
    //flex-wrap: wrap;
    margin-bottom: 8px;
  }
  .list-month {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    max-width: 220px;
    max-width: 220px;
    margin-bottom: 8px;
    column-gap: 8px;
    row-gap: 8px;
  }
  .day-item {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 24px;
    height: 24px;
    margin-right: 8px;
    color: #80868b;
    font-weight: 500;
    font-size: 10px;
    background-color: #f1f3f4;
    border-radius: 50%;
    cursor: pointer;
  }
  .select-time {
    margin-top: 20px;
  }
  .day-item:hover {
    color: white;
    background-color: green;
  }
  .active {
    color: white;
    background-color: green;
  }
  .not-allowed {
    cursor: not-allowed;
  }
  .not-allowed:hover {
    color: #80868b !important;
    background-color: #f1f3f4 !important;
  }
`;
const dataDay: IDaySelect[] = [
  {
    id: 1,
    title: 'CN',
    value: 0,
    content: 'Sunday',
    date: moment().day(0).month(moment().month()),
  },
  {
    id: 2,
    title: 'T2',
    value: 1,
    content: 'Monday',
    date: moment().day(1).month(moment().month()),
  },
  {
    id: 3,
    title: 'T3',
    value: 2,
    content: 'Tuesday',
    date: moment().day(2).month(moment().month()),
  },
  {
    id: 4,
    title: 'T4',
    value: 3,
    content: 'Wednesday',
    date: moment().day(3).month(moment().month()),
  },
  {
    id: 5,
    title: 'T5',
    value: 4,
    content: 'Thursday',
    date: moment().day(4).month(moment().month()),
  },
  {
    id: 6,
    title: 'T6',
    value: 5,
    content: 'Friday',
    date: moment().day(5).month(moment().month()),
  },
  {
    id: 7,
    title: 'T7',
    value: 6,
    content: 'Saturday',
    date: moment().day(6).month(moment().month()),
  },
];
type PickerType = 'time' | 'date';
const DaySelect = (props: IProps) => {
  const [listSelect, setListSelect] = useState<number[]>([]);
  const [dataMonth, setDataMonth] = useState<IMonthSelect[]>([]);
  const [monthSelect, setMonthSelect] = useState<number>(0);
  const [timeString, setTimeString] = useState<string>(moment().format('HH:mm'));
  const [dateSelect, setDateSelect] = useState<any>(moment());
  useEffect(() => {
    let arr: IMonthSelect[] = [];
    for (let i = 1; i < 29; i++) {
      arr.push({
        title: i.toString(),
        value: i,
      });
    }
    setDataMonth(arr);
    if (!props.initTimeStartValue) {
      setListSelect([]);
      setMonthSelect(0);
      setTimeString(moment().format('HH:mm'));
    }
  }, [props.type]);
  useEffect(() => {
    props.handleChoseData(
      {
        dayRepeat: listSelect.length > 0 ? listSelect : monthSelect,
        thoiGianGuiTB: timeString,
      },
      dateSelect,
    );
  }, [listSelect, monthSelect, timeString]);
  useEffect(() => {
    if (props.initTimeStartValue) {
      const arr = [];
      arr.push(moment(props.initTimeStartValue).day());
      setListSelect(arr);
      const select = moment()
        .date(moment(props.initTimeStartValue).day())
        .month(moment(props.initTimeStartValue).month())
        .year(moment(props.initTimeStartValue).year());
      setDateSelect(select);
      setMonthSelect(moment(props.initTimeStartValue).month());
      setTimeString(moment(props.initTimeStartValue).format('HH:mm'));
    }
  }, [props.initTimeStartValue]);
  const onChoseDay = (value: number, date: any) => {
    if (!props.disable) {
      setDateSelect(date);
      let arr = props.notMultiple ? [] : [...listSelect];
      if (arr.length === 0) {
        arr.push(value);
      } else {
        const arrFind = arr.filter((item) => {
          return item === value;
        });
        if (arrFind.length === 0) {
          arr.push(value);
        } else {
          arr = arr.filter((item) => {
            return item !== value;
          });
        }
      }
      setListSelect(arr);
    }
  };
  const onChoseMonth = (value: number) => {
    if (!props.disable) {
      if (value >= moment().date()) {
        setMonthSelect(value);
        const select = moment().date(value).month(moment().month()).year(moment().year());
        setDateSelect(select);
      } else {
        message.warn('Không chọn ngày nhỏ hơn hiện tại');
      }
    }
  };
  const onChange = (time: Moment, timeString: string) => {
    setTimeString(timeString);
  };
  const format = 'HH:mm';
  return (
    <DayWrapper>
      {props.type === 'HANG_TUAN' && (
        <>
          {/*<p>Nhắc hàng tuần:</p>*/}
          <p>{props.titleWeek ? props.titleWeek : 'Chọn những hôm nhắc lại trong tuần:'} </p>
          <div>
            <div className="list-day">
              {dataDay.map((value) => {
                return (
                  <div
                    className={`day-item  ${listSelect.includes(value.value) ? 'active' : ''}`}
                    key={value.id}
                    onClick={() => onChoseDay(value.value, value.date)}
                  >
                    {value.title}
                  </div>
                );
              })}
            </div>
            <Form.Item
              name="time"
              label=" Thời gian thông báo:"
              rules={props.isRequire ? [...rules.required] : undefined}
            >
              {' '}
              <TimePicker
                defaultValue={moment(props?.initTimeStartValue)}
                onChange={onChange}
                format={format}
                disabled={props.disable}
              />
            </Form.Item>
          </div>
        </>
      )}
      {props.type === 'HANG_THANG' && (
        <>
          {/*<p>Nhắc hàng tháng:</p>*/}
          <div key={monthSelect}>
            <p>{props.titleMonth ? props.titleMonth : 'Chọn ngày nhắc lại trong tháng đó:'}</p>
            <div className="list-month">
              {dataMonth.map((value, i) => {
                return (
                  <div
                    className={`day-item ${props.disable ? 'not-allowed' : ''} ${
                      monthSelect === value.value ? 'active' : ''
                    }`}
                    key={i}
                    onClick={() => onChoseMonth(value.value)}
                  >
                    {value.title}
                  </div>
                );
              })}
            </div>
            <Form.Item
              name="time"
              label=" Thời gian thông báo:"
              rules={props.isRequire ? [...rules.required] : undefined}
            >
              {' '}
              <TimePicker
                defaultValue={moment(props?.initTimeStartValue)}
                onChange={onChange}
                format={format}
                disabled={props.disable}
              />
            </Form.Item>
          </div>
        </>
      )}
      {props.type === 'KHONG_LAP' && (
        <Form.Item
          name="time"
          label={props.titleTime ? props.titleTime : 'Thời gian thông báo:'}
          rules={props.isRequire ? [...rules.required] : undefined}
          initialValue={moment(props?.initTimeStartValue)}
        >
          {' '}
          <TimePicker
            defaultValue={moment(props?.initTimeStartValue)}
            onChange={onChange}
            format={format}
            disabled={props.disable}
          />
        </Form.Item>
      )}
    </DayWrapper>
  );
};
export default DaySelect;
