import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Line } from '@ant-design/plots';
export interface IDataMulti {
  xData: any;
  yData: any;
  category: any;
}
const MultiLineChart = (props: {
  xLabel?: string;
  yLabel?: string;
  data: IDataMulti[];
  height?: number;
}) => {
  const paletteSemanticRed = '#fb6b6b';
  const paletteSemanticYellow = '#f7a347';
  const paletteSemanticGreen = '#53cd68';
  const brandColor = '#608bfe';
  const [data, setData] = useState([]);

  useEffect(() => {
    asyncFetch();
  }, []);
  useEffect(() => {
    console.log(data);
  }, [data]);
  // useEffect(() => {
  //   if (props.data) {
  //     setData(props.data);
  //   }
  // }, [props.data]);
  const asyncFetch = () => {
    fetch('https://gw.alipayobjects.com/os/bmw-prod/55424a73-7cb8-4f79-b60d-3ab627ac5698.json')
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log('fetch data failed', error);
      });
  };
  const config = {
    data: props.data,
    xField: 'xData',
    yField: 'yData',
    // yAxis: {
    //   label: {
    //     // 数值格式化为千分位
    //     formatter: (v) =>
    //       `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`)
    //   }
    // },
    seriesField: 'category',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 3000,
      },
    },
    // xField: 'year',
    // yField: 'value',
    // seriesField: 'category',
    legend: {
      layout: 'horizontal',
      position: 'bottom',
    },
    color: ({ category }) => {
      if (category === 'Số học sinh nghỉ không phép') {
        return paletteSemanticYellow;
      }
      if (category === 'none') {
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
    // lineStyle: ({ type }) => {
    //   // if (type === 'Số giáo viên nghỉ làm') {
    //   //   return {
    //   //     lineDash: [4, 4],
    //   //     opacity: 1,
    //   //   };
    //   // }
    //
    //   return {
    //     opacity: 1,
    //   };
    // },
  };

  return <Line height={props.height ? props.height : 200} {...config} />;
};

export default MultiLineChart;
