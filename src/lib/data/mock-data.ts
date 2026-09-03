import { Company, Internship, Profile, Application, NotificationItem } from '../types';

export const mockCompanies: Company[] = [
  {
    id: "comp-1",
    company_name: "Velo AI",
    email: "founders@velo.ai",
    linkedin_url: "https://linkedin.com/company/velo-ai",
    website_url: "https://velo.ai",
    about: "Velo is building autonomous AI developer agents that convert production incident logs into verified bug fixes and automated integration pull requests.",
    location: "San Francisco, CA & Remote",
    is_verified: true,
    created_at: "2026-01-15T09:00:00Z",
    logo_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80",
    industry: "Developer Tools & AI",
    company_size: "12-25 people",
    founded_year: "2024",
    mission: "To eliminate debugging toil and free engineers to focus exclusively on foundational architecture and creative product engineering.",
    team_members: [
      { name: "Elena Rostova", role: "Co-Founder & CEO", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" },
      { name: "David Chen", role: "Head of Engineering", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80" }
    ]
  },
  {
    id: "comp-2",
    company_name: "Lumina Design",
    email: "careers@luminadesign.io",
    linkedin_url: "https://linkedin.com/company/lumina-design",
    website_url: "https://luminadesign.io",
    about: "Next-generation design tool bridging vector motion graphics and web-native code generation for high-velocity startup teams.",
    location: "New York, NY & Remote",
    is_verified: true,
    created_at: "2026-01-20T11:00:00Z",
    logo_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=128&auto=format&fit=crop&q=80",
    industry: "Design Technology",
    company_size: "8-15 people",
    founded_year: "2024",
    mission: "Empowering product designers and creative technologists to produce interactive, production-ready interfaces without handoff friction.",
    team_members: [
      { name: "Siddharth Rao", role: "Founder & Creative Director", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80" }
    ]
  },
  {
    id: "comp-3",
    company_name: "Kite Robotics",
    email: "team@kiterobotics.tech",
    linkedin_url: "https://linkedin.com/company/kite-robotics",
    website_url: "https://kiterobotics.tech",
    about: "Compact autonomous micro-rovers providing last-kilometer delivery across university campuses and gated healthcare networks.",
    location: "Bangalore, India & Hybrid",
    is_verified: true,
    created_at: "2026-02-01T14:30:00Z",
    logo_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=128&auto=format&fit=crop&q=80",
    industry: "Robotics & Hardware",
    company_size: "18-35 people",
    founded_year: "2023",
    mission: "Deploying intelligent, safe, whisper-quiet micro-mobility that transforms urban logistics and reduces vehicular congestion.",
    team_members: [
      { name: "Priya Sundaram", role: "CTO & Co-Founder", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80" }
    ]
  },
  {
    id: "comp-4",
    company_name: "Pulse Health",
    email: "interns@pulsehealth.co",
    linkedin_url: "https://linkedin.com/company/pulsehealth-telemetry",
    website_url: "https://pulsehealth.co",
    about: "Preventative cardiometabolic telemetry platform analyzing continuous biosensor data with clinical-grade predictive alerts.",
    location: "Boston, MA & Remote",
    is_verified: true,
    created_at: "2026-02-10T08:15:00Z",
    logo_url: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=128&auto=format&fit=crop&q=80",
    industry: "HealthTech & Bio",
    company_size: "15-30 people",
    founded_year: "2024",
    mission: "Transforming chronic disease management from reactive emergency interventions to proactive real-time metabolic preservation.",
    team_members: [
      { name: "Marcus Vance, MD", role: "Chief Medical Officer", avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120&auto=format&fit=crop&q=80" }
    ]
  },
  {
    id: "comp-5",
    company_name: "Foundry Zero",
    email: "founders@foundryzero.dev",
    linkedin_url: "https://linkedin.com/company/foundry-zero-stealth",
    website_url: "https://foundryzero.dev",
    about: "Next-generation distributed memory cache built on Rust and io_uring with microsecond query latency.",
    location: "Austin, TX & Remote",
    is_verified: false,
    created_at: "2026-02-28T16:45:00Z",
    logo_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=128&auto=format&fit=crop&q=80",
    industry: "Cloud Infrastructure",
    company_size: "4-8 people",
    founded_year: "2025",
    mission: "Rebuilding internet storage primitives to handle high-frequency AI inference workloads with zero tail latency.",
    team_members: [
      { name: "Alex Mercer", role: "Founder", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80" }
    ]
  }
];

export const mockInternships: Internship[] = [
  {
    id: "intern-1",
    company_id: "comp-2",
    title: "Product Design Intern",
    description: "Shape the visual grammar, interaction physics, and canvas tools for Lumina's next-generation collaborative vector engine. You will work directly with our founding design team to prototype micro-interactions, refine our design system tokens, and conduct feedback sessions with early design partners.",
    requirements: "Figma mastery, strong understanding of typography and layout hierarchy, portfolio showcasing web or mobile app concepts, curiosity about interactive micro-animations.",
    role_type: "Full-time Internship",
    duration: "3 Months",
    stipend: "₹45,000 / month",
    location: "Remote",
    work_mode: "Remote",
    application_deadline: "2026-09-30",
    is_active: true,
    created_at: "2026-02-18T10:00:00Z",
    company: mockCompanies[1],
    department: "Design & Product",
    experience_level: "Student / Self-Taught",
    skills: ["Figma", "UI/UX Design", "Design Systems", "Prototyping", "User Research"],
    responsibilities: [
      "Design canvas tooling components and floating inspector palettes in Figma",
      "Prototype fluid hover and gesture transitions using Principle or Framer",
      "Collaborate directly with frontend engineers to ensure token fidelity in React",
      "Participate in weekly design critiques with our founding design team"
    ],
    what_you_learn: [
      "How to build design systems that scale from web to native canvas",
      "Modern animation curves and interaction design principles",
      "Direct exposure to early-stage venture product roadmaps and user interviews"
    ],
    applicant_count: 14,
    featured: true
  },
  {
    id: "intern-2",
    company_id: "comp-1",
    title: "Frontend Engineering Intern (Next.js & React)",
    description: "Join Velo AI's core interface team to construct real-time diff viewers, interactive agent debugging visualizers, and an ultra-responsive web dashboard. You will write high-performance TypeScript and craft keyboard-first workflows for software developers worldwide.",
    requirements: "React 18/19, Next.js App Router, TypeScript, Tailwind CSS, familiarity with WebSockets or streaming HTTP responses.",
    role_type: "Full-time Internship",
    duration: "4 Months",
    stipend: "₹55,000 / month",
    location: "Remote",
    work_mode: "Remote",
    application_deadline: "2026-10-15",
    is_active: true,
    created_at: "2026-02-20T12:00:00Z",
    company: mockCompanies[0],
    department: "Frontend Engineering",
    experience_level: "Student / Intermediate",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "WebSockets"],
    responsibilities: [
      "Implement real-time streamed AI response components with graceful fallback states",
      "Optimize complex DOM tree rendering for synthetic syntax trees and side-by-side git diffs",
      "Build modular UI components following accessible Radix / headless patterns",
      "Participate in daily engineering standups and code reviews"
    ],
    what_you_learn: [
      "Production-grade Next.js App Router architecture and server components",
      "Client-side caching and state synchronization for latency-critical tools",
      "Building products used directly by software engineers and tech leads"
    ],
    applicant_count: 26,
    featured: true
  },
  {
    id: "intern-3",
    company_id: "comp-1",
    title: "AI Systems & Evaluation Intern",
    description: "Develop automated benchmarking harnesses to quantify code synthesis accuracy, test hallucination rates, and benchmark agentic multi-file repository refactoring. You will run experiments with leading foundation models and analyze latency-vs-cost trade-offs.",
    requirements: "Python, PyTorch or HuggingFace, prompt engineering intuition, experience with git workflows and automated testing frameworks.",
    role_type: "Research Internship",
    duration: "6 Months",
    stipend: "₹65,000 / month",
    location: "Remote",
    work_mode: "Remote",
    application_deadline: "2026-10-01",
    is_active: true,
    created_at: "2026-02-22T08:45:00Z",
    company: mockCompanies[0],
    department: "AI & ML",
    experience_level: "Pre-Final / Final Year",
    skills: ["Python", "Machine Learning", "LLM Evaluation", "Git", "PyTorch"],
    responsibilities: [
      "Build deterministic grading harnesses for multi-step programming benchmarks",
      "Cluster and classify failure modes in agentic task completion trajectories",
      "Curate realistic synthetic repo test scenarios from open-source repositories"
    ],
    what_you_learn: [
      "State-of-the-art evaluation methodologies for software engineering agents",
      "Fine-tuning and steering reasoning models for high-accuracy code generation",
      "Working alongside top machine learning researchers and systems architects"
    ],
    applicant_count: 19,
    featured: false
  },
  {
    id: "intern-4",
    company_id: "comp-3",
    title: "Autonomous Navigation Software Intern",
    description: "Write sensor fusion and obstacle avoidance algorithms running on embedded Linux boards inside our physical delivery rovers. Test and deploy your code directly onto hardware fleet testbeds on campus.",
    requirements: "C++, Python, ROS2 / Robot Operating System, basic linear algebra and computer vision fundamentals.",
    role_type: "Hardware & Software Internship",
    duration: "3 Months",
    stipend: "₹40,000 / month",
    location: "Bangalore, India",
    work_mode: "Hybrid",
    application_deadline: "2026-09-25",
    is_active: true,
    created_at: "2026-02-25T15:10:00Z",
    company: mockCompanies[2],
    department: "Robotics",
    experience_level: "Student / Hardware Enthusiast",
    skills: ["C++", "Python", "ROS2", "Computer Vision", "Linux"],
    responsibilities: [
      "Implement point-cloud filtering and depth map processing for low-latency obstacle alerts",
      "Run simulation benchmarks in Gazebo before physical chassis deployments",
      "Assist in field testing and telemetry data collection across test track environments"
    ],
    what_you_learn: [
      "Real-world robotics perception and control loops on edge compute hardware",
      "Fleet diagnostics, over-the-air firmware updates, and fail-safe protocols"
    ],
    applicant_count: 8,
    featured: false
  },
  {
    id: "intern-5",
    company_id: "comp-4",
    title: "Mobile Health Experience Intern (React Native)",
    description: "Design and implement intuitive patient dashboard graphs, weekly biometric trend summaries, and interactive reminder rituals that help patients maintain healthy metabolic habits.",
    requirements: "React Native or Flutter, TypeScript, sensitivity to clean UX animations and medical data accessibility.",
    role_type: "Full-time Internship",
    duration: "4 Months",
    stipend: "₹50,000 / month",
    location: "Boston, MA & Remote",
    work_mode: "Remote",
    application_deadline: "2026-10-30",
    is_active: true,
    created_at: "2026-02-26T11:20:00Z",
    company: mockCompanies[3],
    department: "Mobile Engineering",
    experience_level: "Student / Junior",
    skills: ["React Native", "TypeScript", "Mobile UI", "Data Visualization", "REST APIs"],
    responsibilities: [
      "Build smooth, responsive chart views for heart rate variability and glucose readings",
      "Ensure offline sync and local SQLite storage for continuous patient logging",
      "Collaborate with clinicians to turn complex medical metrics into friendly summaries"
    ],
    what_you_learn: [
      "HIPAA-conscious privacy standards and secure mobile architecture",
      "Designing for diverse age groups with high accessibility requirements"
    ],
    applicant_count: 11,
    featured: false
  },
  {
    id: "intern-6",
    company_id: "comp-5",
    title: "Systems Software Intern (Rust)",
    description: "Contribute to our core storage cache engine. Implement zero-copy buffer pools and help stress-test concurrent ring buffers under high saturation.",
    requirements: "Rust, understanding of OS memory management, concurrency primitives, and asynchronous programming.",
    role_type: "Systems Internship",
    duration: "3 Months",
    stipend: "₹50,000 / month",
    location: "Austin, TX & Remote",
    work_mode: "Remote",
    application_deadline: "2026-11-15",
    is_active: true,
    created_at: "2026-02-28T18:00:00Z",
    company: mockCompanies[4],
    department: "Core Systems",
    experience_level: "Student / Systems Enthusiast",
    skills: ["Rust", "Systems Programming", "Linux", "Concurrency", "Benchmarking"],
    responsibilities: [
      "Benchmark write throughput using simulated telemetry traces",
      "Implement memory-mapped circular queues with lock-free synchronization",
      "Document internal system architecture and API boundaries"
    ],
    what_you_learn: [
      "High-performance systems engineering and kernel bypass techniques",
      "Writing safe and blazingly fast concurrent Rust libraries"
    ],
    applicant_count: 5,
    featured: false
  }
];

export const currentStudentProfile: Profile = {
  id: "student-1",
  role: "student",
  full_name: "Aarav Sharma",
  email: "aarav.sharma@campus.edu",
  skills: "React, TypeScript, Next.js, Tailwind CSS, Figma, UI/UX Design, Node.js, GraphQL, Git",
  education: "BITS Pilani — B.E. Computer Science & Design Minor (Class of 2026, GPA 8.9/10)",
  experience: "Built an open-source collaborative code review tool (300+ stars on GitHub). Frontend engineering lead for university technical festival web platform handling 25,000+ registrations. Previous UI/UX design intern at a seed-stage fintech startup.",
  created_at: "2026-01-10T10:00:00Z",
  avatar_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=240&auto=format&fit=crop&q=80",
  headline: "Aspiring Product Engineer & UI Craftsman | BITS Pilani '26",
  university: "BITS Pilani",
  degree: "B.E. Computer Science & Engineering",
  graduation_year: "2026",
  location: "Bangalore / Pilani, India",
  bio: "Passionate about the intersection of aesthetic craft and robust systems architecture. I love turning complex developer workflows into intuitive, fluid interfaces that feel delightful to use every single day.",
  portfolio_url: "https://aaravsharma.design",
  github_url: "https://github.com/aaravsharma",
  linkedin_url: "https://linkedin.com/in/aarav-sharma-dev",
  resume_text: "Summary: Full-stack & UI Product Engineer. Experienced in Next.js 15, TypeScript, React 19, Tailwind CSS, Figma design systems, and WebSockets. Projects: ReviewHub (OSS Code Review), CampusPulse (College community feed), Lumina Design Systems contributor.",
  interests: ["Design Systems", "AI Developer Tools", "Micro-Interactions", "Distributed Systems"]
};

export const otherStudentProfiles: Profile[] = [
  {
    id: "student-2",
    role: "student",
    full_name: "Meera Nair",
    email: "meera.nair@design.edu",
    skills: "Figma, Interaction Design, User Research, Design Systems, Principle, HTML/CSS",
    education: "National Institute of Design (NID) — Bachelor of Design (Class of 2026)",
    experience: "Product design intern at fintech startup; redesigned customer onboarding reducing drop-off by 18%. Created a 120-component accessible Figma design kit downloaded by 4,000+ creators.",
    created_at: "2026-01-12T11:00:00Z",
    avatar_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=240&auto=format&fit=crop&q=80",
    headline: "Product Designer & Visual Systems Specialist | NID '26",
    university: "National Institute of Design",
    degree: "B.Des in Product & Interface Design",
    graduation_year: "2026",
    location: "Mumbai, India",
    bio: "Obsessed with micro-interactions, editorial grid layouts, and human-centered design for emerging consumer and developer products.",
    portfolio_url: "https://meeranair.work",
    linkedin_url: "https://linkedin.com/in/meera-nair-design",
    interests: ["Typography", "Design Systems", "Micro-Interactions", "Creative Coding"]
  },
  {
    id: "student-3",
    role: "student",
    full_name: "Rohan Verma",
    email: "rohan.v@iiit.ac.in",
    skills: "Python, PyTorch, C++, Machine Learning, LangChain, Distributed Systems, Linux",
    education: "IIIT Hyderabad — Dual Degree B.Tech + M.S. in Computer Science (Class of 2026)",
    experience: "Undergraduate researcher in NLP lab. Published a workshop paper at ACL on efficient instruction tuning for code models. Contributed benchmarks to HuggingFace evaluation harness.",
    created_at: "2026-01-14T14:20:00Z",
    avatar_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=240&auto=format&fit=crop&q=80",
    headline: "AI Systems & Machine Learning Researcher | IIIT Hyderabad '26",
    university: "IIIT Hyderabad",
    degree: "B.Tech + M.S. in Computer Science",
    graduation_year: "2026",
    location: "Hyderabad, India",
    bio: "Focused on optimizing inference latency and evaluation reliability for autonomous software agents.",
    github_url: "https://github.com/rohanverma-ml",
    linkedin_url: "https://linkedin.com/in/rohanverma-ai",
    interests: ["LLM Inference", "Compilers", "Autonomous Agents", "Kernel Optimization"]
  },
  {
    id: "student-4",
    role: "student",
    full_name: "Ananya Patel",
    email: "ananya.patel@iitb.ac.in",
    skills: "React, WebGL, Three.js, TypeScript, Next.js, Canvas API, UI Animation",
    education: "IIT Bombay — B.Tech in Computer Science (Class of 2026)",
    experience: "Built an in-browser 3D generative art canvas viewed by 40,000 visitors. Winner of HackIITB 2025 for building real-time collaboration whiteboard.",
    created_at: "2026-01-18T16:00:00Z",
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&auto=format&fit=crop&q=80",
    headline: "Creative Technologist & Frontend Engineer | IIT Bombay '26",
    university: "IIT Bombay",
    degree: "B.Tech Computer Science",
    graduation_year: "2026",
    location: "Mumbai, India",
    bio: "Exploring high-performance interactive graphics, 3D web experiences, and seamless browser tools.",
    portfolio_url: "https://ananyapatel.me",
    github_url: "https://github.com/ananyapatel",
    linkedin_url: "https://linkedin.com/in/ananya-patel-dev",
    interests: ["Three.js", "WebAssembly", "Creative Tech", "Design Engineering"]
  }
];

export const mockApplications: Application[] = [
  {
    id: "app-1",
    internship_id: "intern-1",
    student_id: "student-1",
    cover_note: "I have followed Lumina's design system launch and would love to contribute to token architecture and canvas inspector micro-interactions. My past work focuses heavily on fluid UI and developer ergonomics.",
    match_score: 95,
    ai_feedback: "Outstanding profile synergy. Strong portfolio evidence in design system tokens, Figma prototyping, and direct collaboration with engineering teams. High cultural and technical alignment.",
    status: "shortlisted",
    created_at: "2026-02-23T14:30:00Z",
    internship: mockInternships[0],
    student: currentStudentProfile,
    stage_history: [
      { stage: "Applied", timestamp: "2026-02-23T14:30:00Z" },
      { stage: "Under Review", timestamp: "2026-02-24T09:15:00Z" },
      { stage: "Shortlisted", timestamp: "2026-02-25T16:00:00Z" }
    ]
  },
  {
    id: "app-2",
    internship_id: "intern-2",
    student_id: "student-1",
    cover_note: "Excited about Velo's developer agent vision. I have deep hands-on experience with Next.js App Router, streaming UI architectures, and writing clean, type-safe frontend components.",
    match_score: 96,
    ai_feedback: "Top tier competency match across React 19, Next.js, and TypeScript. Demonstrated track record building open-source developer tooling. Ready for immediate feature velocity.",
    status: "applied",
    created_at: "2026-02-24T18:40:00Z",
    internship: mockInternships[1],
    student: currentStudentProfile,
    stage_history: [
      { stage: "Applied", timestamp: "2026-02-24T18:40:00Z" }
    ]
  },
  {
    id: "app-3",
    internship_id: "intern-1",
    student_id: "student-2",
    cover_note: "As a product design student at NID, I have designed complete component design kits and run user studies on interaction models. I'd love to join Lumina this summer.",
    match_score: 94,
    ai_feedback: "Exceptional UI/UX foundation from premier design institute. Proven ability to architect systematic component libraries. Direct match with Lumina's core requirements.",
    status: "shortlisted",
    created_at: "2026-02-21T10:15:00Z",
    internship: mockInternships[0],
    student: otherStudentProfiles[0],
    stage_history: [
      { stage: "Applied", timestamp: "2026-02-21T10:15:00Z" },
      { stage: "Shortlisted", timestamp: "2026-02-23T11:00:00Z" }
    ]
  },
  {
    id: "app-4",
    internship_id: "intern-3",
    student_id: "student-3",
    cover_note: "Published research on LLM evaluation and instruction tuning. Deeply interested in benchmarking coding agent capabilities on synthetic repositories.",
    match_score: 93,
    ai_feedback: "Rare combination of academic rigor in code synthesis evaluation and practical PyTorch implementation skills. Ideal candidate for the AI Systems research team.",
    status: "selected",
    created_at: "2026-02-22T19:00:00Z",
    internship: mockInternships[2],
    student: otherStudentProfiles[1],
    stage_history: [
      { stage: "Applied", timestamp: "2026-02-22T19:00:00Z" },
      { stage: "Shortlisted", timestamp: "2026-02-24T10:00:00Z" },
      { stage: "Selected", timestamp: "2026-02-26T17:30:00Z" }
    ]
  },
  {
    id: "app-5",
    internship_id: "intern-2",
    student_id: "student-4",
    cover_note: "I specialize in high-performance web applications and interactive canvas tools. I'd love to bring my WebGL and React experience to Velo's visual debuggers.",
    match_score: 89,
    ai_feedback: "Strong frontend capabilities with impressive graphics and visualization chops. Solid React and TypeScript foundations, with creative problem solving demonstrated in past projects.",
    status: "applied",
    created_at: "2026-02-25T12:00:00Z",
    internship: mockInternships[1],
    student: otherStudentProfiles[2],
    stage_history: [
      { stage: "Applied", timestamp: "2026-02-25T12:00:00Z" }
    ]
  }
];

export const mockNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    recipient_role: "student",
    recipient_id: "student-1",
    title: "Application Shortlisted! 🎉",
    message: "Lumina Design moved your application for Product Design Intern to Shortlisted status. The team will reach out for a portfolio walkthrough.",
    type: "status_change",
    read: false,
    created_at: "2026-02-25T16:00:00Z",
    action_url: "/student/applications"
  },
  {
    id: "notif-2",
    recipient_role: "student",
    recipient_id: "student-1",
    title: "AI Match Score Calculated",
    message: "Your application to Velo AI was evaluated by GRADDIn AI with a 96% Match score in frontend competencies.",
    type: "application",
    read: true,
    created_at: "2026-02-24T18:41:00Z",
    action_url: "/student/applications"
  },
  {
    id: "notif-3",
    recipient_role: "company",
    recipient_id: "comp-1",
    title: "New High-Match Candidate 🚀",
    message: "Aarav Sharma applied for Frontend Engineering Intern with a 96% AI Match Score.",
    type: "application",
    read: false,
    created_at: "2026-02-24T18:40:00Z",
    action_url: "/company/candidates"
  },
  {
    id: "notif-4",
    recipient_role: "student",
    recipient_id: "student-1",
    title: "New Startup Recommended",
    message: "Foundry Zero just posted a new Systems Software Intern opportunity matching your background in performant tooling.",
    type: "opportunity_alert",
    read: true,
    created_at: "2026-02-28T18:05:00Z",
    action_url: "/internships/intern-6"
  }
];
