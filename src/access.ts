/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: IRecordLogin.User | undefined }) {
  const modules = initialState?.currentUser?.modules ?? [];
  return {
    routeFilter: (route: any) => {
      let flag = false;
      modules?.map((item: string) => {
        if (item === route?.maChucNang) {
          flag = true;
        }
        return true;
      });
      return flag;
    },
  };
}
