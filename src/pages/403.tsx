import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

const NoAccessPage: React.FC = () => (
  <Result
    status="403"
    title="403"
    subTitle="Xin lỗi, trang truy cập hiện không tồn tại!"
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        Quay về trang chủ
      </Button>
    }
  />
);

export default NoAccessPage;
