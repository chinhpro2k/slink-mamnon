import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export const getGoiThanhToan = (payload: any) => {
  return axios.get(`${ip3}/goi-thanh-toan/pageable`, { params: payload });
};

export const postGoiThanhToan = (payload: any) => {
  return axios.post(`${ip3}/goi-thanh-toan`, payload);
};

export const editGoiThanhToan = (payload: any) => {
  const { id } = payload;
  delete payload.id;
  return axios.put(`${ip3}/goi-thanh-toan/${id}`, payload);
};
