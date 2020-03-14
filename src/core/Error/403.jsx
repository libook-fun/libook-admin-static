import React from 'react';
import CoreException from './index';

const Forbidden = function() {
  return <CoreException type="403" style={{ minHeight: 500, height: '80%' }} />;
};

export default Forbidden;
