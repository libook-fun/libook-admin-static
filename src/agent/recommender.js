import { request } from 'utils/request';

export const getRecommenders = data => request.get({ url: '/api/v1/recommender/read-all', data }).then(data => data);

export const getRecommender = recommender_id => request.get({ url: '/api/v1/recommender/read', data: { recommender_id } }).then(data => data);

export const createRecommender = data => request.postForm({ url: '/api/v1/recommender/create', data }).then(data => data);

export const updateRecommender = data => request.postForm({ url: '/api/v1/recommender/update', data }).then(data => data);

export const activeRecommender = recommender_id => request.post({ url: '/api/v1/recommender/active', data: { recommender_id } }).then(data => data);

export const disableRecommender = recommender_id => request.post({ url: '/api/v1/recommender/disable', data: { recommender_id } }).then(data => data);

export const deleteRecommender = recommender_id => request.post({ url: '/api/v1/recommender/delete', data: { recommender_id } }).then(data => data);
