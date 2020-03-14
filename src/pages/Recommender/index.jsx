import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Select, Switch, Table, Divider, message, Breadcrumb } from 'antd';
import moment from 'moment';
import { history } from 'core/history';
import { Link } from 'react-router-dom';
import { getExhibitions, getRecommenders, activeRecommender, disableRecommender, deleteRecommender } from 'agent';
import { getOptions } from 'utils/antdHelpers';
import { TYPE_OPTIONS, TYPE_MAP, STATE_OPTIONS, STATE_MAP } from './common';
// import './index.scss';

export default class RecommenderPage extends PureComponent {
  constructor(props) {
    super(props);
    const { exhibition_id, type } = props.location.query;
    this.state = {
      type,
      state: undefined,
      order: true,
      exhibition_id,
      exhibitionOptions: [],
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
        dataIndex: 'type',
        title: '类型',
        render: (type, record = {}, index) => {
          const { exhibition_id } = record;
          if (type == 0) {
            return <Link to={`/cms/exhibition/add?id=${exhibition_id}`}>{TYPE_MAP[type] || '未知'}</Link>;
          } else {
            return TYPE_MAP[type] || '未知';
          }
        }
      },
      {
        dataIndex: 'state',
        title: '状态',
        render: (text, record = {}, index) => {
          const type = STATE_MAP[text];
          return type || '未知';
        }
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
          const { recommender_id, book_id, state } = record;
          return (
            <Fragment>
              <Link to={`/cms/recommender/add?recommender_id=${recommender_id}&book_id=${book_id}`}>编辑</Link>
              <Divider type="vertical" />
              <a
                onClick={() => {
                  this.opreate(record);
                }}
              >
                {state === 1 ? '失效' : '激活'}
              </a>
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
    this.getRecommenders();
    getExhibitions()
      .then((exhibitions = []) => {
        this.setState({
          exhibitionOptions: exhibitions.map(exhibition => ({
            value: `${exhibition.exhibition_id}`,
            label: exhibition.name
          }))
        });
      })
      .catch((error) => {
        message.error(error.message);
      });
  }

  getParam() {
    const { type, state, order, exhibition_id } = this.state;
    const { current, pageSize } = this.state.pagination;
    return {
      type,
      state,
      exhibition_id: type == 0 ? exhibition_id : undefined,
      order: order ? JSON.stringify(['updated_at', 'desc']) : undefined,
      current,
      pageSize
    };
  }

  getRecommenders() {
    const param = this.getParam();
    this.setState({
      loading: true
    });
    getRecommenders(param)
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
      .catch((error) => {
        this.setState({
          loading: false
        });
        message.error(error.message);
      });
  }

  opreate(record = {}) {
    const { recommender_id, state } = record;
    if (state === 1) {
      disableRecommender(recommender_id)
        .then((data) => {
          message.success('失效成功', 1, () => {
            this.getRecommenders();
          });
        })
        .catch((error) => {
          message.error(error.message);
        });
    } else {
      activeRecommender(recommender_id)
        .then((data) => {
          message.success('激活成功', 1, () => {
            this.getRecommenders();
          });
        })
        .catch((error) => {
          message.error(error.message);
        });
    }
  }

  delete(record = {}) {
    const { recommender_id } = record;
    deleteRecommender(recommender_id)
      .then((data) => {
        message.success('删除成功', 1, () => {
          this.getRecommenders();
        });
      })
      .catch((error) => {
        message.error(error.message);
      });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.setState(
      {
        pagination
      },
      () => {
        this.getRecommenders();
      }
    );
  };

  render() {
    const { type, state, order, exhibition_id, exhibitionOptions, pagination, dataSource, loading } = this.state;
    return (
      <div className="pages-recommender g-pages-list-table">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/cms">首页</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/cms/recommender">推荐管理</Link>
          </Breadcrumb.Item>
        </Breadcrumb>
        <Form layout="inline">
          <Form.Item label="类型">
            <Select
              allowClear
              style={{ width: 224 }}
              showSearch
              placeholder="请选择"
              value={type ? `${type}` : type}
              optionFilterProp="children"
              onChange={(type) => {
                this.setState({ type });
              }}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {getOptions(TYPE_OPTIONS)}
            </Select>
          </Form.Item>
          {type == '0' ? (
            <Form.Item label="展位">
              <Select
                allowClear
                showSearch
                style={{ width: 224 }}
                placeholder="请选择"
                value={exhibition_id ? `${exhibition_id}` : exhibition_id}
                optionFilterProp="children"
                onChange={(exhibition_id) => {
                  this.setState({ exhibition_id });
                }}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {getOptions(exhibitionOptions)}
              </Select>
            </Form.Item>
          ) : null}
          <Form.Item label="状态">
            <Select
              allowClear
              style={{ width: 224 }}
              showSearch
              placeholder="请选择"
              value={state ? `${state}` : state}
              optionFilterProp="children"
              onChange={(state) => {
                this.setState({ state });
              }}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {getOptions(STATE_OPTIONS)}
            </Select>
          </Form.Item>
          <Form.Item label="排序">
            <Switch
              checkedChildren="更新时间"
              unCheckedChildren="创建时间"
              checked={order}
              onChange={(checked) => {
                this.setState({
                  order: checked
                });
              }}
            />
          </Form.Item>
          <Form.Item label={' '} colon={false}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              onClick={() => {
                this.getRecommenders();
              }}
            >
              查询
            </Button>
          </Form.Item>
        </Form>
        <Table
          columns={this.columns}
          dataSource={dataSource}
          rowKey={record => record.recommender_id}
          pagination={pagination}
          onChange={this.handleTableChange}
          loading={loading}
        />
      </div>
    );
  }
}
