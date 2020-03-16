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
  Breadcrumb
} from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { history } from 'core/history';
import { Link } from 'react-router-dom';
import { getBook, getSubbooks, deleteBind } from 'agent';
import { getOptions } from 'utils/antdHelpers';
import { getPreviewURL } from 'utils/config';

export default class Subbook extends PureComponent {
  constructor(props) {
    super(props);
    const { parent_id } = props.location.query;
    this.state = {
      parent_id,
      dataSource: [],
      loading: false
    };
    this.columns = [
      {
        dataIndex: 'name',
        title: '丛书名'
      },
      {
        dataIndex: 'bind_name',
        title: '关系名称'
      },
      {
        dataIndex: 'created_at',
        title: '绑定时间',
        render: created_at => moment(created_at).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        dataIndex: 'updated_at',
        title: '绑定更新时间',
        render: updated_at => moment(updated_at).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '操作',
        render: (text, record = {}, index) => {
          const { id, parent_id, book_id } = record;
          return (
            <Fragment>
              <a
                onClick={() => {
                  this.delete(record);
                }}
              >
                解除绑定
              </a>
              <Divider type="vertical" />
              <a target="_blank" href={getPreviewURL(`/book?id=${book_id}`)}>
                预览丛书
              </a>
            </Fragment>
          );
        }
      }
    ];
  }

  delete(record = {}) {
    const { parent_id, book_id } = record;
    deleteBind(parent_id, book_id)
      .then(data => {
        message.success('解绑成功', 1, () => {
          this.getSubbooks();
        });
      })
      .catch(error => {
        message.error(error.message);
      });
  }

  componentDidMount() {
    const { parent_id } = this.state;
    parent_id &&
      getBook(parent_id)
        .then((book = {}) => {
          this.setState({
            book
          });
        })
        .catch(error => {
          message.error(error.message);
        });
    this.getSubbooks();
  }

  getParam() {
    const { parent_id } = this.state;
    return {
      parent_id
    };
  }

  getSubbooks() {
    const { parent_id } = this.state;
    this.setState({
      loading: true
    });
    parent_id &&
      getSubbooks({ parent_id })
        .then((dataSource = []) => {
          this.setState({
            dataSource,
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

  render() {
    const { parent_id, book, dataSource, loading } = this.state;
    return (
      <div className="pages-book g-pages-list-table">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/cms">首页</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/cms/book">书籍管理</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {book ? `${book.name}丛书管理` : '丛书管理'}
          </Breadcrumb.Item>
        </Breadcrumb>
        <Form layout="inline" style={{ marginTop: 20, marginBottom: 20 }}>
          <Form.Item label={' '} colon={false}>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => {
                history.push(`/cms/book/subbook/add?parent_id=${parent_id}`);
              }}
            >
              创建丛书
            </Button>
          </Form.Item>
        </Form>
        <Table
          columns={this.columns}
          dataSource={dataSource}
          rowKey={record => record.bind_id}
          loading={loading}
        />
      </div>
    );
  }
}
