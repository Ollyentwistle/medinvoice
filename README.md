# MedInvoice

**MedInvoice** is a fullstack medical billing web app designed for seamless management of patients, services, and payments with a modern and performant UI.

## Tech Stack
- **Frontend:** Next.js, TypeScript, Tailwind CSS, TanStack Query  
- **Backend:** Next.js API routes (serverless)  
- **Database:** Supabase PostgreSQL with Prisma ORM  
- **Authentication:** Supabase Auth with middleware session protection  
- **Role Management:** Custom role-based access control via Postgres and React Context  
- **AI Integration:** OpenAI LLM API for dynamic monthly summaries  
- **Background Tasks:** Inngest for scheduled monthly summary generation  

## Features
- Full CRUD operations for Patients, Services, and Payments  
- Secure user authentication and session management  
- Role-based UI rendering and access control  
- Engaging and useful dashboard insights such as most popular services, most profitable services, and outstanding payments
- AI generated summaries for dynamic insights and suggestions
- Automated background tasks to generate and store monthly summaries  
