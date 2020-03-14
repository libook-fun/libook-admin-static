import React from 'react';
import CoreException from './index';

const ServerError = function() {
  return <CoreException type="500" style={{ minHeight: 500, height: '80%' }} />;
};

export default ServerError;
