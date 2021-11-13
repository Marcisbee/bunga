import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { SpacePage } from './pages/space/space.page';
import { HomePage } from './pages/home/home.page';
import { SpacesPage } from './pages/spaces/spaces.page';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/spaces" element={<SpacesPage />} />
        <Route path="/space/:id" element={<SpacePage />} />
      </Routes>
    </BrowserRouter>
  );
}
