import { useState, useEffect } from 'react';
import { ShieldCheck, Activity, Volume2, VolumeX, Cpu, Radio, Sparkles } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface LiveTelemetryBarProps {
  onOpenCertificateVerify: () => void;
}

export default function LiveTelemetryBar({ onOpenCertificateVerify }: LiveTelemetryBarProps) {
  const [time, setTime] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState(soundFX.enabled);
  const [activeWorkers, setActiveWorkers] = useState(14892);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('it-IT', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Europe/Rome',
        }) + ' CET'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Subtle simulated telemetry fluctuations
  useEffect(() => {
    const workerInterval = setInterval(() => {
      if (Math.random() > 0.6) {
        setActiveWorkers((prev) => prev + 1);
      }
    }, 6000);
    return () => clearInterval(workerInterval);
  }, []);

  const handleToggleSound = () => {
    const next = soundFX.toggle();
    setSoundEnabled(next);
  };

  return (
    <div className="w-full bg-[#020b08]/90 backdrop-blur-md border-b border-[#0f3e32]/60 text-[#a3b8b0] text-[11px] font-mono tracking-wider relative z-30">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: System Status & Live Beacon */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#041d15] px-2.5 py-0.5 rounded border border-[#2dd4bf]/30 text-[#2dd4bf]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f5d4] animate-ping" />
            <span className="font-bold">SYS.ACTIVE // 2026 READY</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[#73887e]">
            <Radio className="w-3 h-3 text-[#d4af37]" />
            <span>NODI:</span>
            <span className="text-[#d6ede4]">TREVISO (HUB 01)</span>
            <span className="text-[#3a5247]">•</span>
            <span className="text-[#d6ede4]">MILANO (HUB 02)</span>
          </div>
        </div>

        {/* Center: Live Worker Counter & Verification Quick Link */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              soundFX.playLaser();
              onOpenCertificateVerify();
            }}
            className="flex items-center gap-1.5 text-[#2dd4bf] hover:text-[#00f5d4] transition-colors cursor-pointer group"
            title="Apri Registro Nazionale Attestati"
          >
            <ShieldCheck className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span className="underline underline-offset-2 font-bold">VERIFICA ATTESTATO QR</span>
          </button>

          <div className="hidden md:flex items-center gap-2 bg-[#041d15]/80 px-2.5 py-0.5 rounded border border-[#0f3e32]">
            <Activity className="w-3 h-3 text-[#2dd4bf]" />
            <span>LAVORATORI CERTIFICATI:</span>
            <span className="font-bold text-white">{activeWorkers.toLocaleString()}</span>
          </div>
        </div>

        {/* Right: Live Clock & Futuristic Sound Toggle */}
        <div className="flex items-center gap-3">
          <div className="text-[#8ba298] font-bold hidden lg:block">
            <span>ROME:</span> <span className="text-[#2dd4bf]">{time || '10:42:15 CET'}</span>
          </div>

          <button
            onClick={handleToggleSound}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold transition-all border ${
              soundEnabled
                ? 'bg-[#2dd4bf]/20 text-[#2dd4bf] border-[#2dd4bf]/50'
                : 'bg-[#061e16] text-[#73887e] border-[#133e31] hover:text-[#a3b8b0]'
            }`}
            title="Attiva/Disattiva effetti audio futuristici"
          >
            {soundEnabled ? <Volume2 className="w-3 h-3 text-[#2dd4bf]" /> : <VolumeX className="w-3 h-3" />}
            <span className="hidden sm:inline">{soundEnabled ? 'HUD AUDIO [ON]' : 'HUD AUDIO [OFF]'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
