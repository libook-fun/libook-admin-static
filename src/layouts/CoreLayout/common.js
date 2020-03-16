import React from 'react';
import {
  BankOutlined,
  BarsOutlined,
  BookOutlined,
  InsertRowBelowOutlined,
  ToTopOutlined
} from '@ant-design/icons';

export const menus = [
  { key: '/cms', value: '首页', Icon: BankOutlined },
  { key: '/cms/category', value: '分类管理', Icon: BarsOutlined },
  { key: '/cms/book', value: '书籍管理', Icon: BookOutlined },
  { key: '/cms/exhibition', value: '展位管理', Icon: InsertRowBelowOutlined },
  { key: '/cms/recommender', value: '推荐管理', Icon: ToTopOutlined }
];
