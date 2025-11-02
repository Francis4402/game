'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Rocket, Zap, Volume2, VolumeX, ArrowLeft, TrendingUp, Flame } from 'lucide-react';

interface BetHistory {
  id: number;
  betAmount: number;
  cashoutMultiplier: number;
  winAmount: number;
  crashed: boolean;
}

export default function RocketCrashGame() {
  const [mounted, setMounted] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(10);
  const [currentBet, setCurrentBet] = useState(0);
  const [isFlying, setIsFlying] = useState(false);
  const [hasBet, setHasBet] = useState(false);
  const [multiplier, setMultiplier] = useState(1.0);
  const [rocketPosition, setRocketPosition] = useState(0);
  const [crashed, setCrashed] = useState(false);
  const [crashPoint, setCrashPoint] = useState(0);
  const [message, setMessage] = useState('Place your bet and watch the rocket fly!');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [betHistory, setBetHistory] = useState<BetHistory[]>([]);
  const [cashoutAvailable, setCashoutAvailable] = useState(false);

  const gameLoopRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const crashSoundRef = useRef<HTMLAudioElement | null>(null);
  const cashoutSoundRef = useRef<HTMLAudioElement | null>(null);
  const flyingSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      crashSoundRef.current = new Audio('https://cdn.freesound.org/previews/270/270319_5123851-lq.mp3');
      cashoutSoundRef.current = new Audio('https://cdn.freesound.org/previews/270/270404_5123851-lq.mp3');
      flyingSoundRef.current = new Audio('https://cdn.freesound.org/previews/341/341695_5121236-lq.mp3');

      if (crashSoundRef.current) crashSoundRef.current.volume = 0.5;
      if (cashoutSoundRef.current) cashoutSoundRef.current.volume = 0.5;
      if (flyingSoundRef.current) {
        flyingSoundRef.current.volume = 0.3;
        flyingSoundRef.current.loop = true;
      }
    }
  }, [mounted]);

  const playSound = (soundRef: React.MutableRefObject<HTMLAudioElement | null>) => {
    if (soundEnabled && soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(err => console.log('Audio play failed:', err));
    }
  };

  const stopSound = (soundRef: React.MutableRefObject<HTMLAudioElement | null>) => {
    if (soundRef.current) {
      soundRef.current.pause();
      soundRef.current.currentTime = 0;
    }
  };

  const generateCrashPoint = () => {
    const random = Math.random();
    if (random < 0.5) return 1.1 + Math.random() * 1.4;
    if (random < 0.8) return 2.5 + Math.random() * 2.5;
    if (random < 0.95) return 5 + Math.random() * 5;
    return 10 + Math.random() * 40;
  };

  const startCountdown = () => {
    setCountdown(3);
    const countInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countInterval);
          startRocket();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
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
    if (isFlying) {
      setMessage('Wait for the next round!');
      return;
    }

    setBalance(balance - betAmount);
    setCurrentBet(betAmount);
    setHasBet(true);
    setMessage(`Bet placed: $${betAmount}. Get ready!`);
    startCountdown();
  };

  const startRocket = () => {
    const crash = generateCrashPoint();
    setCrashPoint(crash);
    setIsFlying(true);
    setCrashed(false);
    setMultiplier(1.0);
    setRocketPosition(0);
    setCashoutAvailable(true);
    setMessage('🚀 ROCKET IS FLYING! Cash out anytime!');
    playSound(flyingSoundRef);

    startTimeRef.current = Date.now();

    const gameLoop = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const currentMultiplier = 1 + elapsed * 0.5;

      if (currentMultiplier >= crash) {
        crashRocket();
        return;
      }

      setMultiplier(parseFloat(currentMultiplier.toFixed(2)));
      setRocketPosition(Math.min(90, (currentMultiplier - 1) * 10));
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  const cashout = () => {
    if (!cashoutAvailable || !hasBet) return;

    stopSound(flyingSoundRef);
    playSound(cashoutSoundRef);

    const winAmount = currentBet * multiplier;
    setBalance(prev => prev + winAmount);
    setCashoutAvailable(false);
    setHasBet(false);

    setMessage(`✅ Cashed out at ${multiplier.toFixed(2)}x! Won $${winAmount.toFixed(2)}!`);

    setBetHistory(prev => [
      {
        id: Date.now(),
        betAmount: currentBet,
        cashoutMultiplier: multiplier,
        winAmount: winAmount,
        crashed: false
      },
      ...prev.slice(0, 9)
    ]);
  };

  const crashRocket = () => {
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);

    stopSound(flyingSoundRef);
    playSound(crashSoundRef);

    setCrashed(true);
    setIsFlying(false);
    setCashoutAvailable(false);

    if (hasBet) {
      setMessage(`💥 CRASHED at ${crashPoint.toFixed(2)}x! You lost $${currentBet}!`);
      setBetHistory(prev => [
        {
          id: Date.now(),
          betAmount: currentBet,
          cashoutMultiplier: crashPoint,
          winAmount: 0,
          crashed: true
        },
        ...prev.slice(0, 9)
      ]);
      setHasBet(false);
    } else {
      setMessage(`💥 CRASHED at ${crashPoint.toFixed(2)}x! Place your bet for next round!`);
    }

    setTimeout(() => {
      reset();
    }, 3000);
  };

  const reset = () => {
    setCrashed(false);
    setMultiplier(1.0);
    setRocketPosition(0);
    setCrashPoint(0);
    setCurrentBet(0);
    setMessage('Place your bet for the next round!');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden p-4">
      {/* Star Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-blue-950 to-black"></div>
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-70"
            style={{
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" className="border-2 border-blue-500/50 bg-slate-900/50 text-white font-bold backdrop-blur-xl">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Games
          </Button>

          <div className="flex items-center gap-4">
            <div className="bg-slate-900/70 rounded-xl px-6 py-3 border-2 border-blue-500/50 backdrop-blur-xl">
              <div className="text-blue-300 text-xs font-bold">BALANCE</div>
              <div className="text-2xl font-black text-yellow-400">${balance.toFixed(2)}</div>
            </div>

            <Button onClick={() => setSoundEnabled(!soundEnabled)} variant="outline" className="border-2 border-blue-500/50 bg-slate-900/50 text-white backdrop-blur-xl">
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-6xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
            ROCKET CRASH
          </h1>
          <p className="text-blue-200 text-xl font-bold">🚀 Cash out before it crashes! 🚀</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Game Area */}
          <div className="lg:col-span-2">
            <Card className="border-4 border-blue-500/50 bg-gradient-to-br from-slate-900/90 to-blue-900/50 backdrop-blur-xl">
              <CardContent className="p-0">
                <div className="relative h-[500px] bg-gradient-to-b from-indigo-950 to-slate-900 overflow-hidden">
                  {/* Grid */}
                  <div className="absolute inset-0">
                    {[...Array(10)].map((_, i) => (
                      <div key={`h-${i}`} className="absolute w-full border-t border-blue-500/10" style={{ top: `${i * 10}%` }}></div>
                    ))}
                    {[...Array(10)].map((_, i) => (
                      <div key={`v-${i}`} className="absolute h-full border-l border-blue-500/10" style={{ left: `${i * 10}%` }}></div>
                    ))}
                  </div>

                  {/* Multiplier */}
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
                    <div
                      className={`text-8xl font-black ${
                        crashed ? 'text-red-500' : isFlying ? 'text-green-400' : 'text-blue-400'
                      }`}
                    >
                      {crashed ? '💥' : `${multiplier.toFixed(2)}x`}
                    </div>
                  </div>

                  {/* Countdown */}
                  {countdown > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30">
                      <div className="text-9xl font-black text-yellow-400 animate-bounce">{countdown}</div>
                    </div>
                  )}

                  {/* Rocket Trail */}
                  {isFlying && !crashed && (
                    <div
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-t from-cyan-400 to-blue-400 rounded-full shadow-lg shadow-cyan-400/50"
                      style={{
                        height: `${rocketPosition}%`
                      }}
                    ></div>
                  )}

                  {/* ✅ Fixed Rocket */}
                  <div
                    className={`absolute transition-all duration-100 z-20 ${crashed ? 'animate-spin' : ''}`}
                    style={{
                      bottom: `${rocketPosition}%`,
                      left: '50%',
                      transform: `translate(-50%, 0) rotate(${crashed ? 180 : -45}deg)`
                    }}
                  >
                    {crashed ? (
                      <div className="text-8xl animate-bounce">💥</div>
                    ) : (
                      <div className="relative">
                        <Rocket
                          className={`w-20 h-20 ${
                            isFlying ? 'text-blue-400' : 'text-gray-400'
                          } drop-shadow-[0_0_20px_rgba(96,165,250,0.8)]`}
                        />
                        {isFlying && (
                          <>
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                              <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
                            </div>
                            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
                              <Flame
                                className="w-6 h-6 text-yellow-400 animate-pulse"
                                style={{ animationDelay: '0.1s' }}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {crashed && <div className="absolute inset-0 bg-red-500/20 animate-pulse z-10"></div>}
                </div>

                {/* Controls */}
                <div className="p-6 bg-slate-900/70 backdrop-blur-xl border-t-4 border-blue-500/30">
                  <div className="text-center mb-4">
                    <div
                      className={`text-2xl font-black ${
                        crashed
                          ? 'text-red-400'
                          : hasBet && isFlying
                          ? 'text-green-400'
                          : 'text-blue-400'
                      } mb-2`}
                    >
                      {message}
                    </div>
                    {hasBet && isFlying && !crashed && (
                      <div className="text-yellow-400 font-black text-xl">
                        Potential Win: ${(currentBet * multiplier).toFixed(2)}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-blue-300 font-bold text-sm">BET AMOUNT</label>
                      <Input
                        type="number"
                        value={betAmount}
                        onChange={e => setBetAmount(Math.max(1, parseFloat(e.target.value) || 1))}
                        disabled={isFlying || countdown > 0}
                        className="bg-slate-900/50 border-2 border-blue-500/50 text-white text-xl font-bold h-14"
                      />
                      <div className="flex gap-2">
                        {[10, 25, 50, 100].map(amount => (
                          <Button
                            key={amount}
                            onClick={() => setBetAmount(amount)}
                            disabled={isFlying || countdown > 0}
                            className="flex-1 bg-blue-900/50 border border-blue-500/50 text-white hover:bg-blue-800/50 text-sm"
                          >
                            ${amount}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-end">
                      {!hasBet ? (
                        <Button
                          onClick={placeBet}
                          disabled={isFlying || countdown > 0}
                          className={`w-full h-14 text-2xl font-black rounded-xl shadow-xl border-4 transition-all ${
                            isFlying || countdown > 0
                              ? 'bg-slate-700 border-slate-600 text-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-green-400 shadow-green-500/50 hover:scale-105'
                          }`}
                        >
                          {countdown > 0 ? countdown : 'PLACE BET'}
                        </Button>
                      ) : (
                        <Button
                          onClick={cashout}
                          disabled={!cashoutAvailable}
                          className={`w-full h-14 text-2xl font-black rounded-xl shadow-xl border-4 transition-all ${
                            !cashoutAvailable
                              ? 'bg-slate-700 border-slate-600 text-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 border-yellow-400 shadow-yellow-500/50 hover:scale-105 animate-pulse'
                          }`}
                        >
                          <Zap className="w-8 h-8 mr-2" />
                          CASH OUT
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* History Section */}
          <div className="lg:col-span-1">
            <Card className="border-4 border-blue-500/50 bg-gradient-to-br from-slate-900/90 to-blue-900/50 backdrop-blur-xl">
              <CardContent className="p-6">
                <h3 className="text-2xl font-black text-blue-300 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  BET HISTORY
                </h3>

                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {betHistory.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">No bets yet. Start playing!</div>
                  ) : (
                    betHistory.map(bet => (
                      <div
                        key={bet.id}
                        className={`rounded-xl p-4 border-2 ${
                          bet.crashed
                            ? 'bg-red-900/30 border-red-500/50'
                            : 'bg-green-900/30 border-green-500/50'
                        }`}
                      >
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-300 text-sm font-bold">
                            Bet: ${bet.betAmount.toFixed(2)}
                          </span>
                          <span
                            className={`font-black text-lg ${
                              bet.crashed ? 'text-red-400' : 'text-green-400'
                            }`}
                          >
                            {bet.cashoutMultiplier.toFixed(2)}x
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-xs">
                            {bet.crashed ? 'Crashed 💥' : 'Cashed Out ✓'}
                          </span>
                          <span
                            className={`font-black text-xl ${
                              bet.crashed ? 'text-red-400' : 'text-yellow-400'
                            }`}
                          >
                            {bet.crashed
                              ? `-$${bet.betAmount.toFixed(2)}`
                              : `+$${bet.winAmount.toFixed(2)}`}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
