import { getBaoCaoHeThong } from '@/services/BaoCaoHeThong/baocaohethong';
import { Chart, Line, Point } from 'bizcharts';
import moment from 'moment';
import { useEffect, useState } from 'react';

const Demo = () => {
  const [data, setData] = useState([]);

  const asyncFetch = async () => {
    const startOfMonth = moment().startOf('month').format();
    const endOfMonth = moment().endOf('month').format();
    const result = await getBaoCaoHeThong({
      from: new Date(startOfMonth).getTime(),
      to: new Date(endOfMonth).getTime(),
    });
    const newArr: any = [];
    result?.data?.data?.forEach(
      (item: { day: number; month: number; year: number; total: number }) =>
        newArr.push({
          day: `${item?.day}/${item?.month === 12 ? 1 : item?.month + 1}`,
          total: item?.total,
        }),
    );
    setData(newArr);
  };

  useEffect(() => {
    asyncFetch();
  }, []);
  return (
    <>
      <Chart
        appendPadding={[10, 0, 0, 10]}
        autoFit
        height={300}
        data={data}
        scale={{
          total: { min: 0, alias: 'Số lượng', type: 'linear-strict' },
          day: { range: [0, 1] },
        }}
      >
        <Line position="day*total" />
        <Point position="day*total" />
      </Chart>
      <div style={{ textAlign: 'center', fontWeight: 700, marginTop: '10px' }}>
        Thống kê số user truy cập trong tháng
      </div>
    </>
  );
};

export default Demo;
