import { Link } from 'react-router-dom';

import { Footer } from '../../layouts/dashboard/footer/footer';
import { Header } from '../../layouts/dashboard/header/header';

export function ProjectsPage() {
  return (
    <div>
      <Header />
      <div>
        <Link to="/project/123">Project 123</Link>
      </div>
      <Footer />
    </div>
  );
}
