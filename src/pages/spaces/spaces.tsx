import { Link } from 'react-router-dom';

export function Spaces() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/spaces">Spaces</Link>
      </nav>
      <div>
        <Link to="/space/123">Space 123</Link>
      </div>
    </div>
  );
}
