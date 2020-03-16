import React, { PureComponent, Fragment } from 'react';
import {
  Form,
  Select,
  Input,
  Switch,
  Button,
  Table,
  Divider,
  message,
  Breadcrumb,
  Popover
} from 'antd';
import {
  PlusCircleOutlined,
  ExclamationCircleOutlined,
  SearchOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { history } from 'core/history';
import { Link } from 'react-router-dom';
import { getCategorys, getBooks } from 'agent';
import { getOptions } from 'utils/antdHelpers';
import { getPreviewURL } from 'utils/config';

export default class Book extends PureComponent {
  constructor(props) {
    super(props);
    const { category_id } = props.location.query;
    this.state = {
      category_id,
      name: undefined,
      author: undefined,
      order: true,
      pagination: {
        current: 1,
        pageSize: 20,
        total: 0
      },
      dataSource: [],
      categoryOptions: [],
      categoryMap: {},
      loading: false
    };
    this.columns = [
      {
        dataIndex: 'category_id',
        title: '分类',
        render: category_id => {
          const { categoryMap = {} } = this.state;
          return categoryMap[`${category_id}`];
        }
      },
      {
        dataIndex: 'name',
        title: '名称'
      },
      {
        dataIndex: 'author',
        title: '作者'
      },
      {
        dataIndex: 'is_subbook',
        title: '是否可作为丛书',
        render: is_subbook => (is_subbook ? '是' : '否')
      },
      {
        dataIndex: 'created_at',
        title: '创建时间',
        render: created_at => moment(created_at).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        dataIndex: 'updated_at',
        title: '更新时间',
        render: updated_at => moment(updated_at).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: (
          <Popover content={'丛书不可被推荐'} title={null} trigger="hover">
            操作
            <ExclamationCircleOutlined style={{ marginLeft: 4 }} />
          </Popover>
        ),
        render: (text, record = {}, index) => {
          const { book_id, is_subbook } = record;
          return (
            <Fragment>
              <Link to={`/cms/book/add?book_id=${book_id}`}>编辑</Link>
              <Divider type="vertical" />
              <Link to={`/cms/chapter?book_id=${book_id}`}>查看章节</Link>
              <Divider type="vertical" />
              <Link to={`/cms/chapter/add?book_id=${book_id}`}>创建章节</Link>
              {is_subbook == 0 ? (
                <Fragment>
                  <Divider type="vertical" />
                  <Link to={`/cms/book/subbook?parent_id=${book_id}`}>
                    查看丛书
                  </Link>
                  <Divider type="vertical" />
                  <Link to={`/cms/recommender/add?book_id=${book_id}`}>
                    加入推荐
                  </Link>
                </Fragment>
              ) : null}
              <Divider type="vertical" />
              <a target="_blank" href={getPreviewURL(`/book?id=${book_id}`)}>
                预览
              </a>
            </Fragment>
          );
        }
      }
    ];
  }

  componentDidMount() {
    this.setState({
      loading: true
    });
    getCategorys()
      .then((categorys = []) => {
        const categoryMap = {};
        const categoryOptions = categorys.map(category => {
          categoryMap[`${category.category_id}`] = category.name;
          return {
            value: `${category.category_id}`,
            label: category.name
          };
        });
        this.setState(
          {
            categoryOptions,
            categoryMap
          },
          () => {
            this.getBooks();
          }
        );
      })
      .catch(error => {
        this.setState({
          loading: false
        });
        message.error(error.message);
      });
  }

  getParam() {
    const { category_id, name, author, order } = this.state;
    const { current, pageSize } = this.state.pagination;
    return {
      category_id,
      name,
      author,
      order: order ? JSON.stringify(['updated_at', 'desc']) : undefined,
      current,
      pageSize
    };
  }

  getBooks() {
    const param = this.getParam();
    this.setState({
      loading: true
    });
    getBooks(param)
      .then((data = {}) => {
        const { current, pageSize, total, dataSource } = data;
        this.setState({
          dataSource,
          pagination: {
            current,
            pageSize,
            total
          },
          loading: false
        });
      })
      .catch(error => {
        this.setState({
          loading: false
        });
        message.error(error.message);
      });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.setState(
      {
        pagination
      },
      () => {
        this.getCategorys();
      }
    );
  };

  render() {
    const {
      category_id,
      name,
      author,
      order,
      pagination,
      dataSource,
      categoryOptions,
      loading
    } = this.state;
    return (
      <div className="pages-book g-pages-list-table">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/cms">首页</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>书籍管理</Breadcrumb.Item>
        </Breadcrumb>
        <Form layout="inline" style={{ marginTop: 20, marginBottom: 20 }}>
          <Form.Item label="分类">
            <Select
              style={{ width: 224 }}
              showSearch
              allowClear
              placeholder="请选择"
              value={category_id ? `${category_id}` : category_id}
              optionFilterProp="children"
              onChange={category_id => {
                this.setState({ category_id });
              }}
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {getOptions(categoryOptions)}
            </Select>
          </Form.Item>
          <Form.Item label="名称">
            <Input
              allowClear
              type="text"
              placeholder="请输入"
              value={name}
              onChange={e => {
                this.setState({
                  name: e.target.value || undefined
                });
              }}
            />
          </Form.Item>
          <Form.Item label="作者">
            <Input
              allowClear
              type="text"
              placeholder="请输入"
              value={author}
              onChange={e => {
                this.setState({
                  author: e.target.value || undefined
                });
              }}
            />
          </Form.Item>
          <Form.Item label="排序">
            <Switch
              checkedChildren="更新时间"
              unCheckedChildren="创建时间"
              checked={order}
              onChange={checked => {
                this.setState({
                  order: checked
                });
              }}
            />
          </Form.Item>
          <Form.Item label={' '} colon={false}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              htmlType="submit"
              loading={loading}
              onClick={() => {
                this.getBooks();
              }}
            >
              查询
            </Button>
          </Form.Item>
          <Form.Item label={' '} colon={false}>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => {
                history.push('/cms/book/add');
              }}
            >
              创建书籍
            </Button>
          </Form.Item>
        </Form>
        <Table
          columns={this.columns}
          dataSource={dataSource}
          rowKey={record => record.book_id}
          pagination={pagination}
          onChange={this.handleTableChange}
          loading={loading}
        />
      </div>
    );
  }
}
