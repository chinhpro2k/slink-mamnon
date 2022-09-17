/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { ThucPhamKho as IThucPhamKho } from '@/services/ThucPhamKho';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { Button, Col, DatePicker, Input, Row } from 'antd';
import FileDownload from 'js-file-download';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';

const XuatKho = (props: { loaiThucPham?: string }) => {
  const { loaiThucPham } = props;
  const {
    loading: loadingXuatKho,
    page,
    limit,
    cond,
    getXuatKhoModel,
    total,
    setPage,
    nhaCungCap,
    setNhaCungCap,
    // capNhatNhaCungCapModel,
  } = useModel('xuatkho');
  const { danhSachTruong } = useModel('thucphamkho');
  const vaiTro = localStorage.getItem('vaiTro');
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  const [donViId, setDonViId] = useState(organizationId);
  const [ngay, setNgay] = useState<number>(new Date().getDate());
  const [thang, setThang] = useState<number>(new Date().getMonth());
  const [nam, setNam] = useState<number>(new Date().getFullYear());
  const [editNhaCungCap, setEditNhaCungCap] = useState(false);

  const onChange = (value: string) => {
    setDonViId(value);
  };

  const changeDate = (val: any) => {
    if (val === null) {
      getXuatKhoModel(donViId, undefined, undefined, undefined, loaiThucPham ?? 'Khô');
    } else {
      setNgay(new Date(val).getDate());
      setThang(new Date(val).getMonth());
      setNam(new Date(val).getFullYear());
      getXuatKhoModel(
        donViId,
        new Date(val).getDate(),
        new Date(val).getMonth(),
        new Date(val).getFullYear(),
        loaiThucPham ?? 'Khô',
      );
    }
    setPage(1);
  };

  const columnsXuatKho: IColumn<IThucPhamKho.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Tên thực phẩm',
      dataIndex: 'ten',
      align: 'center',
      width: 150,
      search: 'search',
    },
    {
      title: 'Loại thực phẩm',
      dataIndex: 'loaiThucPham',
      align: 'center',
      width: 150,
    },
    {
      title: 'Khối lượng',
      dataIndex: 'khoiLuong',
      align: 'center',
      width: 150,
      render: (val) => <div>{Number(val ?? 0).toFixed(2)}</div>,
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'donViTinh',
      align: 'center',
      width: 100,
    },
    {
      title: loaiThucPham ? 'Ngày mua' : 'Ngày xuất kho',
      dataIndex: 'ngay',
      align: 'center',
      width: 150,
      render: (val, record) => (
        <>
          {val}/{record?.thang === 12 ? 1 : record?.thang + 1}/{record?.nam}
        </>
      ),
    },
  ];
  return (
    <TableBase
      border
      columns={columnsXuatKho}
      getData={() => getXuatKhoModel(donViId, ngay, thang, nam, loaiThucPham ?? 'Khô')}
      dependencies={[page, limit, cond, donViId, ngay, thang, nam]}
      loading={loadingXuatKho}
      modelName="xuatkho"
      title={loaiThucPham && 'Hóa đơn mua hàng'}
    >
      <Row gutter={[10, 0]}>
        <Col span={3}>
          <DatePicker
            onChange={changeDate}
            defaultValue={moment()}
            format="DD-MM-YYYY"
            placeholder="Chọn ngày"
            // disabledDate={(current) => {
            //   return current && current > moment().endOf('day');
            // }}
          />
        </Col>
        <Col span={3}>
          <Button
            onClick={async () => {
              const response = await axios.get(
                `${ip3}/kho-thuc-pham/export/lich-su-xuat-kho/nam/${nam}/thang/${thang}/ngay/${ngay}?donViId=${donViId}`,
                {
                  responseType: 'arraybuffer',
                  params: {
                    cond: { loaiLichSuKho: 'Xuất kho' },
                  },
                },
              );
              FileDownload(response?.data, 'LichSuXuatKho.xlsx');
            }}
            type="primary"
            style={{ width: '100%' }}
          >
            Export
          </Button>
        </Col>
        {/*{ <Col span={8}>*/}
        {/*  {vaiTro === 'HieuTruong' && (*/}
        {/*    <div style={{ display: 'flex' }}>*/}
        {/*      <Input*/}
        {/*        value={nhaCungCap}*/}
        {/*        onChange={(e) => {*/}
        {/*          setNhaCungCap(e.target.value);*/}
        {/*          setEditNhaCungCap(true);*/}
        {/*        }}*/}
        {/*        addonBefore="Nhà cung cấp"*/}
        {/*      />*/}
        {/*      <Button*/}
        {/*        type="primary"*/}
        {/*        onClick={async () => {*/}
        {/*          await capNhatNhaCungCapModel({*/}
        {/*            donViId,*/}
        {/*            ngay,*/}
        {/*            thang,*/}
        {/*            nam,*/}
        {/*            nhaCungCap,*/}
        {/*          });*/}
        {/*          setEditNhaCungCap(false);*/}
        {/*        }}*/}
        {/*        style={{ marginLeft: 10 }}*/}
        {/*      >*/}
        {/*        Cập nhật*/}
        {/*      </Button>*/}
        {/*    </div>*/}
        {/*  )}*/}
        {/*</Col> }*/}
      </Row>
      <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
        Tổng số:
        <Input
          style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
          value={total}
        />
      </h3>
    </TableBase>
  );
};

export default XuatKho;
