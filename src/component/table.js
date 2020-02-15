import router from 'umi/router';
import React from 'react';
import {
  Table,
  Input,
  Form,
  Button,
  List,
  InputNumber,
  Radio,
  Checkbox,
  Row,
  Col,
  Select,
  DatePicker,
  Tooltip,
  Icon,
} from 'antd';
import moment from 'moment';
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
      page: pagination.current,
      pageSize: pagination.pageSize,
    };

    if (sorter.field && sorter.order) {
      query.order = JSON.stringify([sorter.field, sorter.order === 'ascend' ? 'asc' : 'desc']);
    }

    if (location.query.where) query.where = location.query.where;
    query._t = new Date().valueOf();

    router.push({
      pathname: location.pathname,
      query,
    });
  };

  paginationPageChange = (page, pageSize) => {
    const { location } = this.props;
    router.push({
      pathname: location.pathname,
      query: {
        ...location.query,
        page,
        pageSize,
      },
    });
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
    return Number(location.query.page || 1);
  };

  handleSearch = e => {
    e && e.preventDefault();
    const { location } = this.props;

    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        const query = {
          page: 1,
          pageSize: this.getPageSize(),
        };

        if (location.query.order) query.order = location.query.order;
        query.where = JSON.stringify(values);
        query._t = new Date().valueOf();

        router.push({
          pathname: location.pathname,
          query,
        });
      }
    });
  };

  handleWhere = (where = {}) => {
    const { filters = [] } = this.props;

    for (const key in where) {
      if (where.hasOwnProperty(key)) {
        const value = where[key];
        const filter = filters.find(i => i.key === key);
        if (filter) {
          if (filter.type === 'like') {
            where[key] = {
              $like: `%${value}%`,
            };
          }

          if (filter.type === 'date') {
            where[key] = {
              $between: value,
            };
          }
        }
      }
    }
    return where;
  };

  hanldeFilterValue = (where = {}) => {
    const { filters = [] } = this.props;
    for (const key in where) {
      if (where.hasOwnProperty(key)) {
        const value = where[key];
        const filter = filters.find(i => i.key === key);
        if (filter) {
          if (filter.type === 'date' && Array.isArray(value)) {
            where[key] = value.map(i => moment(i));
          }
        }
      }
    }
    return where;
  };

  load = async () => {
    const { location, load, form } = this.props;
    if (load) {
      let where = {};

      this.setState({
        loading: true,
      });
      try {
        where = JSON.parse(location.query.where);
      } catch (error) {
        where = {};
      }

      try {
        form.setFieldsValue(this.hanldeFilterValue(where));
        await load({
          ...location.query,
          where: this.handleWhere(where),
        });
      } finally {
        this.setState({
          loading: false,
        });
      }
    }
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

    if (data.type === 'date') {
      return (
        <FormItem label={data.label}>
          {getFieldDecorator(
            data.key,
            {},
          )(<DatePicker.RangePicker {...(data.props || {})} style={{ width: '100%' }} />)}
        </FormItem>
      );
    }

    if (data.type === 'select') {
      return (
        <FormItem label={data.label}>
          {getFieldDecorator(
            data.key,
            {},
          )(
            <Select>
              {(data.options || []).map(i => (
                <Select.Option key={i.value} value={i.value}>
                  {i.label}
                </Select.Option>
              ))}
            </Select>,
          )}
        </FormItem>
      );
    }

    if (data.component) {
      return (
        <FormItem label={data.label}>{getFieldDecorator(data.key, {})(data.component)}</FormItem>
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
            <Row gutter={16} type="flex">
              {filters.map(filter => {
                return (
                  <Col md={12} xl={6} key={filter.key}>
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
                const order = JSON.parse(location.query.order);
                if (Array.isArray(order) && order.length === 2 && order[0] === it.dataIndex) {
                  it.sortOrder = order[1] === 'desc' ? 'descend' : 'ascend';
                }
              } catch (error) {
                it.sortOrder = false;
              }
            }
            if (it.help && typeof it.title === 'string') {
              it.title = (
                <Tooltip title={it.help}>
                  {it.title} <Icon type="question-circle" />
                </Tooltip>
              );
            }
            return it;
          })}
        />
      </div>
    );
  }
}

export default TableWithHandler;
