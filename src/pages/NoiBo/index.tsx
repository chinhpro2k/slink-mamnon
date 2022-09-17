import { Tabs } from 'antd';
import ThongKeTheoNgay from '@/pages/NoiBo/components/thongKeTheoNgay';
import ThongKeTheoThang from '@/pages/NoiBo/components/thongKeTheoThang';
import { useModel } from 'umi';
import { useEffect, useState } from 'react';
import ThongKeTaiChinh from '@/pages/NoiBo/components/thongKeTaiChinh';

const NoiBo = () => {
  const vaiTro = localStorage.getItem('vaiTro');
  const {
    tinhLaiBaoCaoNoiBo,
    tinhLaiBaoCaoNoiBoThang,
    getDataLop,
    tinhLaiBaoCaoNoiBoThangChuTruong,
    tinhLaiBaoCaoNoiBoNgayChuTruong,
  } = useModel('baocaonoibo');
  const onChange = (key: string) => {
    console.log(key);
  };
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId ?? '';
  const [listTruong, setListTruong] = useState<any>(
    initialState?.currentUser?.roles?.[0]?.listTruong ?? [],
  );
  const [isTinhLai, setIsTinhLai] = useState<boolean>(false);
  useEffect(() => {
    if (Array.isArray(initialState?.currentUser?.roles)) {
      let arrObj = initialState?.currentUser?.roles.filter((item) => {
        return item.systemRole === initialState?.currentUser?.role?.systemRole;
      });
      setListTruong(arrObj?.[0]?.listTruong);
    }
  }, [initialState?.currentUser]);
  useEffect(() => {
    getDataLop();
    if (vaiTro === 'ChuTruong') {
      tinhLaiBaoCaoNoiBoThangChuTruong({
        truongId: organizationId,
        ngay: new Date().getDate(),
        thang: new Date().getMonth(),
        nam: new Date().getFullYear(),
      }).then(() => {
        setIsTinhLai(true);
      });
      tinhLaiBaoCaoNoiBoNgayChuTruong({
        truongId: organizationId,
        ngay: new Date().getDate(),
        thang: new Date().getMonth(),
        nam: new Date().getFullYear(),
      }).then(() => {
        setIsTinhLai(true);
      });
    } else {
      tinhLaiBaoCaoNoiBo({
        truongId: organizationId,
        ngay: new Date().getDate(),
        thang: new Date().getMonth(),
        nam: new Date().getFullYear(),
      }).then(() => {
        setIsTinhLai(true);
      });
      tinhLaiBaoCaoNoiBoThang({
        truongId: organizationId,
        // ngay: new Date().getDate(),
        thang: new Date().getMonth(),
        nam: new Date().getFullYear(),
      }).then(() => {
        setIsTinhLai(true);
      });
    }
  }, []);
  return (
    <div>
      <Tabs defaultActiveKey="1" onChange={onChange}>
        <Tabs.TabPane tab="Thống kê theo ngày" key="1">
          <ThongKeTheoNgay isTinhLai={isTinhLai} listTruong={listTruong} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Thống kê theo tháng" key="2">
          <ThongKeTheoThang isTinhLai={isTinhLai} listTruong={listTruong} />
        </Tabs.TabPane>
        {/*<Tabs.TabPane tab="Tài chính" key="3">*/}
        {/*  <ThongKeTaiChinh />*/}
        {/*</Tabs.TabPane>*/}
      </Tabs>
    </div>
  );
};
export default NoiBo;
