import React, { PureComponent, Fragment } from 'react';
import {
  Form,
  Input,
  Switch,
  Button,
  Table,
  message,
  Divider,
  Breadcrumb
} from 'antd';
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { history } from 'core/history';
import { Link } from 'react-router-dom';
import { getChapters, getBook } from 'agent';
import { getPreviewURL } from 'utils/config';

export default class Chapter extends PureComponent {
  constructor(props) {
    super(props);
    const { book_id } = props.location.query;
    this.state = {
      book_id,
      book: undefined,
      name: undefined,
      order: true,
      pagination: {
        current: 1,
        pageSize: 20,
        total: 0
      },
      dataSource: [],
      loading: false
    };
    this.columns = [
      {
        dataIndex: 'name',
        title: '名称'
      },
      {
        dataIndex: 'index',
        title: '索引'
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
        title: '操作',
        render: function(text, record = {}, index) {
          const { chapter_id, book_id } = record;
          return (
            <Fragment>
              <Link
                to={`/cms/chapter/add?book_id=${book_id}&chapter_id=${chapter_id}`}
              >
                编辑
              </Link>
              <Divider type="vertical" />
              <a
                target="_blank"
                href={getPreviewURL(`/chapter?id=${chapter_id}`)}
              >
                预览
              </a>
            </Fragment>
          );
        }
      }
    ];
  }

  componentDidMount() {
    const { book_id } = this.state;
    book_id &&
      getBook(book_id)
        .then((book = {}) => {
          this.setState({
            book
          });
        })
        .catch(error => {
          message.error(error.message);
        });
    book_id && this.getChapters();
  }

  getParam() {
    const { book_id, name, order } = this.state;
    const { current, pageSize } = this.state.pagination;
    return {
      book_id,
      name,
      order: order ? JSON.stringify(['updated_at', 'desc']) : undefined,
      current,
      pageSize
    };
  }

  getChapters() {
    const param = this.getParam();
    this.setState({
      loading: true
    });
    getChapters(param)
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
        this.getChapters();
      }
    );
  };

  render() {
    const {
      book_id,
      name,
      order,
      book,
      pagination,
      dataSource,
      loading
    } = this.state;
    return (
      <div className="pages-chapter g-pages-list-table">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/cms">首页</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/cms/book">书籍管理</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{book ? book.name : '章节管理'}</Breadcrumb.Item>
        </Breadcrumb>
        {book ? (
          <div>
            {book.category.name}-{book.name}-{book.author}
          </div>
        ) : null}
        <Form layout="inline" style={{ marginTop: 20, marginBottom: 20 }}>
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
                this.getChapters();
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
                history.push(`/cms/chapter/add?book_id=${book_id}`);
              }}
            >
              创建章节
            </Button>
          </Form.Item>
        </Form>
        <Table
          columns={this.columns}
          dataSource={dataSource}
          rowKey={record => record.chapter_id}
          pagination={pagination}
          onChange={this.handleTableChange}
          loading={loading}
        />
      </div>
    );
  }
}
