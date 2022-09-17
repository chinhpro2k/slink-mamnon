import { updTaiKhoanKhach } from '@/services/TaiKhoanKhach/taikhoankhach';
import rules from '@/utils/rules';
import { Button, Col, DatePicker, Form, Input, message, Row, Select } from 'antd';
import moment from 'moment';
import { Component } from 'react';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import type { CurrentUser } from '../../data';

// interface SelectItem {
//   label: string;
//   key: string;
// }

// const validatorGeographic = (
//   _: any,
//   value: {
//     province: SelectItem;
//     city: SelectItem;
//   },
//   callback: (message?: string) => void,
// ) => {
//   const { province, city } = value;
//   if (!province.key) {
//     callback('Please input your province!');
//   }
//   if (!city.key) {
//     callback('Please input your city!');
//   }
//   callback();
// };

// const validatorPhone = (rule: any, value: string, callback: (message?: string) => void) => {
//   const values = value.split('-');
//   if (!values[0]) {
//     callback('Please input your area code!');
//   }
//   if (!values[1]) {
//     callback('Please input your phone number!');
//   }
//   callback();
// };

interface BaseViewProps {
  currentUser?: CurrentUser;
  dispatch: Dispatch;
}

class BaseView extends Component<BaseViewProps> {
  view: HTMLDivElement | undefined = undefined;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'accountAndcenter/fetchCurrent',
    });
  }
  getAvatarURL() {
    const { currentUser } = this.props;
    if (currentUser) {
      if (currentUser.avatar) {
        return currentUser.avatar;
      }
      const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
      return url;
    }
    return '';
  }

  getViewDom = (ref: HTMLDivElement) => {
    this.view = ref;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleFinish = async (val: any) => {
    const res = await updTaiKhoanKhach({ ...val });
    if (res?.data?.statusCode === 200) {
      message.success('Cập nhật thành công');
      const { dispatch } = this.props;
      dispatch({
        type: 'accountAndcenter/fetchCurrent',
      });
      return true;
    }
    message.error('Đã xảy ra lỗi');
    return false;
  };

  render() {
    const { currentUser } = this.props;
    return (
      <div ref={this.getViewDom}>
        <Form layout="vertical" onFinish={this.handleFinish} hideRequiredMark>
          <Row gutter={[16, 0]}>
            <Col lg={12} sm={24}>
              <Form.Item
                name={['profile', 'fullname']}
                label="Họ và tên"
                rules={[...rules.required]}
                initialValue={currentUser?.profile?.fullname}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col lg={12} sm={24}>
              <Form.Item
                name={['profile', 'email']}
                label="Email"
                initialValue={currentUser?.profile?.email}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 0]}>
            <Col lg={12} sm={24}>
              <Form.Item
                name={['profile', 'phoneNumber']}
                label="Số điện thoại"
                rules={[...rules.soDienThoai]}
                initialValue={currentUser?.profile?.phoneNumber}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col lg={12} sm={24}>
              <Form.Item
                name={['profile', 'gender']}
                label="Giới tính"
                initialValue={currentUser?.profile?.gender}
              >
                <Select placeholder="Giới tính">
                  <Select.Option value="Male">Nam</Select.Option>
                  <Select.Option value="Female">Nữ</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name={['profile', 'dateOfBirth']}
            label="Ngày sinh"
            initialValue={
              currentUser?.profile?.dateOfBirth
                ? moment(currentUser?.profile?.dateOfBirth)
                : undefined
            }
          >
            <DatePicker format="DD-MM-YYYY" />
          </Form.Item>

          <Form.Item
            name={['profile', 'address']}
            label="Địa chỉ"
            initialValue={currentUser?.profile?.address}
          >
            <Input.TextArea placeholder="Địa chỉ" rows={2} />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary">
              {/* <FormattedMessage
                  id="accountandsettings.basic.update"
                  defaultMessage="Update Information"
                /> */}
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
        {/* <div className={styles.right}>
          <AvatarView avatar={this.getAvatarURL()} />
        </div> */}
      </div>
    );
  }
}

export default connect(
  ({ accountAndcenter }: { accountAndcenter: { currentUser: CurrentUser } }) => ({
    currentUser: accountAndcenter.currentUser,
  }),
)(BaseView);
