import { useEffect, useState } from 'react';
import moment from 'moment';
import { IMonthSelect } from '../../ThongBao/components/daySelect';
import { Button, Form, message, Modal, Select } from 'antd';
import styled from 'styled-components';
import { DataReq, ITrongMuon } from '@/services/TrongMuon';
import rules from '@/utils/rules';
import { useModel } from '@@/plugin-model/useModel';
const AddWrapper = styled.div`
  .list-month {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    max-width: 220px;
    margin-bottom: 8px;
    column-gap: 8px;
    row-gap: 8px;
  }
  .day-item {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 34px;
    height: 34px;
    margin-right: 8px;
    color: #80868b;
    font-weight: 500;
    font-size: 10px;
    background-color: #f1f3f4;
    border-radius: 50%;
    cursor: pointer;
  }
  //.day-item:hover {
  //  color: white;
  //  background-color: green;
  //}
  .active {
    color: white;
    background-color: green;
  }
  .activeHover {
    color: white;
    background-color: red;
  }
`;
const FormThemMoi = () => {
  const {
    getDataGiaoVienModel,
    getDataLopModel,
    dataGiaoVien,
    dataLop,
    createTrongMuonModel,
    getDataTrongMuon,
    setVisibleForm,
  } = useModel('trongmuon');
  const [dataMonth, setDataMonth] = useState<IMonthSelect[]>([]);
  const [monthSelect, setMonthSelect] = useState<number>(0);
  const [listMonthSelect, setListMonthSelect] = useState<number[]>([]);
  const [dayHover, setDayHover] = useState<number>(0);
  const [dataTrongMuon, setDataTrongMuon] = useState<ITrongMuon.DataChiTietTrongMuon[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { initialState } = useModel('@@initialState');
  const organizationId = initialState?.currentUser?.role?.organizationId;
  useEffect(() => {
    if (organizationId) {
      getDataGiaoVienModel(organizationId ?? '');
      getDataLopModel(organizationId ?? '');
    }
  }, [organizationId]);
  useEffect(() => {
    const arr: IMonthSelect[] = [];
    const currentMonth = moment().month();
    if ([1, 3, 5, 7, 8, 10, 12].includes(currentMonth)) {
      for (let i = 1; i <= 31; i++) {
        arr.push({
          title: i.toString(),
          value: i,
        });
      }
    }
    if ([4, 6, 9, 11].includes(currentMonth)) {
      for (let i = 1; i <= 30; i++) {
        arr.push({
          title: i.toString(),
          value: i,
        });
      }
    }
    if ([2].includes(currentMonth)) {
      for (let i = 1; i <= 28; i++) {
        arr.push({
          title: i.toString(),
          value: i,
        });
      }
    }
    setDataMonth(arr);
  }, []);
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  const handleChangeLop = (value: string[]) => {
    console.log(`selected ${value}`);
  };
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onChoseMonth = (value: number) => {
    if (value >= moment().date()) {
      setMonthSelect(value);
      showModal();
    } else {
      message.warn('Không chọn ngày nhỏ hơn hiện tại');
    }
  };
  const onFinish = (values: any) => {
    const obj: ITrongMuon.DataChiTietTrongMuon = {
      ngay: monthSelect,
      danhSachLopDangKyId: values?.listLop ?? [],
    };
    const arr = [...dataTrongMuon];
    arr.push(obj);
    setDataTrongMuon(arr);
    const arr2 = [...listMonthSelect];
    arr2.push(monthSelect);
    setListMonthSelect(arr2);
    handleCancel();
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const onFinishForm = (values: any) => {
    if (dataTrongMuon.length === 0) {
      message.warn('Vui lòng chọn ngày trông muộn!');
      return false;
    }
    const obj: ITrongMuon.DataReq = {
      chiTietTrongMuon: dataTrongMuon,
      truongId: organizationId ?? '',
      giaoVienId: values.giaoVienId,
      thang: moment().month(),
      nam: moment().year(),
    };
    createTrongMuonModel(obj).then(() => {
      message.success('Tạo thành công!');
      getDataTrongMuon();
      setVisibleForm(false);
    });
  };
  return (
    <AddWrapper>
      <Form onFinish={onFinishForm} onFinishFailed={onFinishFailed}>
        <div style={{ marginBottom: '16px' }}>
          <Form.Item name={'giaoVienId'} label={'Chọn giáo viên:'} rules={[...rules.required]}>
            <Select style={{ width: 250 }} onChange={handleChange}>
              {dataGiaoVien?.map((val) => {
                return <Select.Option value={val?.userId}>{val?.hoTen}</Select.Option>;
              })}
            </Select>
          </Form.Item>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="list-month" style={{ flexShrink: 0 }}>
            {dataMonth.map((value, i) => {
              return (
                <div
                  className={`day-item  ${
                    listMonthSelect.includes(value.value) && dayHover !== value.value
                      ? 'active'
                      : ''
                  }${dayHover === value.value ? 'activeHover' : ''}`}
                  key={i}
                  onClick={() => onChoseMonth(value.value)}
                  onMouseEnter={() => {
                    console.log('chinh');
                    setDayHover(value.value);
                  }}
                >
                  {value.title}
                </div>
              );
            })}
          </div>
          <div
            className="view-result"
            style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
          >
            {dataTrongMuon.map((val, i) => {
              if (val.ngay === dayHover) {
                return (
                  <div key={i}>
                    <p>
                      Ngày:<span style={{ fontWeight: 600 }}>{val.ngay}</span>
                    </p>
                    {dataLop.map((val2) => {
                      if (val.danhSachLopDangKyId.includes(val2?._id)) {
                        return <p>-{val2.tenDonVi}</p>;
                      } else return null;
                    })}
                  </div>
                );
              } else return null;
            })}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
          <Button type={'primary'} htmlType={'submit'}>
            Thêm mới
          </Button>
        </div>
      </Form>
      <Modal
        title="Thêm thông tin"
        visible={isModalVisible}
        footer={null}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <div>
          <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
            <p>
              Ngày: <span style={{ fontWeight: 600 }}>{monthSelect}</span>
            </p>
            <Form.Item
              name={'listLop'}
              label={'Chọn lớp:'}
              rules={[...rules.required]}
              initialValue={
                dataTrongMuon.filter((item) => {
                  return item.ngay === monthSelect;
                })?.[0]?.danhSachLopDangKyId ?? undefined
              }
            >
              <Select
                style={{ width: '100%' }}
                onChange={handleChangeLop}
                mode="multiple"
                allowClear
              >
                {dataLop?.map((val) => {
                  return <Select.Option value={val?._id}>{val?.tenDonVi}</Select.Option>;
                })}
              </Select>
            </Form.Item>
            <Form.Item>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                <Button type={'primary'} htmlType={'submit'}>
                  Lưu
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </AddWrapper>
  );
};
export default FormThemMoi;
