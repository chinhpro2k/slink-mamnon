/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-underscore-dangle */
import type { ChucNangQuanTri as IChucNangQuanTri } from '@/services/ChucNangQuanTri';
import {
  CheckOutlined,
  EditOutlined,
  LockOutlined,
  MinusSquareOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons';
import { Button, Card, Checkbox, Table } from 'antd';
import type { ColumnProps } from 'antd/lib/table';
import _ from 'lodash';
import React, { useState } from 'react';
import { useModel } from 'umi';

const TableNguoiDung = () => {
  const { getChucNangQuanTriModel, loading } = useModel('chucnangquantri');
  const { danhSach: danhSachVaiTroQuanTri, getVaiTroQuanTriModel } = useModel('vaitroquantri');
  const [pixel, setPixel] = useState<number>(1500);
  const [data, setData] = useState<any>([]);
  const [dataSua, setDataSua] = useState<any>();
  const [dataDraftTable, setDataDraftTable] = useState<IChucNangQuanTri.Record[]>([]);
  const danhSachCho: any = [];

  const getData = async () => {
    setPixel((danhSachVaiTroQuanTri?.length ?? 0) * 180 + 500);
    await getVaiTroQuanTriModel().then(async (ds) => {
      const suaData: any = {};
      ds?.map((val: { _id: string | number }) => {
        suaData[val?._id] = true;
        return true;
      });
      setDataSua(suaData);
      await getChucNangQuanTriModel().then((dsCN: any) => {
        setDataDraftTable(dsCN);
        const buildData = (cnCha: any[], cnCon: any[]): void => {
          if (cnCon.length === 0) return;
          cnCha?.map((item) => {
            let ma = 0;
            cnCon?.map((element) => {
              if (!element.checked) {
                if (element.parent === item.key) {
                  if (!item.children) {
                    // eslint-disable-next-line no-param-reassign
                    item.children = [];
                  }
                  ma += 1;
                  item.children.push({ ...element, ma: item.key * 10 + ma });
                  // chucNangCon.splice(index, 1);
                  // eslint-disable-next-line no-param-reassign
                  element.checked = true;
                }
              }
              return true;
            });
            return true;
          });
          const newData: any[] = [];
          cnCon?.map((item) => {
            if (!item.checked) {
              newData.push(item);
            }
            return true;
          });
          if (cnCon.length > 0) {
            cnCha?.map((item) => {
              buildData(item.children, newData);
              return true;
            });
          }
        };

        dsCN?.map((val: IChucNangQuanTri.Record) => {
          const newVal = val;
          let array: string[] = [];
          array = danhSachVaiTroQuanTri?.map((x: { _id: string }) => x?._id ?? x);
          // delete val[arr[i]]
          for (let index = 0; index < array.length; index += 1) {
            const element = array[index];
            if (val[element]) {
              delete newVal[element];
            }
          }
          return true;
        });
        dsCN?.map((val: IChucNangQuanTri.Record) => {
          const newVal = val;
          newVal?.vaiTroQuanTriChoPhep?.map((vt) => {
            if (vt?._id !== undefined && val?.vaiTroQuanTriChoPhep?.length > 0)
              newVal[vt._id] = true;
            else newVal[vt] = true;
            return true;
          });
          return false;
        });
        if (_.isEmpty(suaData)) {
          dsCN?.map((val: IChucNangQuanTri.Record) => {
            const newVal = val;
            if (!val?.sua) {
              newVal.sua = {};
              danhSachVaiTroQuanTri?.map((vt: { _id: string | number }) => {
                newVal.sua[vt._id] = true;
                return true;
              });
            }
            return true;
          });
        } else {
          dsCN?.map((val: any) => {
            const newVal = val;
            newVal.sua = suaData;
            return true;
          });
        }

        const cnCha: any[] = [];
        const cnCon: any[] = [];
        dsCN?.map((item: any, index: number) => {
          if (!item.parent) cnCha.push({ ...item, ma: (index + 5) * (index + 3) });
          else cnCon.push({ ...item });
          return true;
        });
        buildData(cnCha, cnCon);
        let dataRender: any[] | undefined = [];
        cnCha.map((item, index) => {
          dataRender = dataRender?.concat({ ...item, index: index + 1 });
          return true;
        });
        const addData = (dtRenders: any[]) => {
          dtRenders = dtRenders?.map((dtRender) => {
            ds.forEach((item: { modules: any[]; _id: string | number }) => {
              let flag = false;
              item?.modules?.forEach((module) => {
                if (module === dtRender?.id) {
                  flag = true;
                }
              });
              if (flag) {
                dtRender[item?._id] = true;
              }
            });
            if (dtRender?.children) {
              dtRender.children = addData(dtRender?.children);
            }
            return dtRender;
          });
          return dtRenders;
        };
        dataRender = addData(dataRender);
        setData(dataRender);
      });
    });
  };

  React.useEffect(() => {
    getData();
  }, []);

  const handleSave = async () => {
    danhSachVaiTroQuanTri.map((vaiTro) => {
      let newModules: any[] = [];
      const buildNewModules = (arr: any[]) => {
        arr.forEach((item: { [x: string]: any; _id: any; children: any[] }) => {
          if (item[`${vaiTro._id}`]) {
            newModules = newModules.concat(item?._id);
          }
          if (item?.children) {
            buildNewModules(item?.children);
          }
        });
      };
      buildNewModules(data);
      return {
        ...vaiTro,
        modules: newModules,
      };
    });
    // if (res?.data?.statusCode === 200) {
    //   message.success('Cập nhật thành công');
    //   getChucNangQuanTriModel();
    //   return true;
    // }
    // message.error('Đã xảy ra lỗi');
    // return false;
  };

  const customExpandIcon = (props: {
    expanded: any;
    onExpand: (arg0: any, arg1: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
    record: any;
    expandable: any;
  }) => {
    if (props.expanded) {
      return (
        <a
          style={{ color: 'black' }}
          onClick={(e) => {
            props.onExpand(props.record, e);
          }}
        >
          <MinusSquareOutlined style={{ marginRight: '10px', cursor: 'pointer' }} />
        </a>
      );
    }
    if (!props.expandable) {
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
          props.onExpand(props.record, e);
        }}
      >
        <PlusSquareOutlined style={{ marginRight: '10px', cursor: 'pointer' }} />
      </a>
    );
  };

  // tich thang con => auto thang cha dươc tich
  const xuLyMaCha = (maCha: string | null, id: string) => {
    if (maCha === null) return;
    const mangIdBanDau: string[] = [];

    dataDraftTable?.map((value) => {
      if (value.key === maCha) {
        value.vaiTroQuanTriChoPhep?.map((item) => {
          mangIdBanDau.push(item._id || item);
          return true;
        });
        const tmp = mangIdBanDau.indexOf(id);
        if (tmp === -1) {
          // neu ma id vai tro ko co trong mang id ban dau ~ vai tro nay chua dc tich

          mangIdBanDau.push(id);
        }

        danhSachCho.push({
          name: value?.name,
          key: value?.key,
          parent: value?.parent,
          vaiTroQuanTriChoPhep: mangIdBanDau,
          APISuDung: value?.APISuDung,
          _id: value._id,
        });

        if (value.parent) xuLyMaCha(value.parent, id);
        // Nếu nó còn cha thì gọi lại
      }
      return false;
    });
  };

  // Neu bo chon menu cha => bo luon ca chon tat ca menu con
  // 2 tham so :
  // 1. ma modul
  // 2 . id vai tro
  /**
   * Neu bo chon menu cha => bo luon ca chon tat ca menu con
   * @param ma mã module
   * @param id id là id vai trò
   *
   */

  const BoChaBoCon = (ma: string | null, id: string): void => {
    // map toan bo danh sach chuc nang
    dataDraftTable?.map(async (value) => {
      // thang nao co mã chức năng cha = với mã
      // ~ thằng nào là con của thằng hiện tại

      if (value.parent === ma) {
        const mangIdVaiTro: string[] = [];
        // map vai trò quản trị của thằng con
        value.vaiTroQuanTriChoPhep?.map((item) => {
          // thằng nào mà có id khac voi id vai tro bỏ chọn -> push vào
          // ( nghia là các vai trò của các cột khác được giữ nguyên)

          if (id !== (item?._id ?? item)) {
            mangIdVaiTro.push(item?._id ?? item);
          }
          return false;
        });

        danhSachCho.push({
          name: value?.name,
          key: value?.key,
          parent: value?.parent,
          vaiTroQuanTriChoPhep: mangIdVaiTro,
          APISuDung: value?.APISuDung,
          _id: value._id,
        });

        // 2 tham so
        // 1. mã của nó (thang con)
        // 2. id vai
        BoChaBoCon(value.key, id);
      }
    });
  };

  // const draftChucNang = (danhSachChoChucNang: any) => {
  //   const newDraftTable = dataDraftTable;
  //   const newDraftChucNang = danhSachChoChucNang;
  //   newDraftTable.map((val: any) => {
  //     const newVal = val;
  //     newDraftChucNang.map((valChucNang: { key: string; vaiTroQuanTriChoPhep: any }) => {
  //       if (newVal?.key === valChucNang?.key) {
  //         newVal.vaiTroQuanTriChoPhep = valChucNang.vaiTroQuanTriChoPhep;
  //       }
  //       return true;
  //     });
  //     return true;
  //   });
  //   setDataDraftTable([...newDraftTable]);
  // };

  const onChangeVaiTro = async (
    record: IChucNangQuanTri.Record,
    id: string,
    trangThai: boolean,
  ) => {
    let flag = false;

    const changeSelect = (arr: any[]) => {
      arr = arr.map((item) => {
        if (item?.id === record?.id) {
          flag = true;
          return {
            ...item,
            [`${id}`]: trangThai,
          };
        }
        if (flag) return item;
        if (item?.children) {
          return {
            ...item,
            children: changeSelect(item?.children),
          };
        }
        return item;
      });
      return arr;
    };
    const tmpData = changeSelect(data);
    setData(tmpData);
  };

  const xuLySelect = (id: string) => {
    const openSelectData = (arr: any[]) => {
      arr = arr?.map((item) => {
        let newItem = {
          ...item,
          sua: {
            ...item?.sua,
            [`${id}`]: !item?.sua[`${id}`],
          },
        };
        if (item?.children) {
          newItem = {
            ...newItem,
            children: openSelectData(item?.children),
          };
        }
        return newItem;
      });
      return arr;
    };
    const tmpArr = openSelectData(data);
    const newDataSua = {
      ...dataSua,
      [`${id}`]: !dataSua[`${id}`],
    };
    setDataSua(newDataSua);
    setData(tmpArr);
  };

  const columns: ColumnProps<IChucNangQuanTri.Record>[] = [
    {
      title: 'Tên module',
      dataIndex: 'name',
      fixed: 'left',
      width: 300,
      render: (value, record) => {
        if (!record?.parent) {
          return {
            props: {
              style: {
                cursor: 'pointer',
              },
            },
            children: (
              <span style={{ color: '#C01718' }}>
                <b>{value}</b>
              </span>
            ),
          };
        }

        return {
          props: {
            style: {
              cursor: 'pointer',
            },
          },
          children: <span style={{ color: '#d93523' }}>{value}</span>,
        };
      },
    },
  ];

  // push cac cot chuc nag vai tro duoi dang checkbox vào column

  danhSachVaiTroQuanTri?.map((value) => {
    //  const x = this.props?.vaitroquantri?.danhSach || [];
    columns.push({
      title: () => (
        <div>
          <p>{value?.name}</p>
          <Button shape="circle" onClick={() => xuLySelect(value?._id)}>
            {dataSua?.[value?._id] ? <EditOutlined /> : <LockOutlined />}
          </Button>
        </div>
      ),
      dataIndex: value?._id,
      width: '180px',
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
              <Checkbox
                disabled={record?.sua[value?._id] ?? false}
                checked={x}
                onChange={(e) => onChangeVaiTro(record, value._id, e.target.checked)}
              />
            </>
          ),
        };
      },
    });
    return false;
  });

  return (
    <div>
      <Card>
        <Button type="primary" onClick={handleSave}>
          <CheckOutlined />
          Lưu
        </Button>
        <p />
        <Table
          bordered
          indentSize={40}
          defaultExpandAllRows
          expandIcon={(props) => customExpandIcon(props)}
          columns={columns}
          loading={loading}
          dataSource={data}
          pagination={false}
          scroll={{ x: pixel }}
        />
      </Card>
    </div>
  );
};
export default TableNguoiDung;
