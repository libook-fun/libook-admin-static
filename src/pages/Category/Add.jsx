import React, { PureComponent } from 'react';
import { history } from 'core/history';
import { Link } from 'react-router-dom';
import { Form, Input, Button, message, Breadcrumb, PageHeader } from 'antd';
import { getCategory, createCategory, updateCategory } from 'agent';
import { getOptions, FORM_LAYOUT } from 'utils/antdHelpers';
// import './index.scss';

export default class CategoryAdd extends PureComponent {
  constructor(props) {
    super(props);
    const { category_id } = props.location.query;
    this.state = {
      category_id,
      name: undefined,
      loading: false
    };
  }

  componentDidMount() {
    const { category_id } = this.state;
    category_id &&
      getCategory(category_id)
        .then((data = {}) => {
          const { name } = data;
          this.setState({
            name,
            category: {
              name
            }
          });
        })
        .catch((error) => {
          message.error(error.message);
        });
  }

  check() {
    const { name } = this.state;
    if (!name) {
      return false;
    }
    return true;
  }

  getParam() {
    const { category_id, name } = this.state;
    return {
      category_id,
      name
    };
  }

  submit = () => {
    if (!this.check()) {
      return;
    }
    const data = this.getParam();
    const { category_id } = this.state;
    this.setState({
      loading: true
    });
    if (category_id) {
      updateCategory(data)
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
      createCategory(data)
        .then((data) => {
          this.setState({
            loading: false
          });
          message.success('创建成功', 1, () => {
            history.goBack();
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
    const { category, category_id, name, loading } = this.state;
    return (
      <div className="pages-category-add">
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
            <Link to="/cms/category">分类管理</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{category_id ? '更新' : '创建'}分类</Breadcrumb.Item>
        </Breadcrumb>
        <PageHeader
          style={{
            paddingTop: 0
          }}
          title={category ? `更新${category.name}` : '创建分类'}
        />
        <Form {...FORM_LAYOUT}>
          <Form.Item label="名称" required>
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
              {category_id ? '更新' : '创建'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
