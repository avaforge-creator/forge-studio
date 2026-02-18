import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    let result;
    if (isSignup) {
      result = signup(email, password, '');
    } else {
      result = login(email, password);
    }

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Authentication failed. Please try again.');
    }
    setIsLoading(false);
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError('');
    setPassword('');
  };

  const fillDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123'); // Default password for demo accounts
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-forge-emerald/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-[#b38b4d] rounded-2xl flex items-center justify-center shadow-glow-gold mx-auto mb-4">
            <span className="material-symbols-outlined text-black font-bold text-3xl">bolt</span>
          </div>
          <h1 className="font-extrabold text-3xl text-white font-display">Forge AI</h1>
          <p className="text-[12px] uppercase tracking-widest text-primary/80 font-medium mt-1">Studio</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#141414] border border-forge-border rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-2">
            {isSignup ? 'Create Account' : 'Welcome back'}
          </h2>
          <p className="text-forge-text-muted text-sm mb-6">
            {isSignup 
              ? 'Sign up with your authorized email' 
              : 'Enter your credentials to access Mission Control'}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-xs font-medium text-forge-text-muted mb-2 uppercase tracking-wide">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-[#0A0A0A] border border-forge-border rounded-lg py-3 px-4 text-white placeholder:text-forge-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-forge-text-muted mb-2 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-[#0A0A0A] border border-forge-border rounded-lg py-3 px-4 text-white placeholder:text-forge-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                required
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] mt-0.5">error</span>
                <span className="whitespace-pre-line">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-gradient-to-r from-primary to-[#b38b4d] hover:from-primary/90 hover:to-[#b38b4d]/90 disabled:from-forge-border disabled:to-forge-border text-black font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                  {isSignup ? 'Creating Account...' : 'Authenticating...'}
                </>
              ) : (
                <>
                  <span>{isSignup ? 'Sign Up' : 'Sign In'}</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle Sign Up / Sign In */}
          <div className="-6 border-tmt-6 pt border-forge-border">
            <button
              type="button"
              onClick={toggleMode}
              className="w-full text-center text-sm text-forge-text-muted hover:text-primary transition-colors"
            >
              {isSignup ? (
                <>Already have an account? <span className="text-primary font-medium">Sign in</span></>
              ) : (
                <>Don't have an account? <span className="text-primary font-medium">Sign up</span></>
              )}
            </button>
          </div>

          {/* Demo credentials hint */}
          {!isSignup && (
            <div className="mt-6 pt-6 border-t border-forge-border">
              <p className="text-xs text-forge-text-muted text-center mb-3">Demo accounts (password: demo123):</p>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => fillDemoAccount('nikanwethr@gmail.com')}
                  className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[14px]">person</span>
                  nikanwethr@gmail.com → Nikan
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('babakwethr@gmail.com')}
                  className="text-xs text-forge-emerald hover:text-forge-emerald/80 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[14px]">person</span>
                  babakwethr@gmail.com → Babak
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('hsn_shrf@icloud.com')}
                  className="text-xs text-blue-400 hover:text-blue-400/80 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[14px]">person</span>
                  hsn_shrf@icloud.com → Hossein
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-forge-text-muted/50 text-xs mt-6">
          Mission Control Dashboard • Forge AI Studio
        </p>
      </div>
    </div>
  );
};

export default LoginView;
