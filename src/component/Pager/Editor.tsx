import React from 'react';
import {
  Form,
  Input,
  Checkbox,
  Button,
  Divider,
  message,
  Spin,
  Radio,
  InputNumber,
  Switch,
  Select,
} from 'antd';

import { history, useLocation, useParams } from 'umi';
import RichEditor from '@/component/RichEditor';
import MarkdownEditor from '@/component/MarkdownEditor';
import Upload from '@/component/Upload';
import Back from '@/component/Back';

import { Box, formItemLayout, tailFormItemLayout } from './form';
import { useAction, useDetail } from './hook';

interface Hook {
  before?: (value: any) => any;
  after?: (value: any) => void;
}

const getFormProps = (props: any | ((data: any) => any), data = {}) => {
  if (!data) data = {};
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
  const fieldProps: any = {
    rules: [],
  };

  const dataTypes: any = {
    string: 'string',
    text: 'string',
    radio: 'string',
    checkbox: 'array',
    select: 'string',
    number: 'number',
    switch: 'boolean',
    rich: 'string',
    markdown: 'string',
    img: () => (formProps.max === 1 ? 'string' : 'array'),
  };

  if (form.required) {
    let dataType = form.dataType;
    if (!dataType) {
      dataType =
        typeof dataTypes[form.type] === 'function' ? dataTypes[form.type]() : dataTypes[form.type];
    }
    fieldProps.rules.push({
      type: dataType,
      required: true,
      message: `请设置${form.label}`,
    });
  }

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
        {formOptions.map((i) => (
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
  fieldProps.rules = [...fieldProps.rules, ...(form.rules || [])];
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

const Edit: React.FC<ICocaEditorProps> = ({
  model,
  name,
  forms,
  children,
  key = 'id',
  hook = {},
  links = [],
  query = {},
  initialValues = (v: any) => v,
}) => {
  const location: any = useLocation();
  const params: any = useParams();

  const id = params[key];
  const isUpdate = id !== 'new';
  const [form] = Form.useForm();

  const { data, loading: detail_loading } = useDetail(model, {
    defaultParams: [id, query],
  });

  const action = useAction(model, id, links);
  const submit = async (values: any) => {
    if (hook && hook.before) {
      values = hook.before(values);
    }
    const result = await action.run(values);
    if (result instanceof Error) return;
    if (hook && hook.after) {
      hook.after(result);
    }
    message.success('操作成功！');
    if (location.query.back !== '0') history.goBack();
  };

  return (
    <Box>
      <h1>
        <Back /> {!isUpdate ? '添加' : '编辑'}
        {name}
      </h1>
      <Divider />
      {children}
      {detail_loading ? (
        <Spin tip="加载中...">
          <div style={{ width: '100%', minHeight: 500 }} />
        </Spin>
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

export default Edit;
