import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      const token = response.data.token;

      if (token) {
        login(token);
        const decoded: { role: string } = JSON.parse(atob(token.split('.')[1]));

        // 👇 Route based on user role
        if (decoded.role === 'ADMIN') {
          navigate('/dashboard');
        } else if (decoded.role === 'USER') {
          navigate('/dashboard-user');
        } else {
          setError('Unknown user role.');
        }
      } else {
        setError('No token received');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-8 bg-white rounded-xl shadow-md space-y-6">
      <h1 className="text-2xl font-bold text-center text-gray-800">Welcome back</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      {error && (
        <div className="text-red-500 text-sm text-center py-2">
          {error}
        </div>
      )}

      <div className="text-sm text-center text-gray-600 pt-2">
        Don't have an account?{' '}
        <Link 
          to="/signup" 
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
