import { List, Badge, Modal, Divider, Typography } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import HeaderDropdown from '../HeaderDropdown';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import moment from 'moment';
import { history } from 'umi';
const NotificationWrapper = styled.div`
  .is-seen {
    background: #f0faf0;
  }
  .title-noti {
    margin-bottom: 0;
    padding: 4px 8px;
    color: #181e39;
    font-weight: 700;
    font-size: 18px;
    font-style: normal;
    line-height: 28px;
  }
  .time-noti {
    color: #2a3556;
    font-size: 11px;
  }
  .item-noti {
    cursor: pointer;
  }
  .item-noti:hover {
    background: #f0f0f0;
  }
  //.list-item{
  //
  //}
  /* width */
  .list-item::-webkit-scrollbar {
    width: 4px;
  }

  /* Track */
  .list-item::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  /* Handle */
  .list-item::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }

  /* Handle on hover */
  .list-item::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;
const Notification = () => {
  const [visible, setVisible] = useState(false);
  const [danhSach, setDanhSach] = useState<any>([]);
  const getData = async () => {
    const response = await axios.get(`${ip3}/notifications/my`, {
      params: {
        page: 1,
        limit: 10000,
      },
    });
    setDanhSach(response?.data?.data ?? []);
  };
  useEffect(() => {
    getData();
  }, []);
  const handleRedirect = (
    item: any,
    type: 'BAO_HONG' | 'CHAM_CONG' | 'DAN_DON_CON' | 'HOC_PHI',
  ) => {
    if (item?.status === 0) {
      const response = axios.put(`${ip3}/notifications/user-notification/${item?._id}/status`, {
        status: 1,
      });
      const tmp = danhSach.map((e:any) => {
        return {
          ...e,
          status: item?._id === e?._id ? 1 : e?.status,
        };
      });
      setDanhSach(tmp);
    }
    switch (type) {
      case 'BAO_HONG':
        history.push('/quanlytaisan/baohongsuachua');
        break;
      case 'CHAM_CONG':
        history.push('/quanlygiaovien/diemdanhgiaovien');
        break;
      case 'DAN_DON_CON':
        history.push('/quanlytuongtac/quanlydon/dondandonve');
        break;
      case 'HOC_PHI':
        history.push('/quanlyhocsinh/thongtinhocphi');
        break;
      default:
        history.push('/');
        break;
    }
  };
  return (
    <Badge
      count={danhSach.filter((item) => item.status !== 1).length ?? 0}
      size="small"
      offset={[10, 20]}
    >
      <HeaderDropdown
        overlay={
          <NotificationWrapper>
            <p className="title-noti">Thông báo mới nhận</p>
            <div
              style={{
                display: 'flex',
                width: 400,
                height: 400,
                overflowY: 'scroll',
                flexDirection: 'column',
              }}
              className={'list-item'}
            >
              {danhSach.map((item) => (
                <>
                  <div
                    style={{
                      width: '100%',
                      padding: '10px 10px 0px 10px',
                    }}
                    className={`${item?.status === 1 ? '' : 'is-seen'} item-noti`}
                    // onClick={() => {
                    //   if (item?.status === 0) {
                    //     const response = axios.put(
                    //       `${ip3}/notifications/user-notification/${item?._id}/status`,
                    //       {
                    //         status: 1,
                    //       },
                    //     );
                    //     let tmp = danhSach.map((e) => {
                    //       return {
                    //         ...e,
                    //         status: item?._id === e?._id ? 1 : e?.status,
                    //       };
                    //     });
                    //     setDanhSach(tmp);
                    //   }
                    //   Modal.info({
                    //     title: item?.title ?? '',
                    //     content: item?.content ?? '',
                    //     okText: 'Đóng',
                    //   });
                    // }}
                    onClick={() => handleRedirect(item, item?.info?.type ?? '')}
                  >
                    <Typography.Paragraph ellipsis={{ rows: 1, symbol: '...' }}>
                      <b>{item?.title ?? ''}</b>
                    </Typography.Paragraph>
                    <Typography.Paragraph ellipsis={{ rows: 1, symbol: '...' }}>
                      {item?.content ?? ''}
                    </Typography.Paragraph>
                    {/*{item?.status === 1 && (*/}
                    {/*  <p style={{ float: 'right' }}>*/}
                    {/*    <i>Đã đọc</i>*/}
                    {/*  </p>*/}
                    {/*)}*/}
                    <p style={{ float: 'right' }} className="time-noti">
                      <i>{moment(item.createdAt).format('HH:MM DD/MM/YYYY')}</i>
                    </p>
                  </div>
                  {/*<Divider style={{ margin: '10px 0px' }} />*/}
                </>
              ))}
            </div>
          </NotificationWrapper>
        }
      >
        <BellOutlined style={{ marginTop: 18, fontSize: '20px' }} />
      </HeaderDropdown>
    </Badge>
  );
};

export default Notification;
