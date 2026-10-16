import React, { useState, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  FileSpreadsheet, 
  CheckCircle, 
  XCircle, 
  Home, 
  Flame, 
  GraduationCap, 
  Briefcase, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckSquare, 
  Calendar, 
  MessageSquare, 
  HeartHandshake, 
  Printer, 
  ShieldCheck, 
  ChevronRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { useChapel } from '../../context/ChapelContext';
import { Member, EducationLevel, Profession, HousingStatus, Gender, AgeGroup } from '../../types/chapel';
import { MemberFormModal } from '../common/MemberFormModal';
import { exportMembersToExcel } from '../../utils/excelHelper';
import { HouseholdHierarchyCard } from '../common/HouseholdHierarchyCard';
import { LeadershipForum } from '../discussion/LeadershipForum';
import { FirebaseSyncBanner } from '../common/FirebaseSyncBanner';
import { AnnualPlan2018Module } from './AnnualPlan2018Module';

type ActiveTab = 'members' | 'annualPlan2018' | 'demographics' | 'plans' | 'reports' | 'feedback' | 'visitations' | 'leadership' | 'forum';

export const CoordinatorDashboard: React.FC = () => {
  const { 
    members, 
    deleteMember, 
    plans, 
    updatePlan, 
    addPlan, 
    deletePlan,
    reports, 
    updateReportStatus, 
    feedbackList, 
    resolveFeedback, 
    visitationRequests, 
    updateVisitationStatus,
    committees,
    updateCommitteePerson,
    addYouthLeader,
    deleteYouthLeader,
    discipleshipGroups
  } = useChapel();

  const [activeTab, setActiveTab] = useState<ActiveTab>('members');
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  // Filters for members table
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState<string>('all');
  const [filterAgeGroup, setFilterAgeGroup] = useState<string>('all');
  const [filterEducation, setFilterEducation] = useState<string>('all');
  const [filterProfession, setFilterProfession] = useState<string>('all');
  const [filterBaptized, setFilterBaptized] = useState<string>('all');
  const [filterTithe, setFilterTithe] = useState<string>('all');
  const [filterLordSupper, setFilterLordSupper] = useState<string>('all');
  const [filterHousing, setFilterHousing] = useState<string>('all');
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [filterPrayerWarrior, setFilterPrayerWarrior] = useState<string>('all');

  // Plan creation modal / state
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [newPlanTitle, setNewPlanTitle] = useState('');
  const [newPlanCategory, setNewPlanCategory] = useState('መንፈሳዊ አገልግሎት');
  const [newPlanQuarter, setNewPlanQuarter] = useState('1ኛ ሩብ ዓመት');
  const [newPlanYear, setNewPlanYear] = useState('2017 ዓ.ም');

  // Youth leader creation state
  const [showAddYouthLeader, setShowAddYouthLeader] = useState(false);
  const [youthName, setYouthName] = useState('');
  const [youthRole, setYouthRole] = useState('');
  const [youthPhone, setYouthPhone] = useState('');

  // Selected member detail view modal
  const [inspectMember, setInspectMember] = useState<Member | null>(null);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = members.length;
    if (total === 0) {
      return {
        total: 0,
        baptized: 0,
        baptizedPct: 0,
        tithe: 0,
        tithePct: 0,
        lordSupper: 0,
        lordSupperPct: 0,
        privateHome: 0,
        privateHomePct: 0,
        rentalHome: 0,
        rentalHomePct: 0,
        prayerWarriors: 0,
        ageStats: {
          '0-14': { male: 0, female: 0, total: 0 },
          '15-29': { male: 0, female: 0, total: 0 },
          '30-59': { male: 0, female: 0, total: 0 },
          '60+': { male: 0, female: 0, total: 0 },
        }
      };
    }

    const baptized = members.filter(m => m.isBaptized).length;
    const tithe = members.filter(m => m.paysTithe).length;
    const lordSupper = members.filter(m => m.participatesLordSupper).length;
    const privateHome = members.filter(m => m.housingStatus === 'የግል').length;
    const rentalHome = members.filter(m => m.housingStatus === 'ክራይ').length;
    const prayerWarriors = members.filter(m => m.isPrayerWarrior).length;

    const ageStats: Record<AgeGroup, { male: number; female: number; total: number }> = {
      '0-14': { male: 0, female: 0, total: 0 },
      '15-29': { male: 0, female: 0, total: 0 },
      '30-59': { male: 0, female: 0, total: 0 },
      '60+': { male: 0, female: 0, total: 0 },
    };

    members.forEach(m => {
      const grp = m.ageGroup || '30-59';
      if (ageStats[grp]) {
        ageStats[grp].total += 1;
        if (m.gender === 'ወንድ') ageStats[grp].male += 1;
        else ageStats[grp].female += 1;
      }
    });

    return {
      total,
      baptized,
      baptizedPct: Math.round((baptized / total) * 100),
      tithe,
      tithePct: Math.round((tithe / total) * 100),
      lordSupper,
      lordSupperPct: Math.round((lordSupper / total) * 100),
      privateHome,
      privateHomePct: Math.round((privateHome / total) * 100),
      rentalHome,
      rentalHomePct: Math.round((rentalHome / total) * 100),
      prayerWarriors,
      ageStats
    };
  }, [members]);

  const [memberViewMode, setMemberViewMode] = useState<'hierarchy' | 'table'>('hierarchy');

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      // Search
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesName = m.fullName.toLowerCase().includes(query);
        const matchesPhone = m.phone.toLowerCase().includes(query);
        const matchesAddress = (m.address || '').toLowerCase().includes(query);
        const matchesCode = (m.familyCode || '').toLowerCase().includes(query);
        const matchesSpouse = (m.spouseName || '').toLowerCase().includes(query);
        const matchesChildren = (m.familyMembers || []).some(f => f.fullName.toLowerCase().includes(query));
        if (!matchesName && !matchesPhone && !matchesAddress && !matchesCode && !matchesSpouse && !matchesChildren) return false;
      }
      // Gender
      if (filterGender !== 'all' && m.gender !== filterGender) return false;
      // Age group
      if (filterAgeGroup !== 'all' && m.ageGroup !== filterAgeGroup) return false;
      // Education
      if (filterEducation !== 'all' && m.educationLevel !== filterEducation) return false;
      // Profession
      if (filterProfession !== 'all' && m.profession !== filterProfession) return false;
      // Baptized
      if (filterBaptized === 'yes' && !m.isBaptized) return false;
      if (filterBaptized === 'no' && m.isBaptized) return false;
      // Tithe
      if (filterTithe === 'yes' && !m.paysTithe) return false;
      if (filterTithe === 'no' && m.paysTithe) return false;
      // Lord's supper
      if (filterLordSupper === 'yes' && !m.participatesLordSupper) return false;
      if (filterLordSupper === 'no' && m.participatesLordSupper) return false;
      // Housing
      if (filterHousing !== 'all' && m.housingStatus !== filterHousing) return false;
      // Group
      if (filterGroup !== 'all' && m.discipleshipGroup !== filterGroup) return false;
      // Prayer warrior
      if (filterPrayerWarrior === 'yes' && !m.isPrayerWarrior) return false;
      if (filterPrayerWarrior === 'no' && m.isPrayerWarrior) return false;

      return true;
    });
  }, [
    members, 
    searchTerm, 
    filterGender, 
    filterAgeGroup, 
    filterEducation, 
    filterProfession, 
    filterBaptized, 
    filterTithe, 
    filterLordSupper, 
    filterHousing, 
    filterGroup, 
    filterPrayerWarrior
  ]);

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanTitle.trim()) return;
    addPlan({
      title: newPlanTitle.trim(),
      targetCategory: newPlanCategory,
      quarter: newPlanQuarter,
      year: newPlanYear,
      progressPercent: 0,
      status: 'በመከናወን ላይ',
      coordinatorApproved: true,
      notes: 'በአስተባባሪው የጸደቀ አዲስ ዕቅድ'
    });
    setNewPlanTitle('');
    setShowAddPlan(false);
  };

  const handleAddYouth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!youthName.trim()) return;
    addYouthLeader({
      name: youthName.trim(),
      role: youthRole.trim() || 'የወጣት አገልጋይ',
      phone: youthPhone.trim() || '0900000000'
    });
    setYouthName('');
    setYouthRole('');
    setYouthPhone('');
    setShowAddYouthLeader(false);
  };

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Coordinator Top Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5 sm:p-6 border border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
                  የቻፕሉ ዋና አስተባባሪ ገጽ
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-emerald-400 font-medium">የተረጋገጠ ሙሉ አስተዳዳሪ</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
                ወንጌላዊ ገላትያ ደስታ
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                ብርብር ከተማ ቃለ ሕይወት ቤተክርስቲያን · ኤዴን ቻፕል አጠቃላይ መቆጣጠሪያ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => {
                setMemberToEdit(null);
                setIsMemberModalOpen(true);
              }}
              className="px-3.5 py-2 text-xs font-medium bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs font-semibold"
            >
              <UserPlus className="w-4 h-4" />
              <span>አዲስ አባል መዝግብ</span>
            </button>

            <button
              onClick={handlePrintSummary}
              className="px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-700"
            >
              <Printer className="w-4 h-4" />
              <span>ሪፖርት አትም</span>
            </button>
          </div>
        </div>
      </div>

      {/* Firebase SDK Cloud Synchronization Banner */}
      <FirebaseSyncBanner />

      {/* KPI Overview Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>ጠቅላላ አባላት</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">{stats.total}</span>
            <span className="text-[11px] text-slate-500">ነፍሳት</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>የተጠመቁ</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700 tabular-nums">{stats.baptized}</span>
            <span className="text-xs text-emerald-600 font-medium tabular-nums">{stats.baptizedPct}%</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>አስራት ከፋይ</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-700 tabular-nums">{stats.tithe}</span>
            <span className="text-xs text-blue-600 font-medium tabular-nums">{stats.tithePct}%</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>የጌታ እራት ተካፋይ</span>
            <HeartHandshake className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-purple-700 tabular-nums">{stats.lordSupper}</span>
            <span className="text-xs text-purple-600 font-medium tabular-nums">{stats.lordSupperPct}%</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>የቤት ሁኔታ</span>
            <Home className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-1 text-xs text-slate-700">
            <div className="flex justify-between">
              <span>የግል:</span>
              <span className="font-semibold tabular-nums">{stats.privateHome} ({stats.privateHomePct}%)</span>
            </div>
            <div className="flex justify-between text-slate-500 mt-0.5">
              <span>ክራይ:</span>
              <span className="tabular-nums">{stats.rentalHome} ({stats.rentalHomePct}%)</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>ጸላያን (የጸሎት ኃይል)</span>
            <Flame className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-700 tabular-nums">{stats.prayerWarriors}</span>
            <span className="text-[11px] text-slate-500">ተመድበዋል</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Inside Coordinator */}
      <div className="border-b border-slate-200">
        <div className="flex items-center gap-1 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'members'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            ሙሉ የአባላት ዝርዝር ({members.length})
          </button>

          <button
            onClick={() => setActiveTab('annualPlan2018')}
            className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'annualPlan2018'
                ? 'border-indigo-600 text-indigo-900 bg-indigo-50/60 shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span>📋 የ2018 ዓ.ም ዕቅድና ሪፖርት (4 ሩብ ዓመት)</span>
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">አዲስ</span>
          </button>

          <button
            onClick={() => setActiveTab('demographics')}
            className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'demographics'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            የዕድሜ ክልልና ትምህርት ስታትስቲክስ
          </button>

          <button
            onClick={() => setActiveTab('plans')}
            className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'plans'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            የቻፕሉ ዕቅድ መከታተያ ({plans.length})
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'reports'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            ሪፖርቶችና ማጽደቂያ ({reports.length})
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'feedback'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            የአባላት አስተያየት ({feedbackList.length})
          </button>

          <button
            onClick={() => setActiveTab('visitations')}
            className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'visitations'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            የቤተ ጉብኝት ጥያቄዎች ({visitationRequests.length})
          </button>

          <button
            onClick={() => setActiveTab('leadership')}
            className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'leadership'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            የመሪዎችና ኮሚቴዎች መዋቅር (7 ዘርፎች)
          </button>

          <button
            onClick={() => setActiveTab('forum')}
            className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'forum'
                ? 'border-amber-600 text-amber-900 bg-amber-50/60'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>💬 የመሪዎች የውይይት መድረክ</span>
            <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded-full font-mono">Live</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MEMBERS ROSTER & FILTERS */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          {/* Multi-Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative grow max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="በስም፣ በስልክ ቁጥር ወይም በአድራሻ ፈልግ..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportMembersToExcel(filteredMembers, `ኤዴን_ቻፕል_የተጣራ_ዝርዝር_${new Date().toISOString().split('T')[0]}.xlsx`)}
                  className="px-3 py-2 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                  <span>ይህን ዝርዝር በኤክሴል አውርድ ({filteredMembers.length})</span>
                </button>

                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterGender('all');
                    setFilterAgeGroup('all');
                    setFilterEducation('all');
                    setFilterProfession('all');
                    setFilterBaptized('all');
                    setFilterTithe('all');
                    setFilterLordSupper('all');
                    setFilterHousing('all');
                    setFilterGroup('all');
                    setFilterPrayerWarrior('all');
                  }}
                  className="px-2.5 py-2 text-xs text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  ማጣሪያዎችን አጽዳ
                </button>
              </div>
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-1 border-t border-slate-100 text-xs">
              {/* Education */}
              <div>
                <label className="text-[11px] text-slate-500 block mb-0.5">የትምህርት ደረጃ</label>
                <select
                  value={filterEducation}
                  onChange={(e) => setFilterEducation(e.target.value)}
                  className="w-full p-1.5 rounded-md border border-slate-200 text-xs bg-slate-50"
                >
                  <option value="all">ሁሉም የትምህርት ደረጃ</option>
                  <option value="መሠረታዊ/ያልተማረ">መሠረታዊ/ያልተማረ</option>
                  <option value="1-8ኛ ክፍል">1-8ኛ ክፍል</option>
                  <option value="9-12ኛ ክፍል">9-12ኛ ክፍል</option>
                  <option value="ሰርተፊኬት">ሰርተፊኬት</option>
                  <option value="ዲፕሎማ">ዲፕሎማ</option>
                  <option value="የመጀመሪያ ዲግሪ">የመጀመሪያ ዲግሪ</option>
                  <option value="ሁለተኛ ዲግሪ (ማስተርስ)">ሁለተኛ ዲግሪ (ማስተርስ)</option>
                  <option value="ዶክትሬት (PhD)">ዶክትሬት (PhD)</option>
                </select>
              </div>

              {/* Profession */}
              <div>
                <label className="text-[11px] text-slate-500 block mb-0.5">የሥራ ዓይነት</label>
                <select
                  value={filterProfession}
                  onChange={(e) => setFilterProfession(e.target.value)}
                  className="w-full p-1.5 rounded-md border border-slate-200 text-xs bg-slate-50"
                >
                  <option value="all">ሁሉም የሥራ ዓይነት</option>
                  <option value="የመንግስት ሰራተኛ">የመንግስት ሰራተኛ</option>
                  <option value="የግል ሰራተኛ">የግል ሰራተኛ</option>
                  <option value="ነጋዴ">ነጋዴ</option>
                  <option value="ገበሬ">ገበሬ</option>
                  <option value="የቀን ሰራተኛ">የቀን ሰራተኛ</option>
                  <option value="ተማሪ">ተማሪ</option>
                  <option value="የቤት እመቤት">የቤት እመቤት</option>
                  <option value="ጡረተኛ">ጡረተኛ</option>
                  <option value="የግል ስራ">የግል ስራ</option>
                  <option value="ሌላ">ሌላ</option>
                </select>
              </div>

              {/* Baptized */}
              <div>
                <label className="text-[11px] text-slate-500 block mb-0.5">ጥምቀት</label>
                <select
                  value={filterBaptized}
                  onChange={(e) => setFilterBaptized(e.target.value)}
                  className="w-full p-1.5 rounded-md border border-slate-200 text-xs bg-slate-50"
                >
                  <option value="all">ሁሉም</option>
                  <option value="yes">የተጠመቀ ብቻ</option>
                  <option value="no">ያልተጠመቀ ብቻ</option>
                </select>
              </div>

              {/* Tithe */}
              <div>
                <label className="text-[11px] text-slate-500 block mb-0.5">አስራት ከፋይ</label>
                <select
                  value={filterTithe}
                  onChange={(e) => setFilterTithe(e.target.value)}
                  className="w-full p-1.5 rounded-md border border-slate-200 text-xs bg-slate-50"
                >
                  <option value="all">ሁሉም</option>
                  <option value="yes">አስራት የሚከፍል</option>
                  <option value="no">የማይከፍል</option>
                </select>
              </div>

              {/* Lord's Supper */}
              <div>
                <label className="text-[11px] text-slate-500 block mb-0.5">የጌታ እራት</label>
                <select
                  value={filterLordSupper}
                  onChange={(e) => setFilterLordSupper(e.target.value)}
                  className="w-full p-1.5 rounded-md border border-slate-200 text-xs bg-slate-50"
                >
                  <option value="all">ሁሉም</option>
                  <option value="yes">የሚካፈል</option>
                  <option value="no">የማይካፈል</option>
                </select>
              </div>

              {/* Housing */}
              <div>
                <label className="text-[11px] text-slate-500 block mb-0.5">የቤት ሁኔታ</label>
                <select
                  value={filterHousing}
                  onChange={(e) => setFilterHousing(e.target.value)}
                  className="w-full p-1.5 rounded-md border border-slate-200 text-xs bg-slate-50"
                >
                  <option value="all">ሁሉም (የግልና ክራይ)</option>
                  <option value="የግል">የግል ቤት</option>
                  <option value="ክራይ">የኪራይ ቤት</option>
                </select>
              </div>

              {/* Discipleship Group */}
              <div>
                <label className="text-[11px] text-slate-500 block mb-0.5">ትምህርት ቡድን</label>
                <select
                  value={filterGroup}
                  onChange={(e) => setFilterGroup(e.target.value)}
                  className="w-full p-1.5 rounded-md border border-slate-200 text-xs bg-slate-50"
                >
                  <option value="all">ሁሉም ቡድኖች</option>
                  {discipleshipGroups.map(g => (
                    <option key={g.id} value={g.name}>{g.name}</option>
                  ))}
                </select>
              </div>

              {/* Prayer Warrior */}
              <div>
                <label className="text-[11px] text-slate-500 block mb-0.5">ጸላያን በቡድኑ</label>
                <select
                  value={filterPrayerWarrior}
                  onChange={(e) => setFilterPrayerWarrior(e.target.value)}
                  className="w-full p-1.5 rounded-md border border-slate-200 text-xs bg-slate-50"
                >
                  <option value="all">ሁሉም</option>
                  <option value="yes">ጸላይ የሆኑ ብቻ</option>
                  <option value="no">ጸላይ ያልሆኑ</option>
                </select>
              </div>

              {/* Age Bracket */}
              <div>
                <label className="text-[11px] text-slate-500 block mb-0.5">የዕድሜ ክልል</label>
                <select
                  value={filterAgeGroup}
                  onChange={(e) => setFilterAgeGroup(e.target.value)}
                  className="w-full p-1.5 rounded-md border border-slate-200 text-xs bg-slate-50"
                >
                  <option value="all">ሁሉም ዕድሜ</option>
                  <option value="0-14">0-14 (ህፃናት)</option>
                  <option value="15-29">15-29 (ወጣቶች)</option>
                  <option value="30-59">30-59 (ጎልማሶች)</option>
                  <option value="60+">60+ (አረጋውያን)</option>
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="text-[11px] text-slate-500 block mb-0.5">ጾታ</label>
                <select
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                  className="w-full p-1.5 rounded-md border border-slate-200 text-xs bg-slate-50"
                >
                  <option value="all">ሁሉም ጾታ</option>
                  <option value="ወንድ">ወንድ</option>
                  <option value="ሴት">ሴት</option>
                </select>
              </div>
            </div>
          </div>

          {/* View Mode Toggle Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-800 text-xs">
                የተገኙ አባላት፡ <span className="tabular-nums font-bold text-slate-900">{filteredMembers.length}</span> / {members.length}
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500 text-[11px]">
                የአባወራ፣ የእማወራና የልጆች መረጃ በዝርዝር
              </span>
            </div>

            {/* View Switcher Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setMemberViewMode('hierarchy')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  memberViewMode === 'hierarchy' 
                    ? 'bg-slate-900 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>📋 የቤተሰብ ዝርዝር (አባወራ፣ እማወራ፣ ልጆች)</span>
              </button>
              <button
                type="button"
                onClick={() => setMemberViewMode('table')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  memberViewMode === 'table' 
                    ? 'bg-slate-900 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>📊 ሠንጠረዥ እይታ</span>
              </button>
            </div>
          </div>

          {filteredMembers.length === 0 ? (
            <div className="p-8 text-center space-y-2 bg-white rounded-xl border border-slate-200">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-medium text-slate-700">በተመረጠው ማጣሪያ ምንም አባል አልተገኘም</p>
              <p className="text-xs text-slate-500">እባክዎ ማጣሪያዎቹን ይቀይሩ ወይም አዲስ አባል ይመዝግቡ</p>
            </div>
          ) : memberViewMode === 'hierarchy' ? (
            <div className="space-y-4">
              {filteredMembers.map((m) => (
                <HouseholdHierarchyCard
                  key={m.id}
                  member={m}
                  onEdit={(mem) => {
                    setMemberToEdit(mem);
                    setIsMemberModalOpen(true);
                  }}
                  onDelete={(id) => deleteMember(id)}
                  canManage={true}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/75 text-slate-700 border-b border-slate-200">
                      <th className="py-2.5 px-3 font-semibold">መለያ ኮድ</th>
                      <th className="py-2.5 px-3 font-semibold">ሙሉ ስም (አባወራ)</th>
                      <th className="py-2.5 px-3 font-semibold">እማወራ (ባለቤት)</th>
                      <th className="py-2.5 px-3 font-semibold">ጾታ / ዕድሜ</th>
                      <th className="py-2.5 px-3 font-semibold">ስልክ ቁጥር</th>
                      <th className="py-2.5 px-3 font-semibold">የትምህርት ደረጃ</th>
                      <th className="py-2.5 px-3 font-semibold">የሥራ ዓይነት</th>
                      <th className="py-2.5 px-3 font-semibold text-center">ጥምቀት</th>
                      <th className="py-2.5 px-3 font-semibold text-center">አስራት</th>
                      <th className="py-2.5 px-3 font-semibold text-center">የጌታ እራት</th>
                      <th className="py-2.5 px-3 font-semibold">የቤት ሁኔታ</th>
                      <th className="py-2.5 px-3 font-semibold">መንፈሳዊ ቡድን</th>
                      <th className="py-2.5 px-3 font-semibold text-center">ጸላይ</th>
                      <th className="py-2.5 px-3 font-semibold text-right">እርምጃዎች</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMembers.map((m) => {
                      const spouseObj = m.familyMembers?.find(f => f.relation === 'ባለቤት' || f.relation?.includes('ባለቤት'));
                      const spouseDisplayName = spouseObj?.fullName || m.spouseName || '-';

                      return (
                        <tr 
                          key={m.id} 
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="py-2.5 px-3 font-mono font-bold text-amber-700 whitespace-nowrap">
                            <span className="bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              {m.familyCode || 'eden101'}
                            </span>
                          </td>

                          <td className="py-2.5 px-3">
                            <button
                              onClick={() => setInspectMember(m)}
                              className="font-semibold text-slate-900 hover:text-amber-800 text-left cursor-pointer"
                            >
                              {m.fullName}
                            </button>
                            {m.familyMembers && m.familyMembers.length > 0 && (
                              <span className="block text-[10px] text-slate-500">
                                + {m.familyMembers.length} ቤተሰብ
                              </span>
                            )}
                          </td>

                          <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                            {spouseDisplayName}
                          </td>

                        <td className="py-2.5 px-3 whitespace-nowrap text-slate-600">
                          <span>{m.gender}</span>
                          <span className="mx-1 text-slate-400">·</span>
                          <span className="font-mono tabular-nums">{m.age} ዓመት</span>
                          <span className="block text-[10px] text-slate-500 font-mono">[{m.ageGroup}]</span>
                        </td>

                        <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap tabular-nums">
                          {m.phone}
                        </td>

                        <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                          {m.educationLevel}
                        </td>

                        <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                          {m.profession}
                        </td>

                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          {m.isBaptized ? (
                            <span className="text-emerald-700 font-medium">አዎ</span>
                          ) : (
                            <span className="text-slate-400">አይደለም</span>
                          )}
                        </td>

                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          {m.paysTithe ? (
                            <span className="text-blue-700 font-medium">አዎ</span>
                          ) : (
                            <span className="text-slate-400">አይደለም</span>
                          )}
                        </td>

                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          {m.participatesLordSupper ? (
                            <span className="text-purple-700 font-medium">አዎ</span>
                          ) : (
                            <span className="text-slate-400">አይደለም</span>
                          )}
                        </td>

                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className={`text-[11px] font-medium ${m.housingStatus === 'የግል' ? 'text-emerald-800' : 'text-amber-800'}`}>
                            {m.housingStatus === 'የግል' ? 'የግል ቤት' : 'የኪራይ ቤት'}
                          </span>
                        </td>

                        <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                          {m.discipleshipGroup}
                        </td>

                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          {m.isPrayerWarrior ? (
                            <span className="text-rose-700 font-semibold flex items-center justify-center gap-1">
                              <Flame className="w-3 h-3" />
                              <span>አዎ</span>
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>

                        <td className="py-2.5 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setMemberToEdit(m);
                                setIsMemberModalOpen(true);
                              }}
                              title="አርም"
                              className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-md cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteMember(m.id)}
                              title="ሰርዝ"
                              className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-md cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

      {/* 2018 SPIRITUAL SECTOR ANNUAL & 4-QUARTER PLAN & REPORT MODULE */}
      {activeTab === 'annualPlan2018' && (
        <AnnualPlan2018Module />
      )}

      {/* TAB 2: DEMOGRAPHICS (AGE BRACKETS 0-14, 15-29, 30-59, 60+ & EDUCATION) */}
      {activeTab === 'demographics' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                የአባላት የዕድሜ ክልል ዝርዝር (በወንድና በሴት የተከፋፈለ)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                በቻፕሉ ጥናት መሠረት የተደራጀ የዕድሜ ምድቦች ስታትስቲክስ
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 0-14 Children */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">ከ0 - 14 ዓመት (ህፃናት)</span>
                  <span className="text-lg font-bold text-slate-900 tabular-nums">
                    {stats.ageStats['0-14'].total}
                  </span>
                </div>
                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>ወንድ ህፃናት:</span>
                    <span className="font-semibold text-slate-900 tabular-nums">{stats.ageStats['0-14'].male}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>ሴት ህፃናት:</span>
                    <span className="font-semibold text-slate-900 tabular-nums">{stats.ageStats['0-14'].female}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setFilterAgeGroup('0-14');
                    setActiveTab('members');
                  }}
                  className="mt-3 w-full py-1.5 text-center text-[11px] font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  ዝርዝሩን አሳይ
                </button>
              </div>

              {/* 15-29 Youth */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">ከ15 - 29 ዓመት (ወጣቶች)</span>
                  <span className="text-lg font-bold text-slate-900 tabular-nums">
                    {stats.ageStats['15-29'].total}
                  </span>
                </div>
                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>ወንድ ወጣቶች:</span>
                    <span className="font-semibold text-slate-900 tabular-nums">{stats.ageStats['15-29'].male}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>ሴት ወጣቶች:</span>
                    <span className="font-semibold text-slate-900 tabular-nums">{stats.ageStats['15-29'].female}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setFilterAgeGroup('15-29');
                    setActiveTab('members');
                  }}
                  className="mt-3 w-full py-1.5 text-center text-[11px] font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  ዝርዝሩን አሳይ
                </button>
              </div>

              {/* 30-59 Adults */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">ከ30 - 59 ዓመት (ጎልማሶች)</span>
                  <span className="text-lg font-bold text-slate-900 tabular-nums">
                    {stats.ageStats['30-59'].total}
                  </span>
                </div>
                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>ወንድ ጎልማሶች:</span>
                    <span className="font-semibold text-slate-900 tabular-nums">{stats.ageStats['30-59'].male}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>ሴት ጎልማሶች:</span>
                    <span className="font-semibold text-slate-900 tabular-nums">{stats.ageStats['30-59'].female}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setFilterAgeGroup('30-59');
                    setActiveTab('members');
                  }}
                  className="mt-3 w-full py-1.5 text-center text-[11px] font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  ዝርዝሩን አሳይ
                </button>
              </div>

              {/* 60+ Elders */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">ከ60 ዓመት በላይ (አረጋውያን)</span>
                  <span className="text-lg font-bold text-slate-900 tabular-nums">
                    {stats.ageStats['60+'].total}
                  </span>
                </div>
                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>ወንድ አረጋውያን:</span>
                    <span className="font-semibold text-slate-900 tabular-nums">{stats.ageStats['60+'].male}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>ሴት አረጋውያን:</span>
                    <span className="font-semibold text-slate-900 tabular-nums">{stats.ageStats['60+'].female}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setFilterAgeGroup('60+');
                    setActiveTab('members');
                  }}
                  className="mt-3 w-full py-1.5 text-center text-[11px] font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  ዝርዝሩን አሳይ
                </button>
              </div>
            </div>
          </div>

          {/* Education Breakdown Grid */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-slate-600" />
              <span>የትምህርት ደረጃ ስርጭት</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                'መሠረታዊ/ያልተማረ',
                '1-8ኛ ክፍል',
                '9-12ኛ ክፍል',
                'ሰርተፊኬት',
                'ዲፕሎማ',
                'የመጀመሪያ ዲግሪ',
                'ሁለተኛ ዲግሪ (ማስተርስ)',
                'ዶክትሬት (PhD)'
              ].map(level => {
                const count = members.filter(m => m.educationLevel === level).length;
                const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={level} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-xs text-slate-600 block truncate">{level}</span>
                    <div className="mt-1 flex items-baseline justify-between">
                      <span className="text-lg font-bold text-slate-900 tabular-nums">{count}</span>
                      <span className="text-xs text-slate-500 tabular-nums">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CHAPEL STRATEGIC PLANS */}
      {activeTab === 'plans' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">የኤዴን ቻፕል ዕቅድ መከታተያ</h3>
              <p className="text-xs text-slate-500">የሩብ ዓመትና የዓመቱ ስልታዊ እቅዶች አፈፃፀም</p>
            </div>
            <button
              onClick={() => setShowAddPlan(true)}
              className="px-3.5 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>አዲስ ዕቅድ መዝግብ</span>
            </button>
          </div>

          {/* Add Plan Form if toggled */}
          {showAddPlan && (
            <form onSubmit={handleCreatePlan} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-800">አዲስ የቻፕል ዕቅድ ማካተት</h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-600 block mb-1">የዕቅዱ ርዕስ *</label>
                  <input
                    type="text"
                    required
                    value={newPlanTitle}
                    onChange={(e) => setNewPlanTitle(e.target.value)}
                    placeholder="ለምሳሌ፡ የአዳዲስ አማኞች የጥምቀት ስልጠና"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">ዘርፍ / ምድብ</label>
                  <input
                    type="text"
                    value={newPlanCategory}
                    onChange={(e) => setNewPlanCategory(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">ሩብ ዓመት / ዓ.ም</label>
                  <div className="grid grid-cols-2 gap-1">
                    <input
                      type="text"
                      value={newPlanQuarter}
                      onChange={(e) => setNewPlanQuarter(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                    />
                    <input
                      type="text"
                      value={newPlanYear}
                      onChange={(e) => setNewPlanYear(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-mono"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddPlan(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  ሰርዝ
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs text-white bg-slate-900 rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  ዕቅዱን መዝግብ
                </button>
              </div>
            </form>
          )}

          {/* Plans List */}
          <div className="space-y-3">
            {plans.map((p) => (
              <div key={p.id} className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500">{p.quarter} · {p.year}</span>
                      <span className="text-xs text-slate-300">|</span>
                      <span className="text-xs text-slate-600">{p.targetCategory}</span>
                      {p.coordinatorApproved ? (
                        <span className="text-xs text-emerald-700 font-medium">በአስተባባሪው የጸደቀ</span>
                      ) : (
                        <span className="text-xs text-amber-700 font-medium">በመጠባበቅ ላይ</span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{p.title}</h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-800 tabular-nums">{p.progressPercent}% አፈፃፀም</span>
                    <button
                      onClick={() => updatePlan(p.id, { coordinatorApproved: !p.coordinatorApproved })}
                      className={`px-2.5 py-1 text-xs rounded-md border font-medium cursor-pointer ${
                        p.coordinatorApproved
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      {p.coordinatorApproved ? 'ጸድቋል ✓' : 'አጽድቅ'}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('ይህን ዕቅድ መሰረዝ ይፈልጋሉ?')) deletePlan(p.id);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-md cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${p.progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>{p.notes}</span>
                  <div className="flex items-center gap-1">
                    <span>አፈፃፀም ቀይር፡</span>
                    {[25, 50, 75, 100].map(pct => (
                      <button
                        key={pct}
                        onClick={() => updatePlan(p.id, { 
                          progressPercent: pct, 
                          status: pct === 100 ? 'የተጠናቀቀ' : 'በመከናወን ላይ' 
                        })}
                        className="px-1.5 py-0.5 text-[10px] bg-slate-100 hover:bg-slate-200 rounded-md font-mono tabular-nums cursor-pointer"
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CHAPEL REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">ከመሪዎች የቀረቡ ሪፖርቶች</h3>
            <p className="text-xs text-slate-500">የአገልግሎት ክፍሎች ያቀረቧቸውን ሪፖርቶች መመልከትና ማጽደቅ</p>
          </div>

          <div className="space-y-3">
            {reports.map((r) => (
              <div key={r.id} className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900">{r.submittedBy}</span>
                      <span className="text-xs text-slate-500">({r.submitterRole})</span>
                      <span className="text-xs text-slate-300">·</span>
                      <span className="text-xs text-slate-500 font-mono">{r.dateSubmitted}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{r.title}</h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 text-xs rounded-md font-medium border ${
                      r.status === 'የጸደቀ'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : r.status === 'ማስተካከያ የቀረበበት'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {r.status}
                    </span>

                    <button
                      onClick={() => updateReportStatus(r.id, 'የጸደቀ', 'በአስተባባሪው ወንጌላዊ ገላትያ ደስታ ጸድቋል')}
                      className="px-3 py-1 text-xs font-medium bg-emerald-700 hover:bg-emerald-800 text-white rounded-md cursor-pointer"
                    >
                      አጽድቅ ✓
                    </button>

                    <button
                      onClick={() => updateReportStatus(r.id, 'ማስተካከያ የቀረበበት', 'ተጨማሪ ማብራሪያ ያስፈልገዋል')}
                      className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer"
                    >
                      ማስተካከያ ጠይቅ
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-800 block mb-1">አጠቃላይ ማጠቃለያና የተከናወኑ ስራዎች</span>
                    <p className="text-slate-600 leading-relaxed">{r.summary}</p>
                    <p className="text-emerald-800 mt-1 font-medium">{r.achievements}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-800 block mb-1">ያጋጠሙ ተግዳሮቶችና ማስታወሻ</span>
                    <p className="text-slate-600 leading-relaxed">{r.challenges || 'ምንም አልተጠቀሰም'}</p>
                    {r.feedbackNotes && (
                      <p className="text-blue-800 mt-2 font-medium border-t border-slate-200 pt-1">
                        የአስተባባሪው ምላሽ፡ {r.feedbackNotes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: MEMBER FEEDBACK */}
      {activeTab === 'feedback' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">የአባላት አስተያየትና ጥቆማዎች</h3>
            <p className="text-xs text-slate-500">አባላት የሰጡትን አስተያየት መከታተልና ተፈጻሚ ማድረግ</p>
          </div>

          <div className="space-y-3">
            {feedbackList.map((fb) => (
              <div key={fb.id} className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-slate-900">{fb.memberName}</span>
                      <span className="text-slate-500 font-mono">{fb.memberPhone}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-400 font-mono">{fb.date}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{fb.subject}</h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs rounded-md font-medium border ${
                      fb.status === 'ተፈጻሚ ሆኗል'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {fb.status}
                    </span>

                    {fb.status !== 'ተፈጻሚ ሆኗል' && (
                      <button
                        onClick={() => {
                          const note = prompt('የተወሰደውን እርምጃ ይፃፉ:', 'ተገቢው እርምጃ ተወስዶ ተፈጻሚ ሆኗል');
                          if (note) resolveFeedback(fb.id, 'ተፈጻሚ ሆኗል', note);
                        }}
                        className="px-3 py-1 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md cursor-pointer"
                      >
                        ተፈጻሚ ሆነ ብለህ መዝግብ
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {fb.message}
                </p>

                {fb.actionTakenNotes && (
                  <p className="text-xs text-emerald-800 font-medium pt-1">
                    ✓ የተወሰደ እርምጃ፡ {fb.actionTakenNotes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: VISITATION REQUESTS */}
      {activeTab === 'visitations' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">የቤተ ጉብኝት ጥያቄዎች</h3>
            <p className="text-xs text-slate-500">የአባላት የቤት ለቤት ጸሎትና ጉብኝት ጥሪዎች</p>
          </div>

          <div className="space-y-3">
            {visitationRequests.map((vis) => (
              <div key={vis.id} className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-slate-900">{vis.memberName}</span>
                      <span className="text-slate-500 font-mono">{vis.memberPhone}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-amber-800 font-medium">ምክንያት፡ {vis.reason}</span>
                      {vis.urgency === 'አስቸኳይ' && (
                        <span className="text-rose-700 font-bold">አስቸኳይ!</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1">አድራሻ፡ {vis.address}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs rounded-md font-medium border ${
                      vis.status === 'ተጎብኝቷል'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {vis.status}
                    </span>

                    {vis.status !== 'ተጎብኝቷል' && (
                      <button
                        onClick={() => {
                          const team = prompt('የተመደበው አገልጋይ ወይም ኮሚቴ ስም:', 'የአባቶች መሪዎችና ወንጌላዊ');
                          if (team) updateVisitationStatus(vis.id, 'ተጎብኝቷል', team);
                        }}
                        className="px-3 py-1 text-xs font-medium text-white bg-emerald-800 hover:bg-emerald-900 rounded-md cursor-pointer"
                      >
                        ተጎብኝቷል ብለህ መዝግብ
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs text-slate-700">
                  <p>{vis.details}</p>
                  {vis.assignedTeam && (
                    <p className="mt-1 font-semibold text-slate-900">
                      የተመደበ ቡድን፡ {vis.assignedTeam}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: LEADERSHIP COMMITTEES STRUCTURE */}
      {activeTab === 'leadership' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">የኤዴን ቻፕል የመሪዎችና ኮሚቴዎች መዋቅር</h3>
              <p className="text-xs text-slate-500">የአባቶች፣ ሴቶች፣ ወጣቶች፣ ልጆች፣ ዲያቆናት፣ እርቅና ወንጌል ኮሚቴዎች</p>
            </div>
            <button
              onClick={() => setShowAddYouthLeader(true)}
              className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>የወጣት መሪ ጨምር</span>
            </button>
          </div>

          {/* Add youth leader slot modal if opened */}
          {showAddYouthLeader && (
            <form onSubmit={handleAddYouth} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-800">አዲስ የወጣት መሪ ቦታ ማካተት</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-600 block mb-1">ስም *</label>
                  <input
                    type="text"
                    required
                    value={youthName}
                    onChange={(e) => setYouthName(e.target.value)}
                    placeholder="ለምሳሌ፡ ዳንኤል እየብ"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">የአገልግሎት ኃላፊነት *</label>
                  <input
                    type="text"
                    required
                    value={youthRole}
                    onChange={(e) => setYouthRole(e.target.value)}
                    placeholder="ለምሳሌ፡ የዝማሬ አስተባባሪ"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">ስልክ ቁጥር</label>
                  <input
                    type="tel"
                    value={youthPhone}
                    onChange={(e) => setYouthPhone(e.target.value)}
                    placeholder="0912345678"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddYouthLeader(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  ሰርዝ
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs text-white bg-slate-900 rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  መሪውን መዝግብ
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {committees.map((comm) => (
              <div key={comm.id} className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                <div className="border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-sm text-slate-900">{comm.title}</h4>
                  <p className="text-xs text-slate-500">{comm.description}</p>
                </div>

                <div className="space-y-2">
                  {comm.members.map((person, idx) => (
                    <div 
                      key={person.id} 
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100/70 transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-mono text-[10px] shrink-0 font-bold">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="font-semibold text-slate-900">{person.name}</span>
                          <span className="text-slate-500 ml-1.5">({person.role})</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a 
                          href={`tel:${person.phone}`} 
                          className="font-mono text-slate-700 hover:text-amber-800 tabular-nums text-[11px]"
                        >
                          {person.phone}
                        </a>
                        {comm.id === 'youth' && (
                          <button
                            onClick={() => deleteYouthLeader(person.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: LEADERSHIP FORUM (DISCUSSIONS) */}
      {activeTab === 'forum' && (
        <LeadershipForum currentPortal="coordinator" />
      )}

      {/* Member Form Modal (Add / Edit) */}
      <MemberFormModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        memberToEdit={memberToEdit}
      />

      {/* Member Details Modal */}
      {inspectMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{inspectMember.fullName}</h3>
                <p className="text-xs text-slate-500">የአባል ሙሉ መረጃ ካርድ</p>
              </div>
              <button
                onClick={() => setInspectMember(null)}
                className="text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">ጾታና ዕድሜ</span>
                <span className="font-semibold text-slate-900">{inspectMember.gender} · {inspectMember.age} ዓመት ({inspectMember.ageGroup})</span>
              </div>
              <div>
                <span className="text-slate-500 block">ስልክ ቁጥር</span>
                <span className="font-mono font-semibold text-slate-900">{inspectMember.phone}</span>
              </div>
              <div>
                <span className="text-slate-500 block">የትምህርት ደረጃ</span>
                <span className="font-semibold text-slate-900">{inspectMember.educationLevel}</span>
              </div>
              <div>
                <span className="text-slate-500 block">የሥራ ዓይነት</span>
                <span className="font-semibold text-slate-900">{inspectMember.profession}</span>
              </div>
              <div>
                <span className="text-slate-500 block">የቤት ሁኔታ</span>
                <span className="font-semibold text-slate-900">{inspectMember.housingStatus === 'የግል' ? 'የግል ቤት' : 'የኪራይ ቤት'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">የመንፈሳዊ ቡድን</span>
                <span className="font-semibold text-slate-900">{inspectMember.discipleshipGroup}</span>
              </div>
              <div>
                <span className="text-slate-500 block">የአገልግሎት ዘርፍ</span>
                <span className="font-semibold text-slate-900">{inspectMember.ministryDepartment}</span>
              </div>
              <div>
                <span className="text-slate-500 block">በቡድኑ ያለ ጸላይ</span>
                <span className="font-semibold text-slate-900">{inspectMember.isPrayerWarrior ? 'አዎ (ጸላይ)' : 'አይደለም'}</span>
              </div>
            </div>

            {/* Spiritual checklist */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs flex justify-between">
              <span>ጥምቀት፡ {inspectMember.isBaptized ? '✓ የተጠመቀ' : '✗ ያልተጠመቀ'}</span>
              <span>አስራት፡ {inspectMember.paysTithe ? '✓ ይከፍላል' : '✗ አይከፍልም'}</span>
              <span>የጌታ እራት፡ {inspectMember.participatesLordSupper ? '✓ ይካፈላል' : '✗ አይካፈልም'}</span>
            </div>

            {/* Family members */}
            {inspectMember.familyMembers && inspectMember.familyMembers.length > 0 && (
              <div className="border-t border-slate-100 pt-3 text-xs space-y-1">
                <span className="font-semibold text-slate-800">የቤተሰብ አባላት ({inspectMember.familyMembers.length}):</span>
                {inspectMember.familyMembers.map(f => (
                  <div key={f.id} className="flex justify-between text-slate-600 bg-slate-50 p-1.5 rounded">
                    <span>{f.fullName} ({f.relation})</span>
                    <span>{f.gender} · {f.age} ዓመት</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setMemberToEdit(inspectMember);
                  setInspectMember(null);
                  setIsMemberModalOpen(true);
                }}
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                መረጃውን አርም
              </button>
              <button
                onClick={() => setInspectMember(null)}
                className="px-3 py-1.5 text-xs text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ዝጋ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
