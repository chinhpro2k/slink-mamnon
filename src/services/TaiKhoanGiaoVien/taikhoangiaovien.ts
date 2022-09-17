import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
export interface DelTaiKhoanGiaoVien {
  organizationId: string;
  roleId: string;
  childId: string;
  name: string;
  _id: string;
  ngayNangCap: string;
  systemRole: string;
  expireDate: string;
  listOrgIdAccess: string[];
}
export interface IDataReqChuyenLopGiaoVien {
  userId: string;
  donViIdFrom: string;
  donViIdTo: string;
}
export async function getTaiKhoanGiaoVien(payload: {
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
          'roles.systemRole': 'GiaoVien',
          ...cloneCond,
        },
        ...(filterInfo?.sort &&
          Object.keys(filterInfo?.sort).length > 0 && { sort: filterInfo?.sort ?? {} }),
      },
    });
  }
  return axios.get(`${ip3}/user/pageable/organization/${idTruong}?systemRole=GiaoVien`, {
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

export async function getGiaoVien(payload: {
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
        'roles.systemRole': 'GiaoVien',
      },
      ...(filterInfo?.sort &&
        Object.keys(filterInfo?.sort).length > 0 && { sort: filterInfo?.sort ?? {} }),
    },
  });
}

export async function addTaiKhoanGiaoVien(payload: any) {
  return axios.post(`${ip3}/user`, payload);
}

export async function delTaiKhoanGiaoVien(payload: DelTaiKhoanGiaoVien, id: string) {
  return axios.put(`${ip3}/user/${id}/vai-tro`, payload);
}
export async function updTaiKhoanGiaoVien(payload: any, del = false) {
  const { id } = payload;
  return axios.put(`${ip3}/user/${id}`, payload, { params: del && { systemRole: 'GiaoVien' } });
}
export async function chuyenLopGiaoVien(data: IDataReqChuyenLopGiaoVien) {
  return axios.put(
    `${ip3}/user/giao-vien/${data.userId}/from/${data.donViIdFrom}/chuyen-lop/to/${data.donViIdTo}`,
  );
}
export async function updHoSoGiaoVien(payload: any) {
  const { idHoSo } = payload;
  return axios.put(`${ip3}/ho-so-giao-vien/${idHoSo}`, payload);
}

export async function AddHoSoGiaoVien(payload: any) {
  return axios.post(`${ip3}/ho-so-giao-vien`, payload);
}

export async function delGiaoVien(payload: any) {
  const { userId, donViId } = payload;
  return axios.delete(`${ip3}/user/giaovien/${userId}/lop/${donViId}`);
}

// export async function delTaiKhoanGiaoVien(payload: { id: string }) {
//   const { id } = payload;
//   return axios.delete(`${ip3}/user/${id}`);
// }

export async function importTaiKhoan(payload: any) {
  const file = payload?.file?.fileList?.[0].originFileObj;
  const form = new FormData();
  form.append('file', file);
  return axios.post(`${ip3}/user/import/excel/${payload?.organizationId}`, form);
}
