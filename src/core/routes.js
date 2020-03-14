/* eslint-disable no-unused-vars */
import React from 'react';
import Loadable from 'react-loadable';
import { Instagram } from 'react-content-loader';
// import BaseLayout from "layouts/BaseLayout";

const getComponent = loader => ({
  loader: loader,
  loading: Instagram
});

const routes = [
  {
    path: '/cms',
    title: '首页',
    // layout: BaseLayout,
    exact: true,
    component: Loadable(getComponent(() => import(/* webpackChunkName: "HomePage" */ 'pages/Home')))
  },
  {
    path: '/cms/category',
    title: 'category',
    // layout: BaseLayout,
    exact: true,
    component: Loadable(getComponent(() => import(/* webpackChunkName: "CategoryPage" */ 'pages/Category')))
  },
  {
    path: '/cms/category/add',
    title: 'category add',
    // layout: BaseLayout,
    exact: true,
    component: Loadable(getComponent(() => import(/* webpackChunkName: "CategoryAddPage" */ 'pages/Category/Add')))
  },
  {
    path: '/cms/book',
    title: 'book',
    // layout: BaseLayout,
    exact: true,
    component: Loadable(getComponent(() => import(/* webpackChunkName: "BookPage" */ 'pages/Book')))
  },
  {
    path: '/cms/book/add',
    title: 'book add',
    // layout: BaseLayout,
    exact: true,
    component: Loadable(getComponent(() => import(/* webpackChunkName: "BookAddPage" */ 'pages/Book/Add')))
  },
  {
    path: '/cms/book/subbook',
    title: 'book subbook',
    // layout: BaseLayout,
    exact: true,
    component: Loadable(getComponent(() => import(/* webpackChunkName: "BookSubbookPage" */ 'pages/Book/Subbook')))
  },
  {
    path: '/cms/book/subbook/add',
    title: 'book subbook add',
    // layout: BaseLayout,
    exact: true,
    component: Loadable(getComponent(() => import(/* webpackChunkName: "BookSubbookAddPage" */ 'pages/Book/Subbook/Add')))
  },
  {
    path: '/cms/chapter',
    title: 'chapter',
    // layout: BaseLayout,
    exact: true,
    component: Loadable(getComponent(() => import(/* webpackChunkName: "ChapterPage" */ 'pages/Chapter')))
  },
  {
    path: '/cms/chapter/add',
    title: 'chapter add',
    // layout: BaseLayout,
    exact: true,
    component: Loadable(getComponent(() => import(/* webpackChunkName: "ChapterAddPage" */ 'pages/Chapter/Add')))
  },
  {
    path: '/cms/exhibition',
    title: 'exhibition',
    // layout: BaseLayout,
    exact: true,
    component: Loadable(getComponent(() => import(/* webpackChunkName: "ExhibitionPage" */ 'pages/Exhibition')))
  },
  {
    path: '/cms/exhibition/add',
    title: 'exhibition add',
    // layout: BaseLayout,
    exact: true,
    component: Loadable(getComponent(() => import(/* webpackChunkName: "ExhibitionAddPage" */ 'pages/Exhibition/Add')))
  },
  {
    path: '/cms/recommender',
    title: 'recommender',
    // layout: BaseLayout,
    exact: true,
    component: Loadable(getComponent(() => import(/* webpackChunkName: "RecommenderPage" */ 'pages/Recommender')))
  },
  {
    path: '/cms/recommender/add',
    title: 'recommender add',
    // layout: BaseLayout,
    exact: true,
    component: Loadable(getComponent(() => import(/* webpackChunkName: "RecommenderAddPage" */ 'pages/Recommender/Add')))
  },
  {
    path: '/page/forbidden',
    title: '禁止访问',
    // layout: BaseLayout,
    component: require('core/Error/403').default
  },
  {
    path: '*',
    title: '抱歉，您访问的页面不存在！',
    // layout: BaseLayout,
    component: require('core/Error/404').default
  }
];

export default routes;
