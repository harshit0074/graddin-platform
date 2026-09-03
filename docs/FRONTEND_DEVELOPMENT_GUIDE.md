# 🚀 GRADDIN — Master Frontend Development & AI Prompting Guide

> **For Development Teams & AI Coding Agents**  
> This document is designed to be fed directly into **any AI coding agent** (Cursor, Claude, Antigravity, ChatGPT, v0.dev, etc.) on any computer to build, redesign, or extend the **GRADDIN** frontend seamlessly while maintaining 100% compatibility with the existing backend.

---

## 📋 Table of Contents
1. [Project Overview & Core Mission](#1-project-overview--core-mission)
2. [Tech Stack & Architecture Rules](#2-tech-stack--architecture-rules)
3. [Plug-and-Play Decoupled Contract](#3-plug-and-play-decoupled-contract)
4. [Complete Backend API Contract & TypeScript Types](#4-complete-backend-api-contract--typescript-types)
5. [How to Use shadcn/ui & UI Component Library](#5-how-to-use-shadcnui--ui-component-library)
6. [Component-by-Component Building Guide](#6-component-by-component-building-guide)
7. [Ready-to-Use AI Prompts (Copy & Paste for Your AI)](#7-ready-to-use-ai-prompts-copy--paste-for-your-ai)
8. [How to Integrate the Frontend into the Main Repository](#8-how-to-integrate-the-frontend-into-the-main-repository)
9. [Local Testing & Vercel Deployment Checklist](#9-local-testing--vercel-deployment-checklist)

---

## 1. Project Overview & Core Mission

**GRADDIN** is an exclusive platform dedicated **solely to internships**. Unlike generic job portals, GRADDIN eliminates senior job clutter and focuses strictly on high-impact student internships.

### Key Roles:
1. **👨‍🎓 Student**:
   - Builds text-based profile (skills, education, experience — *zero file uploads required*).
   - Explores internships with search and filters (role, location, stipend).
   - Applies with 1 click + optional cover note.
   - **Receives automated instant AI Candidate Match Score (0–100%) and recruiter feedback**.
2. **🏢 Company**:
   - Registers with company name and LinkedIn URL for authenticity verification.
   - Unverified companies are blocked from posting until manual admin review.
   - Verified companies can post unlimited openings.
   - **Reviews applicants ranked automatically from highest AI match score to lowest**.
   - 1-click status actions: *Shortlist*, *Select*, *Reject*.
3. **⚡ Admin (God Mode)**:
   - Hidden from the public UI; accessed automatically when logging in with an `admin` account.
   - Inspects company LinkedIn links and toggles verification status (*Verified* / *Unverified*).
   - Monitors all platform statistics, students, companies, and active listings.

---

## 2. Tech Stack & Architecture Rules

### Mandatory Technologies:
- **Language**: TypeScript (`.ts`, `.tsx`)
- **Framework**: Next.js 15 (App Router) & React 19
- **Styling**: Tailwind CSS v4
- **UI Components**: `shadcn/ui` (accessible Radix/Base-UI primitives)
- **Icons**: `lucide-react`
- **Backend / Database**: Supabase (PostgreSQL with Row Level Security)
- **Deployment**: Vercel (Auto-deploys from GitHub `main` branch)

### ⚠️ Strict AI Agent Rules:
1. **Do NOT break the `/api/*` endpoints**: The frontend MUST communicate with the existing Route Handlers (`/api/auth/*`, `/api/internships/*`, `/api/applications/*`, `/api/profile/*`, `/api/admin/*`).
2. **Do NOT add file upload forms**: Profile resumes and company verification proofs are strictly text and link-based to keep database storage lightweight and free.
3. **Always preserve the `useAuth()` hook**: Use the global `AuthContext` to get the logged-in user and their role (`student`, `company`, `admin`).

---

## 3. Plug-and-Play Decoupled Contract

The frontend and backend communicate strictly via HTTP JSON APIs.

```
┌──────────────────────────────────────────────────────────┐
│                   FRONTEND LAYER                         │
│  (Next.js Pages, React Components, Tailwind, shadcn/ui)  │
└──────────────────────────┬───────────────────────────────┘
                           │ HTTP JSON Requests (fetch)
                           ▼
┌──────────────────────────────────────────────────────────┐
│               BACKEND & API ROUTE LAYER                  │
│       (/api/auth, /api/internships, /api/applications)   │
└──────────────────────────┬───────────────────────────────┘
                           │ Supabase Client & RLS
                           ▼
┌──────────────────────────────────────────────────────────┐
│               DATABASE & AI MATCHING                     │
│  (Supabase PostgreSQL, Auth, AI Matching Algorithm)      │
└──────────────────────────────────────────────────────────┘
```

---

## 4. Complete Backend API Contract & TypeScript Types

### TypeScript Interfaces (`src/lib/types.ts`)
```typescript
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
  match_score: number | null; // 0 - 100% computed by AI
  ai_feedback: string | null;  // Recruiter insight generated by AI
  status: 'applied' | 'shortlisted' | 'rejected' | 'selected';
  created_at: string;
  internship?: Internship;
  student?: Profile;
}
```

---

### Backend REST API Endpoints

#### 1. Auth Endpoints
- **`GET /api/auth/me`**: Returns `{ authenticated: boolean, user: { id, email, role, profile?, company? } }`
- **`POST /api/auth/login`**:
  - Request: `{ "email": "...", "password": "..." }`
  - Response: `{ "success": true, "user": { ... } }`
- **`POST /api/auth/register`**:
  - Request:
    ```json
    {
      "email": "user@example.com",
      "password": "password123",
      "role": "student" | "company",
      "fullName": "Student Name (if student)",
      "skills": "React, Python, etc. (if student)",
      "education": "College Name (if student)",
      "experience": "Projects description (if student)",
      "companyName": "Acme Inc (if company)",
      "linkedinUrl": "https://linkedin.com/company/acme (if company)",
      "websiteUrl": "https://acme.com (if company)"
    }
    ```
- **`POST /api/auth/logout`**: Clears authentication cookies.

#### 2. Internship Endpoints
- **`GET /api/internships`**:
  - Query parameters:
    - `search`: filters across title, description, skills, and company name.
    - `location`: e.g. `Remote`, `Bangalore`.
    - `role_type`: e.g. `Full-time Internship`.
    - `company_id`: returns all postings for a specific company.
  - Response: `{ "internships": [ Internship, ... ] }`
- **`POST /api/internships`** *(Verified company required)*:
  - Request:
    ```json
    {
      "title": "Frontend Developer Intern",
      "description": "Role overview...",
      "requirements": "React, Next.js, Tailwind",
      "role_type": "Full-time Internship",
      "duration": "3 Months",
      "stipend": "₹20,000 / month",
      "location": "Remote"
    }
    ```
- **`PATCH /api/internships/[id]`**: Update posting.
- **`DELETE /api/internships/[id]`**: Delete posting.

#### 3. Application & AI Candidate Ranking Endpoints
- **`POST /api/applications`** *(Student role required)*:
  - Request: `{ "internship_id": "uuid", "cover_note": "..." }`
  - Response:
    ```json
    {
      "success": true,
      "application": { "id": "...", "status": "applied", "match_score": 92 },
      "ai_result": {
        "score": 92,
        "feedback": "High relevance in core competencies: react, next.js, typescript..."
      }
    }
    ```
- **`GET /api/applications`**:
  - If called by **Student**: Returns all applications submitted by the student.
  - If called by **Company**: Returns all applications for company postings, **sorted descending by `match_score` (AI Ranking)**.
  - If called by **Admin**: Returns all applications on the platform.
- **`PATCH /api/applications/[id]`**:
  - Request: `{ "status": "shortlisted" | "selected" | "rejected" }`

#### 4. Admin God Mode Endpoints
- **`GET /api/admin/stats`**: Returns `{ stats: { totalStudents, totalCompanies, unverifiedCompanies, totalInternships, totalApplications } }`
- **`GET /api/admin/companies`**: Returns list of all companies with their LinkedIn URLs.
- **`PATCH /api/admin/companies`**: `{ "company_id": "uuid", "is_verified": true | false }`
- **`GET /api/admin/users`**: Returns list of all registered users.

---

## 5. How to Use shadcn/ui & UI Component Library

All `shadcn/ui` components are located in `src/components/ui/`.

### Installing Additional shadcn Components:
If the team or AI wants to add any new shadcn component, run:
```bash
npx shadcn@latest add <component-name>
# Examples:
npx shadcn@latest add accordion sheet tooltip hover-card skeleton switch
```

### Key shadcn Components Already Installed:
- **`Dialog`**: For popups (AuthModal, ApplyModal, PostInternshipModal).
- **`Tabs`**: For switching views (Sign In vs Sign Up, Applications vs Profile).
- **`Badge`**: For role types, stipends, and verification tags.
- **`Card`**: For internship cards and dashboard metric widgets.
- **`Input` & `Textarea`**: For clean inputs with dark focus rings.
- **`Button`**: Customizable button states with loader spinners.
- **`DropdownMenu`**: For profile menus and status switchers.

---

## 6. Component-by-Component Building Guide

### 1. Navigation Bar (`src/components/Navbar.tsx`)
- Displays logo with gradient text (`GRADDIN Internships`).
- Navigation links: `Browse Roles`, `About`, `FAQ`.
- If logged out: `Sign In / Join` button opening `AuthModal`.
- If logged in as **Student**: shows `My Applications` shortcut and avatar initial.
- If logged in as **Company**: shows `Verification Status` badge (`Verified` or `Pending`) and `Company Dashboard` button.
- If logged in as **Admin**: shows glowing **⚡ Admin God Mode** badge.

### 2. Authentication Modal (`src/components/AuthModal.tsx`)
- Role Selector tab: toggle between **Student** (*"Apply to top roles"*) and **Company** (*"Hire intern talent"*).
- Student form collects: `Email`, `Password`, `Full Name`, `Skills`, `Education`, `Experience`.
- Company form collects: `Email`, `Password`, `Company Name`, `Official LinkedIn URL`, `Website URL`.
- Submits to `POST /api/auth/register` or `POST /api/auth/login`, then calls `refreshUser()` to auto-login.

### 3. Internship Card (`src/components/InternshipCard.tsx`)
- Displays company initial avatar, company name, verified badge checkmark, and LinkedIn external link.
- Displays tags: Location (MapPin), Stipend (Banknote), Duration (Clock), Role Type (Badge).
- Displays required skills chips and description snippet.
- Displays **"Apply Now"** button (or **"Already Applied"** state).

### 4. Application Modal (`src/components/ApplyModal.tsx`)
- Shows student profile preview (Skills, Education, Experience).
- Optional cover note textarea.
- On submit, calls `POST /api/applications` and immediately presents the **AI Evaluation Card**:
  - Displays large match percentage (e.g. `95% Match`).
  - Displays natural language AI recruiter feedback analysis.

### 5. Student Dashboard (`src/components/StudentDashboard.tsx`)
- **Tab 1: My Applications**: Displays list of applied cards with status badges (*Under Review*, *Shortlisted*, *Selected*, *Not Selected*) and the AI Match Score pill.
- **Tab 2: Edit Profile**: Form allowing students to update their skills, education, and bio anytime via `PATCH /api/profile`.

### 6. Company Dashboard (`src/components/CompanyDashboard.tsx`)
- **Verification Alert**: If unverified, shows warning banner with LinkedIn URL preview; disables posting button until admin approval.
- **Post Opening Modal**: Form to input Title, Location, Stipend, Duration, Role Type, Required Skills, and Description.
- **Split-Screen Recruiter Review**:
  - Left column: List of company's active listings.
  - Right column: **AI-Ranked Candidates** for the selected listing, sorted from highest match score to lowest.
  - Recruiter actions: 1-click `Shortlist`, `Select Candidate`, or `Reject`.

### 7. Admin God Mode Portal (`src/components/AdminPortal.tsx`)
- Platform Metrics Grid: Total Students, Total Companies, Pending Verifications, Total Internships, Total Applications.
- **Company Verification Table**:
  - Shows company name, email, website, and clickable **LinkedIn URL**.
  - One-click `Approve & Verify` / `Revoke Verification` button (`PATCH /api/admin/companies`).
- Master Internships & Platform Users directory.

---

## 7. Ready-to-Use AI Prompts (Copy & Paste for Your AI)

If your team is using an AI tool (Cursor, Claude, ChatGPT, v0.dev) to generate or customize UI components, copy and paste these exact prompts:

### 💬 Prompt 1: To Design a New Modern Hero & Internship Feed
> "I am building the frontend for GRADDIN, an internship-only platform using Next.js 15, React 19, Tailwind CSS v4, and shadcn/ui.
> Please create a modern, high-conversion Hero Section and Internship Card Feed.
> It should include:
> 1. Hero banner with dark glassmorphism, gradient headline ('Launch Your Career With High-Impact Internships'), search input by role/skills, and location filter.
> 2. Responsive grid of internship cards displaying company name, verified badge, stipend, location, duration, and required skills chips.
> 3. Each card should have an 'Apply Now' button that passes the internship object to an onApply callback.
> 4. Use lucide-react icons and shadcn Card, Badge, Input, and Button components."

### 💬 Prompt 2: To Design the AI Candidate Review Section for Recruiters
> "Create a split-screen Recruiter Review component for the GRADDIN platform in React + Tailwind CSS + shadcn/ui.
> Requirements:
> 1. Left side: list of posted internships with active badges and delete icons.
> 2. Right side: list of candidate applications ranked by AI Match Score (0–100%).
> 3. Each candidate card must display their name, email, education, skills tags, experience snippet, the AI Match percentage badge with glowing indigo gradient, and the natural language AI Recruiter Feedback quote.
> 4. Add recruiter action buttons: 'Shortlist', 'Select Candidate', and 'Reject'.
> 5. Match the existing TypeScript interface for Application and Internship."

### 💬 Prompt 3: To Design the Student Dashboard
> "Create a Student Dashboard for GRADDIN using Next.js, Tailwind CSS, and shadcn/ui Tabs.
> It needs two tabs:
> 1. 'My Applications': shows cards for each submitted application, displaying company name, internship title, application date, current status badge (Under Review / Shortlisted / Selected / Not Selected), and their calculated AI Match Score pill.
> 2. 'Edit Profile': a form to edit Full Name, Skills (comma-separated), Education, and Experience with a loading spinner button that submits to /api/profile."

---

## 8. How to Integrate the Frontend into the Main Repository

When your team or their AI creates/updates any frontend components, follow this simple 3-step integration process:

### Step 1: Place Files in the Correct Folder
- Put UI components in: `graddin-web/src/components/`
- Put page layouts in: `graddin-web/src/app/page.tsx`
- Put custom CSS in: `graddin-web/src/app/globals.css`

### Step 2: Test TypeScript & Build Locally
In the terminal:
```bash
cd "c:\Users\harsh\Desktop\graddin\graddin platform\graddin-web"
npx tsc --noEmit
npm run build
```
*(Ensure `npm run build` exits with code 0).*

### Step 3: Push to GitHub for Instant Vercel Auto-Deployment
```bash
git add .
git commit -m "feat: update frontend design and UI components"
git push origin main
```
Vercel will detect the push and automatically deploy the updated frontend live to **`https://graddin-platform.vercel.app/`** within 45 seconds!

---

## 9. Local Testing & Vercel Deployment Checklist

- [ ] Run `npm run dev` and test at `http://localhost:3000`.
- [ ] Test **Student Flow**: Sign up -> Browse roles -> Apply to role -> Verify AI Match Score is computed.
- [ ] Test **Company Flow**: Sign up with LinkedIn URL -> Check pending verification state.
- [ ] Test **Admin Flow**: Log in with Admin account -> Open God-Mode panel -> Click "Verify" on the company.
- [ ] Verify Company can now post internships.
- [ ] Run `npm run build` before pushing to ensure zero build errors.
- [ ] Push to GitHub (`git push origin main`) to trigger Vercel deployment.
