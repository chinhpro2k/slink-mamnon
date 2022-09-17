import { Column } from '@ant-design/plots';
const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
});
const ColumnPlotChart = (props: {
  data: { type: any; value: any }[];
  columnWidth?: number;
  formatType?: 'normal' | 'currency';
  xLabel?: string;
  legend?: boolean;
  yLabel?: string;
}) => {
  const paletteSemanticRed = '#fb6b6b';
  const paletteSemanticYellow = '#f7a347';
  const paletteSemanticGreen = '#53cd68';
  const brandColor = '#608bfe';
  const config = {
    data: props.data,
    xField: 'type',
    yField: 'value',
    seriesField: '',
    colorField: 'type',
    color: ({ type }: any) => {
      if (
        type === 'Giảm trừ' ||
        type === 'Số lớp hiện tại' ||
        type === 'Đã thanh lý'
      ) {
        return paletteSemanticYellow;
      }
      if (type === 'Chi phí' || type === 'Chi dự kiến' || type === 'Thực tế chi') {
        return paletteSemanticRed;
      }
      if (
        type === 'Lợi nhuận dự kiến' ||
        type === 'Lợi nhuận thực tế' ||
        type === 'Số giáo viên' ||
        type === 'Đang hỏng' ||
        type === 'Quỹ tiền mặt'
      ) {
        return paletteSemanticGreen;
      }
      return brandColor;
    },
    legend: props.legend
      ? {
          layout: 'vertical',
          position: 'bottom',
        }
      : false,
    // legend: {
    //   layout: 'vertical',
    //   position: 'left',
    // },
    label: {
      content: (originData: any) => {
        const val = formatter.format(originData.value ?? 0);
        return '';
      },
      autoHide: true,
      position: 'top',
      offset: 10,
    },
    maxColumnWidth: props.columnWidth ?? 30,

    tooltip: {
      formatter: (originData: any) => {
        if (!props.formatType) {
          return { name: originData.type, value: formatter.format(originData.value ?? 0) };
        }
        if (props.formatType === 'currency') {
          return { name: originData.type, value: formatter.format(originData.value ?? 0) };
        }
        if (props.formatType === 'normal') {
          return { name: originData.type, value: originData.value };
        } else return { name: originData.type, value: originData.value };
      },
    },
    xAxis: {
      label: {
        autoHide: false,
        autoRotate: true,
        rotate:270
      },
    },
  };
  return <Column height={300} {...config} />;
};

export default ColumnPlotChart;
