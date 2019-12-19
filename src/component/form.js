import styled from 'styled-components';

export const Box = styled.div`
  background-color: #ffffff;
  padding: 24px 16px;
`;

export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
    md: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};

export const tailFormItemLayout = {
  wrapperCol: {
    xs: { offset: 0, span: 24 },
    sm: { offset: 7, span: 12 },
    md: { offset: 7, span: 10 },
  },
};
