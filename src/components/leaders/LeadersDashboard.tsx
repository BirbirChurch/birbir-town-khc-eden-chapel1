import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  FileText, 
  GraduationCap, 
  Plus, 
  Edit3, 
  Send, 
  Search, 
  Clock, 
  MapPin, 
  CheckCircle, 
  AlertCircle,
  MessageSquare,
  Calendar,
  Flame,
  Award
} from 'lucide-react';
import { useChapel } from '../../context/ChapelContext';
import { Member } from '../../types/chapel';
import { MemberFormModal } from '../common/MemberFormModal';
import { HouseholdHierarchyCard } from '../common/HouseholdHierarchyCard';
import { LeadershipForum } from '../discussion/LeadershipForum';
import { FirebaseSyncBanner } from '../common/FirebaseSyncBanner';

type LeaderTab = 'members' | 'groups' | 'reports' | 'plans' | 'feedback' | 'forum';

export const LeadersDashboard: React.FC = () => {
  const { 
    members, 
    discipleshipGroups, 
    addDiscipleshipGroup, 
    updateDiscipleshipGroup,
    plans, 
    reports, 
    addReport, 
    feedbackList, 
    resolveFeedback,
    committees
  } = useChapel();

  const [activeTab, setActiveTab] = useState<LeaderTab>('members');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [filterEducation, setFilterEducation] = useState<string>('all');

  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  // New report form state
  const [showNewReport, setShowNewReport] = useState(false);
  const [repTitle, setRepTitle] = useState('');
  const [repSubmitter, setRepSubmitter] = useState('አቶ ዳዊት ጫመቶ');
  const [repRole, setRepRole] = useState('ሰብሳቢ');
  const [repCategory, setRepCategory] = useState('የአባቶች አገልግሎት');
  const [repPeriod, setRepPeriod] = useState('ጥቅምት 2017 ዓ.ም');
  const [repSummary, setRepSummary] = useState('');
  const [repAchievements, setRepAchievements] = useState('');
  const [repChallenges, setRepChallenges] = useState('');

  // New group form state
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupLeader, setGroupLeader] = useState('');
  const [groupLeaderPhone, setGroupLeaderPhone] = useState('');
  const [groupMeetingDay, setGroupMeetingDay] = useState('');
  const [groupLocation, setGroupLocation] = useState('');
  const [groupDesc, setGroupDesc] = useState('');

  const [memberViewMode, setMemberViewMode] = useState<'hierarchy' | 'cards'>('hierarchy');

  const filteredMembers = members.filter(m => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchesName = m.fullName.toLowerCase().includes(q);
      const matchesPhone = m.phone.toLowerCase().includes(q);
      const matchesCode = (m.familyCode || '').toLowerCase().includes(q);
      const matchesSpouse = (m.spouseName || '').toLowerCase().includes(q);
      const matchesChildren = (m.familyMembers || []).some(f => f.fullName.toLowerCase().includes(q));
      if (!matchesName && !matchesPhone && !matchesCode && !matchesSpouse && !matchesChildren) return false;
    }
    if (filterGroup !== 'all' && m.discipleshipGroup !== filterGroup) return false;
    if (filterEducation !== 'all' && m.educationLevel !== filterEducation) return false;
    return true;
  });

  const [reportSuccess, setReportSuccess] = useState(false);

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repTitle.trim() || !repSummary.trim()) return;

    addReport({
      title: repTitle.trim(),
      submittedBy: repSubmitter.trim(),
      submitterRole: repRole.trim(),
      category: repCategory.trim(),
      period: repPeriod.trim(),
      summary: repSummary.trim(),
      achievements: repAchievements.trim(),
      challenges: repChallenges.trim()
    });

    setRepTitle('');
    setRepSummary('');
    setRepAchievements('');
    setRepChallenges('');
    setShowNewReport(false);
    setReportSuccess(true);
    setTimeout(() => setReportSuccess(false), 5000);
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    addDiscipleshipGroup({
      name: groupName.trim(),
      leaderName: groupLeader.trim() || 'ያልተመደበ',
      leaderPhone: groupLeaderPhone.trim() || '0900000000',
      meetingDay: groupMeetingDay.trim() || 'በየሳምንቱ',
      location: groupLocation.trim() || 'ብርብር',
      description: groupDesc.trim() || 'የመጽሐፍ ቅዱስ ጥናት'
    });

    setGroupName('');
    setGroupLeader('');
    setGroupLeaderPhone('');
    setGroupMeetingDay('');
    setGroupLocation('');
    setGroupDesc('');
    setShowNewGroup(false);
  };

  return (
    <div className="space-y-6">
      {/* Leaders Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5 sm:p-6 border border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
                  የኤዴን ቻፕል መሪዎች ገጽ
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-300">አመራርና አደረጃጀት</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
                የአባቶች፣ ሴቶችና ኮሚቴዎች መቆጣጠሪያ
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                የአባላት መረጃ ማረም፣ የትምህርት ቡድኖች፣ ሪፖርት ማዘጋጀትና የአስተያየት ክትትል
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMemberToEdit(null);
                setIsMemberModalOpen(true);
              }}
              className="px-3.5 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>አዲስ አባል ጨምር</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('reports');
                setShowNewReport(true);
              }}
              className="px-3.5 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-700"
            >
              <Send className="w-4 h-4" />
              <span>ሪፖርት አዘጋጅ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Firebase SDK Cloud Synchronization Banner */}
      <FirebaseSyncBanner />

      {/* Success Notification */}
      {reportSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-xs sm:text-sm font-medium">
            ሪፖርቱ ለአስተባባሪው (ወንጌላዊ ገላትያ ደስታ) በተሳካ ሁኔታ ተልኳል! በአስተባባሪው ገጽ ላይ ለማጽደቅ ቀርቧል።
          </p>
        </div>
      )}

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 block">የቻፕሉ አባላት</span>
          <span className="text-2xl font-bold text-slate-900 tabular-nums mt-1 block">{members.length}</span>
          <span className="text-[11px] text-slate-500">ሙሉ ዝርዝር</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 block">የትምህርት ቡድኖች</span>
          <span className="text-2xl font-bold text-blue-700 tabular-nums mt-1 block">{discipleshipGroups.length}</span>
          <span className="text-[11px] text-slate-500">በየመንደሩ</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 block">በአፈፃፀም ላይ ያሉ ዕቅዶች</span>
          <span className="text-2xl font-bold text-emerald-700 tabular-nums mt-1 block">
            {plans.filter(p => p.status === 'በመከናወን ላይ').length}
          </span>
          <span className="text-[11px] text-slate-500">የሩብ ዓመት</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 block">የቀረቡ አስተያየቶች</span>
          <span className="text-2xl font-bold text-amber-700 tabular-nums mt-1 block">{feedbackList.length}</span>
          <span className="text-[11px] text-slate-500">ከአባላት</span>
        </div>
      </div>

      {/* Nav Tabs */}
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
            የአባላት መረጃ ማረምና መቆጣጠር ({filteredMembers.length})
          </button>

          <button
            onClick={() => setActiveTab('groups')}
            className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'groups'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            የመንፈሳዊ ትምህርት ቡድኖች ({discipleshipGroups.length})
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'reports'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            ሪፖርት ማዘጋጀትና መላክ ({reports.length})
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
            onClick={() => setActiveTab('feedback')}
            className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'feedback'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            የአባላት አስተያየት ክትትል ({feedbackList.length})
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

      {/* TAB 1: MEMBERS MANAGEMENT FOR LEADERS */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-3 justify-between">
            <div className="relative grow max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="በስም ወይም በስልክ ፈልግ..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                value={filterGroup}
                onChange={(e) => setFilterGroup(e.target.value)}
                className="p-2 rounded-lg border border-slate-200 bg-slate-50"
              >
                <option value="all">ሁሉም ቡድኖች</option>
                {discipleshipGroups.map(g => (
                  <option key={g.id} value={g.name}>{g.name}</option>
                ))}
              </select>

              <select
                value={filterEducation}
                onChange={(e) => setFilterEducation(e.target.value)}
                className="p-2 rounded-lg border border-slate-200 bg-slate-50"
              >
                <option value="all">ሁሉም የትምህርት ደረጃ</option>
                <option value="መሠረታዊ/ያልተማረ">መሠረታዊ/ያልተማረ</option>
                <option value="1-8ኛ ክፍል">1-8ኛ ክፍል</option>
                <option value="9-12ኛ ክፍል">9-12ኛ ክፍል</option>
                <option value="ሰርተፊኬት">ሰርተፊኬት</option>
                <option value="ዲፕሎማ">ዲፕሎማ</option>
                <option value="የመጀመሪያ ዲግሪ">የመጀመሪያ ዲግሪ</option>
                <option value="ሁለተኛ ዲግሪ (ማስተርስ)">ሁለተኛ ዲግሪ (ማስተርስ)</option>
              </select>
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
                onClick={() => setMemberViewMode('cards')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  memberViewMode === 'cards' 
                    ? 'bg-slate-900 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🗂️ አጭር ካርዶች</span>
              </button>
            </div>
          </div>

          {filteredMembers.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-2">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-medium text-slate-700">ምንም አባል አልተገኘም</p>
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
                  canManage={true}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredMembers.map((m) => (
                <div 
                  key={m.id}
                  className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                          {m.familyCode || 'eden101'}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900">{m.fullName}</h4>
                      </div>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{m.phone}</p>
                    </div>
                    <button
                      onClick={() => {
                        setMemberToEdit(m);
                        setIsMemberModalOpen(true);
                      }}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md border border-blue-200 cursor-pointer text-xs flex items-center gap-1 font-medium"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>አርም</span>
                    </button>
                  </div>

                  <div className="text-xs space-y-1 text-slate-600 border-t border-slate-100 pt-2">
                    <div className="flex justify-between">
                      <span>የትምህርት ደረጃ:</span>
                      <span className="font-semibold text-slate-800">{m.educationLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>የሥራ ዓይነት:</span>
                      <span className="font-semibold text-slate-800">{m.profession}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ቡድን:</span>
                      <span className="font-semibold text-slate-800">{m.discipleshipGroup}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>የቤት ሁኔታ:</span>
                      <span className="font-semibold text-slate-800">{m.housingStatus === 'የግል' ? 'የግል ቤት' : 'የኪራይ ቤት'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                    <span className={m.isBaptized ? 'text-emerald-700 font-medium' : 'text-slate-400'}>
                      {m.isBaptized ? '✓ የተጠመቀ' : '✗ ያልተጠመቀ'}
                    </span>
                    <span className={m.paysTithe ? 'text-blue-700 font-medium' : 'text-slate-400'}>
                      {m.paysTithe ? '✓ አስራት' : '✗ አስራት'}
                    </span>
                    {m.isPrayerWarrior && (
                      <span className="text-rose-700 font-semibold flex items-center gap-0.5">
                        <Flame className="w-3 h-3" />
                        <span>ጸላይ</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DISCIPLESHIP GROUPS */}
      {activeTab === 'groups' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">የመንፈሳዊ ትምህርት ቡድኖች</h3>
              <p className="text-xs text-slate-500">የመጽሐፍ ቅዱስ ጥናት፣ የጸሎት ህብረትና የመንደር ቡድኖች</p>
            </div>
            <button
              onClick={() => setShowNewGroup(true)}
              className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>አዲስ ቡድን አቋቁም</span>
            </button>
          </div>

          {/* New group form modal */}
          {showNewGroup && (
            <form onSubmit={handleCreateGroup} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-800">አዲስ የትምህርት ቡድን መመዝገብ</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-600 block mb-1">የቡድኑ ስም *</label>
                  <input
                    type="text"
                    required
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="ለምሳሌ፡ ቡድን 6 - ናዝሬት"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">የቡድን አስተባባሪ ስም</label>
                  <input
                    type="text"
                    value={groupLeader}
                    onChange={(e) => setGroupLeader(e.target.value)}
                    placeholder="ስም"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">የአስተባባሪ ስልክ</label>
                  <input
                    type="tel"
                    value={groupLeaderPhone}
                    onChange={(e) => setGroupLeaderPhone(e.target.value)}
                    placeholder="09..."
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">የመሰብሰቢያ ቀንና ሰዓት</label>
                  <input
                    type="text"
                    value={groupMeetingDay}
                    onChange={(e) => setGroupMeetingDay(e.target.value)}
                    placeholder="ለምሳሌ፡ ማክሰኞ 11:30"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-600 block mb-1">የመሰብሰቢያ ቦታ / አድራሻ</label>
                  <input
                    type="text"
                    value={groupLocation}
                    onChange={(e) => setGroupLocation(e.target.value)}
                    placeholder="ለምሳሌ፡ ብርብር ቀበሌ 01 መንደር"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowNewGroup(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  ሰርዝ
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs text-white bg-slate-900 rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  ቡድኑን መዝግብ
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {discipleshipGroups.map((g) => {
              const groupMembers = members.filter(m => m.discipleshipGroup === g.name);
              const prayerCount = groupMembers.filter(m => m.isPrayerWarrior).length;

              return (
                <div key={g.id} className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-start justify-between border-b border-slate-100 pb-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{g.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{g.description || 'የመጽሐፍ ቅዱስ ጥናትና የጸሎት ህብረት'}</p>
                    </div>
                    <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-800 rounded font-semibold tabular-nums">
                      {groupMembers.length} አባላት
                    </span>
                  </div>

                  <div className="text-xs space-y-1.5 text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">አስተባባሪ:</span>
                      <span className="font-semibold text-slate-800">{g.leaderName}</span>
                      <span className="font-mono text-slate-500">({g.leaderPhone})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{g.meetingDay}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{g.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-rose-800 font-medium pt-1">
                      <Flame className="w-3.5 h-3.5 text-rose-600" />
                      <span>በዚህ ቡድን ውስጥ ያሉ ጸላያን፡ {prayerCount} ሰዎች</span>
                    </div>
                  </div>

                  {/* Sample members snippet */}
                  <div className="border-t border-slate-100 pt-2 text-[11px] text-slate-500">
                    <span>አባላት፡ </span>
                    {groupMembers.slice(0, 4).map(m => m.fullName).join('፣ ')}
                    {groupMembers.length > 4 && ` ... እና ሌሎች ${groupMembers.length - 4}`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: REPORTS SUBMISSION */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">የአገልግሎት ሪፖርት ማዘጋጃ</h3>
              <p className="text-xs text-slate-500">የስራ አፈፃፀም ሪፖርት አዘጋጅተው ለአስተባባሪው ያቅርቡ</p>
            </div>
            <button
              onClick={() => setShowNewReport(true)}
              className="px-3.5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>አዲስ ሪፖርት አዘጋጅ</span>
            </button>
          </div>

          {/* New report submission form */}
          {showNewReport && (
            <form onSubmit={handleCreateReport} className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
              <h4 className="text-sm font-bold text-slate-900">የአገልግሎት ክፍል ሪፖርት ቅጽ</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-600 block mb-1">የሪፖርቱ ርዕስ *</label>
                  <input
                    type="text"
                    required
                    value={repTitle}
                    onChange={(e) => setRepTitle(e.target.value)}
                    placeholder="ለምሳሌ፡ የጥቅምት ወር የህፃናት አገልግሎት ሪፖርት"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 block mb-1">አቅራቢ ስም *</label>
                  <input
                    type="text"
                    required
                    value={repSubmitter}
                    onChange={(e) => setRepSubmitter(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 block mb-1">ኃላፊነት *</label>
                  <input
                    type="text"
                    required
                    value={repRole}
                    onChange={(e) => setRepRole(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 block mb-1">የአገልግሎት ዘርፍ</label>
                  <select
                    value={repCategory}
                    onChange={(e) => setRepCategory(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="የአባቶች አገልግሎት">የአባቶች አገልግሎት</option>
                    <option value="የሴቶች አገልግሎት">የሴቶች አገልግሎት</option>
                    <option value="የወጣቶች አገልግሎት">የወጣቶች አገልግሎት</option>
                    <option value="የልጆች አገልግሎት">የልጆች አገልግሎት</option>
                    <option value="ዲያቆናት አገልግሎት">ዲያቆናት አገልግሎት</option>
                    <option value="የእርቅ ኮሚቴ">የእርቅ ኮሚቴ</option>
                    <option value="የወንጌል ማሕበርተኛ">የወንጌል ማሕበርተኛ</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-600 block mb-1">የጊዜ ወሰን / ወር</label>
                  <input
                    type="text"
                    value={repPeriod}
                    onChange={(e) => setRepPeriod(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-600 block mb-1">አጠቃላይ ማጠቃለያ *</label>
                <textarea
                  rows={2}
                  required
                  value={repSummary}
                  onChange={(e) => setRepSummary(e.target.value)}
                  placeholder="የተከናወኑትን ስራዎች በአጭሩ ይግለጹ..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-600 block mb-1">ዋና ዋና ስኬቶች</label>
                  <textarea
                    rows={2}
                    value={repAchievements}
                    onChange={(e) => setRepAchievements(e.target.value)}
                    placeholder="የተመዘገቡ ውጤቶች..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">ያጋጠሙ ተግዳሮቶች</label>
                  <textarea
                    rows={2}
                    value={repChallenges}
                    onChange={(e) => setRepChallenges(e.target.value)}
                    placeholder="ችግሮችና ድጋፍ የሚያስፈልጋቸው ነገሮች..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewReport(false)}
                  className="px-3.5 py-2 text-xs text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  ሰርዝ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ሪፖርቱን ለአስተባባሪው ላክ</span>
                </button>
              </div>
            </form>
          )}

          {/* Submitted reports history */}
          <div className="space-y-3">
            {reports.map((r) => (
              <div key={r.id} className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{r.title}</h4>
                    <span className="text-xs text-slate-500">አቅራቢ፡ {r.submittedBy} ({r.submitterRole}) · {r.period}</span>
                  </div>

                  <span className={`px-2.5 py-1 text-xs rounded-md font-medium border self-start sm:self-auto ${
                    r.status === 'የጸደቀ'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : r.status === 'ማስተካከያ የቀረበበት'
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {r.status}
                  </span>
                </div>

                <p className="text-xs text-slate-700">{r.summary}</p>
                {r.feedbackNotes && (
                  <p className="text-xs text-blue-800 bg-blue-50 p-2 rounded border border-blue-100">
                    የአስተባባሪ አስተያየት፡ {r.feedbackNotes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CHAPEL PLANS MONITORING */}
      {activeTab === 'plans' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">የቻፕሉ ዕቅድ መከታተያ</h3>
            <p className="text-xs text-slate-500">የኤዴን ቻፕል ዕቅዶችን መመልከትና መከታተል</p>
          </div>

          <div className="space-y-3">
            {plans.map((p) => (
              <div key={p.id} className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-semibold">{p.quarter} · {p.year}</span>
                    <h4 className="text-sm font-bold text-slate-900">{p.title}</h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-900">{p.progressPercent}%</span>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all"
                    style={{ width: `${p.progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{p.notes}</span>
                  <span className={p.coordinatorApproved ? 'text-emerald-700 font-medium' : 'text-amber-700'}>
                    {p.coordinatorApproved ? '✓ የጸደቀ' : 'በመጠባበቅ ላይ'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: FEEDBACK REVIEW FOR LEADERS */}
      {activeTab === 'feedback' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">የአባላት አስተያየትና ጥቆማዎች</h3>
            <p className="text-xs text-slate-500">ከአባላት የሚቀርቡ ሃሳቦችን መከታተልና ተፈጻሚ ማድረግ</p>
          </div>

          <div className="space-y-3">
            {feedbackList.map((fb) => (
              <div key={fb.id} className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{fb.subject}</h4>
                    <span className="text-xs text-slate-500">ከ {fb.memberName} ({fb.memberPhone}) · {fb.date}</span>
                  </div>
                  <span className={`px-2 py-0.5 text-xs rounded-md font-medium border ${
                    fb.status === 'ተፈጻሚ ሆኗል'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {fb.status}
                  </span>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {fb.message}
                </p>

                {fb.actionTakenNotes && (
                  <p className="text-xs text-emerald-800 font-medium">
                    ተፈጻሚ እርምጃ፡ {fb.actionTakenNotes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: LEADERSHIP FORUM */}
      {activeTab === 'forum' && (
        <LeadershipForum currentPortal="leaders" />
      )}

      {/* Member Form Modal */}
      <MemberFormModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        memberToEdit={memberToEdit}
      />
    </div>
  );
};
