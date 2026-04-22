
import React, { useState, useEffect } from 'react';
import { TimeRange, User } from '../types';
import { supabaseService } from '../services/supabaseService';

const Leaderboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [rankings, setRankings] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      try {
        const data = await supabaseService.getRankings();
        setRankings(data);
      } catch (error) {
        console.warn('Error fetching rankings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Hall of Fame</h1>
          <p className="text-slate-600 dark:text-slate-400">Celebrating the most consistent and creative contributors in our community.</p>
        </div>

        {/* Period Selector */}
        <div className="flex justify-center mb-10">
          <div className="bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 inline-flex shadow-sm transition-colors">
            {(['week', 'month', 'year'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-8 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
                  timeRange === range 
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg' 
                    : 'text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Rankings Table */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Rank</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Designer</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Challenges</th>
                  <th className="px-8 py-5 text-right text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rankings.map((user, idx) => (
                  <tr key={user.id} className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-colors">
                    <td className="px-8 py-6">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        idx === 0 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                        idx === 1 ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' :
                        idx === 2 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
                        'text-slate-400 dark:text-slate-600'
                      }`}>
                        {idx + 1}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center">
                        <img src={user.avatar} className="w-10 h-10 rounded-full mr-4 border-2 border-white dark:border-slate-800 shadow-sm" alt={user.name} />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{user.name}</div>
                          <div className="text-xs text-slate-400 dark:text-slate-500">Pro Designer</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{user.challengesCompleted}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="text-lg font-extrabold text-slate-900 dark:text-white">{user.points.toLocaleString()}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
