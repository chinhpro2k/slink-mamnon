import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { message, Modal, Upload } from 'antd';
import { useState } from 'react';

const UploadImage = (props: any) => {
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState(props.value?.fileList?.[0]?.url);
  const getBase64 = (img: Blob, callback: (arg0: string | ArrayBuffer | null) => any) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  const triggerChange = (changedValue: any) => {
    const { onChange } = props;
    if (onChange) {
      onChange({ ...changedValue });
    }
  };
  const handleCancel = () => setPreviewVisible(false);
  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      setImage(undefined);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (imageUrl) => {
        setLoading(false);
        setImage(imageUrl);
      });

      triggerChange({ fileList: [info.file] });
    }
  };
  const beforeUpload = (file: { type: string; size: number }) => {
    const isImg = file.type.split('/')[0] === 'image';
    if (!isImg) {
      message.error('Bạn chỉ có thể  chọn ảnh!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Dung lượng ảnh phải nhỏ hơn 5MB!');
    }
    return isImg && isLt5M;
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
        listType="picture-card"
        accept="image/*"
        showUploadList={false}
        customRequest={({ file, onSuccess }) => {
          setTimeout(() => {
            if (onSuccess) onSuccess(file, new XMLHttpRequest());
          }, 0);
        }}
        onChange={handleChange}
        beforeUpload={beforeUpload}
      >
        {image ? <img src={image} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
      <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} />
      </Modal>
    </div>
  );
};
export default UploadImage;
