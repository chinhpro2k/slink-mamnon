import { notification, message } from 'antd';

const openNotificationWithIcon = (type: string | number, title?: string, content?: any) => {
  notification.config({
    placement: 'bottomRight',
  });
  notification[type]({
    message: title,
    description: content,
  });
};

const success = () => {
  message.success('This is a message of success');
};

const error = () => {
  message.error('This is a message of error');
};

const warning = () => {
  message.warning('This is message of warning');
};

export { success, error, warning };
export default openNotificationWithIcon;
