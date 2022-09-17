import { Card, Tabs } from 'antd';
import DiemDanhDauGio from '../index';

const DiemDanhDonCon = () => {
  return (
    <Card>
      <Tabs>
        <Tabs.TabPane tab="Điểm danh cuối giờ" key="1">
          <DiemDanhDauGio checkCuoiGio={true} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Điểm danh muộn" key="2">
          <DiemDanhDauGio checkMuon={true} />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default DiemDanhDonCon;
