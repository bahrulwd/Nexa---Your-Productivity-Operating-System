import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../../lib/api';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !passwordConfirm) {
      setError('Harap isi semua kolom formulir.');
      return;
    }
    if (password !== passwordConfirm) {
      setError('Password dan konfirmasi password tidak cocok.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.register(name, email, password, passwordConfirm);
      navigate('/onboarding');
    } catch (err: any) {
      const msg = err?.response?.data?.message
        || err?.response?.data?.errors?.email?.[0]
        || err?.response?.data?.errors?.password?.[0]
        || 'Pendaftaran gagal. Silakan coba lagi.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSSORegister = async () => {
    setError('Google SSO belum tersedia. Gunakan email dan password.');
  };


  return (
    <div className="min-h-screen bg-[#FDF5EC] flex items-center justify-center p-4 md:p-6 select-none font-sans overflow-hidden">
      {/* Main Bento Container - compact padding & height to fit standard screens without scrolling */}
      <main className="w-full max-w-4xl bg-white rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(42,39,83,0.05)] flex flex-col md:flex-row border border-[#F3F4F6]/80 z-10 transition-all duration-300 hover:shadow-[0_25px_60px_rgba(42,39,83,0.08)]">

        {/* Left Column: Identity & Branding */}
        <section className="md:w-1/2 bg-[#2a2753] p-8 md:p-10 relative flex flex-col justify-between overflow-hidden">
          {/* Glassmorphic Decorative Background */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 backdrop-blur-[10px] border border-white/10 rounded-full opacity-20 pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-full opacity-10 pointer-events-none" />
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/10 backdrop-blur-[10px] border border-white/10 rotate-45 opacity-15 pointer-events-none" />

          <div className="relative z-10 flex flex-col h-full justify-between">
            {/* Premium Logo (LogoPanjang) */}
            <div className="mb-6">
              <img
                src="/images/LogoPanjang.png"
                alt="Nexa Logo"
                className="h-7 object-contain hover:brightness-110 hover:scale-[1.02] transition-all duration-300"
              />
            </div>

            {/* Hero Content with Gradient Text */}
            <div className="my-auto py-4">
              <h1 className="font-display font-extrabold text-[28px] leading-[36px] text-white mb-3 tracking-tight leading-tight">
                Begin your focus <br />
                <span className="text-[#fec886]">journey with us.</span>
              </h1>
              <p className="font-sans text-[14px] leading-[22px] text-white/70 leading-relaxed font-medium">
                Create workspaces, optimize focus timer blocks, and monitor your workloads in real time.
              </p>
            </div>

            {/* Illustration Tablet Interface - height reduced */}
            <div className="mt-6 relative z-10 rounded-2xl overflow-hidden border border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.2)] bg-black/10 group">
              <img
                className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                alt="A sophisticated, high-end digital dashboard interface displayed on a sleek tablet."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBL1y0v-mSxlLTp4zUfKrhTvqwx24a5iiCexhU3gkwZqJUQ8LB8O6We7PlurMbhCGSgqzyclJ2QpNAs8XrIrXqPGhkxsjJTkYcIwJBeDz54QDy4MZuu6KddqtabDpDLaNd5oI6zJPNR-7MBF26B1NEDhgs9KEi4dsO2QRBtird0MozCQoS5vff6s8-_vwurU0MJ5Ok4Z_jPxM7IvjrQ2c3R4TBE8TkKBtKXJuE3TnNDipRpG2e8TWjZIZXxBY9bseRRWNGpG_0ze2YS"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a2753]/40 to-transparent pointer-events-none" />
            </div>
          </div>
        </section>

        {/* Right Column: Register Form */}
        <section className="md:w-1/2 bg-white p-8 md:p-10 flex flex-col justify-center">
          <div className="w-full max-w-sm mx-auto">
            <header className="mb-4.5">
              <h2 className="font-display font-black text-[26px] leading-[32px] text-[#15113d] mb-1">Create Account</h2>
              <p className="font-sans text-[13px] font-bold text-[#9CA3AF]">Sign up below to access your new workspace.</p>
            </header>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs font-bold text-red-500 animate-fade-in flex items-center gap-2">
                <i className="fa-solid fa-triangle-exclamation"></i>
                <span>{error}</span>
              </div>
            )}

            {/* Google SSO Button with Transparent Wikimedia SVG Logo */}
            <button
              onClick={handleSSORegister}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 py-2 px-4 border border-[#F3F4F6] rounded-xl font-sans font-bold text-[13px] text-[#15113d] hover:bg-[#F8F9FB] hover:border-gray-200 shadow-sm transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              <img
                alt="Google G Logo"
                className="w-4 h-4 object-contain"
                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
              />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center my-4.5">
              <div className="flex-grow h-[1px] bg-[#F3F4F6]"></div>
              <span className="px-3 font-sans font-extrabold text-[9px] tracking-widest text-[#9CA3AF] uppercase">or email</span>
              <div className="flex-grow h-[1px] bg-[#F3F4F6]"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-3.5">
              {/* Full Name */}
              <div className="space-y-1 focus-within:translate-y-[-1px] transition-transform duration-200">
                <label className="font-sans font-bold text-[12.5px] text-[#15113d] block" htmlFor="name">Full name</label>
                <input
                  className="w-full px-4 py-2 border border-[#F3F4F6] rounded-xl font-sans text-[14.5px] transition-all outline-none focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/8 bg-[#F8F9FB]/40 focus:bg-white text-[#15113d] placeholder:text-gray-300"
                  id="name"
                  type="text"
                  placeholder="Alex Nexa"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1 focus-within:translate-y-[-1px] transition-transform duration-200">
                <label className="font-sans font-bold text-[12.5px] text-[#15113d] block" htmlFor="email">Email address</label>
                <input
                  className="w-full px-4 py-2 border border-[#F3F4F6] rounded-xl font-sans text-[14.5px] transition-all outline-none focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/8 bg-[#F8F9FB]/40 focus:bg-white text-[#15113d] placeholder:text-gray-300"
                  id="email"
                  type="email"
                  placeholder="alex@nexa.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-1 focus-within:translate-y-[-1px] transition-transform duration-200">
                <label className="font-sans font-bold text-[12.5px] text-[#15113d] block" htmlFor="password">Password</label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-2 border border-[#F3F4F6] rounded-xl font-sans text-[14.5px] transition-all outline-none focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/8 pr-10 bg-[#F8F9FB]/40 focus:bg-white text-[#15113d] placeholder:text-gray-300"
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] cursor-pointer hover:text-[#15113d]"
                  >
                    {showPassword ? <i className="fa-regular fa-eye-slash text-sm"></i> : <i className="fa-regular fa-eye text-sm"></i>}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1 focus-within:translate-y-[-1px] transition-transform duration-200">
                <label className="font-sans font-bold text-[12.5px] text-[#15113d] block" htmlFor="password-confirm">Konfirmasi Password</label>
                <input
                  className="w-full px-4 py-2 border border-[#F3F4F6] rounded-xl font-sans text-[14.5px] transition-all outline-none focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/8 bg-[#F8F9FB]/40 focus:bg-white text-[#15113d] placeholder:text-gray-300"
                  id="password-confirm"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  required
                />
              </div>


              {/* Sign Up button */}
              <button
                className="w-full py-2 bg-gradient-to-r from-[#7C3AED] to-[#6C5DD3] text-white font-display font-bold text-[15px] rounded-xl hover:from-[#6B32CD] hover:to-[#5B4EBE] transition-all duration-300 shadow-md shadow-[#7C3AED]/15 hover:shadow-[#7C3AED]/30 active:scale-95 duration-100 cursor-pointer disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            {/* Signin Footer */}
            <footer className="mt-4.5 text-center">
              <p className="font-sans text-[13.5px] font-bold text-[#9CA3AF]">
                Already have an account?{' '}
                <Link className="font-sans font-bold text-[#7C3AED] hover:underline ml-1" to="/login">
                  Sign in instead
                </Link>
              </p>
            </footer>
          </div>
        </section>

      </main>
    </div>
  );
};
export default RegisterPage;
