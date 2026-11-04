// src/components/layout/Navbar.tsx
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { logout } from '../../store/slices/authSlice';

export default function Navbar() {
  const dispatch = useAppDispatch();
  
  const { user = null, isAuthenticated = false } = useAppSelector(
    (state) => state.auth || {}
  );

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem' }}>
      <Link to="/">Lost & Found</Link>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {isAuthenticated ? (
          <>
            <span>Welcome, {user?.name || 'User'}</span>
            <Link to="/reports/new">+ Report Item</Link>
            <button type="button" onClick={() => dispatch(logout())}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}