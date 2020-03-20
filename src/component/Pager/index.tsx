import React from 'react';
import styled from 'styled-components';
import {
  Divider,
  message,
  Input,
  Form,
  Button,
  List,
  InputNumber,
  Radio,
  Checkbox,
  Table,
  Row,
  Col,
  Select,
  DatePicker,
} from 'antd';
import { useFormTable, useRequest } from '@umijs/hooks';
import Action from '@/component/Action';
import Back from '@/component/Back';
import axios from '@/util/axios';
import { history, withRouter } from 'umi';
import { IRouteComponentProps } from '@/index';

import { FormInstance } from 'antd/lib/form';
import moment from 'moment';
import { Box } from './form';
import Editor from './editor';
export { Editor, Box };

const FormItem = styled(Form.Item)`
  display: flex !important;
  .ant-form-item-control-wrapper {
    flex: 1;
  }
`;

const SearchItem: React.FC<{ data: ICocaFilter }> = ({ data }) => {
  if (data.type === 'text' || data.type === 'like') {
    return (
      <FormItem name={data.key} label={data.label}>
        <Input />
      </FormItem>
    );
  }

  if (data.type === 'radio') {
    return (
      <FormItem name={data.key} label={data.label}>
        <Radio.Group options={data.options} />
      </FormItem>
    );
  }

  if (data.type === 'checkbox') {
    return (
      <FormItem name={data.key} label={data.label}>
        <Checkbox.Group options={data.options} />
      </FormItem>
    );
  }

  if (data.type === 'number') {
    return (
      <FormItem name={data.key} label={data.label}>
        <InputNumber style={{ width: '100%' }} {...(data.props || {})} />
      </FormItem>
    );
  }

  if (data.type === 'date') {
    return (
      <FormItem name={data.key} label={data.label}>
        <DatePicker.RangePicker
          {...(data.props || {})}
          style={{ width: '100%' }}
          format="YYYY-MM-DD"
        />
      </FormItem>
    );
  }

  if (data.type === 'select') {
    return (
      <FormItem name={data.key} label={data.label}>
        <Select>
          {(data.options || []).map((i: ICocaOption) => (
            <Select.Option key={i.value} value={i.value}>
              {i.label}
            </Select.Option>
          ))}
        </Select>
      </FormItem>
    );
  }

  if (data.component) {
    return (
      <FormItem name={data.key} label={data.label}>
        {data.component}
      </FormItem>
    );
  }

  return null;
};

const FilterBar: React.FC<{
  submit: () => void;
  reset: () => void;
  filters?: ICocaFilter[];
  form: FormInstance;
}> = ({ submit, reset, filters = [], form }) => {
  return (
    <Form onReset={reset} onFinish={submit} form={form} style={{ margin: 18 }}>
      <Row gutter={16}>
        {filters.map((filter: ICocaFilter) => {
          return (
            <Col md={12} xl={6} key={filter.key}>
              <SearchItem data={filter} />
            </Col>
          );
        })}
      </Row>

      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button type="primary" htmlType="submit">
            搜索
          </Button>
          <Button style={{ marginLeft: 8 }} htmlType="reset">
            重置
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

const Header: React.FC<{
  name: string | React.ReactNode;
  createable?: boolean;
  onCreate?: () => void;
}> = ({ name, createable = true, onCreate }) => {
  return (
    <Row justify="space-between">
      <Col>
        <h1>
          <Back show={false} />
          {name}管理
        </h1>
      </Col>
      <Col style={{ textAlign: 'right' }}>
        {createable && (
          <Button onClick={onCreate} type="primary">
            创建{name}
          </Button>
        )}
      </Col>
    </Row>
  );
};

const handleParams = ({ current, pageSize, sorter: s, filters: f }: any, formData: Object) => {
  const params: any = { page: current, pageSize };
  if (s?.field && s?.order) {
    params.order = JSON.stringify([s?.field, s?.order === 'descend' ? 'desc' : 'asc']);
  }
  if (formData) {
    const where: any = {};
    Object.entries(formData).forEach(([filed, value]) => {
      where[filed] = value;
    });
    params.where = where;
  }

  return params;
};

const handleWhere = (filters: ICocaFilter[] = [], where: any = {}) => {
  for (const key in where) {
    if (where.hasOwnProperty(key) && where[key]) {
      const value = where[key];
      const filter = filters.find((i: ICocaFilter) => i.key === key);
      if (filter) {
        if (filter.type === 'like') {
          where[key] = {
            $like: `%${value}%`,
          };
        }

        if (filter.type === 'date') {
          where[key] = {
            $between: [
              moment(value[0]).format('YYYY-MM-DD 00:00:00'),
              moment(value[1]).format('YYYY-MM-DD 23:59:59'),
            ],
          };
        }
      }
    }
  }
  return where;
};

const formatResult = (response: any) => {
  const { data } = response;
  return {
    total: data.count,
    list: data.rows,
  };
};

const Pager: React.FC<{
  model: string;
  type?: 'table' | 'list';
  name: string | React.ReactNode;
  filters?: ICocaFilter[];
  createable?: boolean;
  bordered?: boolean;
  query?: any;
  table?: {
    rowKey?: string;
    columns: ICocaColumn[];
    editable?: boolean;
    deleteable?: boolean;
    actions?: ICocaAction[] | ((record: any) => ICocaAction[]);
  };

  list?: {
    renderItem?: (item: any) => React.ReactNode;
    grid?: any;
  };
} & IRouteComponentProps> = ({
  model,
  type = 'table',
  createable = true,
  name,
  filters = [],
  bordered = true,
  table = {},
  list = {},
  query = {},
  location,
}) => {
  const { rowKey = 'id', columns = [], editable = true, deleteable = true, actions = [] } = table;
  const { renderItem, grid } = list;

  /**
   * table数据请求部分
   */
  const [form] = Form.useForm();
  const { tableProps, params, refresh, search } = useFormTable(
    (pginatedParams: any, formData: Object) => {
      const params = handleParams(pginatedParams, formData);
      params.where = JSON.stringify(handleWhere(filters, params.where));
      return axios.get(`${process.env.APIPREFIX}/${model}`, {
        params: {
          ...params,
          ...query,
        },
      });
    },
    {
      cacheKey: `tablelist_${model}`,
      form,
      defaultPageSize: 20,
      formatResult: formatResult,
    },
  );

  const { sorter = {} } = params[0] || ({} as any);
  const { submit, reset } = search;

  /**
   * 删除
   */

  const deleteAction = useRequest(
    (id: string) => axios.delete(`${process.env.APIPREFIX}/${model}/${id}`),
    {
      manual: true,
      fetchKey: id => id,
    },
  );

  const onDelete = async (id: string) => {
    await deleteAction.run(id);
    await refresh();
    message.success('删除成功');
  };

  /**
   * 创建
   */
  const onCreate = () => {
    history.push(`${location.pathname}/0`);
  };

  /**
   * 编辑
   * @param id
   */
  const onEdit = (id: number) => {
    history.push(`${location.pathname}/${id}`);
  };

  /**
   * 表哥数据格式定义
   */
  const column_props = () => {
    const columns_result = [
      {
        width: 100,
        title: 'ID',
        dataIndex: 'id',
        sorter: true,
        sortOrder: sorter.field === 'id' && sorter.order,
        render: (text: any) => (text ? text : '-'),
      },
      ...columns.map(column => {
        if (column.sorter) {
          column.sortOrder = sorter.field === column.dataIndex && sorter.order;
        }
        return column;
      }),
    ];

    if (
      Array.isArray(actions) &&
      actions.length === 0 &&
      editable === false &&
      deleteable === false
    ) {
      return columns_result;
    }

    columns_result.push({
      title: '操作',
      key: 'action',
      render: (text, record) => {
        return <Action action={action_props(record)} />;
      },
    });
    return columns_result;
  };

  const action_props = (record: any) => {
    let result = [];

    if (editable) {
      result.push({
        key: 'edit',
        title: '编辑',
        onClick: () => {
          onEdit(record.id);
        },
      });
    }

    let user_actions: ICocaAction[] = [];
    if (Array.isArray(actions)) user_actions = actions;
    if (typeof actions === 'function') user_actions = actions(record);
    for (const action of user_actions) {
      result.push(action);
    }

    if (deleteable) {
      result.push({
        key: 'delete',
        title: '删除',
        danger: true,
        loading: deleteAction.fetches[record.id]?.loading,
        confirm: '删除后数据将不能恢复！请谨慎操作！',
        onClick: () => {
          onDelete(record.id);
        },
      });
    }
    return result;
  };

  if (type === 'list') {
    return (
      <Box>
        <Header name={name} createable={createable} onCreate={onCreate} />
        <Divider />
        {filters.length > 0 && (
          <FilterBar filters={filters} submit={submit} reset={reset} form={form} />
        )}
        <List
          renderItem={renderItem}
          grid={grid}
          bordered={bordered}
          {...tableProps}
          pagination={{
            ...tableProps.pagination,
            onChange: (page, pageSize) => {
              tableProps.onChange({
                current: page,
                pageSize,
              });
            },
          }}
        />
      </Box>
    );
  }

  return (
    <Box>
      <Header name={name} createable={createable} onCreate={onCreate} />
      <Divider />
      {filters.length > 0 && (
        <FilterBar filters={filters} submit={submit} reset={reset} form={form} />
      )}
      <Table bordered={bordered} columns={column_props()} rowKey={rowKey} {...tableProps} />
    </Box>
  );
};
export default withRouter(Pager);
