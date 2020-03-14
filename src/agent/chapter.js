import { request } from 'utils/request';

export const getChapters = data => request.get({ url: '/api/v1/chapter/read-all', data }).then(data => data);

export const getChapter = chapter_id => request.get({ url: '/api/v1/chapter/read', data: { chapter_id } }).then(data => data);

export const createChapter = data => request.postForm({ url: '/api/v1/chapter/create', data }).then(data => data);

export const updateChapter = data => request.postForm({ url: '/api/v1/chapter/update', data }).then(data => data);
