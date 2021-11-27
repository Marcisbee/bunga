import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/projects">Projects</Link>
      </nav>
    </div>
  );
}
