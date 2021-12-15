import { useStore } from 'exome/react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { ErrorBoundary } from '../components/error-boundary/error-boundary';
import { store } from '../store/store';

import { LandingPage } from './landing/landing.page';
import { LoginPage } from './login/login.page';
import { ProjectPage } from './project/project.page';
import { ProjectsPage } from './projects/projects.page';
import { SignupPage } from './signup/signup.page';

export function Router() {
  const { isLoggedIn } = useStore(store.user);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        {isLoggedIn ? (
          <Routes>
            <Route path="/" element={<Navigate to="/projects" replace />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/project/:id" element={<ProjectPage />} />
            <Route path="*" element={<Navigate to="/projects" replace />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </BrowserRouter>
    </ErrorBoundary>
  );
}
