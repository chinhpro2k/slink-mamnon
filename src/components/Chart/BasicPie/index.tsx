import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Pie } from '@ant-design/plots';
const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
});
const BasicPie = (props: {
  data: { name: any; value: any }[];
  height?: number;
  position?: 'left' | 'top' | 'bottom' | 'right';
  format?: 'currency' | 'other';
}) => {
  const paletteSemanticRed = '#fb6b6b';
  const paletteSemanticYellow = '#f7a347';
  const paletteSemanticGreen = '#53cd68';
  const brandColor = '#608bfe';
  const config = {
    appendPadding: 10,
    data: props.data,
    angleField: 'value',
    colorField: 'name',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        if (props.format === 'currency') {
          const val = formatter.format(datum.value ?? 0);
          return { name: datum.name, value: val };
        } else {
          return { name: datum.name, value: datum.value };
        }
      },
    },
    color: ({ name }: any) => {
      if (name === 'Nghỉ không phép' || name === 'Đã thanh lý') {
        return paletteSemanticYellow;
      }
      if (
        name === 'Chi phí' ||
        name === 'Chi dự kiến' ||
        // type === 'Chưa xác nhận'||
        // type === 'Chưa duyệt'||
        name === 'Thực tế chi'
      ) {
        return paletteSemanticRed;
      }
      if (
        name === 'Đi học' ||
        name === 'Đã duyệt' ||
        name === 'Đã xác nhận' ||
        name === 'Đang hỏng' ||
        name === 'Đi làm'
      ) {
        return paletteSemanticGreen;
      }
      return brandColor;
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
    legend: {
      position: props.position ? props.position : 'bottom',
    },
  };
  return <Pie height={props.height ? props.height : 300} {...config} />;
};
export default BasicPie;
