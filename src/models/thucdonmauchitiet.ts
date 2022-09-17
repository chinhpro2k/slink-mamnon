import { useState } from 'react';
import { getThucDonMauChiTiet } from '@/pages/ThucPham/LenThucDonMau/service';
import { useModel } from 'umi';
import axios from '@/utils/axios';
import moment from 'moment';
import { ip3 } from '@/utils/constants';

export default () => {
  const initialStateModel = useModel('@@initialState');
  const [danhSach, setDanhSach] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [record, setRecord] = useState({} as any);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [cond, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);

  const getThucDonMauChiTietModel = async (templateId: any) => {
    setLoading(true);
    const resp = await getThucDonMauChiTiet({ page, limit, cond, templateId });
    let dataEvents = [];
    resp?.data?.data?.result?.map((item) => {
      dataEvents.push({
        ...item,
        resource: item?.thucDonMauId,
        allDay: false,
        start: moment(new Date())
          .weekday(item?.thu - 1)
          .set('hour', 0)
          .set('minute', 0)
          .toDate(),
        end: moment(new Date())
          .weekday(item?.thu - 1)
          .set('hour', 23)
          .set('minute', 59)
          .toDate(),
        title: '',
      });
    });
    setDanhSach(dataEvents);
    setLoading(false);
  };

  return {
    danhSach,
    record,
    setRecord,
    loading,
    setLoading,
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
    setVisibleForm,
    edit,
    setEdit,
    visibleForm,
    getThucDonMauChiTietModel,
  };
};
