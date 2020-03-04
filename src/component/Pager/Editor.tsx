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
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import { history, withRouter } from 'umi';
import { toJS } from 'mobx';
import { MobXProviderContext, Observer } from 'mobx-react';
import _ from 'loadsh';

import { IRouteComponentProps } from '@/index';
import RichEditor from '@/component/RichEditor';
import MarkdownEditor from '@/component/MarkdownEditor';
import Upload from '@/component/Upload';
import Back from '@/component/Back';
import { Box, formItemLayout, tailFormItemLayout } from './form';

const FormItem = Form.Item;

interface Hook {
  before?: (value: any) => any;
  after?: (value: any) => void;
}

interface RouterInfo {
  [propName: string]: any;
}

interface ICocaEditorProps extends IRouteComponentProps<RouterInfo> {
  forms: ICocaForm[];
  name: string | React.ReactNode | (() => React.ReactNode);
  model: string;
  key?: string;
  hook?: Hook;
  links?: string[];
  query?: any;
  initialValues?: (v: any) => any;
}

class Edit extends React.Component<ICocaEditorProps> {
  static contextType = MobXProviderContext;
  form: React.RefObject<FormInstance> = React.createRef();

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

  onFinish = async (values: any) => {
    if (!this.model) return;
    const { hook, links, key = 'id', location } = this.props;
    if (hook && hook.before) {
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

    if (hook && hook.after) {
      hook.after(result);
    }

    message.success('操作成功！');

    if (location.query.back !== '0') history.goBack();
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

  getFormOptions = (options?: ICocaOption[] | (() => ICocaOption[])) => {
    if (!options) return [];
    if (typeof options === 'function') return options();
    return options as ICocaOption[];
  };

  renderForm(data: ICocaForm) {
    const { current = {} } = this.model;

    let field = <div />;

    const formProps = this.getFormProps(data.props, current);
    const formOptions = this.getFormOptions(data.options);
    const fieldProps: any = {};

    if (data.type === 'string') {
      field = <Input {...formProps} />;
    }

    if (data.type === 'text') {
      field = <Input.TextArea {...formProps} autoSize={{ minRows: 5 }} />;
    }

    if (data.type === 'radio') {
      field = <Radio.Group {...formProps} options={formOptions} />;
    }

    if (data.type === 'checkbox') {
      field = <Checkbox.Group {...formProps} options={formOptions} />;
    }

    if (data.type === 'select') {
      field = (
        <Select showSearch {...formProps}>
          {formOptions.map(i => (
            <Select.Option key={i.value} value={i.value}>
              {i.label}
            </Select.Option>
          ))}
        </Select>
      );
    }

    if (data.type === 'number') {
      field = <InputNumber {...formProps} />;
    }

    if (data.type === 'switch') {
      fieldProps.valuePropName = 'checked';
      field = <Switch {...formProps} />;
    }

    if (data.type === 'img') {
      const props = formProps;

      if (data.required) {
        fieldProps.rules.push({
          type: props.max === 1 ? 'string' : 'array',
          required: true,
          message: `请上传${data.label}`,
        });
        delete data.required;
      }

      field = <Upload {...props} />;
    }

    if (data.type === 'rich') {
      field = <RichEditor {...formProps} />;
    }

    if (data.type === 'markdown') {
      field = <MarkdownEditor subfield {...formProps} />;
    }

    if (data.component) {
      field = data.component;
    }

    fieldProps.name = data.name;
    fieldProps.label = data.label;
    fieldProps.required = data.required;
    fieldProps.rules = data.rules;
    fieldProps.extra = data.extra;

    return (
      <FormItem key={data.name} {...fieldProps}>
        {field}
      </FormItem>
    );
  }

  renderName() {
    const { name } = this.props;
    if (typeof name === 'function' && !React.isValidElement(name)) {
      return name();
    }
    return name;
  }

  render() {
    const { forms = [], key = 'id', model, children, initialValues = (v: any) => v } = this.props;
    const isUpdate = this.props.match.params[key] !== '0';

    return (
      <MobXProviderContext.Consumer>
        {stores => (
          <Observer
            render={() => {
              const data = toJS(stores[model].current);
              return (
                <Box>
                  <h1>
                    <Back /> {!isUpdate ? '添加' : '编辑'}
                    {this.renderName()}
                  </h1>
                  <Divider />
                  {children}

                  {isUpdate && !data.id ? (
                    <Skeleton active />
                  ) : (
                    <Form
                      {...formItemLayout}
                      initialValues={initialValues(data)}
                      ref={this.form}
                      onFinish={this.onFinish}
                    >
                      {forms.map(item => this.renderForm(item))}

                      <Form.Item {...tailFormItemLayout}>
                        <Button htmlType="submit" type="primary">
                          提交
                        </Button>
                      </Form.Item>
                    </Form>
                  )}
                </Box>
              );
            }}
          />
        )}
      </MobXProviderContext.Consumer>
    );
  }
}

export default withRouter(Edit);
