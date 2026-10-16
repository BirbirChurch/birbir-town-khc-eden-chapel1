import React, { useState } from 'react';
import { 
  Home, 
  User, 
  Heart, 
  Baby, 
  Phone, 
  GraduationCap, 
  Briefcase, 
  CheckCircle, 
  XCircle, 
  Shield, 
  Calendar, 
  Edit3, 
  Trash2, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check,
  BookOpen,
  Flame,
  Award
} from 'lucide-react';
import { Member, FamilyMember } from '../../types/chapel';

interface HouseholdHierarchyCardProps {
  member: Member;
  onEdit: (member: Member) => void;
  onDelete?: (id: string) => void;
  canManage?: boolean;
}

export const HouseholdHierarchyCard: React.FC<HouseholdHierarchyCardProps> = ({
  member,
  onEdit,
  onDelete,
  canManage = true
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  // Extract spouse and children from familyMembers
  const spouse = member.familyMembers?.find(
    f => f.relation === 'ባለቤት' || f.relation?.includes('ባለቤት') || f.fullName === member.spouseName
  );

  const childrenAndOthers = member.familyMembers?.filter(
    f => f !== spouse
  ) || [];

  const handleCopyCode = () => {
    if (member.familyCode) {
      navigator.clipboard.writeText(member.familyCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all overflow-hidden">
      {/* Top Header Strip with Unique Family Code */}
      <div className="bg-slate-900 text-white p-3.5 px-4 sm:px-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Family Code Badge */}
          <div className="flex items-center gap-1.5 bg-amber-500 text-slate-950 font-mono font-bold px-3 py-1 rounded-lg text-xs sm:text-sm shadow-xs">
            <span>መለያ ኮድ፦</span>
            <span className="text-sm sm:text-base font-extrabold tracking-wide">{member.familyCode || 'eden101'}</span>
            <button
              onClick={handleCopyCode}
              title="ኮዱን ቅዳ (Copy code)"
              className="ml-1 p-0.5 hover:bg-amber-600/30 rounded cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-950" /> : <Copy className="w-3.5 h-3.5 text-slate-900" />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">
              ቤተሰብ #{member.householdNo || '0'}
            </span>
            <span className="text-slate-500">·</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
              member.housingStatus === 'የግል' 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {member.housingStatus === 'የግል' ? 'የግል ቤት' : 'የኪራይ ቤት'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">
            {member.discipleshipGroup || 'ቡድን ያልተመደበ'}
          </span>

          {canManage && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(member)}
                title="የቤተሰብ መረጃ አርም"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              {onDelete && (
                <button
                  onClick={() => onDelete(member.id)}
                  title="አባል ሰርዝ"
                  className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer ml-1"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* 1. አባወራ (Head of Household) Section */}
          <div className="bg-slate-50/80 rounded-xl p-3.5 sm:p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg">👑</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      የቤተሰቡ ራስ (አባወራ)
                    </span>
                    {member.responsibility && (
                      <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-semibold">
                        {member.responsibility}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {member.fullName}
                  </h3>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                  member.isBaptized ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  ጥምቀት፦ {member.isBaptized ? 'የተጠመቀ' : 'ያልተጠመቀ'}
                </span>
                <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                  member.participatesLordSupper ? 'bg-purple-100 text-purple-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  የጌታ እራት፦ {member.participatesLordSupper ? 'የሚካፈል' : 'የማይካፈል'}
                </span>
                <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                  member.paysTithe ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  አስራት፦ {member.paysTithe ? 'የሚከፍል' : 'የማይከፍል'}
                </span>
              </div>
            </div>

            {/* Quick Grid of Head Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="bg-white p-2 rounded-lg border border-slate-200/80">
                <span className="text-[11px] text-slate-400 block">ጾታ / ዕድሜ</span>
                <span className="font-semibold text-slate-800">
                  {member.gender} · {member.age} ዓመት
                </span>
                <span className="text-[10px] text-amber-700 block font-mono">
                  [{member.ageGroup}]
                </span>
              </div>

              <div className="bg-white p-2 rounded-lg border border-slate-200/80">
                <span className="text-[11px] text-slate-400 block">ስልክ ቁጥር</span>
                <span className="font-semibold text-slate-800 font-mono">
                  {member.phone || 'የለም'}
                </span>
              </div>

              <div className="bg-white p-2 rounded-lg border border-slate-200/80">
                <span className="text-[11px] text-slate-400 block">የትምህርት ደረጃ</span>
                <span className="font-semibold text-slate-800 truncate block">
                  {member.educationLevel || '-'}
                </span>
              </div>

              <div className="bg-white p-2 rounded-lg border border-slate-200/80">
                <span className="text-[11px] text-slate-400 block">የሥራ ዓይነት</span>
                <span className="font-semibold text-slate-800 truncate block">
                  {member.profession || '-'}
                </span>
              </div>
            </div>

            {(member.spiritualEdu || member.isPrayerWarrior) && (
              <div className="mt-2.5 flex items-center gap-2 text-xs">
                {member.isPrayerWarrior && (
                  <span className="inline-flex items-center gap-1 text-[11px] bg-red-50 text-red-700 px-2 py-0.5 rounded-md font-semibold border border-red-200">
                    <Flame className="w-3 h-3 text-red-500" /> በቡድኑ ያለ ጸላይ
                  </span>
                )}
                {member.spiritualEdu && (
                  <span className="inline-flex items-center gap-1 text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-medium border border-indigo-200">
                    <BookOpen className="w-3 h-3 text-indigo-500" /> {member.spiritualEdu}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* 2. እማወራ / ባለቤት (Mother / Spouse) Section */}
          <div className="bg-amber-50/40 rounded-xl p-3.5 sm:p-4 border border-amber-200/70">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base sm:text-lg">🌸</span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                እማወራ (ባለቤት)
              </span>
            </div>

            {spouse || member.spouseName ? (
              <div className="bg-white p-3 rounded-lg border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-slate-900">
                    {spouse?.fullName || member.spouseName}
                  </h4>
                  <div className="text-slate-600 flex items-center gap-2 text-xs">
                    <span>ጾታ፦ ሴት</span>
                    <span className="text-slate-300">·</span>
                    <span>ዕድሜ፦ <strong>{spouse?.age ? `${spouse.age} ዓመት` : 'ያልተገለጸ'}</strong></span>
                    {spouse?.occupation && (
                      <>
                        <span className="text-slate-300">·</span>
                        <span>ሥራ፦ {spouse.occupation}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {spouse?.education && (
                    <span className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                      የት/ደረጃ፦ {spouse.education}
                    </span>
                  )}
                  {member.spousePhone && (
                    <span className="text-[11px] bg-blue-50 text-blue-700 font-mono px-2.5 py-1 rounded-md">
                      ስልክ፦ {member.spousePhone}
                    </span>
                  )}
                  <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                    spouse?.isBaptized ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {spouse?.isBaptized ? 'የተጠመቀች' : 'ያልተጠመቀች'}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                የተመዘገበ የባለቤት መረጃ የለም (ያላገባ / ባልቴት / አልተገለጸም)
              </p>
            )}
          </div>

          {/* 3. ልጆችና ተያያዥ የቤተሰብ አባላት (Children & Household Members) */}
          <div className="bg-slate-50/60 rounded-xl p-3.5 sm:p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg">🧒</span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  ልጆችና የቤተሰብ አባላት ({childrenAndOthers.length})
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                ዕድሜና የትምህርት ደረጃ በ3 ዓመት ተሻሽሎ የቀረበ
              </span>
            </div>

            {childrenAndOthers.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-2 bg-white rounded-lg border border-dashed border-slate-200 text-center">
                በዚህ አባወራ ስር የተመዘገቡ ልጆች የሉም።
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <thead>
                    <tr className="bg-slate-100/90 text-slate-600 border-b border-slate-200">
                      <th className="py-2 px-3 font-semibold">ተ.ቁ</th>
                      <th className="py-2 px-3 font-semibold">የልጅ ሙሉ ስም</th>
                      <th className="py-2 px-3 font-semibold">ዝምድና</th>
                      <th className="py-2 px-3 font-semibold">ጾታ</th>
                      <th className="py-2 px-3 font-semibold">ዕድሜ (የተሻሻለ)</th>
                      <th className="py-2 px-3 font-semibold">የትምህርት ደረጃ / ክፍል</th>
                      <th className="py-2 px-3 font-semibold">የሥራ / ተማሪ ሁኔታ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {childrenAndOthers.map((ch, idx) => (
                      <tr key={ch.id || idx} className="hover:bg-slate-50">
                        <td className="py-2 px-3 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="py-2 px-3 font-bold text-slate-900">
                          {ch.fullName}
                        </td>
                        <td className="py-2 px-3 text-slate-600">{ch.relation || 'ልጅ'}</td>
                        <td className="py-2 px-3 text-slate-600">{ch.gender}</td>
                        <td className="py-2 px-3 font-mono font-semibold text-amber-900">
                          {ch.age} ዓመት
                        </td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                            ch.education === 'ልጅ ማቆያ' 
                              ? 'bg-rose-100 text-rose-800'
                              : ch.education?.includes('ደረጃ')
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-blue-100 text-blue-900'
                          }`}>
                            {ch.education || 'ለእድሜው ያልደረሰ'}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-600">{ch.occupation || 'ተማሪ'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
