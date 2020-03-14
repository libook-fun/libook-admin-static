import { request } from 'utils/request';

export const getCategorys = data => request.get({ url: '/api/v1/category/read-all', data }).then(data => data);

export const getCategory = category_id => request.get({ url: '/api/v1/category/read', data: { category_id } }).then(data => data);

export const createCategory = data => request.post({ url: '/api/v1/category/create', data }).then(data => data);

export const updateCategory = data => request.post({ url: '/api/v1/category/update', data }).then(data => data);
