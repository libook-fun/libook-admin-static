import { request } from 'utils/request';

export const getBooks = data => request.get({ url: '/api/v1/book/read-all', data }).then(data => data);

export const getBook = book_id => request.get({ url: '/api/v1/book/read', data: { book_id } }).then(data => data);

export const createBook = data => request.postForm({ url: '/api/v1/book/create', data }).then(data => data);

export const updateBook = data => request.postForm({ url: '/api/v1/book/update', data }).then(data => data);

export const getSubbooks = data => request.get({ url: '/api/v1/book/subbooks', data }).then(data => data);

export const getParentbook = book_id => request.get({ url: '/api/v1/book/parentbook', data: { book_id } }).then(data => data);

export const createBind = data => request.post({ url: '/api/v1/book/bind', data }).then(data => data);

export const deleteBind = (parent_id, book_id) => request.post({ url: '/api/v1/book/unbind', data: { parent_id, book_id } }).then(data => data);

export const getAvailableSubbooks = () => request.get({ url: '/api/v1/book/available-subbooks' }).then(data => data);

