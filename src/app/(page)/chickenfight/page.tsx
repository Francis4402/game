'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Trophy,
  Volume2,
  VolumeX,
  Flame,
  Zap,
  Heart,
  Shield,
  Swords,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  id: number;
  betAmount: number;
  fighter: string;
  won: boolean;
  winAmount: number;
  odds: number;
}

export default function ChickenFightGame() {
  const [mounted, setMounted] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState<number>(10);
  const [selectedFighter, setSelectedFighter] = useState<string | null>(null);
  const [fighting, setFighting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [message, setMessage] = useState('Select a chicken and place your bet!');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [betHistory, setBetHistory] = useState<BetHistory[]>([]);
  const [roundNumber, setRoundNumber] = useState(1);

  const [fighter1Health, setFighter1Health] = useState(100);
  const [fighter2Health, setFighter2Health] = useState(100);
  const [currentAttacker, setCurrentAttacker] = useState<'red' | 'blue'>('red');
  const [winner, setWinner] = useState<string | null>(null);

  const fightSoundRef = useRef<HTMLAudioElement | null>(null);
  const winSoundRef = useRef<HTMLAudioElement | null>(null);
  const crowdSoundRef = useRef<HTMLAudioElement | null>(null);

  const router = useRouter();

  const idRef = useRef<number>(Date.now());

  const fighters: Record<string, Fighter> = {
    red: {
      name: 'RED THUNDER',
      emoji: '🐓',
      color: 'red',
      health: 100,
      attack: 20,
      defense: 15,
      speed: 18,
      wins: Math.floor(Math.random() * 50) + 20,
    },
    blue: {
      name: 'BLUE LIGHTNING',
      emoji: '🐔',
      color: 'blue',
      health: 100,
      attack: 18,
      defense: 20,
      speed: 15,
      wins: Math.floor(Math.random() * 50) + 20,
    },
  };

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted) {
      fightSoundRef.current = new Audio('https://cdn.freesound.org/previews/145/145441_2615119-lq.mp3');
      winSoundRef.current = new Audio('https://cdn.freesound.org/previews/270/270404_5123851-lq.mp3');
      crowdSoundRef.current = new Audio('https://cdn.freesound.org/previews/341/341695_5121236-lq.mp3');
      [fightSoundRef, winSoundRef, crowdSoundRef].forEach((ref) => {
        if (ref.current) ref.current.volume = 0.4;
      });
    }

    return () => {
      [fightSoundRef, winSoundRef, crowdSoundRef].forEach((ref) => {
        if (ref.current) {
          try {
            ref.current.pause();
            ref.current.src = '';
          } catch {}
        }
      });
    };
  }, [mounted]);

  const playSound = (ref: React.MutableRefObject<HTMLAudioElement | null>) => {
    if (soundEnabled && ref.current) {
      ref.current.currentTime = 0;
      ref.current.play().catch(() => {});
    }
  };

  const calculateOdds = (fighter: string) => {
    const f = fighters[fighter];
    const opponent = fighter === 'red' ? fighters.blue : fighters.red;
    const power = f.attack + f.defense + f.speed + f.wins * 0.5;
    const oppPower = opponent.attack + opponent.defense + opponent.speed + opponent.wins * 0.5;
    const chance = power / (power + oppPower);
    const odds = 1 / chance;
    return Math.max(1.2, Math.min(5, odds)).toFixed(2);
  };

  const placeBet = () => {
    if (!selectedFighter) return setMessage('Please select a chicken first!');
    if (betAmount > balance) return setMessage('Insufficient balance!');
    if (betAmount < 1) return setMessage('Minimum bet is $1');

    setBalance((b) => b - betAmount);
    setMessage(`Bet placed on ${fighters[selectedFighter].name}! Get ready!`);
    startCountdown();
  };

  const startCountdown = () => {
    playSound(crowdSoundRef);
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          startFight();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const startFight = () => {
    setFighting(true);
    setFighter1Health(100);
    setFighter2Health(100);
    setWinner(null);
    setCurrentAttacker('red'); // start with red attacker by default
    setMessage('🥊 FIGHT! 🥊');
    simulateFight();
  };

  const simulateFight = () => {
    let health1 = 100;
    let health2 = 100;
    let turn = 0;

    const fightLoop = setInterval(() => {
      turn++;
      const redAttacks = Math.random() * 100 < 50 + (fighters.red.speed - fighters.blue.speed);

      if (redAttacks) {
        setCurrentAttacker('red');
        playSound(fightSoundRef);
        const dmg = Math.max(5, fighters.red.attack - fighters.blue.defense * 0.3 + Math.random() * 10);
        health2 = Math.max(0, health2 - dmg);
        setFighter2Health(health2);
      } else {
        setCurrentAttacker('blue');
        playSound(fightSoundRef);
        const dmg = Math.max(5, fighters.blue.attack - fighters.red.defense * 0.3 + Math.random() * 10);
        health1 = Math.max(0, health1 - dmg);
        setFighter1Health(health1);
      }

      if (health1 <= 0 || health2 <= 0 || turn >= 20) {
        clearInterval(fightLoop);
        const winFighter: 'red' | 'blue' =
          health1 > health2 ? 'red' : health2 > health1 ? 'blue' : Math.random() > 0.5 ? 'red' : 'blue';
        setTimeout(() => endFight(winFighter), 1000);
      }
    }, 800);
  };

  const endFight = (winnerFighter: 'red' | 'blue') => {
    setWinner(winnerFighter);
    setFighting(false);
    playSound(winSoundRef);
    setCurrentAttacker(winnerFighter);

    const won = selectedFighter === winnerFighter;
    const odds = parseFloat(calculateOdds(selectedFighter ?? winnerFighter));
    const winAmount = won ? betAmount * odds : 0;

    if (won) {
      setBalance((b) => b + winAmount);
      setMessage(`🎉 ${fighters[winnerFighter].name} WINS! You won $${winAmount.toFixed(2)}! 🎉`);
    } else {
      setMessage(`${fighters[winnerFighter].name} WINS! You lost $${betAmount.toFixed(2)}. Try again!`);
    }

    const newId = ++idRef.current;
    setBetHistory((h) => [
      { id: newId, betAmount, fighter: fighters[selectedFighter ?? winnerFighter].name, won, winAmount, odds },
      ...h.slice(0, 9),
    ]);

    setRoundNumber((n) => n + 1);
    setSelectedFighter(null);

    // 🕒 Refresh after 5 seconds
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  };

  if (!mounted) return null;

  const totalWins = betHistory.filter((b) => b.won).length;
  const totalLosses = betHistory.filter((b) => !b.won).length;
  const totalProfit = betHistory.reduce((s, b) => s + (b.winAmount - b.betAmount), 0);
  const winRate = betHistory.length ? ((totalWins / betHistory.length) * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold flex items-center gap-2 text-orange-400">
          <Flame className="w-7 h-7" /> CHICKEN FIGHT ARENA
        </h1>
        <Button
          variant="outline"
          className="bg-gray-800 border-orange-500 hover:bg-orange-500"
          onClick={() => setSoundEnabled(!soundEnabled)}
        >
          {soundEnabled ? <Volume2 /> : <VolumeX />}
        </Button>
      </div>

      {/* Balance + Betting */}
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <div className="bg-gray-900 rounded-lg p-4 mb-4 md:mb-0 md:w-1/3">
          <div className="text-gray-400 text-sm">BALANCE</div>
          <div className="text-3xl font-black text-green-400">${balance.toFixed(2)}</div>
        </div>

        <div className="bg-gray-900 rounded-lg p-4 md:w-1/3">
          <div className="text-gray-400 text-sm mb-2">BET AMOUNT</div>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              className="bg-gray-800 border-gray-700 text-white"
            />
            <Button onClick={placeBet} disabled={fighting}>
              PLACE BET
            </Button>
          </div>
        </div>
      </div>

      {/* Fighters */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {Object.entries(fighters).map(([key, f]) => {
          const isSelected = selectedFighter === key;
          const isWinner = winner === key;
          const isAttacking = currentAttacker === key;

          return (
            <div
              key={key}
              onClick={() => !fighting && setSelectedFighter((prev) => (prev === key ? null : key))}
              className={`cursor-pointer rounded-xl border-4 transition-all p-6 text-center ${
                isSelected ? 'border-yellow-400 scale-105' : 'border-gray-700'
              } ${f.color === 'red' ? 'bg-red-900/40' : 'bg-blue-900/40'} ${
                isWinner ? 'ring-4 ring-yellow-400' : ''
              } ${isAttacking ? 'animate-pulse' : ''}`}
            >
              <div className="text-6xl mb-2">{f.emoji}</div>
              <h3 className="font-black text-xl mb-1">{f.name}</h3>
              <div className="text-gray-400 text-sm flex justify-center gap-2">
                <span>
                  <Zap className="inline w-4 h-4 mr-1" /> {f.attack}
                </span>
                <span>
                  <Shield className="inline w-4 h-4 mr-1" /> {f.defense}
                </span>
                <span>
                  <Heart className="inline w-4 h-4 mr-1" /> {f.speed}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500">Odds: {calculateOdds(key)}x</p>
            </div>
          );
        })}
      </div>

      {/* Fight Area */}
      <Card className="border-4 border-orange-500/50 bg-gradient-to-br from-gray-900/80 to-black shadow-2xl">
        <CardContent className="p-6">
          <h2 className="text-center text-2xl font-bold text-orange-400 mb-3">ROUND {roundNumber}</h2>

          <p className="text-center text-lg mb-4 text-yellow-300">{message}</p>

          {countdown > 0 && (
            <div className="text-center text-5xl font-black text-orange-500 animate-pulse mb-3">{countdown}</div>
          )}

          {/* Health Bars */}
          <div className="flex justify-between items-center">
            <div>
              <div className="text-red-400 font-bold mb-1">RED</div>
              <div className="w-32 bg-gray-700 h-3 rounded">
                <div className="bg-red-500 h-3 rounded" style={{ width: `${fighter1Health}%` }} />
              </div>
            </div>
            <Swords className="text-orange-400 w-8 h-8" />
            <div className="text-right">
              <div className="text-blue-400 font-bold mb-1">BLUE</div>
              <div className="w-32 bg-gray-700 h-3 rounded ml-auto">
                <div className="bg-blue-500 h-3 rounded" style={{ width: `${fighter2Health}%` }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <Card className="border-2 border-gray-700 bg-gray-900/60">
          <CardContent className="p-4">
            <h3 className="text-xl font-bold text-yellow-400 mb-3 flex items-center gap-2">
              <Trophy className="w-5 h-5" /> BET HISTORY
            </h3>
            <div className="space-y-2 max-h-[250px] overflow-y-auto">
              {betHistory.length === 0 && <div className="text-gray-500 text-center py-6">No bets yet.</div>}
              {betHistory.map((b) => (
                <div
                  key={b.id}
                  className={`p-3 rounded-lg border-2 ${
                    b.won ? 'border-green-500/40 bg-green-900/20' : 'border-red-500/40 bg-red-900/20'
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="text-gray-300 text-sm">{b.fighter}</span>
                    <span className={`${b.won ? 'text-green-400' : 'text-red-400'} font-bold`}>
                      {b.won ? `+${b.winAmount.toFixed(2)}` : `-${b.betAmount.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="text-gray-500 text-xs">Odds: {b.odds.toFixed(2)}x</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-500/40 bg-gray-900/60">
          <CardContent className="p-4">
            <h3 className="text-xl font-bold text-orange-400 mb-3">SESSION STATS</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Bets:</span> <span>{betHistory.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Wins:</span> <span className="text-green-400">{totalWins}</span>
              </div>
              <div className="flex justify-between">
                <span>Losses:</span> <span className="text-red-400">{totalLosses}</span>
              </div>
              <div className="flex justify-between">
                <span>Win Rate:</span> <span className="text-yellow-400">{winRate}%</span>
              </div>
              <div className="flex justify-between">
                <span>Profit / Loss:</span>{' '}
                <span className={totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}>
                  ${totalProfit.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
