import { Link } from 'react-router-dom';

export function ProjectsPage() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/projects">Projects</Link>
      </nav>
      <div>
        <Link to="/project/123">Project 123</Link>
      </div>
    </div>
  );
}
