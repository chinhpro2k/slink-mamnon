import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function upload(payload: any) {
  const filename = 'image';
  const file = payload.fileList?.[0].originFileObj;
  const bool: any = true;
  const form = new FormData();
  form.append('file', file);
  form.append('public', bool);
  form.append('filename', filename);
  return axios.post(`${ip3}/file/image/single`, form);
}
