import { InboxOutlined } from '@ant-design/icons';
import { Upload } from 'antd';

const { Dragger } = Upload;

const UploadDocs = (props?: any) => {
  return (
    <div>
      <Dragger
        customRequest={({ file, onSuccess }) => {
          setTimeout(() => {
            if (onSuccess) onSuccess(file, new XMLHttpRequest());
          }, 0);
        }}
        {...props}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click chuột hoặc kéo thả tài liệu để tải lên</p>
        <p className="ant-upload-hint">{props.message}</p>
      </Dragger>
    </div>
  );
};

export default UploadDocs;
