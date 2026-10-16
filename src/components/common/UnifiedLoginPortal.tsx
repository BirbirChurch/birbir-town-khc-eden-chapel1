import React, { useState } from 'react';
import { 
  KeyRound, 
  ShieldCheck, 
  UserCheck, 
  Users, 
  Sparkles, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  Church,
  Search,
  BookOpen
} from 'lucide-react';
import { PortalType } from '../../types/chapel';
import { useChapel } from '../../context/ChapelContext';

interface UnifiedLoginPortalProps {
  onLoginSuccess?: (portal: PortalType) => void;
}

export const UnifiedLoginPortal: React.FC<UnifiedLoginPortalProps> = ({ onLoginSuccess }) => {
  const { loginWithKey, members } = useChapel();
  const [keyInput, setKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [selectedRole, setSelectedRole] = useState<PortalType | 'auto'>('auto');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick helper to fill key and auto submit
  const handleQuickRoleLogin = (role: PortalType, pin: string) => {
    setKeyInput(pin);
    setSelectedRole(role);
    setErrorMessage(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const res = loginWithKey(pin, role);
      setIsSubmitting(false);
      if (res.success && res.role) {
        onLoginSuccess?.(res.role);
      } else {
        setErrorMessage(res.message || 'የተሳሳተ የመግቢያ ቁልፍ ነው። እባክዎ እንደገና ይሞክሩ።');
      }
    }, 250);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim()) {
      setErrorMessage('እባክዎ የመግቢያ ቁልፍ (PIN) ወይም የቤተሰብ መለያ ኮድ ያስገቡ።');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const targetPortal = selectedRole === 'auto' ? undefined : selectedRole;
      const res = loginWithKey(keyInput.trim(), targetPortal);
      setIsSubmitting(false);

      if (res.success && res.role) {
        onLoginSuccess?.(res.role);
      } else {
        setErrorMessage(res.message || 'ያስገቡት ቁልፍ ትክክል አይደለም። እባክዎ ከታች ከተዘረዘሩት ቁልፎች አንዱን ይጠቀሙ።');
      }
    }, 200);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Bar Branding */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between py-2 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <img 
            src="/src/assets/images/chapel_emblem_1791928260015.jpg" 
            alt="ኤዴን ቻፕል አርማ"
            className="w-10 h-10 rounded-full object-cover border border-amber-500/50 shadow-md shrink-0" 
          />
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
              ብርብር ከተማ ቃለ ሕይወት ቤተክርስቲያን
            </h1>
            <p className="text-xs text-amber-400 font-medium">
              ኤዴን ቻፕል · የአባላትና አመራር መረጃ ቋት
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700/60 font-mono">
          <Church className="w-3.5 h-3.5 text-amber-400" />
          <span>የተመሰረተበት፦ 1974 ዓ.ም</span>
        </div>
      </div>

      {/* Main Single Login Gate Container */}
      <div className="max-w-4xl mx-auto w-full my-auto py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>አንድ ወጥ መግቢያ በር (Unified Portal Entry)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            ወደ ኤዴን ቻፕል ሲስተም እንኳን ደህና መጣችሁ
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl mx-auto leading-relaxed">
            ለሁሉም የቻፕሉ አባላት፣ መሪዎችና አስተባባሪ የተዘጋጀ አንድ ወጥ መግቢያ። የመግቢያ ቁልፍዎን በማስገባት በቀጥታ ይግቡ።
          </p>
        </div>

        {/* Central Entry Card */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden max-w-2xl mx-auto">
          {/* Header Strip */}
          <div className="bg-slate-950/60 px-6 py-4 border-b border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <KeyRound className="w-5 h-5 text-amber-400" />
              <span className="font-semibold text-sm sm:text-base text-slate-100">
                የመግቢያ ቁልፍ ማስገቢያ
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
              136 አባወራዎች
            </span>
          </div>

          <form onSubmit={handleFormSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Input Field */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>የመግቢያ ቁልፍ (PIN) / የቤተሰብ መለያ ኮድ</span>
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showKey ? 'ደብቅ' : 'አሳይ'}</span>
                </button>
              </label>

              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={keyInput}
                  onChange={(e) => {
                    setKeyInput(e.target.value);
                    setErrorMessage(null);
                  }}
                  autoFocus
                  placeholder="ለምሳሌ፡ 7777 ወይም 1234 ወይም 2024 ወይም eden101"
                  className="w-full text-center text-lg sm:text-xl font-mono tracking-wider px-4 py-3.5 rounded-xl border border-slate-600 bg-slate-900/90 text-white placeholder:text-slate-500 placeholder:text-xs placeholder:font-sans focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all shadow-inner"
                />
                <KeyRound className="w-5 h-5 text-slate-400 absolute left-3.5 top-4 pointer-events-none" />
              </div>

              <p className="text-[11px] text-slate-400">
                * ለሁሉም ክፍት የሆነ ቁልፍ፡ <span className="text-amber-300 font-mono font-bold">1234</span> ወይም <span className="text-amber-300 font-mono font-bold">7777</span> ወይም <span className="text-amber-300 font-mono font-bold">2024</span>
              </p>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Direct Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-amber-500/20 active:scale-[0.99] disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>በማረጋገጥ ላይ...</span>
              ) : (
                <>
                  <span>ወደ ሲስተሙ ግባ</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleQuickRoleLogin('coordinator', '7777')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>ወደ ዋናው ዳሽቦርድ በቀጥታ እለፍ (Direct Access)</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </form>

          {/* Quick Access Role Buttons ("ለሁሉም መግቢያ ቁልፍ አዘጋጅ") */}
          <div className="bg-slate-950/70 p-6 border-t border-slate-700/80">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3.5 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>የቀጥታ መግቢያ አማራጮች (በ1 ጠቅታ ይግቡ)፦</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Coordinator Card */}
              <button
                type="button"
                onClick={() => handleQuickRoleLogin('coordinator', '7777')}
                className="group p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-amber-500/80 hover:bg-slate-800/90 transition-all text-left flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      አስተባባሪ
                    </span>
                    <span className="text-xs font-mono text-slate-400 group-hover:text-amber-300 font-bold">
                      7777
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-200">
                    የአስተባባሪ ገጽ
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-tight line-clamp-2">
                    ወንጌላዊ ገላትያ ደስታ · ሙሉ መረጃ መቆጣጠሪያ
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-amber-400 font-medium flex items-center justify-between">
                  <span>በአስተባባሪነት ግባ</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>

              {/* Leaders Card */}
              <button
                type="button"
                onClick={() => handleQuickRoleLogin('leaders', '1234')}
                className="group p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-blue-500/80 hover:bg-slate-800/90 transition-all text-left flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      መሪዎች
                    </span>
                    <span className="text-xs font-mono text-slate-400 group-hover:text-blue-300 font-bold">
                      1234
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-200">
                    የመሪዎች ገጽ
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-tight line-clamp-2">
                    አባቶች፣ ሴቶች፣ ወጣቶችና ኮሚቴዎች
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-blue-400 font-medium flex items-center justify-between">
                  <span>በመሪነት ግባ</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>

              {/* Members Card */}
              <button
                type="button"
                onClick={() => handleQuickRoleLogin('members', '2024')}
                className="group p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-emerald-500/80 hover:bg-slate-800/90 transition-all text-left flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      አባላት
                    </span>
                    <span className="text-xs font-mono text-slate-400 group-hover:text-emerald-300 font-bold">
                      2024
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-200">
                    የአባላት ገጽ
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-tight line-clamp-2">
                    136 አባወራዎችና ቤተሰቦች (ወይም eden101)
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-emerald-400 font-medium flex items-center justify-between">
                  <span>በአባልነት ግባ</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Informative Guidance & Passkey Reference Table */}
        <div className="mt-6 max-w-2xl mx-auto bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-xs text-slate-400 leading-relaxed">
          <div className="flex items-start gap-2.5">
            <BookOpen className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200 block mb-1">
                የመግቢያ ቁልፎች መመሪያ (Quick Passkey Guide)፦
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-300">
                <li>• <strong className="text-amber-300">የአስተባባሪ ቁልፍ፡</strong> 7777 (ወንጌላዊ ገላትያ ደስታ)</li>
                <li>• <strong className="text-blue-300">የመሪዎች ቁልፍ፡</strong> 1234 (የዘርፍና ኮሚቴ መሪዎች)</li>
                <li>• <strong className="text-emerald-300">የአባላት ቁልፍ፡</strong> 2024 (ወይም የቤተሰብ ኮድ eden101...)</li>
                <li>• <strong className="text-white">የጋራ መግቢያ ቁልፍ፡</strong> 1234 ወይም 7777</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer in Login Screen */}
      <div className="max-w-5xl mx-auto w-full pt-4 border-t border-slate-800/80 text-center text-xs text-slate-500">
        <span>© {new Date().getFullYear()} ብርብር ከተማ ቃለ ሕይወት ቤተክርስቲያን · ኤዴን ቻፕል የመረጃ ቋት</span>
      </div>
    </div>
  );
};
