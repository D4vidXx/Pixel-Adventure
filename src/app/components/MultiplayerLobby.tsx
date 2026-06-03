import { useState } from 'react';
import { ArrowLeft, Play, Users, Link, CheckCircle, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface MultiplayerLobbyProps {
  onBack: () => void;
  onConnect: (roomId: string, name: string) => void;
  isConnected: boolean;
  isConnecting: boolean;
  connectionError?: string | null;
  roomId: string | null;
  players: Array<{ name: string; role: 'host' | 'guest' }>;
  role: 'host' | 'guest' | null;
  onProceedToHeroSelection: () => void;
  backgroundStyle?: string;
}

export function MultiplayerLobby({
  onBack,
  onConnect,
  isConnected,
  isConnecting,
  connectionError,
  roomId,
  players,
  role,
  onProceedToHeroSelection,
  backgroundStyle
}: MultiplayerLobbyProps) {
  const [name, setName] = useState(() => {
    return localStorage.getItem('pixelAdventure_mpName') || `Player_${Math.floor(100 + Math.random() * 900)}`;
  });
  const [joinCode, setJoinCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleCreate = () => {
    if (!name.trim()) {
      setErrorMsg('Name is required');
      return;
    }
    setErrorMsg('');
    localStorage.setItem('pixelAdventure_mpName', name);
    // Generate random 4-digit code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    onConnect(code, name);
  };

  const handleJoin = () => {
    if (!name.trim()) {
      setErrorMsg('Name is required');
      return;
    }
    if (!joinCode.trim() || joinCode.length !== 4) {
      setErrorMsg('Enter a valid 4-digit Room Code');
      return;
    }
    setErrorMsg('');
    localStorage.setItem('pixelAdventure_mpName', name);
    onConnect(joinCode, name);
  };

  return (
    <div
      className="size-full flex items-center justify-center animate-fade-in px-4"
      style={{ background: backgroundStyle }}
    >
      <div className="bg-slate-900/90 p-8 rounded-2xl shadow-2xl w-full max-w-md text-white border border-blue-700/40 backdrop-blur-md relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-500/30 to-purple-500/10 rounded-full blur-2xl z-0" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-purple-500/20 to-blue-500/10 rounded-full blur-2xl z-0" />
        
        <h2 className="text-3xl font-black mb-6 text-center tracking-tight drop-shadow-lg z-10 relative flex items-center justify-center gap-2">
          <Users className="w-8 h-8 text-blue-400" />
          <span>Co-op Lobby</span>
        </h2>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-500/50 rounded-lg text-red-200 text-sm font-semibold z-10 relative text-center">
            ⚠️ {errorMsg}
          </div>
        )}

        {connectionError && (
          <div className="mb-4 p-3 bg-amber-950/60 border border-amber-500/50 rounded-lg text-amber-100 text-sm font-semibold z-10 relative text-center">
            {connectionError}
          </div>
        )}

        {!isConnected ? (
          <div className="z-10 relative space-y-5">
            {/* Player Name Input */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-blue-300">Your Nickname</label>
              <input
                type="text"
                maxLength={12}
                value={name}
                onChange={e => setName(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                className="w-full bg-slate-950/60 border border-blue-900/50 rounded-lg px-4 py-3 text-white font-bold placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter name..."
                disabled={isConnecting}
              />
            </div>

            {/* Actions Grid */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreate}
                disabled={isConnecting}
                className="py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl font-extrabold tracking-wide uppercase transition-all shadow-lg border border-blue-400/30 flex flex-col items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>Create Lobby</span>
                <span className="text-[10px] text-blue-200 normal-case font-normal">Host a new game</span>
              </motion.button>

              <div className="bg-slate-950/60 border border-blue-900/50 rounded-xl p-2 flex flex-col justify-between">
                <input
                  type="text"
                  maxLength={4}
                  placeholder="CODE"
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center bg-transparent font-mono text-lg font-black text-blue-300 placeholder-blue-900/40 focus:outline-none focus:border-blue-500"
                  disabled={isConnecting}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleJoin}
                  disabled={isConnecting || joinCode.length !== 4}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 rounded-lg text-xs font-bold uppercase transition-colors disabled:opacity-50"
                >
                  Join Room
                </motion.button>
              </div>
            </div>

            {isConnecting && (
              <div className="flex items-center justify-center gap-2 text-blue-400 pt-2 animate-pulse">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span className="font-bold">Establishing link...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="z-10 relative space-y-6">
            {/* Room Code Display */}
            <div className="bg-slate-950/70 border border-blue-900/40 rounded-xl p-4 text-center">
              <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Room Access Code</div>
              <div className="text-4xl font-mono font-black text-blue-400 tracking-wider flex items-center justify-center gap-2">
                <span>{roomId}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(roomId || '')}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                  title="Copy room code"
                >
                  <Link className="w-5 h-5 text-slate-400 hover:text-white" />
                </button>
              </div>
            </div>

            {/* Players List */}
            <div className="space-y-3">
              <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">Party Members ({players.length}/2)</div>
              <div className="space-y-2">
                {players.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-4 py-3 bg-slate-950/40 border border-white/5 rounded-xl"
                  >
                    <div className="flex items-center gap-2 font-bold">
                      <div className={`w-3.5 h-3.5 rounded-full ${p.role === 'host' ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]'}`} />
                      <span>{p.name}</span>
                    </div>
                    <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${p.role === 'host' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'}`}>
                      {p.role === 'host' ? 'Host' : 'Guest'}
                    </span>
                  </div>
                ))}

                {players.length < 2 && (
                  <div className="flex items-center justify-center py-4 bg-slate-950/20 border border-dashed border-white/10 rounded-xl text-slate-500 text-sm font-semibold animate-pulse">
                    Waiting for co-op partner...
                  </div>
                )}
              </div>
            </div>

            {/* Proceed Actions */}
            {players.length >= 2 ? (
              role === 'host' ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onProceedToHeroSelection}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white border border-emerald-400/50 rounded-xl transition-all duration-300 shadow-lg font-black tracking-widest uppercase flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Choose Heroes</span>
                </motion.button>
              ) : (
                <div className="flex items-center justify-center gap-2 text-emerald-400 py-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl font-bold text-sm">
                  <CheckCircle className="w-5 h-5" />
                  <span>Waiting for Host to start...</span>
                </div>
              )
            ) : null}
          </div>
        )}

        <div className="mt-6 border-t border-white/10 pt-4 z-10 relative">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg shadow transition-colors w-full font-semibold flex items-center justify-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Leave Lobby</span>
          </button>
        </div>
      </div>
    </div>
  );
}
