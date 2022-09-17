import { useEffect } from 'react';
import { Spin, Row, Col } from 'antd';
import { ipRedirectLanding } from '@/utils/constants';
import { history } from 'umi';

const LoginLanding = () => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    const vaiTro = localStorage.getItem('vaiTro');
    window.location.href = `${ipRedirectLanding}/autologin?token=${token}`;
  });
  return (
    <Row>
      <Col
        span={24}
        style={{ height: 500, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Spin />
      </Col>
    </Row>
  );
};

export default LoginLanding;
