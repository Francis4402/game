'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Sparkles, Trophy, Zap, Volume2, VolumeX, ArrowLeft, Star } from 'lucide-react';

export default function DivineFortune() {
  const [mounted, setMounted] = useState(false);
  const [reels, setReels] = useState([
    ['⚡', '👑', '💎'],
    ['⚡', '👑', '💎'],
    ['⚡', '👑', '💎'],
    ['⚡', '👑', '💎'],
    ['⚡', '👑', '💎']
  ]);
  const [spinning, setSpinning] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(10);
  const [winAmount, setWinAmount] = useState(0);
  const [message, setMessage] = useState('Place your bet and spin for divine rewards!');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [winLines, setWinLines] = useState<number[]>([]);
  const [jackpotProgress, setJackpotProgress] = useState(0);
  const [freeSpins, setFreeSpins] = useState(0);
  const [multiplier, setMultiplier] = useState(1);

  const spinSoundRef = useRef<HTMLAudioElement | null>(null);
  const winSoundRef = useRef<HTMLAudioElement | null>(null);
  const bigWinSoundRef = useRef<HTMLAudioElement | null>(null);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      spinSoundRef.current = new Audio('https://cdn.freesound.org/previews/341/341695_5121236-lq.mp3');
      winSoundRef.current = new Audio('https://cdn.freesound.org/previews/270/270404_5123851-lq.mp3');
      bigWinSoundRef.current = new Audio('https://cdn.freesound.org/previews/270/270319_5123851-lq.mp3');
      bgMusicRef.current = new Audio('https://cdn.pixabay.com/audio/2022/03/10/audio_4a468c9db8.mp3');
      
      if (spinSoundRef.current) spinSoundRef.current.volume = 0.3;
      if (winSoundRef.current) winSoundRef.current.volume = 0.5;
      if (bigWinSoundRef.current) bigWinSoundRef.current.volume = 0.6;
      if (bgMusicRef.current) {
        bgMusicRef.current.volume = 0.15;
        bgMusicRef.current.loop = true;
      }

      return () => {
        if (bgMusicRef.current) {
          bgMusicRef.current.pause();
          bgMusicRef.current = null;
        }
      };
    }
  }, [mounted]);

  useEffect(() => {
    if (bgMusicRef.current) {
      if (soundEnabled) {
        bgMusicRef.current.play().catch(err => console.log('Background music play failed:', err));
      } else {
        bgMusicRef.current.pause();
      }
    }
  }, [soundEnabled]);

  const symbols = [
    { icon: '⚡', name: 'Lightning', value: 5, weight: 20 },
    { icon: '👑', name: 'Crown', value: 10, weight: 15 },
    { icon: '💎', name: 'Diamond', value: 15, weight: 12 },
    { icon: '🔱', name: 'Trident', value: 20, weight: 10 },
    { icon: '🏛️', name: 'Temple', value: 30, weight: 8 },
    { icon: '🦅', name: 'Eagle', value: 50, weight: 5 },
    { icon: '🔮', name: 'Crystal', value: 75, weight: 3 },
    { icon: '⭐', name: 'Star', value: 100, weight: 2 },
    { icon: '🌟', name: 'Divine Star', value: 500, weight: 1 }
  ];

  const playSound = (soundRef: React.MutableRefObject<HTMLAudioElement | null>) => {
    if (soundEnabled && soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(err => console.log('Audio play failed:', err));
    }
  };

  const getRandomSymbol = () => {
    const totalWeight = symbols.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const symbol of symbols) {
      random -= symbol.weight;
      if (random <= 0) return symbol.icon;
    }
    return symbols[0].icon;
  };

  const spin = () => {
    if (spinning) return;

    const currentBet = freeSpins > 0 ? 0 : bet;
    
    if (currentBet > 0 && balance < currentBet) {
      setMessage('Insufficient balance!');
      return;
    }

    setSpinning(true);
    setWinAmount(0);
    setWinLines([]);
    setMessage('Spinning...');
    
    if (freeSpins > 0) {
      setFreeSpins(freeSpins - 1);
      setMessage(`FREE SPIN! ${freeSpins - 1} spins remaining`);
    } else {
      setBalance(balance - currentBet);
    }
    
    playSound(spinSoundRef);

    const spinDurations = [1500, 1800, 2100, 2400, 2700];
    const finalReels: string[][] = [[], [], [], [], []];

    spinDurations.forEach((duration, reelIndex) => {
      const interval = setInterval(() => {
        setReels(prev => {
          const newReels = [...prev];
          newReels[reelIndex] = [
            getRandomSymbol(),
            getRandomSymbol(),
            getRandomSymbol()
          ];
          return newReels;
        });
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        
        finalReels[reelIndex] = [
          getRandomSymbol(),
          getRandomSymbol(),
          getRandomSymbol()
        ];
        
        setReels(prev => {
          const newReels = [...prev];
          newReels[reelIndex] = finalReels[reelIndex];
          return newReels;
        });

        if (reelIndex === 4) {
          setTimeout(() => {
            checkWin(finalReels);
            setSpinning(false);
          }, 300);
        }
      }, duration);
    });
  };

  const checkWin = (reelsArray: string[][]) => {
    let totalWin = 0;
    const winningLines: number[] = [];
    
    const lines = [
      [1, 1, 1, 1, 1], // Middle
      [0, 0, 0, 0, 0], // Top
      [2, 2, 2, 2, 2], // Bottom
      [0, 1, 2, 1, 0], // V shape
      [2, 1, 0, 1, 2], // Inverse V
    ];

    lines.forEach((line, lineIndex) => {
      const lineSymbols = line.map((row, col) => reelsArray[col][row]);
      
      let matchCount = 1;
      for (let i = 1; i < lineSymbols.length; i++) {
        if (lineSymbols[i] === lineSymbols[0]) {
          matchCount++;
        } else {
          break;
        }
      }

      if (matchCount >= 3) {
        const symbol = symbols.find(s => s.icon === lineSymbols[0]);
        if (symbol) {
          let lineWin = symbol.value * matchCount * bet;
          
          if (matchCount === 5) lineWin *= 3;
          else if (matchCount === 4) lineWin *= 2;
          
          lineWin *= multiplier;
          
          totalWin += lineWin;
          winningLines.push(lineIndex);
        }
      }
    });

    // Check for scatter symbols (🌟)
    const scatterCount = reelsArray.flat().filter(s => s === '🌟').length;
    if (scatterCount >= 3) {
      const scatterWin = bet * scatterCount * 10 * multiplier;
      totalWin += scatterWin;
      
      const bonusSpins = scatterCount === 3 ? 5 : scatterCount === 4 ? 10 : 15;
      setFreeSpins(prev => prev + bonusSpins);
      setMultiplier(prev => prev + 1);
      setMessage(`🎉 SCATTER WIN! +${bonusSpins} FREE SPINS! Multiplier: ${multiplier + 1}x`);
    }

    // Update jackpot progress
    if (totalWin > 0) {
      const newProgress = Math.min(100, jackpotProgress + (totalWin / bet) * 2);
      setJackpotProgress(newProgress);
      
      if (newProgress >= 100) {
        const jackpotWin = bet * 1000;
        totalWin += jackpotWin;
        setJackpotProgress(0);
        setMessage(`💥 MEGA JACKPOT WON! $${jackpotWin}! 💥`);
        playSound(bigWinSoundRef);
      }
    }

    setWinLines(winningLines);
    
    if (totalWin > 0) {
      setWinAmount(totalWin);
      setBalance(prev => prev + totalWin);
      
      if (totalWin >= bet * 50) {
        setMessage(`🎊 DIVINE WIN! You won $${totalWin}! 🎊`);
        playSound(bigWinSoundRef);
      } else {
        setMessage(`✨ Winner! You won $${totalWin}! ✨`);
        playSound(winSoundRef);
      }
    } else {
      if (freeSpins === 0) {
        setMultiplier(1);
      }
      setMessage(freeSpins > 0 ? `${freeSpins} free spins remaining!` : 'Try again! May the gods bless you!');
    }
  };

  const changeBet = (amount: number) => {
    if (!spinning && freeSpins === 0) {
      const newBet = Math.max(1, Math.min(100, bet + amount));
      setBet(newBet);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 opacity-60"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(138, 43, 226, 0.3) 0%, transparent 50%)',
        }}></div>
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          >
            ⭐
          </div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" className="border-2 border-purple-500/50 bg-slate-900/50 hover:bg-slate-800 text-white font-bold backdrop-blur-xl">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Games
          </Button>

          <div className="flex items-center gap-4">
            <div className="bg-slate-900/70 rounded-xl px-6 py-3 border-2 border-purple-500/50 backdrop-blur-xl">
              <div className="text-purple-300 text-xs font-bold">BALANCE</div>
              <div className="text-2xl font-black text-yellow-400">${balance}</div>
            </div>
            
            <Button onClick={() => setSoundEnabled(!soundEnabled)} variant="outline" className="border-2 border-purple-500/50 bg-slate-900/50 hover:bg-slate-800 text-white backdrop-blur-xl">
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden border-4 border-purple-500/50 bg-gradient-to-br from-indigo-950/90 via-purple-950/90 to-blue-950/90 backdrop-blur-xl shadow-2xl shadow-purple-500/50">
          <CardContent className="p-8">
            {/* Title */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="w-10 h-10 text-purple-400 animate-pulse" />
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center animate-pulse shadow-lg shadow-purple-500/50">
                  <Crown className="w-9 h-9 text-white" />
                </div>
                <Sparkles className="w-10 h-10 text-purple-400 animate-pulse" />
              </div>
              <h1 className="text-6xl font-black bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent mb-2 drop-shadow-2xl">
                DIVINE FORTUNE
              </h1>
              <p className="text-purple-200 text-xl font-bold drop-shadow-lg">
                ⚡ Blessed by the Gods ⚡
              </p>
            </div>

            {/* Jackpot Progress */}
            <div className="mb-6 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl p-4 border-4 border-yellow-400 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              <div className="relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-black text-sm uppercase tracking-wider flex items-center gap-2">
                    <Trophy className="w-5 h-5 animate-bounce" />
                    Mega Jackpot Progress
                  </span>
                  <span className="text-white font-black text-lg">{jackpotProgress.toFixed(0)}%</span>
                </div>
                <div className="bg-yellow-900/50 rounded-full h-4 overflow-hidden border-2 border-yellow-500">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 h-full transition-all duration-500 shadow-lg"
                    style={{ width: `${jackpotProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-purple-900/30 rounded-xl p-4 border-2 border-purple-500/50 backdrop-blur-sm">
                <div className="text-purple-300 text-xs font-bold mb-1">BET AMOUNT</div>
                <div className="text-2xl font-black text-green-400">${bet}</div>
              </div>
              {freeSpins > 0 && (
                <div className="bg-pink-900/30 rounded-xl p-4 border-2 border-pink-500/50 backdrop-blur-sm animate-pulse">
                  <div className="text-pink-300 text-xs font-bold mb-1">FREE SPINS</div>
                  <div className="text-2xl font-black text-pink-400">{freeSpins}</div>
                </div>
              )}
              {multiplier > 1 && (
                <div className="bg-orange-900/30 rounded-xl p-4 border-2 border-orange-500/50 backdrop-blur-sm animate-pulse">
                  <div className="text-orange-300 text-xs font-bold mb-1">MULTIPLIER</div>
                  <div className="text-2xl font-black text-orange-400">{multiplier}x</div>
                </div>
              )}
            </div>

            {/* Slot Machine */}
            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl p-8 border-4 border-purple-500/50 shadow-2xl mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              
              {/* Decorative top */}
              <div className="relative flex justify-center mb-6">
                <div className="flex items-center gap-4">
                  <Star className="w-8 h-8 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
                  <Trophy className="w-10 h-10 text-yellow-400" />
                  <Star className="w-8 h-8 text-yellow-400 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
                </div>
              </div>

              {/* Reels */}
              <div className="relative grid grid-cols-5 gap-4 mb-6">
                {reels.map((reel, reelIndex) => (
                  <div key={reelIndex} className="space-y-2">
                    {reel.map((symbol, symbolIndex) => {
                      const isWinning = winLines.some(lineIndex => {
                        const lines = [[1, 1, 1, 1, 1], [0, 0, 0, 0, 0], [2, 2, 2, 2, 2], [0, 1, 2, 1, 0], [2, 1, 0, 1, 2]];
                        return lines[lineIndex][reelIndex] === symbolIndex;
                      });
                      
                      return (
                        <div
                          key={symbolIndex}
                          className={`bg-gradient-to-br from-purple-700 to-blue-700 rounded-xl p-6 border-4 ${
                            isWinning ? 'border-yellow-400 shadow-xl shadow-yellow-400/50 animate-pulse' : 'border-purple-400/30'
                          } shadow-xl flex items-center justify-center transition-all ${
                            spinning ? 'animate-bounce' : ''
                          }`}
                          style={{
                            animationDelay: `${reelIndex * 0.1}s`,
                            minHeight: '120px'
                          }}
                        >
                          <div className="text-7xl">{symbol}</div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Win lines indicator */}
              {winLines.length > 0 && (
                <div className="relative flex justify-center gap-2 mb-4">
                  {winLines.map(line => (
                    <div key={line} className="bg-yellow-400 text-black px-4 py-2 rounded-full font-black text-sm animate-bounce">
                      Line {line + 1}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message Display */}
            <div className={`text-center mb-6 p-4 rounded-xl border-2 relative overflow-hidden ${
              winAmount > 0 
                ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-green-400 animate-pulse' 
                : 'bg-purple-900/30 border-purple-500/50'
            }`}>
              {winAmount > 0 && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
              )}
              <div className="relative text-2xl font-black text-white drop-shadow-lg">{message}</div>
              {winAmount > 0 && (
                <div className="relative text-5xl font-black text-yellow-400 mt-2 animate-bounce drop-shadow-2xl">
                  +${winAmount}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="space-y-4">
              {/* Bet Controls */}
              {freeSpins === 0 && (
                <div className="flex items-center justify-center gap-4">
                  <Button
                    onClick={() => changeBet(-10)}
                    disabled={spinning}
                    className="bg-purple-900/50 border-2 border-purple-500/50 text-white font-bold text-xl px-6 py-6 rounded-xl hover:bg-purple-800/50 backdrop-blur-sm"
                  >
                    -$10
                  </Button>
                  <Button
                    onClick={() => changeBet(-1)}
                    disabled={spinning}
                    className="bg-purple-900/50 border-2 border-purple-500/50 text-white font-bold text-xl px-6 py-6 rounded-xl hover:bg-purple-800/50 backdrop-blur-sm"
                  >
                    -$1
                  </Button>
                  <div className="bg-purple-900/50 px-8 py-4 rounded-xl border-2 border-purple-500/50 min-w-[140px] text-center backdrop-blur-sm">
                    <div className="text-purple-300 text-xs font-bold">BET</div>
                    <div className="text-3xl font-black text-white">${bet}</div>
                  </div>
                  <Button
                    onClick={() => changeBet(1)}
                    disabled={spinning}
                    className="bg-purple-900/50 border-2 border-purple-500/50 text-white font-bold text-xl px-6 py-6 rounded-xl hover:bg-purple-800/50 backdrop-blur-sm"
                  >
                    +$1
                  </Button>
                  <Button
                    onClick={() => changeBet(10)}
                    disabled={spinning}
                    className="bg-purple-900/50 border-2 border-purple-500/50 text-white font-bold text-xl px-6 py-6 rounded-xl hover:bg-purple-800/50 backdrop-blur-sm"
                  >
                    +$10
                  </Button>
                </div>
              )}

              {/* Spin Button */}
              <Button
                onClick={spin}
                disabled={spinning || (freeSpins === 0 && balance < bet)}
                className={`w-full text-3xl font-black py-12 rounded-2xl shadow-2xl border-4 transition-all ${
                  spinning || (freeSpins === 0 && balance < bet)
                    ? 'bg-slate-700 border-slate-600 text-gray-400 cursor-not-allowed'
                    : freeSpins > 0
                    ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 hover:from-pink-700 hover:via-purple-700 hover:to-blue-700 border-pink-400 shadow-pink-500/50 hover:scale-105 animate-pulse'
                    : 'bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 border-purple-400 shadow-purple-500/50 hover:scale-105'
                }`}
              >
                {spinning ? (
                  <span className="flex items-center justify-center gap-3">
                    <Zap className="w-10 h-10 animate-spin" />
                    SPINNING...
                  </span>
                ) : freeSpins > 0 ? (
                  <span className="flex items-center justify-center gap-3">
                    <Sparkles className="w-10 h-10" />
                    FREE SPIN!
                    <Sparkles className="w-10 h-10" />
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <Zap className="w-10 h-10" />
                    SPIN FOR FORTUNE!
                    <Zap className="w-10 h-10" />
                  </span>
                )}
              </Button>
            </div>

            {/* Paytable */}
            <div className="mt-8 bg-purple-900/30 rounded-xl p-6 border-2 border-purple-500/30 backdrop-blur-sm">
              <h3 className="text-xl font-black text-purple-200 mb-4 text-center flex items-center justify-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                DIVINE PAYTABLE
                <Trophy className="w-6 h-6 text-yellow-400" />
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {symbols.slice().reverse().map((symbol) => (
                  <div key={symbol.icon} className="flex items-center justify-between bg-purple-950/50 rounded-lg p-3 border border-purple-500/30">
                    <div className="flex items-center gap-2">
                      <div className="text-3xl">{symbol.icon}</div>
                      <div className="text-xs text-purple-200 font-bold">{symbol.name}</div>
                    </div>
                    <div className="text-yellow-400 font-black">{symbol.value}x</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center text-purple-300 text-sm font-bold space-y-1">
                <div>⭐ 3+ Scatters = Free Spins + Multiplier</div>
                <div>🎰 5 Matching Symbols = 3x Payout</div>
                <div>💰 Fill Jackpot Bar = 1000x Bet!</div>
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
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}