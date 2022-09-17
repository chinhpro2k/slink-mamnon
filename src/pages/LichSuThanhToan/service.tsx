import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export const getLichSuThanhToanAdmin = (payload: any) => {
  return axios.get(`${ip3}/nang-cap-tai-khoan/admin`, { params: payload });
};

export const getLichSuThanhToanCaNhan = (payload: any) => {
  return axios.get(`${ip3}/nang-cap-tai-khoan/stat/from/{fromDate}/to/{toDate}`, {
    params: payload,
  });
};
