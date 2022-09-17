/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getTemplateChiTiet(payload: any) {
  const id = payload?.id;
  delete payload.id;
  return axios.get(`${ip3}/template-lich-hoc-chi-tiet/pageable/${id}`, { params: payload });
}

export async function getTemplateLichService(payload: { page: number; limit: number; cond?: any }) {
  return axios.get(`${ip3}/template-lich-hoc/pageable`, { params: payload });
}

export async function getDonViLopService(payload: any) {
  return axios.get(`${ip3}/don-vi/pageable/my/child`, { params: payload });
}

export async function addTemplate(payload: any) {
  return axios.post(`${ip3}/template-lich-hoc`, payload);
}

export async function delTemplate(payload: any) {
  const id = payload?._id;
  delete payload._id;
  return axios.delete(`${ip3}/template-lich-hoc/${id}`, payload);
}

export async function updTemplate(payload: any) {
  const id = payload?._id;
  delete payload._id;
  return axios.put(`${ip3}/template-lich-hoc/${id}`, payload);
}

export async function addTemplateChiTiet(payload: any) {
  return axios.post(`${ip3}/template-lich-hoc-chi-tiet`, payload);
}

export async function updTemplateChiTiet(payload: any) {
  return axios.put(`${ip3}/template-lich-hoc-chi-tiet/${payload._id}`, payload);
}

export async function delTemplateChiTiet(payload: any) {
  return axios.delete(`${ip3}/template-lich-hoc-chi-tiet/${payload._id}`);
}
