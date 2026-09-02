# Database Schema & RLS Context

This file details the Supabase tables, relationships, and Row Level Security policies.

## Tables

### 1. `profiles`
- `id` (uuid, references auth.users)
- `role` (enum: 'student', 'admin')
- `full_name` (text)
- `email` (text)
- `skills` (text)
- `education` (text)
- `experience` (text)
- `created_at` (timestamp)

### 2. `companies`
- `id` (uuid, references auth.users)
- `company_name` (text)
- `email` (text)
- `linkedin_url` (text)
- `website_url` (text)
- `about` (text)
- `location` (text)
- `is_verified` (boolean, default: false)
- `created_at` (timestamp)

### 3. `internships`
- `id` (uuid)
- `company_id` (uuid, references companies.id)
- `title` (text)
- `description` (text)
- `requirements` (text)
- `role_type` (text)
- `duration` (text)
- `stipend` (text)
- `location` (text)
- `application_deadline` (timestamp)
- `is_active` (boolean, default: true)
- `created_at` (timestamp)

### 4. `applications`
- `id` (uuid)
- `internship_id` (uuid, references internships.id)
- `student_id` (uuid, references profiles.id)
- `cover_note` (text)
- `match_score` (integer, 0-100, updated by AI)
- `ai_feedback` (text)
- `status` (text, default 'applied': 'applied', 'shortlisted', 'rejected', 'selected')
- `created_at` (timestamp)

## Row Level Security (RLS) Rules
- **Profiles**:
  - `Users can insert their own profile` (auth.uid() = id)
  - `Students can update their own profile` (auth.uid() = id)
  - `Students can view their own profile` (auth.uid() = id)
  - `Companies can view applied students` (if student applied to their internship)
  - `Admins can do everything on profiles`
- **Companies**:
  - `Companies can insert their own profile` (auth.uid() = id)
  - `Companies can update their own profile` (auth.uid() = id)
  - `Anyone can view company basic info` (public discovery)
  - `Admins can do everything on companies`
- **Internships**:
  - `Everyone can view active internships` (is_active = true)
  - `Companies can view their own internships` (auth.uid() = company_id)
  - `Verified companies can insert internships` (auth.uid() = company_id and is_verified = true)
  - `Companies can update/delete their own internships` (auth.uid() = company_id)
  - `Admins can do everything on internships`
- **Applications**:
  - `Students can view/insert their own applications` (auth.uid() = student_id)
  - `Companies can view/update applications for their internships`
  - `Admins can do everything on applications`
