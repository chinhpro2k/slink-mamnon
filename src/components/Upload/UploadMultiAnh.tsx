import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
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
  const [loading, setLoading] = useState<boolean>(false);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState();
  const [previewTitle, setPreviewTitle] = useState();

  const triggerChange = (changedValue: any) => {
    const { onChange } = props;
    if (onChange) {
      onChange({ ...changedValue });
    }
  };
  const getBase64 = (img: Blob, callback: (arg0: string | ArrayBuffer | null) => any) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const handleChange = (files: any) => {
    setFileList(files?.fileList);
    triggerChange(files?.fileList);
    if (files.file.status === 'uploading') {
      setLoading(true);
      return;
    }

    if (files.file.status === 'done') {
      getBase64(files.file.originFileObj, (imageUrl: any) => {
        setLoading(false);
        setPreviewImage(imageUrl);
      });

      triggerChange({ fileList: files.fileList });
    }
  };

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      // eslint-disable-next-line no-param-reassign
      file.preview = getBase64(file.originFileObj, (imageUrl: any) => {
        setLoading(false);
        setPreviewImage(imageUrl);
      });
    }
    setPreviewVisible(true);
    setPreviewImage(file.url || file.preview);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <UploadOutlined />}
      <div className="ant-upload-text">Tải ảnh</div>
    </div>
  );
  return (
    <div className="clearfix">
      <Upload
        disabled={props.disabled}
        fileList={fileList}
        listType="picture-card"
        customRequest={({ file, onSuccess }) => {
          setTimeout(() => {
            if (onSuccess) onSuccess(file, new XMLHttpRequest());
          }, 0);
        }}
        onChange={handleChange}
        onPreview={handlePreview}
        {...props.otherProps}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default UploadMultiFile;
