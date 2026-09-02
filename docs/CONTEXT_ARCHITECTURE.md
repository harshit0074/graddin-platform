# Architecture Context

**Project Name**: GRADDIN
**Goal**: An internship platform focusing solely on internships. Companies list internships, students apply.

## Tech Stack
- **Frontend**: Next.js (App Router), React, Tailwind CSS, shadcn/ui.
- **Backend/Storage**: Supabase (PostgreSQL, Auth, Edge Functions).
- **Hosting**: Vercel.

## Design Philosophy
- **Separation of Concerns**: The frontend and backend must remain completely decoupled. The frontend uses standard API contracts (`/api/*` routes or Supabase clients directly for standard operations).
- **Security**: Robust Row Level Security (RLS) on Supabase.
- **Scalability**: Minimal file storage to stay on free tiers (e.g. no resume or company doc uploads, rely on text/links).

## AI Strategy
- **Agent Handoffs**: These `CONTEXT_*.md` files serve as the ground truth. Any new AI coding agent joining the project must read these files before modifying the system.
- **Candidate Ranking**: We use Supabase Edge Functions with an LLM (Gemini/OpenAI) to automatically evaluate student profiles against internship requirements.
