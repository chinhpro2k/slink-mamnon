import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export const getThucDonMau = (payload: any) => {
  return axios.get(`${ip3}/template-thuc-don/pageable`, { params: payload });
};

export const getThucDonMauChiTiet = (payload: any) => {
  return axios.get(`${ip3}/template-thuc-don-chi-tiet/pagable/${payload.templateId}`, {
    params: payload,
  });
};
