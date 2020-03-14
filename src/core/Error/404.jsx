import React from 'react';
import CoreException from './index';

const NotFound = function() {
  return <CoreException type="404" style={{ minHeight: 500, height: '80%' }} />;
};

export default NotFound;
