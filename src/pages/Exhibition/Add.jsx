import React, { PureComponent } from 'react';
import { history } from 'core/history';
import { Link } from 'react-router-dom';
import { Form, Input, Button, message, Breadcrumb } from 'antd';
import { getExhibition, createExhibition, updateExhibition } from 'agent';
import { getOptions, FORM_LAYOUT } from 'utils/antdHelpers';
// import './index.scss';

export default class ExhibitionAdd extends PureComponent {
  constructor(props) {
    super(props);
    const { exhibition_id } = props.location.query;
    this.state = {
      exhibition_id,
      name: undefined,
      loading: false
    };
  }

  componentDidMount() {
    const { exhibition_id } = this.state;
    exhibition_id &&
      getExhibition(exhibition_id)
        .then((data = {}) => {
          const { name } = data;
          this.setState({
            name
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
    const { exhibition_id, name } = this.state;
    return {
      exhibition_id,
      name
    };
  }

  submit = () => {
    if (!this.check()) {
      return;
    }
    const data = this.getParam();
    const { exhibition_id } = this.state;
    this.setState({
      loading: true
    });
    if (exhibition_id) {
      updateExhibition(data)
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
      createExhibition(data)
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
    const { exhibition_id, name, loading } = this.state;
    return (
      <div className="pages-category-add">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/cms">首页</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/cms/exhibition">展位管理</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{exhibition_id ? '更新' : '创建'}展位</Breadcrumb.Item>
        </Breadcrumb>
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
              {exhibition_id ? '更新' : '创建'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
