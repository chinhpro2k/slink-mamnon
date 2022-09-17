import { Pie, measureTextWidth } from '@ant-design/plots';
const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
});
const PiePlotChart = (props: {
  data: { type: any; value: any }[];
  columnWidth?: number;
  formatType?: 'normal' | 'currency';
  xLabel?: string;
  yLabel?: string;
  labelTotal?: string;
  height?: number;
}) => {
  const paletteSemanticRed = '#fb6b6b';
  const paletteSemanticYellow = '#f7a347';
  const paletteSemanticGreen = '#53cd68';
  const brandColor = '#608bfe';
  function renderStatistic(containerWidth: number, text: string, style: { fontSize: number }) {
    const { width: textWidth, height: textHeight } = measureTextWidth(text, style);
    const R = containerWidth / 2; // r^2 = (w / 2)^2 + (h - offsetY)^2

    let scale = 1;

    if (containerWidth < textWidth) {
      scale = Math.min(
        Math.sqrt(
          Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2))),
        ),
        1,
      );
    }

    const textStyleStr = `width:${containerWidth}px;`;
    return `<div style="${textStyleStr};font-size:${14}px;line-height:${
      scale < 1 ? 1 : 'inherit'
    };">${text}</div>`;
  }
  const config = {
    appendPadding: 10,
    data: props.data,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.64,
    meta: {
      value: {
        formatter: (v: any) => `${v} ¥`,
      },
    },
    // label: {
    //   type: 'inner',
    //   offset: '-50%',
    //   style: {
    //     textAlign: 'center',
    //   },
    //   autoRotate: false,
    //   content: '{value}',
    // },
    color: ({ type }: any) => {
      if (type === 'Nghỉ không phép'||type === 'Chưa xác nhận'||type === 'Chưa duyệt') {
        return paletteSemanticYellow;
      }
      if (
        type === 'Chi phí' ||
        type === 'Chi dự kiến' ||
        // type === 'Chưa xác nhận'||
        // type === 'Chưa duyệt'||
        type === 'Thực tế chi'
      ) {
        return paletteSemanticRed;
      }
      if (type === 'Đi học' || type === 'Đã duyệt' || type === 'Đã xác nhận' || type === 'Đi làm') {
        return paletteSemanticGreen;
      }
      return brandColor;
    },
    // statistic: {
    //   title: false,
    //   // title: {
    //   //   offsetY: -4,
    //   //   customHtml: (
    //   //     container: { getBoundingClientRect: () => { width: any; height: any } },
    //   //     view: any,
    //   //     datum: { type: any },
    //   //   ) => {
    //   //     const { width, height } = container.getBoundingClientRect();
    //   //     const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
    //   //     const text = datum ? datum.type : 'Tổng số';
    //   //     return renderStatistic(d, text, {
    //   //       fontSize: 16,
    //   //     });
    //   //   },
    //   // },
    //   content: {
    //     offsetY: 4,
    //     style: {
    //       fontSize: '16px',
    //     },
    //     customHtml: (
    //       container: { getBoundingClientRect: () => { width: any } },
    //       view: any,
    //       datum: { value: any },
    //       data: any[],
    //     ) => {
    //       const { width } = container.getBoundingClientRect();
    //       const text = datum
    //         ? `${datum.value} ${props.labelTotal ?? 'Số lượng'}`
    //         : `${data.reduce((r, d) => r + d.value, 0)} ${props.labelTotal ?? 'Số lượng'}`;
    //       return renderStatistic(width, text, {
    //         fontSize: 16,
    //       });
    //     },
    //   },
    // },
    // // 添加 中心统计文本 交互
    // interactions: [
    //   {
    //     type: 'element-selected',
    //   },
    //   {
    //     type: 'element-active',
    //   },
    //   {
    //     type: 'pie-statistic-active',
    //   },
    // ],
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
      {
        type: 'pie-statistic-active',
      },
    ],
    statistic: {
      // title: false,
        title: {
          offsetY: -4,
          customHtml: (
            container: { getBoundingClientRect: () => { width: any; height: any } },
            view: any,
            datum: { type: any },
          ) => {
            const { width, height } = container.getBoundingClientRect();
            const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
            const text = datum ? datum.type : 'Tổng số';
            return renderStatistic(d, text, {
              fontSize: 12,
            });
          },
        },
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: 14,
        },
        customHtml: (
          container: { getBoundingClientRect: () => { width: any } },
          view: any,
          datum: { value: any },
          data: any[],
        ) => {
          const { width } = container.getBoundingClientRect();
          const text = datum
            ? `${datum.value} ${props.labelTotal ?? 'Số lượng'}`
            : `${data.reduce((r, d) => r + d.value, 0)} ${props.labelTotal ?? 'Số lượng'}`;
          return renderStatistic(width, text, {
            fontSize: 16,
          });
        },
        // content: 'AntV\nG2Plot',
      },
    },
  };
  return <Pie height={props.height ? props.height : 300} {...config} />;
};

export default PiePlotChart;
