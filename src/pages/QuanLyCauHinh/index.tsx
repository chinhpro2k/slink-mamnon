import { Button, Card, Divider, Input, Modal, Table } from 'antd';
import TableBase from '@/components/Table';
import React, { useState } from 'react';
import { useModel } from '@@/plugin-model/useModel';
import { IColumn } from '@/utils/interfaces';
import FormAddCauHinh from '@/pages/QuanLyCauHinh/components/formAddCauHinh';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';

const QuanLyCauHinh = () => {
  const { getCauHinhModel, page, loading, limit, cond, total, setRecord, setVisibleForm } =
    useModel('quanlycauhinh');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataView, setDataView] = useState<Record<string, any>[]>([]);
  const [isDynamic, setIsDinamic] = useState<boolean>(false);
  const renderDataObject = (val: any) => {
    return (
      <Button
        type="default"
        shape="circle"
        onClick={() => {
          setIsModalVisible(true);
          setIsDinamic(true);
          const arrData: Record<string, any>[] = [];
          Object.keys(val).map((value) => {
            arrData.push({
              name: value,
              data: val[value],
            });
          });
          setDataView(arrData);
        }}
        title="Xem chi tiết object"
      >
        <EyeOutlined />
      </Button>
    );
  };
  const renderLast1 = (recordVal: any) => {
    return (
      <React.Fragment>
        <>
          {/*{Array.isArray(recordVal.value) ? (*/}
          {/*  <Button*/}
          {/*    type="default"*/}
          {/*    shape="circle"*/}
          {/*    onClick={() => {*/}
          {/*      setRecord({ ...recordVal });*/}
          {/*      setDataView(recordVal.value);*/}
          {/*      setIsModalVisible(true);*/}
          {/*      setIsDinamic(false);*/}
          {/*    }}*/}
          {/*    title="Xem chi tiết"*/}
          {/*  >*/}
          {/*    <EyeOutlined />*/}
          {/*  </Button>*/}
          {/*) : (*/}
          {/*  // <span>{recordVal?.value.toString()}{typeof recordVal.value}</span>*/}

          {/*  // renderDataObject(recordVal.value)*/}
          {/*  <>*/}
          {/*    {typeof recordVal.value === 'object' ? (*/}
          {/*      <span>{renderDataObject(recordVal?.value)}</span>*/}
          {/*    ) : (*/}
          {/*      <span>{recordVal?.value.toString()}</span>*/}
          {/*    )}*/}
          {/*  </>*/}
          {/*)}*/}
          {/*<Divider type={'vertical'} />*/}
          <Button
            type="primary"
            shape="circle"
            onClick={() => {
              setVisibleForm(true);
              setRecord(recordVal);
            }}
            title="Chỉnh sửa"
          >
            <EditOutlined />
          </Button>
        </>
      </React.Fragment>
    );
  };
  const columns: IColumn<any>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 60,
    },
    {
      title: 'Key',
      dataIndex: 'key',
      align: 'center',
      width: 170,
    },
    {
      title: 'Tên',
      // dataIndex: ['user', 'profile', 'fullname'],
      dataIndex: 'name',
      align: 'center',
      width: 170,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      align: 'center',
      width: 150,
      render: (val, recordVal) => {
        if (Array.isArray(val)) {
          return (
            <>
              <Button
                type="default"
                shape="circle"
                onClick={() => {
                  setRecord({ ...recordVal });
                  setDataView(recordVal.value);
                  setIsModalVisible(true);
                }}
                title="Xem chi tiết"
              >
                <EyeOutlined />
              </Button>
            </>
          );
        } else {
          if (typeof val==='object'){
            return (
              <>
                  <span>{renderDataObject(recordVal?.value)}</span>
              </>
            )
          }else
          return val;
        }
      },
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 150,
      render: (val, recordVal) => renderLast1(recordVal),
    },
  ];
  const columnsView: IColumn<any>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 60,
    },
    {
      title: 'Tháng',
      dataIndex: 'thang',
      align: 'center',
      width: 170,
    },
    {
      title: 'Năm',
      // dataIndex: ['user', 'profile', 'fullname'],
      dataIndex: 'nam',
      align: 'center',
      width: 170,
    },
    {
      title: 'Số ngày tối đa',
      dataIndex: 'soNgayToiDa',
      align: 'center',
      width: 150,
    },
    // {
    //   title: 'Số ngày học thực tế',
    //   dataIndex: 'soNgayHocThucTe',
    //   align: 'center',
    //   width: 150,
    // },
    // {
    //   title: 'Số ngày học dự kiến',
    //   dataIndex: 'soNgayHocDuKien',
    //   align: 'center',
    //   width: 150,
    // },
  ];
  const columnsDinamic: IColumn<any>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 60,
    },
    {
      title: 'Type',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: 'Value',
      dataIndex: 'data',
      align: 'center',
      render: (value) => value?.toString(),
    },
  ];
  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <>
      <Card bordered={false} title={'Quản lý cấu hình'}>
        <TableBase
          border
          columns={columns}
          getData={() => getCauHinhModel()}
          dependencies={[page, limit, cond]}
          loading={loading}
          Form={FormAddCauHinh}
          modelName="quanlycauhinh"
          hascreate={false}
          formType="Drawer"
          widthDrawer={'60%'}
        >
          <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
            Tổng số:
            <Input
              style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
              value={total}
            />
          </h3>
        </TableBase>
      </Card>
      <Modal
        title="Thông tin chi tiết"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={'60%'}
      >
        {isDynamic ? (
          <Table
            columns={columnsDinamic}
            dataSource={dataView?.map((val: any, i: any) => {
              return { ...val, index: i + 1 };
            })}
          />
        ) : (
          <Table
            columns={columnsView}
            dataSource={dataView?.map((val: any, i: any) => {
              return { ...val, index: i + 1 };
            })}
          />
        )}
      </Modal>
    </>
  );
};
export default QuanLyCauHinh;
