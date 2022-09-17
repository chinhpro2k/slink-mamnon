import { Axis, Chart, Coord, Geom, Label, Tooltip } from 'bizcharts';
import numeral from 'numeral';
import type { KhaoSat as IKhaoSat } from '@/services/QuanLyKhaoSat';

const BarLabel = (props: { ketQua: IKhaoSat.ThongKeLuaChon }) => {
  const cols = {};
  let tongSoNguoiChon = 0;

  // khoi tao du lieu
  const data: any[] = [];
  props?.ketQua?.cauTraLoi?.map((item: { luaChon: any }) =>
    item?.luaChon ? data.push({ ...item, soLuong: 0 }) : undefined,
  );

  props?.ketQua?.tongHop?.forEach(({ cauTraLoi: text, soNguoiChon }: any) => {
    tongSoNguoiChon += soNguoiChon;
    props?.ketQua?.cauTraLoi?.forEach(({ luaChon }: any, index: number) => {
      if (text === luaChon) data[index].soLuong = soNguoiChon;
    });
  });

  return (
    <div>
      <div>
        <b>Số lượt trả lời: {tongSoNguoiChon}</b>
      </div>
      <Chart height={300} autoFit data={data} scale={cols} padding="auto">
        <Coord transpose />
        <Axis name="luaChon" />
        <Axis name="soLuong" visible={false} />
        <Tooltip />
        <Geom type="interval" position={`luaChon*soLuong`} color={['luaChon', '#E6F6C8-#3376CB']}>
          <Label content={['luaChon*soLuong', (name, value) => numeral(value || 0).format()]} />{' '}
        </Geom>
      </Chart>
    </div>
  );
};

export default BarLabel;
