/* eslint-disable no-underscore-dangle */
import { checkAllow } from '@/components/CheckAuthority';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Divider, Drawer, Input, Popconfirm } from 'antd';
import type { ColumnProps } from 'antd/lib/table';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import TableBase from '../../components/Table/index';
import FormTemplate from './components/FormTemplate';
import TemplateCalendar from './components/TemplateCalendar';

const TemplateLichHoc = () => {
  const templateLich = useModel('templatelich');
  const [visibleTemplate, setVisibleTemplate] = useState(false);
  const [visibleCalendar, setVisibleCalendar] = useState(false);
  const [recordTemplate, setRecordTemplate] = useState(undefined);
  useEffect(() => {
    templateLich.getDonViLop();
  }, []);

  const renderLast = (record: any) => {
    return (
      <React.Fragment>
        <Button
          shape="circle"
          onClick={() => {
            setRecordTemplate(record);
            setVisibleCalendar(true);
            // handleView(record);
          }}
          type="primary"
          title="Xem template lịch"
          disabled={!checkAllow('VIEW_TEMPLATE')}
        >
          <EyeOutlined />
        </Button>
        <Divider type="vertical" />
        <Button
          shape="circle"
          onClick={() => {
            setRecordTemplate(record);
            setVisibleTemplate(true);
          }}
          title="Sửa template lịch"
          disabled={!checkAllow('EDIT_TEMPLATE')}
        >
          <EditOutlined />
        </Button>
        <Divider type="vertical" />
        <Popconfirm
          title="Bạn có muốn xóa"
          okText="Có"
          cancelText="Không"
          onConfirm={() => {
            templateLich.delTemplateModel(record);
          }}
          disabled={!checkAllow('DEL_TEMPLATE')}
        >
          <Button
            type="primary"
            shape="circle"
            onClick={() => {
              // handleView(record);
            }}
            title="Xóa template lịch"
            disabled={!checkAllow('DEL_TEMPLATE')}
          >
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      </React.Fragment>
    );
  };
  const columns: ColumnProps<any>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Tên template',
      dataIndex: 'ten',
      width: 300,
      align: 'center',
    },
    {
      title: 'Loại template',
      dataIndex: 'loai',
      width: 200,
      align: 'center',
    },
    {
      title: 'Lớp',
      dataIndex: 'donViId',
      // width: 300,
      align: 'center',
      render: (val) =>
        templateLich.danhSachLop?.filter(
          (item: { _id: string; tenDonVi: string }) => item?._id === val,
        )?.[0]?.tenDonVi,
    },
    // {
    //   title: 'Phương pháp học',
    //   dataIndex: 'lop',
    //   // width: 300,
    //   align: 'center',
    // },
    {
      title: 'Thao tác',
      align: 'center',
      render: (record: any) => renderLast(record),
      fixed: 'right',
      width: 200,
    },
  ];

  const handleAddTemplate = () => {
    setRecordTemplate(undefined);
    setVisibleTemplate(true);
  };

  const closeFormTemplate = (add = 0, record = undefined) => {
    setRecordTemplate(undefined);
    if (add === 1) {
      setRecordTemplate(record);
      setVisibleCalendar(true);
    }
    setVisibleTemplate(false);
  };

  const closeCalendar = () => {
    setRecordTemplate(undefined);
    setVisibleCalendar(false);
  };

  return (
    <>
      <TableBase
        border
        columns={columns}
        getData={templateLich.getTemplateLich}
        loading={templateLich.loading}
        dependencies={[templateLich.page, templateLich.limit, templateLich.cond]}
        modelName="templatelich"
        title="Template lịch học"
      >
        {checkAllow('ADD_TEMPLATE') && (
          <Button type="primary" onClick={handleAddTemplate}>
            Thêm mới
          </Button>
        )}
        <h3 style={{ display: 'inline-block', margin: '0 10px 10px 50px', float: 'right' }}>
          Tổng số:
          <Input
            style={{ width: '90px', fontWeight: 700, fontSize: 18, marginLeft: 10 }}
            value={templateLich.total}
          />
        </h3>
      </TableBase>
      <Drawer
        visible={visibleTemplate}
        width="25%"
        onClose={() => {
          closeFormTemplate();
        }}
        destroyOnClose
      >
        <FormTemplate record={recordTemplate} closeFormTemplate={closeFormTemplate} />
      </Drawer>
      <Drawer
        visible={visibleCalendar}
        width="80%"
        destroyOnClose
        onClose={() => {
          closeCalendar();
        }}
      >
        <TemplateCalendar template={recordTemplate} />
      </Drawer>
    </>
  );
};

export default TemplateLichHoc;
