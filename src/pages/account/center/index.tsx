import avatar from '@/assets/admin.png';
import { ClusterOutlined, ContactsOutlined, PhoneOutlined } from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-layout';
import type { Input } from 'antd';
import { Card, Col, Divider, Row } from 'antd';
import { Component } from 'react';
import type { RouteChildrenProps } from 'react-router';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import styles from './Center.less';
import Profile from './components/Profile';
import Projects from './components/Projects';
import type { CurrentUser } from './data.d';
import type { ModalState } from './model';

const operationTabList = [
  {
    key: 'editProfile',
    tab: 'Thông tin tài khoản',
  },
  // {
  //   key: 'changePassword',
  //   tab: <span>Đổi mật khẩu</span>,
  // },
];

interface CenterProps extends RouteChildrenProps {
  dispatch: Dispatch;
  currentUser: Partial<CurrentUser>;
  currentUserLoading: boolean;
}
interface CenterState {
  tabKey?: 'editProfile' | 'changePassword';
}
class Center extends Component<CenterProps, CenterState> {
  // static getDerivedStateFromProps(
  //   props: accountAndcenterProps,
  //   state: accountAndcenterState,
  // ) {
  //   const { match, location } = props;
  //   const { tabKey } = state;
  //   const path = match && match.path;

  //   const urlTabKey = location.pathname.replace(`${path}/`, '');
  //   if (urlTabKey && urlTabKey !== '/' && tabKey !== urlTabKey) {
  //     return {
  //       tabKey: urlTabKey,
  //     };
  //   }

  //   return null;
  // }

  state: CenterState = {
    tabKey: 'editProfile',
  };

  public input: Input | null | undefined = undefined;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'accountAndcenter/fetchCurrent',
    });
  }

  onTabChange = (key: string) => {
    // If you need to sync state to url
    // const { match } = this.props;
    // router.push(`${match.url}/${key}`);
    this.setState({
      tabKey: key as CenterState['tabKey'],
    });
  };

  renderChildrenByTabKey = (tabKey: CenterState['tabKey']) => {
    if (tabKey === 'editProfile') {
      return <Profile />;
    }
    if (tabKey === 'changePassword') {
      return <Projects />;
    }

    return null;
  };

  renderUserInfo = (currentUser: Partial<CurrentUser>) => (
    <div className={styles.detail}>
      <p>
        <ContactsOutlined
          style={{
            marginRight: 8,
          }}
        />
        Vai trò: {localStorage.getItem('vaiTro')}
      </p>
      <p>
        <ClusterOutlined
          style={{
            marginRight: 8,
          }}
        />
        Giới tính: {currentUser?.profile?.gender === 'Male' ? 'Nam' : 'Nữ'}
      </p>
      <p>
        <PhoneOutlined
          style={{
            marginRight: 8,
          }}
        />
        SĐT: {currentUser?.profile?.phoneNumber}
      </p>
    </div>
  );

  render() {
    const { tabKey } = this.state;
    const { currentUser } = this.props;
    const dataLoading = false;
    return (
      <GridContent>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card bordered={false} style={{ marginBottom: 24 }} loading={dataLoading}>
              {!dataLoading && (
                <div>
                  <div className={styles.avatarHolder}>
                    <img alt="" src={currentUser?.avatar || avatar} />
                    <div className={styles.name}>
                      {currentUser?.profile?.fullname || 'Chưa cập nhật'}
                    </div>
                    <div>{currentUser?.profile?.email || 'Chưa cập nhật'}</div>
                  </div>
                  <Divider dashed />
                  {this.renderUserInfo(currentUser)}
                </div>
              )}
            </Card>
          </Col>
          <Col lg={17} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
              tabList={operationTabList}
              activeTabKey={tabKey}
              onTabChange={this.onTabChange}
            >
              {this.renderChildrenByTabKey(tabKey)}
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default connect(
  ({
    loading,
    accountAndcenter,
  }: {
    loading: { effects: Record<string, boolean> };
    accountAndcenter: ModalState;
  }) => ({
    currentUser: accountAndcenter.currentUser,
    currentUserLoading: loading.effects['accountAndcenter/fetchCurrent'],
  }),
)(Center);
