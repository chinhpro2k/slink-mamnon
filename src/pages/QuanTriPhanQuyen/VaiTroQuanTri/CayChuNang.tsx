/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import { MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { Checkbox, Table } from 'antd';
import type { ColumnProps } from 'antd/lib/table';

const CayChucNang = (props: { dsChucNang: any; value?: any; onChange?: any }) => {
  const { value, dsChucNang, onChange } = props;
  const buildData = (chucNang: { key: string }) => {
    let tmpArr: any[] = [];
    dsChucNang.map((e: { parent: string }) => {
      if (chucNang?.key === e?.parent) {
        tmpArr = tmpArr.concat(e);
      }
    });
    tmpArr = tmpArr?.map((item) => {
      return {
        ...item,
        children: buildData(item),
      };
    });
    return tmpArr;
  };
  let data = dsChucNang
    .map((item: any) => {
      if (!item?.parent) {
        return {
          ...item,
          children: buildData(item),
        };
      }
    })
    .filter((item: any) => {
      if (item) return true;
      return false;
    });
  const buildAllow = (arr: any[]) => {
    // eslint-disable-next-line no-param-reassign
    arr = arr.map((item) => {
      let newItem = {
        ...item,
      };
      value?.map((e: any) => {
        if (e === item?.key) {
          newItem = {
            ...newItem,
            allow: true,
          };
        }
      });
      if (item?.children) {
        newItem = {
          ...newItem,
          children: buildAllow(item?.children),
        };
      }
      return newItem;
    });
    return arr;
  };

  data = buildAllow(data);
  const onChangeVaiTro = (record: { key: string; parent: string }, trangThai: boolean) => {
    if (trangThai) {
      let tmp = [];
      if (value?.length > 0) {
        let flag = true;
        value?.map((item: string) => {
          if (item === record?.key) {
            flag = false;
          }
        });
        if (flag) {
          tmp = value.concat(record?.key);
        } else {
          tmp = value?.filter((item: string) => item !== record?.key);
        }
      } else {
        tmp = value.concat(record?.key);
      }
      let flag = true;
      tmp.map((item: string) => {
        if (item === record?.parent) {
          flag = false;
        }
      });
      if (flag) {
        tmp = tmp.concat(record?.parent);
      }
      onChange(tmp);
    } else {
      let tmp: any[] = [];
      tmp = value?.filter((item: string) => item !== record?.key);
      let arrChildChild: any[] = [];
      const allChild = (parent: any) => {
        dsChucNang.map((item: any) => {
          if (item?.parent === parent?.key) {
            arrChildChild = arrChildChild.concat(item);
            allChild(item);
          }
        });
      };
      allChild(record);
      arrChildChild.map((child) => {
        tmp = tmp?.filter((item) => item !== child?.key);
      });
      const keyParent: string = record?.parent ?? '-1';
      if (keyParent !== '-1') {
        let parent: any = {};
        dsChucNang.map((item: { key: string }) => {
          if (item.key === keyParent) parent = item;
        });
        let dsCN = Array.from(dsChucNang);
        let arrChild: any[] = [];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        dsCN = dsCN.map((item: any) => {
          if (item?.parent === parent?.key) {
            arrChild = arrChild.concat(item);
          }
        });
        let flag = false;
        tmp.map((item) => {
          arrChild.map((child) => {
            if (child?.key === item) {
              flag = true;
            }
          });
        });
        if (!flag) {
          tmp = tmp.filter((item) => item !== parent?.key);
        }
      }
      onChange(tmp);
    }
  };
  const columns: ColumnProps<any>[] = [
    {
      title: 'Tên chức năng',
      dataIndex: 'name',
      width: '80%',
      align: 'left',
    },
    {
      title: 'Cho phép',
      dataIndex: 'allow',
      align: 'center',
      render: (x, record) => {
        return {
          props: {
            style: {
              cursor: 'pointer',
            },
          },
          children: (
            <>
              <Checkbox checked={x} onChange={(e) => onChangeVaiTro(record, e.target.checked)} />
            </>
          ),
        };
      },
    },
  ];
  const customExpandIcon = (propIcon: {
    expanded: any;
    onExpand: (arg0: any, arg1: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
    record: any;
    expandable: any;
  }) => {
    if (propIcon.expanded) {
      return (
        <a
          style={{ color: 'black' }}
          onClick={(e) => {
            propIcon.onExpand(propIcon.record, e);
          }}
        >
          <MinusSquareOutlined style={{ marginRight: '10px', cursor: 'pointer' }} />
        </a>
      );
    }
    if (!propIcon.expandable) {
      return (
        <a style={{ color: 'black' }}>
          <MinusSquareOutlined style={{ marginRight: '10px', cursor: 'pointer' }} />
        </a>
      );
    }
    return (
      <a
        style={{ color: 'black' }}
        onClick={(e) => {
          propIcon.onExpand(propIcon.record, e);
        }}
      >
        <PlusSquareOutlined style={{ marginRight: '10px', cursor: 'pointer' }} />
      </a>
    );
  };
  return (
    <Table bordered columns={columns} dataSource={data} expandIcon={(e) => customExpandIcon(e)} />
  );
};

export default CayChucNang;
