import React, { useState } from 'react';
import { 
  User, 
  Users, 
  Plus, 
  Trash2, 
  Send, 
  Heart, 
  Home, 
  BookOpen, 
  Flame, 
  CheckCircle, 
  Clock, 
  Calendar,
  AlertCircle,
  MessageSquare,
  Search,
  Sparkles
} from 'lucide-react';
import { useChapel } from '../../context/ChapelContext';
import { Member, Gender } from '../../types/chapel';

export const MemberDashboard: React.FC = () => {
  const { 
    members, 
    currentMemberPhone, 
    setCurrentMemberPhone, 
    currentMember,
    addFamilyMember, 
    removeFamilyMember, 
    addFeedback, 
    addVisitationRequest,
    discipleshipGroups
  } = useChapel();

  const [searchPhone, setSearchPhone] = useState(currentMemberPhone);
  const [activeSection, setActiveSection] = useState<'profile' | 'family' | 'feedback' | 'visitation'>('profile');

  // Add Family Member form
  const [showAddFamily, setShowAddFamily] = useState(false);
  const [famName, setFamName] = useState('');
  const [famRelation, setFamRelation] = useState<'ባለቤት' | 'ልጅ' | 'እናት' | 'አባት' | 'እህት' | 'ወንድም' | 'ሌላ'>('ልጅ');
  const [famGender, setFamGender] = useState<Gender>('ወንድ');
  const [famAge, setFamAge] = useState<number>(10);

  // Submit Feedback form
  const [feedbackSubject, setFeedbackSubject] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Submit Pastoral Home Visit request form
  const [visReason, setVisReason] = useState<'የበረከትና የጸሎት' | 'የህመምተኛ ጸሎት' | 'የመጽናናት ጉብኝት' | 'መንፈሳዊ ምክር' | 'አስቸኳይ ጥሪ' | 'ሌላ'>('የበረከትና የጸሎት');
  const [visUrgency, setVisUrgency] = useState<'መደበኛ' | 'አስቸኳይ'>('መደበኛ');
  const [visAddress, setVisAddress] = useState(currentMember?.address || 'ብርብር ከተማ');
  const [visDate, setVisDate] = useState('');
  const [visDetails, setVisDetails] = useState('');
  const [visSuccess, setVisSuccess] = useState(false);

  const handlePhoneSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchPhone.replace(/\s+/g, '');
    const found = members.find(m => m.phone.replace(/\s+/g, '') === clean);
    if (found) {
      setCurrentMemberPhone(clean);
    } else {
      alert('በዚህ ስልክ ቁጥር የተመዘገበ አባል አልተገኘም። እባክዎ ከታች ካለው ዝርዝር ይምረጡ ወይም ለአስተባባሪው ያሳውቁ።');
    }
  };

  const handleAddFamily = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMember || !famName.trim()) return;

    addFamilyMember(currentMember.id, {
      fullName: famName.trim(),
      relation: famRelation,
      gender: famGender,
      age: Number(famAge)
    });

    setFamName('');
    setShowAddFamily(false);
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMember || !feedbackSubject.trim() || !feedbackMessage.trim()) return;

    addFeedback({
      memberName: currentMember.fullName,
      memberPhone: currentMember.phone,
      subject: feedbackSubject.trim(),
      message: feedbackMessage.trim()
    });

    setFeedbackSubject('');
    setFeedbackMessage('');
    setFeedbackSuccess(true);
    setTimeout(() => setFeedbackSuccess(false), 4000);
  };

  const handleSendVisitation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMember || !visDetails.trim()) return;

    addVisitationRequest({
      memberName: currentMember.fullName,
      memberPhone: currentMember.phone,
      address: visAddress.trim() || currentMember.address || 'ብርብር',
      reason: visReason,
      urgency: visUrgency,
      preferredDate: visDate || 'በአፋጣኝ',
      details: visDetails.trim()
    });

    setVisDetails('');
    setVisSuccess(true);
    setTimeout(() => setVisSuccess(false), 4000);
  };

  const myGroupInfo = discipleshipGroups.find(g => g.name === currentMember?.discipleshipGroup);
  const groupMembersCount = members.filter(m => m.discipleshipGroup === currentMember?.discipleshipGroup).length;

  return (
    <div className="space-y-6">
      {/* Member Lookup Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold text-xs">
            አባል
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 block">የአባልነት መለያ መፈለጊያ</span>
            <span className="text-[11px] text-slate-500">ስልክ ቁጥር በማስገባት የእርስዎን መረጃ ይመልከቱ</span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Quick Member Switcher */}
          <select
            value={currentMember?.phone || ''}
            onChange={(e) => {
              setCurrentMemberPhone(e.target.value);
              setSearchPhone(e.target.value);
            }}
            className="p-2 text-xs rounded-lg border border-slate-200 bg-slate-50 max-w-xs"
          >
            {members.map(m => (
              <option key={m.id} value={m.phone}>
                [{m.familyCode || 'eden101'}] {m.fullName} ({m.phone || 'ስልክ የለም'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentMember ? (
        <div className="space-y-6">
          {/* Profile Hero Card */}
          <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 text-xl font-bold">
                  {currentMember.fullName.charAt(0)}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
                      የኤዴን ቻፕል አባል
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs bg-amber-500 text-slate-950 font-mono font-bold px-2 py-0.5 rounded shadow-2xs">
                      ልዩ መለያ ኮድ፦ {currentMember.familyCode || 'eden101'}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-300 font-mono">{currentMember.phone}</span>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
                    {currentMember.fullName}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 mt-2">
                    <span>{currentMember.gender}</span>
                    <span>·</span>
                    <span className="font-mono tabular-nums">{currentMember.age} ዓመት</span>
                    <span>·</span>
                    <span>{currentMember.educationLevel}</span>
                    <span>·</span>
                    <span>{currentMember.profession}</span>
                  </div>
                </div>
              </div>

              {/* Status Tags */}
              <div className="flex flex-wrap items-center gap-2 self-start md:self-auto text-xs">
                <span className={`px-2.5 py-1 rounded-lg border font-medium ${
                  currentMember.isBaptized ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {currentMember.isBaptized ? '✓ የተጠመቀ' : '✗ ያልተጠመቀ'}
                </span>
                <span className={`px-2.5 py-1 rounded-lg border font-medium ${
                  currentMember.paysTithe ? 'bg-blue-950 text-blue-400 border-blue-800' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {currentMember.paysTithe ? '✓ አስራት ከፋይ' : '✗ አስራት'}
                </span>
                <span className={`px-2.5 py-1 rounded-lg border font-medium ${
                  currentMember.participatesLordSupper ? 'bg-purple-950 text-purple-400 border-purple-800' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {currentMember.participatesLordSupper ? '✓ የጌታ እራት' : '✗ የጌታ እራት'}
                </span>
              </div>
            </div>
          </div>

          {/* Member Sub Navigation */}
          <div className="border-b border-slate-200">
            <div className="flex items-center gap-1 overflow-x-auto pb-px">
              <button
                onClick={() => setActiveSection('profile')}
                className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
                  activeSection === 'profile'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                የአባልነትና አገልግሎት መረጃ
              </button>

              <button
                onClick={() => setActiveSection('family')}
                className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
                  activeSection === 'family'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                የቤተሰብ አባላት ({currentMember.familyMembers ? currentMember.familyMembers.length : 0})
              </button>

              <button
                onClick={() => setActiveSection('visitation')}
                className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
                  activeSection === 'visitation'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                የቤተ ጉብኝት ጥያቄ ማቅረብ
              </button>

              <button
                onClick={() => setActiveSection('feedback')}
                className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
                  activeSection === 'feedback'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                ለቻፕሉ አስተያየት መስጠት
              </button>
            </div>
          </div>

          {/* SECTION 1: PROFILE & FELLOWSHIP */}
          {activeSection === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fellowship & Discipleship Group Info */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-slate-900">የመንፈሳዊ ትምህርትና ህብረት ቡድንዎ</h3>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-900">{currentMember.discipleshipGroup}</span>
                    <span className="text-xs text-slate-500 tabular-nums">{groupMembersCount} አባላት</span>
                  </div>

                  {myGroupInfo && (
                    <div className="text-xs text-slate-600 space-y-1.5 pt-1">
                      <p>የቡድን መሪ፡ <span className="font-semibold text-slate-800">{myGroupInfo.leaderName}</span> ({myGroupInfo.leaderPhone})</p>
                      <p>የመሰብሰቢያ ጊዜ፡ <span className="font-semibold text-slate-800">{myGroupInfo.meetingDay}</span></p>
                      <p>ቦታ፡ <span className="font-semibold text-slate-800">{myGroupInfo.location}</span></p>
                    </div>
                  )}

                  {currentMember.isPrayerWarrior && (
                    <div className="pt-2 border-t border-slate-200 text-xs text-rose-700 font-semibold flex items-center gap-1.5">
                      <Flame className="w-4 h-4" />
                      <span>እርስዎ በዚህ ቡድን ውስጥ የተመደቡ የጸሎትና የምልጃ አገልጋይ (ጸላይ) ነዎት!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Ministry Department & Housing */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Heart className="w-4 h-4 text-rose-600" />
                  <h3 className="text-sm font-bold text-slate-900">የአገልግሎት ዘርፍና አድራሻ</h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">የአገልግሎት ዘርፍ</span>
                    <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                      {currentMember.ministryDepartment}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">የቤት ሁኔታ</span>
                    <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                      {currentMember.housingStatus === 'የግል' ? 'የግል መኖሪያ ቤት' : 'የኪራይ ቤት'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">የመኖሪያ አድራሻ</span>
                    <span className="text-sm font-semibold text-slate-900 mt-0.5 block">
                      {currentMember.address || 'ብርብር ከተማ'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: FAMILY MEMBERS (ADD / REMOVE) */}
          {activeSection === 'family' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">የቤተሰብ አባላት አስተዳደር</h3>
                    <p className="text-xs text-slate-500">በእርስዎ ስር ያሉ የቤተሰብ አባላትን መመዝገብ ወይም መቀነስ ይችላሉ</p>
                  </div>
                  <button
                    onClick={() => setShowAddFamily(true)}
                    className="px-3.5 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>አዲስ የቤተሰብ አባል ጨምር</span>
                  </button>
                </div>

                {/* Add Family Member Form */}
                {showAddFamily && (
                  <form onSubmit={handleAddFamily} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800">አዲስ የቤተሰብ አባል ማካተት</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="sm:col-span-2">
                        <label className="text-xs text-slate-600 block mb-1">ሙሉ ስም *</label>
                        <input
                          type="text"
                          required
                          value={famName}
                          onChange={(e) => setFamName(e.target.value)}
                          placeholder="የቤተሰብ አባል ስም"
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-600 block mb-1">ዝምድና *</label>
                        <select
                          value={famRelation}
                          onChange={(e) => setFamRelation(e.target.value as any)}
                          className="w-full p-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                        >
                          <option value="ባለቤት">ባለቤት</option>
                          <option value="ልጅ">ልጅ</option>
                          <option value="እናት">እናት</option>
                          <option value="አባት">አባት</option>
                          <option value="እህት">እህት</option>
                          <option value="ወንድም">ወንድም</option>
                          <option value="ሌላ">ሌላ</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-slate-600 block mb-1">ጾታ</label>
                          <select
                            value={famGender}
                            onChange={(e) => setFamGender(e.target.value as Gender)}
                            className="w-full p-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                          >
                            <option value="ወንድ">ወንድ</option>
                            <option value="ሴት">ሴት</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-slate-600 block mb-1">ዕድሜ</label>
                          <input
                            type="number"
                            min={0}
                            max={120}
                            value={famAge}
                            onChange={(e) => setFamAge(Number(e.target.value))}
                            className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddFamily(false)}
                        className="px-3 py-1.5 text-xs text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
                      >
                        ሰርዝ
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 text-xs text-white bg-slate-900 rounded-lg hover:bg-slate-800 cursor-pointer"
                      >
                        መዝግብ
                      </button>
                    </div>
                  </form>
                )}

                {/* Family List */}
                {(!currentMember.familyMembers || currentMember.familyMembers.length === 0) ? (
                  <div className="text-center py-8 text-slate-400 space-y-1">
                    <Users className="w-8 h-8 mx-auto" />
                    <p className="text-xs text-slate-500">የተመዘገበ የቤተሰብ አባል የለም።</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {currentMember.familyMembers.map((fam) => (
                      <div key={fam.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-xs text-slate-900">{fam.fullName}</h4>
                          <p className="text-[11px] text-slate-500">
                            {fam.relation} · {fam.gender} · {fam.age} ዓመት
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm(`${fam.fullName} ከቤተሰብ ዝርዝር እንዲቀነስ ይፈልጋሉ?`)) {
                              removeFamilyMember(currentMember.id, fam.id);
                            }
                          }}
                          title="ቀንስ / ሰርዝ"
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-md cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION 3: VISITATION REQUEST */}
          {activeSection === 'visitation' && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4 max-w-xl">
              <div>
                <h3 className="text-sm font-bold text-slate-900">የቤተ ጉብኝት ጥያቄ ማቅረቢያ</h3>
                <p className="text-xs text-slate-500">የቤተክርስቲያን መሪዎችና አገልጋዮች ቤተሰብዎን እንዲጎበኙና እንዲጸልዩልዎ ጥሪ ያቅርቡ</p>
              </div>

              {visSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>የቤተ ጉብኝት ጥያቄዎ ለአስተባባሪውና ለአመራሩ ደርሷል፤ በቅርቡ ይጎበኙዎታል!</span>
                </div>
              )}

              <form onSubmit={handleSendVisitation} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">የጉብኝቱ ምክንያት *</label>
                    <select
                      value={visReason}
                      onChange={(e) => setVisReason(e.target.value as any)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="የበረከትና የጸሎት">የበረከትና የጸሎት</option>
                      <option value="የህመምተኛ ጸሎት">የህመምተኛ ጸሎት</option>
                      <option value="የመጽናናት ጉብኝት">የመጽናናት ጉብኝት</option>
                      <option value="መንፈሳዊ ምክር">መንፈሳዊ ምክር</option>
                      <option value="አስቸኳይ ጥሪ">አስቸኳይ ጥሪ</option>
                      <option value="ሌላ">ሌላ</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-600 block mb-1">አስቸኳይነት</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setVisUrgency('መደበኛ')}
                        className={`p-2 text-xs rounded-lg border transition-colors cursor-pointer ${
                          visUrgency === 'መደበኛ' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        መደበኛ
                      </button>
                      <button
                        type="button"
                        onClick={() => setVisUrgency('አስቸኳይ')}
                        className={`p-2 text-xs rounded-lg border transition-colors cursor-pointer ${
                          visUrgency === 'አስቸኳይ' ? 'bg-rose-700 text-white border-rose-700' : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        አስቸኳይ!
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">የቤት አድራሻ</label>
                    <input
                      type="text"
                      value={visAddress}
                      onChange={(e) => setVisAddress(e.target.value)}
                      placeholder="ለምሳሌ፡ ብርብር ቀበሌ 01"
                      className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-600 block mb-1">የሚመችዎት ቀን</label>
                    <input
                      type="date"
                      value={visDate}
                      onChange={(e) => setVisDate(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-600 block mb-1">ዝርዝር ማብራሪያ *</label>
                  <textarea
                    rows={3}
                    required
                    value={visDetails}
                    onChange={(e) => setVisDetails(e.target.value)}
                    placeholder="የጉብኝቱን ምክንያት ወይም የጸሎቱን ርዕስ እዚህ ይግለጹ..."
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>የጉብኝት ጥያቄውን ላክ</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SECTION 4: SUBMIT FEEDBACK */}
          {activeSection === 'feedback' && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4 max-w-xl">
              <div>
                <h3 className="text-sm font-bold text-slate-900">ለቻፕሉ አስተያየትና ጥቆማ መስጫ</h3>
                <p className="text-xs text-slate-500">ለኤዴን ቻፕል አስተባባሪና መሪዎች የሚያቀርቡት ገንቢ አስተያየት</p>
              </div>

              {feedbackSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>አስተያየትዎ በተሳካ ሁኔታ ተልኳል፤ ቻፕሉን ለማገልገል ስላደረጉት አስተዋጽዖ እግዚአብሔር ይባርክዎ!</span>
                </div>
              )}

              <form onSubmit={handleSendFeedback} className="space-y-3">
                <div>
                  <label className="text-xs text-slate-600 block mb-1">የአስተያየቱ ርዕስ *</label>
                  <input
                    type="text"
                    required
                    value={feedbackSubject}
                    onChange={(e) => setFeedbackSubject(e.target.value)}
                    placeholder="ለምሳሌ፡ የህብረት ሰዓት፣ የአዳራሽ አገልግሎት..."
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 block mb-1">የእርስዎ አስተያየት ወይም ጥቆማ *</label>
                  <textarea
                    rows={4}
                    required
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    placeholder="ሃሳብዎን በዝርዝር እዚህ ይፃፉ..."
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>አስተያየቱን ላክ</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-800">ምንም አባል አልተመረጠም</p>
          <p className="text-xs text-slate-500 mt-1">እባክዎ ከላይ ካለው መፈለጊያ ስልክ ቁጥርዎን ይምረጡ</p>
        </div>
      )}
    </div>
  );
};
