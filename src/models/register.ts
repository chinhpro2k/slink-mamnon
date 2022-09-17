import taikhoankhachService from '@/services/TaiKhoanKhach/taikhoankhach';
import { useState } from 'react';

export default () => {
  const [infoRegister, setInfoRegister] = useState({});
  return {
    infoRegister,
    setInfoRegister,
  };
};
