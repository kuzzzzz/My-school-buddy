import { FormEvent, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../contexts/AuthContext';

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setToken } = useAuth();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const payload = mode === 'login' ? { email, password } : { name, email, password };
      const response = await api.post(endpoint, payload);
      setToken(response.data.token);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card narrow">
      <h2>{mode === 'login' ? 'Welcome back' : 'Create your UCC account'}</h2>
      <form onSubmit={submit}>
        {mode === 'register' && <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />}
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required type="email" />
        <input placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required type="password" />
        <button disabled={loading}>{loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}</button>
      </form>
      {error && <p className="error">{error}</p>}
      <button className="ghost" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
        {mode === 'login' ? 'Need an account?' : 'Already have an account?'}
      </button>
    </section>
  );
}
