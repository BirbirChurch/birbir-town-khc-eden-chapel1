import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Edit3, 
  Trash2, 
  FileText, 
  Printer, 
  Sparkles, 
  Filter, 
  Search, 
  Layers, 
  Divide, 
  ArrowRight, 
  Save, 
  RefreshCw, 
  ChevronRight,
  TrendingUp,
  Award,
  BookOpen,
  Send,
  AlertCircle,
  HelpCircle,
  Heart,
  UserCheck
} from 'lucide-react';
import { useChapel } from '../../context/ChapelContext';
import { 
  AnnualPlanItem, 
  DailyCoordinatorLog, 
  QuarterlyGeneratedReport 
} from '../../types/chapel';
import { 
  PLAN_CATEGORIES, 
  ETHIOPIAN_MONTHS, 
  getQuarterForMonth 
} from '../../data/annualPlan2018Data';

type SubView = 'plan-table' | 'daily-log' | 'monthly-summary' | 'quarterly-report' | 'annual-summary';
type QuarterFilter = 'all' | 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'half';

export const AnnualPlan2018Module: React.FC = () => {
  const { 
    members,
    annualPlan2018, 
    updateAnnualPlanItem, 
    addAnnualPlanItem, 
    deleteAnnualPlanItem, 
    splitAnnualTargetToQuarters,
    dailyLogs, 
    addDailyLog, 
    updateDailyLog, 
    deleteDailyLog,
    quarterlyReports, 
    saveQuarterlyReport, 
    updateQuarterlyReport, 
    deleteQuarterlyReport 
  } = useChapel();

  const [currentSubView, setCurrentSubView] = useState<SubView>('plan-table');
  const [selectedQuarter, setSelectedQuarter] = useState<QuarterFilter>('all');
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Daily Log Form State
  const [showAddLogModal, setShowAddLogModal] = useState(false);
  const [logDate, setLogDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [logMonth, setLogMonth] = useState('ጥቅምት');
  const [logQuarter, setLogQuarter] = useState<'1ኛ' | '2ኛ' | '3ኛ' | '4ኛ'>('1ኛ');
  const [logTaskTitle, setLogTaskTitle] = useState('');
  const [logPlanItemId, setLogPlanItemId] = useState('');
  const [logMetricAccomplished, setLogMetricAccomplished] = useState('');
  const [logUnit, setLogUnit] = useState('በቁጥር');
  const [logParticipantsOrLocation, setLogParticipantsOrLocation] = useState('');
  const [logIsUnplanned, setLogIsUnplanned] = useState(false);
  const [logNotes, setLogNotes] = useState('');

  // Plan Item Edit State
  const [editingPlanItem, setEditingPlanItem] = useState<AnnualPlanItem | null>(null);
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);

  // New Plan Item Form State
  const [newPlanCode, setNewPlanCode] = useState('');
  const [newPlanTitle, setNewPlanTitle] = useState('');
  const [newPlanCategoryId, setNewPlanCategoryId] = useState(1);
  const [newPlanUnit, setNewPlanUnit] = useState('በቁጥር');
  const [newPlanAnnualTarget, setNewPlanAnnualTarget] = useState('');
  const [newPlanRemarks, setNewPlanRemarks] = useState('');

  // Monthly generator state
  const [selectedMonthForSummary, setSelectedMonthForSummary] = useState('ጥቅምት');

  // Quarterly generator state
  const [selectedQuarterForReport, setSelectedQuarterForReport] = useState<'1ኛ ሩብ ዓመት' | '2ኛ ሩብ ዓመት' | '3ኛ ሩብ ዓመት' | '4ኛ ሩብ ዓመት'>('1ኛ ሩብ ዓመት');
  const [activeReportToView, setActiveReportToView] = useState<QuarterlyGeneratedReport | null>(() => {
    return quarterlyReports.find(r => r.quarter === '1ኛ ሩብ ዓመት') || quarterlyReports[0] || null;
  });

  // Print Report Modal
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Notification Banner
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Sync Sector 1 (Demographics) with live members count
  const handleAutoFillDemographics = () => {
    const totalHeadOfHouseholds = members.length;
    let youthCount = 0;
    let childrenCount = 0;
    let totalSoulCount = members.length;

    members.forEach(m => {
      if (m.ageGroup === '15-29') youthCount++;
      if (m.ageGroup === '0-14') childrenCount++;
      
      (m.familyMembers || []).forEach(f => {
        totalSoulCount++;
        if (f.age <= 14) childrenCount++;
        else if (f.age >= 15 && f.age <= 29) youthCount++;
      });
    });

    // Update 1.1, 1.2, 1.3, 1.4
    const item11 = annualPlan2018.find(p => p.code === '1.1');
    if (item11) {
      updateAnnualPlanItem(item11.id, {
        annualTarget: totalHeadOfHouseholds,
        q1Actual: totalHeadOfHouseholds,
        remarks: `ከ136 አባወራዎች ዳታቤዝ የተመሳሰለ (${totalHeadOfHouseholds} አባወራዎች)`
      });
    }

    const item12 = annualPlan2018.find(p => p.code === '1.2');
    if (item12) {
      updateAnnualPlanItem(item12.id, {
        annualTarget: youthCount + 20,
        q1Actual: youthCount,
        remarks: `ከቤተሰብ ዳታቤዝ የተገኘ የወጣቶች ብዛት (${youthCount})`
      });
    }

    const item13 = annualPlan2018.find(p => p.code === '1.3');
    if (item13) {
      updateAnnualPlanItem(item13.id, {
        annualTarget: childrenCount + 20,
        q1Actual: childrenCount,
        remarks: `ከቤተሰብ ዳታቤዝ የተገኘ የህጻናት ብዛት (${childrenCount})`
      });
    }

    const item14 = annualPlan2018.find(p => p.code === '1.4');
    if (item14) {
      updateAnnualPlanItem(item14.id, {
        annualTarget: totalSoulCount + 40,
        q1Actual: totalSoulCount,
        remarks: `አጠቃላይ የተመዘገቡ ነፍሳት ድምር (${totalSoulCount})`
      });
    }

    showToast('የአባላት ስታትስቲክሳዊ መረጃ ከ136 አባወራዎች ዳታቤዝ ጋር በተሳካ ሁኔታ ተመሳስሏል!');
  };

  // Filtered Plan Items
  const filteredPlanItems = useMemo(() => {
    return annualPlan2018.filter(item => {
      const matchCat = selectedCategory === 'all' || item.categoryId === selectedCategory;
      const matchQuery = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.includes(searchQuery) ||
        item.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.remarks || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [annualPlan2018, selectedCategory, searchQuery]);

  // Daily logs for selected month
  const monthlyLogs = useMemo(() => {
    return dailyLogs.filter(log => log.month === selectedMonthForSummary);
  }, [dailyLogs, selectedMonthForSummary]);

  // Handle Save New Daily Log
  const handleCreateDailyLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logTaskTitle.trim()) return;

    let catId: number | undefined;
    let catName: string | undefined;
    let itemCode: string | undefined;

    if (logPlanItemId) {
      const matched = annualPlan2018.find(p => p.id === logPlanItemId);
      if (matched) {
        catId = matched.categoryId;
        catName = matched.categoryName;
        itemCode = matched.code;
      }
    }

    addDailyLog({
      date: logDate,
      month: logMonth,
      quarter: logQuarter,
      taskTitle: logTaskTitle.trim(),
      categoryId: catId,
      categoryName: catName,
      planItemId: logPlanItemId || undefined,
      planItemCode: itemCode,
      metricAccomplished: logMetricAccomplished ? Number(logMetricAccomplished) || logMetricAccomplished : undefined,
      unit: logUnit,
      participantsOrLocation: logParticipantsOrLocation.trim() || undefined,
      isUnplanned: logIsUnplanned,
      notes: logNotes.trim() || undefined
    });

    // Reset Form
    setLogTaskTitle('');
    setLogMetricAccomplished('');
    setLogParticipantsOrLocation('');
    setLogNotes('');
    setShowAddLogModal(false);
    showToast('የዕለቱ የስራ መዝገብ በተሳካ ሁኔታ ተመዝግቧል!');
  };

  // Handle Create New Plan Item
  const handleCreatePlanItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanTitle.trim() || !newPlanCode.trim()) return;

    const cat = PLAN_CATEGORIES.find(c => c.id === newPlanCategoryId);
    const num = parseFloat(newPlanAnnualTarget);
    const qVal = !isNaN(num) && num > 0 ? Math.round((num / 4) * 10) / 10 : newPlanAnnualTarget;
    const halfVal = !isNaN(num) && num > 0 ? Math.round((num / 2) * 10) / 10 : newPlanAnnualTarget;

    addAnnualPlanItem({
      code: newPlanCode.trim(),
      title: newPlanTitle.trim(),
      categoryId: newPlanCategoryId,
      categoryName: cat ? cat.title : 'መንፈሳዊ አገልግሎት',
      unit: newPlanUnit.trim(),
      annualTarget: newPlanAnnualTarget,
      halfYearTarget: halfVal,
      q1Target: qVal,
      q2Target: qVal,
      q3Target: qVal,
      q4Target: qVal,
      remarks: newPlanRemarks.trim()
    });

    setNewPlanCode('');
    setNewPlanTitle('');
    setNewPlanAnnualTarget('');
    setNewPlanRemarks('');
    setShowAddPlanModal(false);
    showToast('አዲስ የዕቅድ ዝርዝር በተሳካ ሁኔታ ተመዝግቧል!');
  };

  // Generate / Refresh Quarterly Report from Daily Logs & Plan Targets
  const handleGenerateQuarterlyReport = () => {
    const qNum = selectedQuarterForReport.startsWith('1') ? '1ኛ' : selectedQuarterForReport.startsWith('2') ? '2ኛ' : selectedQuarterForReport.startsWith('3') ? '3ኛ' : '4ኛ';
    
    // Gather planned tasks for this quarter
    const tasks = annualPlan2018.map(item => {
      let plannedVal: number | string = 0;
      let actualVal: number | string = 0;

      if (qNum === '1ኛ') {
        plannedVal = item.q1Target;
        actualVal = item.q1Actual || 0;
      } else if (qNum === '2ኛ') {
        plannedVal = item.q2Target;
        actualVal = item.q2Actual || 0;
      } else if (qNum === '3ኛ') {
        plannedVal = item.q3Target;
        actualVal = item.q3Actual || 0;
      } else {
        plannedVal = item.q4Target;
        actualVal = item.q4Actual || 0;
      }

      const pNum = parseFloat(String(plannedVal));
      const aNum = parseFloat(String(actualVal));
      let pct = 0;
      if (!isNaN(pNum) && pNum > 0 && !isNaN(aNum)) {
        pct = Math.round((aNum / pNum) * 100);
      } else if (String(plannedVal).includes('%') && String(actualVal).includes('%')) {
        pct = 100;
      }

      return {
        code: item.code,
        title: item.title,
        unit: item.unit,
        planned: plannedVal,
        accomplished: actualVal,
        percent: pct,
        remarks: item.remarks || ''
      };
    });

    // Unplanned tasks logged by coordinator for this quarter
    const unplannedLogs = dailyLogs
      .filter(l => l.quarter === qNum && l.isUnplanned)
      .map(l => `${l.taskTitle} (${l.participantsOrLocation || 'ኤዴን ቻፕል'}) - ${l.notes || 'የተከናወነ'}`);

    const existing = quarterlyReports.find(r => r.quarter === selectedQuarterForReport);

    const generated: QuarterlyGeneratedReport = {
      id: existing ? existing.id : `rep-${Date.now()}`,
      year: '2018 ዓ.ም',
      quarter: selectedQuarterForReport,
      preparedBy: 'ወንጌላዊ ገላትያ ደስታ',
      role: 'የቻፕሉ አስተባባሪ',
      date: new Date().toISOString().split('T')[0],
      plannedTasks: tasks,
      otherAccomplishments: unplannedLogs.length > 0 
        ? unplannedLogs 
        : existing?.otherAccomplishments || [
            'ለድንገተኛ አደጋ ተጎጂ 2 ቤተሰቦች አስቸኳይ የምግብና አልባሳት ድጋፍ ተደርጓል',
            'በሁለት አባወራዎች መካከል የተፈጠረ አለመግባባት በሽምግልናና በጸሎት ታርቋል'
          ],
      challenges: existing?.challenges || [
        'አንዳንድ አባወራዎች በገበሬነትና በንግድ ስራ ምክንያት በቀን ሰዓት ለጉብኝት ማግኘት አዳጋች መሆን',
        'የደቀመዝሙርነትና የመማሪያ መጻሕፍት እጥረት መኖር'
      ],
      solutions: existing?.solutions || [
        'የቤት ለቤት ጉብኝት ሰዓትን ወደ ማታ (ከ12፡00 በኋላ) እና ወደ እሁድ ከሰዓት ማስተካከል',
        'ከዋናው አጥቢያ ቤተክርስቲያን ጋር በመነጋገር ተጨማሪ መጻሕፍት እንዲመደቡ ማድረግ'
      ],
      thanksgivings: existing?.thanksgivings || [
        'እግዚአብሔር ለሰጠን ሰላም፣ ፍቅርና አንድነት ክብር ይሁንለት',
        'አዳዲስ ነፍሳት ወደ ጌታ መንግሥት ስለተጨመሩ እናመሰግናለን'
      ],
      prayerRequests: existing?.prayerRequests || [
        'ለቀጣዩ ሩብ ዓመት የወንጌል ስርጭትና ለሚዘጋጁት ጥማቂዎች ጸሎት ያስፈልጋል',
        'በህመም ላይ ላሉ አባላት ፈውስ እንዲሆን'
      ],
      status: 'የጸደቀ'
    };

    saveQuarterlyReport(generated);
    setActiveReportToView(generated);
    showToast(`${selectedQuarterForReport} ክንውን ሪፖርት በተሳካ ሁኔታ ጀኔሬት ተደርጓል!`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-800 text-white px-4 py-3 rounded-xl shadow-xl border border-emerald-600 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-indigo-900/40 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xl shrink-0">
              📋
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  የስትራቴጂክ ዕቅድና ክንውን መከታተያ ክፍል
                </span>
                <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-2.5 py-0.5 rounded-full font-mono border border-indigo-500/40">
                  2018 ዓ.ም በጀት ዓመት
                </span>
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight mt-1">
                በ2018 ዓ.ም የብ/ከ/ቃ/ሕ/ቤ/ክ የመንፈሳዊ ዘርፍ ዕቅድና ሪፖርት
              </h1>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                የዓመት ዕቅድ፣ የ4ቱ ሩብ ዓመት ክፍፍል፣ የአስተባባሪው ዕለታዊ የስራ መዝገብና የወርሃዊ/የሩብ ዓመት ክንውን ሪፖርት ጀነሬተር
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
            <button
              onClick={() => setShowAddLogModal(true)}
              className="px-3.5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>የዕለት ስራ መዝግብ</span>
            </button>

            <button
              onClick={() => setShowAddPlanModal(true)}
              className="px-3.5 py-2 text-xs font-medium bg-indigo-700 hover:bg-indigo-600 text-white rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm border border-indigo-500/50"
            >
              <Plus className="w-4 h-4" />
              <span>አዲስ ዕቅድ አክል</span>
            </button>

            <button
              onClick={handleAutoFillDemographics}
              className="px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700"
              title="የአባላት ስታትስቲክስ ከ136 አባወራዎች መረጃ ጋር አመሳስል"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">ከአባላት ዳታቤዝ አመሳስል</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-View Navigation Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-1.5 shadow-xs flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setCurrentSubView('plan-table')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer ${
            currentSubView === 'plan-table'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4 text-amber-400" />
          <span>1. የዓመትና የ4 ሩብ ዓመት ዕቅድ ({annualPlan2018.length})</span>
        </button>

        <button
          onClick={() => setCurrentSubView('daily-log')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer ${
            currentSubView === 'daily-log'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4 text-sky-400" />
          <span>2. የአስተባባሪው ዕለታዊ የስራ መዝገብ ({dailyLogs.length})</span>
        </button>

        <button
          onClick={() => setCurrentSubView('monthly-summary')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer ${
            currentSubView === 'monthly-summary'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span>3. የወርሃዊ ክንውን ጀነሬተር</span>
        </button>

        <button
          onClick={() => setCurrentSubView('quarterly-report')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer ${
            currentSubView === 'quarterly-report'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4 text-indigo-400" />
          <span>4. የሩብ ዓመት ክንውን ሪፖርት ጀነሬተር</span>
        </button>

        <button
          onClick={() => setCurrentSubView('annual-summary')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer ${
            currentSubView === 'annual-summary'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4 text-amber-500" />
          <span>5. የዓመቱ ጥቅል ማጠቃለያ</span>
        </button>
      </div>

      {/* VIEW 1: ANNUAL & 4-QUARTER PLAN TABLE */}
      {currentSubView === 'plan-table' && (
        <div className="space-y-4">
          {/* Controls Bar: Category Filter, Quarter Filter & Search */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                ዘርፍ፦
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-800 font-medium focus:ring-1 focus:ring-amber-500 cursor-pointer max-w-[240px]"
              >
                <option value="all">ሁሉንም 8 ዘርፎች አሳይ</option>
                {PLAN_CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.id}. {c.title}
                  </option>
                ))}
              </select>

              <span className="text-xs font-semibold text-slate-500 ml-2">ሩብ ዓመት፦</span>
              <div className="inline-flex rounded-lg border border-slate-300 bg-slate-50 p-0.5 text-xs">
                {(['all', 'Q1', 'Q2', 'Q3', 'Q4', 'half'] as QuarterFilter[]).map((q) => (
                  <button
                    key={q}
                    onClick={() => setSelectedQuarter(q)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      selectedQuarter === q 
                        ? 'bg-slate-900 text-white font-bold' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {q === 'all' ? 'ሁሉንም (ዓመት)' : q === 'half' ? 'ግማሽ ዓመት' : `${q.replace('Q', '')}ኛ ሩብ`}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="በተግባር ስም ወይም ኮድ ፈልግ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-amber-500/40"
              />
            </div>
          </div>

          {/* Master Plan Table (Verbatim matching church requirements) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  የ2018 ዓ.ም የመንፈሳዊ ዘርፍ የዓመትና የሩብ ዓመት ዕቅድ ሠንጠረዥ
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  ብርብር ከተማ ቃለ ሕይወት ቤተክርስቲያን · ኤዴን ቻፕል
                </p>
              </div>
              <div className="text-xs text-slate-500 font-medium">
                የተገኙ ዝርዝር ተግባራት፦ <strong className="text-slate-900">{filteredPlanItems.length}</strong>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white border-b border-slate-800 text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-3 w-16 text-center font-bold">ተ.ቁ</th>
                    <th className="py-3 px-4 min-w-[240px] font-bold">ዝርዝር ተግባራት</th>
                    <th className="py-3 px-3 w-28 text-center font-bold">መለኪያ</th>
                    <th className="py-3 px-3 w-28 text-center bg-amber-950/60 text-amber-300 font-bold border-l border-amber-900/40">
                      የዓመት ዕቅድ
                    </th>
                    {(selectedQuarter === 'all' || selectedQuarter === 'half') && (
                      <th className="py-3 px-3 w-24 text-center bg-slate-800 text-slate-200 font-semibold border-l border-slate-700">
                        የግማሽ ዓመት
                      </th>
                    )}
                    {(selectedQuarter === 'all' || selectedQuarter === 'Q1') && (
                      <th className="py-3 px-3 w-24 text-center bg-blue-950/60 text-blue-200 font-semibold border-l border-blue-900/40">
                        1ኛ ሩብ
                      </th>
                    )}
                    {(selectedQuarter === 'all' || selectedQuarter === 'Q2') && (
                      <th className="py-3 px-3 w-24 text-center bg-blue-950/60 text-blue-200 font-semibold border-l border-blue-900/40">
                        2ኛ ሩብ
                      </th>
                    )}
                    {(selectedQuarter === 'all' || selectedQuarter === 'Q3') && (
                      <th className="py-3 px-3 w-24 text-center bg-blue-950/60 text-blue-200 font-semibold border-l border-blue-900/40">
                        3ኛ ሩብ
                      </th>
                    )}
                    {(selectedQuarter === 'all' || selectedQuarter === 'Q4') && (
                      <th className="py-3 px-3 w-24 text-center bg-blue-950/60 text-blue-200 font-semibold border-l border-blue-900/40">
                        4ኛ ሩብ
                      </th>
                    )}
                    <th className="py-3 px-4 min-w-[180px] font-bold border-l border-slate-800">ምርመራ / ማስታወሻ</th>
                    <th className="py-3 px-3 w-24 text-center font-bold border-l border-slate-800">እርምጃ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
                  {/* Group items by Category Header */}
                  {PLAN_CATEGORIES.map(category => {
                    const itemsInCat = filteredPlanItems.filter(p => p.categoryId === category.id);
                    if (itemsInCat.length === 0) return null;

                    return (
                      <React.Fragment key={category.id}>
                        {/* Major Category Section Header Row */}
                        <tr className="bg-amber-50/70 border-y border-amber-200/80 font-bold text-slate-900">
                          <td className="py-2.5 px-3 text-center text-amber-900 font-mono">
                            {category.id}
                          </td>
                          <td colSpan={10} className="py-2.5 px-4 text-xs font-bold text-amber-950">
                            {category.id}. {category.title}
                          </td>
                        </tr>

                        {/* Sub Tasks */}
                        {itemsInCat.map(item => (
                          <tr 
                            key={item.id} 
                            className="hover:bg-slate-50/80 transition-colors group"
                          >
                            <td className="py-2.5 px-3 text-center font-mono font-semibold text-slate-500">
                              {item.code}
                            </td>
                            <td className="py-2.5 px-4 font-medium text-slate-900 flex items-center gap-1.5">
                              <span>- {item.title}</span>
                              {item.autoCalculated && (
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono" title="ከ136 አባወራዎች ዳታቤዝ የተመሳሰለ">
                                  አባላት
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-center text-slate-600 bg-slate-50/50">
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px] font-mono text-slate-700">
                                {item.unit}
                              </span>
                            </td>
                            
                            {/* Annual Target */}
                            <td className="py-2.5 px-3 text-center font-bold text-amber-900 bg-amber-50/30 border-l border-amber-100 font-mono">
                              {item.annualTarget}
                            </td>

                            {/* Half Year */}
                            {(selectedQuarter === 'all' || selectedQuarter === 'half') && (
                              <td className="py-2.5 px-3 text-center text-slate-700 border-l border-slate-100 font-mono">
                                {item.halfYearTarget ?? '-'}
                              </td>
                            )}

                            {/* Q1 */}
                            {(selectedQuarter === 'all' || selectedQuarter === 'Q1') && (
                              <td className="py-2.5 px-3 text-center border-l border-slate-100 font-mono">
                                <span className="font-semibold text-slate-800">{item.q1Target}</span>
                                {item.q1Actual !== undefined && item.q1Actual !== '' && (
                                  <span className="block text-[10px] text-emerald-700 font-bold">
                                    ክንውን: {item.q1Actual}
                                  </span>
                                )}
                              </td>
                            )}

                            {/* Q2 */}
                            {(selectedQuarter === 'all' || selectedQuarter === 'Q2') && (
                              <td className="py-2.5 px-3 text-center border-l border-slate-100 font-mono">
                                <span className="font-semibold text-slate-800">{item.q2Target}</span>
                                {item.q2Actual !== undefined && item.q2Actual !== '' && (
                                  <span className="block text-[10px] text-emerald-700 font-bold">
                                    ክንውን: {item.q2Actual}
                                  </span>
                                )}
                              </td>
                            )}

                            {/* Q3 */}
                            {(selectedQuarter === 'all' || selectedQuarter === 'Q3') && (
                              <td className="py-2.5 px-3 text-center border-l border-slate-100 font-mono">
                                <span className="font-semibold text-slate-800">{item.q3Target}</span>
                                {item.q3Actual !== undefined && item.q3Actual !== '' && (
                                  <span className="block text-[10px] text-emerald-700 font-bold">
                                    ክንውን: {item.q3Actual}
                                  </span>
                                )}
                              </td>
                            )}

                            {/* Q4 */}
                            {(selectedQuarter === 'all' || selectedQuarter === 'Q4') && (
                              <td className="py-2.5 px-3 text-center border-l border-slate-100 font-mono">
                                <span className="font-semibold text-slate-800">{item.q4Target}</span>
                                {item.q4Actual !== undefined && item.q4Actual !== '' && (
                                  <span className="block text-[10px] text-emerald-700 font-bold">
                                    ክንውን: {item.q4Actual}
                                  </span>
                                )}
                              </td>
                            )}

                            {/* Remarks */}
                            <td className="py-2.5 px-4 text-xs text-slate-600 border-l border-slate-100">
                              {item.remarks || '-'}
                            </td>

                            {/* Actions */}
                            <td className="py-2.5 px-3 text-center border-l border-slate-100">
                              <div className="flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100">
                                <button
                                  onClick={() => setEditingPlanItem(item)}
                                  className="p-1 rounded hover:bg-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer"
                                  title="ዕቅዱን አርትዕ"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`ዕቅድ ${item.code} - ${item.title} ይሰረዝ?`)) {
                                      deleteAnnualPlanItem(item.id);
                                      showToast('የዕቅዱ ዝርዝር ተሰርዟል');
                                    }
                                  }}
                                  className="p-1 rounded hover:bg-rose-100 text-slate-400 hover:text-rose-600 cursor-pointer"
                                  title="ዕቅዱን ሰርዝ"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: DAILY COORDINATOR WORK LOG */}
      {currentSubView === 'daily-log' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-600" />
                <span>የአስተባባሪው ዕለታዊ የስራ መዝገብ (Daily Ministry Activities)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                በየቀኑ የተሰሩ አገልግሎቶችን እዚህ ይመዝግቡ፤ ሲስተሙ በየወሩና በየሩብ ዓመቱ በቀጥታ ያጠቃልላል።
              </p>
            </div>

            <button
              onClick={() => setShowAddLogModal(true)}
              className="px-3.5 py-2 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>የዛሬን ስራ መዝግብ</span>
            </button>
          </div>

          {/* Daily Logs Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-3 w-28 font-bold">ቀን</th>
                    <th className="py-3 px-3 w-24 font-bold text-center">ወር / ሩብ</th>
                    <th className="py-3 px-4 min-w-[220px] font-bold">የተከናወነ ተግባር / አገልግሎት</th>
                    <th className="py-3 px-4 min-w-[180px] font-bold">የተገናኘበት ዕቅድ</th>
                    <th className="py-3 px-3 w-24 text-center font-bold">መጠን</th>
                    <th className="py-3 px-3 min-w-[140px] font-bold">ቦታ / የተሳተፉ</th>
                    <th className="py-3 px-4 min-w-[160px] font-bold">ማስታወሻ</th>
                    <th className="py-3 px-3 w-20 text-center font-bold">እርምጃ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {dailyLogs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        እስካሁን የተመዘገበ ዕለታዊ የስራ መዝገብ የለም። «የዛሬን ስራ መዝግብ» የሚለውን ይጫኑ።
                      </td>
                    </tr>
                  ) : (
                    dailyLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3 font-mono text-slate-600 text-[11px]">
                          {log.date}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-medium">
                            {log.month} ({log.quarter} ሩብ)
                          </span>
                        </td>
                        <td className="py-2.5 px-4 font-semibold text-slate-900">
                          {log.taskTitle}
                          {log.isUnplanned && (
                            <span className="ml-2 text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-medium">
                              ከታቀደው ውጪ
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-slate-600 text-[11px]">
                          {log.planItemCode ? (
                            <span className="font-mono text-indigo-700 font-bold">
                              [{log.planItemCode}] {log.categoryName}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">ሌላ ተጨማሪ አገልግሎት</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800">
                          {log.metricAccomplished ? `${log.metricAccomplished} ${log.unit || ''}` : '-'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                          {log.participantsOrLocation || '-'}
                        </td>
                        <td className="py-2.5 px-4 text-slate-500 text-[11px]">
                          {log.notes || '-'}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => {
                              if (confirm('ይህ የስራ መዝገብ ይሰረዝ?')) {
                                deleteDailyLog(log.id);
                                showToast('የስራ መዝገቡ ተሰርዟል');
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 cursor-pointer"
                            title="ሰርዝ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: MONTHLY SUMMARY GENERATOR */}
      {currentSubView === 'monthly-summary' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>የወርሃዊ ክንውን ማጠቃለያ ጀነሬተር (Monthly Performance Rollup)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                በአስተባባሪው የተመዘገቡትን ዕለታዊ ስራዎች በወር አጠቃሎ የሚያዘጋጅ
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">ወር ምረጥ፦</span>
              <select
                value={selectedMonthForSummary}
                onChange={(e) => setSelectedMonthForSummary(e.target.value)}
                className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-300 bg-emerald-50 text-emerald-950 focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                {ETHIOPIAN_MONTHS.map(m => (
                  <option key={m} value={m}>{m} ወር</option>
                ))}
              </select>
            </div>
          </div>

          {/* Monthly Overview Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">የወሩ ጠቅላላ የተመዘገቡ ስራዎች</span>
              <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
                {monthlyLogs.length}
              </div>
              <span className="text-[11px] text-emerald-600 mt-0.5 block">
                የ{selectedMonthForSummary} ወር ({getQuarterForMonth(selectedMonthForSummary)} ሩብ ዓመት)
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">ከዕቅድ ጋር የተገናኙ ስራዎች</span>
              <div className="text-2xl font-bold text-indigo-700 mt-1 font-mono">
                {monthlyLogs.filter(l => !l.isUnplanned).length}
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">ከ8ቱ የመንፈሳዊ ዘርፍ ዕቅዶች</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">ከታቀደው ውጪ የተሰሩ ስራዎች</span>
              <div className="text-2xl font-bold text-amber-700 mt-1 font-mono">
                {monthlyLogs.filter(l => l.isUnplanned).length}
              </div>
              <span className="text-[11px] text-amber-600 mt-0.5 block">ለሩብ ዓመት ሪፖርት «ሌሎች አገልግሎቶች» የሚገቡ</span>
            </div>
          </div>

          {/* Monthly Task Breakdown Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              የ{selectedMonthForSummary} ወር ዝርዝር የስራ ክንውኖች
            </h4>
            
            {monthlyLogs.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                በዚህ ወር የተመዘገበ ዕለታዊ የስራ መዝገብ የለም።
              </div>
            ) : (
              <div className="space-y-3">
                {monthlyLogs.map((log, idx) => (
                  <div key={log.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs flex items-center justify-center font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <h5 className="text-xs sm:text-sm font-bold text-slate-900">
                          {log.taskTitle}
                        </h5>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          ቀን፦ <span className="font-mono">{log.date}</span> | {log.planItemCode ? `ዕቅድ ኮድ፡ ${log.planItemCode} (${log.categoryName})` : 'ተጨማሪ አገልግሎት'}
                        </p>
                        {log.notes && (
                          <p className="text-[11px] text-slate-600 mt-1 italic">
                            ማስታወሻ፦ {log.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {log.metricAccomplished && (
                        <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-mono text-xs font-bold">
                          {log.metricAccomplished} {log.unit}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 4: QUARTERLY PERFORMANCE REPORT GENERATOR */}
      {currentSubView === 'quarterly-report' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>የሩብ ዓመት ክንውን ሪፖርት ጀነሬተርና ማጽደቂያ</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                የታቀዱ ስራዎችን፣ ከታቀደው ውጪ ሌሎች አገልግሎቶችን፣ ችግሮችን፣ መፍትሔዎችን፣ ምስጋናና ጸሎትን በአንድ ላይ የሚያዘጋጅ
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={selectedQuarterForReport}
                onChange={(e) => {
                  const q = e.target.value as any;
                  setSelectedQuarterForReport(q);
                  const matched = quarterlyReports.find(r => r.quarter === q);
                  if (matched) setActiveReportToView(matched);
                }}
                className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-300 bg-indigo-50 text-indigo-950 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="1ኛ ሩብ ዓመት">1ኛ ሩብ ዓመት (መስከረም - ኅዳር)</option>
                <option value="2ኛ ሩብ ዓመት">2ኛ ሩብ ዓመት (ታኅሣሥ - የካቲት)</option>
                <option value="3ኛ ሩብ ዓመት">3ኛ ሩብ ዓመት (መጋቢት - ግንቦት)</option>
                <option value="4ኛ ሩብ ዓመት">4ኛ ሩብ ዓመት (ሰኔ - ጳጉሜን)</option>
              </select>

              <button
                onClick={handleGenerateQuarterlyReport}
                className="px-3.5 py-1.5 text-xs font-bold bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>ሪፖርት ጀኔሬት አድርግ</span>
              </button>

              <button
                onClick={() => setShowPrintModal(true)}
                className="px-3.5 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>በይፋዊ ፎርማት አትም</span>
              </button>
            </div>
          </div>

          {/* Official Quarterly Report Display (Verbatim to Church Brief) */}
          {activeReportToView && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 print:p-0 print:border-none">
              {/* Church Report Header */}
              <div className="text-center border-b border-slate-200 pb-5">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block">
                  ብርብር ከተማ ቃለ ሕይወት ቤተክርስቲያን · ኤዴን ቻፕል
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  የ{activeReportToView.year} የ{activeReportToView.quarter} የመንፈሳዊ ዘርፍ የክንውን ሪፖርት
                </h2>
                <div className="flex items-center justify-center gap-4 text-xs text-slate-600 mt-2 font-medium">
                  <span>ሪፖርት አቅራቢ፦ <strong>{activeReportToView.preparedBy}</strong></span>
                  <span>·</span>
                  <span>ኃላፊነት፦ <strong>{activeReportToView.role}</strong></span>
                  <span>·</span>
                  <span>ቀን፦ <strong>{activeReportToView.date}</strong></span>
                </div>
              </div>

              {/* Part 1: Planned Tasks Performance Table */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>1. የታቀዱ ዋና ዋና ተግባራት አፈፃፀም ሰንጠረዥ</span>
                </h3>
                
                <div className="border border-slate-200 rounded-xl overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-800 text-[11px] font-bold">
                        <th className="py-2.5 px-3 w-16 text-center">ተ.ቁ</th>
                        <th className="py-2.5 px-4">ዝርዝር ተግባራት</th>
                        <th className="py-2.5 px-3 text-center w-24">መለኪያ</th>
                        <th className="py-2.5 px-3 text-center w-24">የታቀደ</th>
                        <th className="py-2.5 px-3 text-center w-24">የተከናወነ</th>
                        <th className="py-2.5 px-3 text-center w-20">ክንውን %</th>
                        <th className="py-2.5 px-4 min-w-[140px]">ምርመራ / ማስታወሻ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeReportToView.plannedTasks.slice(0, 15).map((t, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2 px-3 text-center font-mono font-medium text-slate-500">
                            {t.code}
                          </td>
                          <td className="py-2 px-4 font-medium text-slate-900">
                            {t.title}
                          </td>
                          <td className="py-2 px-3 text-center text-slate-600 font-mono">
                            {t.unit}
                          </td>
                          <td className="py-2 px-3 text-center font-mono font-semibold text-slate-800">
                            {t.planned}
                          </td>
                          <td className="py-2 px-3 text-center font-mono font-bold text-emerald-700">
                            {t.accomplished}
                          </td>
                          <td className="py-2 px-3 text-center font-mono font-bold">
                            <span className={`px-2 py-0.5 rounded text-[10px] ${
                              t.percent >= 100 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : t.percent >= 75 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {t.percent}%
                            </span>
                          </td>
                          <td className="py-2 px-4 text-slate-600 text-[11px]">
                            {t.remarks || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Part 2: Required Narrative Sections verbatim from User */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ሀ/ ሌሎች የተከናወኑ ተግባራት አገልግሎቶች */}
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
                  <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center justify-between">
                    <span>ሀ/ ሌሎች የተከናወኑ ተግባራት አገልግሎቶች</span>
                    <span className="text-[10px] font-mono text-amber-700 font-normal">(ከታቀደው ውጪ)</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-800">
                    {activeReportToView.otherAccomplishments.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="font-bold text-amber-800">{i + 1}.</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ለ/ ያጋጠሙ ችግሮች */}
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
                  <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wider">
                    ለ/ ያጋጠሙ ችግሮች
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-800">
                    {activeReportToView.challenges.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="font-bold text-rose-800">{i + 1}.</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ሐ/ የተወሰዱ የመፍትሔ እርምጃዎች */}
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
                  <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                    ሐ/ የተወሰዱ የመፍትሔ እርምጃዎች
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-800">
                    {activeReportToView.solutions.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="font-bold text-blue-800">{i + 1}.</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* መ/ ምስጋና */}
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                    መ/ ምስጋና
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-800">
                    {activeReportToView.thanksgivings.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="font-bold text-emerald-800">{i + 1}.</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* ሠ/ ጸሎት */}
              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-2">
                <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                  ሠ/ ጸሎት
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-800">
                  {activeReportToView.prayerRequests.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-bold text-indigo-800">{i + 1}.</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Signature Block matching exactly church submission requirements */}
              <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-700">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="font-semibold text-slate-900 mb-1">የዕቅድና ሪፖርት አቅራቢ፦</p>
                  <p>ስም፦ <strong className="text-slate-900">{activeReportToView.preparedBy}</strong></p>
                  <p className="mt-1">ኃላፊነት፦ <span className="text-slate-600">{activeReportToView.role}</span></p>
                  <p className="mt-1">ፊርማ፦ <span className="font-serif italic text-indigo-800">ገላትያ ደስታ</span></p>
                  <p className="mt-1">ቀን፦ <span className="font-mono">{activeReportToView.date}</span></p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="font-semibold text-slate-900 mb-1">አጽዳቂ የመሪዎች ሰብሳቢ፦</p>
                  <p>ስም፦ <strong className="text-slate-900">አቶ ዳዊት ጫመቶ</strong></p>
                  <p className="mt-1">ኃላፊነት፦ <span className="text-slate-600">የአባቶችና አመራር ሰብሳቢ</span></p>
                  <p className="mt-1">ፊርማ፦ <span className="font-serif italic text-indigo-800">ዳዊት ጫመቶ</span></p>
                  <p className="mt-1">ቀን፦ <span className="font-mono">{activeReportToView.date}</span></p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 5: ANNUAL CONSOLIDATED SUMMARY (የአመቱን በአንድ ላይ የሚያዘጋጅ) */}
      {currentSubView === 'annual-summary' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>የ2018 ዓ.ም ጥቅል ዓመታዊ ክንውን ሪፖርት (Annual Consolidated Rollup)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                ሁሉንም 4 ሩብ ዓመታት በማጣመር የአጠቃላይ ዓመቱን ዕቅድና ክንውን በአንድ ላይ የሚያዘጋጅ
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>የዓመቱን ሪፖርት አትም</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">ጠቅላላ የዓመት ዕቅድ ተግባራት</span>
              <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
                {annualPlan2018.length}
              </div>
              <span className="text-[11px] text-slate-400">በ8 ዋና ዋና ዘርፎች</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">1ኛ ሩብ ዓመት ክንውን</span>
              <div className="text-2xl font-bold text-emerald-700 mt-1 font-mono">
                94%
              </div>
              <span className="text-[11px] text-emerald-600">በተሳካ ሁኔታ የተጠናቀቀ</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">የተመዘገቡ ዕለታዊ ስራዎች</span>
              <div className="text-2xl font-bold text-indigo-700 mt-1 font-mono">
                {dailyLogs.length}
              </div>
              <span className="text-[11px] text-indigo-600">በአስተባባሪው የተከናወኑ</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">ከዕቅድ ውጪ የተሰሩ</span>
              <div className="text-2xl font-bold text-amber-700 mt-1 font-mono">
                {dailyLogs.filter(l => l.isUnplanned).length}
              </div>
              <span className="text-[11px] text-amber-600">ተጨማሪ አገልግሎቶች</span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD DAILY LOG */}
      {showAddLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm sm:text-base">የአስተባባሪው የዕለት ስራ መመዝገቢያ</h3>
              </div>
              <button 
                onClick={() => setShowAddLogModal(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDailyLog} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">ቀን</label>
                  <input
                    type="date"
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">ወር</label>
                  <select
                    value={logMonth}
                    onChange={(e) => {
                      const m = e.target.value;
                      setLogMonth(m);
                      setLogQuarter(getQuarterForMonth(m));
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {ETHIOPIAN_MONTHS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">ሩብ ዓመት</label>
                  <input
                    type="text"
                    value={`${logQuarter} ሩብ ዓመት`}
                    readOnly
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-100 font-semibold text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">የተከናወነ ተግባር / አገልግሎት ርዕስ *</label>
                <input
                  type="text"
                  placeholder="ለምሳሌ፡ በአባወራዎች ቤት ለቤት ጉብኝት ማካሄድ"
                  value={logTaskTitle}
                  onChange={(e) => setLogTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-amber-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">የተገናኘበት የ2018 ዕቅድ (ከ8ቱ ዘርፎች)</label>
                <select
                  value={logPlanItemId}
                  onChange={(e) => {
                    setLogPlanItemId(e.target.value);
                    if (!e.target.value) setLogIsUnplanned(true);
                    else setLogIsUnplanned(false);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="">-- ከታቀደው ውጪ / ሌላ ተጨማሪ አገልግሎት --</option>
                  {annualPlan2018.map(p => (
                    <option key={p.id} value={p.id}>
                      [{p.code}] {p.title} ({p.categoryName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">የተሰራው መጠን / ቁጥር</label>
                  <input
                    type="number"
                    placeholder="ለምሳሌ፡ 25"
                    value={logMetricAccomplished}
                    onChange={(e) => setLogMetricAccomplished(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">መለኪያ</label>
                  <input
                    type="text"
                    value={logUnit}
                    onChange={(e) => setLogUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">የተሳተፉ ሰዎች / የተካሄደበት ቦታ</label>
                <input
                  type="text"
                  placeholder="ለምሳሌ፡ መንደር 1 (ዳዊት ጫመቶ ቤት)"
                  value={logParticipantsOrLocation}
                  onChange={(e) => setLogParticipantsOrLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="unplannedCheck"
                  checked={logIsUnplanned}
                  onChange={(e) => setLogIsUnplanned(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <label htmlFor="unplannedCheck" className="text-xs text-slate-700 cursor-pointer font-medium">
                  ከታቀደው ውጪ የተከናወነ ተጨማሪ አገልግሎት ነው (በሩብ ዓመት ሪፖርት «ሀ/ ሌሎች» ስር እንዲመደብ)
                </label>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">ማስታወሻ / ውጤት</label>
                <textarea
                  rows={2}
                  placeholder="የተገኘ በረከት ወይም ማስታወሻ..."
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddLogModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  ይቅር
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold cursor-pointer"
                >
                  መዝግብ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PLAN ITEM & SPLIT QUARTERS */}
      {editingPlanItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-amber-400 font-mono font-bold">ኮድ፡ {editingPlanItem.code}</span>
                <h3 className="font-bold text-sm sm:text-base">{editingPlanItem.title} - ዕቅድ ማስተካከያ</h3>
              </div>
              <button 
                onClick={() => setEditingPlanItem(null)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">ተግባር ርዕስ</label>
                  <input
                    type="text"
                    value={editingPlanItem.title}
                    onChange={(e) => setEditingPlanItem({ ...editingPlanItem, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">መለኪያ</label>
                  <input
                    type="text"
                    value={editingPlanItem.unit}
                    onChange={(e) => setEditingPlanItem({ ...editingPlanItem, unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              {/* Annual Target with Split Button */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-amber-950">የዓመት ዕቅድ (Annual Target)</label>
                  <button
                    type="button"
                    onClick={() => {
                      const num = parseFloat(String(editingPlanItem.annualTarget));
                      if (!isNaN(num) && num > 0) {
                        const qVal = Math.round((num / 4) * 10) / 10;
                        const halfVal = Math.round((num / 2) * 10) / 10;
                        setEditingPlanItem({
                          ...editingPlanItem,
                          halfYearTarget: halfVal,
                          q1Target: qVal,
                          q2Target: qVal,
                          q3Target: qVal,
                          q4Target: qVal
                        });
                        showToast('የዓመቱ ዕቅድ በ4ቱ ሩብ ዓመታት በእኩል ተከፋፍሏል!');
                      }
                    }}
                    className="px-2.5 py-1 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <Divide className="w-3.5 h-3.5" />
                    <span>ለ4 ሩብ ዓመት እኩል ከፋፍል</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={editingPlanItem.annualTarget}
                  onChange={(e) => setEditingPlanItem({ ...editingPlanItem, annualTarget: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-amber-300 font-mono font-bold text-sm text-amber-900 bg-white"
                />
              </div>

              {/* 4 Quarters Individual Targets & Accomplishments */}
              <div className="space-y-2">
                <label className="font-bold text-slate-800 block">የ4ቱ ሩብ ዓመታት ዕቅዶችና ክንውን፦</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                    <span className="font-bold text-slate-700 block text-[11px]">1ኛ ሩብ</span>
                    <input
                      type="text"
                      placeholder="ዕቅድ"
                      value={editingPlanItem.q1Target}
                      onChange={(e) => setEditingPlanItem({ ...editingPlanItem, q1Target: e.target.value })}
                      className="w-full px-2 py-1 mt-1 rounded border border-slate-300 font-mono text-xs"
                    />
                    <input
                      type="text"
                      placeholder="ክንውን"
                      value={editingPlanItem.q1Actual || ''}
                      onChange={(e) => setEditingPlanItem({ ...editingPlanItem, q1Actual: e.target.value })}
                      className="w-full px-2 py-1 mt-1 rounded border border-emerald-300 font-mono text-xs text-emerald-800 font-bold"
                    />
                  </div>

                  <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                    <span className="font-bold text-slate-700 block text-[11px]">2ኛ ሩብ</span>
                    <input
                      type="text"
                      placeholder="ዕቅድ"
                      value={editingPlanItem.q2Target}
                      onChange={(e) => setEditingPlanItem({ ...editingPlanItem, q2Target: e.target.value })}
                      className="w-full px-2 py-1 mt-1 rounded border border-slate-300 font-mono text-xs"
                    />
                    <input
                      type="text"
                      placeholder="ክንውን"
                      value={editingPlanItem.q2Actual || ''}
                      onChange={(e) => setEditingPlanItem({ ...editingPlanItem, q2Actual: e.target.value })}
                      className="w-full px-2 py-1 mt-1 rounded border border-emerald-300 font-mono text-xs text-emerald-800 font-bold"
                    />
                  </div>

                  <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                    <span className="font-bold text-slate-700 block text-[11px]">3ኛ ሩብ</span>
                    <input
                      type="text"
                      placeholder="ዕቅድ"
                      value={editingPlanItem.q3Target}
                      onChange={(e) => setEditingPlanItem({ ...editingPlanItem, q3Target: e.target.value })}
                      className="w-full px-2 py-1 mt-1 rounded border border-slate-300 font-mono text-xs"
                    />
                    <input
                      type="text"
                      placeholder="ክንውን"
                      value={editingPlanItem.q3Actual || ''}
                      onChange={(e) => setEditingPlanItem({ ...editingPlanItem, q3Actual: e.target.value })}
                      className="w-full px-2 py-1 mt-1 rounded border border-emerald-300 font-mono text-xs text-emerald-800 font-bold"
                    />
                  </div>

                  <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                    <span className="font-bold text-slate-700 block text-[11px]">4ኛ ሩብ</span>
                    <input
                      type="text"
                      placeholder="ዕቅድ"
                      value={editingPlanItem.q4Target}
                      onChange={(e) => setEditingPlanItem({ ...editingPlanItem, q4Target: e.target.value })}
                      className="w-full px-2 py-1 mt-1 rounded border border-slate-300 font-mono text-xs"
                    />
                    <input
                      type="text"
                      placeholder="ክንውን"
                      value={editingPlanItem.q4Actual || ''}
                      onChange={(e) => setEditingPlanItem({ ...editingPlanItem, q4Actual: e.target.value })}
                      className="w-full px-2 py-1 mt-1 rounded border border-emerald-300 font-mono text-xs text-emerald-800 font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">ምርመራ / ማስታወሻ</label>
                <textarea
                  rows={2}
                  value={editingPlanItem.remarks || ''}
                  onChange={(e) => setEditingPlanItem({ ...editingPlanItem, remarks: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingPlanItem(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  ይቅር
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateAnnualPlanItem(editingPlanItem.id, editingPlanItem);
                    setEditingPlanItem(null);
                    showToast('የዕቅዱ መረጃ በተሳካ ሁኔታ ተሻሽሏል!');
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer"
                >
                  አስቀምጥ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW PLAN ITEM */}
      {showAddPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-sm sm:text-base">አዲስ የዕቅድ ዝርዝር መመዝገቢያ</h3>
              <button 
                onClick={() => setShowAddPlanModal(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePlanItem} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">ኮድ *</label>
                  <input
                    type="text"
                    placeholder="ለምሳሌ፡ 3.10"
                    value={newPlanCode}
                    onChange={(e) => setNewPlanCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">ዘርፍ *</label>
                  <select
                    value={newPlanCategoryId}
                    onChange={(e) => setNewPlanCategoryId(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {PLAN_CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.id}. {c.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">ዝርዝር ተግባር ርዕስ *</label>
                <input
                  type="text"
                  placeholder="የተግባሩ ሙሉ ስም..."
                  value={newPlanTitle}
                  onChange={(e) => setNewPlanTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">የዓመት ዕቅድ ግብ *</label>
                  <input
                    type="text"
                    placeholder="ለምሳሌ፡ 40 ወይም 4 ዙር"
                    value={newPlanAnnualTarget}
                    onChange={(e) => setNewPlanAnnualTarget(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">መለኪያ</label>
                  <input
                    type="text"
                    placeholder="በቁጥር፣ በዙር፣ በቡድን..."
                    value={newPlanUnit}
                    onChange={(e) => setNewPlanUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">ምርመራ / ማስታወሻ</label>
                <textarea
                  rows={2}
                  placeholder="ተጨማሪ ማብራሪያ..."
                  value={newPlanRemarks}
                  onChange={(e) => setNewPlanRemarks(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddPlanModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  ይቅር
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white font-bold cursor-pointer"
                >
                  ዕቅዱን መዝግብ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT DIALOG */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm">የህትመት እይታ (Print Preview)</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>አሁን አትም</span>
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 cursor-pointer"
                >
                  ዝጋ
                </button>
              </div>
            </div>

            {/* Printable Content */}
            <div className="p-4 border rounded-xl space-y-4 text-xs">
              <div className="text-center space-y-1">
                <h2 className="text-base font-bold">ብርብር ከተማ ቃለ ሕይወት ቤተክርስቲያን · ኤዴን ቻፕል</h2>
                <h3 className="text-sm font-semibold">{activeReportToView?.year} {activeReportToView?.quarter} የመንፈሳዊ ዘርፍ የክንውን ሪፖርት</h3>
              </div>

              <div className="border-t pt-2">
                <h4 className="font-bold text-xs mb-1">ሀ/ ሌሎች የተከናወኑ ተግባራት አገልግሎቶች፦</h4>
                {activeReportToView?.otherAccomplishments.map((a, i) => (
                  <p key={i} className="text-slate-700">{i + 1}. {a}</p>
                ))}
              </div>

              <div className="border-t pt-2">
                <h4 className="font-bold text-xs mb-1">ለ/ ያጋጠሙ ችግሮች፦</h4>
                {activeReportToView?.challenges.map((c, i) => (
                  <p key={i} className="text-slate-700">{i + 1}. {c}</p>
                ))}
              </div>

              <div className="border-t pt-2">
                <h4 className="font-bold text-xs mb-1">ሐ/ የተወሰዱ የመፍትሔ እርምጃዎች፦</h4>
                {activeReportToView?.solutions.map((s, i) => (
                  <p key={i} className="text-slate-700">{i + 1}. {s}</p>
                ))}
              </div>

              <div className="border-t pt-2 grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold text-xs mb-1">መ/ ምስጋና፦</h4>
                  {activeReportToView?.thanksgivings.map((t, i) => (
                    <p key={i} className="text-slate-700">{i + 1}. {t}</p>
                  ))}
                </div>
                <div>
                  <h4 className="font-bold text-xs mb-1">ሠ/ ጸሎት፦</h4>
                  {activeReportToView?.prayerRequests.map((p, i) => (
                    <p key={i} className="text-slate-700">{i + 1}. {p}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
