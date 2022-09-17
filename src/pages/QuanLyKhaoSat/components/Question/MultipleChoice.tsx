/* eslint-disable no-underscore-dangle */
import { Checkbox } from 'antd';

const MultipleChoice = (props: {
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

      <Checkbox.Group value={props?.dapAn}>
        {props.cauTraLoi?.map((item) => (
          <>
            <Checkbox key={item.luaChon} value={item.luaChon}>
              {item.luaChon}
            </Checkbox>
            <br />
          </>
        ))}
      </Checkbox.Group>
    </div>
  );
};

export default MultipleChoice;
