import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, Users } from 'lucide-react';
import { Member, EducationLevel, Profession, HousingStatus, Gender } from '../../types/chapel';
import { useChapel } from '../../context/ChapelContext';

interface MemberFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberToEdit?: Member | null;
}

const EDUCATION_OPTIONS: EducationLevel[] = [
  'መሠረታዊ/ያልተማረ',
  '1-8ኛ ክፍል',
  '9-12ኛ ክፍል',
  'ሰርተፊኬት',
  'ዲፕሎማ',
  'የመጀመሪያ ዲግሪ',
  'ሁለተኛ ዲግሪ (ማስተርስ)',
  'ዶክትሬት (PhD)'
];

const PROFESSION_OPTIONS: Profession[] = [
  'የመንግስት ሰራተኛ',
  'የግል ሰራተኛ',
  'ነጋዴ',
  'ገበሬ',
  'የቀን ሰራተኛ',
  'ተማሪ',
  'የቤት እመቤት',
  'ጡረተኛ',
  'የግል ስራ',
  'ሌላ'
];

const MINISTRY_OPTIONS = [
  'አጠቃላይ አባል',
  'የቻፕሉ አባት መሪዎች (ሽማግሌዎች)',
  'የቻፕሉ ሴት መሪዎች',
  'የወጣት መሪዎች',
  'የልጆች መሪዎች',
  'ዲያቆናት አገልግሎት',
  'የእርቅ አገልግሎት ኮሚቴ',
  'የወንጌል ማሕበርተኛ ኮሚቴ',
  'የዝማሬና አምልኮ አገልግሎት',
  'የጸሎትና ምልጃ አገልጋይ'
];

export const MemberFormModal: React.FC<MemberFormModalProps> = ({
  isOpen,
  onClose,
  memberToEdit
}) => {
  const { addMember, updateMember, discipleshipGroups } = useChapel();

  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<Gender>('ወንድ');
  const [age, setAge] = useState<number>(30);
  const [phone, setPhone] = useState('');
  const [educationLevel, setEducationLevel] = useState<EducationLevel | string>('1-8ኛ ክፍል');
  const [profession, setProfession] = useState<Profession | string>('ነጋዴ');
  const [isBaptized, setIsBaptized] = useState(true);
  const [paysTithe, setPaysTithe] = useState(true);
  const [participatesLordSupper, setParticipatesLordSupper] = useState(true);
  const [housingStatus, setHousingStatus] = useState<HousingStatus>('የግል');
  const [discipleshipGroup, setDiscipleshipGroup] = useState('');
  const [isPrayerWarrior, setIsPrayerWarrior] = useState(false);
  const [ministryDepartment, setMinistryDepartment] = useState('አጠቃላይ አባል');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (memberToEdit) {
      setFullName(memberToEdit.fullName);
      setGender(memberToEdit.gender);
      setAge(memberToEdit.age);
      setPhone(memberToEdit.phone);
      setEducationLevel(memberToEdit.educationLevel);
      setProfession(memberToEdit.profession);
      setIsBaptized(memberToEdit.isBaptized);
      setPaysTithe(memberToEdit.paysTithe);
      setParticipatesLordSupper(memberToEdit.participatesLordSupper);
      setHousingStatus(memberToEdit.housingStatus);
      setDiscipleshipGroup(memberToEdit.discipleshipGroup);
      setIsPrayerWarrior(memberToEdit.isPrayerWarrior);
      setMinistryDepartment(memberToEdit.ministryDepartment);
      setAddress(memberToEdit.address || '');
      setNotes(memberToEdit.notes || '');
    } else {
      setFullName('');
      setGender('ወንድ');
      setAge(30);
      setPhone('09');
      setEducationLevel('1-8ኛ ክፍል');
      setProfession('የግል ስራ');
      setIsBaptized(true);
      setPaysTithe(true);
      setParticipatesLordSupper(true);
      setHousingStatus('የግል');
      setDiscipleshipGroup(discipleshipGroups[0]?.name || 'ቡድን 1 - ቤርሳቤህ');
      setIsPrayerWarrior(false);
      setMinistryDepartment('አጠቃላይ አባል');
      setAddress('');
      setNotes('');
    }
  }, [memberToEdit, isOpen, discipleshipGroups]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    if (memberToEdit) {
      updateMember(memberToEdit.id, {
        fullName: fullName.trim(),
        gender,
        age: Number(age),
        phone: phone.trim(),
        educationLevel,
        profession,
        isBaptized,
        paysTithe,
        participatesLordSupper,
        housingStatus,
        discipleshipGroup,
        isPrayerWarrior,
        ministryDepartment,
        address: address.trim(),
        notes: notes.trim()
      });
    } else {
      addMember({
        fullName: fullName.trim(),
        gender,
        age: Number(age),
        phone: phone.trim(),
        educationLevel,
        profession,
        isBaptized,
        paysTithe,
        participatesLordSupper,
        housingStatus,
        discipleshipGroup,
        isPrayerWarrior,
        ministryDepartment,
        address: address.trim(),
        notes: notes.trim(),
        familyMembers: []
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              {memberToEdit ? <Save className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-semibold text-base leading-tight">
                {memberToEdit ? 'የአባል መረጃ ማረም / ማስተካከል' : 'አዲስ አባል መመዝገብ'}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                የኤዴን ቻፕል አባላት መረጃ ቅጽ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                ሙሉ ስም *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="ለምሳሌ፡ ዳዊት ጫመቶ"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 bg-white"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                ስልክ ቁጥር *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0910926126"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 font-mono"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                ጾታ *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender('ወንድ')}
                  className={`py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                    gender === 'ወንድ'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  ወንድ
                </button>
                <button
                  type="button"
                  onClick={() => setGender('ሴት')}
                  className={`py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                    gender === 'ሴት'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  ሴት
                </button>
              </div>
            </div>

            {/* Age & Demographic Bracket */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                ዕድሜ (ዓመት) *
              </label>
              <input
                type="number"
                min={0}
                max={120}
                required
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 font-mono"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                የዕድሜ ክልል፡ {age <= 14 ? '0-14 (ህፃናት)' : age <= 29 ? '15-29 (ወጣቶች)' : age <= 59 ? '30-59 (ጎልማሶች)' : '60+ (አረጋውያን)'}
              </span>
            </div>

            {/* Education Level */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                የትምህርት ደረጃ *
              </label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 bg-white"
              >
                {EDUCATION_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Profession */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                የሥራ ዓይነት *
              </label>
              <select
                value={profession}
                onChange={(e) => setProfession(e.target.value as Profession)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 bg-white"
              >
                {PROFESSION_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Housing Status */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                የቤት ሁኔታ (ክራይ ወይም የግል) *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setHousingStatus('የግል')}
                  className={`py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                    housingStatus === 'የግል'
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  የግል ቤት
                </button>
                <button
                  type="button"
                  onClick={() => setHousingStatus('ክራይ')}
                  className={`py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                    housingStatus === 'ክራይ'
                      ? 'bg-amber-800 text-white border-amber-800 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  የኪራይ ቤት
                </button>
              </div>
            </div>

            {/* Discipleship Group */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                የመንፈሳዊ ትምህርት / ህብረት ቡድን *
              </label>
              <select
                value={discipleshipGroup}
                onChange={(e) => setDiscipleshipGroup(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 bg-white"
              >
                {discipleshipGroups.map((g) => (
                  <option key={g.id} value={g.name}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Ministry Department */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                የአገልግሎት ዘርፍ
              </label>
              <select
                value={ministryDepartment}
                onChange={(e) => setMinistryDepartment(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 bg-white"
              >
                {MINISTRY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                አድራሻ / መንደር
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="ለምሳሌ፡ ብርብር ቀበሌ 01"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 bg-white"
              />
            </div>
          </div>

          {/* Spiritual Status Toggles */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3">
            <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
              መንፈሳዊና አገልግሎታዊ ሁኔታ
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
              {/* Baptized */}
              <label className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100/50">
                <input
                  type="checkbox"
                  checked={isBaptized}
                  onChange={(e) => setIsBaptized(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span className="text-xs font-medium text-slate-800">የተጠመቀ</span>
              </label>

              {/* Tithe */}
              <label className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100/50">
                <input
                  type="checkbox"
                  checked={paysTithe}
                  onChange={(e) => setPaysTithe(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span className="text-xs font-medium text-slate-800">አስራት የሚከፍል</span>
              </label>

              {/* Lord's Supper */}
              <label className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100/50">
                <input
                  type="checkbox"
                  checked={participatesLordSupper}
                  onChange={(e) => setParticipatesLordSupper(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span className="text-xs font-medium text-slate-800">የጌታ እራት የሚካፈል</span>
              </label>

              {/* Prayer Warrior */}
              <label className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100/50">
                <input
                  type="checkbox"
                  checked={isPrayerWarrior}
                  onChange={(e) => setIsPrayerWarrior(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span className="text-xs font-medium text-slate-800">በቡድኑ ያለ ጸላይ</span>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              ተጨማሪ ማስታወሻ
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ተጨማሪ መረጃ ካለ እዚህ ይጻፉ..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 bg-white"
            />
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              ተመለስ
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{memberToEdit ? 'ለውጦችን መዝግብ' : 'አባል መዝግብ'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
