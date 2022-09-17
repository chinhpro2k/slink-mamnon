import TableBase from '@/components/Table';
import { Input, InputNumber, message, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { IColumn } from '@/utils/interfaces';
import { ThucPhamKho as IThucPhamKho } from '@/services/ThucPhamKho';
import { ITienThua } from '@/services/TienThua';
import { useModel } from '@@/plugin-model/useModel';
import moment from 'moment';
const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
});
const TienThua = () => {
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;

  const [donViId, setDonViId] = useState(organizationId);
  const { getTienThuaModel, page, limit, cond, loading, total, updateTienThuaModel } =
    useModel('tienthua');
  const [tienThua, setTienThua] = useState<number>();
  const [dataEdit, setDataEdit] = useState<ITienThua.Record>();
  const onChangeNumber = (value: number | string) => {
    setTienThua(+value);
  };
  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (tienThua) {
        const obj: ITienThua.DataReq = {
          tienHoTro: tienThua,
          donViId: donViId ?? '',
          nam: dataEdit?.nam ?? moment().year(),
          ngay: dataEdit?.ngay ?? moment().day(),
          thang: dataEdit?.thang ?? moment().month(),
        };
        updateTienThuaModel(obj).then(() => {
          message.success('Sửa thành công!');
          getTienThuaModel(donViId ?? '');
        });
      }
    }, 2000);

    return () => {
      clearTimeout(timeOut);
    };
  }, [tienThua, dataEdit]);
  const columns: IColumn<ITienThua.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Tiền ăn 1 buổi',
      dataIndex: 'tienAn1Buoi',
      align: 'center',
      width: 150,
      render: (val) => formatter.format(val ?? 0),
      search: 'search',
    },
    {
      title: 'Tiền ăn thực tế',
      dataIndex: 'tienAnThucTe',
      align: 'center',
      render: (val) => formatter.format(val ?? 0),
      width: 150,
    },
    {
      title: 'Tiền hỗ trợ',
      dataIndex: 'tienHoTro',
      align: 'center',
      width: 150,
      render: (val: any, record: any) => {
        return (
          <InputNumber
            defaultValue={val}
            formatter={(value) => `đ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value!.replace(/\đ\s?|(,*)/g, '')}
            onChange={onChangeNumber}
            onClick={() => setDataEdit(record)}
          />
        );
      },
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      align: 'center',
      width: 150,
      render: (val: any, record) =>
        moment()
          .set('date', record?.ngay)
          .set('month', record?.thang)
          .set('year', record?.nam)
          .format('DD/MM/YYYY'),
    },
  ];
  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={() => getTienThuaModel(donViId ?? '')}
        dependencies={[page, limit, cond, donViId]}
        loading={loading}
        modelName="tienthua"
        scroll={{ x: 1000 }}
      >
        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          Tổng số:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={total}
          />
        </h3>
      </TableBase>
    </>
  );
};
export default TienThua;
