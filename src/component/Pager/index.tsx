import React from 'react';
import { MobXProviderContext, Observer } from 'mobx-react';
import Action from '@/component/Action';
import Table from '@/component/Table';
import Back from '@/component/Back';
import { Divider, Row, Col, Button, message, Modal } from 'antd';
import { history, withRouter } from 'umi';
import { IRouteComponentProps } from '@/index';

import { Box } from './form';
import Editor from './editor';
export { Editor, Box };

interface ICocaPager extends IRouteComponentProps {
  model: string;
  name: string | React.ReactNode | (() => React.ReactNode);
  componentType?: 'list' | 'table';
  columns: ICocaColumn[];
  actions?: ICocaAction[] | ((record: any) => ICocaAction[]);
  filters?: ICocaFilter[];
  editable?: boolean;
  deleteable?: boolean;
  createable?: boolean;
  query?: any;
  pagination?: boolean;
  action_width?: number;
}

class Pager extends React.Component<ICocaPager> {
  static contextType = MobXProviderContext;

  get model() {
    const { model } = this.props;
    return this.context[model];
  }

  goCreate = () => {
    history.push(`${this.props.location.pathname}/0`);
  };

  columns() {
    const {
      columns = [],
      editable = true,
      deleteable = true,
      action_width = 180,
      actions = [],
    } = this.props;

    const columns_result = [
      {
        width: 100,
        title: 'ID',
        dataIndex: 'id',
        sorter: true,
        render: (text: any) => (text ? text : '-'),
      },
      ...columns,
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
      width: action_width,
      title: '操作',
      key: 'action',
      render: (text, record) => {
        return <Action action={this.actions(record)} />;
      },
    });
    return columns_result;
  }

  actions(record: any) {
    const { actions = [], editable = true, deleteable = true } = this.props;

    let result = [];
    if (editable) {
      result.push({
        key: 'edit',
        title: '编辑',
        onClick: () => {
          history.push(`${this.props.location.pathname}/${record.id}`);
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

  load = async (parmas: any) => {
    const { pagination = {}, query = {} } = this.props;

    if (this.model) {
      const method = pagination === false ? 'all' : 'index';
      await this.model[method]({
        ...parmas,
        ...query,
      });
    }
  };

  reload = () => {
    const { location } = this.props;
    history.push({
      pathname: location.pathname,
      query: {
        ...location.query,
        _t: new Date().valueOf(),
      },
    });
  };

  destroy = async (id: number) => {
    if (this.model) {
      await this.model.destroy(id);
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
                  <Row justify="space-between">
                    <Col>
                      <h1>
                        <Back show={false} />
                        {this.renderName()}管理
                      </h1>
                    </Col>
                    <Col style={{ textAlign: 'right' }}>
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

export default withRouter(Pager);
