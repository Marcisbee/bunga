import * as React from 'react';
import { render, createRoot } from 'react-dom';

import { Router } from './pages/router';

import './styles/index.scss';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
);
