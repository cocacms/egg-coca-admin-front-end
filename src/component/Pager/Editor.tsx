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
import axios from '@/util/axios';
import { FormInstance } from 'antd/lib/form';
import { history, withRouter } from 'umi';
import _ from 'loadsh';
import { useRequest } from '@umijs/hooks';

import { IRouteComponentProps } from '@/index';
import RichEditor from '@/component/RichEditor';
import MarkdownEditor from '@/component/MarkdownEditor';
import Upload from '@/component/Upload';
import Back from '@/component/Back';

import { Box, formItemLayout, tailFormItemLayout } from './form';

interface Hook {
  before?: (value: any) => any;
  after?: (value: any) => void;
}

interface RouterInfo {
  [propName: string]: any;
}

const getFormProps = (props: any | ((data: any) => any), data = {}) => {
  if (typeof props === 'function') return props(data);
  return props || {};
};

const getFormOptions = (options?: ICocaOption[] | (() => ICocaOption[])) => {
  if (!options) return [];
  if (typeof options === 'function') return options();
  return options as ICocaOption[];
};

const FormItem: React.FC<{
  form: ICocaForm;
  data?: any;
}> = ({ form, data = {} }) => {
  let field = <div />;

  const formProps = getFormProps(form.props, data);
  const formOptions = getFormOptions(form.options);
  const fieldProps: any = {};

  if (form.type === 'string') {
    field = <Input {...formProps} />;
  }

  if (form.type === 'text') {
    field = <Input.TextArea {...formProps} autoSize={{ minRows: 5 }} />;
  }

  if (form.type === 'radio') {
    field = <Radio.Group {...formProps} options={formOptions} />;
  }

  if (form.type === 'checkbox') {
    field = <Checkbox.Group {...formProps} options={formOptions} />;
  }

  if (form.type === 'select') {
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

  if (form.type === 'number') {
    field = <InputNumber {...formProps} />;
  }

  if (form.type === 'switch') {
    fieldProps.valuePropName = 'checked';
    field = <Switch {...formProps} />;
  }

  if (form.type === 'img') {
    const props = formProps;

    if (form.required) {
      fieldProps.rules.push({
        type: props.max === 1 ? 'string' : 'array',
        required: true,
        message: `请上传${form.label}`,
      });
      delete form.required;
    }

    field = <Upload {...props} />;
  }

  if (form.type === 'rich') {
    field = <RichEditor {...formProps} />;
  }

  if (form.type === 'markdown') {
    field = <MarkdownEditor subfield {...formProps} />;
  }

  if (form.component) {
    field = form.component;
  }

  fieldProps.name = form.name;
  fieldProps.label = form.label;
  fieldProps.required = form.required;
  fieldProps.rules = form.rules;
  fieldProps.extra = form.extra;

  return <Form.Item {...fieldProps}>{field}</Form.Item>;
};

interface ICocaEditorProps {
  forms: ICocaForm[];
  name: string | React.ReactNode | (() => React.ReactNode);
  model: string;
  key?: string;
  hook?: Hook;
  links?: string[];
  query?: any;
  initialValues?: (v: any) => any;
}

const formatResult = (response: any) => {
  const { data } = response;
  return data || {};
};
const Edit: React.FC<ICocaEditorProps & IRouteComponentProps<RouterInfo>> = ({
  model,
  name,
  forms,
  children,
  match,
  key = 'id',
  query = {},
  hook = {},
  links = [],
  initialValues = v => v,
  location,
}) => {
  const id = match.params[key];
  const isUpdate = id !== '0';

  /**
   * load data
   */

  const load = useRequest(
    () => axios.get(`${process.env.APIPREFIX}/${model}/${id}`, { params: { ...query } }),
    {
      refreshDeps: [id],
      initialData: {},
      formatResult,
    },
  );

  const { data } = load;

  const create = useRequest(
    data =>
      axios.post(`${process.env.APIPREFIX}/${model}`, data, {
        params: {
          links,
        },
      }),
    {
      formatResult,
      manual: true,
    },
  );

  const update = useRequest(
    data =>
      axios.put(`${process.env.APIPREFIX}/${model}/${id}`, data, {
        params: {
          links,
        },
      }),
    {
      formatResult,
      manual: true,
    },
  );

  const action = isUpdate ? update : create;

  const submit = async (values: any) => {
    if (hook && hook.before) {
      values = hook.before(values);
    }

    const result = await action.run(values);

    if (hook && hook.after) {
      hook.after(result);
    }

    message.success('操作成功！');

    if (location.query.back !== '0') history.goBack();
  };

  const [form] = Form.useForm();
  return (
    <Box>
      <h1>
        <Back /> {!isUpdate ? '添加' : '编辑'}
        {name}
      </h1>
      <Divider />
      {children}

      {load.loading ? (
        <Skeleton active />
      ) : (
        <Form {...formItemLayout} initialValues={initialValues(data)} form={form} onFinish={submit}>
          {forms.map((form: ICocaForm) => (
            <FormItem key={form.name} form={form} data={data} />
          ))}

          <Form.Item {...tailFormItemLayout}>
            <Button htmlType="submit" type="primary" loading={action.loading}>
              提交
            </Button>
          </Form.Item>
        </Form>
      )}
    </Box>
  );
};

export default withRouter(Edit);
