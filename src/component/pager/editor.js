import React from 'react';
import {
  Form,
  Input,
  Checkbox,
  Button,
  Divider,
  message,
  Skeleton,
  Radio,
  InputNumber,
  Switch,
  Select,
  Icon,
  Tooltip,
} from 'antd';
import { Box, formItemLayout, tailFormItemLayout } from '@/component/form';
import RichEditor from '@/component/editor';
import Upload from '@/component/upload';
import Back from '@/component/back';

import { MobXProviderContext, Observer } from 'mobx-react';

import router from 'umi/router';
import withRouter from 'umi/withRouter';
import _ from 'loadsh';

const FormItem = Form.Item;

@withRouter
@Form.create()
class Edit extends React.Component {
  static contextType = MobXProviderContext;

  get model() {
    const { model } = this.props;
    return this.context[model];
  }

  componentDidMount() {
    const { key = 'id' } = this.props;
    const id = this.props.match.params[key];
    if (id !== '0') {
      this.load();
    }
  }

  componentWillUnmount() {
    this.model.clear('current', {});
  }

  handleSubmit = e => {
    e.preventDefault();
    if (!this.model) return;
    const { hook = {}, links = [], key = 'id', location } = this.props;
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        if (typeof hook.before === 'function') {
          values = hook.before(values);
        }
        let result;

        const id = this.props.match.params[key];

        if (id !== '0') {
          result = await this.model.update(id, values, {
            links,
          });
        } else {
          result = await this.model.create(values, {
            links,
          });
        }
        if (typeof hook.after === 'function') {
          hook.after(result);
        }
        message.success('操作成功！');

        if (location.query.back !== '0') router.goBack();
      }
    });
  };

  load = async () => {
    const { query = {}, key = 'id' } = this.props;
    const id = this.props.match.params[key];
    await this.model.show(id, {
      ...query,
    });
  };

  getFormProps = (props = {}, data = {}) => {
    if (typeof props === 'function') return props(data);
    return props;
  };

  getFormInitialValue = (key, data = {}, defaultValue, initialValue) => {
    const { key: primaryKey = 'id' } = this.props;
    const isUpdate = this.props.match.params[primaryKey] !== '0';
    if (typeof initialValue === 'function') {
      return initialValue(isUpdate, data[key], data);
    } else if (typeof initialValue !== 'undefined') {
      return initialValue;
    }
    return isUpdate ? _.get(data, key) : defaultValue;
  };

  getFormOptions = (options = []) => {
    if (typeof options === 'function') return options();
    return options;
  };

  renderForm(data) {
    const { current = {} } = this.model;
    const { getFieldDecorator } = this.props.form;

    let field;
    if (data.type === 'string') {
      field = getFieldDecorator(data.key, {
        initialValue: this.getFormInitialValue(data.key, current, '', data.initialValue),
        onChange: data.onChange,
        rules: [
          ...(data.required
            ? [
                {
                  type: 'string',
                  required: true,
                  message: `请输入${data.label}`,
                },
              ]
            : []),
          ...(data.rules || []),
        ],
      })(<Input {...this.getFormProps(data.props, current)} />);
    }

    if (data.type === 'text') {
      field = getFieldDecorator(data.key, {
        initialValue: this.getFormInitialValue(data.key, current, '', data.initialValue),
        onChange: data.onChange,
        rules: [
          ...(data.required
            ? [
                {
                  type: 'string',
                  required: true,
                  message: `请输入${data.label}`,
                },
              ]
            : []),
          ...(data.rules || []),
        ],
      })(<Input.TextArea {...this.getFormProps(data.props, current)} autoSize={{ minRows: 5 }} />);
    }

    if (data.type === 'radio') {
      field = getFieldDecorator(data.key, {
        initialValue: this.getFormInitialValue(data.key, current, '', data.initialValue),
        onChange: data.onChange,
        rules: [
          ...(data.required
            ? [
                {
                  type: 'string',
                  required: true,
                  message: `请选择${data.label}`,
                },
              ]
            : []),
          ...(data.rules || []),
        ],
      })(
        <Radio.Group
          {...this.getFormProps(data.props, current)}
          options={this.getFormOptions(data.options)}
        />,
      );
    }

    if (data.type === 'checkbox') {
      field = getFieldDecorator(data.key, {
        initialValue: this.getFormInitialValue(data.key, current, [], data.initialValue),
        onChange: data.onChange,
        rules: [
          ...(data.required
            ? [
                {
                  type: 'array',
                  required: true,
                  message: `请选择${data.label}`,
                },
              ]
            : []),
          ...(data.rules || []),
        ],
      })(
        <Checkbox.Group
          {...this.getFormProps(data.props, current)}
          options={this.getFormOptions(data.options)}
        />,
      );
    }

    if (data.type === 'select') {
      field = getFieldDecorator(data.key, {
        initialValue: this.getFormInitialValue(data.key, current, [], data.initialValue),
        onChange: data.onChange,
        rules: [
          ...(data.required
            ? [
                {
                  type: 'array',
                  required: true,
                  message: `请选择${data.label}`,
                },
              ]
            : []),
          ...(data.rules || []),
        ],
      })(
        <Select showSearch {...this.getFormProps(data.props, current)}>
          {this.getFormOptions(data.options).map(i => (
            <Select.Option />
          ))}
        </Select>,
      );
    }

    if (data.type === 'number') {
      field = getFieldDecorator(data.key, {
        initialValue: this.getFormInitialValue(data.key, current, '', data.initialValue),
        onChange: data.onChange,
        rules: [
          ...(data.required
            ? [
                {
                  type: 'number',
                  required: true,
                  message: `请输入${data.label}`,
                },
              ]
            : []),
          ...(data.rules || []),
        ],
      })(<InputNumber {...this.getFormProps(data.props, current)} />);
    }

    if (data.type === 'switch') {
      field = getFieldDecorator(data.key, {
        initialValue: this.getFormInitialValue(data.key, current, false, data.initialValue),
        valuePropName: 'checked',
        onChange: data.onChange,
        rules: [
          ...(data.required
            ? [
                {
                  type: 'boolean',
                  required: true,
                  message: `请设置${data.label}`,
                },
              ]
            : []),
          ...(data.rules || []),
        ],
      })(<Switch {...this.getFormProps(data.props, current)} />);
    }

    if (data.type === 'img') {
      const props = this.getFormProps(data.props, current);
      field = getFieldDecorator(data.key, {
        initialValue: this.getFormInitialValue(data.key, current, [], data.initialValue),
        onChange: data.onChange,
        rules: [
          ...(data.required
            ? [
                {
                  type: props.max === 1 ? 'string' : 'array',
                  required: true,
                  message: `请上传${data.label}`,
                },
              ]
            : []),
          ...(data.rules || []),
        ],
      })(<Upload {...props} />);
    }

    if (data.type === 'rich') {
      field = getFieldDecorator(data.key, {
        initialValue: this.getFormInitialValue(data.key, current, '', data.initialValue),
        onChange: data.onChange,
        rules: [
          ...(data.required
            ? [
                {
                  type: 'string',
                  required: true,
                  message: `请输入${data.label}`,
                },
              ]
            : []),
          ...(data.rules || []),
        ],
      })(<RichEditor {...this.getFormProps(data.props, current)} />);
    }

    if (data.type === 'hidden') {
      return (
        <div key={data.key}>
          {getFieldDecorator(data.key, {
            initialValue: this.getFormInitialValue(data.key, current, null, data.initialValue),
            onChange: data.onChange,
            rules: [
              ...(data.required
                ? [
                    {
                      type: data.dataType || 'string',
                      required: true,
                      message: `请输入${data.label}`,
                    },
                  ]
                : []),
              ...(data.rules || []),
            ],
          })(<div />)}
        </div>
      );
    }
    if (data.component) {
      field = getFieldDecorator(data.key, {
        initialValue: this.getFormInitialValue(data.key, current, null, data.initialValue),
        onChange: data.onChange,
        rules: [
          ...(data.required
            ? [
                {
                  type: data.dataType || 'string',
                  required: true,
                  message: `请输入${data.label}`,
                },
              ]
            : []),
          ...(data.rules || []),
        ],
      })(data.component);
    }

    if (field) {
      return (
        <FormItem
          label={
            data.help ? (
              <Tooltip title={data.help}>
                {data.label} <Icon type="question-circle" />
              </Tooltip>
            ) : (
              data.label
            )
          }
          key={data.key}
        >
          {field}
        </FormItem>
      );
    }
    return null;
  }

  renderName() {
    const { name } = this.props;
    if (typeof name === 'function' && !React.isValidElement(name)) {
      return name();
    }
    return name;
  }

  render() {
    const { forms = [], key = 'id', model, children } = this.props;
    const isUpdate = this.props.match.params[key] !== '0';

    return (
      <MobXProviderContext.Consumer>
        {stores => (
          <Observer
            render={() => (
              <Box>
                <h1>
                  <Back type="arrow-left" onClick={() => router.goBack()} />{' '}
                  {!isUpdate ? '添加' : '编辑'}
                  {this.renderName()}
                </h1>
                <Divider />
                {children}

                {isUpdate && !stores[model].current.id ? (
                  <Skeleton active />
                ) : (
                  <Form {...formItemLayout}>
                    {forms.map(item => this.renderForm(item))}

                    <Form.Item {...tailFormItemLayout}>
                      <Button onClick={this.handleSubmit} type="primary">
                        提交
                      </Button>
                    </Form.Item>
                  </Form>
                )}
              </Box>
            )}
          />
        )}
      </MobXProviderContext.Consumer>
    );
  }
}

export default Edit;
