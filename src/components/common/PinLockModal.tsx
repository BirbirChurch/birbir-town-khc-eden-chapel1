import React, { useState } from 'react';
import { Lock, KeyRound, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { PortalType } from '../../types/chapel';
import { useChapel } from '../../context/ChapelContext';

interface PinLockModalProps {
  portalToUnlock: PortalType;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PinLockModal: React.FC<PinLockModalProps> = ({
  portalToUnlock,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { unlockPortal } = useChapel();
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const titles: Record<PortalType, { name: string; hint: string }> = {
    coordinator: {
      name: 'የቻፕሉ አስተባባሪ ገጽ (ወንጌላዊ ገላትያ ደስታ)',
      hint: 'ነባሪ ሚስጥር ቁጥር: 7777'
    },
    leaders: {
      name: 'የኤዴን ቻፕል መሪዎች ገጽ',
      hint: 'ነባሪ ሚስጥር ቁጥር: 1234'
    },
    members: {
      name: 'የአባላት ገጽ',
      hint: 'ነባሪ ሚስጥር ቁጥር: 2024'
    }
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const success = unlockPortal(portalToUnlock, pin);
    if (success) {
      setError(false);
      setPin('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  const fillDefaultPin = (presetPin: string) => {
    setPin(presetPin);
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base leading-tight">ደህንነቱ የተጠበቀ መቆጣጠሪያ</h3>
            <p className="text-xs text-slate-300 mt-0.5">{titles[portalToUnlock].name}</p>
          </div>
        </div>

        <form onSubmit={handleUnlock} className="p-6 space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            ይህ ገጽ የተቆለፈ ነው። እባክዎ ለመግባት የተመደበውን ሚስጥር ቁጥር (PIN) ያስገቡ።
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 flex items-center justify-between">
              <span>ሚስጥር ቁጥር (PIN Code)</span>
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPin ? 'ደብቅ' : 'አሳይ'}</span>
              </button>
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                autoFocus
                maxLength={8}
                placeholder="****"
                className="w-full text-center tracking-widest text-lg font-mono px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 bg-slate-50"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-2.5 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>የተሳሳተ ሚስጥር ቁጥር ነው። እባክዎ እንደገና ይሞክሩ።</span>
            </div>
          )}

          {/* Quick helper button */}
          <div className="pt-1 flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span>{titles[portalToUnlock].hint}</span>
            <button
              type="button"
              onClick={() => {
                if (portalToUnlock === 'coordinator') fillDefaultPin('7777');
                if (portalToUnlock === 'leaders') fillDefaultPin('1234');
                if (portalToUnlock === 'members') fillDefaultPin('2024');
              }}
              className="text-amber-700 font-medium hover:underline cursor-pointer"
            >
              በነባሪ ቁጥር ክፈት
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              ተመለስ
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              ክፈትና ግባ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
