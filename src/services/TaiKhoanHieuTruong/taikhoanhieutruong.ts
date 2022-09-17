import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getTaiKhoanHieuTruong(payload: {
  page: number;
  limit: number;
  cond?: any;
  idDonVi?: string;
}) {
  const { page, limit, cond, idDonVi } = payload;
  const cloneCond = JSON.parse(JSON.stringify(cond));
  delete cloneCond.organizationId;
  return axios.get(`${ip3}/user/pageable`, {
    params: {
      page,
      limit,
      cond: {
        ...cloneCond,
        'roles.systemRole': 'HieuTruong',
        'roles.organizationId': idDonVi === 'Tất cả' ? undefined : idDonVi,
      },
    },
  });
}
export async function getTaiKhoan() {
  return axios.get(`${ip3}/user/admin/hieu-truong`, {});
}
export async function getTaiKhoanChuTruongSelect() {
  return axios.get(`${ip3}/user/admin/chu-truong`, {});
}
export async function getTaiKhoanChuTruong(payload: {
  page: number;
  limit: number;
  cond?: any;
  idDonVi?: string;
}) {
  const { page, limit, cond,idDonVi } = payload;
  const cloneCond = JSON.parse(JSON.stringify(cond));
  delete cloneCond.organizationId;
  return axios.get(`${ip3}/user/pageable`, {
    params: {
      page,
      limit,
      cond: {
        ...cloneCond,
        'roles.systemRole': 'ChuTruong',
        'roles.listTruongAccess': idDonVi,
      },
    },
  });
}
export async function addChuTruong(id: string, truongId: string, roleId?: string) {
  return axios.put(`${ip3}/user/${id}/chu-truong/truong/${truongId}`);
}
export async function addHieuTruong(id: string, truongId: string, roleId: string) {
  return axios.put(`${ip3}/user/${id}/hieu-truong/truong/${truongId}/role/${roleId}`);
}
export async function addTaiKhoanHieuTruong(payload: any) {
  return axios.post(`${ip3}/user`, payload);
}

export async function updTaiKhoanHieuTruong(payload: any) {
  const { id } = payload;
  return axios.put(`${ip3}/user/${id}`, payload);
}
export async function updMe(payload: any) {
  return axios.put(`${ip3}/user/my`, payload);
}

export async function delTaiKhoanHieuTruong(payload: { id: string }) {
  const { id } = payload;
  return axios.delete(`${ip3}/user/${id}`);
}
// Xóa ở màn quản lý trường học bởi vì xóa ở đó là không được xóa kiểu user mà phải xóa vai trò thôi
export async function delVaiTroHieuTuong(payload: { id: string; truongId: string }) {
  const { id, truongId } = payload;
  return axios.delete(`${ip3}/user/admin/hieu-truong/${id}/truong/${truongId}`);
}
export async function delVaiTroChuTruong(payload: { id: string; truongId: string }) {
  const { id, truongId } = payload;
  return axios.delete(`${ip3}/user/admin/chu-truong/${id}/truong/${truongId}`);
}
// ===============================================
export async function resetPass(payload: { id: string }) {
  const { id } = payload;
  return axios.put(`${ip3}/user/force-reset-password/${id}`);
}
