import { 
  Member, 
  Committee, 
  DiscipleshipGroup, 
  ChapelPlan, 
  ChapelReport, 
  MemberFeedback, 
  VisitationRequest,
  AgeGroup
} from '../types/chapel';

export const CHAPEL_INFO = {
  churchName: 'ብርብር ከተማ ቃለ ሕይወት ቤተክርስቲያን',
  chapelName: 'ኤዴን ቻፕል',
  coordinator: {
    title: 'የቻፕሉ አስተባባሪ',
    name: 'ወንጌላዊ ገላትያ ደስታ',
    phone: '0910000000',
    email: 'gela.desta@gmail.com'
  },
  establishedYear: '1974 ዓ.ም',
  location: 'ብርብር ከተማ፣ ጋሞ ዞን፣ ኢትዮጵያ'
};

export const DEFAULT_PINS = {
  coordinator: '7777', // አስተባባሪ
  leaders: '1234',      // መሪዎች
  members: '2024'       // አባላት
};

export { calculateAgeGroup } from '../utils/ageHelper';

export const INITIAL_COMMITTEES: Committee[] = [
  {
    id: 'fathers',
    title: 'የቻፕሉ አባት መሪዎች (ሽማግሌዎች)',
    description: 'የኤዴን ቻፕል አባቶች ጉባኤ መሪዎች',
    members: [
      { id: 'f-1', order: 1, name: 'አቶ ዳዊት ጫመቶ', role: 'ሰብሳቢ', phone: '0910926126' },
      { id: 'f-2', order: 2, name: 'ተመስገን መርድነህ', role: 'ም/ሰብሳቢ', phone: '0913233676' },
      { id: 'f-3', order: 3, name: 'ዳዊት ሞላ', role: '2ኛ ፀሐፊ', phone: '0916470213' },
      { id: 'f-4', order: 4, name: 'ማቴዎስ መስቀሌ', role: 'ንብረት', phone: '0916441389' },
      { id: 'f-5', order: 5, name: 'እየብ ታፈሰ', role: 'ሕሳብ ሹም', phone: '0910084177' },
      { id: 'f-6', order: 6, name: 'አበራ ፎላ', role: 'ገንዘብ ያዥ', phone: '0912232307' },
      { id: 'f-7', order: 7, name: 'በረገነ ባፋ', role: '1ኛ ፀሐፊ', phone: '0910151941' },
    ]
  },
  {
    id: 'women',
    title: 'የቻፕሉ ሴት መሪዎች',
    description: 'የኤዴን ቻፕል እህቶችና እናቶች አገልግሎት አመራር',
    members: [
      { id: 'w-1', order: 1, name: 'ምህረት ፎላ', role: 'ሰብሳቢ', phone: '0916401398' },
      { id: 'w-2', order: 2, name: 'ደመቀች ዳዊት', role: 'ም/ሰብሳቢ', phone: '0904001943' },
      { id: 'w-3', order: 3, name: 'ሰብሌወንጌል ባልጣ', role: 'ፀሐፊ', phone: '0916702127' },
      { id: 'w-4', order: 4, name: 'እቴነሽ ዘማ', role: 'ገንዘብ ያዥ', phone: '0920980327' },
      { id: 'w-5', order: 5, name: 'አልማዝ ባሳ', role: 'አባል', phone: '0949670539' },
      { id: 'w-6', order: 6, name: 'ደመቀች ባሳ', role: 'ሴቶች አምልኮ መባ ያዥ', phone: '0911000001' },
    ]
  },
  {
    id: 'youth',
    title: 'የወጣት መሪዎች',
    description: 'የኤዴን ቻፕል ወጣቶች ህብረት አመራር ቦታ',
    members: [
      { id: 'y-1', order: 1, name: 'ዮናታን ዳዊት', role: 'ሰብሳቢ', phone: '0912345671' },
      { id: 'y-2', order: 2, name: 'ኤፍሬም ተመስገን', role: 'ም/ሰብሳቢ', phone: '0912345672' },
      { id: 'y-3', order: 3, name: 'ሄኖክ ማቴዎስ', role: 'ፀሐፊ', phone: '0912345673' },
      { id: 'y-4', order: 4, name: 'ሳሙኤል አበራ', role: 'ገንዘብ ያዥ', phone: '0912345674' },
      { id: 'y-5', order: 5, name: 'ሩት በረገነ', role: 'የዝማሬ አስተባባሪ', phone: '0912345675' },
      { id: 'y-6', order: 6, name: 'ዳንኤል እየብ', role: 'የወንጌል አስተባባሪ', phone: '0912345676' },
      { id: 'y-7', order: 7, name: 'ሰላማዊት ደስታ', role: 'የህብረት አባል', phone: '0912345677' },
    ]
  },
  {
    id: 'children',
    title: 'የልጆች መሪዎች',
    description: 'የሰንበት ትምህርትና የህጻናት አገልግሎት አስተባባሪዎች',
    members: [
      { id: 'c-1', order: 1, name: 'ማቴዎስ ኩቼ', role: 'ሰብሳቢ', phone: '0916104253' },
      { id: 'c-2', order: 2, name: 'ወርቅነሽ ይገዙ', role: 'ም/ሰብሳቢ', phone: '0977134388' },
      { id: 'c-3', order: 3, name: 'ታምራት በቀለ', role: 'ፀሐፊ', phone: '0932565086' },
      { id: 'c-4', order: 4, name: 'ኢሳያስ ታዬ', role: 'ገንዘብ ያዥ', phone: '0939812242' },
      { id: 'c-5', order: 5, name: 'ጸጋነሽ ዳዊት', role: 'አስተባባሪ', phone: '0936861186' },
    ]
  },
  {
    id: 'deacons',
    title: 'ዲያቆናት አገልግሎት',
    description: 'የቅዱሳን ማዕድና ስርዓት አገልጋይ ዲያቆናት',
    members: [
      { id: 'd-1', order: 1, name: 'ሙሉነሽ ሀሊሎ', role: 'የዲያቆናት አስተባባሪ', phone: '0916709647' },
      { id: 'd-2', order: 2, name: 'ሰናይት ሻጳ', role: 'ዲያቆን', phone: '0970396814' },
      { id: 'd-3', order: 3, name: 'መሰለች ላቬና', role: 'ዲያቆን', phone: '0964413839' },
      { id: 'd-4', order: 4, name: 'በላይነሽ ባሻ', role: 'ዲያቆን', phone: '0984143396' },
      { id: 'd-5', order: 5, name: 'አበበች በየነ', role: 'ዲያቆን', phone: '0964121659' },
    ]
  },
  {
    id: 'reconciliation',
    title: 'የእርቅ አገልግሎት ኮሚቴ',
    description: 'የአባላት ሰላምና እርቅ አስፈጻሚ ኮሚቴ',
    members: [
      { id: 'r-1', order: 1, name: 'ዳዊት ደሳለኝ', role: 'ሰብሳቢ', phone: '0910611930' },
      { id: 'r-2', order: 2, name: 'መርዕድ ጅማ', role: 'ም/ሰብሳቢ', phone: '0913288647' },
      { id: 'r-3', order: 3, name: 'ሙሉነሽ ሀሊሎ', role: 'ፀሐፊ', phone: '0916709647' },
      { id: 'r-4', order: 4, name: 'ምህረት ፎላ', role: 'አባል', phone: '0916401398' },
      { id: 'r-5', order: 5, name: 'እንድሪያስ ቢጆ', role: 'አባል', phone: '0910654205' },
    ]
  },
  {
    id: 'evangelism',
    title: 'የወንጌል ማሕበርተኛ ኮሚቴ',
    description: 'የወንጌል ስርጭትና ሚስዮን ኮሚቴ',
    members: [
      { id: 'e-1', order: 1, name: 'ዘውድቱ አለማየሁ', role: 'ሰብሳቢ', phone: '0913249407' },
      { id: 'e-2', order: 2, name: 'አስራት ኢሳያስ', role: 'ም/ሰብሳቢ', phone: '0916071351' },
      { id: 'e-3', order: 3, name: 'ዳዊት ሞላ', role: '2ኛ ፀሐፊ', phone: '0916470213' },
      { id: 'e-4', order: 4, name: 'ደመቀች ዳዊት', role: 'ገንዘብ ያዥ', phone: '0904001943' },
      { id: 'e-5', order: 5, name: 'የሚስራች ሚጣ', role: 'አባል', phone: '0916208803' },
    ]
  }
];

export const INITIAL_DISCIPLESHIP_GROUPS: DiscipleshipGroup[] = [
  {
    id: 'group-1',
    name: 'ቡድን 1 - ቤርሳቤህ',
    leaderName: 'አቶ ዳዊት ጫመቶ',
    leaderPhone: '0910926126',
    meetingDay: 'ማክሰኞ ከሰዓት 11:30',
    location: 'ብርብር ቀበሌ 01 መንደር',
    description: 'የመጽሐፍ ቅዱስ ጥናትና የጸሎት ህብረት'
  },
  {
    id: 'group-2',
    name: 'ቡድን 2 - ኬብሮን',
    leaderName: 'ተመስገን መርድነህ',
    leaderPhone: '0913233676',
    meetingDay: 'ሐሙስ ከሰዓት 11:30',
    location: 'ብርብር ቀበሌ 02 መንደር',
    description: 'የእምነት እድገትና የምልጃ ጸሎት'
  },
  {
    id: 'group-3',
    name: 'ቡድን 3 - ሲዮን',
    leaderName: 'ምህረት ፎላ',
    leaderPhone: '0916401398',
    meetingDay: 'ረቡዕ ከሰዓት 11:00',
    location: 'ኤዴን ቻፕል አዳራሽ',
    description: 'የሴቶችና ቤተሰብ መንፈሳዊ ግንባታ'
  },
  {
    id: 'group-4',
    name: 'ቡድን 4 - ቤቴል',
    leaderName: 'ማቴዎስ መስቀሌ',
    leaderPhone: '0916441389',
    meetingDay: 'አርብ ከሰዓት 11:30',
    location: 'ብርብር ገበያ አካባቢ',
    description: 'የወንጌል ጥናትና የአንድነት ህብረት'
  },
  {
    id: 'group-5',
    name: 'ቡድን 5 - ኢየሩሳሌም',
    leaderName: 'ዘውድቱ አለማየሁ',
    leaderPhone: '0913249407',
    meetingDay: 'ሰኞ ከሰዓት 11:30',
    location: 'ብርብር ከፍተኛ ት/ቤት ጀርባ',
    description: 'የተማሪዎችና ወጣቶች የመጽሐፍ ቅዱስ ጥናት'
  }
];

import { OFFICIAL_EDEN_MEMBERS } from './officialEdenMembers';
import { enhanceAllMembers } from '../utils/householdEnhancer';

export const INITIAL_MEMBERS: Member[] = enhanceAllMembers(OFFICIAL_EDEN_MEMBERS);


export const INITIAL_PLANS: ChapelPlan[] = [
  {
    id: 'plan-01',
    title: 'የአባላት አጠቃላይ የቤት ለቤት መንፈሳዊ ጉብኝት ማካሄድ',
    targetCategory: 'የእረኝነትና ጉብኝት አገልግሎት',
    quarter: '1ኛ ሩብ ዓመት',
    year: '2017 ዓ.ም',
    progressPercent: 75,
    status: 'በመከናወን ላይ',
    coordinatorApproved: true,
    notes: 'በአምስቱም ቡድኖች 65 ቤተሰቦች ተጎብኝተዋል፤ ቀሪዎቹ እየተከናወኑ ነው',
    updatedAt: '2024-10-10'
  },
  {
    id: 'plan-02',
    title: 'የአዳዲስ አማኞች የጥምቀትና የመሠረተ እምነት ትምህርት ስልጠና',
    targetCategory: 'መንፈሳዊ ትምህርትና ስልጠና',
    quarter: '2ኛ ሩብ ዓመት',
    year: '2017 ዓ.ም',
    progressPercent: 40,
    status: 'በመከናወን ላይ',
    coordinatorApproved: true,
    notes: '12 ወጣቶችና አዳዲስ አባላት ትምህርቱን ጀምረዋል',
    updatedAt: '2024-10-05'
  },
  {
    id: 'plan-03',
    title: 'የቻፕሉን የመሪዎች አቅም ግንባታና የጸሎት አንድነት ጉባኤ ማካሄድ',
    targetCategory: 'አመራርና አደረጃጀት',
    quarter: '1ኛ ሩብ ዓመት',
    year: '2017 ዓ.ም',
    progressPercent: 100,
    status: 'የተጠናቀቀ',
    coordinatorApproved: true,
    notes: 'ለሁሉም 7 ኮሚቴዎች የጋራ ስልጠና ተሰጥቷል',
    updatedAt: '2024-09-25'
  },
  {
    id: 'plan-04',
    title: 'የአስራትና የበጎ አድራጎት ግንዛቤ ማስጨበጫ ሳምንት ማዘጋጀት',
    targetCategory: 'ፋይናንስና ድጋፍ',
    quarter: '2ኛ ሩብ ዓመት',
    year: '2017 ዓ.ም',
    progressPercent: 20,
    status: 'በመጠባበቅ ላይ',
    coordinatorApproved: false,
    notes: 'የጥናት ሰነድ በአስተባባሪው እየታየ ነው',
    updatedAt: '2024-10-12'
  }
];

export const INITIAL_REPORTS: ChapelReport[] = [
  {
    id: 'rep-01',
    title: 'የመጀመሪያ ሩብ ዓመት የሴቶች ህብረት የስራ አፈፃፀም ሪፖርት',
    submittedBy: 'ምህረት ፎላ',
    submitterRole: 'የሴቶች ሰብሳቢ',
    category: 'የሴቶች አገልግሎት',
    period: 'መስከረም - ጥቅምት 2017 ዓ.ም',
    dateSubmitted: '2024-10-08',
    summary: 'በሩብ ዓመቱ 4 የጸሎት ፕሮግራሞች፣ 2 የድሆች መረዳጃ መርሐ ግብሮች ተካሂደዋል',
    achievements: 'ለ15 ችግረኛ እናቶች የምግብና ልብስ ድጋፍ ተደርጓል፤ 3 የጸሎት ሌሊት ተካሂዷል',
    challenges: 'የመሰብሰቢያ ቦታ ጥበት በአዳራሹ ማሻሻያ ያስፈልጋል',
    status: 'የጸደቀ',
    feedbackNotes: 'በጣም የተመሰገነ ስራ ነው፤ ቀጣዩን በጀት አስተባባሪው አጽድቋል'
  },
  {
    id: 'rep-02',
    title: 'የአዳዲስ ጥማቂዎችና ተከታታይ ትምህርት ቡድኖች ሪፖርት',
    submittedBy: 'ተመስገን መርድነህ',
    submitterRole: 'ም/ሰብሳቢ',
    category: 'ትምህርትና ዲሲፕሊን',
    period: 'ጥቅምት 2017 ዓ.ም',
    dateSubmitted: '2024-10-11',
    summary: 'በየመንደሩ ባሉ 5ቱ ቡድኖች የመጽሐፍ ቅዱስ ጥናት በየሳምንቱ እየተካሄደ ይገኛል',
    achievements: 'የተማሪዎች ቁጥር ወደ 45 ከፍ ብሏል፤ ጸላያንም በየቡድኑ ተመድበዋል',
    challenges: 'የመማሪያ መጽሐፍት ማነስ',
    status: 'በመጠባበቅ ላይ',
    feedbackNotes: ''
  }
];

export const INITIAL_FEEDBACK: MemberFeedback[] = [
  {
    id: 'fb-01',
    memberName: 'አቶ አበራ ፎላ',
    memberPhone: '0912232307',
    subject: 'የቡድን 1 የመሰብሰቢያ ሰዓት ማስተካከያ',
    message: 'የማክሰኞ 11:30 የጥናት ሰዓት ለነጋዴዎች ትንሽ ስለሚያጥር ወደ 12:00 ቢዘገይ መልካም ነው',
    date: '2024-10-09',
    status: 'ተፈጻሚ ሆኗል',
    actionTakenNotes: 'ከቡድን አስተባባሪ ዳዊት ጫመቶ ጋር ተነጋግረን ወደ 12:00 እንዲሸጋገር ተደርጓል'
  },
  {
    id: 'fb-02',
    memberName: 'ሩት በረገነ',
    memberPhone: '0912345675',
    subject: 'የወጣቶች የዝማሬ መሳሪያዎች ጥገና',
    message: 'የኪቦርዱ ገመድና ማይክራፎኑ ድምጽ እያስቸገረ ስለሆነ በአስቸኳይ ቢጠገንልን',
    date: '2024-10-12',
    status: 'በመከታተል ላይ',
    actionTakenNotes: 'ለንብረት ክፍል ማቴዎስ መስቀሌ ተላልፏል'
  }
];

export const INITIAL_VISITATION_REQUESTS: VisitationRequest[] = [
  {
    id: 'vis-01',
    memberName: 'ወ/ሮ ታደለች ቦጋለ',
    memberPhone: '0910151941',
    address: 'ብርብር ገጠር መንደር፣ ከአቶ በረገነ ባፋ ቤት',
    reason: 'የህመምተኛ ጸሎት',
    urgency: 'አስቸኳይ',
    preferredDate: '2024-10-15',
    details: 'ከአልጋ ላይ መነሳት ተስኗቸው ስለነበር ሽማግሌዎች መጥተው በዘይት ቀብተው እንዲጸልዩላቸው',
    requestedDate: '2024-10-12',
    status: 'የተመደበ',
    assignedTeam: 'የእርቅና የአባቶች መሪዎች (ዳዊት ደሳለኝ እና ዳዊት ጫመቶ)'
  },
  {
    id: 'vis-02',
    memberName: 'ወ/ሮ ማርታ ገመቹ',
    memberPhone: '0913233676',
    address: 'ብርብር ቀበሌ 02',
    reason: 'የበረከትና የጸሎት',
    urgency: 'መደበኛ',
    preferredDate: '2024-10-18',
    details: 'ወደ አዲስ ቤት ስለገባን የአመስጋኝነት ጸሎት ከቤተክርስቲያን መሪዎች ጋር ማድረግ እንፈልጋለን',
    requestedDate: '2024-10-13',
    status: 'በመጠባበቅ ላይ'
  }
];
