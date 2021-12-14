import { superstructResolver } from '@hookform/resolvers/superstruct';
import { useStore } from 'exome/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import {
  string,
  object,
  size,
  intersection,
  define,
} from 'superstruct';

import { store } from '../../store/store';
import { isEmail } from '../../utils/is-email';

interface LoginForm {
  email: string
  password: string
}

const Email = define('Email', isEmail);

const schema = object({
  email: size(intersection([string(), Email]), 1, 128),
  password: size(string(), 3, 256),
});

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useStore(store.user);
  const [status, setStatus] = useState<{ loading?: boolean, error?: string }>({});
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: superstructResolver(schema),
  });

  const onSubmit = handleSubmit<LoginForm>(async (data) => {
    setStatus({ loading: true });

    try {
      await login(data.email, data.password);

      if (!store.user.isLoggedIn) {
        throw new Error('Login failed');
      }

      navigate('/', { replace: true });
    } catch (e) {
      if (e instanceof Error) {
        setStatus({ error: e?.message });
      }
      console.error(e);
    }
  });

  return (
    <div>
      <h1>Log in</h1>

      <p style={{ color: '#ff0051' }}>{status.error}</p>

      <form
        onSubmit={onSubmit}
      >
        <label>
          <strong style={{ display: 'block', paddingBottom: 4, textAlign: 'left' }}>Email:</strong>
          <input
            type="email"
            autoComplete="username"
            {...register('email')}
          />
        </label>
        <p style={{ color: '#ff0051' }}>{errors.email?.message}</p>

        <label>
          <strong style={{ display: 'block', paddingBottom: 4, textAlign: 'left' }}>Password:</strong>
          <input
            type="password"
            autoComplete="current-password"
            {...register('password')}
          />
        </label>
        <p style={{ color: '#ff0051' }}>{errors.password?.message}</p>

        <button type="submit" disabled={status.loading}>Log in</button>

        <br />
        <Link to="/signup">Sign up</Link>
      </form>
    </div>
  );
}
