"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Crown, Sparkles, Trophy, Lock, Mail, Eye, EyeOff, User, Gift, Zap } from 'lucide-react';
import { FloatingIcon } from '@/app/types';
import Link from 'next/link';

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [floatingIcons, setFloatingIcons] = useState<FloatingIcon[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const icons = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      icon: ['💰', '🎰', '🎲', '♠️', '♥️', '♦️', '♣️', '🍀', '⭐'][Math.floor(Math.random() * 9)],
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 4,
    }));
    setFloatingIcons(icons);
  }, []);

  const handleSubmit = () => {
    console.log('Register attempt:', { name, email, password, confirmPassword });
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-pink-900"></div>
        {floatingIcons.map(item => (
          <div
            key={item.id}
            className="absolute text-3xl animate-float opacity-30"
            style={{
              left: `${item.left}%`,
              animationDelay: `${item.delay}s`,
              animationDuration: `${item.duration}s`,
            }}
          >
            {item.icon}
          </div>
        ))}
      </div>

      {/* Radial Gradient Overlays */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-6xl">
        <Card className="overflow-hidden border-4 border-purple-500/50 bg-black/90 backdrop-blur-xl shadow-2xl shadow-purple-500/50">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2">
              {/* Left Side - Register Form */}
              <div className="p-8 md:p-12 relative">
                {/* Logo/Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center gap-3 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 rounded-2xl flex items-center justify-center animate-pulse shadow-lg shadow-purple-500/50">
                      <Crown className="w-9 h-9 text-white" />
                    </div>
                  </div>
                  <h1 className="text-4xl font-black bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
                    JOIN NOW!
                  </h1>
                  <p className="text-gray-400 text-lg font-bold">
                    Start your winning journey today! 🎉
                  </p>
                </div>

                {/* Welcome Bonus Banner */}
                <div className="mb-6 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-xl p-4 border-4 border-yellow-400 shadow-xl shadow-yellow-500/50 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gift className="w-7 h-7 text-white animate-bounce" />
                      <div>
                        <div className="text-white font-black text-base">WELCOME PACKAGE</div>
                        <div className="text-white font-black text-lg">200% + 50 FREE SPINS!</div>
                      </div>
                    </div>
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Register Form */}
                <div className="space-y-5">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                      <User className="w-4 h-4 text-purple-400" />
                      Full Name
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full bg-slate-900/50 border-2 border-purple-500/50 text-white placeholder:text-gray-500 focus:border-purple-400 h-12 px-4 rounded-xl font-medium"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                      <Mail className="w-4 h-4 text-purple-400" />
                      Email Address
                    </label>
                    <div className="relative">
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full bg-slate-900/50 border-2 border-purple-500/50 text-white placeholder:text-gray-500 focus:border-purple-400 h-12 px-4 rounded-xl font-medium"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                      <Lock className="w-4 h-4 text-purple-400" />
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password"
                        className="w-full bg-slate-900/50 border-2 border-purple-500/50 text-white placeholder:text-gray-500 focus:border-purple-400 h-12 px-4 pr-12 rounded-xl font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <label className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                      <Lock className="w-4 h-4 text-purple-400" />
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        className="w-full bg-slate-900/50 border-2 border-purple-500/50 text-white placeholder:text-gray-500 focus:border-purple-400 h-12 px-4 pr-12 rounded-xl font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Register Button */}
                  <Button
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-green-500 via-emerald-600 to-green-600 hover:from-green-600 hover:via-emerald-700 hover:to-green-700 text-white font-black text-lg h-14 rounded-xl shadow-xl shadow-green-500/50 border-2 border-green-400"
                  >
                    CREATE ACCOUNT & CLAIM BONUS
                  </Button>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t-2 border-purple-500/30"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-black text-gray-400 font-bold uppercase">Or sign up with</span>
                    </div>
                  </div>

                  {/* Social Register */}
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-2 border-purple-500/50 bg-slate-900/50 hover:bg-slate-800 text-white font-bold h-12 rounded-xl"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      Google
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-2 border-purple-500/50 bg-slate-900/50 hover:bg-slate-800 text-white font-bold h-12 rounded-xl"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Facebook
                    </Button>
                  </div>

                  {/* Login Link */}
                  <div className="text-center pt-2">
                    <p className="text-gray-400 font-medium">
                      Already have an account?{' '}
                      <Link href="/login" className="text-yellow-400 hover:text-yellow-300 font-black transition">
                        Login Here!
                      </Link>
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side - Benefits */}
              <div className="relative bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 p-12 hidden md:flex flex-col justify-center items-center overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iLjA1IiBjeD0iMzAiIGN5PSIzMCIgcj0iMTAiLz48L2c+PC9zdmc+')] opacity-30"></div>
                
                {/* Floating Decorative Elements */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                {/* Content */}
                <div className="relative z-10 text-center space-y-8">
                  <div className="text-8xl mb-6 animate-bounce">
                    🎁
                  </div>
                  
                  <h2 className="text-5xl font-black text-white drop-shadow-2xl leading-tight">
                    EXCLUSIVE
                    <span className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                      MEMBER
                    </span>
                    BENEFITS!
                  </h2>

                  <div className="space-y-4">
                    <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/20">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                          <Gift className="w-7 h-7 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="text-white font-black text-xl">$1000 Welcome Bonus</div>
                          <div className="text-white/80 text-sm">+ 50 Free Spins on Sign Up!</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/20">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                          <Trophy className="w-7 h-7 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="text-white font-black text-xl">VIP Rewards Program</div>
                          <div className="text-white/80 text-sm">Earn Points with Every Bet</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/20">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                          <Sparkles className="w-7 h-7 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="text-white font-black text-xl">Weekly Promotions</div>
                          <div className="text-white/80 text-sm">Cashback, Free Spins & More</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/20">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                          <Zap className="w-7 h-7 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="text-white font-black text-xl">24/7 Support</div>
                          <div className="text-white/80 text-sm">Always Here to Help You Win</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-full font-black text-xl animate-pulse border-4 border-white shadow-2xl">
                      🚀 START WINNING TODAY!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms Text */}
        <div className="text-center text-gray-500 text-xs mt-6 max-w-2xl mx-auto">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-purple-400 hover:text-purple-300 underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-purple-400 hover:text-purple-300 underline">Privacy Policy</a>.
          <span className="block mt-2 text-yellow-400 font-bold">🔞 Must be 18+ to register | Gamble Responsibly</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
}