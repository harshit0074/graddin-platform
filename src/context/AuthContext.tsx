"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserRole, Profile, Company, Internship, Application, NotificationItem, PlatformStats } from '@/lib/types';
import { calculateAIMatch } from '@/lib/ai-matcher';
import { isSuperAdminEmail } from '@/lib/constants';

export interface UserSession {
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
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  
  // Data collections
  companies: Company[];
  internships: Internship[];
  applications: Application[];
  notifications: NotificationItem[];
  savedInternshipIds: string[];
  
  // Actions
  toggleSaveInternship: (internshipId: string) => void;
  applyToInternship: (internshipId: string, coverNote: string) => Promise<{ application: Application; matchScore: number; aiFeedback: string }>;
  updateApplicationStatus: (applicationId: string, newStatus: Application['status']) => Promise<void>;
  postInternship: (newInternship: Partial<Internship>) => Promise<Internship>;
  updateInternship: (id: string, updates: Partial<Internship>) => Promise<void>;
  deleteInternship: (id: string) => Promise<void>;
  updateStudentProfile: (updates: Partial<Profile>) => Promise<void>;
  updateCompanyProfile: (updates: Partial<Company>) => Promise<void>;
  toggleCompanyVerification: (companyId: string) => Promise<void>;
  markNotificationsAsRead: () => void;
  getStats: () => PlatformStats;
  refreshData: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [savedInternshipIds, setSavedInternshipIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch current authenticated session from /api/auth/me
  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data?.authenticated && data.user) {
          const authUser = data.user;
          const userEmail = authUser.email || '';
          const isAdmin = isSuperAdminEmail(userEmail) || authUser.role === 'admin';
          const effectiveRole: UserRole = isAdmin ? 'admin' : (authUser.role || 'student');

          setUser({
            id: authUser.id,
            email: userEmail,
            role: effectiveRole,
            profile: data.user.profile || undefined,
            company: data.user.company || undefined,
          });
          return;
        }
      }
      setUser(null);
    } catch {
      setUser(null);
    }
  }, []);

  // 2. Fetch live internships, applications, and companies
  const refreshData = useCallback(async () => {
    try {
      const intRes = await fetch('/api/internships');
      if (intRes.ok) {
        const intData = await intRes.json();
        if (intData?.internships) {
          setInternships(intData.internships);
        }
      }
    } catch {}

    try {
      const appRes = await fetch('/api/applications');
      if (appRes.ok) {
        const appData = await appRes.json();
        if (appData?.applications) {
          setApplications(appData.applications);
        }
      }
    } catch {}

    try {
      const compRes = await fetch('/api/admin/companies');
      if (compRes.ok) {
        const compData = await compRes.json();
        if (compData?.companies) {
          setCompanies(compData.companies);
        }
      }
    } catch {}
  }, []);

  // Initialize on mount
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await refreshUser();
      await refreshData();
      setIsLoading(false);
    };
    init();
  }, [refreshUser, refreshData]);

  const login = async (email: string, password?: string): Promise<boolean> => {
    if (!email || !password) return false;
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      await refreshUser();
      await refreshData();
      return true;
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    setUser(null);
    setApplications([]);
    window.location.href = '/';
  };

  const toggleSaveInternship = (internshipId: string) => {
    setSavedInternshipIds(prev => 
      prev.includes(internshipId) 
        ? prev.filter(id => id !== internshipId)
        : [...prev, internshipId]
    );
  };

  const applyToInternship = async (internshipId: string, coverNote: string) => {
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          internship_id: internshipId,
          cover_note: coverNote,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to apply');
      }

      await refreshData();

      return {
        application: data.application,
        matchScore: data.ai_result?.score ?? 80,
        aiFeedback: data.ai_result?.feedback ?? 'Application received and scored by AI.',
      };
    } catch (err) {
      console.error('Apply error:', err);
      throw err;
    }
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: Application['status']) => {
    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setApplications(prev => prev.map(a => a.id === applicationId ? { ...a, status: newStatus } : a));
      }
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  const postInternship = async (newInternship: Partial<Internship>): Promise<Internship> => {
    try {
      const res = await fetch('/api/internships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInternship),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to post internship');
      }
      await refreshData();
      return data.internship;
    } catch (err) {
      console.error('Post internship error:', err);
      throw err;
    }
  };

  const updateInternship = async (id: string, updates: Partial<Internship>) => {
    try {
      const res = await fetch(`/api/internships/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        await refreshData();
      }
    } catch (err) {
      console.error('Update internship error:', err);
    }
  };

  const deleteInternship = async (id: string) => {
    try {
      const res = await fetch(`/api/internships/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await refreshData();
      }
    } catch (err) {
      console.error('Delete internship error:', err);
    }
  };

  const updateStudentProfile = async (updates: Partial<Profile>) => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: updates.full_name,
          skills: updates.skills,
          education: updates.education,
          experience: updates.experience,
        }),
      });
      if (res.ok) {
        await refreshUser();
      }
    } catch (err) {
      console.error('Update profile error:', err);
    }
  };

  const updateCompanyProfile = async (updates: Partial<Company>) => {
    // Company updates
    if (user?.company) {
      setUser(prev => prev ? { ...prev, company: { ...prev.company!, ...updates } } : null);
    }
  };

  const toggleCompanyVerification = async (companyId: string) => {
    const target = companies.find(c => c.id === companyId);
    const newStatus = !(target?.is_verified ?? false);
    try {
      const res = await fetch('/api/admin/companies', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_id: companyId, is_verified: newStatus }),
      });
      if (res.ok) {
        setCompanies(prev => prev.map(c => c.id === companyId ? { ...c, is_verified: newStatus } : c));
      }
    } catch (err) {
      console.error('Toggle verification error:', err);
    }
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getStats = (): PlatformStats => {
    return {
      totalStudents: applications.length + 1,
      totalCompanies: companies.length,
      unverifiedCompanies: companies.filter(c => !c.is_verified).length,
      totalInternships: internships.length,
      totalApplications: applications.length,
    };
  };

  const currentRole: UserRole | 'guest' = user ? user.role : 'guest';

  return (
    <AuthContext.Provider
      value={{
        user,
        role: currentRole,
        isLoading,
        login,
        logout,
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
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
