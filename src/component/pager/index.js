import React from 'react';
import { inject, observer } from 'mobx-react';
import { Box } from '@/component/form';
import More from '@/component/more';
import Table from '@/component/table';
import Back from '@/component/back';
import { Divider, Row, Col, Button, message, Modal } from 'antd';
import router from 'umi/router';

import editor from './editor';
export { editor };

export default Class => {
  class Pager extends React.Component {
    state = {
      query: {},
    };

    defaultColums = [];
    componentDidMount() {
      this.callable(this.obj.componentDidMount);
    }

    callable = (func, ...args) => {
      if (typeof func === 'function') return func.apply(this, args);
      return null;
    };

    columns() {
      const {
        columns = [],
        editable = true,
        deleteable = true,
        action_display_all = false,
        action_width = 180,
        action = [],
      } = this.config;
      const columns_result = [
        {
          width: 100,
          title: 'ID',
          dataIndex: 'id',
          sorter: true,
          render: text => (text ? text : '-'),
        },
        ...columns,
      ];
      if (
        Array.isArray(action) &&
        action.length === 0 &&
        editable === false &&
        deleteable === false
      ) {
        return columns_result;
      }
      columns_result.push({
        width: action_width,
        title: '操作',
        key: 'action',
        render: (text, record) => {
          const _col = this.actions(record);
          return (
            <More
              hide={!action_display_all}
              action={[
                editable
                  ? {
                      key: 'edit',
                      title: '编辑',
                      onClick: () => {
                        router.push(`${this.props.location.pathname}/${record.id}`);
                      },
                    }
                  : null,
                ..._col,
                deleteable
                  ? {
                      key: 'delete',
                      title: '删除',
                      color: 'red',
                      onClick: () => {
                        Modal.confirm({
                          title: '警告',
                          content: '删除后数据将不能恢复！请谨慎操作！',
                          okType: 'danger',
                          okText: '确认删除',
                          onOk: () => {
                            this.destroy(record.id);
                          },
                        });
                      },
                    }
                  : null,
              ]}
            />
          );
        },
      });
      return columns_result;
    }

    actions(record) {
      const { action = [] } = this.config;
      let actions = [];
      if (Array.isArray(action)) actions = action;
      if (typeof action === 'function') actions = action(record);
      actions = actions.map(i => {
        if (i.onClick) {
          return {
            ...i,
            onClick: i.onClick.bind(this, record),
          };
        }
        return i;
      });
      return actions;
    }

    load = async data => {
      const { pagination = {}, query_inject = {} } = this.config;
      if (this.props[this.model]) {
        const method = pagination === false ? 'all' : 'index';
        await this.props[this.model][method]({
          ...data,
          ...query_inject,
        });
      }
    };

    reload = () => {
      const { location } = this.props;
      router.push({
        pathname: location.pathname,
        query: {
          ...location.query,
          _t: new Date().valueOf(),
        },
      });
    };

    goCreate = () => {
      router.push(`${this.props.location.pathname}/0`);
    };

    destroy = async id => {
      if (this.props[this.model]) {
        await this.props[this.model].destroy(id);
        message.success('删除成功！');
        await this.reload();
      }
    };

    render() {
      const {
        name,
        componentType = 'table',
        pagination = {},
        filters = [],
        createable = true,
      } = this.config;
      const target = this.props[this.model];
      const { list = {}, list_all = [] } = target || {};
      return (
        <Box>
          <Row type="flex" justify="space-between">
            <Col>
              <h1>
                <Back show={false} />
                {typeof name === 'function' ? this.callable(name) : name}管理
              </h1>
            </Col>
            <Col>
              {createable && (
                <Button type="primary" onClick={this.goCreate}>
                  创建{typeof name === 'function' ? this.callable(name) : name}
                </Button>
              )}
            </Col>
          </Row>
          <Divider />
          {this.obj.render && this.callable(this.obj.render)}

          <Table
            load={this.load}
            componentType={componentType}
            pagination={pagination}
            rowKey="id"
            data={pagination !== false ? list : list_all}
            columns={this.columns()}
            filters={filters}
          />
        </Box>
      );
    }
  }

  @inject(Class.model, ...(Class.inject || []))
  @observer
  class RegisterComponent extends Pager {
    constructor() {
      super();
      const obj = new Class();
      this.obj = obj;
      this.config = obj.config;
      this.model = Class.model;
    }
  }

  return RegisterComponent;
};
