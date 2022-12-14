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
              title={<div style={{ color: 'black', fontWeight: 'bold' }}>T???ng s??? t??i kho???n</div>}
              bordered
              total={<p style={{ fontSize: 30 }}>{dataUser?.tongSoTaiKhoan ?? 0}</p>}
              contentHeight={70}
            >
              <Badge color="purple" text={`S??? hi???u tr?????ng: ${dataUser?.hieuTruong ?? 0}`} /> <br />
              <Badge color="green" text={`S??? gi??o vi??n: ${dataUser?.giaoVien ?? 0} `} />
              <br />
              <Badge color="blue" text={`S??? ph??? huynh: ${dataUser?.phuHuynh ?? 0} `} />
            </ChartCard>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <ChartCard
              title={
                <div style={{ color: 'black', fontWeight: 'bold' }}>T???ng s??? t??i kho???n theo g??i</div>
              }
              bordered
              total={<p style={{ fontSize: 30 }}>{123}</p>}
              contentHeight={70}
            >
              <Badge color="purple" text={`G??i vip: 0`} /> <br />
              <Badge color="green" text={`G??i pro: 0 `} />
              <br />
              <Badge color="blue" text={`G??i th?????ng: 0 `} />
            </ChartCard>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <ChartCard
              title={
                <div style={{ color: 'black', fontWeight: 'bold' }}>
                  T???ng s??? t??i kho???n TT qua h??? th???ng
                </div>
              }
              bordered
              total={<p style={{ fontSize: 30 }}>{123}</p>}
              contentHeight={70}
            >
              <Badge color="purple" text={`S??? hi???u tr?????ng: 0`} /> <br />
              <Badge color="green" text={`S??? gi??o vi??n: 0 `} />
              <br />
              <Badge color="blue" text={`S??? ph??? huynh: 0 `} />
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
            Xu???t d??? li???u
          </Button>
          <Select
            placeholder="Danh s??ch tr?????ng"
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
            placeholder="Ch???n th???i gian"
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
            <Select.Option value={0}>T???t c???</Select.Option>
            <Select.Option value={1}>M???t ng??y tr?????c</Select.Option>
            <Select.Option value={2}>30 ng??y tr?????c</Select.Option>
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
              title: 'T??n tr?????ng',
              align: 'center',
              dataIndex: 'tenTruong',
              width: 200,
            },
            {
              title: 'T??n l???p',
              align: 'center',
              dataIndex: 'tenLop',
              width: 200,
            },
            {
              title: 'T???ng s??? h???c sinh',
              align: 'center',
              dataIndex: 'sySo',
              width: 150,
            },
            {
              title: 'S??? h???c sinh ????ng ti???n qua tr?????ng',
              align: 'center',
              dataIndex: 'soHocSinhDongTienQuaTruong',
              width: 180,
            },
            {
              title: 'S??? h???c sinh ????ng ti???n qua ng??n h??ng',
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
                        <b>T???ng s???</b>
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
