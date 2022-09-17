import { getBaoCaoHeThong } from '@/services/BaoCaoHeThong/baocaohethong';
import { Card } from 'antd';
import { Chart, Interval, Tooltip } from 'bizcharts';
import { useEffect, useState } from 'react';

const BieuDoCot = () => {
  const [data, setData] = useState([]);

  const asyncFetch = async () => {
    const result = await getBaoCaoHeThong({
      from: new Date().getTime() - 604800000,
      to: new Date().getTime(),
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
        height={300}
        autoFit
        data={data}
        interactions={['active-region']}
        padding={[30, 30, 30, 50]}
        scale={{
          total: { min: 0, alias: 'Số lượng', type: 'linear-strict' },
        }}
      >
        <Interval
          position="day*total"
          label={[
            'total',
            {
              content: (val) => val.total,
            },
          ]}
        />
        <Tooltip shared />
      </Chart>
      <div style={{ textAlign: 'center', fontWeight: 700, marginTop: '10px' }}>
        Thống kê số user truy cập 7 ngày gần nhất
      </div>
    </>
  );
};

export default BieuDoCot;
