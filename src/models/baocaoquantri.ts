import { useState } from 'react';
import {exportExcel, getBaoCao, tinhToanBaoCaoQuanTri} from '@/services/BaoCaoQuanTri/baocaoquantri';
import { BaoCaoQuanTri, IDataBaoCao } from '@/services/BaoCaoQuanTri';
import FileDownload from 'js-file-download';

export default () => {
  const [dataBaoCao, setDataBaoCao] = useState<BaoCaoQuanTri.IDataBaoCao[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const getDataBaoCao = async (payload: { cond?: any }) => {
    const res = await getBaoCao({ page: page, limit: limit, cond: payload.cond });
    if (res) {
      setDataBaoCao(res?.data?.data.result);
      setTotal(res?.data?.data.total);
    }
  };
  const exportBaoCao = async (payload: { cond?: any; nam: number; thang: number }) => {
    const res = await exportExcel({ cond: payload.cond });
    if (res) {
      FileDownload(res.data, `BaoCaoQuanTri-Thang${payload.thang}-Nam${payload.nam}`);
    }
  };
  const tinhToanBaoCao = async () => {
    const res = await tinhToanBaoCaoQuanTri();
    if (res) {

    }
  };
  return {
    dataBaoCao,
    getDataBaoCao,
    total,
    setTotal,
    page,
    setPage,
    limit,
    setLimit,
    cond,
    setCondition,
    loading,
    setLoading,
    exportBaoCao,
    filterInfo,
    setFilterInfo,
    tinhToanBaoCao
  };
};
