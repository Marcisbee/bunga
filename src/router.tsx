import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Space } from './pages/space/space';
import { Home } from './pages/home/home';
import { Spaces } from './pages/spaces/spaces';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/spaces" element={<Spaces />} />
        <Route path="/space/:id" element={<Space />} />
      </Routes>
    </BrowserRouter>
  );
}
