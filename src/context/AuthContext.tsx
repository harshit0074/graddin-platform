"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserRole, Profile, Company, Internship, Application, NotificationItem, PlatformStats } from '@/lib/types';
import { 
  mockCompanies, 
  mockInternships, 
  currentStudentProfile, 
  mockApplications, 
  mockNotifications 
} from '@/lib/data/mock-data';
import { calculateAIMatch } from '@/lib/ai-matcher';
import { isSuperAdminEmail } from '@/lib/constants';

interface UserSession {
  id: string;
  email: string;
  role: UserRole;
  profile?: Profile;
  company?: Company;
}

interface AuthContextType {
  user: UserSession | null;
  role: UserRole | 'guest';
  isLoading: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole | 'guest') => void;
  
  // Data collections
  companies: Company[];
  internships: Internship[];
  applications: Application[];
  notifications: NotificationItem[];
  savedInternshipIds: string[];
  
  // Actions
  toggleSaveInternship: (internshipId: string) => void;
  applyToInternship: (internshipId: string, coverNote: string) => Promise<{ application: Application; matchScore: number; aiFeedback: string }>;
  updateApplicationStatus: (applicationId: string, newStatus: Application['status']) => void;
  postInternship: (newInternship: Omit<Internship, 'id' | 'created_at' | 'is_active' | 'applicant_count' | 'company'>) => Promise<Internship>;
  updateInternship: (id: string, updates: Partial<Internship>) => void;
  deleteInternship: (id: string) => void;
  updateStudentProfile: (updates: Partial<Profile>) => void;
  updateCompanyProfile: (updates: Partial<Company>) => void;
  toggleCompanyVerification: (companyId: string) => void;
  markNotificationsAsRead: () => void;
  getStats: () => PlatformStats;
  refreshData: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [internships, setInternships] = useState<Internship[]>(mockInternships);
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [savedInternshipIds, setSavedInternshipIds] = useState<string[]>(["intern-1"]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = useCallback(async () => {
    // 1. Check live Supabase Auth session via /api/auth/me
    try {
      const meRes = await fetch('/api/auth/me');
      if (meRes.ok) {
        const meData = await meRes.json();
        if (meData?.user) {
          const authUser = meData.user;
          const userEmail = authUser.email || "";
          const isAdmin = isSuperAdminEmail(userEmail) || authUser.role === 'admin';
          const effectiveRole: UserRole = isAdmin ? 'admin' : (authUser.role || 'student');

          setUser({
            id: authUser.id,
            email: userEmail,
            role: effectiveRole,
            profile: meData.profile || {
              id: authUser.id,
              role: effectiveRole,
              full_name: authUser.user_metadata?.full_name || userEmail.split('@')[0],
              email: userEmail,
              skills: null,
              education: null,
              experience: null,
              created_at: authUser.created_at || new Date().toISOString(),
            },
            company: meData.company || undefined,
          });
          setIsLoading(false);
        }
      }
    } catch {
      // Offline or network error - fallback to local storage / mock
    }

    // 2. Fetch live internships
    try {
      const intRes = await fetch('/api/internships');
      if (intRes.ok) {
        const intData = await intRes.json();
        if (intData?.internships && intData.internships.length > 0) {
          setInternships(intData.internships);
        }
      }
    } catch {}

    // 3. Fetch live applications
    try {
      const appRes = await fetch('/api/applications');
      if (appRes.ok) {
        const appData = await appRes.json();
        if (appData?.applications && appData.applications.length > 0) {
          setApplications(appData.applications);
        }
      }
    } catch {}
  }, []);

  // Initialize from session, localStorage, or fallback
  useEffect(() => {
    const initAuth = async () => {
      try {
        const meRes = await fetch('/api/auth/me');
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData?.user) {
            const authUser = meData.user;
            const userEmail = authUser.email || "";
            const isAdmin = isSuperAdminEmail(userEmail) || authUser.role === 'admin';
            const effectiveRole: UserRole = isAdmin ? 'admin' : (authUser.role || 'student');

            setUser({
              id: authUser.id,
              email: userEmail,
              role: effectiveRole,
              profile: meData.profile || {
                id: authUser.id,
                role: effectiveRole,
                full_name: authUser.user_metadata?.full_name || userEmail.split('@')[0],
                email: userEmail,
                skills: null,
                education: null,
                experience: null,
                created_at: authUser.created_at || new Date().toISOString(),
              },
              company: meData.company || undefined,
            });
            setIsLoading(false);
            return;
          }
        }
      } catch {}

      // If no live Supabase session, check localStorage
      try {
        const storedRole = localStorage.getItem("graddin_user_role");
        if (storedRole === "company") {
          setUser({
            id: mockCompanies[0].id,
            email: mockCompanies[0].email || "founder@velo.ai",
            role: "company",
            company: mockCompanies[0],
          });
        } else if (storedRole === "admin") {
          setUser({
            id: "admin-1",
            email: "adminharshit@gmail.com",
            role: "admin",
            profile: {
              id: "admin-1",
              role: "admin",
              full_name: "GRADDIn Super Admin",
              email: "adminharshit@gmail.com",
              skills: null,
              education: null,
              experience: null,
              created_at: new Date().toISOString(),
            }
          });
        } else if (storedRole === "guest") {
          setUser(null);
        } else {
          // Default to student
          setUser({
            id: currentStudentProfile.id,
            email: currentStudentProfile.email || "aarav@campus.edu",
            role: "student",
            profile: currentStudentProfile,
          });
        }
      } catch {
        setUser({
          id: currentStudentProfile.id,
          email: currentStudentProfile.email || "aarav@campus.edu",
          role: "student",
          profile: currentStudentProfile,
        });
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
    refreshData();
  }, [refreshData]);

  const switchRole = (newRole: UserRole | 'guest') => {
    try {
      localStorage.setItem("graddin_user_role", newRole);
    } catch {}

    if (newRole === 'guest') {
      setUser(null);
    } else if (newRole === 'student') {
      setUser({
        id: currentStudentProfile.id,
        email: currentStudentProfile.email || "aarav@campus.edu",
        role: "student",
        profile: currentStudentProfile,
      });
    } else if (newRole === 'company') {
      setUser({
        id: companies[0]?.id || "comp-1",
        email: companies[0]?.email || "founders@velo.ai",
        role: "company",
        company: companies[0] || mockCompanies[0],
      });
    } else if (newRole === 'admin') {
      setUser({
        id: "admin-1",
        email: "adminharshit@gmail.com",
        role: "admin",
        profile: {
          id: "admin-1",
          role: "admin",
          full_name: "GRADDIn Super Admin",
          email: "adminharshit@gmail.com",
          skills: null,
          education: null,
          experience: null,
          created_at: new Date().toISOString(),
        }
      });
    }
  };

  const login = async (email: string, targetRole?: UserRole): Promise<boolean> => {
    const isAdmin = isSuperAdminEmail(email) || targetRole === 'admin';
    const effectiveRole: UserRole = isAdmin ? 'admin' : (targetRole || 'student');
    
    switchRole(effectiveRole);
    if (user) {
      setUser(prev => prev ? { ...prev, email, role: effectiveRole } : null);
    }
    return true;
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    switchRole('guest');
  };

  const toggleSaveInternship = (internshipId: string) => {
    setSavedInternshipIds(prev => 
      prev.includes(internshipId) 
        ? prev.filter(id => id !== internshipId)
        : [...prev, internshipId]
    );
  };

  const applyToInternship = async (internshipId: string, coverNote: string) => {
    const internship = internships.find(i => i.id === internshipId) || mockInternships[0];
    const studentProfile = user?.profile || currentStudentProfile;
    
    // Instant AI Matcher
    const { score, feedback } = calculateAIMatch(studentProfile, internship);

    const newApp: Application = {
      id: `app-${Date.now()}`,
      internship_id: internshipId,
      student_id: studentProfile.id,
      cover_note: coverNote,
      match_score: score,
      ai_feedback: feedback,
      status: 'applied',
      created_at: new Date().toISOString(),
      internship,
      student: studentProfile,
      stage_history: [
        { stage: "Applied", timestamp: new Date().toISOString() }
      ]
    };

    setApplications(prev => [newApp, ...prev]);

    // Update applicant count on internship
    setInternships(prev => prev.map(item => {
      if (item.id === internshipId) {
        return { ...item, applicant_count: (item.applicant_count || 0) + 1 };
      }
      return item;
    }));

    // Add notifications
    const newStudentNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      recipient_role: "student",
      recipient_id: studentProfile.id,
      title: "Application Submitted",
      message: `Your application to ${internship.company?.company_name || 'the startup'} was submitted with a ${score}% AI match score.`,
      type: "application",
      read: false,
      created_at: new Date().toISOString(),
      action_url: "/student/applications"
    };

    const newCompanyNotif: NotificationItem = {
      id: `notif-${Date.now() + 1}`,
      recipient_role: "company",
      recipient_id: internship.company_id,
      title: "New Candidate Applied",
      message: `${studentProfile.full_name || 'A student'} applied for ${internship.title} (${score}% Match).`,
      type: "application",
      read: false,
      created_at: new Date().toISOString(),
      action_url: "/company/candidates"
    };

    setNotifications(prev => [newStudentNotif, newCompanyNotif, ...prev]);

    // Send to backend API
    try {
      fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internship_id: internshipId, cover_note: coverNote }),
      }).catch(() => {});
    } catch {}

    return { application: newApp, matchScore: score, aiFeedback: feedback };
  };

  const updateApplicationStatus = (applicationId: string, newStatus: Application['status']) => {
    // Send to backend API
    try {
      fetch(`/api/applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      }).catch(() => {});
    } catch {}

    setApplications(prev => prev.map(app => {
      if (app.id === applicationId) {
        const history = app.stage_history || [];
        return {
          ...app,
          status: newStatus,
          stage_history: [...history, { stage: newStatus, timestamp: new Date().toISOString() }]
        };
      }
      return app;
    }));
  };

  const postInternship = async (data: Omit<Internship, 'id' | 'created_at' | 'is_active' | 'applicant_count' | 'company'>): Promise<Internship> => {
    const activeCompany = user?.company || companies[0];
    const newInternship: Internship = {
      ...data,
      id: `intern-${Date.now()}`,
      created_at: new Date().toISOString(),
      is_active: true,
      applicant_count: 0,
      company_id: activeCompany.id,
      company: activeCompany,
    };

    setInternships(prev => [newInternship, ...prev]);

    // Send to backend API
    try {
      fetch('/api/internships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInternship),
      }).catch(() => {});
    } catch {}

    return newInternship;
  };

  const updateInternship = (id: string, updates: Partial<Internship>) => {
    try {
      fetch(`/api/internships/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      }).catch(() => {});
    } catch {}

    setInternships(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteInternship = (id: string) => {
    try {
      fetch(`/api/internships/${id}`, { method: 'DELETE' }).catch(() => {});
    } catch {}

    setInternships(prev => prev.filter(item => item.id !== id));
  };

  const updateStudentProfile = (updates: Partial<Profile>) => {
    try {
      fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      }).catch(() => {});
    } catch {}

    if (user && user.role === 'student' && user.profile) {
      const updated = { ...user.profile, ...updates };
      setUser({ ...user, profile: updated });
    }
  };

  const updateCompanyProfile = (updates: Partial<Company>) => {
    if (user && user.role === 'company' && user.company) {
      const updated = { ...user.company, ...updates };
      setUser({ ...user, company: updated });
      setCompanies(prev => prev.map(c => c.id === updated.id ? updated : c));
    }
  };

  const toggleCompanyVerification = (companyId: string) => {
    const comp = companies.find(c => c.id === companyId);
    if (comp) {
      try {
        fetch('/api/admin/companies', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ company_id: companyId, is_verified: !comp.is_verified }),
        }).catch(() => {});
      } catch {}
    }

    setCompanies(prev => prev.map(c => {
      if (c.id === companyId) {
        const updated = { ...c, is_verified: !c.is_verified };
        if (user?.company?.id === companyId) {
          setUser({ ...user, company: updated });
        }
        return updated;
      }
      return c;
    }));
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getStats = (): PlatformStats => {
    return {
      totalStudents: 1420,
      totalCompanies: companies.length,
      unverifiedCompanies: companies.filter(c => !c.is_verified).length,
      totalInternships: internships.filter(i => i.is_active).length,
      totalApplications: applications.length,
    };
  };

  return (
    <AuthContext.Provider value={{
      user,
      role: user ? user.role : 'guest',
      isLoading,
      login,
      logout,
      switchRole,
      companies,
      internships,
      applications,
      notifications,
      savedInternshipIds,
      toggleSaveInternship,
      applyToInternship,
      updateApplicationStatus,
      postInternship,
      updateInternship,
      deleteInternship,
      updateStudentProfile,
      updateCompanyProfile,
      toggleCompanyVerification,
      markNotificationsAsRead,
      getStats,
      refreshData,
      refreshUser: refreshData,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
