import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Table,
} from 'antd';
import { useModel } from '@@/plugin-model/useModel';
import rules from '@/utils/rules';
import React, { useEffect, useState } from 'react';
import { IColumn } from '@/utils/interfaces';
import {
  EditOutlined,
  MinusCircleOutlined,
  PlusCircleFilled,
  PlusOutlined,
} from '@ant-design/icons';
import { addKhoanThu } from '@/services/KhoanThu/khoanthu';
const listKey = [
  {
    value: 'RADIUS_ATTENDANCE',
  },
  {
    value: 'RADIUS_SEARCH',
  },
  {
    value: 'SO_NGAY_HOC_TOI_DA_2_7',
  },
  {
    value: 'SO_NGAY_HOC_TOI_DA_2_6',
  },
  {
    value: 'TEAM_LIST',
  },
  {
    value: 'THONG_BAO_HOC_PHI',
  },
  {
    value: 'THONG_BAO_LUONG_THANG',
  },
  {
    value: 'MINUTES_ACTIVE_OTP',
  },
  {
    value: 'MINUTES_BEFORE_END',
  },
  {
    value: 'THOI_GIAN_TINH_DOANH_THU',
  },
  {
    value: 'SO_NGAY_LAM_VIEC',
  },
];
const FormAddCauHinh = () => {
  const { setUpCauHinh, getCauHinhModel, setVisibleForm, record } = useModel('quanlycauhinh');
  const [dataView, setDataView] = useState<Record<string, any>[]>([]);
  const [dataEdit, setDataEdit] = useState<any>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const onFinish = (values: any) => {
    if (Array.isArray(record?.value)) {
      values.value = dataView;
    }
    if (typeof record.value === 'object' && !Array.isArray(record?.value)) {
      let obj = {};
      dataView.map((val) => {
        Object.assign(obj, { [val.name]: val.data });
      });
      values.value = obj;
    }
    setUpCauHinh(values).then(() => {
      message.success('Sửa thành công');
      getCauHinhModel();
      setVisibleForm(false);
    });
  };
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  useEffect(() => {
    if (typeof record.value === 'object') {
      const arrData: Record<string, any>[] = [];
      Object.keys(record.value).map((value) => {
        arrData.push({
          name: value,
          data: record.value[value],
        });
      });
      setDataView(arrData);
    }
    if (Array.isArray(record?.value)) {
      setDataView(record?.value);
    }
  }, [record]);
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
    },
    {
      title: 'Năm',
      // dataIndex: ['user', 'profile', 'fullname'],
      dataIndex: 'nam',
      align: 'center',
    },
    {
      title: 'Số ngày tối đa',
      dataIndex: 'soNgayToiDa',
      align: 'center',
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (val, recordVal) => {
        return (
          <Button
            type="primary"
            shape="circle"
            onClick={() => {
              setIsEdit(true);
              setDataEdit(recordVal);
              setIsModalVisible(true);
            }}
            title="Chỉnh sửa"
          >
            <EditOutlined />
          </Button>
        );
      },
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
  const onFinishEdit = (values: any) => {
    const arr = [...dataView];
    arr.forEach((value, i) => {
      if (value.thang === +values.thang && value.nam === +values.nam) {
        arr.splice(i, 1, {
          nam: +values.nam,
          thang: +values.thang,
          soNgayToiDa: +values.soNgayToiDa,
        });
      }
    });
    setDataView(arr);
    setIsModalVisible(false);
  };
  const onFinishAdd = (values: any) => {
    let isDuplicate = false;
    dataView.map((val) => {
      values.dataConfig.map((val2: { thang: any; nam: any }) => {
        if (+val.thang === +val2.thang && +val.nam === +val2.nam) {
          isDuplicate = true;
        }
      });
    });
    if (!isDuplicate) {
      values.dataConfig.map((val) => {
        dataView.unshift({ thang: +val.thang, nam: +val.nam, soNgayToiDa: +val.soNgayToiDa });
      });
      setIsModalVisible(false);
    } else {
      message.warn('Không được thêm data trùng với data trước đó');
    }
  };
  return (
    <>
      <Card bordered={false} title={'Chỉnh sửa'}>
        <Form
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Key"
            name="key"
            rules={[...rules.required]}
            initialValue={record?.key ?? 'THOI_GIAN_TINH_DOANH_THU'}
          >
            <Select disabled={true}>
              {listKey.map((val, i) => {
                return (
                  <Select.Option value={val.value} key={i}>
                    {val.value}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          {!Array.isArray(record?.value) && typeof record.value !== 'object' && (
            <Form.Item
              label="Value"
              name="value"
              rules={[...rules.required]}
              initialValue={record?.value ?? ''}
            >
              <Input />
            </Form.Item>
          )}

          <Form.Item label="Type" name="type" initialValue={'String'}>
            <Select onChange={handleChange} disabled={true}>
              <Select.Option value="String">String</Select.Option>
              <Select.Option value="Boolean">Boolean</Select.Option>
              <Select.Option value="Number">Number</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[...rules.required]}
            initialValue={record?.name ?? ''}
          >
            <Input />
          </Form.Item>
          {Array.isArray(record?.value) && (
            <>
              <Button
                style={{ marginBottom: '10px' }}
                onClick={() => {
                  setIsModalVisible(true);
                  setIsEdit(false);
                }}
                icon={<PlusCircleFilled />}
                type="primary"
              >
                Thêm mới
              </Button>
              <Table
                columns={columnsView}
                dataSource={dataView?.map((val: any, i: any) => {
                  return { ...val, index: i + 1 };
                })}
              />
            </>
          )}
          {typeof record.value === 'object' && !Array.isArray(record.value) && (
            <>
              <Button
                style={{ marginBottom: '10px' }}
                onClick={() => {
                  setIsModalVisible(true);
                  setIsEdit(false);
                }}
                icon={<PlusCircleFilled />}
                type="primary"
              >
                Thêm mới
              </Button>
              <Table
                columns={columnsDinamic}
                dataSource={dataView?.map((val: any, i: any) => {
                  return { ...val, index: i + 1 };
                })}
              />
            </>
          )}
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Modal
        title="Chỉnh sửa"
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setDataEdit(undefined);
        }}
        footer={null}
        key={dataEdit}
      >
        {isEdit ? (
          <Form onFinish={onFinishEdit}>
            <Form.Item
              label={'Tháng'}
              name={'thang'}
              rules={[...rules.required]}
              initialValue={dataEdit?.thang?.toString() ?? ''}
            >
              <Input disabled={isEdit} />
            </Form.Item>
            <Form.Item
              label={'Năm'}
              name={'nam'}
              rules={[...rules.required]}
              initialValue={dataEdit?.nam?.toString() ?? ''}
            >
              <Input disabled={isEdit} />
            </Form.Item>
            <Form.Item
              label={'Số ngày tối đa'}
              name={'soNgayToiDa'}
              rules={[...rules.required]}
              initialValue={dataEdit?.soNgayToiDa?.toString() ?? ''}
            >
              <Input />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                {isEdit ? 'Chỉnh sửa' : 'Thêm'}
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Form onFinish={onFinishAdd} labelCol={{ span: 24 }}>
            <Form.List name="dataConfig">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Row gutter={[20, 0]} align="middle" key={field.key}>
                      <Col lg={7} xs={24}>
                        <Form.Item
                          label="Tháng"
                          name={[index, 'thang']}
                          rules={[...rules.required]}
                          style={{ marginBottom: 5 }}
                        >
                          <Input placeholder="Nhập tháng" />
                        </Form.Item>
                      </Col>
                      <Col lg={7} xs={24}>
                        <Form.Item
                          label="Năm"
                          name={[index, 'nam']}
                          rules={[...rules.required]}
                          style={{ marginBottom: 5 }}
                        >
                          <Input placeholder="Nhập năm" />
                        </Form.Item>
                      </Col>
                      <Col lg={7} xs={24}>
                        <Form.Item
                          label="Số ngày tối đa"
                          name={[index, 'soNgayToiDa']}
                          rules={[...rules.required]}
                          style={{ marginBottom: 5 }}
                        >
                          <Input placeholder="Nhập số ngày tối đa" />
                        </Form.Item>
                      </Col>
                      <Col lg={3} xs={2}>
                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                      </Col>
                    </Row>
                  ))}
                  <Form.Item style={{ marginTop: 20 }}>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Thêm dữ liệu
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Form.Item>
              <Button type={'primary'} htmlType={'submit'}>
                Lưu
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};
export default FormAddCauHinh;
