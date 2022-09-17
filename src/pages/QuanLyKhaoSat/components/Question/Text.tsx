import { Input } from 'antd';

const Text = (props: { dapAn?: string; cauHoi?: string; stt?: number }) => {
  return (
    <div>
      <div style={{ marginBottom: 5 }}>
        <b>
          Câu {props?.stt}: {props?.cauHoi}
        </b>
      </div>
      <Input.TextArea rows={3} value={props?.dapAn} readOnly />
    </div>
  );
};

export default Text;
