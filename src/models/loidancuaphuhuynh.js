import { getLoiDanCuaPhuHuynh } from '@/services/LoiDanCuaPhuhuynh/services';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState([]);
  const [record, setRecord] = useState();
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [cond, setCondition] = useState({});
  const [filterInfo, setFilterInfo] = useState({});

  const getLoiDanCuaPhuHuynhModel = async (donViId, timeStart, timeEnd) => {
    setLoading(true);
    const response = await getLoiDanCuaPhuHuynh({
      page,
      limit,
      cond,
      donViId,
      timeStart,
      timeEnd,
    });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  return {
    danhSach,
    loading,
    setLoading,
    getLoiDanCuaPhuHuynhModel,
    total,
    setTotal,
    page,
    setPage,
    limit,
    setLimit,
    cond,
    setCondition,
    filterInfo,
    setFilterInfo,
    setRecord,
    record,
  };
};
