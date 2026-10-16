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

export interface AnnualPlanItem {
  id: string;
  code: string; // e.g. "1.1", "2.1", "3.2"
  title: string;
  categoryId: number; // 1 to 8
  categoryName: string;
  unit: string; // "በቁጥር", "በዙር", "በቡድን", "በፐረሰንት", etc.
  annualTarget: number | string;
  halfYearTarget?: number | string;
  q1Target: number | string;
  q2Target: number | string;
  q3Target: number | string;
  q4Target: number | string;
  q1Actual?: number | string;
  q2Actual?: number | string;
  q3Actual?: number | string;
  q4Actual?: number | string;
  remarks?: string;
  autoCalculated?: boolean;
}

export interface DailyCoordinatorLog {
  id: string;
  date: string;
  month: string; // መስከረም፣ ጥቅምት፣ ወዘተ
  quarter: '1ኛ' | '2ኛ' | '3ኛ' | '4ኛ';
  taskTitle: string;
  categoryId?: number;
  categoryName?: string;
  planItemId?: string;
  planItemCode?: string;
  metricAccomplished?: number | string;
  unit?: string;
  participantsOrLocation?: string;
  isUnplanned: boolean; // ከታቀደው ውጪ የተሰራ ስራ
  notes?: string;
  createdAt: number;
}

export interface QuarterlyGeneratedReport {
  id: string;
  year: string;
  quarter: '1ኛ ሩብ ዓመት' | '2ኛ ሩብ ዓመት' | '3ኛ ሩብ ዓመት' | '4ኛ ሩብ ዓመት';
  preparedBy: string;
  role: string;
  date: string;
  plannedTasks: {
    code: string;
    title: string;
    unit: string;
    planned: number | string;
    accomplished: number | string;
    percent: number;
    remarks: string;
  }[];
  otherAccomplishments: string[]; // ሀ/ ሌሎች የተከናወኑ ተግባራት አገልግሎቶች
  challenges: string[]; // ለ/ ያጋጠሙ ችግሮች
  solutions: string[]; // ሐ/ የተወሰዱ የመፍትሔ እርምጃዎች
  thanksgivings: string[]; // መ/ ምስጋና
  prayerRequests: string[]; // ሠ/ ጸሎት
  status: 'ረቂቅ' | 'የጸደቀ';
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
