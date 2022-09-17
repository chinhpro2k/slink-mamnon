/* eslint-disable no-underscore-dangle */
import { checkAllow } from '@/components/CheckAuthority';
import TableBase from '@/components/Table';
import type { ThongBao as IThongBao } from '@/services/ThongBao';
import type { IColumn } from '@/utils/interfaces';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import {
  Button,
  Input,
  Modal,
  Image,
  Divider,
  Popconfirm,
  message,
  Select,
  DatePicker,
  Tag,
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormCreate from '@/pages/AlbumAnh/components/FormCreate';
import { AlbumAnh as IAlbumAnh } from '@/services/AlbumAnh';
import { BaseViewerImages } from '@/components/ImageGallery';
const { RangePicker } = DatePicker;
const AlbumAnh = () => {
  const {
    loading: loadingThongBao,
    getAlbumAnhModel,
    total,
    page,
    limit,
    cond,
    setVisibleForm,
    setEdit,
    setRecord,
    setCondition,
    deleteAlbumAnhModel,
    confirmAlbumAnhModel,
  } = useModel('albumanh');
  const [visibleView, setVisibleView] = useState<boolean>(false);
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [dataRecord, setDataRecord] = useState<any>();
  const [isShowTime, setIsShowTime] = useState<boolean>(false);
  // const currentUser = initialStateModel?.currentUser;
  const handleView = (val: any) => {
    console.log('val', val);
    setVisibleView(true);
    setDataRecord(val);
  };

  const onCell = (record: IThongBao.Record) => ({
    onClick: () => {
      handleView(record);
    },
    style: { cursor: 'pointer' },
  });
  const handleDel = (id: string) => {
    deleteAlbumAnhModel(id).then(() => {
      message.success('Xóa thành công');
      getAlbumAnhModel(organizationId);
    });
  };
  const renderLast1 = (recordVal: IAlbumAnh.Record) => {
    return (
      <React.Fragment>
        <Button
          type="primary"
          shape="circle"
          onClick={() => handleView(recordVal)}
          title="Xem chi tiết"
        >
          <EyeOutlined />
        </Button>
        {/*<Divider type="vertical" />*/}
        {/*<Button*/}
        {/*  type="default"*/}
        {/*  shape="circle"*/}
        {/*  disabled={true}*/}
        {/*  onClick={() => {*/}
        {/*    setVisibleForm(true);*/}
        {/*    setEdit(true);*/}
        {/*    setRecord(recordVal);*/}
        {/*  }}*/}
        {/*  title="Sửa"*/}
        {/*>*/}
        {/*  <EditOutlined />*/}
        {/*</Button>*/}
        <Divider type="vertical" />
        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDel(recordVal._id)}
          // disabled={!checkAllow('DEL_DANH_GIA_HOC_SINH')}
        >
          <Button type="default" shape="circle" onClick={() => {}} title="Xóa">
            <DeleteOutlined />
          </Button>
        </Popconfirm>
        {recordVal?.trangThai === 'CHO_XU_LY' && (
          <>
            <Divider type="vertical" />
            <Button
              type="default"
              shape="circle"
              onClick={() => {
                confirmAlbumAnhModel(recordVal._id, 'XAC_NHAN').then(() => {
                  getAlbumAnhModel(organizationId);
                });
              }}
              title="Duyệt"
            >
              <DownOutlined />
            </Button>
            <Divider type="vertical" />
            <Button
              type="default"
              shape="circle"
              onClick={() => {
                confirmAlbumAnhModel(recordVal._id, 'KHONG_XAC_NHAN').then(() => {
                  getAlbumAnhModel(organizationId);
                });
              }}
              title="Từ chối"
            >
              <CloseOutlined />
            </Button>
          </>
        )}
      </React.Fragment>
    );
  };
  const renderStatus = (val: 'XAC_NHAN' | 'KHONG_XAC_NHAN' | 'CHO_XU_LY'): string => {
    switch (val) {
      case 'CHO_XU_LY':
        return 'Chờ xử lý';
        break;
      case 'KHONG_XAC_NHAN':
        return 'Từ chối';
        break;
      case 'XAC_NHAN':
        return 'Duyệt';
        break;
      default:
        return 'Không xác định';
        break;
    }
  };
  const columns: IColumn<IThongBao.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'ten',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => val ?? 'Không có',
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => val ?? 'Không có',
    },
    {
      title: 'Lớp',
      dataIndex: 'donVi',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => val?.tenDonVi ?? 'Không có',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => moment(val).format('HH:mm DD/MM/YYYY') ?? 'Không có',
    },
    {
      title: 'Số ảnh',
      dataIndex: 'soAnh',
      align: 'center',
      width: 150,
      onCell,
      render: (val) => val ?? 0,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      align: 'center',
      render: (val) => {
        const color = val === 'XAC_NHAN' ? 'green' : val === 'CHO_XU_LY' ? 'geekblue' : 'red';
        return <Tag color={color}>{renderStatus(val)}</Tag>;
      },
      fixed: 'right',
      width: 180,
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: IThongBao.Record) => renderLast1(record),
      fixed: 'right',
      width: 220,
    },
  ];

  useEffect(() => {}, []);
  const onChange = (value: any, dateString: [string, string] | string) => {
    if (value) {
      setCondition({
        ...cond,
        createdAt: {
          $lte: moment(value?.[1]).endOf('date').toDate(),
          $gte: moment(value?.[0]).startOf('date').toDate(),
        },
      });
    } else {
      const obj = { ...cond };
      delete obj.createdAt;
      setCondition(obj);
    }
  };

  const onOk = (value: any) => {
    console.log('onOk: ', value);
  };
  const onChangeSelect = (val: string) => {
    if (val === 'XAC_NHAN') {
      setIsShowTime(true);
    } else {
      setIsShowTime(false);
    }
    if (val === 'ALL') {
      setCondition({});
    } else {
      setCondition({ trangThai: val });
    }
  };
  const [isShowImage, setIsShowImage] = useState<boolean>(false);
  const [indexImage, setIndexImage] = useState<number>(0);
  const convertImages = () => {
    let arr: any[] = [];
    dataRecord?.files?.map((val: { url: any }) => {
      arr.push(val?.url);
    });
    const images = [...arr];
    return images.map((item) => {
      return {
        original: item,
        thumbnail: item,
      };
    });
  };
  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={() => {
          getAlbumAnhModel(organizationId);
        }}
        dependencies={[page, limit, cond]}
        loading={loadingThongBao}
        modelName="albumanh"
        title="Album ảnh"
        scroll={{ x: 1000 }}
        Form={FormCreate}
        formType="Drawer"
        widthDrawer="60%"
        // hascreate={checkAllow('ADD_ALBUM_ANH')}
      >
        <Select
          showSearch
          defaultValue="Tất cả"
          style={{ width: '15%', marginRight: '10px' }}
          placeholder="Chọn trạng thái"
          optionFilterProp="children"
          onChange={onChangeSelect}
          filterOption={(input, option: any) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          <Select.Option value="ALL">Tất cả</Select.Option>
          <Select.Option value="XAC_NHAN">Duyệt</Select.Option>
          <Select.Option value="CHO_XU_LY">Chờ xử lý</Select.Option>
          <Select.Option value="KHONG_XAC_NHAN">Từ chối</Select.Option>
        </Select>
        {isShowTime && (
          <RangePicker
            style={{ width: '25%', marginRight: '10px' }}
            onChange={onChange}
            onOk={onOk}
          />
        )}
        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          Tổng số:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={total}
          />
        </h3>
      </TableBase>
      <Modal
        title="Chi tiết album ảnh"
        width="60%"
        visible={visibleView}
        onCancel={() => setVisibleView(false)}
        footer={<Button onClick={() => setVisibleView(false)}>Ok</Button>}
        destroyOnClose
      >
        <div className="grid-list-image">
          {dataRecord?.files?.map((val: { url: any }, i: number) => {
            return (
              <img
                key={i}
                src={val?.url ?? ''}
                onClick={() => {
                  setIsShowImage(true);
                  setIndexImage(i);
                }}
              />
            );
          })}
        </div>
        <BaseViewerImages
          images={convertImages()}
          onChangeShow={(isShow) => setIsShowImage(isShow)}
          isShow={isShowImage}
          startIndex={indexImage}
        />
      </Modal>
    </>
  );
};

export default AlbumAnh;
