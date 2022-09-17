import type { ThucPhamKho as IThucPhamKho } from '@/services/ThucPhamKho';
import {capNhatNhaCungCap, getHoaDon} from '@/services/ThucPhamKho/thucphamkho';
// import { capNhatNhaCungCap, getHoaDon } from '@/services/ThucPhamKho/thucphamkho';
import Notification from '@/components/Notification';
import { useState } from 'react';

export default () => {
    const [danhSach, setDanhSach] = useState<IThucPhamKho.Record[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [total, setTotal] = useState<number>(0);
    const [record, setRecord] = useState<IThucPhamKho.Record>({} as any);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [cond, setCondition] = useState<any>({});
    const [filterInfo, setFilterInfo] = useState<any>({});
    const [edit, setEdit] = useState<boolean>(false);
    const [visibleForm, setVisibleForm] = useState<boolean>(false);
    const [nhaCungCap, setNhaCungCap] = useState('');

    const getHoaDonModel = async (
        donViId?: string,
        ngay?: number,
        thang?: number,
        nam?: number,
        loaiThucPham?: string,
    ) => {
        setLoading(true);
        const response = await getHoaDon({
            page,
            limit,
            cond,
            donViId,
            ngay,
            thang,
            nam,
            loaiThucPham,
        });
        const arr = response?.data?.data?.result ?? [];
        setNhaCungCap(arr?.[0]?.nhaCungCap ?? '');
        setDanhSach(arr);
        setTotal(response?.data?.data?.total);
        setLoading(false);
    };

    const capNhatNhaCungCapModel = async ({ donViId, ngay, thang, nam, nhaCungCap }) => {
        await capNhatNhaCungCap({
            donViId,
            ngay,
            thang,
            nam,
            nhaCungCap,
        });
        Notification('success', 'Cập nhật nhà cung cấp thành công');
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
        getHoaDonModel,
        nhaCungCap,
        setNhaCungCap,
        capNhatNhaCungCapModel,
    };
};
