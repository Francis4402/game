/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, Trophy, Zap, Star, ChevronRight, Dice1, Spade, Crown, Sparkles, Coins, Rocket, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function Homepage({session}: {session: any}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [floatingCoins, setFloatingCoins] = useState<{ id: number; left: number; delay: number; duration: number }[]>([]);
  const [jackpotAmount, setJackpotAmount] = useState(8547230);

  useEffect(() => {
    const coins = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 5,
    }));
    setFloatingCoins(coins);

    const interval = setInterval(() => {
      setJackpotAmount(prev => prev + Math.floor(Math.random() * 100));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const categories = [
    { id: 'all', name: 'All Games', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
    { id: 'slots', name: 'Slots', icon: Crown, color: 'from-yellow-500 to-orange-500' },
    { id: 'table', name: 'Table', icon: Spade, color: 'from-blue-500 to-cyan-500' },
    { id: 'live', name: 'Live', icon: Flame, color: 'from-red-500 to-pink-500' },
    { id: 'jackpot', name: 'Jackpots', icon: Trophy, color: 'from-green-500 to-emerald-500' },
  ];

  const games = [
    { id: 1, name: 'Mega Fortune', category: 'slots', jackpot: '$2.4M', gradient: 'from-yellow-400 via-orange-500 to-red-500', hot: true },
    { id: 2, name: 'Blackjack Pro', category: 'table', players: '1.2k', gradient: 'from-blue-400 via-purple-500 to-pink-500', popular: true },
    { id: 3, name: 'Roulette Royale', category: 'live', players: '856', gradient: 'from-red-400 via-pink-500 to-purple-500', new: true },
    { id: 4, name: 'Lucky Sevens', category: 'slots', jackpot: '$890K', gradient: 'from-green-400 via-emerald-500 to-teal-500', hot: true },
    { id: 5, name: 'Poker Masters', category: 'table', players: '2.1k', gradient: 'from-indigo-400 via-purple-500 to-pink-500', popular: true },
    { id: 6, name: 'Divine Fortune', category: 'jackpot', jackpot: '$3.2M', gradient: 'from-yellow-300 via-yellow-500 to-orange-500', hot: true },
    { id: 7, name: 'Baccarat Elite', category: 'live', players: '645', gradient: 'from-cyan-400 via-blue-500 to-indigo-500', new: true },
    { id: 8, name: 'Starburst XXX', category: 'slots', jackpot: '$450K', gradient: 'from-pink-400 via-purple-500 to-indigo-500', popular: true },
  ];

  const filteredGames = activeCategory === 'all' 
    ? games 
    : games.filter(g => g.category === activeCategory);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-pink-900"></div>
        {floatingCoins.map(coin => (
          <div
            key={coin.id}
            className="absolute text-yellow-400 text-2xl animate-float"
            style={{
              left: `${coin.left}%`,
              animationDelay: `${coin.delay}s`,
              animationDuration: `${coin.duration}s`,
              opacity: 0.3,
            }}
          >
            💰
          </div>
        ))}
      </div>

      {/* Radial Gradient Overlays */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-purple-500/30 bg-black/80 backdrop-blur-2xl sticky top-0 z-50 shadow-lg shadow-purple-500/20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 rounded-xl flex items-center justify-center animate-pulse shadow-lg shadow-purple-500/50">
                  <Crown className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-black bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                  ROYAL<span className="text-white">WIN</span>
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Link href={"/login"}>
                  <Button variant="outline" className="border-2 border-purple-500 text-purple-300 hover:bg-purple-500 hover:text-white font-bold">
                    Login
                  </Button>
                </Link>
                <Button className="bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600 hover:from-yellow-600 hover:via-pink-600 hover:to-purple-700 font-bold shadow-lg shadow-purple-500/50 animate-pulse">
                  Sign Up Now
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Mega Jackpot Banner */}
        <div className="container mx-auto px-4 py-4">
          <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-2xl p-6 shadow-2xl shadow-yellow-500/50 border-4 border-yellow-400 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iLjEiIGN4PSIyMCIgY3k9IjIwIiByPSI0Ii8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Trophy className="w-12 h-12 text-white animate-bounce" />
                <div>
                  <div className="text-white text-sm font-bold uppercase tracking-wider">Mega Jackpot</div>
                  <div className="text-white text-3xl font-black">
                    ${jackpotAmount.toLocaleString()}
                  </div>
                </div>
              </div>
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-black text-lg shadow-xl">
                PLAY NOW!
              </Button>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="relative rounded-3xl bg-gradient-to-br from-purple-600/40 via-pink-600/40 to-orange-600/40 p-16 overflow-hidden border-4 border-purple-500/50 shadow-2xl shadow-purple-500/50">
            <div className="absolute inset-0">
              <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-full mb-8 border-4 border-yellow-300 shadow-xl shadow-yellow-500/50 animate-bounce">
                <Zap className="w-6 h-6" />
                <span className="text-lg font-black uppercase">🎁 200% Bonus + 50 Free Spins!</span>
                <Zap className="w-6 h-6" />
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-white mb-6 drop-shadow-2xl leading-tight">
                WIN
                <span className="block bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                  LEGENDARY
                </span>
                PRIZES!
              </h1>
              <p className="text-white text-2xl mb-10 font-bold drop-shadow-lg">
                🔥 Over $10M in Daily Jackpots! 🔥
              </p>
              <div className="flex gap-6 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-2xl px-12 py-8 font-black shadow-2xl shadow-green-500/50 border-4 border-green-400">
                  <Rocket className="mr-3 w-8 h-8" />
                  START WINNING
                  <ChevronRight className="ml-3 w-8 h-8" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Players Online', value: '50,234', icon: Star, color: 'from-blue-500 to-cyan-500' },
              { label: 'Total Jackpots', value: '$12.5M', icon: DollarSign, color: 'from-yellow-500 to-orange-500' },
              { label: 'Games', value: '2,500+', icon: Dice1, color: 'from-purple-500 to-pink-500' },
              { label: 'Big Wins Today', value: '1,234', icon: Flame, color: 'from-red-500 to-orange-500' },
            ].map((stat, i) => (
              <Card key={i} className="bg-gradient-to-br from-slate-900 to-black border-4 border-purple-500/50 backdrop-blur shadow-xl shadow-purple-500/30 hover:scale-110 transition-transform">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-black text-white mb-2 drop-shadow-lg">{stat.value}</div>
                  <div className="text-sm text-gray-300 font-bold uppercase tracking-wider">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-3 px-8 py-4 rounded-2xl whitespace-nowrap transition-all font-black text-lg shadow-xl ${
                    activeCategory === cat.id
                      ? `bg-gradient-to-r ${cat.color} text-white scale-110 border-4 border-white shadow-2xl`
                      : 'bg-slate-900 text-gray-300 hover:bg-slate-800 border-4 border-purple-500/30 hover:scale-105'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </section>

        {/* Games Grid */}
        <section className="container mx-auto px-4 py-8 pb-16">
          <h2 className="text-5xl font-black text-white mb-8 text-center">
            <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              HOT GAMES
            </span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <Card key={game.id} className="bg-slate-900 border-4 border-purple-500/50 backdrop-blur overflow-hidden hover:border-yellow-400 transition-all hover:scale-110 cursor-pointer group shadow-2xl shadow-purple-500/30">
                <CardContent className="p-0">
                  <div className={`relative aspect-square bg-gradient-to-br ${game.gradient} flex items-center justify-center text-8xl`}>
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative z-10">
                      {game.id === 1 && '🎰'}
                      {game.id === 2 && '♠️'}
                      {game.id === 3 && '🎲'}
                      {game.id === 4 && '🍀'}
                      {game.id === 5 && '♥️'}
                      {game.id === 6 && '⚡'}
                      {game.id === 7 && '♦️'}
                      {game.id === 8 && '⭐'}
                    </div>
                    {game.hot && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-4 py-2 rounded-full flex items-center gap-1 font-black border-2 border-white shadow-lg animate-pulse">
                        <Flame className="w-4 h-4" />
                        HOT
                      </div>
                    )}
                    {game.popular && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs px-4 py-2 rounded-full flex items-center gap-1 font-black border-2 border-white shadow-lg">
                        <Star className="w-4 h-4" />
                        POPULAR
                      </div>
                    )}
                    {game.new && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs px-4 py-2 rounded-full flex items-center gap-1 font-black border-2 border-white shadow-lg animate-bounce">
                        <Zap className="w-4 h-4" />
                        NEW
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-500 hover:to-orange-600 font-black text-lg px-8 py-6 border-4 border-white shadow-2xl">
                        PLAY NOW
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-slate-900 to-black">
                    <h3 className="font-black text-white mb-2 text-lg">{game.name}</h3>
                    <div className="flex items-center justify-between">
                      {game.jackpot && (
                        <span className="text-yellow-400 font-black text-lg flex items-center gap-1">
                          <Coins className="w-5 h-5" />
                          {game.jackpot}
                        </span>
                      )}
                      {game.players && (
                        <span className="text-green-400 font-bold flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                          {game.players}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t-4 border-purple-500/50 bg-black/90 backdrop-blur-2xl shadow-2xl shadow-purple-500/20">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Crown className="w-10 h-10 text-yellow-400" />
                <span className="text-4xl font-black bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                  ROYALWIN
                </span>
              </div>
              <p className="text-gray-400 text-lg font-bold">The Ultimate Gaming Experience</p>
            </div>
            <div className="border-t-2 border-purple-500/30 pt-8 text-center">
              <div className="text-yellow-400 font-black text-lg mb-2">🔞 18+ ONLY | GAMBLE RESPONSIBLY</div>
              <div className="text-gray-400">© 2025 RoyalWin Casino. All rights reserved.</div>
            </div>
          </div>
        </footer>
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
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}