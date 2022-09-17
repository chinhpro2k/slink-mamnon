import Bar from '@/pages/dashboard/analysis/components/Charts/Bar';
import React from 'react';

const Groupedcolumn = (props: { ketQua: { tongHop: string[]; cauHoi: string } }) => {
  const data: any[] = [];
  const title: any[] = [];
  let tmp = [];
  Object.keys(props?.ketQua?.tongHop).map((key) => {
    const result = props?.ketQua?.tongHop[key]; // {tot: 0, kha: 0}
    title.push(key);
    tmp = Object.keys(result).map((item) => ({
      x: item,
      y: result[item],
    }));
    data.push(tmp);
    return true;
  });
  return (
    <React.Fragment>
      {data.map((item, index) => (
        <Bar title="" data={data[index]} height={200} />
      ))}
    </React.Fragment>
  );
};
export default Groupedcolumn;
