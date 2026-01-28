
import React from 'react';
import { LoginScreenProps } from '../../types';

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image with Animation */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2670&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          animation: 'ken-burns 30s ease-in-out infinite alternate'
        }}
      />

      {/* Overlay for better contrast/focus */}
      <div className="absolute inset-0 z-0 bg-white/20 dark:bg-black/50 backdrop-blur-sm" />

      {/* CSS for custom animation */}
      <style>{`
          @keyframes ken-burns {
              0% { transform: scale(1) translate(0, 0); }
              100% { transform: scale(1.15) translate(-2%, -2%); }
          }
      `}</style>

      <div className="relative z-10 bg-white/80 dark:bg-slate-900/80 p-10 rounded-3xl shadow-2xl w-full max-w-md text-center border border-white/50 dark:border-white/10 backdrop-blur-xl">
        <div className="w-24 h-24 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-glow rotate-6 hover:rotate-12 transition-transform duration-500">
          <div className="w-12 h-12 bg-white rounded-xl opacity-20 rotate-45"></div>
        </div>
        <h1 className="text-4xl font-logo font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">SabTask</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium text-lg">Manage projects with<br />AI-powered precision.</p>
        <button
          onClick={onLogin}
          className="w-full bg-gradient-to-r from-black to-slate-400 hover:from-neutral-900 hover:to-slate-300 text-white py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-slate-500/30 active:scale-95 text-lg"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};
