import type { Profile, Internship } from './types';

export interface AIMatchResult {
  score: number;
  feedback: string;
  matchedSkills: string[];
  growthAreas: string[];
}

export function calculateAIMatch(
  student: Partial<Profile>,
  internship: Partial<Internship>
): AIMatchResult {
  const studentSkills = (student.skills || "")
    .toLowerCase()
    .split(/[,|\n]/)
    .map(s => s.trim())
    .filter(Boolean);

  const reqSkills = (internship.skills || [])
    .map(s => s.toLowerCase())
    .concat(
      (internship.requirements || "")
        .toLowerCase()
        .split(/[,|\n]/)
        .map(s => s.trim())
        .filter(Boolean)
    );

  const matchedSkills: string[] = [];
  const growthAreas: string[] = [];

  reqSkills.forEach(req => {
    if (studentSkills.some(skill => skill.includes(req) || req.includes(skill))) {
      if (!matchedSkills.includes(req)) matchedSkills.push(req);
    } else {
      if (!growthAreas.includes(req)) growthAreas.push(req);
    }
  });

  const skillCoverage = reqSkills.length > 0 
    ? matchedSkills.length / Math.max(reqSkills.length, 1) 
    : 0.8;

  // Keyword relevance from experience and education
  const experienceText = `${student.experience || ''} ${student.education || ''} ${student.bio || ''}`.toLowerCase();
  const roleKeywords = `${internship.title || ''} ${internship.department || ''} ${internship.description || ''}`.toLowerCase();
  
  let keywordBonus = 0;
  const keywordsToCheck = ['react', 'next', 'figma', 'design', 'python', 'ai', 'typescript', 'frontend', 'backend', 'product', 'startup', 'growth', 'data', 'tailwind'];
  keywordsToCheck.forEach(kw => {
    if (roleKeywords.includes(kw) && experienceText.includes(kw)) {
      keywordBonus += 4;
    }
  });

  // Calculate base score: 45 - 98 range
  const rawScore = Math.round(55 + (skillCoverage * 35) + Math.min(keywordBonus, 10));
  const score = Math.min(Math.max(rawScore, 45), 98);

  // Generate recruiter insight commentary
  let feedback = "";
  if (score >= 90) {
    feedback = `Exceptional alignment with core competencies (${matchedSkills.slice(0, 3).join(", ") || "domain stack"}). Candidate demonstrates practical project mastery and will require minimal onboarding to contribute to shipping milestones.`;
  } else if (score >= 75) {
    feedback = `Strong candidate profile matching ${matchedSkills.length} key requirements. Prior project experience aligns well with the team's build velocity; growth opportunity in ${growthAreas[0] || "specialized tooling"}.`;
  } else if (score >= 60) {
    feedback = `Solid foundational match with demonstrated enthusiasm. Has relevant knowledge in ${matchedSkills.slice(0, 2).join(", ") || "core fundamentals"}, with recommended mentorship in ${growthAreas.slice(0, 2).join(", ") || "advanced production patterns"}.`;
  } else {
    feedback = `Emerging candidate with passionate motivation. Shows foundational potential, though production experience in ${growthAreas.slice(0, 2).join(", ") || "the specified technical stack"} would accelerate time to value.`;
  }

  return {
    score,
    feedback,
    matchedSkills: matchedSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
    growthAreas: growthAreas.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
  };
}

// Backwards compatibility alias for existing test suites & routes
export function calculateCandidateMatch(params: {
  student: { skills?: string | null; education?: string | null; experience?: string | null; coverNote?: string | null };
  internship: { title?: string; description?: string | null; requirements?: string | null; role_type?: string | null };
}): { score: number; feedback: string } {
  const result = calculateAIMatch(params.student, params.internship);
  return { score: result.score, feedback: result.feedback };
}
