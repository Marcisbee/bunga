import { Link } from 'react-router-dom';

import { store } from '../../../store/store';

export function Header() {
  return (
    <nav>
      <Link to="/projects">Projects</Link>
      <button
        type="button"
        onClick={store.user.logout}
      >
        Log out
      </button>
    </nav>
  );
}
