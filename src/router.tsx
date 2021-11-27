import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { HomePage } from './pages/home/home.page';
import { ProjectPage } from './pages/project/project.page';
import { ProjectsPage } from './pages/projects/projects.page';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/project/:id" element={<ProjectPage />} />
      </Routes>
    </BrowserRouter>
  );
}
