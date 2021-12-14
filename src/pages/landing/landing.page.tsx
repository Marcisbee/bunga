import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <div>
      Landing Page
      <br />
      <br />
      <Link to="/login">Log in</Link>
      <Link to="/signup">Sign up</Link>
    </div>
  );
}
