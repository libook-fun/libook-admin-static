import React, { PureComponent } from 'react';
import { history } from 'core/history';
import { Link } from 'react-router-dom';
import { Form, Select, Input, Upload, Button, message, Breadcrumb, PageHeader } from 'antd';
import { getAvailableSubbooks, getBook, createBind } from 'agent';
import { getOptions, FORM_LAYOUT } from 'utils/antdHelpers';

export default class SubbookAdd extends PureComponent {
  constructor(props) {
    super(props);
    const { parent_id } = props.location.query;
    this.state = {
      parent_id,
      name: undefined,
      bookOptions: [],
      loading: false
    };
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
        .catch((error) => {
          message.error(error.message);
        });
    getAvailableSubbooks()
      .then((books = []) => {
        this.setState({
          bookOptions: books
            .filter(book => book.book_id != parent_id)
            .map(book => ({
              value: `${book.book_id}`,
              label: book.name
            }))
        });
      })
      .catch((error) => {
        message.error(error.message);
      });
  }

  check() {
    const { book_id, parent_id, name } = this.state;
    if (!book_id) {
      message.error('请输选择丛书');
      return false;
    }
    if (!name) {
      message.error('请输入关系名');
      return false;
    }
    return true;
  }

  getParam() {
    const { book_id, parent_id, name } = this.state;
    return {
      book_id,
      parent_id,
      name
    };
  }

  submit = () => {
    if (!this.check()) {
      return;
    }
    const data = this.getParam();
    this.setState({
      loading: true
    });
    createBind(data)
      .then((data) => {
        this.setState({
          loading: false
        });
        message.success('绑定成功', 1, () => {
          history.goBack();
        });
      })
      .catch((error) => {
        this.setState({
          loading: false
        });
        message.error(error.message);
      });
  };

  render() {
    const { parent_id, book, book_id, name, bookOptions, loading } = this.state;
    return (
      <div className="pages-book-add">
        <Breadcrumb
          style={{
            paddingLeft: 24,
            marginBottom: 8
          }}
        >
          <Breadcrumb.Item>
            <Link to="/cms">首页</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/cms/book">书籍管理</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={`/cms/book/subbook?parent_id=${parent_id}`}>{book ? `${book.name}丛书管理` : '丛书管理'}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>创建丛书</Breadcrumb.Item>
        </Breadcrumb>
        <PageHeader
          style={{
            paddingTop: 0
          }}
          title={`创建${book ? book.name : null}丛书`}
          subTitle={book && book.category ? book.category.name : null}
        />
        <Form {...FORM_LAYOUT}>
          <Form.Item label="丛书" required>
            <Select
              showSearch
              placeholder="请选择"
              value={book_id ? `${book_id}` : book_id}
              optionFilterProp="children"
              onChange={(book_id) => {
                this.setState({ book_id });
              }}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              ref={ref => (this.book_id = ref)}
            >
              {getOptions(bookOptions)}
            </Select>
          </Form.Item>
          <Form.Item label="关系名" required>
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
          <Form.Item label={' '} colon={false}>
            <Button type="primary" htmlType="submit" loading={loading} onClick={this.submit}>
              创建
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
