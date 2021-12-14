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

interface SignupForm {
  name: string
  email: string
  password: string
}

const Email = define('Email', isEmail);

const schema = object({
  email: size(intersection([string(), Email]), 1, 128),
  name: size(string(), 2, 256),
  password: size(string(), 3, 256),
});

export function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useStore(store.user);
  const [status, setStatus] = useState<{ loading?: boolean, error?: string }>({});
  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({
    resolver: superstructResolver(schema),
  });

  const onSubmit = handleSubmit<SignupForm>(async (data) => {
    setStatus({ loading: true });

    try {
      await signup(data.email, data.password, data.name);

      if (!store.user.isLoggedIn) {
        throw new Error('Signup failed');
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
      <h1>Sign up</h1>

      <p style={{ color: '#ff0051' }}>{status.error}</p>

      <form
        onSubmit={onSubmit}
      >
        <label>
          <strong style={{ display: 'block', paddingBottom: 4, textAlign: 'left' }}>Display name:</strong>
          <input
            type="text"
            autoComplete="name"
            {...register('name')}
          />
        </label>
        <p style={{ color: '#ff0051' }}>{errors.name?.message}</p>

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

        <button type="submit" disabled={status.loading}>Sign up</button>

        <br />
        <Link to="/login">Log in</Link>
      </form>
    </div>
  );
}
