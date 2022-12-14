import data from '@/utils/data';
import type { IColumn } from '@/utils/interfaces';
import { toRegex } from '@/utils/utils';
import { PlusCircleFilled, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Drawer, Input, Modal, Table } from 'antd';
import type { PaginationProps } from 'antd/es/pagination';
import type { FilterValue } from 'antd/lib/table/interface';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { useModel } from 'umi';
import './style.less';
import styled from 'styled-components';

type Props = {
  modelName: any;
  Form?: React.FC;
  formType?: 'Modal' | 'Drawer';
  columns: IColumn<any>[];
  title?: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/ban-types
  getData: Function;
  dependencies?: any[];
  loading: boolean;
  params?: any;
  children?: React.ReactNode;
  border?: boolean;
  borderCard?: boolean;
  scroll?: any;
  widthDrawer?: string;
  hascreate?: boolean;
  dataState?: string;
  footer?: any;
  summary?: Function;
  isNotPagination?: boolean;
  onCloseForm?: () => void;
  visibleState?: string;
  setVisibleState?: string;
  bodyStyle?: any;
};

const TableWrapper = styled.div`
  .ant-table-filter-trigger.active {
    color: white !important;
  }
  .ant-table-column-sorter-up.active,
  .ant-table-column-sorter-down.active {
    color: white !important;
  }
`;

const TableBase = (props: Props) => {
  const {
    modelName,
    Form,
    title,
    getData,
    dependencies = [],
    formType,
    loading,
    children,
    params,
    border,
    borderCard,
    scroll,
    widthDrawer,
    hascreate,
    dataState,
    footer,
    summary,
    isNotPagination,
    visibleState,
    setVisibleState,
    onCloseForm,
  } = props;
  let { columns } = props;
  const {
    total,
    page,
    limit,
    setPage,
    setLimit,
    filterInfo,
    cond,
    setFilterInfo,
    setCondition,
    setVisibleForm,
    visibleForm,
    setEdit,
    setRecord,
  } = useModel(modelName);
  const model = useModel(modelName);

  useEffect(() => {
    getData(params);
  }, [...dependencies]);
  let searchInput: Input | null = null;
  const getCondValue = (dataIndex: any) => {
    const type = typeof dataIndex;
    return filterInfo?.[type === 'string' ? dataIndex : dataIndex?.join('.')] ?? [];
  };

  const getSortStatus = (dataIndex: any) => {
    const type = typeof dataIndex;
    return filterInfo?.sort?.[type === 'string' ? dataIndex : dataIndex?.join('.')] ?? [];
  };
  const haveCond = (dataIndex: string) => getCondValue(dataIndex).length > 0;

  const getSearch = (dataIndex: any) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: {
      setSelectedKeys: Function;
      selectedKeys: string[];
      confirm: Function;
      clearFilters: Function;
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder="T??m ki???m"
          value={selectedKeys[0]} //  || selectedKeys[0]
          onChange={(e) =>
            setSelectedKeys(
              e.target.value
                ? [e.target.value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')]
                : [],
            )
          }
          onPressEnter={() => confirm()}
          style={{
            width: 188,
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Button
          type="primary"
          onClick={() => {
            confirm();
          }}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          T??m
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            const tmpCond = _.clone(cond);
            const type = typeof dataIndex;
            delete tmpCond[type === 'string' ? dataIndex : dataIndex?.join('.')];
            const tmpFilter = _.clone(filterInfo);
            delete tmpFilter[type === 'string' ? dataIndex : dataIndex?.join('.')];
            setFilterInfo(tmpFilter);
            setCondition(tmpCond);
          }}
          size="small"
          style={{ width: 90 }}
        >
          X??a
        </Button>
      </div>
    ),
    onFilterDropdownVisibleChange: (visible: any) => {
      if (visible) {
        setTimeout(() => searchInput && searchInput.select());
      }
    },
    filteredValue: getCondValue(dataIndex),
    onFilter: () => true,
    filterIcon: (filtered: any) => (
      <SearchOutlined
        style={{
          color: filtered || haveCond(dataIndex) ? '#1890ff' : undefined,
        }}
        title="T??m ki???m"
      />
    ),
  });

  const getSortValue = (dataIndex: any) => {
    let value = getSortStatus(dataIndex);
    if (value === 1) {
      return 'ascend';
    }
    if (value === -1) {
      return 'descend';
    }
    return false;
  };

  const getSort = (dataIndex: any) => ({
    sorter: true,
    sortDirections: ['ascend', 'descend'],
    sortOrder: getSortValue(dataIndex),
  });

  const getFilter = (dataIndex: any, columnKey?: string) => {
    const newDataIndex = dataIndex?.join('.');
    const arrValueByDataIndex: any[] = data?.[`${columnKey || newDataIndex}`] ?? [];
    return {
      // c???n ?????m b???o trong file data.js ???? c?? d??? li???u
      filters: arrValueByDataIndex.map((item, index) => {
        const type = typeof item;
        return {
          text: type === 'string' ? item : item?.text ?? '',
          value: type === 'string' ? index : item?.value,
        };
      }),
      onFilter: () => true,
      // ?????ng b??? v???i cond ??ang search
      filteredValue: getCondValue(newDataIndex),
      filterMultiple: false,
      // render: (item: string | number) => {
      //   return data?.[`${columnKey || newDataIndex}`]?.[`${+item}`] ?? 'Ch??a x??c ?????nh';
      // },
    };
  };

  const getFilterS = (dataIndex: any, columnKey: any) => ({
    // c???n ?????m b???o trong file data.js ???? c?? d??? li???u
    // trangThaiDon  = [ '??ang x??? l??', '???? x??? l??']
    // dataIndex : 'trangThaiHienThi'
    // columnKey :'trangThaiDon'
    filters: (data?.[columnKey || dataIndex] ?? []).map((item: any) => {
      const type = typeof item?.tenDonVi;
      return {
        text: type === 'string' ? item?.tenDonVi : item?.text ?? '', // cai hien thi ??? ?? l???c
        value: type === 'string' ? item?.donViId : item?.value,
      };
    }),
    onFilter: () => true,
    // ?????ng b??? v???i cond ??ang search
    filteredValue: getCondValue(dataIndex),
    filterMultiple: false,
    // render: (item: string | number) => item ?? 'Ch??a x??c ?????nh',
  });

  columns = columns.map((item) => {
    // n???u data tr??? v??? c?? d???ng 0,1 / true,false
    if (item.search === 'filter') {
      return {
        ...item,
        ...getFilter(item.dataIndex, item?.columnKey),
      };
    }
    // n???u data tr??? v??? c?? d???ng string
    if (item.search === 'filterString') {
      return {
        ...item,
        ...getFilterS(item.dataIndex, item?.columnKey),
      };
    }
    if (item.search === 'search') {
      return { ...item, ...getSearch(item.dataIndex) };
    }
    if (item.search === 'sort') {
      return { ...item, ...getSort(item.dataIndex) };
    }
    return item;
  });

  const handleTableChange = (
    pagination: PaginationProps,
    filters: Record<string, FilterValue | null>,
    sorter: any,
  ) => {
    // console.log('this.tableBaseRef :>> ', this.tableBaseRef);
    // this.tableBaseRef.current.focus();
    // this.focusTableBase();
    // thay ?????i t??? ph??n trang || filter
    const { current, pageSize } = pagination;
    const { field, order } = sorter;
    let orderValue = undefined;
    if (order === 'ascend') orderValue = 1;
    else if (order === 'descend') orderValue = -1;
    //  gi??? l???i th??ng tin c???a cond.
    const tmpCond = _.clone(cond);
    Object.keys(filters).forEach((key) => {
      // if (!filters?.[key]?.length) {
      //   return;
      // }
      const notRegex = columns?.find(
        (item) => item.dataIndex === key || item.key === key,
      )?.notRegex;
      const value = filters?.[key]?.[0];
      const isSearch = typeof value === 'string';
      tmpCond[key] = isSearch && notRegex !== true ? toRegex(value) : value;
      // return 0;
    });
    let tmpSort = {
      ...filterInfo?.sort,
    };
    if (orderValue) {
      tmpSort = {
        ...tmpSort,
        [`${field}`]: orderValue,
      };
    } else {
      delete tmpSort[`${field}`];
    }

    setFilterInfo({
      ...filterInfo,
      ...filters,
      sort: tmpSort,
    });
    setPage(current);
    setLimit(pageSize);
    setCondition(tmpCond);
  };
  return (
    <Card title={title || false} bordered={borderCard || false} bodyStyle={props.bodyStyle}>
      {children}
      {hascreate && (
        <Button
          style={{ marginBottom: '10px' }}
          onClick={() => {
            setVisibleForm(true);
            setEdit(false);
            setRecord({});
          }}
          icon={<PlusCircleFilled />}
          type="primary"
        >
          Th??m m???i
        </Button>
      )}
      <TableWrapper>
        <Table
          loading={loading}
          bordered={border || false}
          pagination={
            isNotPagination
              ? false
              : {
                  current: page,
                  pageSize: limit,
                  position: ['bottomRight'],
                  total,
                  showSizeChanger: true,

                  pageSizeOptions: ['1', '10', '25', '50', '100'],
                  showTotal: () => {
                    return <div>T???ng s???: {total ?? 0}</div>;
                  },
                }
          }
          onChange={handleTableChange}
          dataSource={model?.[dataState || 'danhSach']?.map((item: any, index: number) => {
            return { ...item, index: index + 1 + (page - 1) * limit };
          })}
          columns={columns}
          scroll={scroll}
          footer={footer}
          summary={summary}
        />
      </TableWrapper>
      {Form && (
        <>
          {formType === 'Drawer' ? (
            <Drawer
              width={widthDrawer}
              onClose={() => {
                if (setVisibleState) {
                  model?.[setVisibleState](false);
                } else {
                  setVisibleForm(false);
                }
                onCloseForm && onCloseForm();
              }}
              destroyOnClose
              footer={false}
              bodyStyle={{ padding: 0 }}
              visible={visibleState ? model?.[visibleState] : visibleForm}
            >
              <Form />
            </Drawer>
          ) : (
            <Modal
              onCancel={() => {
                if (setVisibleState) {
                  model?.[setVisibleState](false);
                } else {
                  setVisibleForm(false);
                }
                onCloseForm && onCloseForm();
              }}
              width={widthDrawer}
              destroyOnClose
              footer={false}
              bodyStyle={{ padding: 20 }}
              visible={visibleState ? model?.[visibleState] : visibleForm}
            >
              <Form />
            </Modal>
          )}
        </>
      )}
    </Card>
  );
};

export default TableBase;
