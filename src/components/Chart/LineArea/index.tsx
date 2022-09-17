import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Area } from '@ant-design/plots';
import { IDataMulti } from '@/components/Chart/MultiLine';
const LineArea = (props: { data: IDataMulti[]; height?: number }) => {
  const [data, setData] = useState([]);
  const paletteSemanticRed = '#cb302d';
  const paletteSemanticYellow = '#f7a347';
  const paletteSemanticGreen = '#53cd68';
  const brandColor = '#608bfe';
  const config = {
    data: props.data,
    xField: 'xData',
    yField: 'yData',
    seriesField: 'category',
    // color: ['#6897a7', '#8bc0d6', '#60d7a7', '#dedede', '#fedca9', '#fab36f', '#d96d6f'],
    color: ({ category }) => {
      if (category === 'none') {
        return paletteSemanticYellow;
      }
      if (category === 'none' || category === 'Số học sinh nghỉ không phép') {
        return paletteSemanticRed;
      }
      if (
        category === 'Số giáo viên đi làm' ||
        category === 'Lợi nhuận thực tế' ||
        category === 'Số giáo viên' ||
        category === 'Số học sinh đi học'
      ) {
        return paletteSemanticGreen;
      }
      return brandColor;
    },
    // areaStyle: {
    //   opacity: 1,
    //   strokeOpacity: 1,
    //   fillOpacity: 0.7,
    // },
    smooth: true,
    // xAxis: {
    //   type: 'time',
    //   mask: 'YYYY',
    // },
    animation: {
      appear: {
        animation: 'path-in',
        duration: 3000,
      },
    },
    yAxis: {
      label: {
        // 数值格式化为千分位
        formatter: (v: any) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
    legend: {
      position: 'top',
    },
  };

  return <Area height={props.height ? props.height : 200} {...config} />;
};
export default LineArea;
