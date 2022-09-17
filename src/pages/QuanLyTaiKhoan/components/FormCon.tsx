/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import rules from '@/utils/rules';
import { Col, DatePicker, Form, Input, InputNumber, Radio, Row, Select } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import {checkAllow} from "@/components/CheckAuthority";

const nhomMau = [
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'O', value: 'O' },
  { label: 'AB', value: 'AB' },
];

const checkRadio = [
  { label: 'Có', value: true },
  { label: 'Không', value: false },
];
const coThe = [
  { label: 'Bình thường', value: 'Bình thường' },
  { label: 'Suy dinh dưỡng', value: 'Suy dinh dưỡng' },
  { label: 'Béo phì', value: 'Béo phì' },
  { label: 'Thừa cân', value: 'Thừa cân' },
];

const FormTaiKhoanPhuHuynh = (props: {
  form?: any;
  edit?: boolean;
  disable?: boolean;
  record?: any;
}) => {
  const [coBenhVeMat, setCoBenhVeMat] = useState(false);
  const [coBenhVeMui, setCoBenhVeMui] = useState(false);
  const [coBenhVeTai, setCoBenhVeTai] = useState(false);
  const [coBenhVeDa, setCoBenhVeDa] = useState(false);
  const [coCheDoDacBiet, setCoCheDoDacBiet] = useState(false);
  useEffect(() => {
    console.log("record",props.record)
    setCoBenhVeMat(props.record?.benhVeMat ?? false);
    setCoBenhVeMui(props.record?.benhVeMui ?? false);
    setCoBenhVeTai(props.record?.benhVeTai ?? false);
    setCoBenhVeDa(props.record?.benhNgoaiDa ?? false);
    setCoCheDoDacBiet(props.record?.cheDoAnDacBiet ?? false);
  }, [props.record]);
  return (
    <>
       <Row gutter={[16, 0]}>
         <Col xl={12} md={12} sm={24}>
           <Form.Item
             name="hoTen"
             rules={[...rules.ten, ...rules.required]}
             style={{ marginBottom: 5 }}
             label="Họ và tên con"
             initialValue={props.edit ? props?.record?.hoTen : undefined}
           >
             <Input placeholder="Nhập họ và tên con" disabled={props.disable} />
           </Form.Item>
         </Col>
         <Col xl={12} md={12} sm={24}>
           <Form.Item
             name="gioiTinh"
             style={{ marginBottom: 5 }}
             label="Giới tính"
             initialValue={props.edit ? props?.record?.gioiTinh : undefined}
           >
             <Select placeholder="Chọn giới tính">
               {/*disabled={props.disable}*/}
               <Select.Option value="Male">Nam</Select.Option>
               <Select.Option value="Female">Nữ</Select.Option>
             </Select>
           </Form.Item>
         </Col>
         <Col xl={12} md={12} sm={24}>
           <Form.Item
             name="ngaySinh"
             style={{ marginBottom: 5 }}
             label="Ngày sinh"
             rules={[...rules.truocHomNay]}
             initialValue={
               props.edit && props?.record?.namSinh
                 ? moment(
                   new Date(
                     props?.record?.namSinh,
                     props?.record?.thangSinh - 1,
                     props?.record?.ngaySinh,
                   ),
                 )
                 : moment()
             }
           >
             <DatePicker
               style={{ width: '100%' }}
               placeholder="Chọn ngày sinh"
               format="DD-MM-YYYY"
               // disabled={props.disable}
             />
           </Form.Item>
         </Col>

         <Col xl={12} md={12} sm={24}>
           <Form.Item
             name="nhomMau"
             style={{ marginBottom: 5 }}
             label="Nhóm máu"
             initialValue={props.edit ? props.record?.nhomMau : undefined}
           >
             <Select placeholder="Chọn nhóm máu"
               //disabled={props.disable}
             >
               {nhomMau?.map((item) => (
                 <Select.Option value={item?.value}>{item?.label}</Select.Option>
               ))}
             </Select>
           </Form.Item>
         </Col>
         <Col xl={12} md={12} sm={24}>
           <Form.Item
             name="chieuCao"
             // rules={[...rules.float(250, 100)]}
             // rules={[...rules.required]}
             style={{ marginBottom: 5 }}
             label="Chiều cao"
             initialValue={props.edit ? props.record?.chieuCao : undefined}
           >
             <InputNumber
               placeholder="Đơn vị (cm)"
               // disabled={props.disable}
               style={{ width: '100%' }}
             />
           </Form.Item>
         </Col>
         <Col xl={12} md={12} sm={24}>
           <Form.Item
             name="canNang"
             rules={[...rules.float(undefined, 1, 1)]}
             style={{ marginBottom: 5 }}
             label="Cân nặng"
             initialValue={props.edit ? props.record?.canNang : undefined}
           >
             <InputNumber
               placeholder="Đơn vị (kg)"
               // disabled={props.disable}
               style={{ width: '100%' }}
             />
           </Form.Item>
         </Col>
         <Col xl={12} md={12} sm={24}>
           <Form.Item
             name="bietDanh"
             style={{ marginBottom: 5 }}
             label="Biệt danh"
             initialValue={props.edit ? props?.record?.bietDanh : undefined}
           >
             <Input placeholder="Nhập biệt danh"  />
           </Form.Item>
         </Col>
         <Col xl={12} md={12} sm={24}>
           <Form.Item
             name="maHocSinh"
             style={{ marginBottom: 5 }}
             label="Mã học sinh"
             initialValue={props.edit ? props?.record?.maHocSinh : undefined}
           >
             <Input placeholder="Nhập mã học sinh"  />
           </Form.Item>
         </Col>
       </Row>
       <Form.Item
         name="benhVeMat"
         style={{ marginBottom: 5 }}
         label="Bệnh về mắt"
         initialValue={props.edit ? props.record?.benhVeMat : undefined}
       >
         <Radio.Group
           // disabled={props.disable}
           onChange={(e) => setCoBenhVeMat(e.target.value)}>
           {checkRadio?.map((item) => (
             <Radio value={item?.value}>{item?.label}</Radio>
           ))}
         </Radio.Group>
       </Form.Item>
       {coBenhVeMat && (
         <Form.Item
           name="ghiChuBenhVeMat"
           style={{ marginBottom: 5 }}
           label="Ghi chú bệnh về mắt"
           initialValue={props.edit ? props.record?.ghiChuBenhVeMat : undefined}
         >
           <Input.TextArea />
         </Form.Item>
       )}

       <Form.Item
         name="benhVeMui"
         style={{ marginBottom: 5 }}
         label="Bệnh về mũi"
         initialValue={props.edit ? props.record?.benhVeMui : undefined}
       >
         <Radio.Group
           // disabled={props.disable}
           onChange={(e) => setCoBenhVeMui(e.target.value)}>
           {checkRadio?.map((item) => (
             <Radio value={item?.value}>{item?.label}</Radio>
           ))}
         </Radio.Group>
       </Form.Item>
       {coBenhVeMui && (
         <Form.Item
           name="ghiChuBenhVeMui"
           style={{ marginBottom: 5 }}
           label="Ghi chú bệnh về mũi"
           initialValue={props.edit ? props.record?.ghiChuBenhVeMui : undefined}
         >
           <Input.TextArea />
         </Form.Item>
       )}
       <Form.Item
         name="benhVeTai"
         style={{ marginBottom: 5 }}
         label="Bệnh về tai"
         initialValue={props.edit ? props.record?.benhVeTai : undefined}
       >
         <Radio.Group
           // disabled={props.disable}
           onChange={(e) => setCoBenhVeTai(e.target.value)}>
           {checkRadio?.map((item) => (
             <Radio value={item?.value}>{item?.label}</Radio>
           ))}
         </Radio.Group>
       </Form.Item>
       {coBenhVeTai && (
         <Form.Item
           name="ghiChuBenhVeTai"
           style={{ marginBottom: 5 }}
           label="Ghi chú bệnh về tai"
           initialValue={props.edit ? props.record?.ghiChuBenhVeTai : undefined}
         >
           <Input.TextArea />
         </Form.Item>
       )}
       <Form.Item
         name="benhNgoaiDa"
         style={{ marginBottom: 5 }}
         label="Bệnh ngoài da"
         initialValue={props.edit ? props.record?.benhNgoaiDa : undefined}
       >
         <Radio.Group
           // disabled={props.disable}
           onChange={(e) => setCoBenhVeDa(e.target.value)}>
           {checkRadio?.map((item) => (
             <Radio value={item?.value}>{item?.label}</Radio>
           ))}
         </Radio.Group>
       </Form.Item>
       {coBenhVeDa && (
         <Form.Item
           name="ghiChuBenhNgoaiDa"
           style={{ marginBottom: 5 }}
           label="Ghi chú bệnh ngoài da"
           initialValue={props.edit ? props.record?.ghiChuBenhNgoaiDa : undefined}
         >
           <Input.TextArea />
         </Form.Item>
       )}
       <Form.Item
         name="cheDoAnDacBiet"
         style={{ marginBottom: 5 }}
         label="Chế độ ăn đặc biệt"
         initialValue={props.edit ? props.record?.cheDoAnDacBiet : undefined}
       >
         <Radio.Group
           // disabled={props.disable}
           onChange={(e) => setCoCheDoDacBiet(e.target.value)}>
           {checkRadio?.map((item) => (
             <Radio value={item?.value}>{item?.label}</Radio>
           ))}
         </Radio.Group>
       </Form.Item>
       {coCheDoDacBiet && (
         <Form.Item
           name="ghiChuCheDoAn"
           style={{ marginBottom: 5 }}
           label="Ghi chú chế độ ăn đặc biệt"
           initialValue={props.edit ? props.record?.ghiChuCheDoAn : undefined}
         >
           <Input.TextArea />
         </Form.Item>
       )}
       <Form.Item
         name="coThe"
         style={{ marginBottom: 5 }}
         label="Cơ thể"
         initialValue={props.edit ? props.record?.coThe : undefined}
       >
         <Select
           placeholder="Chọn tình trạng cơ thể"
           // disabled={props.disable}
         >
           {coThe?.map((item) => (
             <Select.Option value={item?.value}>{item?.label}</Select.Option>
           ))}
         </Select>
       </Form.Item>
       <Form.Item
         name="ghiChu"
         style={{ marginBottom: 5 }}
         label="Ghi chú"
         initialValue={props.edit ? props?.record?.ghiChu : undefined}
       >
         <Input.TextArea placeholder="Nhập ghi chú" rows={2}
           // disabled={props.disable}
         />
       </Form.Item>
    </>
  );
};

export default FormTaiKhoanPhuHuynh;
