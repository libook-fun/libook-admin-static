import React, { PureComponent, Fragment } from 'react';
import {
  Form,
  Input,
  Upload,
  Button,
  message,
  Breadcrumb,
  Tag,
  PageHeader,
  Radio,
  Modal
} from 'antd';
import { UploadOutlined, FileImageOutlined } from '@ant-design/icons';
import { history } from 'core/history';
import { Link } from 'react-router-dom';
import { getChapter, getBook, createChapter, updateChapter } from 'agent';
import { getOptions, FORM_LAYOUT } from 'utils/antdHelpers';
import Grab from './Grab';
// import './index.scss';

export default class ChapterAdd extends PureComponent {
  constructor(props) {
    super(props);
    const { chapter_id, book_id } = props.location.query;
    this.state = {
      chapter_id,
      book_id,
      sourceType: 1,
      name: undefined,
      file: undefined,
      content: '',
      loading: false
    };
  }

  componentDidMount() {
    const { chapter_id, book_id } = this.state;
    chapter_id &&
      getChapter(chapter_id)
        .then((data = {}) => {
          const { name } = data;
          this.setState({
            name
          });
        })
        .catch(error => {
          message.error(error.message);
        });
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
  }

  check() {
    const { chapter_id, book_id, sourceType, name, file, content } = this.state;
    if (!book_id) {
      message.error('请关联书籍');
      return false;
    }
    if (!name) {
      message.error('请输入名称');
      return false;
    }
    if (!chapter_id && sourceType == 1 && !content) {
      message.error('请输入内容');
      return false;
    }
    if (!chapter_id && sourceType == 2 && !file) {
      message.error('请上传txt');
      return false;
    }
    return true;
  }

  getParam() {
    const { chapter_id, book_id, sourceType, name, file, content } = this.state;
    return {
      chapter_id,
      book_id,
      name,
      content: sourceType == 1 ? content : '',
      file: sourceType == 2 ? file : undefined
    };
  }

  submit = () => {
    if (!this.check()) {
      return;
    }
    const data = this.getParam();
    const { chapter_id } = this.state;
    this.setState({
      loading: true
    });
    if (chapter_id) {
      updateChapter(data)
        .then(data => {
          this.setState({
            loading: false
          });
          message.success('更新成功', 1, () => {
            history.goBack();
          });
        })
        .catch(error => {
          this.setState({
            loading: false
          });
          message.error(error.message);
        });
    } else {
      createChapter(data)
        .then(data => {
          this.setState({
            loading: false
          });
          Modal.confirm({
            title: '创建成功',
            content: '是否继续创建',
            onOk() {},
            onCancel() {
              history.goBack();
            }
          });
        })
        .catch(error => {
          this.setState({
            loading: false
          });
          message.error(error.message);
        });
    }
  };

  render() {
    const {
      book,
      chapter_id,
      book_id,
      sourceType,
      name,
      file,
      content,
      loading
    } = this.state;
    return (
      <div className="pages-chapter-add">
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
            <Link to={`/cms/chapter?book_id=${book_id}`}>
              {book ? book.name : '章节管理'}
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{chapter_id ? '更新' : '创建'}章节</Breadcrumb.Item>
        </Breadcrumb>
        <PageHeader
          style={{
            paddingTop: 0
          }}
          title={book ? book.name : null}
          subTitle={chapter_id ? '更新章节' : '创建章节'}
        />
        <Form {...FORM_LAYOUT}>
          <Form.Item label="数据源类型" required>
            <Radio.Group
              onChange={e => {
                this.setState({
                  sourceType: e.target.value
                });
              }}
              value={sourceType}
            >
              <Radio value={1}>爬虫</Radio>
              <Radio value={2}>TXT文件</Radio>
            </Radio.Group>
          </Form.Item>
          {sourceType == 1 ? (
            <Fragment>
              <Grab
                onChange={(data = {}) => {
                  this.setState({
                    ...data
                  });
                }}
              />
              <Form.Item label="名称" required>
                <Input
                  style={{ width: '224px' }}
                  type="text"
                  placeholder="请输入"
                  value={name}
                  onChange={e => {
                    this.setState({
                      name: e.target.value
                    });
                  }}
                  ref={ref => (this.name = ref)}
                />
              </Form.Item>
              <Form.Item label="内容" required>
                <Input.TextArea
                  // style={{ width: '224px' }}
                  type="text"
                  rows={10}
                  placeholder="请输入"
                  value={content}
                  onChange={e => {
                    this.setState({
                      content: e.target.value
                    });
                  }}
                  ref={ref => (this.content = ref)}
                />
              </Form.Item>
            </Fragment>
          ) : null}
          {sourceType == 2 ? (
            <Fragment>
              <Form.Item label="名称" required>
                <Input
                  style={{ width: '224px' }}
                  type="text"
                  placeholder="请输入"
                  value={name}
                  onChange={e => {
                    this.setState({
                      name: e.target.value
                    });
                  }}
                  ref={ref => (this.name = ref)}
                />
              </Form.Item>
              <Form.Item label="TXT" required={!chapter_id}>
                {!file ? (
                  <Upload.Dragger
                    accept="text/plain"
                    beforeUpload={file => {
                      this.setState({
                        file
                      });
                      return false;
                    }}
                    onRemove={file => {
                      this.setState({
                        file: undefined
                      });
                    }}
                  >
                    <p className="ant-upload-drag-icon">
                      <UploadOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Click or drag file to this area to upload
                    </p>
                    <p className="ant-upload-hint">
                      Support for a single or bulk upload.
                    </p>
                  </Upload.Dragger>
                ) : (
                  <div>
                    <Tag
                      closable
                      onClose={() => {
                        this.setState({
                          file: undefined
                        });
                      }}
                    >
                      <FileImageOutlined />
                      <span style={{ marginLeft: 10 }}>{file.name}</span>
                    </Tag>
                  </div>
                )}
              </Form.Item>
            </Fragment>
          ) : null}
          <Form.Item label={' '} colon={false}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              onClick={this.submit}
            >
              {chapter_id ? '更新' : '创建'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
