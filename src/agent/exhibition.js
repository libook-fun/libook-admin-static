import { request } from 'utils/request';

export const getExhibitions = data => request.get({ url: '/api/v1/exhibition/read-all', data }).then(data => data);

export const getExhibition = exhibition_id => request.get({ url: '/api/v1/exhibition/read', data: { exhibition_id } }).then(data => data);

export const createExhibition = data => request.post({ url: '/api/v1/exhibition/create', data }).then(data => data);

export const updateExhibition = data => request.post({ url: '/api/v1/exhibition/update', data }).then(data => data);

export const deleteExhibition = exhibition_id => request.post({ url: '/api/v1/exhibition/delete', data: { exhibition_id } }).then(data => data);