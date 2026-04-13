"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useProfileStore } from '@/store/useProfileStore';

export default function RegisterPage() {
  const router = useRouter();
  const login = useProfileStore(state => state.login);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to register');
      }

      // Registration successful, redirect to login
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#f9fafb]">
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Side - Image Panel */}
        <div className="hidden lg:flex w-[45%] relative">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA60cdGKALd2pQ2j_vFRXqBdM8xkHxRL2TUuxV6HyKRvxxZF1APFeaRIX7Qxby8xlSO_e_JKcZOcJxIKTTKjSAQE0MAqL16tWXFa89NDXB6VnYFzRw-eGJeLss8WvdKS5XJHEMPKsAVaxIYb0-hBbmE5iL0x1I3uWWXcYVjs1K6G1xAYLV_--It3w2elFezBKBtlWzojY7ozfAeBupd_e7h6Z2UupTrtTCjQKBfM5ktgHTfiR6B5vQpZbY-XvWOpzyykxyr8HnvzrA" 
            alt="Sand dunes" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Logo */}
          <div className="absolute top-8 left-8 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg">
              <Compass className="w-5 h-5 text-[#0077b6]" />
            </div>
            <span className="text-white font-extrabold text-xl shadow-sm tracking-tight drop-shadow-md">
              Phan Thiet Travel Map
            </span>
          </div>
          
          {/* Bottom Card */}
          <div className="absolute bottom-16 left-12 right-12">
            <div className="bg-[#dfd4c5]/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-4">
                The Digital Concierge
              </h2>
              <p className="text-slate-800 text-lg leading-relaxed font-medium opacity-90">
                "The sand dunes of Mui Ne are not just a destination; they are a shifting canvas of light and shadow. Join our community to map your own coastal journey."
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form Panel */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 overflow-y-auto">
          <div className="w-full max-w-[480px]">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
              Begin your journey
            </h1>
            <p className="text-slate-600 text-base mb-10 font-medium">
              Create an account to save locations and share your coastal stories.
            </p>

            {error && (
              <div className="p-4 mb-6 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleRegister}>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Le Van An" 
                  className="w-full bg-[#f1f3f5] text-slate-800 px-4 py-3.5 rounded-xl border-none focus:ring-2 focus:ring-[#0077b6] outline-none transition-all placeholder:text-slate-400 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="explorer@phanthiet.vn" 
                  className="w-full bg-[#f1f3f5] text-slate-800 px-4 py-3.5 rounded-xl border-none focus:ring-2 focus:ring-[#0077b6] outline-none transition-all placeholder:text-slate-400 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-[#f1f3f5] text-slate-800 px-4 py-3.5 rounded-xl border-none focus:ring-2 focus:ring-[#0077b6] outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Confirm</label>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-[#f1f3f5] text-slate-800 px-4 py-3.5 rounded-xl border-none focus:ring-2 focus:ring-[#0077b6] outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox" 
                  id="terms" 
                  className="w-5 h-5 rounded border-slate-300 text-[#0077b6] focus:ring-[#0077b6] bg-[#f1f3f5]"
                  required
                />
                <label htmlFor="terms" className="text-sm font-medium text-slate-600">
                  I agree to the <Link href="#" className="text-[#0077b6] hover:underline">Terms of Service</Link> and <Link href="#" className="text-[#0077b6] hover:underline">Privacy Policy</Link>.
                </label>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#0077b6] hover:bg-[#005f92] text-white font-bold py-3.5 rounded-xl shadow-[0_4px_14px_rgba(0,119,182,0.39)] transition-all transform hover:-translate-y-0.5 mt-4 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isLoading ? "Creating..." : "Create Account"}
              </button>
            </form>


            <div className="mt-8 flex items-center gap-4">
              <div className="h-px bg-slate-200 flex-1"></div>
              <span className="text-sm font-medium text-slate-500">Or join with</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <button type="button" className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl transition-all shadow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </button>
              <button type="button" className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl transition-all shadow-sm">
                <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </button>
            </div>

            <p className="text-center mt-10 text-sm font-medium text-slate-600">
              Already exploring? <Link href="/login" className="text-[#0077b6] hover:underline font-bold">Log in to your account</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer Area */}
      <div className="bg-[#f1f3f5] py-4 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between text-xs font-semibold text-slate-500 border-t border-slate-200/60 sticky bottom-0 z-10 w-full shrink-0">
        <p>© 2024 Phan Thiet Travel Map. A Digital Concierge Experience.</p>
        <div className="flex gap-6 mt-3 sm:mt-0">
          <Link href="#" className="hover:text-slate-800 transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-slate-800 transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-slate-800 transition-colors">Contact Support</Link>
        </div>
      </div>
    </div>
  );
}
