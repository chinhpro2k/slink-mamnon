/* eslint-disable react-hooks/exhaustive-deps */
import type { DonViHanhChinh as IDonViHanhChinh } from '@/services/DonViHanhChinh';
import rules from '@/utils/rules';
import { includes } from '@/utils/utils';
import { Col, Form, Input, InputNumber, Row, Select } from 'antd';
import type { FormInstance } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

type Props = {
  disabled?: boolean;
  form?: FormInstance<any>;
  hideTinh?: boolean;
  hideQuanHuyen?: boolean;
  hideXaPhuong?: boolean;
  hideDiaChiCuThe?: boolean;
  notRequiredTinh?: boolean;
  notRequiredQuanHuyen?: boolean;
  notRequiredXaPhuong?: boolean;
  notRequiredDiaChiCuThe?: boolean;
  fields: {
    tinh: string[];
    quanHuyen: string[];
    xaPhuong: string[];
    diaChiCuThe: string[];
    lat: number | string[];
    long: number | string[];
  };
  initialValue?: IDonViHanhChinh.Record;
  setTen?: {
    setTenTinh?: any;
    setTenQuanHuyen?: any;
    setTenXaPhuong?: any;
  };
};

const DiaChi = (props: Props) => {
  const {
    danhSachQuanHuyen,
    danhSachTinhTP,
    danhSachXaPhuong,
    setDanhSachXaPhuong,
    getDanhSachQuanHuyenModel,
    getDanhSachTinhModel,
    getDanhSachXaPhuongModel,
    setTenTinh,
    setTenXaPhuong,
    setTenQuanHuyen,
    loading,
  } = useModel('donvihanhchinh');

  const { typeForm } = useModel('truong');
  const add = typeForm === 'add';

  const [maQuanHuyen, setMaQuanHuyen] = useState<string | undefined>(
    props?.initialValue?.maQuanHuyen,
  );
  const [dataInit, setDataInit] = useState<any>();
  const [maTinh, setMaTinh] = useState<string | undefined>(props?.initialValue?.maTinh);
  const [maPhuongXa, setMaPhuongXa] = useState<string | undefined>(props?.initialValue?.maPhuongXa);

  useEffect(() => {
    getDanhSachTinhModel();
  }, []);

  useEffect(() => {
    if (maTinh) {
      getDanhSachQuanHuyenModel(maTinh);
    }
  }, [maTinh]);

  useEffect(() => {
    if (maQuanHuyen) {
      getDanhSachXaPhuongModel(maQuanHuyen);
    }
  }, [maQuanHuyen]);
  useEffect(() => {
    console.log('init', props?.initialValue);
    setDataInit(props?.initialValue);
    // props.form.setFieldsValue({
    //   [props?.fields?.lat[0]]: {
    //     [props?.fields?.lat[1]]: props?.initialValue?.lat,
    //     [props?.fields?.long[1]]: props?.initialValue?.long,
    //     [props?.fields?.diaChiCuThe[1]]: props?.initialValue?.soNhaTenDuong,
    //     [props?.fields?.xaPhuong[1]]: maPhuongXa,
    //     [props?.fields?.quanHuyen[1]]: maQuanHuyen,
    //     [props?.fields?.tinh[1]]: maTinh,
    //   },
    //
    //   // [props?.fields?.lat[0]]: props?.initialValue?.lat,
    //   // [`${props?.fields?.long}`]: props?.initialValue?.long,
    // });
  }, [props?.initialValue]);
  return (
    <Row gutter={[20, 0]}>
      <Col xs={24} md={24} lg={8}>
        <Form.Item
          initialValue={maTinh}
          name={props?.fields?.tinh ?? []}
          rules={[...rules.required]}
          style={{ marginBottom: 0 }}
        >
          <Select
            disabled={props?.disabled}
            loading={loading}
            value={maTinh}
            onChange={async (val: string) => {
              setTenTinh(danhSachTinhTP?.find((item: any) => item.ma === val)?.tenDonVi);
              props.setTen?.setTenTinh(
                danhSachTinhTP?.find((item: any) => item.ma === val)?.tenDonVi,
              );
              if (val !== maTinh) {
                await setMaQuanHuyen(undefined);
                setMaPhuongXa(undefined);
              }
              setMaTinh(val);
              setDanhSachXaPhuong([]);
              // props.form.resetFields([props.fields.quanHuyen, props.fields.xaPhuong]);
            }}
            allowClear
            showSearch
            placeholder="Thành phố/Tỉnh"
            optionFilterProp="children"
            filterOption={(value, option) => includes(option?.props.children, value)}
          >
            {danhSachTinhTP?.map((item: any) => (
              <Select.Option value={item.ma} key={item.ma}>
                {item.tenDonVi}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col xs={24} md={12} lg={8}>
        <Form.Item
          initialValue={maQuanHuyen}
          name={props?.fields?.quanHuyen ?? []}
          rules={[...rules.required]}
          style={{ marginBottom: 0 }}
        >
          <Select
            disabled={props?.disabled}
            loading={loading}
            onChange={async (val: string) => {
              props.setTen?.setTenQuanHuyen(
                danhSachQuanHuyen.find((item: any) => item.ma === val)?.tenDonVi,
              );
              if (val !== maQuanHuyen) {
                await setMaPhuongXa(undefined);
              }
              setTenQuanHuyen(danhSachQuanHuyen.find((item: any) => item.ma === val)?.tenDonVi);
              setMaQuanHuyen(val);
              // props.form.resetFields([props.fields.xaPhuong]);
            }}
            onMouseEnter={async () => {
              if (add) return;
              // const maTinhCurrent = props.form.getFieldValue(props.fields.tinh);
              // if (maTinhCurrent) getDanhSachQuanHuyenModel(maTinhCurrent);
            }}
            showSearch
            allowClear
            placeholder="Quận/Huyện"
            optionFilterProp="children"
            filterOption={(value, option) => includes(option?.props.children, value)}
          >
            {danhSachQuanHuyen?.map((item: any) => (
              <Select.Option value={item.ma} key={item.ma}>
                {item.tenDonVi}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col xs={24} md={12} lg={8}>
        <Form.Item
          initialValue={maPhuongXa}
          name={props?.fields?.xaPhuong ?? []}
          rules={[...rules.required]}
          style={{ marginBottom: 0 }}
        >
          <Select
            disabled={props?.disabled}
            onMouseEnter={async () => {
              if (add) return;
              // const maQuanHuyenCurrent = props.form.getFieldValue(props.fields.quanHuyen);
              // if (maQuanHuyenCurrent) getDanhSachXaPhuongModel(maQuanHuyenCurrent);
            }}
            loading={loading}
            onChange={(val: string) => {
              props.setTen?.setTenXaPhuong(
                danhSachXaPhuong.find((item: any) => item.ma === val)?.tenDonVi,
              );
              setTenXaPhuong(danhSachXaPhuong.find((item: any) => item.ma === val)?.tenDonVi);
            }}
            showSearch
            allowClear
            placeholder="Xã/Phường"
            optionFilterProp="children"
            filterOption={(value, option) => includes(option?.props.children, value)}
          >
            {danhSachXaPhuong?.map((item: any) => (
              <Select.Option value={item.ma} key={item.ma}>
                {item.tenDonVi}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item
          initialValue={props?.initialValue?.soNhaTenDuong}
          rules={[...rules.required]}
          name={props?.fields?.diaChiCuThe ?? []}
          style={{ marginBottom: 0 }}
        >
          <Input.TextArea
            disabled={props?.disabled}
            maxLength={400}
            placeholder="Địa chỉ cụ thể"
            style={{ marginTop: 10 }}
          />
        </Form.Item>
      </Col>
      <Col xs={24} md={12} lg={8}>
        <Form.Item name={props?.fields?.lat ?? 0} initialValue={props?.initialValue?.lat ?? ''}>
          <InputNumber
            min={-90}
            max={90}
            style={{ marginTop: 10, width: '100%' }}
            placeholder="Latitude"
            disabled={props?.disabled}
          />
        </Form.Item>
      </Col>
      <Col xs={24} md={12} lg={8}>
        <Form.Item name={props?.fields?.long ?? 0} initialValue={props?.initialValue?.long ?? ''}>
          <InputNumber
            min={-180}
            max={180}
            style={{ marginTop: 10, width: '100%' }}
            placeholder="Longitude"
            disabled={props?.disabled}
          />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default DiaChi;
