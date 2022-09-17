import DataSet from '@antv/data-set';
import { Axis, Chart, Coord, Geom, Guide, Label, Legend, Tooltip } from 'bizcharts';
import type { KhaoSat as IKhaoSat } from '@/services/QuanLyKhaoSat';

const Donut = (props: { ketQua: IKhaoSat.ThongKeLuaChon }) => {
  const { DataView } = DataSet;
  const { Html } = Guide;
  const dv = new DataView();
  let tongSoLuot = 0;

  // khoi tao du lieu
  const data: { luaChon: any; soLuong: number }[] = [];
  props?.ketQua?.cauTraLoi.map(({ luaChon }: any) => {
    if (luaChon) return data.push({ luaChon, soLuong: 0 });
    if (!luaChon) return data.push({ luaChon: 'Lựa chọn khác', soLuong: 0 });
    return false;
  });

  props?.ketQua?.tongHop.forEach(({ cauTraLoi: text, soNguoiChon }: any) => {
    tongSoLuot += soNguoiChon;
    props?.ketQua?.cauTraLoi.forEach(({ luaChon }: any, index: number) => {
      if (text === luaChon) data[index].soLuong = soNguoiChon;
      if (!luaChon) {
        data[index].soLuong = soNguoiChon;
        data[index].luaChon = 'Lựa chọn khác';
      }
    });
  });

  dv.source(data ?? []).transform({
    type: 'percent',
    field: 'soLuong' ?? 0,
    dimension: 'luaChon',
    as: 'percent',
  });
  const cols = {
    percent: {
      formatter: (val: number) => {
        return `${val * 100}%`;
      },
    },
  };
  return (
    <div>
      <div>
        <b>Số lượt trả lời: {tongSoLuot}</b>
      </div>
      <Chart
        height={500}
        data={data}
        scale={cols}
        // padding={[80, 100, 80, 80]}
        forceFit
      >
        <Coord type={'theta'} radius={0.6} innerRadius={0.7} />
        <Axis name="percent" />
        <Legend position="bottom" />
        <Tooltip
          showTitle={false}
          itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
        />
        {/* <Guide>
          <Html
            position={['50%', '50%']}
            html={`<div style="color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;">Số lượt <br><span style="color:#262626;font-size:2.5em">${tongSoLuot}`}
            alignX="middle"
            alignY="middle"
          />
        </Guide> */}
        <Geom
          type="interval"
          position="percent"
          color="luaChon"
          tooltip={[
            'luaChon*percent',
            (luaChon, percent) => {
              return {
                name: luaChon,
                value: `${(percent * 100).toFixed(2)}%`,
              };
            },
          ]}
          style={{
            lineWidth: 1,
            stroke: '#fff',
          }}
        >
          <Label
            content="percent"
            formatter={(val, luaChon) => {
              return `${luaChon.point.luaChon}: ${val}`;
            }}
          />
        </Geom>
      </Chart>
    </div>
  );
};

export default Donut;
