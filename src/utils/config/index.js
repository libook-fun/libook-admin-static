export const getPreviewURL = function(path) {
  const host = process.env.NODE_ENV === 'development' ? '//127.0.0.1:7001' : '';
  return `${host}${path}`;
};
