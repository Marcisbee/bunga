import { useStore } from 'exome/react';
import { Suspense } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
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
            <Route
              path="/project/:id"
              element={(
                <Suspense fallback={<div>Loading...</div>}>
                  <ProjectPage />
                </Suspense>
              )}
            />
            <Route
              path="*"
              element={(
                <h1>
                  Error 404
                  <br />
                  <Link to="/">Back to home</Link>
                </h1>
              )}
            />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/projects" element={<Navigate to="/" replace />} />
            <Route path="/project/:id" element={<Navigate to="/" replace />} />
            <Route
              path="*"
              element={(
                <h1>
                  Error 404
                  <br />
                  <Link to="/">Back to home</Link>
                </h1>
              )}
            />
          </Routes>
        )}
      </BrowserRouter>
    </ErrorBoundary>
  );
}
