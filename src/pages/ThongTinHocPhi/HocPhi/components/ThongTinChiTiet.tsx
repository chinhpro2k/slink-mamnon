/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import { tinhHocPhiThang } from '@/services/QuanLyLop/quanlylop';
import type { ThongTinHocPhi as IThongTinHocPhi } from '@/services/ThongTinHocPhi';
import type { IColumn } from '@/utils/interfaces';
import { CalculatorFilled, EyeOutlined } from '@ant-design/icons';
import { Button, DatePicker, Input, message, Modal } from 'antd';
import moment from 'moment';
import React, { useState, useRef } from 'react';
import { useModel } from 'umi';
import BangHocPhiHS from './BangHocPhiHS';

const ThongTinChiTiet = (props: { id?: string }) => {
  const {
    loading: loadingDSHocPhi,
    getThongTinChiTietModel,
    total,
    page,
    limit,
    cond,
    setCondition,
    setPage,
  } = useModel('thongtinchitiet');
  const { thongTinHocPhi, setThongTinHocPhi } = useModel('thongtinhocphi');
  const [visibleHocPhi, setVisibleHocPhi] = useState<boolean>(false);
  const [thang, setThang] = useState<number | undefined>(new Date().getMonth());
  const [nam, setNam] = useState<number | undefined>(new Date().getFullYear());
  const [render, setRender] = useState<boolean>(false);

  const onChangeMonth = (val: any) => {
    if (val === null) {
      setThang(undefined);
      setNam(undefined);
    } else {
      setThang(new Date(val).getMonth());
      setNam(new Date(val).getFullYear());
    }
  };

  const tinhHocPhi = async () => {
    try {
      const res = await tinhHocPhiThang({
        donViId: props?.id,
        thang: thang,
        nam: nam,
      });
      if (res?.status === 201) {
        message.success('Tính học phí thành công');
        getThongTinChiTietModel(props?.id);
        setRender(!render);
        return true;
      }
    } catch (error) {
      const { response }: any = error;
      ;
      if (response?.data?.errorCode === 'THONG_TIN_HOC_PHI_LOP_NOT_FOUND') {
        message.error('Không tìm thấy thông tin học phí lớp');
        return false;
      }
      message.error('Tính học phí không thành công');
    }
    return true;
  };

  const renderLast = (record: IThongTinHocPhi.Record) => {
    return (
      <React.Fragment>
        <Button
          type="default"
          shape="circle"
          title="Chi tiết học phí"
          onClick={() => {
            setVisibleHocPhi(true);
            setThang(record?.thang);
            setNam(record?.nam);
          }}
        >
          <EyeOutlined />
        </Button>
      </React.Fragment>
    );
  };

  const columns: IColumn<IThongTinHocPhi.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Tháng',
      dataIndex: 'thang',
      align: 'center',
      width: 150,
      render: (val) => val + 1,
    },
    {
      title: 'Năm',
      dataIndex: 'nam',
      align: 'center',
      width: 150,
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: IThongTinHocPhi.Record) => renderLast(record),
      fixed: 'right',
      width: 100,
    },
  ];
  const isOverdue = useRef(moment().date() > thongTinHocPhi?.ngayGuiThongBao);
  const disableSuaThongTin = !(
    nam === moment().year() &&
    ((isOverdue.current && moment().month() === thang) ||
      // Nếu chưa quá hạn thì có thể sửa tháng hiện tại và tháng trước (enable)
      (!isOverdue.current && (moment().month() === thang || moment().month() - 1 === thang)))
  );

  return (
    <>
      <DatePicker
        onChange={onChangeMonth}
        defaultValue={moment()}
        picker="month"
        format="MM-YYYY"
        style={{ marginRight: '10px' }}
        placeholder="Chọn tháng/năm"
      />
      <Button type="primary" onClick={tinhHocPhi} disabled={disableSuaThongTin}>
        <CalculatorFilled /> Tính học phí dự kiến
      </Button>
      {thang && nam && (
        <BangHocPhiHS
          disableSuaThongTin={disableSuaThongTin}
          donViId={props?.id}
          thang={thang}
          nam={nam}
          render={render}
        />
      )}
      {/* <TableBase
        border
        columns={columns}
        getData={() => getThongTinChiTietModel(props?.id)}
        loading={loadingDSHocPhi}
        dependencies={[page, limit, cond]}
        modelName="thongtinchitiet"
      >
        
        
        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          Tổng số:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={total}
          />
        </h3>
      </TableBase>

      <Modal
        title={<div>Học phí tháng {thang + 1}</div>}
        visible={visibleHocPhi}
        footer={
          <Button type="primary" onClick={() => setVisibleHocPhi(false)}>
            Ok
          </Button>
        }
        onCancel={() => setVisibleHocPhi(false)}
        width="70%"
      >
        <BangHocPhiHS donViId={props?.id} thang={thang} nam={nam} render={render} />
      </Modal> */}
    </>
  );
};
export default ThongTinChiTiet;
