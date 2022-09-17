import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Rose } from '@ant-design/plots';
const RoseChart = (props: { data: { name: any; value: any; user: any }[] }) => {
  const config = {
    data: props.data,
    xField: 'name',
    yField: 'value',
    isStack: true,
    // 当 isStack 为 true 时，该值为必填
    seriesField: 'user',
    radius: 0.9,
    label: {
      offset: -15,
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };
  return <Rose {...config} />;
};
export default RoseChart;
