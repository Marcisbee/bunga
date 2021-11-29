import { Link } from 'react-router-dom';

export function Header() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/projects">Projects</Link>
    </nav>
  );
}
