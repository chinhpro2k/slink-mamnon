import { Axis, Chart, Geom, Tooltip } from 'bizcharts';

const LineChart = (props: {
  xLabel?: string;
  yLabel?: string;
  data: { x: any; y: any }[];
  height?: number;
}) => {
  const cols = {
    y: {
      min: 0,
      range: [0, 0.9],
      alias: props?.yLabel ?? 'y',
    },
    x: {
      range: [0, props?.data?.length < 3 ? 0.3 : 0.96],
      alias: props?.xLabel ?? 'x',
    },
  };
  return (
    <div>
      <Chart
        // style={{fontSize:10}}
        padding={{ top: 10, bottom: 40, left: 30, right: 30 }}
        height={props?.height ?? 400}
        data={props?.data ?? []}
        scale={cols}
        forceFit
      >
        <Axis
          label={{
            // textStyle: {
            //   fontSize: 10,
            // },
            htmlTemplate: (text: string) => {
              return `<div style='font-size:10px;margin-top:28px'>${text}</div>`;
            },
          }}
          name="x"
          title={{
            position: 'end',
            offset: 15,
            textStyle: {
              fontSize: '12',
              textAlign: 'center',
              fill: '#999',
              fontWeight: 'bold',
              rotate: 0,
            },
          }}
        />
        <Axis
          name="y"
          title={{
            position: 'end',
            offset: 0,
            textStyle: {
              fontSize: '12',
              textAlign: 'right',
              fill: '#999',
              fontWeight: 'bold',
              rotate: 1,
            },
          }}
        />
        <Tooltip
          crosshairs={{
            type: 'y',
          }}
        />
        <Geom
          type="line"
          position="x*y"
          size={2}
          tooltip={[
            'x*y',
            (x, y) => {
              return {
                name: x,
                value: y,
                title: props?.xLabel ?? 'x',
              };
            },
          ]}
        />
        <Geom
          type="point"
          position="x*y"
          size={4}
          shape={'circle'}
          style={{
            stroke: '#fff',
            lineWidth: 1,
          }}
          tooltip={[
            'x*y',
            (x, y) => {
              return {
                name: x,
                value: y,
              };
            },
          ]}
        />
      </Chart>
    </div>
  );
};

export default LineChart;
