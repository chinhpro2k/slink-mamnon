import { postNewPassword, postSdt } from '@/services/ForgetPassword/forgetpassword';
import { useState } from 'react';
import { message } from 'antd';
import { history } from 'umi';

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [showOtp, setShowOtp] = useState(true);
  const [mess, setMess] = useState('');
  const postSdtModel = async (payload: any) => {
    try {
      setLoading(true);
      const res = await postSdt(payload);
      setMess('Gửi số điện thoại thành công');
      message.success('Gửi số điện thoại thành công');
      setLoading(false);
      setShowOtp(false);
      return res?.data;
    } catch (error) {
      setMess('Gửi số điện thoại thất bại');
      message.error('Số điện thoại này chưa được đăng ký tài khoản hoặc nhập sai số điện thoại');
      // setShowOtp(true);
    }
  };

  const postNewPasswordModel = async (payload: any) => {
    try {
      setLoading(true);
      await postNewPassword(payload);
      setLoading(false);
      message.success('Thay đổi mật khẩu thành công');
      history.push(`/user/login`);
      setLoading(false);
      setShowOtp(true);
      // setShowOtp(false);
    } catch (error) {
      setShowOtp(true);
      message.error('Mật khẩu không trùng khớp hoặc nhập sai mã OTP');
    }
  };

  return {
    postNewPasswordModel,
    setLoading,
    postSdtModel,
    showOtp,
    setShowOtp,
    mess,
    setMess,
  };
};
