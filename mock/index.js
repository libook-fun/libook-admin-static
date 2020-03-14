const Mock = require('mockjs');
module.exports = function(app) {
  app.use('/api/home', (req, res) => {
    res.json(Mock.mock({
      retcode: 200,
      retdesc: '成功',
      data: {
        // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
        'list|1-10': [
          {
            // 属性 id 是一个自增数，起始值为 1，每次增 1
            name: '@email',
            id: '@cname'
          }
        ]
      }
    }));
  });

  app.get('/api/user', (req, res) => {
    res.json(Mock.mock({
      code: 200,
      message: '',
      data: {
        id: 'sisimengchen@gmail.com',
        name: 'mengchen'
      },
      version: '1.0.0',
      now: +new Date()
    }));
  });

  app.post('/api/login', (req, res) => {
    res.json(Mock.mock({
      code: 200,
      message: '',
      data: {
        token: +new Date()
      },
      version: '1.0.0',
      now: +new Date()
    }));
  });

  app.post('/api/logout', (req, res) => {
    res.json(Mock.mock({
      code: 200,
      message: '',
      data: {},
      version: '1.0.0',
      now: +new Date()
    }));
  });
};
