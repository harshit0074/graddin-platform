# API Contract Context

This document is the **single source of truth** for the GRADDIN backend API contract.
All backend logic is decoupled into clean Next.js App Router Route Handlers (`/api/*`) and Supabase PostgreSQL with RLS.

## 1. Authentication Endpoints

### `POST /api/auth/register`
- **Description**: Registers a new user (`student`, `company`, or `admin`).
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123",
    "role": "student" | "company" | "admin",
    "fullName": "Optional for students/admins",
    "companyName": "Required for company",
    "linkedinUrl": "Optional for company verification",
    "websiteUrl": "Optional for company",
    "skills": "Optional for student profile",
    "education": "Optional for student profile",
    "experience": "Optional for student profile"
  }
  ```
- **Responses**:
  - `200 OK`: `{ success: true, message: "...", user: { id, email, role } }`
  - `400 Bad Request`: `{ error: "..." }`

### `POST /api/auth/login`
- **Body**: `{ "email": "...", "password": "..." }`
- **Response**: `{ success: true, user: { id, email, role, profile | company } }`

### `POST /api/auth/logout`
- **Response**: `{ success: true, message: "Logged out successfully" }`

### `GET /api/auth/me`
- **Description**: Returns the authenticated user session and role.
- **Response**: `{ authenticated: true, user: { id, email, role, profile | company } }`

---

## 2. Profile Endpoints

### `GET /api/profile`
- **Description**: Returns current student profile data.
- **Response**: `{ profile: { id, full_name, email, skills, education, experience } }`

### `PATCH /api/profile`
- **Body**: `{ full_name, skills, education, experience }`
- **Response**: `{ success: true, profile: { ... } }`

---

## 3. Internship Endpoints

### `GET /api/internships`
- **Query Params**:
  - `search` (keyword search across title, description, company)
  - `location` (e.g., 'Remote', 'Bangalore')
  - `role_type` (e.g., 'Full-time Internship', 'Part-time')
  - `company_id` (filter by company)
- **Response**: `{ internships: [ { id, title, description, stipend, location, company: { ... } } ] }`

### `POST /api/internships`
- **Description**: Create a new internship. **Only verified companies (`is_verified: true`) can post.**
- **Body**:
  ```json
  {
    "title": "Frontend Engineering Intern",
    "description": "...",
    "requirements": "React, TypeScript, Tailwind",
    "role_type": "Full-time Internship",
    "duration": "3 Months",
    "stipend": "$800/month",
    "location": "Remote",
    "application_deadline": "2026-10-01T00:00:00.000Z"
  }
  ```
- **Responses**:
  - `201 Created`: `{ success: true, internship: { ... } }`
  - `403 Forbidden`: Unverified company or non-company role.

### `GET /api/internships/:id`
- **Response**: `{ internship: { ... } }`

### `PATCH /api/internships/:id`
- **Description**: Update internship. Only company owner or admin can perform this.
- **Response**: `{ success: true, internship: { ... } }`

### `DELETE /api/internships/:id`
- **Description**: Delete internship. Only company owner or admin can perform this.
- **Response**: `{ success: true, message: "Internship deleted successfully." }`

---

## 4. Application & AI Candidate Ranking Endpoints

### `GET /api/applications`
- **Description**:
  - When called by **Student**: Returns their applied internships with company details and status.
  - When called by **Company**: Returns applications submitted for their internships, sorted descending by `match_score` (AI Ranking).
  - When called by **Admin**: Returns all applications across the platform.
- **Response**: `{ applications: [ { id, match_score, ai_feedback, status, student, internship } ] }`

### `POST /api/applications`
- **Description**: Student applies for an internship. **Automatically calculates AI Match Score (0-100%) and generates AI feedback** in the background.
- **Body**:
  ```json
  {
    "internship_id": "uuid",
    "cover_note": "Why I'm a great fit..."
  }
  ```
- **Response**:
  - `201 Created`: `{ success: true, application: { ... }, ai_result: { score: 85, feedback: "..." } }`

### `PATCH /api/applications/:id`
- **Description**: Update application status (`applied`, `shortlisted`, `rejected`, `selected`).
- **Body**: `{ "status": "shortlisted" }`
- **Response**: `{ success: true, application: { ... } }`

---

## 5. Admin God Mode Endpoints

### `GET /api/admin/stats`
- **Description**: Global platform metrics (Total students, companies, unverified companies, internships, applications).
- **Response**: `{ stats: { totalStudents, totalCompanies, unverifiedCompanies, totalInternships, totalApplications } }`

### `GET /api/admin/companies`
- **Description**: List all registered companies with verification status & LinkedIn links.
- **Response**: `{ companies: [ ... ] }`

### `PATCH /api/admin/companies`
- **Description**: Toggle verification status of any company.
- **Body**: `{ "company_id": "uuid", "is_verified": true }`
- **Response**: `{ success: true, message: "Company has been verified.", company: { ... } }`

### `GET /api/admin/users`
- **Description**: List all registered students & admins.
- **Response**: `{ users: [ ... ] }`
