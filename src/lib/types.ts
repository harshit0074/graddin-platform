export type UserRole = 'student' | 'company' | 'admin';

export interface Profile {
  id: string;
  role: 'student' | 'admin';
  full_name: string | null;
  email: string | null;
  skills: string | null;
  education: string | null;
  experience: string | null;
  created_at: string;
}

export interface Company {
  id: string;
  company_name: string;
  email: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  about: string | null;
  location: string | null;
  is_verified: boolean;
  created_at: string;
}

export interface Internship {
  id: string;
  company_id: string;
  title: string;
  description: string | null;
  requirements: string | null;
  role_type: string | null;
  duration: string | null;
  stipend: string | null;
  location: string | null;
  application_deadline: string | null;
  is_active: boolean;
  created_at: string;
  company?: Company;
}

export interface Application {
  id: string;
  internship_id: string;
  student_id: string;
  cover_note: string | null;
  match_score: number | null;
  ai_feedback: string | null;
  status: 'applied' | 'shortlisted' | 'rejected' | 'selected';
  created_at: string;
  internship?: Internship;
  student?: Profile;
}
