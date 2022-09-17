import { ColumnsType } from 'antd/es/table';
import { Card, Table } from 'antd';
import type { GiamTru as IGiamTru } from '@/services/GiamTru';
import { useModel } from '@@/plugin-model/useModel';
const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
});
const DetailGiamTru = () => {
  const { dataDetailGiamTru } = useModel('giamtru');
  const columns2: ColumnsType<IGiamTru.DataDetail> = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'name',
    },
    {
      title: 'Tên lớp',
      dataIndex: 'donVi',
      key: 'age',
      render: (val) => val.tenDonVi,
    },
    {
      title: 'Tổng tiền giảm trừ',
      dataIndex: 'tongSoTien',
      key: 'address',
      render: (val) => formatter.format(val ?? 0),
    },
  ];
  return (
    <div>
      <Card title={'Giảm trừ học phí'} bordered={false}>
        <Table
          bordered
          columns={columns2}
          dataSource={dataDetailGiamTru?.map((value, i) => {
            return { ...value, index: i + 1 };
          })}
          pagination={false}
        />
      </Card>
    </div>
  );
};
export default DetailGiamTru;
