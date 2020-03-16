import React, { PureComponent, Fragment } from 'react';
import { Form, Input, Button, message } from 'antd';
import Icon from '@ant-design/icons';
import { grabChapter } from 'agent';
import { getOptions, FORM_LAYOUT } from 'utils/antdHelpers';

export default class Grab extends PureComponent {
  constructor(props) {
    super(props);
    let state;
    try {
      state = window.localStorage.getItem('PAGES_CHAPTER_GRAB');
      state = JSON.parse(state);
    } catch (e) {
      state = {};
    }
    this.state = {
      ...state
      //   url: 'https://www.luoxia.com/tianlong/8891.htm',
      //   query: '#nr1',
      //   nameQuery: '#nr_title',
      //   nextQuery: '.next a[href]',
      //   ignoreQuery: '.pcinvisible',
      //   next: undefined
    };
  }

  componentDidMount() {}

  check() {
    const { url, query } = this.state;
    if (!url) {
      message.error('请输入url');
      return false;
    }
    if (!query) {
      message.error('请输入query');
      return false;
    }
    return true;
  }

  getParam() {
    const { url, query, nameQuery, nextQuery, ignoreQuery } = this.state;
    return {
      url: url ? url.trim() : '',
      query: query ? query.trim() : '',
      nameQuery: nameQuery ? nameQuery.trim() : undefined,
      nextQuery: nextQuery ? nextQuery.trim() : undefined,
      ignoreQuery: ignoreQuery ? ignoreQuery.trim() : undefined
    };
  }

  submit = () => {
    if (!this.check()) {
      return;
    }
    const data = this.getParam();
    console.log(data);
    this.setState({
      loading: true
    });
    grabChapter(data)
      .then(data => {
        console.log(data);
        this.setState(
          {
            loading: false,
            next: data.next || undefined
          },
          () => {
            window.localStorage.setItem(
              'PAGES_CHAPTER_GRAB',
              JSON.stringify(this.state)
            );
          }
        );
        data.content = data.content.trim();
        window.testcontent = data.content;
        if (this.state.replaceContent) {
          data.content = data.content.replace(
            new RegExp(this.state.replaceContent),
            ''
          );
          data.content = data.content.trim();
        }
        this.props.onChange && this.props.onChange(data);
      })
      .catch(error => {
        this.setState({
          loading: false
        });
        message.error(error.message);
      });
  };

  render() {
    const {
      url,
      query,
      nameQuery,
      nextQuery,
      ignoreQuery,
      replaceContent,
      next,
      loading
    } = this.state;
    return (
      <Fragment>
        <Form.Item label="url" required>
          <Input
            type="text"
            placeholder="请输入"
            value={url}
            onChange={e => {
              this.setState({
                url: e.target.value || undefined
              });
            }}
            ref={ref => (this.url = ref)}
          />
        </Form.Item>
        <Form.Item label="query" required>
          <Input
            type="text"
            placeholder="请输入"
            value={query}
            onChange={e => {
              this.setState({
                query: e.target.value || undefined
              });
            }}
            ref={ref => (this.query = ref)}
          />
        </Form.Item>
        <Form.Item label="nameQuery" required>
          <Input
            type="text"
            placeholder="请输入"
            value={nameQuery}
            onChange={e => {
              this.setState({
                nameQuery: e.target.value || undefined
              });
            }}
            ref={ref => (this.nameQuery = ref)}
          />
        </Form.Item>
        <Form.Item label="nextQuery">
          <Input
            type="text"
            placeholder="请输入"
            value={nextQuery}
            onChange={e => {
              this.setState({
                nextQuery: e.target.value || undefined
              });
            }}
            ref={ref => (this.nextQuery = ref)}
          />
        </Form.Item>
        <Form.Item label="ignoreQuery">
          <Input
            type="text"
            placeholder="请输入"
            value={ignoreQuery}
            onChange={e => {
              this.setState({
                ignoreQuery: e.target.value || undefined
              });
            }}
            ref={ref => (this.ignoreQuery = ref)}
          />
        </Form.Item>
        <Form.Item label="replaceContent">
          <Input
            type="text"
            placeholder="请输入"
            value={replaceContent}
            onChange={e => {
              this.setState({
                replaceContent: e.target.value || undefined
              });
            }}
            ref={ref => (this.replaceContent = ref)}
          />
        </Form.Item>
        <Form.Item label={' '} colon={false}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            onClick={this.submit}
          >
            抓取
          </Button>
          {next ? (
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ marginLeft: 20 }}
              onClick={() => {
                this.setState(
                  {
                    url: next
                  },
                  () => {
                    this.submit();
                  }
                );
              }}
            >
              抓取下一章
            </Button>
          ) : null}
        </Form.Item>
      </Fragment>
    );
  }
}
