import React, { useState } from 'react';
import { useLeaderboard } from '../../hooks/useSocial';

export function Leaderboard() {
  const [period, setPeriod] = useState('month');
  const { data: list = [], isLoading } = useLeaderboard(period, 50);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Classement des traders</h1>
      <div className="btn-group mb-4">
        <button className={`btn ${period === 'week' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setPeriod('week')}>Week</button>
        <button className={`btn ${period === 'month' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setPeriod('month')}>Month</button>
        <button className={`btn ${period === 'year' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setPeriod('year')}>Year</button>
      </div>

      {isLoading && <div>Chargement...</div>}

      <div className="overflow-x-auto">
        <table className="table table-compact w-full">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Trader</th>
              <th>Tier</th>
              <th>PnL</th>
              <th>Win Rate</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item: any, idx: number) => (
              <tr key={item.userId}>
                <td>{idx + 1}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="avatar placeholder w-8 h-8"><div className="bg-primary text-primary-content rounded-full">{item.profile.displayName?.slice(0,2)}</div></div>
                    <div>{item.profile.displayName}</div>
                  </div>
                </td>
                <td>{item.profile.tier}</td>
                <td>{item.profile.totalPnL ?? '-'}</td>
                <td>{item.profile.winRate ?? '-'}</td>
                <td>{item.profile.rating ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;
