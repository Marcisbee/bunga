import * as React from 'react';
import { render } from 'react-dom';

import { Router } from './router';
import './index.css';

render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
  document.getElementById('root')
);
