/* eslint-disable no-underscore-dangle */
import { checkAllow } from '@/components/CheckAuthority';
import UploadFiles from '@/components/Upload/UploadFile';
import { importBangDinhDuong } from '@/services/DanhMucThucPham/danhmucthucpham';
import type { IColumn } from '@/utils/interfaces';
import { ExportOutlined } from '@ant-design/icons';
import { Button, Card, Form, message, Modal, Row, Select, Table, Tabs } from 'antd';
import React, { useState } from 'react';
import { useModel } from 'umi';

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

// Gộp các hàng 1->5 vào thành 1
const renderContent = (value: any, row: any, index: number) => {
  const obj: any = {
    children: `${value * 100}%`,
    props: {},
  };
  if (index === 0) {
    obj.props.rowSpan = 5;
  }
  if (index > 0 && index < 5) {
    obj.props.rowSpan = 0;
  }
  return obj;
};

const BangDinhDuong = () => {
  const [visibleModalAdd, setVisibleModalAdd] = useState<boolean>(false);
  const {
    getBangDinhDuongModel,
    dataBangDinhDuong2,
    dataBangDinhDuong3,
    dataBangDinhDuong4,
    dataBangDinhDuong5,
  } = useModel('danhmucthucpham');
  const [nhomTuoi, setNhomTuoi] = useState<number>(0);

  React.useEffect(() => {
    getBangDinhDuongModel();
  }, []);

  const onSubmit = async (values: any) => {
    const newVal = values;
    try {
      const result = await importBangDinhDuong({ ...newVal });
      if (result?.data?.statusCode === 201) {
        message.success('Import bảng dinh dưỡng thành công');
        setVisibleModalAdd(false);
        getBangDinhDuongModel();
        return true;
      }
    } catch (error) {
      const { response }: any = error;
      if (response?.data?.errorCode === 'INVALID_FORMAT') {
        message.error('Data import không đúng định dạng. Vui lòng thử lại sau');
        return false;
      }
    }
    return true;
  };

  const changeNhomTuoi = (val: number) => {
    setNhomTuoi(val);
  };

  const columns: IColumn<any>[] = [
    {
      title: 'Tiêu đề',
      dataIndex: 'bua',
      width: 120,
    },
    {
      title: 'Kcal tối thiểu/ngày',
      dataIndex: 'minMamNon',
      width: 120,
      render: (val, record) =>
        nhomTuoi === 0
          ? Number(record?.minMamNon ?? 0).toFixed(2)
          : Number(record?.minNhaTre ?? 0).toFixed(2),
      align: 'center',
    },
    {
      title: 'Kcal tối đa/ngày',
      dataIndex: 'maxMamNon',
      width: 120,
      render: (val, record) =>
        nhomTuoi === 0
          ? Number(record?.maxMamNon ?? 0).toFixed(2)
          : Number(record?.maxNhaTre ?? 0).toFixed(2),
      align: 'center',
    },
    {
      title: 'Chất đạm (Protit) tối thiểu',
      dataIndex: nhomTuoi === 0 ? ['dinhDuong', 0, 'minMamNon'] : ['dinhDuong', 0, 'minNhaTre'],
      align: 'center',
      width: 120,
      render: renderContent,
    },
    {
      title: 'Chất đạm (Protit) tối đa',
      dataIndex: nhomTuoi === 0 ? ['dinhDuong', 0, 'maxMamNon'] : ['dinhDuong', 0, 'maxNhaTre'],
      align: 'center',
      width: 120,
      render: renderContent,
    },
    {
      title: 'Chất béo (Lipit) tối thiểu',
      dataIndex: nhomTuoi === 0 ? ['dinhDuong', 1, 'minMamNon'] : ['dinhDuong', 1, 'minNhaTre'],
      align: 'center',
      width: 120,
      render: renderContent,
    },
    {
      title: 'Chất béo (Lipit) tối đa',
      dataIndex: nhomTuoi === 0 ? ['dinhDuong', 1, 'maxMamNon'] : ['dinhDuong', 1, 'maxNhaTre'],
      align: 'center',
      width: 120,
      render: renderContent,
    },
    {
      title: 'Chất bột (Gluxit) tối thiểu',
      dataIndex: nhomTuoi === 0 ? ['dinhDuong', 2, 'minMamNon'] : ['dinhDuong', 2, 'minNhaTre'],
      align: 'center',
      width: 120,
      render: renderContent,
    },
    {
      title: 'Chất bột (Gluxit) tối đa',
      dataIndex: nhomTuoi === 0 ? ['dinhDuong', 2, 'maxMamNon'] : ['dinhDuong', 2, 'maxNhaTre'],
      align: 'center',
      width: 120,
      render: renderContent,
    },
  ];

  return (
    <Card title="Bảng dinh dưỡng">
      {checkAllow('IMPORT_BANG_DINH_DUONG') && (
        <Button
          style={{ marginBottom: '10px', marginRight: '10px' }}
          onClick={() => {
            setVisibleModalAdd(true);
          }}
          type="primary"
        >
          <ExportOutlined />
          Import file
        </Button>
      )}

      <Select placeholder="Chọn nhóm tuổi" onChange={changeNhomTuoi} defaultValue={nhomTuoi}>
        <Select.Option value={0}>Mẫu giáo</Select.Option>
        <Select.Option value={1}>Nhà trẻ</Select.Option>
      </Select>

      <Tabs defaultActiveKey="2" type="card">
        {nhomTuoi === 0 && (
          <Tabs.TabPane tab="02 BỮA" key="2">
            <Table dataSource={dataBangDinhDuong2} columns={columns} bordered pagination={false} />
          </Tabs.TabPane>
        )}
        <Tabs.TabPane tab="03 BỮA" key="3">
          <Table dataSource={dataBangDinhDuong3} columns={columns} bordered pagination={false} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="04 BỮA" key="4">
          <Table dataSource={dataBangDinhDuong4} columns={columns} bordered pagination={false} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="05 BỮA" key="5">
          <Table dataSource={dataBangDinhDuong5} columns={columns} bordered pagination={false} />
        </Tabs.TabPane>
      </Tabs>
      <Modal
        title="Import bảng dinh dưỡng"
        visible={visibleModalAdd}
        onCancel={() => {
          setVisibleModalAdd(false);
        }}
        footer={[]}
        destroyOnClose
      >
        <Form onFinish={onSubmit} {...formItemLayout}>
          <Form.Item name="file">
            <UploadFiles />
          </Form.Item>
          <Row justify="center">
            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit">
                Tải lên
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </Card>
  );
};
export default BangDinhDuong;
