/**
 * AI Candidate Ranking & Matching Utility
 * 
 * Computes a match score (0 - 100) and automated AI feedback
 * by comparing a student's skills, education, and experience 
 * against the internship's title, description, and requirements.
 */

interface MatchInput {
  student: {
    skills?: string | null;
    education?: string | null;
    experience?: string | null;
    coverNote?: string | null;
  };
  internship: {
    title: string;
    description?: string | null;
    requirements?: string | null;
    role_type?: string | null;
  };
}

interface MatchResult {
  score: number;
  feedback: string;
}

function containsWord(text: string, word: string): boolean {
  // Escape regex special characters
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Match as distinct word
  const regex = new RegExp(`(^|[^a-zA-Z0-9_])${escaped}([^a-zA-Z0-9_]|$)`, 'i');
  return regex.test(text);
}

export function calculateCandidateMatch(input: MatchInput): MatchResult {
  const { student, internship } = input;

  const studentSkills = student.skills || '';
  const studentExp = student.experience || '';
  const studentEdu = student.education || '';
  const coverNote = student.coverNote || '';

  const requirements = internship.requirements || '';
  const description = internship.description || '';
  const title = internship.title || '';

  const targetText = `${title} ${description} ${requirements}`.toLowerCase();
  const studentProfileText = `${studentSkills} ${studentExp} ${studentEdu} ${coverNote}`.toLowerCase();

  // Extract key technical and domain keywords
  const commonKeywords = [
    'react', 'next.js', 'nextjs', 'javascript', 'typescript', 'node', 'nodejs', 'python',
    'sql', 'postgres', 'postgresql', 'supabase', 'mongodb', 'docker', 'aws', 'cloud',
    'tailwind', 'css', 'html', 'git', 'github', 'ui', 'ux', 'design', 'figma',
    'machine learning', 'ai', 'data science', 'analytics', 'marketing', 'sales',
    'content', 'finance', 'backend', 'frontend', 'fullstack', 'api', 'rest', 'graphql',
    'communication', 'teamwork', 'leadership', 'problem solving', 'agile'
  ];

  const matchedKeywords: string[] = [];
  let keywordPoints = 0;

  for (const kw of commonKeywords) {
    if (containsWord(targetText, kw)) {
      if (containsWord(studentProfileText, kw)) {
        matchedKeywords.push(kw);
        keywordPoints += 12;
      }
    }
  }

  // Base score starting at 35
  let baseScore = 35;

  if (student.skills && student.skills.trim().length > 10) baseScore += 10;
  if (student.experience && student.experience.trim().length > 15) baseScore += 10;
  if (student.education && student.education.trim().length > 5) baseScore += 5;
  if (student.coverNote && student.coverNote.trim().length > 20) baseScore += 10;

  let totalScore = Math.min(98, Math.max(30, baseScore + keywordPoints));

  // If no requirements matched at all and student has unrelated profile
  if (matchedKeywords.length === 0) {
    totalScore = Math.min(totalScore, 45);
  }

  // Construct feedback
  let feedback = '';
  if (matchedKeywords.length > 0) {
    feedback = `High relevance in core competencies: ${matchedKeywords.slice(0, 4).join(', ')}. Candidate demonstrates strong alignment with role requirements.`;
  } else if (totalScore >= 60) {
    feedback = `Foundational profile with relevant background. Recommended for preliminary review.`;
  } else {
    feedback = `Candidate profile does not exhibit primary requirements for this role. Consider additional project review.`;
  }

  return {
    score: totalScore,
    feedback,
  };
}
