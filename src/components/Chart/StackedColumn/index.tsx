import { Column } from '@ant-design/plots';
const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
});
const StackedColumnPlotChart = (props: {
  data: { name: any; value: any; type: any }[];
  xLabel?: string;
  yLabel?: string;
}) => {
  // const paletteSemanticRed = '#F4664A';
  // const paletteSemanticYellow = '#FB8500';
  // const paletteSemanticGreen = '#007A3A';
  // const brandColor = '#5B8FF9';
  const config = {
    data: props.data,
    isStack: true,
    xField: 'name',
    yField: 'value',
    seriesField: 'type',
    // colorField: 'type',
    // color: ({ type }: any) => {
    //   if (type === 'Giảm trừ học phí') {
    //     return paletteSemanticYellow;
    //   }
    //   if (type === 'Chi phí') {
    //     return paletteSemanticRed;
    //   }
    //   if (type === 'Lợi nhuận dự kiến' || type === 'Lợi nhuận thực tế') {
    //     return paletteSemanticGreen;
    //   }
    //   return brandColor;
    // },
    label: {
      // autoHide: true,
      position: 'middle',
      // offset: 10,
      layout: [
        {
          type: "interval-adjust-position"
        },
        {
          type: "interval-hide-overlap"
        },
        {
          type: "adjust-color"
        }
      ]
    },
    // maxColumnWidth: 50,

    // tooltip: {
    //   formatter: (originData: any) => {
    //     return { name: originData.type, value: formatter.format(originData.value ?? 0) };
    //   },
    // },
    // legend: false,
    // xAxis: {
    //   label: {
    //     autoHide: true,
    //     autoRotate: false,
    //   },
    // },
  };
  return <Column height={300} {...config} />;
};

export default StackedColumnPlotChart;
