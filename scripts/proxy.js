module.exports = [
  () => ({
    context: (pathname, req) => {
      if (req.get('Accept').indexOf('text/html') >= 0) {
        return false;
      }
      return true;
    },
    target: 'http://localhost:7010/',
    // secure: true,
    changeOrigin: true,
    logLevel: 'silent'
  })
];
