/* eslint-disable no-underscore-dangle */
import { Table } from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import type { ColumnProps } from 'antd/lib/table';

const GridChoice = (props: {
  hang?: string[];
  cot?: string[];
  dapAn?: any;
  cauHoi?: string;
  stt?: number;
}) => {
  const columns: ColumnProps<any>[] = [
    {
      title: '',
      dataIndex: 'tieuChi',
      width: 300,
      fixed: 'left',
    },
  ];

  const data = props?.hang?.map((item) => {
    const record = {
      tieuChi: item,
    };
    return record;
  });

  props?.cot?.forEach((item) => {
    columns.push({
      key: item,
      title: item,
      dataIndex: item,
      align: 'center',
      render: (val) => <Checkbox checked={val} />,
    });
  });

  return (
    <div>
      <div style={{ marginBottom: 5 }}>
        <b>
          Câu {props?.stt}: {props?.cauHoi}
        </b>
      </div>
      <Table pagination={false} scroll={{ x: 700 }} dataSource={data} columns={columns} />
    </div>
  );
};

export default GridChoice;
