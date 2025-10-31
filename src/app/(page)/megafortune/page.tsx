"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Sparkles, Trophy, Zap, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SlotMachineGame() {
  const [reels, setReels] = useState(['🍒', '🍒', '🍒', '🍒']);
  const [spinning, setSpinning] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(10);
  const [winAmount, setWinAmount] = useState(0);
  const [message, setMessage] = useState('Place your bet and spin!');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Audio refs
  const spinSoundRef = useRef<HTMLAudioElement | null>(null);
  const winSoundRef = useRef<HTMLAudioElement | null>(null);
  const stopSoundRef = useRef<HTMLAudioElement | null>(null);
  const bigWinSoundRef = useRef<HTMLAudioElement | null>(null);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio objects with free sounds from freesound.org
    spinSoundRef.current = new Audio('https://cdn.freesound.org/previews/341/341695_5121236-lq.mp3'); // Slot machine spinning
    winSoundRef.current = new Audio('https://cdn.freesound.org/previews/270/270404_5123851-lq.mp3'); // Win sound
    stopSoundRef.current = new Audio('https://cdn.freesound.org/previews/145/145441_2615119-lq.mp3'); // Reel stop
    bigWinSoundRef.current = new Audio('https://cdn.freesound.org/previews/270/270319_5123851-lq.mp3'); // Big win celebration
    bgMusicRef.current = new Audio('https://cdn.pixabay.com/audio/2022/03/10/audio_4a468c9db8.mp3'); // Casino background music
    
    // Set volumes
    if (spinSoundRef.current) spinSoundRef.current.volume = 0.3;
    if (winSoundRef.current) winSoundRef.current.volume = 0.5;
    if (stopSoundRef.current) stopSoundRef.current.volume = 0.4;
    if (bigWinSoundRef.current) bigWinSoundRef.current.volume = 0.6;
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = 0.2;
      bgMusicRef.current.loop = true;
    }

    // Cleanup function
    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current = null;
      }
    };
  }, []);

  // Handle background music based on sound enabled state
  useEffect(() => {
    if (bgMusicRef.current) {
      if (soundEnabled) {
        bgMusicRef.current.play().catch(err => console.log('Background music play failed:', err));
      } else {
        bgMusicRef.current.pause();
      }
    }
  }, [soundEnabled]);

  const symbols = ['🍒', '🍋', '🍊', '🍇', '💎', '⭐', '🔔', '7️⃣'];
  
  const payouts: Record<string, number> = {
    '🍒🍒🍒🍒': 50,
    '🍋🍋🍋🍋': 75,
    '🍊🍊🍊🍊': 100,
    '🍇🍇🍇🍇': 150,
    '💎💎💎💎': 300,
    '⭐⭐⭐⭐': 500,
    '🔔🔔🔔🔔': 750,
    '7️⃣7️⃣7️⃣7️⃣': 1000,
  };

  const playSound = (soundRef: React.MutableRefObject<HTMLAudioElement | null>) => {
    if (soundEnabled && soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(err => console.log('Audio play failed:', err));
    }
  };

  const spin = () => {
    if (spinning || balance < bet) {
      if (balance < bet) {
        setMessage('Insufficient balance!');
      }
      return;
    }

    setSpinning(true);
    setWinAmount(0);
    setMessage('Spinning...');
    setBalance(balance - bet);
    
    // Play spin sound
    playSound(spinSoundRef);

    // Animate each reel with different delays
    const spinDurations = [1500, 1800, 2100, 2400];
    const finalSymbols: string[] = [];

    spinDurations.forEach((duration, index) => {
      const interval = setInterval(() => {
        setReels(prev => {
          const newReels = [...prev];
          newReels[index] = symbols[Math.floor(Math.random() * symbols.length)];
          return newReels;
        });
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        const finalSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        finalSymbols[index] = finalSymbol;
        
        setReels(prev => {
          const newReels = [...prev];
          newReels[index] = finalSymbol;
          return newReels;
        });

        // Play stop sound for each reel
        playSound(stopSoundRef);

        // Check for win when last reel stops
        if (index === 3) {
          setTimeout(() => {
            checkWin(finalSymbols);
            setSpinning(false);
          }, 300);
        }
      }, duration);
    });
  };

  const checkWin = (symbolsArray: string[]) => {
    const combination = symbolsArray.join('');
    const payout = payouts[combination];

    if (payout) {
      const winnings = payout * bet;
      setWinAmount(winnings);
      setBalance(prev => prev + winnings);
      setMessage(`🎉 WINNER! You won $${winnings}! 🎉`);
      
      // Play big win sound for high payouts
      if (payout >= 300) {
        playSound(bigWinSoundRef);
      } else {
        playSound(winSoundRef);
      }
    } else {
      // Check for 3 matching symbols
      const threeMatch = symbolsArray.slice(0, 3).every(s => s === symbolsArray[0]) || 
                        symbolsArray.slice(1, 4).every(s => s === symbolsArray[1]);
      
      if (threeMatch) {
        const winnings = bet * 5;
        setWinAmount(winnings);
        setBalance(prev => prev + winnings);
        setMessage(`Nice! 3 in a row - Won $${winnings}!`);
        playSound(winSoundRef);
      } else {
        setMessage('Try again! Good luck!');
      }
    }
  };

  const changeBet = (amount: number) => {
    if (!spinning) {
      const newBet = Math.max(1, Math.min(100, bet + amount));
      setBet(newBet);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-pink-900"></div>
      </div>

      {/* Radial Gradient Overlays */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Back Button */}
        <Link href="/">
            <Button
            variant="outline"
            className="mb-4 border-2 border-purple-500/50 bg-slate-900/50 hover:bg-slate-800 text-white font-bold"
            >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Games
            </Button>
        </Link>

        <Card className="overflow-hidden border-4 border-purple-500/50 bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl shadow-2xl shadow-purple-500/50">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 rounded-2xl flex items-center justify-center animate-pulse shadow-lg shadow-purple-500/50">
                  <Crown className="w-9 h-9 text-white" />
                </div>
              </div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
                MEGA SLOTS
              </h1>
              <p className="text-gray-300 text-lg font-bold">
                Match 4 symbols to win big! 🎰
              </p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-900/50 rounded-xl p-4 border-2 border-purple-500/30">
                <div className="text-gray-400 text-sm font-bold mb-1">BALANCE</div>
                <div className="text-3xl font-black text-yellow-400">${balance}</div>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-4 border-2 border-purple-500/30">
                <div className="text-gray-400 text-sm font-bold mb-1">BET AMOUNT</div>
                <div className="text-3xl font-black text-green-400">${bet}</div>
              </div>
            </div>

            {/* Slot Machine */}
            <div className="bg-gradient-to-br from-slate-900 to-black rounded-3xl p-8 border-4 border-yellow-500/50 shadow-2xl shadow-yellow-500/30 mb-6">
              {/* Decorative Top */}
              <div className="flex justify-center mb-6">
                <div className="flex items-center gap-4">
                  <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
                  <Trophy className="w-10 h-10 text-yellow-400" />
                  <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
                </div>
              </div>

              {/* Reels */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {reels.map((symbol, index) => (
                  <div
                    key={index}
                    className={`bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 border-4 border-white/20 shadow-xl flex items-center justify-center ${
                      spinning ? 'animate-spin-slow' : ''
                    }`}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      minHeight: '180px'
                    }}
                  >
                    <div className="text-8xl">{symbol}</div>
                  </div>
                ))}
              </div>

              {/* Win Lights */}
              <div className="flex justify-center gap-2 mb-4">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full ${
                      winAmount > 0 ? 'bg-yellow-400 animate-pulse' : 'bg-slate-700'
                    }`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Message Display */}
            <div className={`text-center mb-6 p-4 rounded-xl border-2 ${
              winAmount > 0 
                ? 'bg-green-500/20 border-green-500 animate-pulse' 
                : 'bg-purple-500/20 border-purple-500/50'
            }`}>
              <div className="text-2xl font-black text-white">{message}</div>
              {winAmount > 0 && (
                <div className="text-4xl font-black text-yellow-400 mt-2 animate-bounce">
                  +${winAmount}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="space-y-4">
              {/* Bet Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={() => changeBet(-5)}
                  disabled={spinning}
                  className="bg-slate-900 border-2 border-purple-500/50 text-white font-bold text-xl px-6 py-6 rounded-xl hover:bg-slate-800"
                >
                  -$5
                </Button>
                <Button
                  onClick={() => changeBet(-1)}
                  disabled={spinning}
                  className="bg-slate-900 border-2 border-purple-500/50 text-white font-bold text-xl px-6 py-6 rounded-xl hover:bg-slate-800"
                >
                  -$1
                </Button>
                <div className="bg-slate-900/50 px-8 py-4 rounded-xl border-2 border-purple-500/50 min-w-[120px] text-center">
                  <div className="text-gray-400 text-xs font-bold">BET</div>
                  <div className="text-2xl font-black text-white">${bet}</div>
                </div>
                <Button
                  onClick={() => changeBet(1)}
                  disabled={spinning}
                  className="bg-slate-900 border-2 border-purple-500/50 text-white font-bold text-xl px-6 py-6 rounded-xl hover:bg-slate-800"
                >
                  +$1
                </Button>
                <Button
                  onClick={() => changeBet(5)}
                  disabled={spinning}
                  className="bg-slate-900 border-2 border-purple-500/50 text-white font-bold text-xl px-6 py-6 rounded-xl hover:bg-slate-800"
                >
                  +$5
                </Button>
              </div>

              {/* Spin Button */}
              <Button
                onClick={spin}
                disabled={spinning || balance < bet}
                className={`w-full text-3xl font-black py-10 rounded-2xl shadow-2xl border-4 transition-all ${
                  spinning || balance < bet
                    ? 'bg-slate-700 border-slate-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 via-emerald-600 to-green-600 hover:from-green-600 hover:via-emerald-700 hover:to-green-700 border-green-400 shadow-green-500/50 hover:scale-105'
                }`}
              >
                {spinning ? (
                  <span className="flex items-center justify-center gap-3">
                    <Zap className="w-10 h-10 animate-spin" />
                    SPINNING...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <Zap className="w-10 h-10" />
                    SPIN TO WIN!
                    <Zap className="w-10 h-10" />
                  </span>
                )}
              </Button>

              {/* Sound Toggle */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  variant="outline"
                  className="border-2 border-purple-500/50 bg-slate-900/50 text-white font-bold"
                >
                  {soundEnabled ? (
                    <Volume2 className="w-5 h-5 mr-2" />
                  ) : (
                    <VolumeX className="w-5 h-5 mr-2" />
                  )}
                  {soundEnabled ? 'Sound On' : 'Sound Off'}
                </Button>
                {soundEnabled && (
                  <div className="flex items-center gap-2 text-green-400 font-bold text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Background Music Playing
                  </div>
                )}
              </div>
            </div>

            {/* Payout Table */}
            <div className="mt-8 bg-slate-900/50 rounded-xl p-6 border-2 border-purple-500/30">
              <h3 className="text-xl font-black text-white mb-4 text-center">PAYOUT TABLE</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {Object.entries(payouts).map(([combo, multiplier]) => (
                  <div key={combo} className="flex items-center justify-between bg-black/30 rounded-lg p-3">
                    <div className="text-2xl">{combo.split('').slice(0, 4).join(' ')}</div>
                    <div className="text-yellow-400 font-black">{multiplier}x</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center text-gray-400 text-xs font-bold">
                * 3 matching symbols = 5x bet
              </div>
            </div>

            {/* Sound Sources Info */}
            <div className="mt-6 p-4 bg-slate-900/50 rounded-xl border-2 border-purple-500/30">
              <div className="text-center text-gray-400 text-xs">
                <p className="font-bold mb-2">🔊 Sound Effects & Music Sources:</p>
                <p className="mb-1">Free sounds from <a href="https://freesound.org" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">Freesound.org</a> & <a href="https://pixabay.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">Pixabay</a></p>
                <p className="text-[10px] leading-relaxed mb-2">
                  Alternative sources: <a href="https://mixkit.co/free-sound-effects/casino/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">Mixkit</a>, 
                  <a href="https://pixabay.com/sound-effects/search/casino/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline"> Pixabay</a>, 
                  <a href="https://www.zapsplat.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline"> Zapsplat</a>
                </p>
                <p className="text-[10px] text-yellow-400 font-bold">
                  🎵 Background Music: Casino/Jazz ambient loops available at all sources above
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          0% { transform: rotateX(0deg); }
          100% { transform: rotateX(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 0.1s linear infinite;
        }
      `}</style>
    </div>
  );
}