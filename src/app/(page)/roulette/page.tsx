'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Zap, Volume2, VolumeX, ArrowLeft, RotateCw, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Bet {
  id: string;
  type: string;
  amount: number;
}

export default function Roulette() {
  const [mounted, setMounted] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [chipValue, setChipValue] = useState(5);
  const [bets, setBets] = useState<Bet[]>([]);
  const [winningNumber, setWinningNumber] = useState<number | null>(null);
  const [message, setMessage] = useState('Place your bets!');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [ballRotation, setBallRotation] = useState(0);

  const spinSoundRef = useRef<HTMLAudioElement | null>(null);
  const winSoundRef = useRef<HTMLAudioElement | null>(null);
  const chipSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      spinSoundRef.current = new Audio('https://cdn.freesound.org/previews/341/341695_5121236-lq.mp3');
      winSoundRef.current = new Audio('https://cdn.freesound.org/previews/270/270404_5123851-lq.mp3');
      chipSoundRef.current = new Audio('https://cdn.freesound.org/previews/145/145441_2615119-lq.mp3');
      
      if (spinSoundRef.current) spinSoundRef.current.volume = 0.3;
      if (winSoundRef.current) winSoundRef.current.volume = 0.5;
      if (chipSoundRef.current) chipSoundRef.current.volume = 0.4;
    }
  }, [mounted]);

  const rouletteNumbers = [
    { num: 0, color: 'green' },
    { num: 32, color: 'red' }, { num: 15, color: 'black' }, { num: 19, color: 'red' },
    { num: 4, color: 'black' }, { num: 21, color: 'red' }, { num: 2, color: 'black' },
    { num: 25, color: 'red' }, { num: 17, color: 'black' }, { num: 34, color: 'red' },
    { num: 6, color: 'black' }, { num: 27, color: 'red' }, { num: 13, color: 'black' },
    { num: 36, color: 'red' }, { num: 11, color: 'black' }, { num: 30, color: 'red' },
    { num: 8, color: 'black' }, { num: 23, color: 'red' }, { num: 10, color: 'black' },
    { num: 5, color: 'red' }, { num: 24, color: 'black' }, { num: 16, color: 'red' },
    { num: 33, color: 'black' }, { num: 1, color: 'red' }, { num: 20, color: 'black' },
    { num: 14, color: 'red' }, { num: 31, color: 'black' }, { num: 9, color: 'red' },
    { num: 22, color: 'black' }, { num: 18, color: 'red' }, { num: 29, color: 'black' },
    { num: 7, color: 'red' }, { num: 28, color: 'black' }, { num: 12, color: 'red' },
    { num: 35, color: 'black' }, { num: 3, color: 'red' }, { num: 26, color: 'black' }
  ];

  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

  const playSound = (soundRef: React.MutableRefObject<HTMLAudioElement | null>) => {
    if (soundEnabled && soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(err => console.log('Audio play failed:', err));
    }
  };

  const placeBet = (betType: string) => {
    if (spinning) return;
    
    const totalBets = bets.reduce((sum, bet) => sum + bet.amount, 0);
    if (totalBets + chipValue > balance) {
      setMessage('Insufficient balance!');
      return;
    }

    playSound(chipSoundRef);

    const newBet: Bet = {
      id: Date.now().toString() + Math.random(),
      type: betType,
      amount: chipValue
    };

    setBets([...bets, newBet]);
    setMessage(`Bet placed: ${betType} - $${chipValue}`);
  };

  const clearBets = () => {
    setBets([]);
    setMessage('All bets cleared!');
  };

  const spin = () => {
    if (spinning || bets.length === 0) {
      if (bets.length === 0) {
        setMessage('Please place at least one bet!');
      }
      return;
    }

    setSpinning(true);
    setMessage('Spinning...');
    
    const totalBetAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);
    setBalance(balance - totalBetAmount);
    
    playSound(spinSoundRef);

    const spins = 5 + Math.random() * 3;
    const finalRotation = spins * 360;
    const winIndex = Math.floor(Math.random() * rouletteNumbers.length);
    const winNum = rouletteNumbers[winIndex].num;
    
    let currentRotation = 0;
    const duration = 4000;
    const startTime = Date.now();

    const animateWheel = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 3);
      currentRotation = easeOut * finalRotation;
      
      setRotation(currentRotation);
      setBallRotation(-currentRotation * 1.5);

      if (progress < 1) {
        requestAnimationFrame(animateWheel);
      } else {
        setWinningNumber(winNum);
        checkWin(winNum);
        setSpinning(false);
      }
    };

    animateWheel();
  };

  const checkWin = (winNum: number) => {
    let totalWin = 0;
    const winColor = winNum === 0 ? 'green' : redNumbers.includes(winNum) ? 'red' : 'black';

    bets.forEach(bet => {
      let payout = 0;

      if (bet.type.startsWith('num-') && parseInt(bet.type.split('-')[1]) === winNum) {
        payout = bet.amount * 36;
      } else if (bet.type === 'red' && winColor === 'red') {
        payout = bet.amount * 2;
      } else if (bet.type === 'black' && winColor === 'black') {
        payout = bet.amount * 2;
      } else if (bet.type === 'even' && winNum !== 0 && winNum % 2 === 0) {
        payout = bet.amount * 2;
      } else if (bet.type === 'odd' && winNum % 2 === 1) {
        payout = bet.amount * 2;
      } else if (bet.type === '1-18' && winNum >= 1 && winNum <= 18) {
        payout = bet.amount * 2;
      } else if (bet.type === '19-36' && winNum >= 19 && winNum <= 36) {
        payout = bet.amount * 2;
      } else if (bet.type === '1st-12' && winNum >= 1 && winNum <= 12) {
        payout = bet.amount * 3;
      } else if (bet.type === '2nd-12' && winNum >= 13 && winNum <= 24) {
        payout = bet.amount * 3;
      } else if (bet.type === '3rd-12' && winNum >= 25 && winNum <= 36) {
        payout = bet.amount * 3;
      }

      totalWin += payout;
    });

    setBalance(prev => prev + totalWin);
    
    if (totalWin > 0) {
      setMessage(`🎉 Winner! Number ${winNum} (${winColor.toUpperCase()}) - Won $${totalWin}!`);
      playSound(winSoundRef);
    } else {
      setMessage(`Number ${winNum} (${winColor.toUpperCase()}) - Try again!`);
    }

    setBets([]);
  };

  const chipValues = [1, 5, 10, 25, 50, 100];

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden p-4">
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-black to-green-900"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href={"/"}>
            <Button variant="outline" className="border-2 border-purple-500/50 bg-slate-900/50 text-white font-bold">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Games
            </Button>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="bg-slate-900/50 rounded-xl px-6 py-3 border-2 border-yellow-500/50">
              <div className="text-gray-400 text-xs font-bold">BALANCE</div>
              <div className="text-2xl font-black text-yellow-400">${balance}</div>
            </div>
            
            <Button onClick={() => setSoundEnabled(!soundEnabled)} variant="outline" className="border-2 border-purple-500/50 bg-slate-900/50 text-white">
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-5xl font-black bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 bg-clip-text text-transparent mb-2">
            ROULETTE ROYALE
          </h1>
          <p className="text-gray-300 text-lg font-bold">Place your chips and spin to win! 🎰</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="border-4 border-red-500/50 bg-gradient-to-br from-slate-900 to-black backdrop-blur-xl shadow-2xl">
              <CardContent className="p-6">
                <div className="relative w-full aspect-square mb-6">
                  <div className="absolute inset-0 rounded-full border-8 border-yellow-600 shadow-2xl shadow-yellow-500/50"></div>
                  
                  <div 
                    className="absolute inset-4 rounded-full overflow-hidden transition-transform duration-100"
                    style={{ transform: `rotate(${rotation}deg)` }}
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-900 via-black to-green-900">
                      {rouletteNumbers.map((item, index) => {
                        const angle = (360 / rouletteNumbers.length) * index;
                        return (
                          <div
                            key={index}
                            className={`absolute w-full h-full ${
                              item.color === 'red' ? 'bg-red-600' : item.color === 'black' ? 'bg-black' : 'bg-green-600'
                            }`}
                            style={{
                              transform: `rotate(${angle}deg)`,
                              clipPath: `polygon(50% 50%, 50% 0%, ${50 + Math.tan(Math.PI / rouletteNumbers.length) * 50}% 0%)`,
                            }}
                          >
                            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white text-xs font-bold">
                              {item.num}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="absolute inset-1/3 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border-4 border-yellow-300 shadow-lg flex items-center justify-center">
                    <Crown className="w-12 h-12 text-yellow-900" />
                  </div>

                  <div 
                    className="absolute inset-0 transition-transform duration-100"
                    style={{ transform: `rotate(${ballRotation}deg)` }}
                  >
                    <div className="absolute top-1/4 left-1/2 w-4 h-4 bg-white rounded-full shadow-xl border-2 border-gray-400 transform -translate-x-1/2"></div>
                  </div>
                </div>

                {winningNumber !== null && (
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-4 mb-4 animate-pulse">
                    <div className="text-center">
                      <div className="text-black font-black text-sm">WINNING NUMBER</div>
                      <div className="text-black font-black text-5xl">{winningNumber}</div>
                      <div className={`text-black font-black text-lg ${
                        winningNumber === 0 ? 'text-green-900' : 
                        redNumbers.includes(winningNumber) ? 'text-red-900' : 'text-gray-900'
                      }`}>
                        {winningNumber === 0 ? 'GREEN' : redNumbers.includes(winningNumber) ? 'RED' : 'BLACK'}
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-purple-500/20 border-2 border-purple-500/50 rounded-xl p-4 mb-4">
                  <div className="text-white text-center font-bold">{message}</div>
                </div>

                <Button
                  onClick={spin}
                  disabled={spinning || bets.length === 0}
                  className={`w-full text-2xl font-black py-8 rounded-2xl shadow-2xl border-4 transition-all ${
                    spinning || bets.length === 0
                      ? 'bg-slate-700 border-slate-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 hover:from-red-600 hover:via-orange-600 hover:to-yellow-600 border-yellow-400 shadow-yellow-500/50 hover:scale-105'
                  }`}
                >
                  {spinning ? (
                    <span className="flex items-center justify-center gap-2">
                      <RotateCw className="w-8 h-8 animate-spin" />
                      SPINNING...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Zap className="w-8 h-8" />
                      SPIN!
                    </span>
                  )}
                </Button>

                <Button
                  onClick={clearBets}
                  disabled={spinning || bets.length === 0}
                  variant="outline"
                  className="w-full mt-3 border-2 border-red-500/50 bg-slate-900/50 text-white font-bold"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Clear All Bets
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="border-4 border-green-500/50 bg-gradient-to-br from-green-900/40 to-black backdrop-blur-xl shadow-2xl">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="text-white font-black text-lg mb-3">SELECT CHIP VALUE:</h3>
                  <div className="grid grid-cols-6 gap-3">
                    {chipValues.map(value => (
                      <button
                        key={value}
                        onClick={() => setChipValue(value)}
                        disabled={spinning}
                        className={`relative w-full aspect-square rounded-full font-black text-lg transition-all ${
                          chipValue === value
                            ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-black scale-110 shadow-xl shadow-yellow-500/50 border-4 border-white'
                            : 'bg-gradient-to-br from-purple-600 to-pink-600 text-white hover:scale-105 border-2 border-white/30'
                        }`}
                      >
                        ${value}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-4 mb-4 border-2 border-yellow-500/50">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-bold">TOTAL BETS:</span>
                    <span className="text-yellow-400 font-black text-2xl">
                      ${bets.reduce((sum, bet) => sum + bet.amount, 0)}
                    </span>
                  </div>
                </div>

                <div className="bg-green-800 p-4 rounded-xl border-4 border-yellow-600">
                  <div className="grid grid-cols-13 gap-1 mb-2">
                    <div 
                      onClick={() => placeBet('num-0')}
                      className="col-span-1 row-span-3 bg-green-600 rounded-lg flex items-center justify-center font-black text-white text-2xl cursor-pointer hover:bg-green-500 border-2 border-yellow-400 relative"
                    >
                      0
                      {bets.filter(b => b.type === 'num-0').length > 0 && (
                        <div className="absolute top-1 right-1 bg-yellow-400 text-black text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                          {bets.filter(b => b.type === 'num-0').length}
                        </div>
                      )}
                    </div>

                    {[...Array(12)].map((_, col) => (
                      <div key={col} className="col-span-1 grid grid-rows-3 gap-1">
                        {[3, 2, 1].map(row => {
                          const num = col * 3 + row;
                          const isRed = redNumbers.includes(num);
                          const betCount = bets.filter(b => b.type === `num-${num}`).length;
                          return (
                            <div
                              key={num}
                              onClick={() => placeBet(`num-${num}`)}
                              className={`${
                                isRed ? 'bg-red-600 hover:bg-red-500' : 'bg-black hover:bg-gray-800'
                              } rounded-lg flex items-center justify-center font-black text-white cursor-pointer border-2 border-yellow-400 relative min-h-[50px]`}
                            >
                              {num}
                              {betCount > 0 && (
                                <div className="absolute top-1 right-1 bg-yellow-400 text-black text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                                  {betCount}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {['1st-12', '2nd-12', '3rd-12'].map(betType => {
                      const betCount = bets.filter(b => b.type === betType).length;
                      return (
                        <div key={betType} onClick={() => placeBet(betType)} className="bg-green-700 hover:bg-green-600 rounded-lg p-3 text-center font-black text-white cursor-pointer border-2 border-yellow-400 relative">
                          {betType}
                          {betCount > 0 && (
                            <div className="absolute top-1 right-1 bg-yellow-400 text-black text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                              {betCount}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-6 gap-2">
                    {['1-18', 'even', 'red', 'black', 'odd', '19-36'].map(betType => {
                      const betCount = bets.filter(b => b.type === betType).length;
                      const bgColor = betType === 'red' ? 'bg-red-600 hover:bg-red-500' : 
                                      betType === 'black' ? 'bg-black hover:bg-gray-800' : 
                                      'bg-green-700 hover:bg-green-600';
                      return (
                        <div key={betType} onClick={() => placeBet(betType)} className={`${bgColor} rounded-lg p-3 text-center font-black text-white cursor-pointer border-2 border-yellow-400 relative`}>
                          {betType.toUpperCase()}
                          {betCount > 0 && (
                            <div className="absolute top-1 right-1 bg-yellow-400 text-black text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                              {betCount}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 bg-slate-900/50 rounded-xl p-4 border-2 border-purple-500/30">
                  <h4 className="text-white font-black text-sm mb-2">PAYOUT ODDS:</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                    <div>• Straight Up: <span className="text-yellow-400 font-bold">36:1</span></div>
                    <div>• Red/Black: <span className="text-yellow-400 font-bold">2:1</span></div>
                    <div>• Dozens: <span className="text-yellow-400 font-bold">3:1</span></div>
                    <div>• Even/Odd: <span className="text-yellow-400 font-bold">2:1</span></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}