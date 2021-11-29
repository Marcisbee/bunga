import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ErrorBoundary } from '../components/error-boundary/error-boundary';

import { HomePage } from './home/home.page';
import { ProjectPage } from './project/project.page';
import { ProjectsPage } from './projects/projects.page';

export function Router() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/project/:id" element={<ProjectPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
