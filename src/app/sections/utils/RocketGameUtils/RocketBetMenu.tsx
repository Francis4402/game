import React from 'react'

interface RocketBetMenuProps {
  cash: number;
  betAmount: number;
  setBetAmount: (amount: number) => void;
  launched: boolean;
  exploded: boolean;
  multiplier: number;
  onBet: () => void;
  onCloseBet: () => void;
  closedBet: boolean;
}

const RocketBetMenu = ({ cash, betAmount, setBetAmount, launched, exploded, multiplier, onBet, onCloseBet, closedBet }: RocketBetMenuProps  ) => {
  return (
    <div className="w-full bg-white p-4 rounded shadow-md space-x-4 flex items-center">
        <input
          type="number"
          min={0}
          max={cash}
          value={betAmount}
          disabled={launched && !exploded}
          onChange={e => setBetAmount(Number(e.target.value))}
          className="border rounded px-2 py-1 w-20"
        />
        <button onClick={onBet} disabled={launched && !exploded}>🚀 BET</button>
        <button onClick={onCloseBet} disabled={!launched || exploded || closedBet}>💸 CLOSE BET</button>
        <div>💰 Cash: ${cash}</div>
        <div>📈 Multiplier: {multiplier.toFixed(2)}x</div>
    </div>
  )
}

export default RocketBetMenu