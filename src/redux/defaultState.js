export default {
  app: {
    appLoaded: false // 当前应用是否已经初始化完成
  },
  meta: {
    title: '' // 标题
  },
  header: {
    title: '',
    back: undefined,
    visible: true
  },
  user: {
    authority: [],
    avatar: undefined,
    id: undefined,
    name: undefined
  },
  ui: {
    loading: false // 当前是否有异步请求处理
  },
  data: {}
};
