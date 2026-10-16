/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChapelProvider, useChapel } from './context/ChapelContext';
import { HeaderNav } from './components/common/HeaderNav';
import { CoordinatorDashboard } from './components/coordinator/CoordinatorDashboard';
import { LeadersDashboard } from './components/leaders/LeadersDashboard';
import { MemberDashboard } from './components/members/MemberDashboard';
import { UnifiedLoginPortal } from './components/common/UnifiedLoginPortal';

const AppContent: React.FC = () => {
  const { isAuthenticated, activePortal } = useChapel();

  // If not authenticated, show single unified login gate
  if (!isAuthenticated) {
    return <UnifiedLoginPortal />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <HeaderNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grow w-full">
        {activePortal === 'coordinator' && <CoordinatorDashboard />}
        {activePortal === 'leaders' && <LeadersDashboard />}
        {activePortal === 'members' && <MemberDashboard />}
      </main>
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left">
            <span className="font-semibold text-slate-800">
              ብርብር ከተማ ቃለ ሕይወት ቤተክርስቲያን · ኤዴን ቻፕል
            </span>
            <span className="block text-[11px] text-slate-500 mt-0.5">
              የቻፕሉ አስተባባሪ፡ ወንጌላዊ ገላትያ ደስታ
            </span>
          </div>
          <div className="text-xs text-slate-400">
            © {new Date().getFullYear()} ኤዴን ቻፕል የቤተክርስቲያን መረጃ መቆጣጠሪያ ሲስተም
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ChapelProvider>
      <AppContent />
    </ChapelProvider>
  );
}
