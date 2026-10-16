import { Member, FamilyMember, AgeGroup } from '../types/chapel';
import { calculateAgeGroup } from './ageHelper';

/**
 * Calculates advancing student grade by 3 years, and handles young children entering school:
 * Age 4 -> ልጅ ማቆያ
 * Age 5 -> ደረጃ 1
 * Age 6 -> ደረጃ 2
 * Age 7 -> 1ኛ ክፍል
 */
export function advanceGrade(currentEducation?: string, newAge?: number): string {
  const trimmed = (currentEducation || '').trim();

  // If no prior education or blank, compute from new age
  if (!trimmed || trimmed === '-') {
    if (newAge === 4) return 'ልጅ ማቆያ';
    if (newAge === 5) return 'ደረጃ 1';
    if (newAge === 6) return 'ደረጃ 2';
    if (newAge === 7) return '1ኛ ክፍል';
    if (newAge === 8) return '2ኛ ክፍል';
    if (newAge === 9) return '3ኛ ክፍል';
    if (newAge && newAge < 4) return 'ከእድሜ በታች';
    return '';
  }

  // Preschool or ማቆያ
  if (trimmed.toLowerCase().includes('preschool') || trimmed.includes('ማቆያ')) {
    if (newAge && newAge >= 9) return `${newAge - 6}ኛ ክፍል`;
    if (newAge === 8) return '2ኛ ክፍል';
    if (newAge === 7) return '1ኛ ክፍል';
    if (newAge === 6) return 'ደረጃ 2';
    if (newAge === 5) return 'ደረጃ 1';
    if (newAge === 4) return 'ልጅ ማቆያ';
    return '1ኛ ክፍል';
  }

  // Match grades with numbers: "4", "4ኛ ክፍል", "Grade 4", etc.
  const matchNum = trimmed.match(/^(\d+)/);
  if (matchNum) {
    const origGrade = parseInt(matchNum[1], 10);
    const newGrade = origGrade + 3;
    if (newGrade <= 12) {
      return `${newGrade}ኛ ክፍል`;
    } else if (newGrade === 13) {
      return '1ኛ ዓመት ዩኒቨርሲቲ / ኮሌጅ';
    } else if (newGrade === 14) {
      return '2ኛ ዓመት ዩኒቨርሲቲ';
    } else if (newGrade === 15) {
      return '3ኛ ዓመት ዩኒቨርሲቲ';
    } else {
      return 'የመጀመሪያ ዲግሪ ተመራቂ';
    }
  }

  return trimmed;
}

/**
 * Applies the 2017 E.C. -> Current 3-year aging rule and generates unique family codes:
 * - eden101, eden102, eden103...
 * - Head of household age + 3
 * - Spouse age + 3
 * - Children age + 3, grade + 3, age 4 -> ልጅ ማቆያ, age 5 -> ደረጃ 1, age 6 -> ደረጃ 2
 */
export function enhanceMemberRecord(rawMember: Member, index: number): Member {
  const familyCode = `eden${101 + index}`;
  const newHeadAge = (rawMember.age || 0) + 3;
  const newHeadAgeGroup: AgeGroup = calculateAgeGroup(newHeadAge);

  // If head of household was a student
  let headEdu = rawMember.educationLevel;
  if (rawMember.profession === 'ተማሪ' || String(headEdu).match(/^\d+/)) {
    headEdu = advanceGrade(String(headEdu), newHeadAge);
  }

  const updatedFamilyMembers: FamilyMember[] = (rawMember.familyMembers || []).map((fam, famIdx) => {
    const newFamAge = (fam.age || 0) + 3;
    let newFamEdu = fam.education;
    let newOccupation = fam.occupation;

    // Check school advancement for child / student
    if (fam.relation === 'ልጅ' || fam.occupation === 'ተማሪ' || !fam.education) {
      const advanced = advanceGrade(fam.education, newFamAge);
      if (advanced) {
        newFamEdu = advanced;
        if (!newOccupation || newOccupation === 'ተማሪ' || newFamAge >= 4) {
          newOccupation = newFamAge < 18 ? 'ተማሪ' : (newOccupation || 'ተማሪ');
        }
      }
    }

    return {
      ...fam,
      id: fam.id || `f-${rawMember.householdNo || index + 1}-${famIdx + 1}`,
      age: newFamAge,
      education: newFamEdu,
      occupation: newOccupation
    };
  });

  return {
    ...rawMember,
    familyCode,
    age: newHeadAge,
    ageGroup: newHeadAgeGroup,
    educationLevel: headEdu,
    familyMembers: updatedFamilyMembers
  };
}

export function enhanceAllMembers(members: Member[]): Member[] {
  return members.map((m, idx) => enhanceMemberRecord(m, idx));
}
