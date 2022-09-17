import ChartCard from '@/pages/dashboard/analysis/components/Charts/ChartCard';
import { getDashboardUser } from '@/services/BaoCaoHeThong/baocaohethong';
import { Badge, Card, Col, Row, Table, Button, Select } from 'antd';
import { useEffect, useState } from 'react';
import BieuDoCot from './components/BieuDoCot';
import BieuDoDuong from './components/BieuDoDuong';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';
import FileDownload from 'js-file-download';
import moment from 'moment';

const BaoCaoHeThong = () => {
  const [dataUser, setDataUser] = useState<any>([]);
  const [tenTruong, setTenTruong] = useState(undefined);
  const [danhSachTruong, setDanhSachTruong] = useState([]);
  const [danhSachTruongOld, setDanhSachTruongOld] = useState([]);
  const [danhSachDonVi, setDanhSachDonVi] = useState([]);

  const getUser = async () => {
    const result = await getDashboardUser();
    setDataUser(result?.data?.data);
  };

  const gettruong = async () => {
    const result = await axios.get(`${ip3}/don-vi/pageable?page=1&limit=1000`, {
      params: {
        cond: {
          loaiDonVi: 'Truong',
        },
      },
    });

    setDanhSachDonVi(result?.data?.data?.result);
  };

  const getDanhSachTruongBaoCao = async (payload) => {
    let response;
    if (payload) {
      response = await axios.get(`${ip3}/bao-cao-noi-bo`, { params: payload });
    } else {
      response = await axios.get(`${ip3}/bao-cao-noi-bo`);
    }
    let tmp = response?.data?.data?.filter((item) => item && item !== null && item.length > 0);
    let arr = [];
    tmp.map((item) => {
      item?.map((e) => {
        arr = arr.concat(e);
      });
    });
    arr = arr.map((item, index) => ({
      ...item,
      index: index + 1,
    }));
    setDanhSachTruong(arr);
    setDanhSachTruongOld(arr);
  };

  useEffect(() => {
    getUser();
    getDanhSachTruongBaoCao();
    gettruong();
  }, []);
  let dataTruong = danhSachTruong;
  if (tenTruong) {
    dataTruong = danhSachTruong.filter((item) => item?.tenTruong === tenTruong);
  }
  return (
    <>
      <div>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12} xl={8}>
            <ChartCard
              title={<div style={{ color: 'black', fontWeight: 'bold' }}>Tổng số tài khoản</div>}
              bordered
              total={<p style={{ fontSize: 30 }}>{dataUser?.tongSoTaiKhoan ?? 0}</p>}
              contentHeight={70}
            >
              <Badge color="purple" text={`Số hiệu trưởng: ${dataUser?.hieuTruong ?? 0}`} /> <br />
              <Badge color="green" text={`Số giáo viên: ${dataUser?.giaoVien ?? 0} `} />
              <br />
              <Badge color="blue" text={`Số phụ huynh: ${dataUser?.phuHuynh ?? 0} `} />
            </ChartCard>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <ChartCard
              title={
                <div style={{ color: 'black', fontWeight: 'bold' }}>Tổng số tài khoản theo gói</div>
              }
              bordered
              total={<p style={{ fontSize: 30 }}>{123}</p>}
              contentHeight={70}
            >
              <Badge color="purple" text={`Gói vip: 0`} /> <br />
              <Badge color="green" text={`Gói pro: 0 `} />
              <br />
              <Badge color="blue" text={`Gói thường: 0 `} />
            </ChartCard>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <ChartCard
              title={
                <div style={{ color: 'black', fontWeight: 'bold' }}>
                  Tổng số tài khoản TT qua hệ thống
                </div>
              }
              bordered
              total={<p style={{ fontSize: 30 }}>{123}</p>}
              contentHeight={70}
            >
              <Badge color="purple" text={`Số hiệu trưởng: 0`} /> <br />
              <Badge color="green" text={`Số giáo viên: 0 `} />
              <br />
              <Badge color="blue" text={`Số phụ huynh: 0 `} />
            </ChartCard>
          </Col>
        </Row>
        <br />
        <Row gutter={[20, 0]}>
          <Col lg={12} xs={24}>
            <Card>
              {/*<BieuDoCot />*/}
            </Card>
          </Col>
          <Col lg={12} xs={24}>
            <Card>
              {/*<BieuDoDuong />*/}
            </Card>
          </Col>
        </Row>
        <div style={{ display: 'flex' }}>
          <Button
            type="primary"
            onClick={async () => {
              const response = await axios.get(`${ip3}/bao-cao-noi-bo/export`, {
                responseType: 'arraybuffer',
              });

              FileDownload(response.data, `BaoCaoHeThong.xlsx`);
            }}
            style={{ marginTop: 15, marginRight: 15 }}
          >
            Xuất dữ liệu
          </Button>
          <Select
            placeholder="Danh sách trường"
            style={{ marginTop: 15, width: 300 }}
            allowClear
            onChange={async (value, option) => {
              let tenDonVi = option?.obj?.tenDonVi;
              if (tenDonVi) {
                setTenTruong(tenDonVi);
              } else {
                setTenTruong(undefined);
              }
            }}
          >
            {danhSachDonVi.map((item) => (
              <Select.Option value={item?._id} obj={item}>
                {item?.tenDonVi}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="Chọn thời gian"
            style={{ marginTop: 15, width: 300 }}
            allowClear
            onChange={async (value) => {
              if (value === 0) {
                getDanhSachTruongBaoCao(undefined);
              }
              if (value === 1) {
                getDanhSachTruongBaoCao({
                  ngayBatDau: moment().subtract(1, 'days').toISOString(),
                  ngayKetThuc: moment().subtract(1, 'days').toISOString(),
                });
              }
              if (value === 2) {
                const ngayKetThuc = moment();
                const ngayBatDau = moment().subtract(30, 'days');
                getDanhSachTruongBaoCao({
                  ngayBatDau: ngayBatDau.toISOString(),
                  ngayKetThuc: ngayKetThuc.toISOString(),
                });
              }
            }}
          >
            <Select.Option value={0}>Tất cả</Select.Option>
            <Select.Option value={1}>Một ngày trước</Select.Option>
            <Select.Option value={2}>30 ngày trước</Select.Option>
          </Select>
        </div>
        <Table
          bordered
          columns={[
            {
              title: 'STT',
              width: 80,
              dataIndex: 'index',
              align: 'center',
            },
            {
              title: 'Tên trường',
              align: 'center',
              dataIndex: 'tenTruong',
              width: 200,
            },
            {
              title: 'Tên lớp',
              align: 'center',
              dataIndex: 'tenLop',
              width: 200,
            },
            {
              title: 'Tổng số học sinh',
              align: 'center',
              dataIndex: 'sySo',
              width: 150,
            },
            {
              title: 'Số học sinh đóng tiền qua trường',
              align: 'center',
              dataIndex: 'soHocSinhDongTienQuaTruong',
              width: 180,
            },
            {
              title: 'Số học sinh đóng tiền qua ngân hàng',
              align: 'center',
              dataIndex: 'soHocSinhDongTienQuaNganHang',
              width: 180,
            },
          ]}
          dataSource={dataTruong}
          summary={(pageData) => {
            let tongSoHS = 0;
            let tongSoTruong = 0;
            let tongSoNganHang = 0;
            pageData?.map((item) => {
              tongSoHS += item?.sySo;
              tongSoTruong += item?.soHocSinhDongTienQuaTruong;
              tongSoNganHang += item?.soHocSinhDongTienQuaNganHang;
            });
            return (
              <>
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3}>
                      <center>
                        <b>Tổng số</b>
                      </center>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={3}>
                      <center>
                        <b>{tongSoHS} hs</b>
                      </center>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={4}>
                      <center>
                        <b>{tongSoTruong} hs</b>
                      </center>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={5}>
                      <center>
                        <b>{tongSoNganHang} hs</b>
                      </center>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              </>
            );
          }}
        />
      </div>
    </>
  );
};

export default BaoCaoHeThong;
