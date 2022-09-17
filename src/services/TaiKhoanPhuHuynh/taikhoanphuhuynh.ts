import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getTaiKhoanPhuHuynh(payload: {
  page: number;
  limit: number;
  cond?: any;
  idTruong?: string;
  filterInfo?: object;
}) {
  const { page, limit, cond, idTruong, filterInfo } = payload;
  const cloneCond = JSON.parse(JSON.stringify(cond));
  delete cloneCond.organizationId;
  if (idTruong === 'Tất cả' || !idTruong) {
    return axios.get(`${ip3}/user/pageable`, {
      params: {
        page,
        limit,
        cond: {
          'roles.systemRole': 'PhuHuynh',
          ...cloneCond,
        },
        ...(filterInfo?.sort &&
          Object.keys(filterInfo?.sort).length > 0 && { sort: filterInfo?.sort ?? {} }),
      },
    });
  }
  return axios.get(`${ip3}/user/pageable/organization/${idTruong}?systemRole=PhuHuynh`, {
    params: {
      page,
      limit,
      cond: {
        ...cloneCond,
      },
      ...(filterInfo?.sort &&
        Object.keys(filterInfo?.sort).length > 0 && { sort: filterInfo?.sort ?? {} }),
    },
  });
}

export async function getPhuHuynh(payload: {
  page: number;
  limit: number;
  cond?: any;
  filterInfo?: object;
}) {
  const { page, limit, cond, filterInfo } = payload;
  return axios.get(`${ip3}/user/pageable`, {
    params: {
      page,
      limit,
      cond: {
        ...cond,
        'roles.systemRole': 'PhuHuynh',
      },
      ...(filterInfo?.sort &&
        Object.keys(filterInfo?.sort).length > 0 && { sort: filterInfo?.sort ?? {} }),
    },
  });
}

export async function addTaiKhoanPhuHuynh(payload: any) {
  return axios.post(`${ip3}/user`, payload);
}

export async function updTaiKhoanPhuHuynh(payload: any, del = false) {
  const { id } = payload;
  return axios.put(`${ip3}/user/${id}`, payload, { params: del && { systemRole: 'PhuHuynh' } });
}
export async function delTaiKhoanPhuHuynh(payload: any) {
  const { id,dataDel } = payload;
  return axios.put(`${ip3}/user/${id}/vai-tro`, dataDel);
}

