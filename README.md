# SkillXpress - AI-Assisted Micro-Internship Platform

## Quick Start

1. Install dependencies:
\`\`\`bash
pnpm install
\`\`\`

2. Run development server:
\`\`\`bash
pnpm dev
\`\`\`

**No external database or secrets required. All data is mock and resets on reload.**

## Demo Access

Use any email/password combination or click the quick demo buttons:

- **Student Demo**: student@demo.com / password
- **Company Demo**: company@demo.com / password  
- **PM Demo**: pm@demo.com / password
- **Admin Demo**: admin@demo.com / password

## Features

- Role-based access control (Student, Company, PM, Admin)
- AI-powered project matching with mock scores
- Complete micro-internship workflow with milestones
- Fake certificate generation with SVG badges
- Admin analytics dashboard with in-memory data
- Fully functional prototype without external dependencies

## Architecture

This is a self-contained Next.js prototype that uses:
- In-memory data stores (no database required)
- Mock authentication (no NextAuth setup needed)
- Fake certificate generation
- Sample seed data loaded on startup

Perfect for demos and development without infrastructure setup.
