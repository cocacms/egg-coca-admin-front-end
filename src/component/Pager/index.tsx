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
import Action from '@/component/Action';
import Back from '@/component/Back';
import { history, useLocation } from 'umi';

import { FormInstance } from 'antd/lib/form';
import { Box } from './form';
import Editor from './editor';

import { useTableList, useDelete } from './hook';

export interface PagerInstance {
  onDelete: () => void;
  onCreate: () => void;
  onEdit: () => void;
}
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
        <Col md={12} xl={6}>
          <SearchItem
            data={{
              type: 'text',
              key: 'id',
              label: 'ID',
            }}
          />
        </Col>
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

export interface PagerProps {
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
    [index: string]: any;
  };
}

const Pager: React.ForwardRefRenderFunction<unknown, PagerProps> = (
  {
    model,
    type = 'table',
    createable = true,
    name,
    filters = [],
    bordered = true,
    table = {},
    list = {},
    query = {},
  },
  ref,
) => {
  const { rowKey = 'id', columns = [], editable = true, deleteable = true, actions = [] } = table;
  const location = useLocation();
  /**
   * table数据请求部分
   */
  const [form] = Form.useForm();
  const { tableProps, params, refresh, search } = useTableList(model, filters, form, query);
  const { sorter = {} } = params[0] || ({} as any);
  const { submit, reset } = search;

  /**
   * 删除
   */

  const deleteAction = useDelete(model);

  const onDelete = async (id: string) => {
    const result = await deleteAction.run(id);
    if (result instanceof Error) return;
    await refresh();
    message.success('删除成功');
  };

  /**
   * 创建
   */
  const onCreate = async () => {
    history.push(`${location.pathname}/0`);
  };

  /**
   * 编辑
   * @param id
   */
  const onEdit = async (id: string) => {
    history.push(`${location.pathname}/${id}`);
  };

  React.useImperativeHandle(ref, () => ({
    onDelete,
    onCreate,
    onEdit,
  }));

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
          {...list}
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
      <FilterBar filters={filters} submit={submit} reset={reset} form={form} />
      <Table bordered={bordered} columns={column_props()} rowKey={rowKey} {...tableProps} />
    </Box>
  );
};

export default React.forwardRef<PagerInstance, PagerProps>(Pager);
