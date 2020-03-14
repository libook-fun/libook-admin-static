import React from 'react';
import { Select } from 'antd';
/**
 * 生成antd的Options  https://2x.ant.design/components/select-cn/
 * 关于__data的用处：onSelect={(value, option) => { const { __data = {} } = option.props })}
 */
export const getOptions = options => options.map((item, index) => (
    <Select.Option key={item.key || item.value} value={item.value || item.key} __data={item.__data || {}}>
      {item.label || item.text}
    </Select.Option>
));

export const FORM_LAYOUT = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 }
  }
};
