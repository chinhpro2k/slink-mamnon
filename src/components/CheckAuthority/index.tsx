import type { ReactNode } from 'react';
import React from 'react';
import { useModel } from 'umi';

interface Props {
  maChucNang: string;
  children: ReactNode;
}

export const ChucNang = () => {
  const { initialState } = useModel('@@initialState');
  const modules = initialState?.currentUser?.modules ?? [];
  return modules?.filter((x) => !!x);
};

export const checkAllow = (maChucNang: string) => {
  const arrChucNang = JSON.parse(localStorage.getItem('modules') ?? '') ?? [];

  if (!arrChucNang || arrChucNang.length === 0) return false;
  const indexExist = arrChucNang.indexOf(maChucNang);

  if (indexExist >= 0) {
    return true;
  } else {
    console.log('maChucNang :>> ', maChucNang);
  }
  return false;
};

const CheckAuthority: React.FC<Props> = ({ maChucNang, children }) => {
  const allow = checkAllow(maChucNang);
  return allow ? <div>{children}</div> : <></>;
};

export default CheckAuthority;
