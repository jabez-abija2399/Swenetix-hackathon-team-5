import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { signupUser, clearAuthError } from '../store/slices/authSlice';
import AuthCard from '../components/auth/AuthCard';
import SignupForm from '../components/auth/SignupForm';

export default function Signup() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error } = useAppSelector((state) => state.auth || {});

  const handleSubmit = async (name: string, email: string, password: string) => {
    dispatch(clearAuthError());

    try {
      await dispatch(signupUser({ name, email, password })).unwrap();
      navigate('/reports', { replace: true });
    } catch {
      // Error handled via Redux state
    }
  };

  return (
    <AuthCard
      title="Create Account"
      footer={
        <>
          Already have an account? <Link to="/login">Sign in</Link>
        </>
      }
    >
      <SignupForm loading={loading} error={error} onSubmit={handleSubmit} />
    </AuthCard>
  );
}
