import React, { PureComponent, Fragment } from 'react';
import { history } from 'core/history';
import { Link } from 'react-router-dom';
import { Form, Select, Input, Switch, Upload, Button, Icon, message, Breadcrumb, Tag, Divider, PageHeader } from 'antd';
import { getCategorys, getBook, createBook, updateBook, getParentbook, getSubbooks, deleteBind } from 'agent';
import { getOptions, FORM_LAYOUT } from 'utils/antdHelpers';

export default class BookAdd extends PureComponent {
  constructor(props) {
    super(props);
    const { category_id, book_id } = props.location.query;
    this.state = {
      book_id,
      category_id,
      name: undefined,
      author: undefined,
      description: undefined,
      is_subbook: 0,
      file: undefined,
      categoryOptions: [],
      loading: false
    };
  }

  componentDidMount() {
    const { book_id } = this.state;
    book_id &&
      getBook(book_id)
        .then((data = {}) => {
          const { category_id, name, author, description, is_subbook, category = {} } = data;
          this.setState({
            category_id,
            name,
            author,
            description,
            is_subbook,
            book: {
              name,
              categoryname: category.name
            }
          });
          if (is_subbook == 1) {
            this.getParentbook();
          } else {
            this.getSubbooks();
          }
        })
        .catch((error) => {
          message.error(error.message);
        });
    getCategorys()
      .then((categorys = []) => {
        this.setState({
          categoryOptions: categorys.map(category => ({
            value: `${category.category_id}`,
            label: category.name
          }))
        });
      })
      .catch((error) => {
        message.error(error.message);
      });
  }

  getParentbook() {
    const { book_id, is_subbook } = this.state;
    book_id &&
      is_subbook &&
      getParentbook(book_id)
        .then((data = {}) => {
          const { parent_id } = data;
          this.setState(
            {
              parent_id
            },
            () => {
              getBook(parent_id)
                .then((parentBook = {}) => {
                  this.setState({
                    parentBook
                  });
                })
                .catch((error) => {
                  message.error(error.message);
                });
            }
          );
        })
        .catch((error) => {
          message.error(error.message);
        });
  }

  getSubbooks() {
    const { book_id } = this.state;
    book_id &&
      getSubbooks({ parent_id: book_id })
        .then((subbooks = []) => {
          this.setState({
            subbooks
          });
        })
        .catch((error) => {
          message.error(error.message);
        });
  }

  deleteBind() {
    const { parent_id, book_id } = this.state;
    parent_id &&
      book_id &&
      deleteBind(parent_id, book_id)
        .then((data) => {
          message.success('解绑成功', 1, () => {
            this.setState({
              parent_id: undefined,
              parentBook: undefined
            });
          });
        })
        .catch((error) => {
          message.error(error.message);
        });
  }

  check() {
    const { book_id, category_id, name, author, description, file } = this.state;
    if (!category_id) {
      message.error('请输入分类');
      return false;
    }
    if (!name) {
      message.error('请输入名称');
      return false;
    }
    if (!author) {
      message.error('请输入作者');
      return false;
    }
    if (!description) {
      message.error('请输入描述');
      return false;
    }
    if (!book_id && !file) {
      message.error('请上传封面');
      return false;
    }
    return true;
  }

  getParam() {
    const { book_id, category_id, name, author, description, is_subbook, file } = this.state;
    return {
      book_id,
      category_id,
      name,
      author,
      description,
      is_subbook,
      file
    };
  }

  submit = () => {
    if (!this.check()) {
      return;
    }
    const data = this.getParam();
    const { book_id } = this.state;
    this.setState({
      loading: true
    });
    if (book_id) {
      updateBook(data)
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
      createBook(data)
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
    const {
      book,
      book_id,
      parent_id,
      parentBook,
      subbooks = [],
      category_id,
      name,
      author,
      description,
      is_subbook,
      file,
      categoryOptions,
      loading
    } = this.state;
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
          <Breadcrumb.Item>{book_id ? '更新' : '创建'}书籍</Breadcrumb.Item>
        </Breadcrumb>
        <PageHeader
          style={{
            paddingTop: 0
          }}
          title={book ? `更新${book.name}` : '创建书籍'}
          subTitle={book ? book.categoryname : null}
        />
        <Form {...FORM_LAYOUT}>
          <Form.Item label="是否可作为丛书">
            <Switch
              style={{ marginRight: 10 }}
              checkedChildren="是"
              unCheckedChildren="否"
              checked={is_subbook}
              onChange={(checked) => {
                this.setState({
                  is_subbook: checked ? 1 : 0
                });
              }}
              ref={ref => (this.description = ref)}
            />
            {parentBook ? (
              <Fragment>
                <a href={`/cms/book/add?book_id=${parent_id}`} target="_blank">
                  查看主书（{parentBook ? parentBook.name : null}）
                </a>
                <Divider type="vertical" />
                <a href={`/cms/book/subbook?parent_id=${parent_id}`} target="_blank">
                  查看相关丛书
                </a>
                <Divider type="vertical" />
                <a
                  onClick={() => {
                    this.deleteBind();
                  }}
                >
                  解除主丛绑定
                </a>
              </Fragment>
            ) : null}
            {subbooks.length ? <Link to={`/cms/book/subbook?parent_id=${book_id}`}>查看丛书</Link> : null}
          </Form.Item>
          <Form.Item label="分类" required>
            <Select
              showSearch
              placeholder="请选择"
              value={category_id ? `${category_id}` : category_id}
              optionFilterProp="children"
              onChange={(category_id) => {
                this.setState({ category_id });
              }}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              ref={ref => (this.category_id = ref)}
            >
              {getOptions(categoryOptions)}
            </Select>
          </Form.Item>
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
          <Form.Item label="作者" required>
            <Input
              type="text"
              placeholder="请输入"
              value={author}
              onChange={(e) => {
                this.setState({
                  author: e.target.value || undefined
                });
              }}
              ref={ref => (this.author = ref)}
            />
          </Form.Item>
          <Form.Item label="描述" required>
            <Input.TextArea
              rows={4}
              maxLength="200"
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
          <Form.Item label="封面" required={!book_id}>
            {!file ? (
              <Upload.Dragger
                accept="image/png,image/jpeg,image/gif,image/webp"
                beforeUpload={(file) => {
                  this.setState({
                    file
                  });
                  return false;
                }}
                onRemove={(file) => {
                  this.setState({
                    file: undefined
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
                      file: undefined
                    });
                  }}
                >
                  <Icon type="file-image" />
                  <span style={{ marginLeft: 10 }}>{file.name}</span>
                </Tag>
              </div>
            )}
          </Form.Item>
          <Form.Item label={' '} colon={false}>
            <Button type="primary" htmlType="submit" loading={loading} onClick={this.submit}>
              {book_id ? '更新' : '创建'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
