import React, { useState, useEffect } from 'react';
import { fireConfetti } from '../utils/confetti';

export default function WonderDashboardHero({ currentUser, onQuickAddPrompt }) {
  // --- POMODORO WONDER TIMER STATE ---
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' (25m) | 'break' (5m)
  const [soundPlaying, setSoundPlaying] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isRunning) {
      setIsRunning(false);
      fireConfetti();
      alert(mode === 'focus' ? '🎉 Focus session complete! Take a cozy 5-minute break!' : '⏰ Break finished! Ready to dive back in?');
    }
    return () => clearInterval(interval);
  }, [isRunning, timerSeconds, mode]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = (newMode = mode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimerSeconds(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const minutes = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
  const seconds = String(timerSeconds % 60).padStart(2, '0');

  // Time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="glass-wonder rounded-3xl p-6 sm:p-7 mb-6 relative overflow-hidden border border-white/90 shadow-lg">
      {/* Background Soft Glow Accents */}
      <div className="absolute -top-12 -right-12 w-52 h-52 bg-gradient-to-br from-pink-300/30 to-purple-300/30 rounded-full blur-2xl pointer-events-none animate-aurora-pulse" />
      <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-gradient-to-tr from-sky-300/30 to-emerald-300/30 rounded-full blur-2xl pointer-events-none animate-aurora-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
        
        {/* Left Side: Greeting, Streak & Affirmation */}
        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-pink-100 to-purple-100 text-purple-900 border border-purple-200 shadow-2xs flex items-center gap-1.5">
              <span className="animate-pulse">✨</span>
              <span>Vignan Study Wonderland</span>
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1 shadow-2xs">
              <span>🔥</span>
              <span>5-Day Streak!</span>
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 shadow-2xs">
              <span>🌿</span>
              <span>Level 4 Scholar</span>
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              {getGreeting()}, <span className="bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-600 bg-clip-text text-transparent">{currentUser?.name || 'Scholar'}</span>! 🌸
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1">
              Department of {currentUser?.department || 'Computer Science & Engineering'} • Turn assignments into masterpieces today.
            </p>
          </div>

          {/* Wonder Affirmation Ticker */}
          <div className="flex items-center gap-2 pt-1 text-xs font-bold text-purple-900/90 bg-white/70 backdrop-blur-xs px-3.5 py-1.5 rounded-2xl border border-purple-100/80 w-fit shadow-2xs">
            <span className="text-sm">💎</span>
            <span>"Small daily victories create extraordinary academic futures."</span>
          </div>
        </div>

        {/* Right Side: Interactive Focus Wonder Timer */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-purple-200/80 shadow-md min-w-[280px] sm:min-w-[320px] self-start lg:self-auto">
          <div className="flex items-center justify-between mb-3 border-b border-stone-100 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-base animate-spin-slow">⏳</span>
              <span className="text-xs font-black uppercase tracking-wider text-purple-950">Focus Wonder Timer</span>
            </div>

            {/* Mode switch */}
            <div className="flex gap-1 text-[10px] font-extrabold">
              <button
                type="button"
                onClick={() => resetTimer('focus')}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  mode === 'focus' ? 'bg-purple-600 text-white shadow-2xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                25m Focus
              </button>
              <button
                type="button"
                onClick={() => resetTimer('break')}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  mode === 'break' ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                5m Break
              </button>
            </div>
          </div>

          {/* Clock Display */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-stone-900 font-mono">
                {minutes}:{seconds}
              </div>
              <div className="text-[11px] font-bold text-stone-400 mt-0.5">
                {isRunning ? (mode === 'focus' ? '🌿 Deep Study in progress...' : '☕ Enjoy your cozy break!') : 'Ready to start session'}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleTimer}
                className={`px-4 py-2 rounded-xl text-xs font-black text-white shadow-md transition-all cursor-pointer ${
                  isRunning
                    ? 'bg-amber-500 hover:bg-amber-600 scale-[1.02]'
                    : 'bg-purple-600 hover:bg-purple-700 active:scale-95'
                }`}
              >
                {isRunning ? 'Pause ⏸️' : 'Start 🚀'}
              </button>
              <button
                type="button"
                onClick={() => resetTimer()}
                title="Reset Timer"
                className="p-2 rounded-xl text-xs bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold transition-all cursor-pointer"
              >
                🔄
              </button>
            </div>
          </div>

          {/* Quick Confetti & Ambient button */}
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-stone-100 text-[11px] font-bold text-stone-500">
            <button
              type="button"
              onClick={() => {
                fireConfetti();
              }}
              className="hover:text-purple-700 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>🎊</span>
              <span>Shower Confetti</span>
            </button>
            <span className="text-stone-300">•</span>
            <button
              type="button"
              onClick={() => {
                setSoundPlaying(!soundPlaying);
              }}
              className={`transition-colors cursor-pointer flex items-center gap-1 ${
                soundPlaying ? 'text-purple-600 font-black' : 'hover:text-purple-700'
              }`}
            >
              <span>🎵</span>
              <span>{soundPlaying ? 'Lo-Fi Vibe On 🎧' : 'Ambient Music'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
