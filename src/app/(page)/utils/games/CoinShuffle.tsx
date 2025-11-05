'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trophy, Volume2, VolumeX, ArrowLeft, Eye, EyeOff, Shuffle, Coins } from 'lucide-react';
import Link from 'next/link';

interface BetHistory {
  id: number | string;
  betAmount: number;
  guess: number;
  correct: number;
  won: boolean;
  winAmount: number;
}

export default function CoinShuffleGame({session}: {session: any}) {
  const [mounted, setMounted] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(10);
  const [gameState, setGameState] = useState<'betting' | 'showing' | 'shuffling' | 'guessing' | 'revealing'>('betting');
  const [coinPosition, setCoinPosition] = useState(1); // 0, 1, or 2
  const [selectedBowl, setSelectedBowl] = useState<number | null>(null);
  const [message, setMessage] = useState('Place your bet and watch the coin!');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [betHistory, setBetHistory] = useState<BetHistory[]>([]);
  const [shuffleCount, setShuffleCount] = useState(0);
  const [bowlPositions, setBowlPositions] = useState([0, 1, 2]);

  const shuffleSoundRef = useRef<HTMLAudioElement | null>(null);
  const winSoundRef = useRef<HTMLAudioElement | null>(null);
  const loseSoundRef = useRef<HTMLAudioElement | null>(null);
  const revealSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      shuffleSoundRef.current = new Audio('https://cdn.freesound.org/previews/341/341695_5121236-lq.mp3');
      winSoundRef.current = new Audio('https://cdn.freesound.org/previews/270/270404_5123851-lq.mp3');
      loseSoundRef.current = new Audio('https://cdn.freesound.org/previews/145/145441_2615119-lq.mp3');
      revealSoundRef.current = new Audio('https://cdn.freesound.org/previews/270/270319_5123851-lq.mp3');
      
      if (shuffleSoundRef.current) shuffleSoundRef.current.volume = 0.3;
      if (winSoundRef.current) winSoundRef.current.volume = 0.5;
      if (loseSoundRef.current) loseSoundRef.current.volume = 0.4;
      if (revealSoundRef.current) revealSoundRef.current.volume = 0.4;
    }
  }, [mounted]);

  const playSound = (soundRef: React.MutableRefObject<HTMLAudioElement | null>) => {
    if (soundEnabled && soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(err => console.log('Audio play failed:', err));
    }
  };

  const placeBet = () => {
    if (betAmount > balance) {
      setMessage('Insufficient balance!');
      return;
    }

    if (betAmount < 1) {
      setMessage('Minimum bet is $1');
      return;
    }

    setBalance(balance - betAmount);
    
    // Randomly place coin under one of the bowls
    const randomPosition = Math.floor(Math.random() * 3);
    setCoinPosition(randomPosition);
    
    setGameState('showing');
    setMessage('🪙 Watch carefully! The coin is under this bowl...');
    
    // Show coin for 2 seconds
    setTimeout(() => {
      startShuffle();
    }, 2000);
  };

  const startShuffle = () => {
    setGameState('shuffling');
    setMessage('👀 Keep your eyes on the bowls!');
    playSound(shuffleSoundRef);
    
    setShuffleCount(0);
    performShuffle();
  };

  const performShuffle = () => {
    const totalShuffles = 8;
    let currentShuffle = 0;
    
    const shuffleInterval = setInterval(() => {
      if (currentShuffle >= totalShuffles) {
        clearInterval(shuffleInterval);
        setGameState('guessing');
        setMessage('🤔 Which bowl has the coin? Make your guess!');
        return;
      }

      // Swap two random bowls
      const positions = [0, 1, 2];
      const idx1 = Math.floor(Math.random() * 3);
      let idx2 = Math.floor(Math.random() * 3);
      while (idx2 === idx1) {
        idx2 = Math.floor(Math.random() * 3);
      }

      setBowlPositions(prev => {
        const newPositions = [...prev];
        [newPositions[idx1], newPositions[idx2]] = [newPositions[idx2], newPositions[idx1]];
        return newPositions;
      });

      // Update coin position if it was in one of the swapped bowls
      setCoinPosition(prev => {
        if (bowlPositions[idx1] === prev) return bowlPositions[idx2];
        if (bowlPositions[idx2] === prev) return bowlPositions[idx1];
        return prev;
      });

      playSound(shuffleSoundRef);
      currentShuffle++;
      setShuffleCount(currentShuffle);
    }, 600);
  };

  const makeGuess = (bowl: number) => {
    if (gameState !== 'guessing') return;
    
    setSelectedBowl(bowl);
    setGameState('revealing');
    playSound(revealSoundRef);
    
    setTimeout(() => {
      revealResult(bowl);
    }, 1000);
  };

  const revealResult = (guess: number) => {
    const won = guess === coinPosition;
    const winAmount = won ? betAmount * 3 : 0; // 3x payout for correct guess

    if (won) {
      setBalance(prev => prev + winAmount);
      setMessage(`🎉 CORRECT! The coin was under bowl ${coinPosition + 1}! You won $${winAmount}!`);
      playSound(winSoundRef);
    } else {
      setMessage(`❌ Wrong! The coin was under bowl ${coinPosition + 1}. You lost $${betAmount}.`);
      playSound(loseSoundRef);
    }

    setBetHistory(prev => [{
      id: Date.now() + Math.random(),
      betAmount: betAmount,
      guess: guess,
      correct: coinPosition,
      won: won,
      winAmount: winAmount
    }, ...prev.slice(0, 9)]);

    setTimeout(() => {
      reset();
    }, 3000);
  };

  const reset = () => {
    setGameState('betting');
    setSelectedBowl(null);
    setBowlPositions([0, 1, 2]);
    setMessage('Place your bet for the next round!');
  };

  const getBowlPosition = (index: number) => {
    const positions = ['left-0', 'left-1/2 -translate-x-1/2', 'right-0'];
    return positions[index];
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden p-4">
      {/* Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 opacity-60"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
        }}></div>
      </div>

      {/* Floating coins */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          >
            🪙
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Link href={"/"}>
            <Button variant="outline" className="border-2 border-purple-500/50 bg-slate-900/50 hover:bg-slate-800 text-white font-bold backdrop-blur-xl">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Games
            </Button>
          </Link>

          <div className="flex items-center gap-4">
            <div className="bg-slate-900/70 rounded-xl px-6 py-3 border-2 border-purple-500/50 backdrop-blur-xl">
              <div className="text-purple-300 text-xs font-bold">BALANCE</div>
              <div className="text-2xl font-black text-yellow-400">${balance.toFixed(2)}</div>
            </div>
            
            <Button onClick={() => setSoundEnabled(!soundEnabled)} variant="outline" className="border-2 border-purple-500/50 bg-slate-900/50 hover:bg-slate-800 text-white backdrop-blur-xl">
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2 drop-shadow-2xl">
            COIN SHUFFLE
          </h1>
          <p className="text-purple-200 text-xl font-bold drop-shadow-lg">
            🪙 Find the coin under the bowl! 🎲
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Game Area */}
          <div className="lg:col-span-2">
            <Card className="border-4 border-purple-500/50 bg-gradient-to-br from-slate-900/90 to-purple-900/50 backdrop-blur-xl shadow-2xl">
              <CardContent className="p-8">
                {/* Message */}
                <div className={`text-center mb-8 p-4 rounded-xl border-2 ${
                  gameState === 'revealing' && selectedBowl === coinPosition
                    ? 'bg-green-900/30 border-green-500 animate-pulse'
                    : gameState === 'revealing'
                    ? 'bg-red-900/30 border-red-500'
                    : 'bg-purple-900/30 border-purple-500/50'
                }`}>
                  <div className="text-2xl font-black text-white">{message}</div>
                  {gameState === 'shuffling' && (
                    <div className="text-purple-400 font-bold mt-2 flex items-center justify-center gap-2">
                      <Shuffle className="w-5 h-5 animate-spin" />
                      Shuffle {shuffleCount}/8
                    </div>
                  )}
                </div>

                {/* Game Area - Bowls */}
                <div className="relative h-[400px] bg-gradient-to-b from-purple-950/50 to-indigo-950/50 rounded-2xl border-4 border-purple-500/30 mb-8 overflow-hidden">
                  {/* Table surface */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-950/30"></div>
                  
                  {/* Bowls Container */}
                  <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-48">
                    <div className="relative h-full w-full">
                      {[0, 1, 2].map((bowl) => {
                        const isShowing = gameState === 'showing' && bowlPositions[bowl] === coinPosition;
                        const isRevealing = gameState === 'revealing';
                        const hasCoin = bowlPositions[bowl] === coinPosition;
                        const isSelected = selectedBowl === bowl;
                        const canSelect = gameState === 'guessing';

                        return (
                          <div
                            key={bowl}
                            className={`absolute transition-all duration-250 ease-in-out`}
                            style={{
                                left: `calc(${bowlPositions[bowl] * 33.3}% + 17% - 4rem)`, // center alignment (w-32 = 8rem)
                                bottom: '0',
                            }}
                            >
                            <button
                                onClick={() => makeGuess(bowl)}
                                disabled={!canSelect}
                                className={`relative group ${canSelect ? 'cursor-pointer' : 'cursor-default'}`}
                            >
                                <div
                                className={`relative flex flex-col items-center transition-all duration-300 ${
                                    canSelect ? 'group-hover:scale-110 group-hover:-translate-y-2' : ''
                                } ${isSelected ? 'scale-110 -translate-y-2' : ''}`}
                                >
                                {/* Top Icon */}
                                <div className="mb-2 text-2xl opacity-90">
                                    🌀
                                </div>

                                {/* Coin under bowl */}
                                {(isShowing || (isRevealing && hasCoin)) && (
                                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 z-0">
                                    <div
                                        className={`text-6xl ${
                                        isRevealing && hasCoin ? 'animate-bounce' : ''
                                        }`}
                                    >
                                        🪙
                                    </div>
                                    </div>
                                )}

                                {/* Bowl (Circular Glass Effect) */}
                                <div
                                    className={`w-32 h-32 rounded-full relative border-4 overflow-hidden transition-all duration-300 shadow-[inset_0_6px_12px_rgba(255,255,255,0.2),0_0_25px_rgba(168,85,247,0.5)] ${
                                    isSelected && isRevealing && hasCoin
                                        ? 'bg-gradient-to-b from-green-400 to-green-800 shadow-lg shadow-green-500/50 animate-pulse'
                                        : isSelected && isRevealing && !hasCoin
                                        ? 'bg-gradient-to-b from-red-500 to-red-900 shadow-lg shadow-red-500/50'
                                        : 'bg-gradient-to-b from-purple-500 to-indigo-900'
                                    } ${isSelected ? 'border-yellow-400' : 'border-purple-400'} ${
                                    canSelect ? 'group-hover:border-yellow-400' : ''
                                    }`}
                                >
                                    {/* Glass reflection */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-full"></div>
                                    {/* Inner rim */}
                                    <div className="absolute inset-[6px] rounded-full border border-white/10 shadow-inner"></div>
                                </div>

                                {/* Glow on hover */}
                                {canSelect && (
                                    <div className="absolute inset-0 rounded-full bg-yellow-400/0 group-hover:bg-yellow-400/10 transition-all duration-300 blur-xl"></div>
                                )}
                                </div>
                            </button>
                        </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Instructions */}
                  {gameState === 'guessing' && (
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                      <div className="bg-yellow-500/20 px-6 py-3 rounded-full border-2 border-yellow-400 backdrop-blur-sm animate-pulse">
                        <div className="text-yellow-400 font-black flex items-center gap-2">
                          <Eye className="w-5 h-5" />
                          Click a bowl to reveal!
                        </div>
                      </div>
                    </div>
                  )}

                  {gameState === 'showing' && (
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                      <div className="bg-purple-500/20 px-6 py-3 rounded-full border-2 border-purple-400 backdrop-blur-sm">
                        <div className="text-purple-400 font-black flex items-center gap-2">
                          <Eye className="w-5 h-5" />
                          Remember where the coin is!
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Betting Controls */}
                {gameState === 'betting' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-purple-300 font-bold text-sm">BET AMOUNT</label>
                      <Input
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(Math.max(1, parseFloat(e.target.value) || 1))}
                        className="bg-slate-900/50 border-2 border-purple-500/50 text-white text-xl font-bold h-14"
                      />
                      <div className="flex gap-2">
                        {[10, 25, 50, 100].map(amount => (
                          <Button
                            key={amount}
                            onClick={() => setBetAmount(amount)}
                            className="flex-1 bg-purple-900/50 border border-purple-500/50 text-white hover:bg-purple-800/50 text-sm"
                          >
                            ${amount}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-end">
                      {
                        session ? (
                          <Button
                          onClick={placeBet}
                          className="w-full h-14 text-2xl text-white font-black rounded-xl shadow-xl border-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 border-purple-400 shadow-purple-500/50 hover:scale-105 transition-all"
                        >
                          <Coins className="w-8 h-8 mr-2" />
                          PLACE BET
                        </Button>
                        ) : (
                          <Link href={"/login"} className='w-full'>
                            <Button
                              className="w-full h-14 text-2xl font-black text-white rounded-xl shadow-xl border-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 border-purple-400 shadow-purple-500/50 hover:scale-105 transition-all"
                            >
                              <Coins className="w-8 h-8 mr-2" />
                              PLACE BET
                            </Button>
                          </Link>
                        )
                      }
                    </div>
                  </div>
                )}

                {gameState !== 'betting' && (
                  <div className="bg-purple-900/30 rounded-xl p-4 border-2 border-purple-500/50">
                    <div className="flex justify-between items-center">
                      <span className="text-purple-300 font-bold">Current Bet:</span>
                      <span className="text-yellow-400 font-black text-2xl">${betAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-purple-300 font-bold">Potential Win:</span>
                      <span className="text-green-400 font-black text-2xl">${(betAmount * 3).toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* History */}
          <div className="lg:col-span-1">
            <Card className="border-4 border-purple-500/50 bg-gradient-to-br from-slate-900/90 to-purple-900/50 backdrop-blur-xl shadow-2xl">
              <CardContent className="p-6">
                <h3 className="text-2xl font-black text-purple-300 mb-4 flex items-center gap-2">
                  <Trophy className="w-6 h-6" />
                  GAME HISTORY
                </h3>

                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {betHistory.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      No games yet. Start playing!
                    </div>
                  ) : (
                    betHistory.map((game) => (
                      <div
                        key={game.id}
                        className={`rounded-xl p-4 border-2 ${
                          game.won
                            ? 'bg-green-900/30 border-green-500/50'
                            : 'bg-red-900/30 border-red-500/50'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-300 text-sm font-bold">
                            Bet: ${game.betAmount.toFixed(2)}
                          </span>
                          <span className={`font-black ${game.won ? 'text-green-400' : 'text-red-400'}`}>
                            {game.won ? '✓ WIN' : '✗ LOSS'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-400">
                          <span>Guessed: Bowl {game.guess + 1}</span>
                          <span>Actual: Bowl {game.correct + 1}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-gray-400 text-xs">
                            {game.won ? 'Won' : 'Lost'}
                          </span>
                          <span className={`font-black text-xl ${
                            game.won ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {game.won ? `+$${game.winAmount.toFixed(2)}` : `-$${game.betAmount.toFixed(2)}`}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Stats */}
                {betHistory.length > 0 && (
                  <div className="mt-6 bg-purple-900/30 rounded-xl p-4 border-2 border-purple-500/50">
                    <h4 className="text-purple-300 font-black text-sm mb-3">SESSION STATS</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Games:</span>
                        <span className="text-white font-bold">{betHistory.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Wins:</span>
                        <span className="text-green-400 font-bold">
                          {betHistory.filter(g => g.won).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Losses:</span>
                        <span className="text-red-400 font-bold">
                          {betHistory.filter(g => !g.won).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Win Rate:</span>
                        <span className="text-yellow-400 font-bold">
                          {((betHistory.filter(g => g.won).length / betHistory.length) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-purple-500/30 pt-2 mt-2">
                        <span className="text-gray-400">Net Profit:</span>
                        <span className={`font-black ${
                          betHistory.reduce((sum, g) => sum + (g.won ? g.winAmount - g.betAmount : -g.betAmount), 0) >= 0
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}>
                          ${betHistory.reduce((sum, g) => sum + (g.won ? g.winAmount - g.betAmount : -g.betAmount), 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How to Play */}
        <Card className="mt-6 border-4 border-purple-500/50 bg-gradient-to-br from-slate-900/90 to-purple-900/50 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-6">
            <h3 className="text-2xl font-black text-purple-300 mb-4">📋 HOW TO PLAY</h3>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div className="bg-purple-900/30 rounded-xl p-4 border-2 border-purple-500/30">
                <div className="text-4xl mb-2">💰</div>
                <div className="text-white font-bold mb-1">1. Place Bet</div>
                <div className="text-gray-400 text-sm">Enter your bet amount</div>
              </div>
              <div className="bg-purple-900/30 rounded-xl p-4 border-2 border-purple-500/30">
                <div className="text-4xl mb-2">👀</div>
                <div className="text-white font-bold mb-1">2. Watch Coin</div>
                <div className="text-gray-400 text-sm">Remember which bowl has it</div>
              </div>
              <div className="bg-purple-900/30 rounded-xl p-4 border-2 border-purple-500/30">
                <div className="text-4xl mb-2">🔀</div>
                <div className="text-white font-bold mb-1">3. Bowls Shuffle</div>
                <div className="text-gray-400 text-sm">Keep tracking the coin!</div>
              </div>
              <div className="bg-purple-900/30 rounded-xl p-4 border-2 border-purple-500/30">
                <div className="text-4xl mb-2">🎯</div>
                <div className="text-white font-bold mb-1">4. Guess & Win</div>
                <div className="text-gray-400 text-sm">Win 3x your bet!</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.2;
          }
          90% {
            opacity: 0.2;
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