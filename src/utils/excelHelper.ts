import * as XLSX from 'xlsx';
import { calculateAgeGroup } from '../data/seedData';
import { Member, EducationLevel, Profession, HousingStatus, Gender } from '../types/chapel';

export function exportMembersToExcel(members: Member[], fileName: string = 'ኤዴን_ቻፕል_የአባላት_ዝርዝር.xlsx') {
  const exportData = members.map((m, index) => {
    const familySummary = m.familyMembers && m.familyMembers.length > 0
      ? m.familyMembers.map(f => `${f.fullName} (${f.relation || 'ቤተሰብ'}, ${f.age || ''}ዓመት)`).join('፤ ')
      : '';

    return {
      'ልዩ መለያ ኮድ': m.familyCode || `eden${101 + index}`,
      'ተ.ቁ / የቤት ቁጥር': m.householdNo || index + 1,
      'ሙሉ ስም': m.fullName,
      'ጾታ': m.gender,
      'ዕድሜ': m.age,
      'የዕድሜ ክልል': m.ageGroup,
      'ስልክ ቁጥር': m.phone || '-',
      'የትምህርት ደረጃ': m.educationLevel,
      'የሥራ ዓይነት': m.profession,
      'የተጠመቀ': m.isBaptized ? 'የተጠመቀ' : 'ያልተጠመቀ',
      'የጌታ እራት የሚካፈል': m.participatesLordSupper ? 'የሚካፈል' : 'የማይካፈል',
      'አስራት የሚከፍል': m.paysTithe ? 'የሚከፍል' : 'የማይከፍል',
      'የጋብቻ ሁኔታ': m.maritalStatus || 'ያገባ',
      'የአባልነት ሁኔታ': m.membershipStatus || 'አባል',
      'የቤት ሁኔታ': m.housingStatus === 'የግል' ? 'የግል' : 'ክራይ',
      'ቻፕል': m.chapelName || 'Eden',
      'የአገልግሎት ኃላፊነት': m.responsibility || '-',
      'መንፈሳዊ ትምህርት': m.spiritualEdu || '-',
      'የመንፈሳዊ ትምህርት ቡድን': m.discipleshipGroup,
      'በቡድኑ ያለ ጸላይ': m.isPrayerWarrior ? 'አዎ' : 'አይደለም',
      'የአገልግሎት ዘርፍ': m.ministryDepartment,
      'የባለቤት ስም': m.spouseName || '-',
      'የቤተሰብ አባላት ብዛት': m.familyMembers ? m.familyMembers.length : 0,
      'የቤተሰብ ዝርዝር': familySummary,
      'የተመዘገበበት ቀን': m.registeredDate || ''
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 16 }, // ተ.ቁ / የቤት ቁጥር
    { wch: 22 }, // ሙሉ ስም
    { wch: 8 },  // ጾታ
    { wch: 8 },  // ዕድሜ
    { wch: 12 }, // የዕድሜ ክልል
    { wch: 14 }, // ስልክ ቁጥር
    { wch: 18 }, // የትምህርት ደረጃ
    { wch: 18 }, // የሥራ ዓይነት
    { wch: 12 }, // የተጠመቀ
    { wch: 16 }, // የጌታ እራት
    { wch: 14 }, // አስራት
    { wch: 14 }, // የጋብቻ ሁኔታ
    { wch: 14 }, // የአባልነት ሁኔታ
    { wch: 12 }, // የቤት ሁኔታ
    { wch: 10 }, // ቻፕል
    { wch: 18 }, // ኃላፊነት
    { wch: 16 }, // መንፈሳዊ ትምህርት
    { wch: 22 }, // ቡድን
    { wch: 12 }, // ጸላይ
    { wch: 22 }, // የአገልግሎት ዘርፍ
    { wch: 20 }, // የባለቤት ስም
    { wch: 16 }, // የቤተሰብ ብዛት
    { wch: 35 }, // የቤተሰብ ዝርዝር
    { wch: 14 }, // ቀን
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'የአባላት ዝርዝር');
  XLSX.writeFile(workbook, fileName);
}

export function downloadSampleTemplate() {
  const sampleData = [
    {
      'ተ.ቁ / የቤት ቁጥር': 1,
      'ሙሉ ስም': 'ዳዊት ጫመቶ',
      'ጾታ': 'ወንድ',
      'ዕድሜ': 60,
      'ስልክ ቁጥር': '0910926126',
      'የትምህርት ደረጃ': 'ዲፕሎማ',
      'የሥራ ዓይነት': 'ጡረተኛ',
      'የተጠመቀ': 'የተጠመቀ',
      'የጌታ እራት የሚካፈል': 'የሚካፈል',
      'አስራት የሚከፍል': 'የሚከፍል',
      'የጋብቻ ሁኔታ': 'ያገባ',
      'የአባልነት ሁኔታ': 'አባል',
      'የቤት ሁኔታ': 'የግል',
      'ቻፕል': 'Eden',
      'የአገልግሎት ኃላፊነት': 'ደመፒቲ',
      'መንፈሳዊ ትምህርት': 'ቢቲሲፒ',
      'የመንፈሳዊ ትምህርት ቡድን': 'ቡድን 1 - ቤርሳቤህ',
      'በቡድኑ ያለ ጸላይ': 'አዎ',
      'የአገልግሎት ዘርፍ': 'የቻፕሉ አባት መሪዎች (ሽማግሌዎች)'
    },
    {
      'ተ.ቁ / የቤት ቁጥር': 4,
      'ሙሉ ስም': 'ታመነች ጥማሮ',
      'ጾታ': 'ሴት',
      'ዕድሜ': 30,
      'ስልክ ቁጥር': '0912000000',
      'የትምህርት ደረጃ': '1-8ኛ ክፍል',
      'የሥራ ዓይነት': 'ነጋዴ',
      'የተጠመቀ': 'የተጠመቀ',
      'የጌታ እራት የሚካፈል': 'የማይካፈል',
      'አስራት የሚከፍል': 'የሚከፍል',
      'የጋብቻ ሁኔታ': 'ያገባ',
      'የአባልነት ሁኔታ': 'አባል ያልሆነ',
      'የቤት ሁኔታ': 'ክራይ',
      'ቻፕል': 'Eden',
      'የአገልግሎት ኃላፊነት': '-',
      'መንፈሳዊ ትምህርት': '-',
      'የመንፈሳዊ ትምህርት ቡድን': 'ቡድን 3 - ሲዮን',
      'በቡድኑ ያለ ጸላይ': 'አይደለም',
      'የአገልግሎት ዘርፍ': 'አጠቃላይ አባል'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'ቅጽ ናሙና (Template)');
  XLSX.writeFile(workbook, 'ኤዴን_ቻፕል_የአባላት_መመዝገቢያ_ቅጽ.xlsx');
}

export async function parseExcelMembers(file: File): Promise<Member[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);

        const parsedMembers: Member[] = [];

        rawJson.forEach((row, idx) => {
          const name = String(row['ሙሉ ስም'] || row['ስም'] || row['Father Name'] || row['Name'] || row['FullName'] || '').trim();
          if (!name) return; // skip empty rows

          const genderRaw = String(row['ጾታ'] || row['Gender'] || '').trim();
          const gender: Gender = (genderRaw.includes('ሴት') || genderRaw.toLowerCase().startsWith('f')) ? 'ሴት' : 'ወንድ';

          const ageNum = Number(row['ዕድሜ'] || row['Age'] || 30);
          const age = isNaN(ageNum) || ageNum <= 0 ? 30 : ageNum;
          const ageGroup = calculateAgeGroup(age);

          let phone = String(row['ስልክ ቁጥር'] || row['ስልክ'] || row['Phone no.'] || row['Phone'] || '').trim();
          if (phone && phone.startsWith('9') && phone.length === 9) phone = '0' + phone;

          const eduRaw = String(row['የትምህርት ደረጃ'] || row['Education Level'] || row['Education'] || '1-8ኛ ክፍል').trim();
          const profRaw = String(row['የሥራ ዓይነት'] || row['Occupation'] || row['Profession'] || 'የግል ስራ').trim();

          const isBaptizedRaw = String(row['የተጠመቀ'] || row['Baptism'] || '').trim().toLowerCase();
          const isBaptized = !isBaptizedRaw.includes('ያልተጠመቀ') && !isBaptizedRaw.includes('አልጠጠመቀችም') && !isBaptizedRaw.includes('no');

          const supperRaw = String(row['የጌታ እራት የሚካፈል'] || row['Lord Supper'] || '').trim().toLowerCase();
          const participatesLordSupper = !supperRaw.includes('የማይካፈል') && !supperRaw.includes('no');

          const titheRaw = String(row['አስራት የሚከፍል'] || row['Tithe'] || '').trim().toLowerCase();
          const paysTithe = !titheRaw.includes('የማይከፊል') && !titheRaw.includes('የማይከፍል') && !titheRaw.includes('no');

          const maritalStatus = String(row['የጋብቻ ሁኔታ'] || row['Marriage'] || 'ያገባ').trim();
          const membershipStatus = String(row['የአባልነት ሁኔታ'] || row['Participation'] || 'አባል').trim();

          const housingRaw = String(row['የቤት ሁኔታ'] || row['House Condition'] || '').trim();
          const housingStatus: HousingStatus = (housingRaw.includes('ክራይ') || housingRaw.toLowerCase().includes('rent')) ? 'ክራይ' : 'የግል';

          const group = String(row['የመንፈሳዊ ትምህርት ቡድን'] || row['ቡድን'] || row['Group'] || 'ቡድን 1 - ቤርሳቤህ').trim();

          const prayerRaw = String(row['በቡድኑ ያለ ጸላይ'] || row['ጸላይ'] || row['Prayer'] || '').trim().toLowerCase();
          const isPrayerWarrior = prayerRaw.includes('አዎ') || prayerRaw === 'yes' || prayerRaw === 'true' || prayerRaw === '1';

          const responsibility = String(row['የአገልግሎት ኃላፊነት'] || row['Responsibility'] || '').trim();
          const spiritualEdu = String(row['መንፈሳዊ ትምህርት'] || row['Spritual Edu.'] || '').trim();
          const ministry = String(row['የአገልግሎት ዘርፍ'] || row['Ministry'] || 'አጠቃላይ አባል').trim();
          const householdNo = row['ተ.ቁ / የቤት ቁጥር'] || row['No'] || idx + 1;

          const newMember: Member = {
            id: `imported-${Date.now()}-${idx}`,
            householdNo: householdNo as number | string,
            fullName: name,
            gender,
            age,
            ageGroup,
            phone: phone || '',
            educationLevel: eduRaw || '1-8ኛ ክፍል',
            profession: profRaw || 'የግል ስራ',
            isBaptized,
            paysTithe,
            participatesLordSupper,
            maritalStatus,
            membershipStatus,
            housingStatus,
            chapelName: 'Eden',
            responsibility: responsibility || undefined,
            spiritualEdu: spiritualEdu || undefined,
            discipleshipGroup: group,
            isPrayerWarrior,
            ministryDepartment: ministry,
            familyMembers: [],
            registeredDate: new Date().toISOString().split('T')[0]
          };

          parsedMembers.push(newMember);
        });

        resolve(parsedMembers);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}
