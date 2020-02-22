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
import { FormComponentProps } from 'antd/es/form';

import { Box, formItemLayout, tailFormItemLayout } from './form';
import RichEditor from '@/component/RichEditor';
import Upload from '@/component/Upload';
import Back from '@/component/Back';

import { MobXProviderContext, Observer } from 'mobx-react';
import { IRouteComponentProps } from '@/index';
import _ from 'loadsh';

import router from 'umi/router';
import withRouter from 'umi/withRouter';

const FormItem = Form.Item;

interface Hook {
  before: (value: any) => any;
  after: (value: any) => void;
}

interface RouterInfo {
  [propName: string]: any;
}

interface ICocaEditorProps extends IRouteComponentProps<RouterInfo> {
  form: FormComponentProps['form'];
  forms: ICocaForm[];
  name: string | React.ReactNode | (() => React.ReactNode);
  model: string;
  key?: string;
  hook?: Hook;
  links?: string[];
  query?: any;
}

class Edit extends React.Component<ICocaEditorProps> {
  static contextType = MobXProviderContext;

  get model() {
    const { model } = this.props;
    return this.context[model];
  }

  componentDidMount() {
    const { key = 'id' } = this.props;
    const id: string = this.props.match.params[key];
    if (id !== '0') {
      this.load();
    }
  }

  componentWillUnmount() {
    this.model.reset('current', {});
  }

  handleSubmit = (event: React.MouseEvent) => {
    console.log('1');
    if (!this.model) return;
    const { hook, links, key = 'id', location } = this.props;
    this.props.form.validateFieldsAndScroll(async (err: any, values: any) => {
      if (!err) {
        values = hook?.before(values);
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

        hook?.after(result);

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

  getFormProps = (props: any | ((data: any) => any), data = {}) => {
    if (typeof props === 'function') return props(data);
    return props || {};
  };

  getFormInitialValue = (
    key: string,
    data: any = {},
    defaultValue: any,
    initialValue: any | ((data: any) => any),
  ) => {
    const { key: primaryKey = 'id' } = this.props;
    const isUpdate = this.props.match.params[primaryKey] !== '0';
    if (typeof initialValue === 'function') {
      return initialValue(isUpdate, data[key], data);
    } else if (typeof initialValue !== 'undefined') {
      return initialValue;
    }
    return isUpdate ? _.get(data, key) : defaultValue;
  };

  getFormOptions = (options?: ICocaOption[] | (() => ICocaOption[])) => {
    if (!options) return [];
    if (typeof options === 'function') return options();
    return options as ICocaOption[];
  };

  renderForm(data: ICocaForm) {
    const { current = {} } = this.model;
    const { getFieldDecorator } = this.props.form;

    let field;
    if (data.type === 'string') {
      field = getFieldDecorator(data.key, {
        initialValue: this.getFormInitialValue(data.key, current, '', data.initialValue),
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
                  <Back /> {!isUpdate ? '添加' : '编辑'}
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

export default withRouter(Form.create<ICocaEditorProps>()(Edit));
