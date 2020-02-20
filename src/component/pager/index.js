import React from 'react';
import { MobXProviderContext, Observer } from 'mobx-react';
import { Box } from '@/component/form';
import More from '@/component/more';
import Table from '@/component/table';
import Back from '@/component/back';
import { Divider, Row, Col, Button, message, Modal } from 'antd';
import router from 'umi/router';
import withRouter from 'umi/withRouter';

import Editor from './editor';
export { Editor };

@withRouter
class Pager extends React.Component {
  static contextType = MobXProviderContext;

  get model() {
    const { model } = this.props;
    return this.context[model];
  }

  goCreate = () => {
    router.push(`${this.props.location.pathname}/0`);
  };

  columns() {
    const {
      columns = [],
      editable = true,
      deleteable = true,
      action_width = 180,
      action = [],
    } = this.props;

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
        return <More action={this.actions(record)} />;
      },
    });
    return columns_result;
  }

  actions(record) {
    const { actions = [], editable = true, deleteable = true } = this.props;

    let result = [];
    if (editable) {
      result.push({
        key: 'edit',
        title: '编辑',
        onClick: () => {
          router.push(`${this.props.location.pathname}/${record.id}`);
        },
      });
    }
    let user_actions = [];
    if (Array.isArray(actions)) user_actions = actions;
    if (typeof actions === 'function') user_actions = actions(record);
    for (const action of user_actions) {
      result.push(action);
    }

    if (deleteable) {
      result.push({
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
      });
    }

    return result;
  }

  load = async data => {
    const { pagination = {}, query = {} } = this.props;

    if (this.model) {
      const method = pagination === false ? 'all' : 'index';
      await this.model[method]({
        ...data,
        ...query,
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

  destroy = async id => {
    if (this.model) {
      await this.propsmodel.destroy(id);
      message.success('删除成功！');
      await this.reload();
    }
  };

  renderName() {
    const { name } = this.props;

    if (typeof name === 'function' && !React.isValidElement(name)) {
      return name();
    }

    return name;
  }

  render() {
    const {
      createable = true,
      pagination = {},
      componentType = 'table',
      filters = [],
      children,
      model,
    } = this.props;

    return (
      <MobXProviderContext.Consumer>
        {stores => {
          return (
            <Observer
              render={() => (
                <Box>
                  <Row type="flex" justify="space-between">
                    <Col>
                      <h1>
                        <Back show={false} />
                        {this.renderName()}管理
                      </h1>
                    </Col>
                    <Col>
                      {createable && (
                        <Button type="primary" onClick={this.goCreate}>
                          创建{this.renderName()}
                        </Button>
                      )}
                    </Col>
                  </Row>
                  <Divider />

                  {children}

                  <Table
                    load={this.load}
                    componentType={componentType}
                    pagination={pagination}
                    rowKey="id"
                    data={pagination !== false ? stores[model].list : stores[model].list_all}
                    columns={this.columns()}
                    filters={filters}
                  />
                </Box>
              )}
            />
          );
        }}
      </MobXProviderContext.Consumer>
    );
  }
}

export default Pager;
