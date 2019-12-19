import router from 'umi/router';
import React from 'react';
import { Table, Input, Form, Button, List, InputNumber, Radio, Checkbox, Row, Col } from 'antd';
import withRouter from 'umi/withRouter';
import styled from 'styled-components';

const FormItem = styled(Form.Item)`
  display: flex !important;
  .ant-form-item-control-wrapper {
    flex: 1;
  }
`;
const defaultPageSize = 15;

@withRouter
@Form.create()
class TableWithHandler extends React.Component {
  state = {
    search: '',
    pageSize: defaultPageSize,
    current: 1,
    loading: false,
  };

  componentDidMount() {
    setTimeout(this.load, 0);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      location: { search },
    } = nextProps;

    if (prevState.search !== search) {
      return { search };
    }

    return null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.search !== this.state.search) {
      setTimeout(this.load, 0);
    }
    return true;
  }

  handleTableChange = (pagination, filters, sorter) => {
    const { location } = this.props;

    const query = {
      current: pagination.current,
      pageSize: pagination.pageSize,
    };

    if (sorter.field) {
      query.sorter = JSON.stringify({
        field: sorter.field,
        order: sorter.order,
      });
    }

    if (filters.length > 0) {
      query.filters = JSON.stringify(filters);
    }

    query._t = new Date().valueOf();
    router.push({
      pathname: location.pathname,
      query,
    });
  };

  load = () => {
    const { location } = this.props;
    const { setFieldsValue } = this.props.form;

    const page = this.getCurrentPage();
    const pageSize = this.getPageSize();

    let sorter = {};
    let filters = [];
    try {
      sorter = JSON.parse(location.query.sorter);
      if (sorter.field.indexOf('.') !== -1) {
        const fields = sorter.field.split('.', 2);
        sorter.association = fields[0];
        sorter.field = fields[1];
      }

      if (!sorter.order) {
        sorter = {};
      }
    } catch (error) {}
    try {
      filters = JSON.parse(location.query.filters);
      if (filters.length > 0) {
        const values = {};
        for (const filter of filters) {
          values[filter.key] = filter.value;
        }
        setFieldsValue(values);
      }
    } catch (error) {}

    this.setState(
      {
        loading: true,
      },
      async () => {
        if (this.props.load) {
          try {
            filters = (filters || []).map(_ => {
              if (_.method === 'like') {
                _.value = `%${_.value}%`;
              }
              return _;
            });
            await this.props.load({
              sorter,
              filters,
              pageSize,
              page,
            });
          } finally {
            this.setState({
              loading: false,
            });
          }
        }
      },
    );
  };

  paginationPageChange = (page, pageSize) => {
    const { location } = this.props;
    let sorter = {};
    let filters = [];
    try {
      sorter = JSON.parse(location.query.sorter);
    } catch (error) {}
    try {
      filters = JSON.parse(location.query.filters);
    } catch (error) {}

    this.handleTableChange(
      {
        current: page,
        pageSize,
      },
      filters,
      sorter,
    );
  };

  handleReset = () => {
    this.props.form.resetFields();
    this.handleSearch();
  };

  getPageSize = () => {
    const { location } = this.props;
    return Number(this.props.pageSize || location.query.pageSize || defaultPageSize);
  };

  getCurrentPage = () => {
    const { location } = this.props;
    return Number(location.query.current || 1);
  };

  handleSearch = e => {
    e && e.preventDefault();
    const { filters = [], location } = this.props;

    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        const searchKeys = Object.keys(values).filter(key => typeof values[key] !== 'undefined');

        const searchData = searchKeys
          .map(key => {
            const filter = filters.find(i => i.key === key);
            if (!filter) {
              return undefined;
            }

            const _ = {
              key,
              value: values[key],
            };

            if (filter.type === 'like') {
              _.method = 'like';
            }

            return _;
          })
          .filter(_ => _ !== undefined);

        let sorter = {};
        try {
          sorter = JSON.parse(location.query.sorter);
        } catch (error) {}

        this.handleTableChange(
          {
            current: 1,
            pageSize: this.getPageSize(),
          },
          searchData,
          sorter,
        );
      }
    });
  };

  renderSearchComponent(data) {
    const { getFieldDecorator } = this.props.form;

    if (data.type === 'text' || data.type === 'like') {
      return <FormItem label={data.label}>{getFieldDecorator(data.key, {})(<Input />)}</FormItem>;
    }

    if (data.type === 'radio') {
      return (
        <FormItem label={data.label}>
          {getFieldDecorator(data.key, {})(<Radio.Group options={data.options} />)}
        </FormItem>
      );
    }

    if (data.type === 'checkbox') {
      return (
        <FormItem label={data.label}>
          {getFieldDecorator(data.key, {})(<Checkbox.Group options={data.options} />)}
        </FormItem>
      );
    }

    if (data.type === 'number') {
      const keys = Object.keys(data).filter(k => ['max', 'min', 'precision'].includes(k));

      return (
        <FormItem label={data.label}>
          {getFieldDecorator(
            data.key,
            {},
          )(<InputNumber style={{ width: '100%' }} {...keys.map(key => data[key])} />)}
        </FormItem>
      );
    }

    return null;
  }

  render() {
    const {
      componentType = 'table',
      bordered = true,
      rowKey = 'id',
      size = 'small',
      filters = [],
      location,
    } = this.props;
    const RenderComponent = componentType === 'list' ? List : Table;

    let pagination = false;

    if (this.props.pagination !== false) {
      pagination = {
        ...this.props.pagination,
        pageSize: this.getPageSize(),
        current: this.getCurrentPage(),
        total: this.props.data.count,
      };
    }

    const specialProps = {};

    if (componentType === 'list') {
      if (this.props.pagination !== false) pagination.onChange = this.paginationPageChange;
      specialProps.renderItem = this.props.renderItem;
      specialProps.grid = this.props.grid;
    }

    return (
      <div>
        {filters.length > 0 && (
          <Form onSubmit={this.handleSearch} style={{ margin: 18 }}>
            <Row gutter={16}>
              {filters.map(filter => {
                return (
                  <Col span={6} key={filter.key}>
                    {this.renderSearchComponent(filter)}
                  </Col>
                );
              })}
            </Row>

            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" htmlType="submit">
                  搜索
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                  重置
                </Button>
              </Col>
            </Row>
          </Form>
        )}
        <RenderComponent
          {...specialProps}
          expandedRowRender={this.props.expandedRowRender}
          size={size}
          rowKey={rowKey}
          bordered={bordered}
          loading={this.state.loading}
          dataSource={this.props.pagination !== false ? this.props.data.rows : this.props.data}
          pagination={pagination}
          onChange={this.handleTableChange}
          columns={this.props.columns.map(it => {
            if (it.sorter) {
              try {
                const sorter = JSON.parse(location.query.sorter);
                if (sorter.field === it.dataIndex) {
                  it.sortOrder = sorter.order;
                } else {
                  it.sortOrder = false;
                }
              } catch (error) {
                it.sortOrder = false;
              }
            }
            return it;
          })}
        />
      </div>
    );
  }
}

export default TableWithHandler;
