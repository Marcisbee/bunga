import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/spaces">Spaces</Link>
      </nav>
      <div>Hello world</div>
    </div>
  );
}
