import React, { Component, Fragment } from 'react';
import {
  Form,
  Input,
  Switch,
  Button,
  Table,
  Divider,
  message,
  Breadcrumb
} from 'antd';
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { history } from 'core/history';
import { Link } from 'react-router-dom';
import { getExhibitions, deleteExhibition } from 'agent';

export default class Exhibition extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    this.focusName = undefined;
    this.columns = [
      {
        dataIndex: 'name',
        title: '名称'
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
        render: (text, record = {}, index) => {
          const { exhibition_id } = record;
          return (
            <Fragment>
              <Link to={`/cms/exhibition/add?exhibition_id=${exhibition_id}`}>
                编辑
              </Link>
              <Divider type="vertical" />
              <Link
                to={`/cms/recommender/?type=0&exhibition_id=${exhibition_id}`}
              >
                查看推荐
              </Link>
              <Divider type="vertical" />
              <a
                onClick={() => {
                  this.delete(record);
                }}
              >
                删除
              </a>
            </Fragment>
          );
        }
      }
    ];
  }

  componentDidMount() {
    this.getExhibitions();
  }

  delete(record = {}) {
    const { exhibition_id } = record;
    deleteExhibition(exhibition_id)
      .then(data => {
        message.success('删除成功', 1, () => {
          this.getExhibitions();
        });
      })
      .catch(error => {
        message.error(error.message);
      });
  }

  getParam() {
    const { current, pageSize } = this.state.pagination;
    const { name, order } = this.state;
    return {
      name,
      order: order ? JSON.stringify(['updated_at', 'desc']) : undefined,
      current,
      pageSize
    };
  }

  getExhibitions() {
    const param = this.getParam();
    this.setState({
      loading: true
    });
    getExhibitions(param)
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
        this.getExhibitions();
      }
    );
  };

  render() {
    const { name, order, pagination, dataSource, loading } = this.state;
    return (
      <div className="pages-category g-pages-list-table">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/cms">首页</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>展位管理</Breadcrumb.Item>
        </Breadcrumb>
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
                this.getExhibitions();
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
                history.push('/cms/exhibition/add');
              }}
            >
              创建展位
            </Button>
          </Form.Item>
        </Form>
        <Table
          columns={this.columns}
          dataSource={dataSource}
          rowKey={record => record.exhibition_id}
          pagination={pagination}
          onChange={this.handleTableChange}
          loading={loading}
        />
      </div>
    );
  }
}
