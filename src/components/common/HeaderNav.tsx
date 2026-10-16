import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  LogOut, 
  UserCheck, 
  ShieldCheck, 
  Users, 
  KeyRound,
  ArrowLeftRight
} from 'lucide-react';
import { PortalType } from '../../types/chapel';
import { useChapel } from '../../context/ChapelContext';
import { ExportImportModal } from './ExportImportModal';

export const HeaderNav: React.FC = () => {
  const { 
    activePortal, 
    switchPortal, 
    logout, 
    authenticatedUserName 
  } = useChapel();
  const [showExportModal, setShowExportModal] = useState(false);

  const getRoleBadge = () => {
    switch (activePortal) {
      case 'coordinator':
        return {
          icon: <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />,
          title: 'የአስተባባሪ ገጽ',
          subtitle: 'ወንጌላዊ ገላትያ ደስታ',
          pillClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
        };
      case 'leaders':
        return {
          icon: <UserCheck className="w-3.5 h-3.5 text-blue-400" />,
          title: 'የመሪዎች ገጽ',
          subtitle: 'የአመራር ጉባኤ',
          pillClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
        };
      case 'members':
      default:
        return {
          icon: <Users className="w-3.5 h-3.5 text-emerald-400" />,
          title: 'የአባላት ገጽ',
          subtitle: 'የቤተሰብ መረጃ',
          pillClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
        };
    }
  };

  const badge = getRoleBadge();

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-6">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <img 
              src="/src/assets/images/chapel_emblem_1791928260015.jpg" 
              alt="ኤዴን ቻፕል አርማ"
              className="w-10 h-10 rounded-full object-cover border border-amber-500/40 shadow-xs shrink-0" 
            />
            <div className="leading-none">
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap block">
                ብርብር ቃለ ሕይወት · ኤዴን ቻፕል
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] text-amber-700 font-medium hidden md:inline-block">
                  የአባላትና የመሪዎች ሲስተም
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono border border-slate-200 hidden sm:inline-block">
                  136 አባወራዎች
                </span>
              </div>
            </div>
          </div>

          {/* Zone 2: 3 Portal Switcher Nav Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1">
            <button
              onClick={() => switchPortal('coordinator')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activePortal === 'coordinator'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>1. የአስተባባሪ ገጽ</span>
            </button>

            <button
              onClick={() => switchPortal('leaders')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activePortal === 'leaders'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>2. የመሪዎች ገጽ</span>
            </button>

            <button
              onClick={() => switchPortal('members')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activePortal === 'members'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>3. የአባላት ገጽ</span>
            </button>
          </nav>

          {/* Zone 3: Actions + Active Session & Logout */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Active user status tag */}
            <div className={`hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg border text-xs font-medium ${badge.pillClass}`}>
              {badge.icon}
              <div className="text-left leading-tight">
                <span className="block font-bold">{badge.title}</span>
                <span className="text-[10px] opacity-80">{authenticatedUserName || badge.subtitle}</span>
              </div>
            </div>

            {/* Excel Export */}
            <button
              onClick={() => setShowExportModal(true)}
              className="px-3 py-2 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="የአባላትና የቤተሰብ መረጃ ኤክሴል አውርድ / ጫን"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ኤክሴል / ምትኬ</span>
            </button>

            {/* Logout / Switch User Button */}
            <button
              onClick={logout}
              title="ከሲስተሙ ውጣ እና ወደ አንድ ወጥ መግቢያ ተመለስ"
              className="px-2.5 sm:px-3 py-2 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>ውጣ / መግቢያ ቀይር</span>
            </button>
          </div>
        </div>
      </header>

      {/* Export / Import Modal */}
      <ExportImportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </>
  );
};
