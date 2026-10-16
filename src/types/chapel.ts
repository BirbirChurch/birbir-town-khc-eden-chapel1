export type AgeGroup = '0-14' | '15-29' | '30-59' | '60+';
export type Gender = 'ወንድ' | 'ሴት';

export type EducationLevel = 
  | 'መሠረታዊ/ያልተማረ'
  | '1-8ኛ ክፍል'
  | '9-12ኛ ክፍል'
  | 'ሰርተፊኬት'
  | 'ዲፕሎማ'
  | 'የመጀመሪያ ዲግሪ'
  | 'ሁለተኛ ዲግሪ (ማስተርስ)'
  | 'ዶክትሬት (PhD)';

export type Profession = 
  | 'የመንግስት ሰራተኛ'
  | 'የግል ሰራተኛ'
  | 'ነጋዴ'
  | 'ገበሬ'
  | 'የቀን ሰራተኛ'
  | 'ተማሪ'
  | 'የቤት እመቤት'
  | 'ጡረተኛ'
  | 'የግል ስራ'
  | 'ሌላ';

export type HousingStatus = 'የግል' | 'ክራይ';

export interface FamilyMember {
  id: string;
  fullName: string;
  relation: 'ባለቤት' | 'ልጅ' | 'እናት' | 'አባት' | 'እህት' | 'ወንድም' | 'ሌላ' | string;
  gender: Gender;
  age: number;
  education?: string;
  occupation?: string;
  isBaptized?: boolean;
}

export interface Member {
  id: string;
  householdNo?: number | string;
  familyCode?: string; // ልዩ መለያ ኮድ (ለምሳሌ eden101)
  fullName: string; // ሙሉ ስም
  gender: Gender;
  age: number;
  ageGroup: AgeGroup;
  phone: string;
  educationLevel: EducationLevel | string;
  profession: Profession | string;
  isBaptized: boolean; // የተጠመቀ
  paysTithe: boolean; // አስራት የሚከፍል
  participatesLordSupper: boolean; // የጌታ እራት የሚካፈል
  maritalStatus?: string; // ያገባ / ያላገባ / ባልቴት / የሞተበት / ባል የሌላት
  membershipStatus?: string; // አባል / አባል ያልሆነ
  housingStatus: HousingStatus; // የቤት ሁኔታ (ክራይ ወይም የግል)
  chapelName?: string; // Eden
  responsibility?: string; // የአገልግሎት ኃላፊነት (ደመፒቲ፣ ወዘተ)
  spiritualEdu?: string; // ቢቲሲፒ፣ ኤማሆስ፣ ወዘተ
  discipleshipGroup: string; // የመንፈሳዊ ትምህርት ቡድን
  isPrayerWarrior: boolean; // በቡድኑ ያለ ጸላይ / የጸሎት አገልጋይ
  ministryDepartment: string; // የአገልግሎት ዘርፍ
  familyMembers: FamilyMember[];
  spouseName?: string;
  spousePhone?: string;
  registeredDate: string;
  address?: string;
  notes?: string;
}

export interface LeadershipMessage {
  id: string;
  channelId: string;
  senderName: string;
  senderRole: string;
  senderPhone?: string;
  message: string;
  timestamp: string;
  createdAt?: number;
}

export interface LeaderPerson {
  id: string;
  order: number;
  name: string;
  role: string;
  phone: string;
}

export interface Committee {
  id: string;
  title: string;
  description: string;
  members: LeaderPerson[];
}

export interface DiscipleshipGroup {
  id: string;
  name: string;
  leaderName: string;
  leaderPhone: string;
  meetingDay: string;
  location: string;
  description?: string;
}

export interface ChapelPlan {
  id: string;
  title: string;
  targetCategory: string;
  quarter: string;
  year: string;
  progressPercent: number;
  status: 'በመከናወን ላይ' | 'የተጠናቀቀ' | 'በመጠባበቅ ላይ';
  coordinatorApproved: boolean;
  notes: string;
  updatedAt: string;
}

export interface ChapelReport {
  id: string;
  title: string;
  submittedBy: string;
  submitterRole: string;
  category: string;
  period: string;
  dateSubmitted: string;
  summary: string;
  achievements: string;
  challenges: string;
  status: 'የጸደቀ' | 'በመጠባበቅ ላይ' | 'ማስተካከያ የቀረበበት';
  feedbackNotes?: string;
}

export interface MemberFeedback {
  id: string;
  memberName: string;
  memberPhone: string;
  subject: string;
  message: string;
  date: string;
  status: 'አዲስ' | 'በመከታተል ላይ' | 'ተፈጻሚ ሆኗል';
  actionTakenNotes?: string;
}

export interface VisitationRequest {
  id: string;
  memberName: string;
  memberPhone: string;
  address: string;
  reason: 'የበረከትና የጸሎት' | 'የህመምተኛ ጸሎት' | 'የመጽናናት ጉብኝት' | 'መንፈሳዊ ምክር' | 'አስቸኳይ ጥሪ' | 'ሌላ';
  urgency: 'መደበኛ' | 'አስቸኳይ';
  preferredDate: string;
  details: string;
  requestedDate: string;
  status: 'በመጠባበቅ ላይ' | 'የተመደበ' | 'ተጎብኝቷል';
  assignedTeam?: string;
}

export type PortalType = 'coordinator' | 'leaders' | 'members';
