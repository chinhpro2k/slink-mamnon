import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { history } from 'umi';
import { getInfoAdmin } from '@/services/ant-design-pro/api';
import { useModel, useHistory } from 'umi';
import { ipRedirectLanding } from '@/utils/constants';

const AutoLogin = (props) => {
  const [startLogin, setStartLogin] = useState(false);
  const usehistory = useHistory();
  const handleAutoLogin = async () => {
    const {
      location: {
        query: { token, role },
      },
    } = props;
    if (!token) {
      history.push('/user/login');
    }
    localStorage.setItem('token', token);
    localStorage.setItem('vaiTro', role);
    const currentUser = (await getInfoAdmin()).data;
    localStorage.setItem('dataRole', JSON.stringify(currentUser?.roles));
    setStartLogin(!startLogin);
  };
  useEffect(() => {
    handleAutoLogin();
  }, []);
  useEffect(() => {
    if (startLogin) {
      // history.push(ipRedirectLanding);
      document.location.href = ipRedirectLanding;
      // window.location.reload(false);
    }
  }, [startLogin]);
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Spin />
    </div>
  );
};

export default AutoLogin;
