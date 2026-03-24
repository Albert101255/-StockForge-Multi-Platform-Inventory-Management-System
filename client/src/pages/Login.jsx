import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-base overflow-hidden">
      {/* Left side - Branding */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center relative border-r border-border bg-gradient-to-br from-base to-surface">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(var(--accent) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="z-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <img src="/assets/icons/logo.svg" alt="StockForge Logo" className="w-32 h-32 mx-auto mb-8 drop-shadow-[0_0_15px_rgba(245,166,35,0.3)]" />
          <h1 className="text-6xl font-display font-bold text-text-primary tracking-widest mb-4">STOCK<span className="text-accent">FORGE</span></h1>
          <p className="text-xl font-mono text-text-muted tracking-widest uppercase">Inventory System</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-surface relative">
        <div className="w-full max-w-sm mx-auto animate-in fade-in duration-500">
          <div className="lg:hidden text-center mb-10">
            <h1 className="text-4xl font-display font-bold text-text-primary tracking-widest">STOCK<span className="text-accent">FORGE</span></h1>
          </div>
          
          <h2 className="text-2xl font-display font-semibold text-text-primary mb-2">Welcome Back</h2>
          <p className="font-sans text-text-secondary mb-8">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded text-sm text-center">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-text-secondary font-sans mb-1">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 bg-elevated border border-border rounded text-text-primary font-mono focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@stockforge.dev"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary font-sans mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 bg-elevated border border-border rounded text-text-primary font-mono focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full rounded py-3 mt-4 text-lg" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
            
            <div className="mt-6 text-center text-sm text-text-muted font-mono">
              <p>Demo Admin: admin@stockforge.dev / Admin@1234</p>
              <p className="mt-1">Demo Staff: staff@stockforge.dev / Staff@1234</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
