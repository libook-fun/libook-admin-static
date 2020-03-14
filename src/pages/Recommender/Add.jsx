import React, { PureComponent } from 'react';
import { Form, Select, Input, Upload, Button, Icon, message, Breadcrumb, Tag } from 'antd';
import { history } from 'core/history';
import { Link } from 'react-router-dom';
import { getBook, getExhibitions, getRecommender, createRecommender, updateRecommender } from 'agent';
import { getOptions, FORM_LAYOUT } from 'utils/antdHelpers';
import { TYPE_OPTIONS } from './common';

export default class RecommenderAdd extends PureComponent {
  constructor(props) {
    super(props);
    const { book_id, recommender_id } = props.location.query;
    this.state = {
      recommender_id,
      book_id,
      type: '0',
      name: undefined,
      description: undefined,
      pic: undefined,
      book: undefined,
      exhibition_id: undefined,
      exhibitionOptions: [],
      loading: false
    };
  }

  componentDidMount() {
    const { recommender_id, book_id } = this.state;
    book_id &&
      getBook(book_id)
        .then((book = {}) => {
          this.setState({
            book
          });
          if (!recommender_id) {
            this.setState({
              name: book.name
            });
          }
        })
        .catch((error) => {
          message.error(error.message);
        });
    recommender_id &&
      getRecommender(recommender_id)
        .then((data = []) => {
          const { type, name, book_id, description, pic, exhibition_id } = data;
          this.setState({
            type,
            name,
            book_id,
            description,
            pic,
            exhibition_id
          });
        })
        .catch((error) => {
          message.error(error.message);
        });
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

  check() {
    const { recommender_id, book_id, type, name, description, pic, exhibition_id } = this.state;
    if (!book_id) {
      message.error('请关联书籍');
      return false;
    }
    if (!`${type}`) {
      message.error('请选择类型');
      return false;
    }
    if (type == '0' && !exhibition_id) {
      message.error('请输选择关联的展位');
      return false;
    }
    if (!name) {
      message.error('请输入名称');
      return false;
    }
    if (!description) {
      message.error('请输入描述');
      return false;
    }
    if (type == 10 && !pic) {
      message.error('请上传banner图');
      return false;
    }
    return true;
  }

  getParam() {
    const { recommender_id, book_id, type, name, description, pic } = this.state;
    const param = {
      recommender_id,
      book_id,
      type,
      name,
      description,
      pic
    };
    if (type == '0') {
      const { exhibition_id } = this.state;
      param.exhibition_id = exhibition_id;
    }
    return param;
  }

  submit = () => {
    if (!this.check()) {
      return;
    }
    const data = this.getParam();
    const { recommender_id } = this.state;
    this.setState({
      loading: true
    });
    if (recommender_id) {
      updateRecommender(data)
        .then((data) => {
          this.setState({
            loading: false
          });
          message.success('更新成功', 1, () => {
            history.goBack();
          });
        })
        .catch((error) => {
          this.setState({
            loading: false
          });
          message.error(error.message);
        });
    } else {
      createRecommender(data)
        .then((data) => {
          this.setState({
            loading: false
          });
          message.success('创建成功', 1, () => {
            history.push(`/cms/recommender`);
          });
        })
        .catch((error) => {
          this.setState({
            loading: false
          });
          message.error(error.message);
        });
    }
  };

  render() {
    const {
      recommender_id,
      book_id,
      type,
      book,
      name,
      description,
      pic,
      exhibition_id,
      exhibitionOptions,
      loading
    } = this.state;
    return (
      <div className="pages-book-add">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/cms">首页</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/cms/recommender">推荐管理</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{recommender_id ? '更新' : '创建'}推荐</Breadcrumb.Item>
        </Breadcrumb>
        <Form {...FORM_LAYOUT}>
          <Form.Item label="推荐书籍" required>
            {book_id && book ? `${book.author}-${book.category.name}-${book.name}` : '空'}
          </Form.Item>
          <Form.Item label="分类" required>
            <Select
              placeholder="请选择"
              value={`${type}`}
              onChange={(type) => {
                this.setState({ type });
              }}
              ref={ref => (this.type = ref)}
            >
              {getOptions(TYPE_OPTIONS)}
            </Select>
          </Form.Item>
          {type == '0' ? (
            <Form.Item label="展位" required>
              <Select
                showSearch
                placeholder="请选择"
                value={exhibition_id ? `${exhibition_id}` : exhibition_id}
                optionFilterProp="children"
                onChange={(exhibition_id) => {
                  this.setState({ exhibition_id });
                }}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                ref={ref => (this.exhibition_id = ref)}
              >
                {getOptions(exhibitionOptions)}
              </Select>
            </Form.Item>
          ) : null}
          <Form.Item label="推荐名称" required>
            <Input
              type="text"
              placeholder="请输入"
              value={name}
              onChange={(e) => {
                this.setState({
                  name: e.target.value || undefined
                });
              }}
              ref={ref => (this.name = ref)}
            />
          </Form.Item>
          <Form.Item label="推荐描述" required>
            <Input.TextArea
              rows={4}
              maxLength="100"
              type="text"
              placeholder="请输入"
              value={description}
              onChange={(e) => {
                this.setState({
                  description: e.target.value || undefined
                });
              }}
              ref={ref => (this.description = ref)}
            />
          </Form.Item>
          {type == 10 ? (
            <Form.Item label="首页banner图" required={!recommender_id}>
              {!pic ? (
                <Upload.Dragger
                  accept="image/png,image/jpeg,image/gif,image/webp"
                  beforeUpload={(pic) => {
                    this.setState({
                      pic
                    });
                    return false;
                  }}
                  onRemove={(pic) => {
                    this.setState({
                      pic: undefined
                    });
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                  <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                </Upload.Dragger>
              ) : (
                <div>
                  <Tag
                    closable
                    onClose={() => {
                      this.setState({
                        pic: undefined
                      });
                    }}
                  >
                    <Icon type="file-image" />
                    <span style={{ marginLeft: 10 }}>{pic.name}</span>
                  </Tag>
                </div>
              )}
            </Form.Item>
          ) : null}
          <Form.Item label={' '} colon={false}>
            <Button type="primary" htmlType="submit" loading={loading} onClick={this.submit}>
              {recommender_id ? '更新' : '创建'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
