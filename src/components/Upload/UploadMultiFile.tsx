import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import { useState } from 'react';

const UploadMultiFile = (props: {
  disabled?: boolean;
  fileList?: any[];
  value?: {
    fileList: any[];
  };
  otherProps?: any;
  onChange?: any;
}) => {
  const [fileList, setFileList] = useState(props?.fileList || props?.value?.fileList || []);

  const triggerChange = (changedValue: any) => {
    const { onChange } = props;
    if (onChange) {
      onChange({ ...changedValue });
    }
  };

  const handleChange = (files: any) => {
    setFileList(files?.fileList);
    triggerChange(files?.fileList);
  };

  const uploadButton = (
    <Button disabled={props.disabled}>
      <UploadOutlined /> Tải lên
    </Button>
  );
  return (
    <div className="clearfix">
      <Upload
        disabled={props.disabled}
        fileList={fileList}
        customRequest={({ file, onSuccess }) => {
          setTimeout(() => {
            if (onSuccess) onSuccess(file, new XMLHttpRequest());
          }, 0);
        }}
        onChange={handleChange}
        {...props.otherProps}
      >
        {props.otherProps && !props.otherProps.disabled && uploadButton}
      </Upload>
    </div>
  );
};

export default UploadMultiFile;
