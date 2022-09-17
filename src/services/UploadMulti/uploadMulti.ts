import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

// upload multidoc
export async function uploadMulti(payload: any) {
  const form = new FormData();
  const prefix = 'prefix';
  const bool: any = true;
  form.append('public', bool);
  form.append('prefix', prefix);
  payload?.map((item: string | Blob) => form.append('files', item));
  return axios.post(`${ip3}/file/document/multiple`, form);
}

// upload multiPic
export async function uploadMultiPic(payload: any) {
  const form = new FormData();
  const prefix = 'prefix';
  const bool: any = true;
  form.append('public', bool);
  form.append('prefix', prefix);
  payload?.map((item: string | Blob) => form.append('files', item));
  return axios.post(`${ip3}/file/image/multiple`, form);
}
