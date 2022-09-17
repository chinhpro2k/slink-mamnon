/* eslint-disable no-underscore-dangle */
import { Radio, Space } from 'antd';

const SingleChoice = (props: {
  cauTraLoi: { isKhac: boolean; luaChon: string }[];
  dapAn?: string[];
  cauHoi?: string;
  stt?: number;
}) => {
  return (
    <div>
      <div>
        <b>
          Câu {props?.stt}: {props?.cauHoi}
        </b>
      </div>
      <Radio.Group value={props?.dapAn?.[0]}>
        <Space direction="vertical">
          {props.cauTraLoi?.map(({ luaChon }) => {
            if (luaChon) {
              return (
                <Radio key={luaChon} value={luaChon}>
                  {luaChon}
                </Radio>
              );
            }
            return false;
          })}
        </Space>
      </Radio.Group>
    </div>
  );
};

export default SingleChoice;
