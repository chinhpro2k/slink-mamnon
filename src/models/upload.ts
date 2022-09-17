import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  return {
    danhSach,
    loading,
    setLoading,
    setDanhSach,
  };
};
