import * as React from 'react';
import { render } from 'react-dom';

import { Router } from './pages/router';

import './styles/index.scss';

render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
  document.getElementById('root'),
);
