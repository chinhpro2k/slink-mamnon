import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { notification } from 'antd';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import type { RequestOptionsInit, ResponseError } from 'umi-request';
import { getInfoAdmin } from './services/ant-design-pro/api';
import NoAccessPage from '@/pages/403';

const loginPath = '/user/login';
const autoLoginPath = '/user/autologin';
const registerPath = '/user/register';
const autoLogoutPath = '/user/autologout';
const forgotPassword = '/user/forgetAcc';

/**  loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: IInfoSV.Data | IInfoGV.Data;
  partner_id?: number;
  fetchUserInfo?: () => Promise<IInfoSV.Data | undefined>;
  authorizedRoles?: API.LoginResponse.AuthorizedRole[];
  isModalSelectRoleVisible?: boolean;
}> {
  const fetchUserInfo: () => Promise<IInfoSV.Data | undefined> = async () => {
    try {
      // const currentUser = (await queryCurrentUser(Number(localStorage.getItem('id')))).data?.[0];
      // dung cho sv gv
      const currentUser = (await getInfoAdmin()).data;
      localStorage.setItem('modules', JSON.stringify(currentUser?.modules ?? []));
      return currentUser;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };

  if (
    history.location.pathname !== loginPath &&
    history.location.pathname !== autoLoginPath &&
    history.location.pathname !== autoLogoutPath &&
    history.location.pathname !== registerPath
    //history.location.pathname !== forgotPassword
  ) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
      authorizedRoles: [],
      isModalSelectRoleVisible: false,
    };
  }

  return {
    fetchUserInfo,
    settings: {},
  };
}

const authHeaderInterceptor = (url: string, options: RequestOptionsInit) => {
  const token = localStorage.getItem('token');
  const authHeader = { ...(token && { Authorization: `Bearer ${token}` }) };
  return {
    url: `${url}`,
    options: { ...options, interceptors: true, headers: authHeader },
  };
};

/**
 * @see https://beta-pro.ant.design/docs/request-cn
 */
export const request: RequestConfig = {
  errorHandler: (error: ResponseError) => {
    // const { messages } = getIntl(getLocale());
    const { response } = error;

    // if (response && response.status) {
    //   const { status, statusText, url } = response;
    //   const requestErrorMessage = messages['app.request.error'];
    //   const errorMessage = `${requestErrorMessage} ${status}: ${url}`;
    //   const errorDescription = messages[`app.request.${status}`] || statusText;
    //   notification.error({
    //     message: errorMessage,
    //     description: errorDescription,
    //   });
    // }

    if (!response) {
      notification.error({
        description: 'Yêu cầu gặp lỗi',
        message: 'Bạn hãy thử lại sau',
      });
    }
    throw error;
  },
  requestInterceptors: [authHeaderInterceptor],
};

// ProLayout  https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    unAccessible: () => <NoAccessPage />,
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      //  login
      if (
        !localStorage.getItem('token') &&
        !initialState?.currentUser &&
        location.pathname !== loginPath &&
        location.pathname !== registerPath &&
        location.pathname !== autoLoginPath &&
        location.pathname !== autoLogoutPath &&
        location.pathname !== forgotPassword
      ) {
        history.push(loginPath);
      }
      localStorage.setItem('modules', JSON.stringify(initialState?.currentUser?.modules ?? []));
    },
    menuHeaderRender: undefined,
    //  403
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
    title: 'HỆ THỐNG MẦM NON',
  };
};
