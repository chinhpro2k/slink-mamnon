import type { KhauPhanAn as IKhauPhanAn } from '@/services/KhauPhanAn';
import type { IColumn } from '@/utils/interfaces';
import { formatterMoney } from '@/utils/utils';
import { Col, Row, Table } from 'antd';
import { useModel } from 'umi';
import { useEffect } from 'react';
import { IReport } from '@/services/KhauPhanAn';

const MenuTinhToan = ({ soHocSinh, soNgayAn }) => {
  const { recordDieuChinh, recordReport } = useModel('khauphanan');
  const columns: IColumn<IKhauPhanAn.Record>[] = [
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
      title: 'Định lượng gốc',
      dataIndex: 'dinhLuongGoc',
      key: 'dinhLuongGoc',
      align: 'center',
      render: (val) => Number((val ?? 0) * 1).toFixed(2),
    },
    {
      title: 'Định lượng điều chỉnh',
      dataIndex: 'dinhLuongDieuChinh',
      key: 'dinhLuongDieuChinh',
      align: 'center',
      render: (val: number) => Number((val ?? 0) * 1).toFixed(2),
    },
    {
      title: 'Đơn giá gốc',
      dataIndex: 'donGiaGoc',
      key: 'donGiaGoc',
      align: 'center',
      render: (val: number) => formatterMoney(val ?? 0),
    },
    {
      title: 'Đơn giá điều chỉnh',
      dataIndex: 'donGiaDieuChinh',
      key: 'donGiaDieuChinh',
      align: 'center',
      render: (val: number) => formatterMoney(val ?? 0),
    },
    // {
    //   title: 'Trọng số',
    //   dataIndex: 'trongSo',
    //   key: 'trongSo',
    //   align: 'center',
    //   render: (val: number) => Number((val ?? 0) * (soNgayAn?.length ?? 0)).toFixed(2),
    // },
  ];
  const columnsReport: IColumn<IKhauPhanAn.IReport>[] = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      width: '200px',
      render: (val, record) => (
        <span>
          {val} ({record.tenBua})
        </span>
      ),
    },
    {
      title: 'Kcal',
      dataIndex: 'value',
      key: 'name',
      width: '200px',
      render: (val) => <span>{val.toFixed(2)}</span>,
    },
    {
      title: 'Phần trăm dinh dưỡng',
      dataIndex: 'name',
      key: 'name',
      width: '200px',
      render: (val, record) => <span>{((record.value / record.tongCalo) * 100).toFixed(2)}%</span>,
    },
  ];
  return (
    <>
      <Row gutter={[16, 0]}>
        <Col lg={8} xs={12}>
          <div>
            <b>Thông tin tính toán:</b>
          </div>
          {recordDieuChinh?.result?.map((item: any, index: number) => (
            <div key={index}>- {item}</div>
          ))}
        </Col>
        <Col lg={16} xs={12}>
          <div>
            <b>Nhóm tuổi:</b> {recordDieuChinh?.type === 1 ? 'Mầm non' : 'Nhà trẻ'}
          </div>
          <div>
            <b>Số học sinh: </b> {soHocSinh ?? 0} học sinh
          </div>
          <div>
            <b>Tổng định lượng điều chỉnh: </b>
            {Number(recordDieuChinh?.tongDinhLuongDieuChinh ?? 0).toFixed(2)}
          </div>
        </Col>
      </Row>
      <br />
      <Col lg={24} style={{ marginBottom: '8px' }}>
        {' '}
        <div>
          <b>
          Bảng dinh dưỡng
          </b>
        </div>
        <Table
          size="small"
          dataSource={recordReport}
          columns={columnsReport}
          pagination={false}
          bordered
        />
      </Col>
      {recordDieuChinh?.buaAn?.map(
        (item: any, index: number) =>
          item?.name && (
            <div key={index}>
              {item?.monAn?.map((val: IKhauPhanAn.Record, index2: number) => (
                <div key={index2}>
                  <div>
                    <b>
                      Bữa {item?.name}: {val?.name}
                    </b>
                  </div>
                  <Table
                    size="small"
                    dataSource={val?.thanhPhanMonAn}
                    columns={columns}
                    pagination={false}
                    bordered
                  />
                  <br />
                </div>
              ))}
            </div>
          ),
      )}
    </>
  );
};
export default MenuTinhToan;
