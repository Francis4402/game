'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trophy, Zap, Volume2, VolumeX, ArrowLeft, Shield, Swords, Heart, Flame } from 'lucide-react';
import Link from 'next/link';

interface Fighter {
  name: string;
  emoji: string;
  color: string;
  health: number;
  attack: number;
  defense: number;
  speed: number;
  wins: number;
}

interface BetHistory {
  id: number | string;
  betAmount: number;
  fighter: string;
  won: boolean;
  winAmount: number;
  odds: number;
}

export default function ChickenFightGame() {
  const [mounted, setMounted] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(10);
  const [selectedFighter, setSelectedFighter] = useState<string | null>(null);
  const [fighting, setFighting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [message, setMessage] = useState('Select a chicken and place your bet!');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [betHistory, setBetHistory] = useState<BetHistory[]>([]);
  const [roundNumber, setRoundNumber] = useState(1);
  
  const [fighter1Health, setFighter1Health] = useState(100);
  const [fighter2Health, setFighter2Health] = useState(100);
  const [currentAttacker, setCurrentAttacker] = useState<'red' | 'blue' | null>(null);
  const [winner, setWinner] = useState<string | null>(null);

  const fightSoundRef = useRef<HTMLAudioElement | null>(null);
  const winSoundRef = useRef<HTMLAudioElement | null>(null);
  const crowdSoundRef = useRef<HTMLAudioElement | null>(null);

  const fighters: Record<string, Fighter> = {
    red: {
      name: 'RED THUNDER',
      emoji: '🐓',
      color: 'red',
      health: 100,
      attack: 20,
      defense: 15,
      speed: 18,
      wins: Math.floor(Math.random() * 50) + 20
    },
    blue: {
      name: 'BLUE LIGHTNING',
      emoji: '🐔',
      color: 'blue',
      health: 100,
      attack: 18,
      defense: 20,
      speed: 15,
      wins: Math.floor(Math.random() * 50) + 20
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fightSoundRef.current = new Audio('https://cdn.freesound.org/previews/145/145441_2615119-lq.mp3');
      winSoundRef.current = new Audio('https://cdn.freesound.org/previews/270/270404_5123851-lq.mp3');
      crowdSoundRef.current = new Audio('https://cdn.freesound.org/previews/341/341695_5121236-lq.mp3');
      
      if (fightSoundRef.current) fightSoundRef.current.volume = 0.4;
      if (winSoundRef.current) winSoundRef.current.volume = 0.5;
      if (crowdSoundRef.current) crowdSoundRef.current.volume = 0.3;
    }
  }, [mounted]);

  const playSound = (soundRef: React.MutableRefObject<HTMLAudioElement | null>) => {
    if (soundEnabled && soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(err => console.log('Audio play failed:', err));
    }
  };

  const calculateOdds = (fighter: string) => {
    const f = fighters[fighter];
    const opponent = fighter === 'red' ? fighters.blue : fighters.red;
    
    const fighterPower = f.attack + f.defense + f.speed + (f.wins * 0.5);
    const opponentPower = opponent.attack + opponent.defense + opponent.speed + (opponent.wins * 0.5);
    
    const winChance = fighterPower / (fighterPower + opponentPower);
    const odds = 1 / winChance;
    
    return Math.max(1.2, Math.min(5, odds)).toFixed(2);
  };

  const placeBet = () => {
    if (!selectedFighter) {
      setMessage('Please select a chicken first!');
      return;
    }

    if (betAmount > balance) {
      setMessage('Insufficient balance!');
      return;
    }

    if (betAmount < 1) {
      setMessage('Minimum bet is $1');
      return;
    }

    setBalance(balance - betAmount);
    setMessage(`Bet placed on ${fighters[selectedFighter].name}! Get ready!`);
    startCountdown();
  };

  const startCountdown = () => {
    playSound(crowdSoundRef);
    setCountdown(3);
    const countInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countInterval);
          startFight();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startFight = () => {
    setFighting(true);
    setFighter1Health(100);
    setFighter2Health(100);
    setWinner(null);
    setMessage('🥊 FIGHT! 🥊');

    simulateFight();
  };

  const simulateFight = async () => {
    let health1 = 100;
    let health2 = 100;
    let turn = 0;

    const fightLoop = setInterval(() => {
      turn++;
      
      // Determine attacker based on speed with some randomness
      const speedDiff = fighters.red.speed - fighters.blue.speed;
      const redAttacks = Math.random() * 100 < 50 + speedDiff;
      
      if (redAttacks) {
        setCurrentAttacker('red');
        playSound(fightSoundRef);
        
        const damage = Math.max(5, fighters.red.attack - fighters.blue.defense * 0.3 + Math.random() * 10);
        health2 = Math.max(0, health2 - damage);
        setFighter2Health(health2);
      } else {
        setCurrentAttacker('blue');
        playSound(fightSoundRef);
        
        const damage = Math.max(5, fighters.blue.attack - fighters.red.defense * 0.3 + Math.random() * 10);
        health1 = Math.max(0, health1 - damage);
        setFighter1Health(health1);
      }

      setTimeout(() => setCurrentAttacker(null), 300);

      // Check for winner
      if (health1 <= 0 || health2 <= 0 || turn >= 20) {
        clearInterval(fightLoop);
        
        let winnerName = '';
        if (health1 > health2) {
          winnerName = 'red';
        } else if (health2 > health1) {
          winnerName = 'blue';
        } else {
          winnerName = Math.random() > 0.5 ? 'red' : 'blue';
        }
        
        setTimeout(() => endFight(winnerName), 1000);
      }
    }, 800);
  };

  const endFight = (winnerFighter: string) => {
    setWinner(winnerFighter);
    setFighting(false);
    playSound(winSoundRef);

    const won = selectedFighter === winnerFighter;
    const odds = parseFloat(calculateOdds(selectedFighter!));
    const winAmount = won ? betAmount * odds : 0;

    if (won) {
      setBalance(prev => prev + winAmount);
      setMessage(`🎉 ${fighters[winnerFighter].name} WINS! You won $${winAmount.toFixed(2)}! 🎉`);
    } else {
      setMessage(`${fighters[winnerFighter].name} WINS! You lost $${betAmount.toFixed(2)}. Try again!`);
    }

    setBetHistory(prev => [{
      id: Date.now() + Math.random(), // Add random number to ensure uniqueness
      betAmount: betAmount,
      fighter: fighters[selectedFighter!].name,
      won: won,
      winAmount: winAmount,
      odds: odds
    }, ...prev.slice(0, 9)]);

    setRoundNumber(prev => prev + 1);
    setSelectedFighter(null);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden p-4">
      {/* Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-950 via-red-950 to-yellow-950 opacity-60"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(234, 88, 12, 0.2) 0%, transparent 50%)',
        }}></div>
      </div>

      {/* Floating feathers */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-3xl opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          >
            🪶
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Link href={"/"}>
            <Button variant="outline" className="border-2 border-orange-500/50 bg-slate-900/50 hover:bg-slate-800 text-white font-bold backdrop-blur-xl">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Games
            </Button>
          </Link>

          <div className="flex items-center gap-4">
            <div className="bg-slate-900/70 rounded-xl px-6 py-3 border-2 border-orange-500/50 backdrop-blur-xl">
              <div className="text-orange-300 text-xs font-bold">BALANCE</div>
              <div className="text-2xl font-black text-yellow-400">${balance.toFixed(2)}</div>
            </div>
            
            <div className="bg-slate-900/70 rounded-xl px-6 py-3 border-2 border-orange-500/50 backdrop-blur-xl">
              <div className="text-orange-300 text-xs font-bold">ROUND</div>
              <div className="text-2xl font-black text-white">#{roundNumber}</div>
            </div>

            <Button onClick={() => setSoundEnabled(!soundEnabled)} variant="outline" className="border-2 border-orange-500/50 bg-slate-900/50 hover:bg-slate-800 text-white backdrop-blur-xl">
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-6xl font-black bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-2 drop-shadow-2xl">
            CHICKEN FIGHT
          </h1>
          <p className="text-orange-200 text-xl font-bold drop-shadow-lg">
            🐓 Place your bet and watch the battle! 🐔
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left & Right - Fighters */}
          <div className="lg:col-span-2">
            <Card className="border-4 border-orange-500/50 bg-gradient-to-br from-slate-900/90 to-orange-900/50 backdrop-blur-xl shadow-2xl overflow-hidden">
              <CardContent className="p-0">
                {/* Arena */}
                <div className="relative h-[500px] bg-gradient-to-b from-yellow-900/30 to-red-900/30 overflow-hidden">
                  {/* Arena Floor */}
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-950/50 to-transparent"></div>
                  
                  {/* Countdown */}
                  {countdown > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-30">
                      <div className="text-9xl font-black text-yellow-400 animate-bounce drop-shadow-2xl">
                        {countdown}
                      </div>
                    </div>
                  )}

                  {/* Message */}
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-black/70 px-6 py-3 rounded-xl border-2 border-yellow-500">
                      <div className="text-2xl font-black text-yellow-400 text-center">
                        {message}
                      </div>
                    </div>
                  </div>

                  {/* VS Badge */}
                  {!winner && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                      <div className="bg-gradient-to-br from-red-600 to-orange-600 w-24 h-24 rounded-full flex items-center justify-center border-4 border-yellow-400 shadow-2xl animate-pulse">
                        <Swords className="w-12 h-12 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Red Fighter (Left) */}
                  <div className="absolute left-16 top-1/2 transform -translate-y-1/2">
                    <div className={`transition-all duration-300 ${
                      currentAttacker === 'red' ? 'scale-125 -translate-x-4' : ''
                    } ${winner === 'red' ? 'animate-bounce' : ''} ${
                      winner === 'blue' ? 'opacity-30 grayscale' : ''
                    }`}>
                      {/* Health Bar */}
                      <div className="mb-4 bg-slate-900/70 rounded-lg p-2 border-2 border-red-500">
                        <div className="text-red-300 text-xs font-bold mb-1 flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {fighter1Health.toFixed(0)}%
                        </div>
                        <div className="bg-red-950 rounded-full h-3 overflow-hidden border border-red-500">
                          <div 
                            className="bg-gradient-to-r from-red-600 to-red-400 h-full transition-all duration-500"
                            style={{ width: `${fighter1Health}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Fighter */}
                      <div className="relative">
                        <div className="text-9xl drop-shadow-2xl">{fighters.red.emoji}</div>
                        {currentAttacker === 'red' && (
                          <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
                            <Flame className="w-12 h-12 text-orange-500 animate-ping" />
                          </div>
                        )}
                        {winner === 'red' && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                            <Trophy className="w-16 h-16 text-yellow-400 animate-bounce" />
                          </div>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="mt-4 bg-red-900/50 rounded-lg p-3 border-2 border-red-500 backdrop-blur-sm">
                        <div className="text-red-300 font-black text-center text-lg mb-2">
                          {fighters.red.name}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <Shield className="w-3 h-3 text-blue-400" />
                            <span className="text-gray-300">DEF: {fighters.red.defense}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Swords className="w-3 h-3 text-red-400" />
                            <span className="text-gray-300">ATK: {fighters.red.attack}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="w-3 h-3 text-yellow-400" />
                            <span className="text-gray-300">SPD: {fighters.red.speed}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Trophy className="w-3 h-3 text-yellow-400" />
                            <span className="text-gray-300">W: {fighters.red.wins}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Blue Fighter (Right) */}
                  <div className="absolute right-16 top-1/2 transform -translate-y-1/2">
                    <div className={`transition-all duration-300 ${
                      currentAttacker === 'blue' ? 'scale-125 translate-x-4' : ''
                    } ${winner === 'blue' ? 'animate-bounce' : ''} ${
                      winner === 'red' ? 'opacity-30 grayscale' : ''
                    }`}>
                      {/* Health Bar */}
                      <div className="mb-4 bg-slate-900/70 rounded-lg p-2 border-2 border-blue-500">
                        <div className="text-blue-300 text-xs font-bold mb-1 flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {fighter2Health.toFixed(0)}%
                        </div>
                        <div className="bg-blue-950 rounded-full h-3 overflow-hidden border border-blue-500">
                          <div 
                            className="bg-gradient-to-r from-blue-600 to-blue-400 h-full transition-all duration-500"
                            style={{ width: `${fighter2Health}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Fighter */}
                      <div className="relative">
                        <div className="text-9xl drop-shadow-2xl transform scale-x-[-1]">{fighters.blue.emoji}</div>
                        {currentAttacker === 'blue' && (
                          <div className="absolute -left-4 top-1/2 transform -translate-y-1/2">
                            <Flame className="w-12 h-12 text-blue-500 animate-ping" />
                          </div>
                        )}
                        {winner === 'blue' && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                            <Trophy className="w-16 h-16 text-yellow-400 animate-bounce" />
                          </div>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="mt-4 bg-blue-900/50 rounded-lg p-3 border-2 border-blue-500 backdrop-blur-sm">
                        <div className="text-blue-300 font-black text-center text-lg mb-2">
                          {fighters.blue.name}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <Shield className="w-3 h-3 text-blue-400" />
                            <span className="text-gray-300">DEF: {fighters.blue.defense}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Swords className="w-3 h-3 text-red-400" />
                            <span className="text-gray-300">ATK: {fighters.blue.attack}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="w-3 h-3 text-yellow-400" />
                            <span className="text-gray-300">SPD: {fighters.blue.speed}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Trophy className="w-3 h-3 text-yellow-400" />
                            <span className="text-gray-300">W: {fighters.blue.wins}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Betting Controls */}
                <div className="p-6 bg-slate-900/70 backdrop-blur-xl border-t-4 border-orange-500/30">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Select Red */}
                    <button
                      onClick={() => !fighting && !countdown && setSelectedFighter('red')}
                      disabled={fighting || countdown > 0}
                      className={`p-6 rounded-xl border-4 transition-all ${
                        selectedFighter === 'red'
                          ? 'bg-red-900/50 border-red-500 scale-105 shadow-xl shadow-red-500/50'
                          : 'bg-red-900/20 border-red-500/30 hover:border-red-500/60'
                      } ${fighting || countdown > 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="text-6xl mb-2">{fighters.red.emoji}</div>
                      <div className="text-red-300 font-black text-xl">{fighters.red.name}</div>
                      <div className="text-yellow-400 font-black text-2xl mt-2">
                        Odds: {calculateOdds('red')}x
                      </div>
                    </button>

                    {/* Select Blue */}
                    <button
                      onClick={() => !fighting && !countdown && setSelectedFighter('blue')}
                      disabled={fighting || countdown > 0}
                      className={`p-6 rounded-xl border-4 transition-all ${
                        selectedFighter === 'blue'
                          ? 'bg-blue-900/50 border-blue-500 scale-105 shadow-xl shadow-blue-500/50'
                          : 'bg-blue-900/20 border-blue-500/30 hover:border-blue-500/60'
                      } ${fighting || countdown > 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="text-6xl mb-2 transform scale-x-[-1]">{fighters.blue.emoji}</div>
                      <div className="text-blue-300 font-black text-xl">{fighters.blue.name}</div>
                      <div className="text-yellow-400 font-black text-2xl mt-2">
                        Odds: {calculateOdds('blue')}x
                      </div>
                    </button>
                  </div>

                  {/* Bet Amount and Place Bet */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-orange-300 font-bold text-sm">BET AMOUNT</label>
                      <Input
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(Math.max(1, parseFloat(e.target.value) || 1))}
                        disabled={fighting || countdown > 0}
                        className="bg-slate-900/50 border-2 border-orange-500/50 text-white text-xl font-bold h-14"
                      />
                      <div className="flex gap-2">
                        {[10, 25, 50, 100].map(amount => (
                          <Button
                            key={amount}
                            onClick={() => setBetAmount(amount)}
                            disabled={fighting || countdown > 0}
                            className="flex-1 bg-orange-900/50 border border-orange-500/50 text-white hover:bg-orange-800/50 text-sm"
                          >
                            ${amount}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-end">
                      <Button
                        onClick={placeBet}
                        disabled={!selectedFighter || fighting || countdown > 0}
                        className={`w-full h-14 text-2xl font-black rounded-xl shadow-xl border-4 transition-all ${
                          !selectedFighter || fighting || countdown > 0
                            ? 'bg-slate-700 border-slate-600 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 border-orange-400 shadow-orange-500/50 hover:scale-105'
                        }`}
                      >
                        PLACE BET
                      </Button>
                    </div>
                  </div>

                  {selectedFighter && (
                    <div className="mt-4 bg-orange-900/30 rounded-xl p-4 border-2 border-orange-500/50">
                      <div className="flex justify-between items-center">
                        <span className="text-orange-300 font-bold">Selected:</span>
                        <span className="text-yellow-400 font-black text-xl">
                          {fighters[selectedFighter].name} ({calculateOdds(selectedFighter)}x)
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-orange-300 font-bold">Potential Win:</span>
                        <span className="text-green-400 font-black text-xl">
                          ${(betAmount * parseFloat(calculateOdds(selectedFighter))).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - History */}
          <div className="lg:col-span-1">
            <Card className="border-4 border-orange-500/50 bg-gradient-to-br from-slate-900/90 to-orange-900/50 backdrop-blur-xl shadow-2xl">
              <CardContent className="p-6">
                <h3 className="text-2xl font-black text-orange-300 mb-4 flex items-center gap-2">
                  <Trophy className="w-6 h-6" />
                  BET HISTORY
                </h3>

                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {betHistory.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      No bets yet. Start betting!
                    </div>
                  ) : (
                    betHistory.map((bet) => (
                      <div
                        key={bet.id}
                        className={`rounded-xl p-4 border-2 ${
                          bet.won
                            ? 'bg-green-900/30 border-green-500/50'
                            : 'bg-red-900/30 border-red-500/50'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-300 text-sm font-bold">
                            {bet.fighter}
                          </span>
                          <span className={`font-black text-lg ${
                            bet.won ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {bet.odds.toFixed(2)}x
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-xs">
                            Bet: ${bet.betAmount.toFixed(2)}
                          </span>
                          <span className={`font-black text-xl ${
                            bet.won ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {bet.won ? `+$${bet.winAmount.toFixed(2)}` : `-$${bet.betAmount.toFixed(2)}`}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Stats */}
                {betHistory.length > 0 && (
                  <div className="mt-6 bg-orange-900/30 rounded-xl p-4 border-2 border-orange-500/50">
                    <h4 className="text-orange-300 font-black text-sm mb-3">SESSION STATS</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Bets:</span>
                        <span className="text-white font-bold">{betHistory.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Wins:</span>
                        <span className="text-green-400 font-bold">
                          {betHistory.filter(b => b.won).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Losses:</span>
                        <span className="text-red-400 font-bold">
                          {betHistory.filter(b => !b.won).length}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-orange-500/30 pt-2 mt-2">
                        <span className="text-gray-400">Net Profit:</span>
                        <span className={`font-black ${
                          betHistory.reduce((sum, b) => sum + (b.won ? b.winAmount - b.betAmount : -b.betAmount), 0) >= 0
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}>
                          ${betHistory.reduce((sum, b) => sum + (b.won ? b.winAmount - b.betAmount : -b.betAmount), 0).toFixed(2)}
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
        <Card className="mt-6 border-4 border-orange-500/50 bg-gradient-to-br from-slate-900/90 to-orange-900/50 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-6">
            <h3 className="text-2xl font-black text-orange-300 mb-4">📋 HOW TO PLAY</h3>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div className="bg-orange-900/30 rounded-xl p-4 border-2 border-orange-500/30">
                <div className="text-4xl mb-2">🐓</div>
                <div className="text-white font-bold mb-1">1. Choose Fighter</div>
                <div className="text-gray-400 text-sm">Select RED or BLUE chicken</div>
              </div>
              <div className="bg-orange-900/30 rounded-xl p-4 border-2 border-orange-500/30">
                <div className="text-4xl mb-2">💰</div>
                <div className="text-white font-bold mb-1">2. Place Bet</div>
                <div className="text-gray-400 text-sm">Enter amount and confirm</div>
              </div>
              <div className="bg-orange-900/30 rounded-xl p-4 border-2 border-orange-500/30">
                <div className="text-4xl mb-2">⚔️</div>
                <div className="text-white font-bold mb-1">3. Watch Fight</div>
                <div className="text-gray-400 text-sm">Chickens battle it out!</div>
              </div>
              <div className="bg-orange-900/30 rounded-xl p-4 border-2 border-orange-500/30">
                <div className="text-4xl mb-2">🏆</div>
                <div className="text-white font-bold mb-1">4. Win!</div>
                <div className="text-gray-400 text-sm">Get bet × odds payout</div>
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