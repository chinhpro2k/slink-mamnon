import { Column } from '@ant-design/charts';

const ColumnChart = (props: { data: { x: any; y: any }[]; xLabel?: string; yLabel?: string }) => {
  return (
    <Column
      height={300}
      forceFit
      data={props.data}
      xField="x"
      yField="y"
      xAxis={{
        label: {
          autoHide: true,
          autoRotate: false,
          style: {
            fontSize: 12,
          },
        },
        visible: true,
        title: {
          visible: false,
        },
      }}
      yAxis={{
        visible: true,
        title: {
          visible: false,
        },
      }}
      title={{
        visible: true,
        text: props.xLabel ?? 'Số lượng',
        style: {
          fontSize: 14,
        },
      }}
      meta={{
        y: {
          alias: props?.xLabel ?? 'Số lượng',
        },
      }}
    />
  );
};

export default ColumnChart;
