import { useState } from 'react';

interface SignupFormProps {
  loading?: boolean;
  error?: string | null;
  onSubmit: (name: string, email: string, password: string) => void;
}

export default function SignupForm({ loading = false, error = null, onSubmit }: SignupFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      onSubmit(name, email, password);
      return;
    }
    onSubmit(name, email, password);
  };

  const passwordsMatch = password === confirmPassword || confirmPassword === '';

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {error && <div className="auth-error">{error}</div>}

      <div className="form-field">
        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
        />
      </div>

      <div className="form-field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@example.com"
        />
      </div>

      <div className="form-field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
        />
      </div>

      <div className="form-field">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat your password"
        />
        {!passwordsMatch && (
          <span style={{ color: 'var(--lost)', fontSize: '0.8rem', marginTop: '-0.5rem' }}>
            Passwords do not match
          </span>
        )}
      </div>

      <button type="submit" disabled={loading || !passwordsMatch} className="btn-block">
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}
