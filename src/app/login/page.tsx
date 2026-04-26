"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProfileStore, Role } from '@/store/useProfileStore';
import { useLocationStore } from '@/store/useLocationStore';
import { signIn, getSession, useSession } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const login = useProfileStore(state => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();

  // Auto-redirect if already logged in via OAuth or otherwise
  React.useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    setIsLoading(true);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false
      });

      if (res?.error) {
        setError('Tài khoản không tồn tại hoặc sai mật khẩu');
        setIsLoading(false);
        return;
      }

      // Fetch latest session data from Database via NextAuth
      const session = await getSession();
      const user = session?.user as any;
      
      // Extract properties mapping Database to Zustand Store
      const name = user?.name || email.split('@')[0] || "User";
      const role = (user?.role as Role) || "USER";

      login(name, email, role);
      
      // Fetch user's saved locations right away
      await useLocationStore.getState().fetchSavedLocations();

      router.push('/');
    } catch (err) {
      setError('Đã có lỗi xảy ra, vui lòng thử lại');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white">
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Side - Image Panel */}
        <div className="hidden lg:flex w-1/2 relative bg-slate-900">
          {/* Note: I'm using a beautiful sunset ocean image from unsplash that captures the vibe */}
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHNf3nOn4gnAg8WHKz_vxu1vt91IT5-mjLAGRlP-kz0i_aWXrVV_PDn6Yl5ZKNDA7QdtU1cQe8sH1zJVBzegNhzxYkpAQcKLFJvuagW7OQST64JGTv7rJ7GxcBLIcLbLvxUqg4tZ8uZntX6u4vANo1ga6xl0eO5o5dyJwAUVE9YtZ3QDCna3qpd4o2YRwZugm8VxA1dqPwBRhl7Tu0lcE5jfl7sUajXAJr1XWQo2QNNTuu9Mnt_ZSkMlQYiQL7cP1TrRllcpd_iBA" 
            alt="Sunset ocean background" 
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
          {/* Subtle warm overlay to give that golden sunset tone */}
          <div className="absolute inset-0 bg-gradient-to-t from-orange-900/30 to-transparent"></div>
          
          {/* Bottom Card */}
          <div className="absolute bottom-16 left-12 right-12 max-w-[500px]">
             {/* The image uses a beige container #dccfbe */}
            <div className="bg-[#dccfbe]/95 backdrop-blur-md rounded-2xl p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden text-left">
              
              <h2 className="text-[32px] font-black text-[#0077b6] tracking-tight mb-5 drop-shadow-sm leading-tight">
                Phan Thiet Travel Map
              </h2>
              <p className="text-slate-800 text-[17px] leading-relaxed font-semibold italic mb-10 opacity-90">
                "Discover the hidden corridors of Binh Thuan, from the whispers of the red dunes to the rhythm of the coastal breeze."
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-1 bg-[#0077b6] rounded-full"></div>
                <span className="text-[10px] uppercase font-black tracking-[0.15em] text-[#0077b6]">
                  Digital Concierge Edition
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form Panel */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 overflow-y-auto relative">
          <div className="w-full max-w-[420px]">
            <h1 className="text-[40px] font-black text-slate-900 tracking-tight mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-600 text-lg mb-12 font-medium">
              Continue your coastal journey.
            </p>

            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2.5">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="concierge@example.com" 
                  className="w-full bg-[#f1f3f5] text-slate-800 px-4 py-3.5 rounded-xl border-none focus:ring-2 focus:ring-[#0077b6] outline-none transition-all placeholder:text-slate-400 font-medium"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2.5">
                  <label className="block text-sm font-bold text-slate-900">Password</label>
                  <Link href="#" className="text-sm font-bold text-[#0077b6] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-[#f1f3f5] text-slate-800 px-4 py-3.5 rounded-xl border-none focus:ring-2 focus:ring-[#0077b6] outline-none transition-all placeholder:text-slate-400 tracking-widest font-black"
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm font-semibold bg-red-50 p-3 rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <div className="flex items-center gap-3 pt-1 pb-2">
                <input 
                  type="checkbox" 
                  id="remember" 
                  className="w-5 h-5 rounded border-slate-300 text-[#0077b6] focus:ring-[#0077b6] bg-[#f1f3f5]"
                />
                <label htmlFor="remember" className="text-sm font-bold text-slate-700 cursor-pointer">
                  Remember this device
                </label>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#0077b6] hover:bg-[#005f92] disabled:opacity-70 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_14px_rgba(0,119,182,0.39)] transition-all transform hover:-translate-y-0.5 text-lg"
              >
                {isLoading ? "Đang xử lý..." : "Sign In"}
              </button>
            </form>

            <div className="mt-10 flex items-center gap-4">
              <div className="h-[1px] bg-slate-100 flex-1"></div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Or Connect With</span>
              <div className="h-[1px] bg-slate-100 flex-1"></div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <button 
                type="button" 
                onClick={() => signIn('google', { callbackUrl: '/' }, { prompt: 'select_account' })}
                className="flex items-center justify-center gap-3 bg-white border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-slate-200 text-slate-800 font-extrabold text-sm py-3.5 rounded-xl transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </button>
              <button type="button" className="flex items-center justify-center gap-3 bg-white border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-slate-200 text-slate-800 font-extrabold text-sm py-3.5 rounded-xl transition-all">
                <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </button>
            </div>

            <p className="text-center mt-12 text-sm font-semibold text-slate-600">
              Don't have an account yet? <Link href="/register" className="text-[#0077b6] hover:underline font-black">Create Account</Link>
            </p>
          </div>

          {/* Floating Footer Pill */}
          <div className="absolute bottom-6 mx-auto">
            <div className="bg-[#f8f9fa] rounded-full px-8 py-3 flex items-center gap-6 shadow-sm border border-slate-200">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">© 2024 Phan Thiet Travel Map</span>
              <div className="flex gap-4">
                <Link href="#" className="text-[10px] font-black text-[#0077b6] uppercase tracking-widest hover:text-[#005f92]">Privacy</Link>
                <Link href="#" className="text-[10px] font-black text-[#0077b6] uppercase tracking-widest hover:text-[#005f92]">Terms</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
