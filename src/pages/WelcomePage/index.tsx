import { Card, Typography } from 'antd';
import WelcomeImg from '@/assets/welcome.jpg';
import BannerImg from '@/assets/banner.jpg';
const Welcome = () => {
  return (
    <Card
      bodyStyle={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh',
        background: `url(${BannerImg}) center center no-repeat`,
        backgroundSize: 'cover',
        flexDirection: 'column',
      }}
    >
      <Typography.Title level={1} style={{ marginTop: 50 }}>
        Hệ thống mầm non
      </Typography.Title>
      <img src={WelcomeImg} style={{ width: '40%', height: '70%' }} />
    </Card>
  );
};

export default Welcome;
